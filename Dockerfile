# backend/Dockerfile
# LUXE Fashion Store - Backend (Node.js + Express)

FROM node:22-alpine

WORKDIR /app

# Cài dependencies trước để tận dụng cache của Docker.
# Có package-lock.json thì dùng `npm ci` (cài đúng version đã khoá), không thì `npm install`.
COPY package*.json ./
RUN if [ -f package-lock.json ]; then npm ci --omit=dev; else npm install --omit=dev; fi

# Copy toàn bộ source code backend
COPY . .

# Nếu backend viết bằng TypeScript (có script "build" trong package.json) thì build ra JS.
# Khi đó cần đổi lệnh cài ở trên thành `npm ci` (không --omit=dev) để có typescript.
RUN npm run build --if-present

ENV NODE_ENV=production
# server.js/index.js phải dùng: const PORT = process.env.PORT || 5000
EXPOSE 5000

CMD ["npm", "start"]
