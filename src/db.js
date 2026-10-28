const mysql = require('mysql2/promise');

// docker-compose truyền DB_HOST=mysql (tên service); chạy ngoài Docker thì mặc định 127.0.0.1
const pool = mysql.createPool({
  host: process.env.DB_HOST || '127.0.0.1',
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USERNAME || 'luxe_user',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'luxe_fashion',
  charset: 'utf8mb4',
  waitForConnections: true,
  connectionLimit: 10,
  decimalNumbers: true,
  timezone: '+07:00',
});

module.exports = pool;
