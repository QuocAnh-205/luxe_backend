const app = require('./app');

const PORT = process.env.PORT || 5000;

require('./schema')
  .ensureSchema()
  .catch((err) => console.error('[schema] Không tạo được bảng bổ sung:', err.message))
  .finally(() => app.listen(PORT, () => console.log(`LUXE API đang chạy ở cổng ${PORT}`)));
