# LUXE Fashion Store — Backend

REST API Node.js + Express + MySQL. Frontend ở repo [luxe_frontend](https://github.com/QuocAnh-205/luxe_frontend).

Repo này chứa luôn `database/` (schema + seed) và `docker-compose.yml` để chạy toàn bộ stack.

## Chạy bằng Docker

Clone 2 repo cạnh nhau:

```bash
mkdir luxe2 && cd luxe2
git clone https://github.com/QuocAnh-205/luxe_backend.git
git clone https://github.com/QuocAnh-205/luxe_frontend.git

cd luxe_backend
cp .env.example .env      # sửa mật khẩu, JWT_SECRET
docker compose up -d --build
```

Mở `http://localhost` (frontend), API ở `http://localhost/api/...`.

## CI/CD

`.github/workflows/backend-ci-cd.yml`:

- **CI** (mọi PR và push `main`): cài dependencies, nạp schema + seed vào MySQL tạm, chạy test API, build thử Docker image.
- **CD** (push `main`, sau khi CI xanh): SSH vào EC2, `git pull` trong `~/luxe2/luxe_backend`, build lại và khởi động lại container backend.
  Chỉ chạy khi repo đã khai báo biến `AWS_ROLE_ARN`, `AWS_SG_ID` và secret `EC2_HOST`, `EC2_USER`, `EC2_SSH_KEY`.
