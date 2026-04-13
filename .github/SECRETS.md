# GitHub Actions — Required Secrets & Variables

Cấu hình tại: **Settings → Secrets and variables → Actions**

---

## Repository Secrets (dùng chung mọi environment)

| Secret                  | Mô tả                                                           |
| ----------------------- | --------------------------------------------------------------- |
| `VERCEL_TOKEN`          | Personal Access Token từ vercel.com/account/tokens              |
| `VERCEL_ORG_ID`         | Team/Personal ID — lấy từ `vercel whoami` hoặc project settings |
| `VERCEL_WEB_PROJECT_ID` | Project ID của `hotel-web` trên Vercel                          |
| `VERCEL_API_PROJECT_ID` | Project ID của `hotel-api` trên Vercel                          |

---

## Environment Secrets

Tạo 3 environments tại **Settings → Environments**: `production`, `staging`, `develop`

### Environment: `production`

| Secret               | Mô tả                             |
| -------------------- | --------------------------------- |
| `DATABASE_URL`       | PostgreSQL production (PgBouncer) |
| `JWT_ACCESS_SECRET`  | Access token secret ≥ 32 chars    |
| `JWT_REFRESH_SECRET` | Refresh token secret ≥ 32 chars   |
| `REDIS_URL`          | Redis production URL              |
| `RABBITMQ_URL`       | RabbitMQ production URL           |
| `SMTP_HOST`          | SMTP host                         |
| `SMTP_USER`          | SMTP user                         |
| `SMTP_PASS`          | SMTP password                     |
| `VNPAY_TMN_CODE`     | VNPay merchant code               |
| `VNPAY_HASH_SECRET`  | VNPay hash secret                 |

| Variable              | Mô tả                            |
| --------------------- | -------------------------------- |
| `NEXT_PUBLIC_API_URL` | https://api.hotel.com            |
| `VNPAY_URL`           | https://pay.vnpay.vn/vpcpay.html |
| `VNPAY_RETURN_URL`    | https://hotel.com/payment/result |

### Environment: `staging`

| Secret               | Mô tả              |
| -------------------- | ------------------ |
| `DATABASE_URL`       | PostgreSQL staging |
| `JWT_ACCESS_SECRET`  |                    |
| `JWT_REFRESH_SECRET` |                    |
| `REDIS_URL`          |                    |
| `RABBITMQ_URL`       |                    |
| `SMTP_HOST`          |                    |
| `SMTP_USER`          |                    |
| `SMTP_PASS`          |                    |
| `VNPAY_TMN_CODE`     | Sandbox code       |
| `VNPAY_HASH_SECRET`  | Sandbox secret     |

| Variable              | Mô tả                                              |
| --------------------- | -------------------------------------------------- |
| `NEXT_PUBLIC_API_URL` | https://api-staging.hotel.com                      |
| `VNPAY_URL`           | https://sandbox.vnpayment.vn/paymentv2/vpcpay.html |
| `VNPAY_RETURN_URL`    | https://staging.hotel.com/payment/result           |

### Environment: `develop`

| Secret               | Mô tả                                                |
| -------------------- | ---------------------------------------------------- |
| `DATABASE_URL`       | PostgreSQL dev (có thể dùng Neon/Supabase free tier) |
| `JWT_ACCESS_SECRET`  |                                                      |
| `JWT_REFRESH_SECRET` |                                                      |
| `REDIS_URL`          | Redis Upstash free tier                              |
| `RABBITMQ_URL`       | CloudAMQP free tier                                  |

| Variable              | Mô tả                     |
| --------------------- | ------------------------- |
| `NEXT_PUBLIC_API_URL` | https://api-dev.hotel.com |

---

## Cách lấy Vercel Project ID

```bash
# 1. Cài Vercel CLI
pnpm add -g vercel

# 2. Login
vercel login

# 3. Link project Web (chạy trong apps/web/)
cd apps/web
vercel link
# → Chọn team, nhập project name: hotel-web
# → Copy Project ID từ .vercel/project.json

# 4. Link project API (chạy trong apps/api/)
cd apps/api
vercel link
# → Nhập project name: hotel-api
# → Copy Project ID từ .vercel/project.json

# 5. Lấy Org ID
vercel whoami --json
# hoặc xem trong .vercel/project.json: "orgId"
```

---

## Branch → Environment mapping

| Git branch                    | Vercel environment | URL pattern                                 |
| ----------------------------- | ------------------ | ------------------------------------------- |
| `main`                        | `production`       | hotel-web.vercel.app / hotel-api.vercel.app |
| `staging`                     | `staging`          | hotel-web-staging.vercel.app                |
| `develop` (và mọi nhánh khác) | `develop`          | hotel-web-develop.vercel.app                |

---

## Vercel Project Setup (thủ công lần đầu)

### Tắt auto-deploy của Vercel (để GitHub Actions kiểm soát hoàn toàn)

Vào Vercel Dashboard → Project → Settings → Git:

- **Uncheck** "Deploy on push"
- Chỉ để GitHub Actions deploy qua `vercel deploy --prebuilt`

### Cấu hình Root Directory trên Vercel

| Project     | Root Directory |
| ----------- | -------------- |
| `hotel-web` | `apps/web`     |
| `hotel-api` | `apps/api`     |
