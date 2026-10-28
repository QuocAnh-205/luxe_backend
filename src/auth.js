const jwt = require('jsonwebtoken');

const SECRET = process.env.JWT_SECRET || 'dev-only-secret';
if (!process.env.JWT_SECRET) {
  console.warn('[auth] JWT_SECRET chưa được đặt, đang dùng secret mặc định (chỉ dùng khi dev)');
}

function signToken(user) {
  return jwt.sign({ id: user.id, role: user.role }, SECRET, { expiresIn: '7d' });
}

// Token ngắn hạn chỉ dùng để đặt lại mật khẩu sau khi đã xác thực OTP
function signResetToken(resetId, userId) {
  return jwt.sign({ purpose: 'reset', rid: resetId, uid: userId }, SECRET, { expiresIn: '15m' });
}

function verifyResetToken(token) {
  const payload = jwt.verify(token, SECRET);
  if (payload.purpose !== 'reset') throw new Error('wrong purpose');
  return payload;
}

function requireAuth(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return res.status(401).json({ message: 'Vui lòng đăng nhập' });
  try {
    req.user = jwt.verify(token, SECRET);
    if (req.user.purpose) throw new Error('not a session token');
    next();
  } catch {
    res.status(401).json({ message: 'Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại' });
  }
}

module.exports = { SECRET, signToken, signResetToken, verifyResetToken, requireAuth };
