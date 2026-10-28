const express = require('express');
const cors = require('cors');
const pool = require('./db');

const app = express();
const PORT = process.env.PORT || 5000;

app.set('trust proxy', 1);
app.use(cors());
app.use(express.json({ limit: '1mb' }));

app.get('/api/health', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ status: 'ok', db: 'up', time: new Date().toISOString() });
  } catch (err) {
    res.status(503).json({ status: 'error', db: 'down', message: err.message });
  }
});

app.use('/api/categories', require('./routes/categories'));
app.use('/api/products', require('./routes/products'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/admin', require('./routes/admin'));

app.use('/api', (req, res) => res.status(404).json({ message: 'Không tìm thấy API' }));

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  if (!err.expose) console.error(err);
  res.status(err.status || 500).json({ message: err.expose ? err.message : 'Lỗi máy chủ, vui lòng thử lại' });
});

app.listen(PORT, () => console.log(`LUXE API đang chạy ở cổng ${PORT}`));
