const router = require('express').Router();
const pool = require('../db');
const { requireAuth } = require('../auth');

const ORDER_STATUSES = ['pending', 'paid', 'shipping', 'completed', 'cancelled'];
const GENDERS = ['nam', 'nu', 'unisex'];

// Kiểm tra quyền từ DB (không tin role trong token, vì có thể đã bị đổi sau khi đăng nhập)
router.use(requireAuth, async (req, res, next) => {
  try {
    const [[user]] = await pool.query('SELECT role FROM users WHERE id = ?', [req.user.id]);
    if (user?.role !== 'admin') return res.status(403).json({ message: 'Chỉ quản trị viên mới truy cập được' });
    next();
  } catch (err) {
    next(err);
  }
});

router.get('/stats', async (req, res, next) => {
  try {
    const [[totals]] = await pool.query(
      `SELECT
         (SELECT COALESCE(SUM(total_amount), 0) FROM orders WHERE status <> 'cancelled') AS revenue,
         (SELECT COUNT(*) FROM orders) AS orders,
         (SELECT COUNT(*) FROM orders WHERE status = 'pending') AS pending_orders,
         (SELECT COUNT(*) FROM products) AS products,
         (SELECT COUNT(*) FROM users WHERE role = 'customer') AS customers`
    );
    const [byCategory] = await pool.query(
      `SELECT c.name, COUNT(p.id) AS products, COALESCE(SUM(p.sold), 0) AS sold, COALESCE(SUM(p.stock), 0) AS stock
         FROM categories c LEFT JOIN products p ON p.category_id = c.id
        GROUP BY c.id ORDER BY sold DESC`
    );
    const [lowStock] = await pool.query(
      'SELECT id, name, slug, stock, image_url FROM products WHERE stock <= 10 ORDER BY stock ASC LIMIT 6'
    );
    const [recentOrders] = await pool.query(
      `SELECT o.id, o.full_name, o.total_amount, o.status, o.created_at, u.email
         FROM orders o JOIN users u ON u.id = o.user_id ORDER BY o.id DESC LIMIT 6`
    );
    res.json({ totals, byCategory, lowStock, recentOrders });
  } catch (err) {
    next(err);
  }
});

// ---------- Đơn hàng ----------
router.get('/orders', async (req, res, next) => {
  try {
    const [orders] = await pool.query(
      `SELECT o.*, u.email FROM orders o JOIN users u ON u.id = o.user_id ORDER BY o.id DESC LIMIT 200`
    );
    if (orders.length) {
      const [items] = await pool.query(
        `SELECT oi.*, p.name, p.image_url FROM order_items oi JOIN products p ON p.id = oi.product_id
          WHERE oi.order_id IN (?)`,
        [orders.map((o) => o.id)]
      );
      orders.forEach((o) => {
        o.items = items.filter((i) => i.order_id === o.id);
      });
    }
    res.json({ orders });
  } catch (err) {
    next(err);
  }
});

router.patch('/orders/:id', async (req, res, next) => {
  const { status } = req.body || {};
  if (!ORDER_STATUSES.includes(status)) return res.status(400).json({ message: 'Trạng thái không hợp lệ' });
  let conn;
  try {
    conn = await pool.getConnection();
    await conn.beginTransaction();
    const [[order]] = await conn.query('SELECT id, status FROM orders WHERE id = ? FOR UPDATE', [req.params.id]);
    if (!order) {
      await conn.rollback();
      return res.status(404).json({ message: 'Không tìm thấy đơn hàng' });
    }
    // Huỷ đơn => trả hàng về kho; mở lại đơn đã huỷ => trừ kho lại
    if (status !== order.status && (status === 'cancelled' || order.status === 'cancelled')) {
      const sign = status === 'cancelled' ? 1 : -1;
      await conn.query(
        `UPDATE products p JOIN order_items oi ON oi.product_id = p.id
            SET p.stock = p.stock + ? * oi.quantity, p.sold = GREATEST(p.sold - ? * oi.quantity, 0)
          WHERE oi.order_id = ?`,
        [sign, sign, order.id]
      );
    }
    await conn.query('UPDATE orders SET status = ? WHERE id = ?', [status, order.id]);
    await conn.commit();
    res.json({ id: order.id, status });
  } catch (err) {
    if (conn) await conn.rollback();
    next(err);
  } finally {
    if (conn) conn.release();
  }
});

