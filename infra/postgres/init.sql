-- Create separate schemas per service (logical isolation)
CREATE SCHEMA IF NOT EXISTS auth_svc;
CREATE SCHEMA IF NOT EXISTS room_svc;
CREATE SCHEMA IF NOT EXISTS booking_svc;
CREATE SCHEMA IF NOT EXISTS payment_svc;
CREATE SCHEMA IF NOT EXISTS notification_svc;

-- Outbox table for transactional outbox pattern (shared)
CREATE TABLE IF NOT EXISTS outbox_events (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  aggregate_id  VARCHAR(255) NOT NULL,
  event_type    VARCHAR(255) NOT NULL,
  payload       JSONB        NOT NULL,
  published     BOOLEAN      NOT NULL DEFAULT FALSE,
  created_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_outbox_unpublished ON outbox_events (published, created_at)
  WHERE published = FALSE;
