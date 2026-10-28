const router = require('express').Router();
const pool = require('../db');
const { requireAuth } = require('../auth');

const SHIPPING_FEE = 30000;
const FREE_SHIPPING_FROM = 1000000;

const badRequest = (message, status = 400) => Object.assign(new Error(message), { status, expose: true });

router.use(requireAuth);

router.get('/', async (req, res, next) => {
  try {
    const [orders] = await pool.query('SELECT * FROM orders WHERE user_id = ? ORDER BY id DESC', [req.user.id]);
    if (orders.length) {
      const [items] = await pool.query(
        `SELECT oi.*, p.name, p.slug, p.image_url
           FROM order_items oi JOIN products p ON p.id = oi.product_id
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

// Giá luôn tính lại ở server, không tin giá client gửi lên
router.post('/', async (req, res, next) => {
  const { items, full_name, phone, shipping_address, note, payment_method } = req.body || {};
  if (!Array.isArray(items) || !items.length) return res.status(400).json({ message: 'Giỏ hàng trống' });
  if (!full_name || !phone || !shipping_address) {
    return res.status(400).json({ message: 'Vui lòng nhập đủ thông tin giao hàng' });
  }

  let conn;
  try {
    conn = await pool.getConnection();
    await conn.beginTransaction();
    let subtotal = 0;
    const lines = [];
    for (const item of items) {
      const qty = parseInt(item.quantity, 10);
      if (!qty || qty < 1) throw badRequest('Số lượng không hợp lệ');
      const [[p]] = await conn.query('SELECT id, name, price, stock, sizes FROM products WHERE id = ? FOR UPDATE', [
        item.product_id,
      ]);
      if (!p) throw badRequest('Sản phẩm không tồn tại');
      if (p.sizes && !p.sizes.split(',').includes(item.size)) {
        throw badRequest(`Vui lòng chọn size hợp lệ cho ${p.name}`);
      }
      if (p.stock < qty) throw badRequest(`${p.name} chỉ còn ${p.stock} sản phẩm`, 409);
      subtotal += p.price * qty;
      lines.push({ p, qty, size: p.sizes ? item.size : null });
    }
    const shipping = subtotal >= FREE_SHIPPING_FROM ? 0 : SHIPPING_FEE;

    const [result] = await conn.query(
      `INSERT INTO orders (user_id, full_name, phone, total_amount, shipping_fee, shipping_address, note, payment_method)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        req.user.id,
        full_name,
        phone,
        subtotal + shipping,
        shipping,
        shipping_address,
        note || null,
        payment_method === 'bank' ? 'bank' : 'cod',
      ]
    );
    for (const { p, qty, size } of lines) {
      await conn.query(
        'INSERT INTO order_items (order_id, product_id, quantity, size, unit_price) VALUES (?, ?, ?, ?, ?)',
        [result.insertId, p.id, qty, size, p.price]
      );
      await conn.query('UPDATE products SET stock = stock - ?, sold = sold + ? WHERE id = ?', [qty, qty, p.id]);
    }
    await conn.commit();
    res.status(201).json({ order: { id: result.insertId, total_amount: subtotal + shipping, shipping_fee: shipping } });
  } catch (err) {
    if (conn) await conn.rollback();
    next(err);
  } finally {
    if (conn) conn.release();
  }
});

module.exports = router;
