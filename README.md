# Sapphire Stay — Hệ thống đặt phòng khách sạn trực tuyến

> Bài tập lớn môn **Phân tích Hệ thống Thương mại Điện tử** — Nhóm 05, PTIT
> Giảng viên: PGS. Đỗ Quang Hưng

Hệ thống đặt phòng khách sạn end-to-end với 3 vai trò (Customer / Receptionist–Housekeeping / Admin), tích hợp thanh toán VNPay, hàng đợi RabbitMQ cho thông báo, Redis cho khoá phân tán & cache.

---

## 1. Kiến trúc

```
tmdt/
├── apps/
│   ├── api/    # NestJS 11 + Prisma + PostgreSQL + Redis + RabbitMQ
│   └── web/    # Next.js 15 (App Router) + Tailwind + React Query + Zustand
├── packages/
│   └── shared/ # Shared types (chỗ giữ chỗ)
├── infra/      # docker-compose, init.sql
└── pnpm-workspace.yaml
```

| Tầng       | Công nghệ                                                                    |
| ---------- | ---------------------------------------------------------------------------- |
| Backend    | NestJS 10, Prisma 6, PostgreSQL 16, JWT (access+refresh), class-validator    |
| Async      | In-process EventBus + Upstash Redis (REST) cho lock & cache                  |
| Email      | Resend HTTP API                                                              |
| Cron       | Endpoint `POST /internal/cron/expire-bookings` (CRON_SECRET) + Vercel Cron / cron-job.org |
| Payment    | VNPay sandbox                                                                |
| Frontend   | Next.js 16 App Router, React 19, TailwindCSS 3, React Query, Zustand, Recharts |
| Validation | Zod + react-hook-form                                                        |
| Monorepo   | pnpm workspaces + Turborepo                                                  |
| Deploy     | Vercel (web + api), single Postgres (Prisma Postgres / Neon)                 |

---

## 2. Yêu cầu môi trường

- Node.js ≥ 20
- pnpm ≥ 9 (`npm i -g pnpm`)
- Docker + Docker Compose (cho hạ tầng cục bộ)

---

## 3. Khởi động nhanh

```bash
# 1) Cài deps cho cả monorepo
pnpm install

# 2) Bật PostgreSQL / Redis / RabbitMQ
docker compose up -d postgres redis rabbitmq

# 3) Cấu hình env (đã có sẵn .env mẫu)
cp apps/api/.env.example apps/api/.env

# 4) Migrate DB và seed dữ liệu mẫu
cd apps/api
pnpm exec prisma migrate deploy   # apply migration init đã commit
pnpm db:seed                      # nạp users, room types, rooms, pricing rules

# 5) Chạy backend & frontend (2 terminal)
pnpm --filter @hotel/api dev      # http://localhost:3000  (Swagger: /api/docs)
pnpm --filter @hotel/web dev      # http://localhost:3001
```

---

## 4. Database & Migration

### Schema chính (Prisma)

| Bảng            | Vai trò                                                              |
| --------------- | -------------------------------------------------------------------- |
| `users`         | Tài khoản (CUSTOMER / RECEPTIONIST / HOUSEKEEPING / ADMIN)           |
| `room_types`    | Loại phòng (Standard / Deluxe / Suite …)                             |
| `rooms`         | Phòng cụ thể, có trạng thái real-time                                |
| `pricing_rules` | Bảng giá theo loại: DEFAULT / SEASONAL / HOLIDAY (priority)          |
| `bookings`      | Đơn đặt phòng + trạng thái (PENDING_PAYMENT, CONFIRMED, CHECKED_IN…) |
| `booking_addons`| Dịch vụ phát sinh (minibar, giặt ủi…)                                |
| `payments`      | Giao dịch VNPay/MoMo/CASH                                            |
| `reviews`       | Đánh giá sau khi check-out                                           |
| `notifications` | Log email/SMS đã gửi                                                 |
| `outbox_events` | Pattern Outbox cho RabbitMQ publishing                               |

### Lệnh thường dùng

```bash
cd apps/api

# Tạo migration mới khi đổi schema
pnpm exec prisma migrate dev --name <ten_migration>

# Apply migration đã có (production / CI / máy mới)
pnpm exec prisma migrate deploy

# Sinh lại Prisma Client
pnpm exec prisma generate

# Mở Prisma Studio để xem dữ liệu
pnpm exec prisma studio
```

### Seed data

Chạy `pnpm db:seed` sẽ tạo:

| Loại         | Số lượng | Ghi chú                                    |
| ------------ | -------- | ------------------------------------------ |
| Users        | 6        | 1 admin · 3 customer · 2 receptionist      |
| Room types   | 3        | Standard, Deluxe, Suite                    |
| Rooms        | 15       | Phân bổ tầng 1–3                           |
| Pricing rules| 9        | DEFAULT + SEASONAL (hè) + HOLIDAY (lễ)     |

#### Tài khoản mẫu

| Vai trò      | Email                       | Mật khẩu       |
| ------------ | --------------------------- | -------------- |
| Admin        | `admin@hotel.com`           | `Admin@123`    |
| Customer     | `customer1@hotel.com` (1–3) | `Customer@123` |
| Receptionist | `receptionist1@hotel.com` (1–2) | `Staff@123` |

---

## 5. Các luồng nghiệp vụ chính

