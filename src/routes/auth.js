const router = require('express').Router();
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const pool = require('../db');
const { SECRET, signToken, signResetToken, verifyResetToken, requireAuth } = require('../auth');
const { sendOtpEmail, isConfigured } = require('../mailer');

const OTP_MINUTES = 10;
const OTP_MAX_ATTEMPTS = 5;
const OTP_RESEND_SECONDS = 60;
const OTP_MAX_PER_HOUR = 5;
// Chỉ bật khi dev/test chưa có dịch vụ gửi mail: trả mã OTP trong response. KHÔNG bật trên production.
const OTP_DEBUG = process.env.OTP_DEBUG === 'true';

const hashOtp = (resetUserId, otp) => crypto.createHmac('sha256', SECRET).update(`${resetUserId}:${otp}`).digest('hex');
const sameHash = (a, b) => a.length === b.length && crypto.timingSafeEqual(Buffer.from(a), Buffer.from(b));
const normalizeEmail = (email) => String(email || '').trim().toLowerCase();
const GENERIC_SENT = 'Nếu email đã đăng ký, mã OTP đã được gửi. Vui lòng kiểm tra hộp thư (cả mục Spam).';

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

// ---------- Quên mật khẩu: 1) gửi OTP -> 2) xác thực OTP -> 3) đặt mật khẩu mới ----------

// Luôn trả cùng một thông báo dù email có tồn tại hay không (tránh dò email đã đăng ký)
router.post('/forgot-password', async (req, res, next) => {
  try {
    const email = normalizeEmail(req.body?.email);
    if (!/^\S+@\S+\.\S+$/.test(email)) return res.status(400).json({ message: 'Email không hợp lệ' });

    const [[user]] = await pool.query('SELECT id, full_name FROM users WHERE email = ?', [email]);
    if (!user) return res.json({ message: GENERIC_SENT, resend_after: OTP_RESEND_SECONDS });

    const [[recent]] = await pool.query(
      `SELECT COUNT(*) AS n,
              MAX(TIMESTAMPDIFF(SECOND, created_at, NOW()) < ?) AS too_soon,
              ? - MIN(TIMESTAMPDIFF(SECOND, created_at, NOW())) AS wait
         FROM password_resets WHERE user_id = ? AND created_at > NOW() - INTERVAL 1 HOUR`,
      [OTP_RESEND_SECONDS, OTP_RESEND_SECONDS, user.id]
    );
    if (recent.too_soon) {
      return res.status(429).json({ message: `Vui lòng đợi ${recent.wait} giây trước khi gửi lại mã`, resend_after: recent.wait });
    }
    if (recent.n >= OTP_MAX_PER_HOUR) {
      return res.status(429).json({ message: 'Bạn đã yêu cầu quá nhiều lần, vui lòng thử lại sau 1 giờ' });
    }

    const otp = String(crypto.randomInt(0, 1000000)).padStart(6, '0');
    // Mã cũ chưa dùng sẽ hết hiệu lực khi có mã mới
    await pool.query('UPDATE password_resets SET expires_at = NOW() WHERE user_id = ? AND consumed_at IS NULL', [user.id]);
    await pool.query(
      'INSERT INTO password_resets (user_id, otp_hash, expires_at) VALUES (?, ?, NOW() + INTERVAL ? MINUTE)',
      [user.id, hashOtp(user.id, otp), OTP_MINUTES]
    );
    await sendOtpEmail(email, { name: user.full_name, otp, minutes: OTP_MINUTES });

    res.json({
      message: GENERIC_SENT,
      resend_after: OTP_RESEND_SECONDS,
      ...(OTP_DEBUG && !isConfigured() ? { debug_otp: otp } : {}),
    });
  } catch (err) {
    next(err);
  }
});

router.post('/verify-otp', async (req, res, next) => {
  try {
    const email = normalizeEmail(req.body?.email);
    const otp = String(req.body?.otp || '').trim();
    if (!/^\d{6}$/.test(otp)) return res.status(400).json({ message: 'Mã OTP gồm 6 chữ số' });

    const [[row]] = await pool.query(
      `SELECT r.id, r.user_id, r.otp_hash, r.attempts, r.expires_at > NOW() AS alive
         FROM password_resets r JOIN users u ON u.id = r.user_id
        WHERE u.email = ? AND r.consumed_at IS NULL
        ORDER BY r.id DESC LIMIT 1`,
      [email]
    );
    if (!row || !row.alive) return res.status(400).json({ message: 'Mã OTP đã hết hạn, vui lòng gửi lại mã mới' });
    if (row.attempts >= OTP_MAX_ATTEMPTS) {
      return res.status(429).json({ message: 'Bạn đã nhập sai quá nhiều lần, vui lòng gửi lại mã mới' });
    }
    if (!sameHash(row.otp_hash, hashOtp(row.user_id, otp))) {
      await pool.query('UPDATE password_resets SET attempts = attempts + 1 WHERE id = ?', [row.id]);
      const left = OTP_MAX_ATTEMPTS - row.attempts - 1;
      return res.status(400).json({
        message: left > 0 ? `Mã OTP không đúng, còn ${left} lần thử` : 'Mã OTP không đúng. Bạn đã hết lượt thử, vui lòng gửi lại mã mới',
      });
    }
    await pool.query('UPDATE password_resets SET verified_at = NOW() WHERE id = ?', [row.id]);
    res.json({ reset_token: signResetToken(row.id, row.user_id) });
  } catch (err) {
    next(err);
  }
});

router.post('/reset-password', async (req, res, next) => {
  try {
    const { reset_token, password } = req.body || {};
    if (!password || String(password).length < 6) return res.status(400).json({ message: 'Mật khẩu tối thiểu 6 ký tự' });
    let payload;
    try {
      payload = verifyResetToken(reset_token);
    } catch {
      return res.status(400).json({ message: 'Phiên đặt lại mật khẩu đã hết hạn, vui lòng làm lại từ đầu' });
    }
    // consumed_at IS NULL trong điều kiện UPDATE => mỗi lần xác thực OTP chỉ đổi mật khẩu được 1 lần
    const [result] = await pool.query(
      `UPDATE password_resets SET consumed_at = NOW()
        WHERE id = ? AND user_id = ? AND verified_at IS NOT NULL AND consumed_at IS NULL`,
      [payload.rid, payload.uid]
    );
    if (!result.affectedRows) return res.status(400).json({ message: 'Liên kết đặt lại mật khẩu đã được sử dụng' });

    await pool.query('UPDATE users SET password_hash = ? WHERE id = ?', [await bcrypt.hash(String(password), 10), payload.uid]);
    const [[user]] = await pool.query('SELECT * FROM users WHERE id = ?', [payload.uid]);
    res.json({ message: 'Đặt lại mật khẩu thành công', token: signToken(user), user: publicUser(user) });
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
