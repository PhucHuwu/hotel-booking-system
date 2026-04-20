"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Calendar,
  XCircle,
  BedDouble,
  Tag,
  Clock,
  CreditCard,
  AlertCircle,
} from "lucide-react";
import { api, getApiErrorMessage } from "@/lib/api";
import { useAuthStore } from "@/lib/auth-store";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton, EmptyState } from "@/components/ui/skeleton";
import { Modal } from "@/components/ui/modal";
import { BookingStatusBadge, bookingStatusLabel } from "@/components/ui/badge";
import { Select } from "@/components/ui/select";
import { toast } from "@/lib/toast";
import { formatCurrency, formatDate, diffNights } from "@/lib/utils";
import type { Booking, BookingStatus } from "@/lib/types";

const STATUSES:
  | { value: ""; label: string }[]
  | { value: string; label: string }[] = [
  { value: "", label: "Tất cả" },
  { value: "PENDING_PAYMENT", label: "Chờ thanh toán" },
  { value: "CONFIRMED", label: "Đã xác nhận" },
  { value: "CHECKED_IN", label: "Đang lưu trú" },
  { value: "CHECKED_OUT", label: "Đã hoàn thành" },
  { value: "CANCELLED", label: "Đã hủy" },
];

export default function MyBookingsPage() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const hydrated = useAuthStore((s) => s.hydrated);
  const [status, setStatus] = useState<string>("");
  const [cancelTarget, setCancelTarget] = useState<Booking | null>(null);
  const qc = useQueryClient();

  useEffect(() => {
    if (hydrated && !user) router.replace("/login?next=/my-bookings");
  }, [hydrated, user, router]);

  const q = useQuery({
    queryKey: ["my-bookings", status],
    enabled: Boolean(user),
    queryFn: () =>
      api
        .get("/bookings/my", {
          params: { page: 1, limit: 20, ...(status ? { status } : {}) },
        })
        .then((r) => r.data),
  });

  const cancelM = useMutation({
    mutationFn: (id: string) =>
      api.post(`/bookings/${id}/cancel`, {}).then((r) => r.data),
    onSuccess: () => {
      toast.success("Đã hủy đơn thành công");
      setCancelTarget(null);
      qc.invalidateQueries({ queryKey: ["my-bookings"] });
    },
    onError: (e) => toast.error("Hủy đơn thất bại", getApiErrorMessage(e)),
  });

  const payM = useMutation({
    mutationFn: (bookingId: string) =>
      api
        .post("/payments/initiate", { bookingId, method: "VNPAY" })
        .then((r) => r.data),
    onSuccess: (data) => {
      if (data.gatewayUrl) window.location.href = data.gatewayUrl;
    },
    onError: (e) =>
      toast.error("Không thể mở thanh toán", getApiErrorMessage(e)),
  });

  const items: Booking[] = q.data?.data ?? [];

  return (
    <main className="container-page py-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Đơn của tôi</h1>
          <p className="mt-1 text-sm text-slate-500">
            Xem và quản lý các đơn đặt phòng của bạn
          </p>
        </div>
        <div className="w-full sm:w-60">
          <Select
            label="Trạng thái"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            {STATUSES.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </Select>
        </div>
      </div>

      <div className="mt-6 space-y-4">
        {q.isLoading && <ListSkeleton />}
        {q.error && (
          <EmptyState
            icon={<AlertCircle className="h-5 w-5" />}
            title="Không tải được dữ liệu"
            description={getApiErrorMessage(q.error)}
          />
        )}
        {q.data && items.length === 0 && (
          <EmptyState
            icon={<BedDouble className="h-5 w-5" />}
            title="Bạn chưa có đơn đặt phòng nào"
            description="Khám phá các phòng khách sạn của chúng tôi và đặt ngay."
            action={
              <Button onClick={() => router.push("/rooms")}>Tìm phòng</Button>
            }
          />
        )}
        {items.map((b) => (
          <BookingItem
            key={b.id}
            booking={b}
            onCancel={() => setCancelTarget(b)}
            onPay={() => payM.mutate(b.id)}
            paying={payM.isPending}
          />
        ))}
      </div>

      <Modal
        open={!!cancelTarget}
        onClose={() => setCancelTarget(null)}
        title="Xác nhận hủy đơn"
        description={`Bạn có chắc muốn hủy đơn ${cancelTarget?.bookingCode}?`}
        footer={
          <>
            <Button variant="ghost" onClick={() => setCancelTarget(null)}>
              Quay lại
            </Button>
            <Button
              variant="danger"
              loading={cancelM.isPending}
              onClick={() => cancelTarget && cancelM.mutate(cancelTarget.id)}
            >
              Hủy đơn
            </Button>
          </>
        }
      >
        <p className="text-sm text-slate-600">
          Hành động này không thể hoàn tác. Phòng sẽ được giải phóng cho khách
          khác đặt.
        </p>
      </Modal>
    </main>
  );
}

function BookingItem({
  booking,
  onCancel,
  onPay,
  paying,
}: {
  booking: Booking;
  onCancel: () => void;
  onPay: () => void;
  paying: boolean;
}) {
  const nights = diffNights(booking.checkIn, booking.checkOut);
  const canCancel: BookingStatus[] = ["PENDING_PAYMENT", "CONFIRMED"];
  const canPay: BookingStatus[] = ["PENDING_PAYMENT"];
  return (
    <Card>
      <CardContent className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-1 items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
            <BedDouble className="h-6 w-6" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <p className="font-semibold text-slate-900">
                {booking.room?.roomType?.name ?? "Phòng"} · #
                {booking.room?.roomNumber}
              </p>
              <BookingStatusBadge status={booking.status} />
            </div>
            <p className="mt-0.5 text-xs text-slate-500">
              <Tag className="mr-1 inline h-3 w-3" />
              {booking.bookingCode}
            </p>
            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-600">
              <span className="inline-flex items-center gap-1.5">
                <Calendar className="h-4 w-4 text-slate-400" />
                {formatDate(booking.checkIn)} → {formatDate(booking.checkOut)} (
                {nights} đêm)
              </span>
              {booking.status === "PENDING_PAYMENT" && (
                <span className="inline-flex items-center gap-1.5 text-amber-700">
                  <Clock className="h-4 w-4" /> Hạn thanh toán:{" "}
                  {formatDate(booking.paymentDeadline)}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col items-end gap-2">
          <p className="text-xl font-bold text-brand-700">
            {formatCurrency(booking.totalAmount)}
          </p>
          <div className="flex gap-2">
            {canPay.includes(booking.status) && (
              <Button size="sm" onClick={onPay} loading={paying}>
                <CreditCard className="h-4 w-4" /> Thanh toán
              </Button>
            )}
            {canCancel.includes(booking.status) && (
              <Button size="sm" variant="outline" onClick={onCancel}>
                <XCircle className="h-4 w-4" /> Hủy
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function ListSkeleton() {
  return (
    <>
      {Array.from({ length: 3 }).map((_, i) => (
        <div
          key={i}
          className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5"
        >
          <Skeleton className="h-12 w-12 rounded-xl" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-3 w-1/2" />
          </div>
          <Skeleton className="h-9 w-24" />
        </div>
      ))}
    </>
  );
}