### Customer

1. Đăng ký / đăng nhập (`/register`, `/login`)
2. Tìm phòng theo ngày + số khách (`/rooms`) — gọi `GET /api/v1/search`
3. Đặt phòng (`/booking`) — `POST /api/v1/bookings` (lock Redis, tránh oversell)
4. Thanh toán VNPay/MoMo/CASH — `POST /api/v1/payments/initiate` → redirect gateway
5. Xem & hủy đơn (`/my-bookings`) — `POST /api/v1/bookings/:id/cancel`
6. Hệ thống tự huỷ đơn `PENDING_PAYMENT` quá hạn 15 phút (BookingScheduler)

### Receptionist / Housekeeping (`/staff`)

- **Sơ đồ phòng** — xem theo tầng, đổi trạng thái real-time (AVAILABLE / OCCUPIED / DIRTY / CLEANING / MAINTENANCE / RESERVED)
- **Check-in / Check-out** — tìm đơn theo mã, thực hiện thủ tục

### Admin (`/admin`)

- **Dashboard** — KPI doanh thu, occupancy, đơn xác nhận, đang lưu trú + biểu đồ Recharts
- **Loại phòng** — CRUD với ảnh và amenities
- **Phòng** — CRUD + đổi trạng thái inline
- **Nhân viên** — tạo tài khoản, lock/unlock

---

## 6. API

Swagger UI: <http://localhost:3000/api/docs>

Các nhóm endpoint chính:

| Prefix              | Mô tả                                                      |
| ------------------- | ---------------------------------------------------------- |
| `/api/v1/auth`      | register, login, refresh, logout                           |
| `/api/v1/users`     | profile, list users (admin), tạo staff, lock account       |
| `/api/v1/rooms`     | room types & rooms (CRUD), pricing rules                   |
| `/api/v1/search`    | tìm phòng trống (public)                                   |
| `/api/v1/bookings`  | tạo đơn, lịch sử, hủy, check-in/out                        |
| `/api/v1/payments`  | khởi tạo thanh toán, webhook VNPay                         |
| `/api/v1/staff`     | room map, addon dịch vụ                                    |
| `/api/v1/reports`   | revenue, occupancy, summary (admin)                        |

---

## 7. Cấu hình môi trường

`apps/api/.env`:

```env
PORT=3000
DATABASE_URL=postgresql://hotel:hotel_secret@localhost:5432/hotel_db
JWT_ACCESS_SECRET=<min_32_chars>
JWT_REFRESH_SECRET=<min_32_chars>
# Optional — fallback to in-memory on dev if omitted
UPSTASH_REDIS_REST_URL=https://<region>.upstash.io
UPSTASH_REDIS_REST_TOKEN=<token>
# Optional — emails are skipped (only persisted) if omitted
RESEND_API_KEY=re_xxx
EMAIL_FROM=Sapphire Stay <onboarding@resend.dev>
# Cron endpoint bearer
CRON_SECRET=<random_32_chars>
CORS_ORIGINS=http://localhost:3001
VNPAY_TMN_CODE=<sandbox_tmn>
VNPAY_HASH_SECRET=<sandbox_secret>
VNPAY_URL=https://sandbox.vnpayment.vn/paymentv2/vpcpay.html
VNPAY_RETURN_URL=http://localhost:3001/payment/result
```

`apps/web` đọc từ biến `NEXT_PUBLIC_API_URL` (mặc định `http://localhost:3000`).

### Trigger cron hủy đơn quá hạn

Sau khi deploy, đăng ký 1 job tại [cron-job.org](https://cron-job.org) (miễn phí, chạy mỗi phút):

```
POST https://<api-domain>/api/v1/internal/cron/expire-bookings
Header: Authorization: Bearer <CRON_SECRET>
```

Hoặc dùng Vercel Cron bằng cách thêm vào `vercel.json` (Hobby plan chỉ chạy 1 lần/ngày):

```json
{ "crons": [{ "path": "/api/v1/internal/cron/expire-bookings", "schedule": "0 * * * *" }] }
```

---

## 8. Scripts hữu ích

```bash
# Build
pnpm --filter @hotel/api build
pnpm --filter @hotel/web build

# Test (BE)
pnpm --filter @hotel/api test

# Lint
pnpm --filter @hotel/web lint

# Dừng hạ tầng
docker compose down
```

---

## 9. Thành viên — Nhóm 05

| Họ tên             | Mã SV       | Vai trò                                      |
| ------------------ | ----------- | -------------------------------------------- |
| Lương Tuấn Anh     | B22DCC021   | Trưởng nhóm                                  |
| Lương Tiến Đạt     | B22DCCN190  | Front-end (Customer flow + foundation)       |
| Trần Hữu Phúc      | B22DCCN634  | Backend / Cloud                              |
| Bùi Ngọc Vũ        | B22DCCN910  | Front-end (Admin & Staff dashboards)         |

---

## 10. Tài liệu liên quan

- [`ARCHITECH.md`](./ARCHITECH.md) — phân tích use case chi tiết & sequence diagram
- [`REQUIREMENTS.md`](./REQUIREMENTS.md) — yêu cầu hệ thống
- [`TASK.md`](./TASK.md) — Buổi 1: backend & database
- [`TASK_2.md`](./TASK_2.md) — Buổi 2: giao diện & tích hợp
