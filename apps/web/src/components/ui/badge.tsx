import { cn } from "@/lib/utils";
import type { BookingStatus, RoomStatus } from "@/lib/types";

type Tone = "slate" | "green" | "amber" | "rose" | "sky" | "violet" | "emerald";

const tones: Record<Tone, string> = {
  slate: "bg-slate-100 text-slate-700 ring-slate-200",
  green: "bg-green-50 text-green-700 ring-green-200",
  amber: "bg-amber-50 text-amber-700 ring-amber-200",
  rose: "bg-rose-50 text-rose-700 ring-rose-200",
  sky: "bg-sky-50 text-sky-700 ring-sky-200",
  violet: "bg-violet-50 text-violet-700 ring-violet-200",
  emerald: "bg-emerald-50 text-emerald-700 ring-emerald-200",
};

export function Badge({
  tone = "slate",
  className,
  children,
}: {
  tone?: Tone;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

const bookingMap: Record<BookingStatus, { tone: Tone; label: string }> = {
  PENDING_PAYMENT: { tone: "amber", label: "Chờ thanh toán" },
  PAYING: { tone: "sky", label: "Đang thanh toán" },
  CONFIRMED: { tone: "emerald", label: "Đã xác nhận" },
  CHECKED_IN: { tone: "violet", label: "Đang lưu trú" },
  CHECKED_OUT: { tone: "slate", label: "Đã trả phòng" },
  CANCELLED: { tone: "rose", label: "Đã hủy" },
  EXPIRED: { tone: "rose", label: "Hết hạn" },
};

export function BookingStatusBadge({ status }: { status: BookingStatus }) {
  const s = bookingMap[status];
  return <Badge tone={s.tone}>{s.label}</Badge>;
}

const roomMap: Record<RoomStatus, { tone: Tone; label: string }> = {
  AVAILABLE: { tone: "emerald", label: "Trống" },
  OCCUPIED: { tone: "violet", label: "Đang ở" },
  DIRTY: { tone: "rose", label: "Bẩn" },
  CLEANING: { tone: "amber", label: "Đang dọn" },
  MAINTENANCE: { tone: "slate", label: "Bảo trì" },
  RESERVED: { tone: "sky", label: "Đã đặt" },
};

export function RoomStatusBadge({ status }: { status: RoomStatus }) {
  const s = roomMap[status];
  return <Badge tone={s.tone}>{s.label}</Badge>;
}

export const bookingStatusLabel = (s: BookingStatus) => bookingMap[s].label;
export const roomStatusLabel = (s: RoomStatus) => roomMap[s].label;
