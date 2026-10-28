const router = require('express').Router();
const pool = require('../db');

router.get('/', async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      `SELECT c.id, c.name, c.slug, c.description, c.image_url,
              COUNT(p.id) AS product_count
         FROM categories c
         LEFT JOIN products p ON p.category_id = c.id
        GROUP BY c.id
        ORDER BY c.sort_order, c.id`
    );
    res.json({ categories: rows });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
