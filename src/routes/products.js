const router = require('express').Router();
const pool = require('../db');

const SORTS = {
  newest: 'p.is_new DESC, p.id DESC',
  popular: 'p.sold DESC',
  rating: 'p.rating DESC, p.review_count DESC',
  price_asc: 'p.price ASC',
  price_desc: 'p.price DESC',
};

const BASE_SELECT = `
  SELECT p.id, p.name, p.slug, p.brand, p.price, p.original_price, p.stock, p.sizes, p.color,
         p.material, p.gender, p.rating, p.review_count, p.sold, p.is_featured, p.is_new,
         p.image_url, p.images, c.name AS category_name, c.slug AS category_slug
    FROM products p
    JOIN categories c ON c.id = p.category_id`;

function parseJson(value, fallback) {
  if (value == null) return fallback;
  if (typeof value !== 'string') return value;
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}

function normalize(p) {
  return {
    ...p,
    is_featured: !!p.is_featured,
    is_new: !!p.is_new,
    sizes: p.sizes ? p.sizes.split(',') : [],
    images: parseJson(p.images, p.image_url ? [p.image_url] : []),
    highlights: parseJson(p.highlights, undefined),
  };
}

// GET /api/products?category=&q=&gender=&min=&max=&featured=1&new=1&sale=1&sort=&page=&limit=
router.get('/', async (req, res, next) => {
  try {
    const { category, q, gender, min, max, featured, sort } = req.query;
    const where = [];
    const params = [];

    if (category) {
      where.push('c.slug = ?');
      params.push(category);
    }
    if (gender) {
      where.push("(p.gender = ? OR p.gender = 'unisex')");
      params.push(gender);
    }
    if (q) {
      const like = `%${q}%`;
      where.push('(p.name LIKE ? OR p.description LIKE ? OR p.color LIKE ? OR c.name LIKE ?)');
      params.push(like, like, like, like);
    }
    if (min) {
      where.push('p.price >= ?');
      params.push(Number(min));
    }
    if (max) {
      where.push('p.price <= ?');
      params.push(Number(max));
    }
    if (featured) where.push('p.is_featured = 1');
    if (req.query.new) where.push('p.is_new = 1');
    if (req.query.sale) where.push('p.original_price > p.price');

    const whereSql = where.length ? `WHERE ${where.join(' AND ')}` : '';
    const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 12, 1), 200);
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const orderBy = SORTS[sort] || 'p.is_featured DESC, p.id ASC';

    const [[{ total }]] = await pool.query(
      `SELECT COUNT(*) AS total FROM products p JOIN categories c ON c.id = p.category_id ${whereSql}`,
      params
    );
    const [rows] = await pool.query(`${BASE_SELECT} ${whereSql} ORDER BY ${orderBy} LIMIT ? OFFSET ?`, [
      ...params,
      limit,
      (page - 1) * limit,
    ]);

    res.json({ items: rows.map(normalize), total, page, pages: Math.max(Math.ceil(total / limit), 1) });
  } catch (err) {
    next(err);
  }
});

router.get('/:slug', async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      `SELECT p.*, c.name AS category_name, c.slug AS category_slug
         FROM products p JOIN categories c ON c.id = p.category_id
        WHERE p.slug = ?`,
      [req.params.slug]
    );
    if (!rows.length) return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
    const product = normalize(rows[0]);

    const [reviews] = await pool.query(
      'SELECT id, author_name, rating, comment, created_at FROM reviews WHERE product_id = ? ORDER BY created_at DESC',
      [product.id]
    );
    const [related] = await pool.query(
      `${BASE_SELECT} WHERE p.category_id = ? AND p.id <> ? ORDER BY p.is_featured DESC, p.sold DESC LIMIT 4`,
      [product.category_id, product.id]
    );

    res.json({ product, reviews, related: related.map(normalize) });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
