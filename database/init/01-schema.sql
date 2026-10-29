-- 01-schema.sql
-- Tạo bảng cho LUXE Fashion Store.
-- File trong database/init được MySQL container chạy tự động theo thứ tự tên file,
-- CHỈ ở lần khởi tạo đầu tiên (volume mysql_data trống). Database được chọn sẵn là MYSQL_DATABASE.
-- Đổi cấu trúc bảng trên server đã có dữ liệu: bash scripts/seed-db.sh --reset

SET NAMES utf8mb4;

CREATE TABLE IF NOT EXISTS users (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  full_name     VARCHAR(100)  NOT NULL,
  email         VARCHAR(150)  NOT NULL UNIQUE,
  password_hash VARCHAR(255)  NOT NULL,
  phone         VARCHAR(20),
  address       VARCHAR(255),
  role          ENUM('customer', 'admin') NOT NULL DEFAULT 'customer',
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS categories (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  name        VARCHAR(100) NOT NULL,
  slug        VARCHAR(120) NOT NULL UNIQUE,
  description VARCHAR(255),
  image_url   VARCHAR(500),
  sort_order  INT NOT NULL DEFAULT 0,
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS products (
  id             INT AUTO_INCREMENT PRIMARY KEY,
  category_id    INT NOT NULL,
  name           VARCHAR(150)   NOT NULL,
  slug           VARCHAR(170)   NOT NULL UNIQUE,
  brand          VARCHAR(80),
  description    TEXT,
  highlights     JSON,
  price          DECIMAL(12, 0) NOT NULL,
  original_price DECIMAL(12, 0),
  stock          INT            NOT NULL DEFAULT 0,
  sold           INT            NOT NULL DEFAULT 0,
  sizes          VARCHAR(80),
  color          VARCHAR(80),
  material       VARCHAR(150),
  gender         ENUM('nam', 'nu', 'unisex') NOT NULL DEFAULT 'unisex',
  rating         DECIMAL(2, 1)  NOT NULL DEFAULT 0,
  review_count   INT            NOT NULL DEFAULT 0,
  is_featured    TINYINT(1)     NOT NULL DEFAULT 0,
  is_new         TINYINT(1)     NOT NULL DEFAULT 0,
  image_url      VARCHAR(500),
  images         JSON,
  created_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_products_category FOREIGN KEY (category_id) REFERENCES categories (id),
  INDEX idx_products_category (category_id),
  INDEX idx_products_price (price)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS reviews (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  product_id  INT NOT NULL,
  user_id     INT,
  author_name VARCHAR(100) NOT NULL,
  rating      TINYINT NOT NULL,
  comment     TEXT,
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_reviews_product FOREIGN KEY (product_id) REFERENCES products (id) ON DELETE CASCADE,
  CONSTRAINT fk_reviews_user    FOREIGN KEY (user_id)    REFERENCES users (id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS orders (
  id               INT AUTO_INCREMENT PRIMARY KEY,
  user_id          INT NOT NULL,
  full_name        VARCHAR(100),
  phone            VARCHAR(20),
  total_amount     DECIMAL(12, 0) NOT NULL,
  shipping_fee     DECIMAL(12, 0) NOT NULL DEFAULT 0,
  status           ENUM('pending', 'paid', 'shipping', 'completed', 'cancelled') NOT NULL DEFAULT 'pending',
  payment_method   ENUM('cod', 'bank') NOT NULL DEFAULT 'cod',
  shipping_address VARCHAR(255),
  note             VARCHAR(500),
  created_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_orders_user FOREIGN KEY (user_id) REFERENCES users (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS order_items (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  order_id   INT NOT NULL,
  product_id INT NOT NULL,
  quantity   INT NOT NULL,
  size       VARCHAR(10),
  unit_price DECIMAL(12, 0) NOT NULL,
  CONSTRAINT fk_items_order   FOREIGN KEY (order_id)   REFERENCES orders (id) ON DELETE CASCADE,
  CONSTRAINT fk_items_product FOREIGN KEY (product_id) REFERENCES products (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