// ---------- Sản phẩm ----------
function productFields(body) {
  const b = body || {};
  if (!b.name || !b.slug || !b.category_id || b.price == null) {
    throw Object.assign(new Error('Cần nhập tên, slug, danh mục và giá'), { status: 400, expose: true });
  }
  if (!/^[a-z0-9-]+$/.test(b.slug)) {
    throw Object.assign(new Error('Slug chỉ gồm chữ thường không dấu, số và dấu gạch ngang'), { status: 400, expose: true });
  }
  const images = Array.isArray(b.images) ? b.images.filter(Boolean) : b.image_url ? [b.image_url] : [];
  const highlights = Array.isArray(b.highlights) ? b.highlights.filter(Boolean) : [];
  return {
    category_id: Number(b.category_id),
    name: String(b.name).trim(),
    slug: b.slug,
    brand: b.brand || 'LUXE',
    description: b.description || null,
    highlights: JSON.stringify(highlights),
    price: Math.max(0, Number(b.price)),
    original_price: b.original_price ? Number(b.original_price) : null,
    stock: Math.max(0, parseInt(b.stock, 10) || 0),
    sizes: Array.isArray(b.sizes) ? b.sizes.join(',') || null : b.sizes || null,
    color: b.color || null,
    material: b.material || null,
    gender: GENDERS.includes(b.gender) ? b.gender : 'unisex',
    is_featured: b.is_featured ? 1 : 0,
    is_new: b.is_new ? 1 : 0,
    image_url: images[0] || null,
    images: JSON.stringify(images),
  };
}

const duplicateSlug = (err) => err.code === 'ER_DUP_ENTRY' && Object.assign(err, { status: 409, expose: true, message: 'Slug đã tồn tại' });

router.post('/products', async (req, res, next) => {
  try {
    const fields = productFields(req.body);
    const [result] = await pool.query('INSERT INTO products SET ?', [fields]);
    res.status(201).json({ id: result.insertId });
  } catch (err) {
    duplicateSlug(err);
    next(err);
  }
});

router.put('/products/:id', async (req, res, next) => {
  try {
    const fields = productFields(req.body);
    const [result] = await pool.query('UPDATE products SET ? WHERE id = ?', [fields, req.params.id]);
    if (!result.affectedRows) return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
    res.json({ id: Number(req.params.id) });
  } catch (err) {
    duplicateSlug(err);
    next(err);
  }
});

router.delete('/products/:id', async (req, res, next) => {
  try {
    const [[used]] = await pool.query('SELECT COUNT(*) AS n FROM order_items WHERE product_id = ?', [req.params.id]);
    if (used.n) {
      return res.status(409).json({ message: 'Sản phẩm đã có trong đơn hàng, hãy đặt tồn kho = 0 thay vì xoá' });
    }
    const [result] = await pool.query('DELETE FROM products WHERE id = ?', [req.params.id]);
    if (!result.affectedRows) return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
    res.status(204).end();
  } catch (err) {
    next(err);
  }
});

// ---------- Người dùng ----------
router.get('/users', async (req, res, next) => {
  try {
    const [users] = await pool.query(
      `SELECT u.id, u.full_name, u.email, u.phone, u.role, u.created_at,
              COUNT(o.id) AS order_count,
              COALESCE(SUM(CASE WHEN o.status <> 'cancelled' THEN o.total_amount END), 0) AS total_spent
         FROM users u LEFT JOIN orders o ON o.user_id = u.id
        GROUP BY u.id ORDER BY u.id DESC`
    );
    res.json({ users });
  } catch (err) {
    next(err);
  }
});

router.patch('/users/:id', async (req, res, next) => {
  try {
    const { role } = req.body || {};
    if (!['customer', 'admin'].includes(role)) return res.status(400).json({ message: 'Quyền không hợp lệ' });
    if (Number(req.params.id) === req.user.id) {
      return res.status(400).json({ message: 'Không thể tự đổi quyền của chính mình' });
    }
    const [result] = await pool.query('UPDATE users SET role = ? WHERE id = ?', [role, req.params.id]);
    if (!result.affectedRows) return res.status(404).json({ message: 'Không tìm thấy người dùng' });
    res.json({ id: Number(req.params.id), role });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
