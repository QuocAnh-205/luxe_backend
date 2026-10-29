// Test tích hợp API LUXE: gọi HTTP thật vào app, dữ liệu thật trong MySQL.
// Cần MySQL đã nạp database/init/01-schema.sql + 02-seed.sql, cấu hình qua DB_HOST/DB_PORT/DB_USERNAME/DB_PASSWORD/DB_NAME.
//   CI: GitHub Actions dựng MySQL tạm (xem .github/workflows/backend-ci-cd.yml)
//   Local: xem hướng dẫn trong DEPLOY-EC2.md mục "Test tự động backend"
process.env.JWT_SECRET ||= 'test-secret';
process.env.OTP_DEBUG = 'true'; // trả mã OTP trong response để test được luồng quên mật khẩu
delete process.env.MAIL_PROVIDER;

const { test, before, after, describe } = require('node:test');
const assert = require('node:assert/strict');
const app = require('../src/app');
const pool = require('../src/db');
const { ensureSchema } = require('../src/schema');

let server;
let base;
const uid = Date.now();

async function api(path, { method = 'GET', body, token } = {}) {
  const headers = {};
  if (body) headers['Content-Type'] = 'application/json';
  if (token) headers.Authorization = `Bearer ${token}`;
  const res = await fetch(`${base}/api${path}`, { method, headers, body: body ? JSON.stringify(body) : undefined });
  const text = await res.text();
  return { status: res.status, body: text ? JSON.parse(text) : null };
}

const login = async (email, password) => (await api('/auth/login', { method: 'POST', body: { email, password } })).body.token;
const product = async (slug) => (await api(`/products/${slug}`)).body.product;

before(async () => {
  await ensureSchema();
  await new Promise((resolve) => {
    server = app.listen(0, resolve);
  });
  base = `http://127.0.0.1:${server.address().port}`;
});

after(async () => {
  await new Promise((resolve) => server.close(resolve));
  await pool.end();
});

describe('Hệ thống', () => {
  test('GET /api/health: backend chạy và kết nối được MySQL', async () => {
    const r = await api('/health');
    assert.equal(r.status, 200);
    assert.equal(r.body.status, 'ok');
    assert.equal(r.body.db, 'up');
  });

  test('API không tồn tại trả 404', async () => {
    const r = await api('/khong-ton-tai');
    assert.equal(r.status, 404);
  });
});

describe('Danh mục & sản phẩm', () => {
  test('có 15 danh mục, tổng số sản phẩm theo danh mục = 100', async () => {
    const r = await api('/categories');
    assert.equal(r.status, 200);
    assert.equal(r.body.categories.length, 15);
    assert.equal(r.body.categories.reduce((s, c) => s + Number(c.product_count), 0), 100);
  });

  test('danh sách sản phẩm: đủ 100, mỗi sản phẩm có ảnh, giá, slug', async () => {
    const r = await api('/products?limit=200');
    assert.equal(r.status, 200);
    assert.equal(r.body.total, 100);
    for (const p of r.body.items) {
      assert.ok(p.images.length >= 1, `${p.slug} thiếu ảnh`);
      assert.match(p.images[0], /^\/images\/products\/.+\.webp$/);
      assert.ok(p.price > 0, `${p.slug} giá không hợp lệ`);
    }
  });

  test('phân trang: limit=12 trả 12 sản phẩm, 9 trang', async () => {
    const r = await api('/products?limit=12&page=2');
    assert.equal(r.body.items.length, 12);
    assert.equal(r.body.page, 2);
    assert.equal(r.body.pages, 9);
  });

  test('lọc theo danh mục túi xách = 6 sản phẩm', async () => {
    const r = await api('/products?category=tui-xach&limit=50');
    assert.equal(r.body.total, 6);
    assert.ok(r.body.items.every((p) => p.category_slug === 'tui-xach'));
  });

  test('sắp xếp giá tăng dần', async () => {
    const r = await api('/products?sort=price_asc&limit=200');
    const prices = r.body.items.map((p) => p.price);
    assert.deepEqual(prices, [...prices].sort((a, b) => a - b));
  });

  test('lọc khoảng giá và hàng giảm giá', async () => {
    const range = await api('/products?min=500000&max=1000000&limit=200');
    assert.ok(range.body.items.every((p) => p.price >= 500000 && p.price <= 1000000));
    const sale = await api('/products?sale=1&limit=200');
    assert.ok(sale.body.total > 0);
    assert.ok(sale.body.items.every((p) => p.original_price > p.price));
  });

  test('tìm kiếm "đồng hồ" có kết quả', async () => {
    const r = await api(`/products?q=${encodeURIComponent('đồng hồ')}&limit=50`);
    assert.ok(r.body.total >= 10);
  });

  test('chi tiết sản phẩm kèm đánh giá và sản phẩm liên quan', async () => {
    const r = await api('/products/dam-corset-da-do');
    assert.equal(r.status, 200);
    assert.equal(r.body.product.name, 'Đầm corset da đỏ chân váy dài');
    assert.deepEqual(r.body.product.sizes, ['XS', 'S', 'M', 'L']);
    assert.ok(r.body.product.highlights.length > 0);
    assert.ok(r.body.reviews.length > 0);
    assert.ok(r.body.related.length > 0);
  });

  test('sản phẩm không tồn tại trả 404', async () => {
    const r = await api('/products/khong-co-san-pham-nay');
    assert.equal(r.status, 404);
  });
});

