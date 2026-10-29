// Sinh database/init/02-seed.sql từ catalog.js
//   cd backend && npm install && cd .. && node database/seed/generate.js
const fs = require('fs');
const path = require('path');
const bcrypt = require(path.join(__dirname, '../../node_modules/bcryptjs'));
const { categories, products } = require('./catalog');

const OUT = path.join(__dirname, '../init/02-seed.sql');
const IMG = '/images/products';

const esc = (v) => {
  if (v === null || v === undefined) return 'NULL';
  if (typeof v === 'number') return String(v);
  if (typeof v === 'boolean') return v ? '1' : '0';
  return `'${String(v).replace(/\\/g, '\\\\').replace(/'/g, "''")}'`;
};

// PRNG cố định để sinh lại file luôn ra cùng kết quả
let seed = 20261029;
const rand = () => {
  seed = (seed * 1103515245 + 12345) % 2147483648;
  return seed / 2147483648;
};
const pick = (arr) => arr[Math.floor(rand() * arr.length)];

const reviewers = [
  'Nguyễn Minh Anh', 'Trần Thu Hà', 'Lê Quốc Bảo', 'Phạm Ngọc Lan', 'Hoàng Gia Huy', 'Võ Thanh Trúc',
  'Đặng Khánh Linh', 'Bùi Đức Thịnh', 'Đỗ Mai Phương', 'Huỳnh Tấn Phát', 'Ngô Bảo Châu', 'Dương Thảo Vy',
  'Lý Hoàng Nam', 'Phan Yến Nhi', 'Vũ Hải Đăng', 'Trịnh Kim Ngân',
];
const comments = {
  5: [
    'Sản phẩm y hệt hình, chất lượng hoàn thiện rất tốt. Sẽ ủng hộ shop dài dài!',
    'Đóng gói cẩn thận, giao nhanh. Màu ngoài thực tế còn đẹp hơn ảnh.',
    'Rất đáng tiền, mặc/đeo lên ai cũng khen.',
    'Lần thứ hai mua ở LUXE, vẫn hài lòng như lần đầu.',
    'Form chuẩn, chất liệu sờ rất thích tay. 10 điểm!',
  ],
  4: [
    'Sản phẩm đẹp, đúng mô tả. Giao hàng hơi chậm một chút.',
    'Chất lượng tốt so với giá, màu hơi đậm hơn ảnh một xíu.',
    'Hài lòng, chỉ mong shop có thêm nhiều màu hơn.',
    'Đẹp và tinh tế, tư vấn size nhiệt tình.',
  ],
  3: ['Ổn trong tầm giá, nhưng mình nghĩ có thể hoàn thiện kỹ hơn.', 'Tạm được, size hơi rộng so với mình.'],
};

const sql = [];
sql.push(`-- 02-seed.sql — FILE TỰ SINH bởi database/seed/generate.js, đừng sửa tay.
-- Dữ liệu mẫu LUXE: ${categories.length} danh mục, ${products.length} sản phẩm, đánh giá và 2 tài khoản demo.
-- Chạy lại nhiều lần an toàn (UPSERT theo id), dùng: bash scripts/seed-db.sh
--   Admin: admin@luxe.vn / Admin@123
--   Khách: demo@luxe.vn  / Demo@123

SET NAMES utf8mb4;
`);

// ---------- Users ----------
const users = [
  [1, 'Quản trị LUXE', 'admin@luxe.vn', 'Admin@123', '0901000001', '12 Nguyễn Huệ, Quận 1, TP.HCM', 'admin'],
  [2, 'Khách hàng Demo', 'demo@luxe.vn', 'Demo@123', '0901000002', '45 Lê Duẩn, Hải Châu, Đà Nẵng', 'customer'],
];
// Khoá theo email (không theo id) để không đè lên tài khoản thật khi seed lại trên server đã có dữ liệu
sql.push('INSERT INTO users (full_name, email, password_hash, phone, address, role) VALUES');
sql.push(
  users
    .map(([id, name, email, pw, phone, addr, role]) =>
      `  (${[name, email, bcrypt.hashSync(pw, 10), phone, addr, role].map(esc).join(', ')})`)
    .join(',\n') + '\nON DUPLICATE KEY UPDATE full_name = VALUES(full_name), role = VALUES(role);\n'
);

