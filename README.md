<div align="center">

# 🏨 Hotel Booking System

**Hệ thống đặt phòng khách sạn trực tuyến**

_Môn học: Phân tích Hệ thống Thương mại Điện tử — PTIT_

[![NestJS](https://img.shields.io/badge/NestJS-10.x-E0234E?style=flat-square&logo=nestjs)](https://nestjs.com)
[![Next.js](https://img.shields.io/badge/Next.js-15.x-000000?style=flat-square&logo=next.js)](https://nextjs.org)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?style=flat-square&logo=postgresql&logoColor=white)](https://postgresql.org)
[![Redis](https://img.shields.io/badge/Redis-7-DC382D?style=flat-square&logo=redis&logoColor=white)](https://redis.io)
[![RabbitMQ](https://img.shields.io/badge/RabbitMQ-3.13-FF6600?style=flat-square&logo=rabbitmq&logoColor=white)](https://rabbitmq.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://typescriptlang.org)

</div>

---

## Nhóm thực hiện

| STT | Họ và tên      | Mã số      | GitHub                                         | Vai trò                         |
| :-: | -------------- | ---------- | ---------------------------------------------- | ------------------------------- |
|  1  | Lương Tuấn Anh | B22DCC021  | [@n0xgg04](https://github.com/n0xgg04)         | Trưởng nhóm · Backend · Infra   |
|  2  | Trần Hữu Phúc  | B22DCCN634 | [@PhucHuwu](https://github.com/PhucHuwu)       | Backend · Booking & Payment     |
|  3  | Lương Tiến Đạt | B22DCCN190 | [@luongdat2k4](https://github.com/luongdat2k4) | Frontend · Customer Portal      |
|  4  | Bùi Ngọc Vũ    | B22DCCN910 | [@bngcVu](https://github.com/bngcVu)           | Frontend · Admin & Staff Portal |

---

## Mục lục

- [Tổng quan](#tổng-quan)
- [Kiến trúc hệ thống](#kiến-trúc-hệ-thống)
- [Tech Stack](#tech-stack)
- [Cấu trúc dự án](#cấu-trúc-dự-án)
- [Cài đặt & Chạy](#cài-đặt--chạy)
- [Biến môi trường](#biến-môi-trường)
- [API Documentation](#api-documentation)
- [Git Workflow](#git-workflow)
- [Tính năng đã hoàn thành](#tính-năng-đã-hoàn-thành)
- [Sơ đồ Saga](#sơ-đồ-saga-pattern)

---

## Tổng quan

Hệ thống đặt phòng khách sạn trực tuyến phục vụ 3 nhóm người dùng:

| Actor             | Chức năng chính                                              |
| ----------------- | ------------------------------------------------------------ |
| **Khách hàng**    | Tìm kiếm, đặt phòng, thanh toán, xem lịch sử, đánh giá       |
| **Nhân viên**     | Quản lý Room Map, Check-in/out, dọn phòng, dịch vụ phát sinh |
| **Quản trị viên** | Quản lý phòng, giá linh hoạt, nhân viên, báo cáo doanh thu   |

---

## Kiến trúc hệ thống

```
┌─────────────────────────────────────────────────────────────┐
│                     Client Layer                            │
│  Next.js 15 (Customer Portal)   Next.js 15 (Admin/Staff)   │
│          :3001                          :3001               │
└───────────────────────┬─────────────────────────────────────┘
                        │ HTTP/REST + WebSocket
┌───────────────────────▼─────────────────────────────────────┐
│                  NestJS Monolith API                        │
│                     :3000  /api/v1                          │
│                                                             │
│  Auth │ Rooms │ Search │ Bookings │ Payments │ Staff        │
│  Users│Pricing│        │  Saga    │ VNPay    │ Reports      │
│       │       │        │Scheduler │          │Notifications │
└──┬────┴───┬───┴────┬───┴──────────┴──────────┴─────────┬───┘
   │        │        │                                    │
   ▼        ▼        ▼                                    ▼
PostgreSQL  Redis   RabbitMQ                         PgBouncer
  :5432    :6379   :5672/:15672                        :6432
(via PgBouncer)  (Sessions,    (booking.exchange        (pool)
                  Dist Lock,    payment.exchange
                  Search cache) notification.exchange)
```

### Saga Pattern — Booking Flow

```
[Client]
   │ POST /bookings
   ▼
[BookingService]
   ├─ Redis SETNX lock (10s) ──→ ConflictException nếu đã lock
   ├─ Overlap check
   ├─ DB Transaction: Booking(PENDING) + Room(RESERVED) + OutboxEvent
   └─ Publish → booking.exchange [booking.created]
                        │
          ┌─────────────▼──────────────┐
          │      PaymentService         │
          │  (consumes booking.created) │
          │  Creates Payment record      │
          │  Generates VNPay URL         │
          └──────┬──────────────────────┘
                 │
    ┌────────────┴────────────┐
    │ payment.success          │ payment.failed
    ▼                          ▼
[BookingSaga]              [BookingSaga]
confirmBooking()           cancelBooking()        ← Compensating Tx
Room → AVAILABLE           Room → AVAILABLE
Booking → CONFIRMED        Booking → CANCELLED
Publish booking.confirmed  Publish booking.cancelled
    │                          │
    └──────────┬───────────────┘
               ▼
    [NotificationConsumer]
    Send email via SMTP
    Log to Notification table
```

---

## Tech Stack

### Backend

| Layer             | Technology                                |
| ----------------- | ----------------------------------------- |
| Framework         | NestJS 10 (Monolith)                      |
| Language          | TypeScript 5                              |
| ORM               | Prisma 6                                  |
| Database          | PostgreSQL 16                             |
| Connection Pool   | PgBouncer 1.22                            |
| Cache / Dist Lock | Redis 7 + ioredis                         |
| Message Broker    | RabbitMQ 3.13 (AMQP)                      |
| Authentication    | JWT (Access 15m + Refresh 7d)             |
| Authorization     | RBAC — 4 roles                            |
| Validation        | class-validator + class-transformer       |
| API Docs          | Swagger / OpenAPI 3                       |
| Email             | Nodemailer + Handlebars templates         |
| Payment           | VNPay (HMAC-SHA512)                       |
| Scheduler         | @nestjs/schedule + Redis distributed lock |

### Frontend

| Layer        | Technology                           |
| ------------ | ------------------------------------ |
| Framework    | Next.js 15 App Router                |
| Language     | TypeScript 5                         |
| Styling      | Tailwind CSS 3                       |
| State        | Zustand 5                            |
| Server State | TanStack Query v5                    |
| Forms        | React Hook Form + Zod                |
| Charts       | Recharts                             |
| HTTP         | Axios (auto JWT refresh interceptor) |
| Real-time    | Socket.io-client                     |

### Infrastructure

| Service    | Image                           | Port         |
| ---------- | ------------------------------- | ------------ |
| PostgreSQL | postgres:16-alpine              | 5432         |
| PgBouncer  | pgbouncer/pgbouncer:1.22.1      | 6432         |
| Redis      | redis:7-alpine                  | 6379         |
| RabbitMQ   | rabbitmq:3.13-management-alpine | 5672 / 15672 |

---

## Cấu trúc dự án

```
hotel-booking/
├── apps/
│   ├── api/                        # NestJS Monolith
│   │   ├── prisma/
│   │   │   ├── schema.prisma       # Database schema
│   │   │   └── seed.ts             # Seed data
│   │   └── src/
│   │       ├── auth/               # UC01: Auth + JWT + RBAC
│   │       ├── users/              # UC01: Profile + Staff management
│   │       ├── rooms/              # UC11+UC12: Inventory + Pricing
│   │       ├── search/             # UC02: Availability search (Redis cache)
│   │       ├── bookings/           # UC03+UC05: Booking CRUD
│   │       │   ├── saga/           # Choreography Saga
│   │       │   └── scheduler/      # UC16: Auto-expire (distributed lock)
│   │       ├── payments/           # UC04: VNPay + idempotent webhook
│   │       ├── staff/              # UC07-UC10: Room Map + Check-in/out + Addons
│   │       ├── reviews/            # UC06: Rating & review
│   │       ├── reports/            # UC14: Revenue + Occupancy reports
│   │       ├── notifications/      # UC15: RabbitMQ email consumer
│   │       └── common/             # Guards, Decorators, Filters, Prisma, Redis, RabbitMQ
│   └── web/                        # Next.js 15
│       └── src/app/
│           ├── (customer)/         # Search, Booking, History, Reviews
│           ├── (admin)/            # Dashboard, Rooms, Staff, Reports
│           └── (staff)/            # Room Map, Check-in/out
├── infra/
│   ├── postgres/init.sql           # Per-service schemas
│   └── rabbitmq/definitions.json   # Exchanges, queues, bindings, DLQ
├── docker-compose.yml
├── turbo.json
└── pnpm-workspace.yaml
```

---

## Cài đặt & Chạy

### Yêu cầu

- Node.js ≥ 20
- pnpm ≥ 9
- Docker & Docker Compose

### 1. Clone repo

```bash
git clone git@github.com:n0xgg04/hotel-booking-system.git
cd hotel-booking-system
```

### 2. Khởi động infrastructure

```bash
docker compose up -d
```

Kiểm tra services:

```
PostgreSQL  → localhost:5432  (via PgBouncer: 6432)
Redis       → localhost:6379
RabbitMQ    → localhost:5672
             Management UI: http://localhost:15672
             user: hotel / pass: rabbit_secret
```

### 3. Cài dependencies

```bash
pnpm install
```

### 4. Cấu hình môi trường

```bash
cp apps/api/.env.example apps/api/.env
# Chỉnh sửa các biến cần thiết (xem phần Biến môi trường)
```

### 5. Migrate database & seed

```bash
cd apps/api
pnpm db:migrate    # prisma migrate dev
pnpm db:seed       # tạo dữ liệu mẫu
```

**Tài khoản seed mặc định:**

| Email                    | Password       | Role         |
| ------------------------ | -------------- | ------------ |
| `admin@hotel.com`        | `Admin@123`    | ADMIN        |
| `receptionist@hotel.com` | `Staff@123`    | RECEPTIONIST |
| `customer@hotel.com`     | `Customer@123` | CUSTOMER     |

### 6. Chạy development

```bash
# Terminal 1 — Backend API
cd apps/api && pnpm dev
# → http://localhost:3000

# Terminal 2 — Frontend
cd apps/web && pnpm dev
# → http://localhost:3001
```

Hoặc chạy toàn bộ monorepo:

```bash
pnpm dev   # turbo run dev (parallel)
```

### 7. Build production

```bash
pnpm build
```

---

## Biến môi trường

Tạo file `apps/api/.env` từ `.env.example`:

```env
# Server
PORT=3000

# Database (qua PgBouncer)
DATABASE_URL="postgresql://hotel:hotel_secret@localhost:6432/hotel_db"

# JWT
JWT_ACCESS_SECRET=<chuỗi random ≥ 32 ký tự>
JWT_REFRESH_SECRET=<chuỗi random ≥ 32 ký tự>

# Message Broker
RABBITMQ_URL=amqp://hotel:rabbit_secret@localhost:5672/hotel_vhost

# Cache
REDIS_URL=redis://:redis_secret@localhost:6379

# Email (SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password

# VNPay
VNPAY_TMN_CODE=your_tmn_code
VNPAY_HASH_SECRET=your_hash_secret
VNPAY_URL=https://sandbox.vnpayment.vn/paymentv2/vpcpay.html
VNPAY_RETURN_URL=http://localhost:3001/payment/result

# CORS
CORS_ORIGINS=http://localhost:3001
```

---

## API Documentation

Swagger UI khả dụng sau khi chạy server:

```
http://localhost:3000/api/docs
```

### Endpoints tổng quan

| Method  | Endpoint                            | Auth     | Mô tả                     |
| ------- | ----------------------------------- | -------- | ------------------------- |
| `POST`  | `/api/v1/auth/register`             | Public   | Đăng ký                   |
| `POST`  | `/api/v1/auth/login`                | Public   | Đăng nhập                 |
| `POST`  | `/api/v1/auth/refresh`              | JWT      | Refresh token             |
| `GET`   | `/api/v1/search`                    | Public   | Tìm kiếm phòng trống      |
| `POST`  | `/api/v1/bookings`                  | Customer | Tạo đặt phòng             |
| `GET`   | `/api/v1/bookings/my`               | Customer | Lịch sử đặt phòng         |
| `POST`  | `/api/v1/bookings/:id/cancel`       | Customer | Hủy đặt phòng             |
| `GET`   | `/api/v1/payments/booking/:id`      | Customer | Thông tin thanh toán      |
| `GET`   | `/api/v1/payments/webhook/vnpay`    | Public   | VNPay callback            |
| `POST`  | `/api/v1/bookings/:id/checkin`      | Staff    | Check-in                  |
| `POST`  | `/api/v1/bookings/:id/checkout`     | Staff    | Check-out                 |
| `GET`   | `/api/v1/staff/room-map`            | Staff    | Sơ đồ phòng               |
| `PATCH` | `/api/v1/staff/rooms/:id/status`    | Staff    | Cập nhật trạng thái phòng |
| `POST`  | `/api/v1/staff/bookings/:id/addons` | Staff    | Thêm dịch vụ phát sinh    |
| `POST`  | `/api/v1/reviews`                   | Customer | Đánh giá dịch vụ          |
| `GET`   | `/api/v1/rooms/types`               | Admin    | Danh sách loại phòng      |
| `POST`  | `/api/v1/rooms/types`               | Admin    | Tạo loại phòng            |
| `GET`   | `/api/v1/reports/revenue`           | Admin    | Báo cáo doanh thu         |
| `GET`   | `/api/v1/reports/occupancy`         | Admin    | Tỷ lệ lấp phòng           |
| `GET`   | `/api/v1/users`                     | Admin    | Danh sách người dùng      |
| `PATCH` | `/api/v1/users/:id/lock`            | Admin    | Khóa tài khoản            |

---

## Git Workflow

```
main          ← production-ready, chỉ merge từ develop
│
develop       ← integration branch
│
├── feat/infra              (n0xgg04)    Monorepo setup, Prisma schema, Docker
├── feat/auth               (n0xgg04)    UC01: Auth + JWT + RBAC
├── feat/room-management    (PhucHuwu)   UC11+UC12: Rooms + Pricing
├── feat/booking-payment    (PhucHuwu)   UC03+UC04+UC16: Booking + Saga + Payment
├── feat/staff-operations   (n0xgg04)    UC07-UC10: Room Map + Check-in/out
├── feat/reporting          (n0xgg04)    UC14+UC15: Reports + Notifications
├── feat/frontend-customer  (luongdat2k4) Customer portal
└── feat/frontend-admin     (bngcVu)     Admin + Staff portal
```

**Quy tắc commit:**

```
<type>(<scope>): <subject>

type: feat | fix | chore | refactor | docs | test
scope: auth | rooms | bookings | payments | staff | reports | frontend
```

---

## Tính năng đã hoàn thành

### Buổi 1

- [x] **UC01** — Đăng ký / Đăng nhập / Quản lý hồ sơ
- [x] **UC02** — Tìm kiếm và lọc phòng (Redis cache 60s)
- [x] **UC03** — Đặt phòng (Distributed lock, Saga)
- [x] **UC04** — Thanh toán VNPay (idempotent webhook)
- [x] **UC05** — Xem lịch sử & Hủy đặt phòng
- [x] **UC06** — Đánh giá dịch vụ
- [x] **UC07** — Room Map thời gian thực
- [x] **UC08** — Check-in / Check-out
- [x] **UC09** — Cập nhật tình trạng dọn phòng
- [x] **UC10** — Ghi nhận dịch vụ phát sinh
- [x] **UC11** — Quản lý phòng (Admin CRUD)
- [x] **UC12** — Cấu hình giá linh hoạt (DEFAULT / SEASONAL / HOLIDAY)
- [x] **UC13** — Quản lý nhân viên & phân quyền
- [x] **UC14** — Báo cáo doanh thu & occupancy
- [x] **UC15** — Gửi email tự động (RabbitMQ + Nodemailer)
- [x] **UC16** — Tự động hủy đơn hết hạn thanh toán

### Các điểm kỹ thuật nổi bật

| Pattern                | Mô tả                                                                |
| ---------------------- | -------------------------------------------------------------------- |
| **Choreography Saga**  | Booking → Payment → Confirm/Compensate qua RabbitMQ events           |
| **Distributed Lock**   | Redis `SETNX` 10s ngăn double-booking khi nhiều request đồng thời    |
| **Idempotent Webhook** | `gatewayTransactionId UNIQUE` ngăn xử lý callback trùng              |
| **Outbox Pattern**     | Event ghi vào DB cùng transaction, đảm bảo không mất event khi crash |
| **Scheduler Lock**     | Cron job dùng Redis lock 55s, an toàn khi scale nhiều instance       |
| **Pricing Engine**     | Per-night tính giá theo priority: `HOLIDAY > SEASONAL > DEFAULT`     |
| **Connection Pool**    | PgBouncer transaction-mode, max 200 client connections               |
| **Dead Letter Queue**  | RabbitMQ DLQ cho tất cả consumer queues                              |

---

## Sơ đồ cơ sở dữ liệu

```
User ──────────────────────────────────────────────────────────────┐
 │                                                                 │
 │ customerId                                                      │
 ▼                                                                 │
Booking ──────────────────── Room ──────── RoomType               │
 │  │                         │               │                   │
 │  │                         │               └── PricingRule     │
 │  │                         │                                   │
 │  ├── BookingAddon          │                                   │
 │  ├── Review                │                                   │
 │  └── Payment               │                                   │
 │                            │                                   │
 └────────────────────────────┘                                   │
                                                                   │
OutboxEvent (aggregateId → Booking.id)                            │
Notification (recipientId → User.id) ◄────────────────────────────┘
```

---

<div align="center">

**Học viện Công nghệ Bưu chính Viễn thông — Khoa CNTT1**  
Môn: Phân tích Hệ thống Thương mại Điện tử · Nhóm N05 · 2026

</div>
