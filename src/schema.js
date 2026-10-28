const pool = require('./db');

// Bảng thêm sau khi đã có dữ liệu: database/init chỉ chạy ở lần khởi tạo volume đầu tiên,
// nên tạo bổ sung lúc backend khởi động (IF NOT EXISTS => chạy lại an toàn).
const MIGRATIONS = [
  `CREATE TABLE IF NOT EXISTS password_resets (
     id          INT AUTO_INCREMENT PRIMARY KEY,
     user_id     INT NOT NULL,
     otp_hash    CHAR(64) NOT NULL,
     attempts    TINYINT NOT NULL DEFAULT 0,
     verified_at DATETIME NULL,
     consumed_at DATETIME NULL,
     expires_at  DATETIME NOT NULL,
     created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
     CONSTRAINT fk_resets_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
     INDEX idx_resets_user (user_id, created_at)
   ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,
];

async function ensureSchema() {
  for (const sql of MIGRATIONS) await pool.query(sql);
}

module.exports = { ensureSchema };