// ---------- Categories ----------
const catId = {};
sql.push('INSERT INTO categories (id, name, slug, description, image_url, sort_order) VALUES');
sql.push(
  categories
    .map((c, i) => {
      catId[c.slug] = i + 1;
      const cover = products.find((p) => p.category === c.slug);
      return `  (${[i + 1, c.name, c.slug, c.description, `${IMG}/${cover.slug}-1.webp`, i + 1].map(esc).join(', ')})`;
    })
    .join(',\n') +
    '\nON DUPLICATE KEY UPDATE name = VALUES(name), slug = VALUES(slug), description = VALUES(description),\n' +
    '  image_url = VALUES(image_url), sort_order = VALUES(sort_order);\n'
);

// ---------- Products + reviews ----------
const reviewRows = [];
const productRows = products.map((p, i) => {
  const id = i + 1;
  const images = Array.from({ length: p.images }, (_, n) => `${IMG}/${p.slug}-${n + 1}.webp`);

  const count = 3 + Math.floor(rand() * 4);
  let sum = 0;
  for (let r = 0; r < count; r++) {
    const x = rand();
    const rating = x < 0.62 ? 5 : x < 0.92 ? 4 : 3;
    sum += rating;
    const daysAgo = 3 + Math.floor(rand() * 180);
    reviewRows.push(
      `  (${[reviewRows.length + 1, id, pick(reviewers), rating, pick(comments[rating])].map(esc).join(', ')}, ` +
        `NOW() - INTERVAL ${daysAgo} DAY)`
    );
  }
  const rating = Math.round((sum / count) * 10) / 10;

  return `  (${[
    id, catId[p.category], p.name, p.slug, 'LUXE', p.description, JSON.stringify(p.highlights),
    p.price, p.original_price || null, p.stock, p.sold, p.sizes, p.color, p.material, p.gender,
    rating, count, !!p.featured, !!p.isNew, images[0], JSON.stringify(images),
  ].map(esc).join(', ')})`;
});

sql.push(`INSERT INTO products (id, category_id, name, slug, brand, description, highlights, price, original_price,
  stock, sold, sizes, color, material, gender, rating, review_count, is_featured, is_new, image_url, images) VALUES`);
sql.push(
  productRows.join(',\n') +
    `\nON DUPLICATE KEY UPDATE category_id = VALUES(category_id), name = VALUES(name), slug = VALUES(slug),
  description = VALUES(description), highlights = VALUES(highlights), price = VALUES(price),
  original_price = VALUES(original_price), sizes = VALUES(sizes), color = VALUES(color),
  material = VALUES(material), gender = VALUES(gender), rating = VALUES(rating), review_count = VALUES(review_count),
  is_featured = VALUES(is_featured), is_new = VALUES(is_new), image_url = VALUES(image_url), images = VALUES(images);
`
);
sql.push('-- Xoá sản phẩm cũ không còn trong catalog (chưa có trong đơn hàng nào)');
sql.push(
  `DELETE FROM products WHERE id > ${products.length} AND id NOT IN (SELECT product_id FROM (SELECT DISTINCT product_id FROM order_items) t);\n`
);

sql.push('INSERT INTO reviews (id, product_id, author_name, rating, comment, created_at) VALUES');
sql.push(
  reviewRows.join(',\n') +
    '\nON DUPLICATE KEY UPDATE product_id = VALUES(product_id), author_name = VALUES(author_name),\n' +
    '  rating = VALUES(rating), comment = VALUES(comment);\n'
);

fs.writeFileSync(OUT, sql.join('\n'));
console.log(`Đã ghi ${OUT}: ${products.length} sản phẩm, ${reviewRows.length} đánh giá`);
