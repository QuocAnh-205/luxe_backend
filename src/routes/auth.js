const router = require('express').Router();
const bcrypt = require('bcryptjs');
const pool = require('../db');
const { signToken, requireAuth } = require('../auth');

const publicUser = (u) => ({
  id: u.id,
  full_name: u.full_name,
  email: u.email,
  phone: u.phone,
  address: u.address,
  role: u.role,
});

router.post('/register', async (req, res, next) => {
  try {
    const { full_name, email, password, phone } = req.body || {};
    if (!full_name || !email || !password) {
      return res.status(400).json({ message: 'Vui lòng nhập đủ họ tên, email và mật khẩu' });
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) return res.status(400).json({ message: 'Email không hợp lệ' });
    if (String(password).length < 6) return res.status(400).json({ message: 'Mật khẩu tối thiểu 6 ký tự' });

    const normalizedEmail = String(email).trim().toLowerCase();
    const [exists] = await pool.query('SELECT id FROM users WHERE email = ?', [normalizedEmail]);
    if (exists.length) return res.status(409).json({ message: 'Email đã được sử dụng' });

    const hash = await bcrypt.hash(String(password), 10);
    const [result] = await pool.query(
      'INSERT INTO users (full_name, email, password_hash, phone) VALUES (?, ?, ?, ?)',
      [String(full_name).trim(), normalizedEmail, hash, phone || null]
    );
    const [[user]] = await pool.query('SELECT * FROM users WHERE id = ?', [result.insertId]);
    res.status(201).json({ token: signToken(user), user: publicUser(user) });
  } catch (err) {
    next(err);
  }
});

router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) return res.status(400).json({ message: 'Vui lòng nhập email và mật khẩu' });
    const [[user]] = await pool.query('SELECT * FROM users WHERE email = ?', [String(email).trim().toLowerCase()]);
    if (!user || !(await bcrypt.compare(String(password), user.password_hash))) {
      return res.status(401).json({ message: 'Email hoặc mật khẩu không đúng' });
    }
    res.json({ token: signToken(user), user: publicUser(user) });
  } catch (err) {
    next(err);
  }
});

router.get('/me', requireAuth, async (req, res, next) => {
  try {
    const [[user]] = await pool.query('SELECT * FROM users WHERE id = ?', [req.user.id]);
    if (!user) return res.status(404).json({ message: 'Tài khoản không tồn tại' });
    res.json({ user: publicUser(user) });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