describe('Đăng ký & đăng nhập', () => {
  const email = `test${uid}@luxe.test`;

  test('đăng nhập sai mật khẩu trả 401', async () => {
    const r = await api('/auth/login', { method: 'POST', body: { email: 'demo@luxe.vn', password: 'sai-mat-khau' } });
    assert.equal(r.status, 401);
  });

  test('đăng nhập tài khoản demo thành công, /me trả đúng người dùng', async () => {
    const token = await login('demo@luxe.vn', 'Demo@123');
    assert.ok(token);
    const me = await api('/auth/me', { token });
    assert.equal(me.status, 200);
    assert.equal(me.body.user.email, 'demo@luxe.vn');
    assert.equal(me.body.user.password_hash, undefined, 'không được lộ password_hash');
  });

  test('đăng ký: mật khẩu ngắn / email sai bị từ chối', async () => {
    const short = await api('/auth/register', { method: 'POST', body: { full_name: 'A', email, password: '123' } });
    assert.equal(short.status, 400);
    const bad = await api('/auth/register', { method: 'POST', body: { full_name: 'A', email: 'khong-phai-email', password: '123456' } });
    assert.equal(bad.status, 400);
  });

  test('đăng ký thành công rồi không cho trùng email', async () => {
    const ok = await api('/auth/register', { method: 'POST', body: { full_name: 'Người Test', email, password: 'Matkhau@1' } });
    assert.equal(ok.status, 201);
    assert.ok(ok.body.token);
    assert.equal(ok.body.user.role, 'customer');
    const dup = await api('/auth/register', { method: 'POST', body: { full_name: 'Người Test', email, password: 'Matkhau@1' } });
    assert.equal(dup.status, 409);
  });

  test('token giả mạo bị từ chối', async () => {
    const r = await api('/auth/me', { token: 'abc.def.ghi' });
    assert.equal(r.status, 401);
  });
});

describe('Đặt hàng', () => {
  let token;
  before(async () => {
    token = await login('demo@luxe.vn', 'Demo@123');
  });

  test('chưa đăng nhập thì không đặt được hàng', async () => {
    const r = await api('/orders', { method: 'POST', body: { items: [] } });
    assert.equal(r.status, 401);
  });

  test('thiếu size với sản phẩm có size bị từ chối', async () => {
    const p = await product('dam-corset-da-do');
    const r = await api('/orders', {
      method: 'POST',
      token,
      body: { items: [{ product_id: p.id, quantity: 1 }], full_name: 'Demo', phone: '0901000002', shipping_address: 'Đà Nẵng' },
    });
    assert.equal(r.status, 400);
  });

  test('đặt quá số lượng tồn kho bị từ chối', async () => {
    const p = await product('kinh-pixel-8-bit');
    const r = await api('/orders', {
      method: 'POST',
      token,
      body: { items: [{ product_id: p.id, quantity: p.stock + 1 }], full_name: 'Demo', phone: '0901000002', shipping_address: 'Đà Nẵng' },
    });
    assert.equal(r.status, 409);
  });

  test('đơn hợp lệ: giá tính ở server (bỏ qua giá client), miễn ship từ 1 triệu, trừ tồn kho', async () => {
    const dress = await product('dam-corset-da-do');
    const glasses = await product('kinh-pixel-8-bit');
    const r = await api('/orders', {
      method: 'POST',
      token,
      body: {
        items: [
          { product_id: dress.id, size: 'M', quantity: 1, price: 1 },
          { product_id: glasses.id, quantity: 2, price: 1 },
        ],
        full_name: 'Khách Demo',
        phone: '0901000002',
        shipping_address: '45 Lê Duẩn, Đà Nẵng',
      },
    });
    assert.equal(r.status, 201);
    assert.equal(r.body.order.total_amount, dress.price + 2 * glasses.price);
    assert.equal(r.body.order.shipping_fee, 0);
    assert.equal((await product('dam-corset-da-do')).stock, dress.stock - 1);
    assert.equal((await product('kinh-pixel-8-bit')).stock, glasses.stock - 2);

    const mine = await api('/orders', { token });
    const order = mine.body.orders.find((o) => o.id === r.body.order.id);
    assert.ok(order, 'đơn vừa đặt phải có trong lịch sử');
    assert.equal(order.items.length, 2);
  });

  test('đơn dưới 1 triệu tính phí ship 30.000₫', async () => {
    const glasses = await product('kinh-pixel-8-bit');
    const r = await api('/orders', {
      method: 'POST',
      token,
      body: { items: [{ product_id: glasses.id, quantity: 1 }], full_name: 'Demo', phone: '0901000002', shipping_address: 'Đà Nẵng' },
    });
    assert.equal(r.status, 201);
    assert.equal(r.body.order.shipping_fee, 30000);
    assert.equal(r.body.order.total_amount, glasses.price + 30000);
  });
});

describe('Quản trị (admin)', () => {
  let adminToken;
  let customerToken;
  before(async () => {
    adminToken = await login('admin@luxe.vn', 'Admin@123');
    customerToken = await login('demo@luxe.vn', 'Demo@123');
  });

  test('khách hàng không vào được API admin', async () => {
    const r = await api('/admin/stats', { token: customerToken });
    assert.equal(r.status, 403);
  });

  test('admin xem được thống kê', async () => {
    const r = await api('/admin/stats', { token: adminToken });
    assert.equal(r.status, 200);
    assert.equal(r.body.totals.products, 100);
    assert.ok(Array.isArray(r.body.byCategory));
  });

  test('huỷ đơn thì trả hàng về kho', async () => {
    const glasses = await product('kinh-pixel-8-bit');
    const order = await api('/orders', {
      method: 'POST',
      token: customerToken,
      body: { items: [{ product_id: glasses.id, quantity: 3 }], full_name: 'Demo', phone: '0901000002', shipping_address: 'Đà Nẵng' },
    });
    assert.equal((await product('kinh-pixel-8-bit')).stock, glasses.stock - 3);
    const cancel = await api(`/admin/orders/${order.body.order.id}`, { method: 'PATCH', token: adminToken, body: { status: 'cancelled' } });
    assert.equal(cancel.status, 200);
    assert.equal((await product('kinh-pixel-8-bit')).stock, glasses.stock);
  });

  test('tạo – sửa – xoá sản phẩm, slug trùng bị từ chối', async () => {
    const slug = `test-sp-${uid}`;
    const body = { name: 'Sản phẩm test', slug, category_id: 1, price: 100000, images: ['/images/products/dam-corset-da-do-1.webp'] };
    const created = await api('/admin/products', { method: 'POST', token: adminToken, body });
    assert.equal(created.status, 201);
    const dup = await api('/admin/products', { method: 'POST', token: adminToken, body });
    assert.equal(dup.status, 409);
    const updated = await api(`/admin/products/${created.body.id}`, { method: 'PUT', token: adminToken, body: { ...body, price: 200000 } });
    assert.equal(updated.status, 200);
    assert.equal((await product(slug)).price, 200000);
    const del = await api(`/admin/products/${created.body.id}`, { method: 'DELETE', token: adminToken });
    assert.equal(del.status, 204);
    assert.equal((await api(`/products/${slug}`)).status, 404);
  });

  test('không xoá được sản phẩm đã có trong đơn hàng', async () => {
    const p = await product('kinh-pixel-8-bit');
    const r = await api(`/admin/products/${p.id}`, { method: 'DELETE', token: adminToken });
    assert.equal(r.status, 409);
  });
});

describe('Quên mật khẩu bằng OTP', () => {
  const email = `otp${uid}@luxe.test`;
  before(async () => {
    await api('/auth/register', { method: 'POST', body: { full_name: 'Người OTP', email, password: 'Cu@123456' } });
  });

  test('email chưa đăng ký vẫn nhận thông báo chung (không lộ email nào tồn tại)', async () => {
    const r = await api('/auth/forgot-password', { method: 'POST', body: { email: `khongco${uid}@luxe.test` } });
    assert.equal(r.status, 200);
    assert.equal(r.body.debug_otp, undefined);
  });

  test('gửi OTP → sai mã → đúng mã → đặt mật khẩu mới → đăng nhập', async () => {
    const sent = await api('/auth/forgot-password', { method: 'POST', body: { email } });
    assert.equal(sent.status, 200);
    assert.match(sent.body.debug_otp, /^\d{6}$/);

    const again = await api('/auth/forgot-password', { method: 'POST', body: { email } });
    assert.equal(again.status, 429, 'gửi lại ngay phải bị chặn 60 giây');

    const wrongCode = sent.body.debug_otp === '000000' ? '111111' : '000000';
    const wrong = await api('/auth/verify-otp', { method: 'POST', body: { email, otp: wrongCode } });
    assert.equal(wrong.status, 400);

    const ok = await api('/auth/verify-otp', { method: 'POST', body: { email, otp: sent.body.debug_otp } });
    assert.equal(ok.status, 200);
    const resetToken = ok.body.reset_token;

    const asSession = await api('/auth/me', { token: resetToken });
    assert.equal(asSession.status, 401, 'token đặt lại mật khẩu không được dùng để đăng nhập');

    const reset = await api('/auth/reset-password', { method: 'POST', body: { reset_token: resetToken, password: 'Moi@123456' } });
    assert.equal(reset.status, 200);
    const reuse = await api('/auth/reset-password', { method: 'POST', body: { reset_token: resetToken, password: 'Khac@123456' } });
    assert.equal(reuse.status, 400, 'token chỉ dùng được 1 lần');

    assert.ok(await login(email, 'Moi@123456'), 'đăng nhập bằng mật khẩu mới');
    assert.equal(await login(email, 'Cu@123456'), undefined, 'mật khẩu cũ không còn dùng được');
  });
});
