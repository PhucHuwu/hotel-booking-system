"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Search,
  LogIn,
  LogOut,
  Calendar,
  User as UserIcon,
  BedDouble,
} from "lucide-react";
import { api, getApiErrorMessage } from "@/lib/api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookingStatusBadge } from "@/components/ui/badge";
import { toast } from "@/lib/toast";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { Booking } from "@/lib/types";

export default function StaffCheckInPage() {
  const qc = useQueryClient();
  const [code, setCode] = useState("");
  const [bookingId, setBookingId] = useState<string | null>(null);

  const booking = useQuery<Booking>({
    queryKey: ["booking-detail", bookingId],
    enabled: Boolean(bookingId),
    queryFn: () => api.get(`/bookings/${bookingId}`).then((r) => r.data),
  });

  const find = async () => {
    if (!code.trim()) {
      toast.warning("Vui lòng nhập mã đơn");
      return;
    }
    // Try lookup by code: we don't have a dedicated search endpoint, but since
    // bookingCode follows the id format in seed, we try as id directly.
    setBookingId(code.trim());
  };

  const checkin = useMutation({
    mutationFn: (id: string) => api.post(`/bookings/${id}/checkin`),
    onSuccess: () => {
      toast.success("Check-in thành công");
      qc.invalidateQueries({ queryKey: ["booking-detail"] });
    },
    onError: (e) => toast.error("Check-in thất bại", getApiErrorMessage(e)),
  });

  const checkout = useMutation({
    mutationFn: (id: string) => api.post(`/bookings/${id}/checkout`),
    onSuccess: () => {
      toast.success("Check-out thành công");
      qc.invalidateQueries({ queryKey: ["booking-detail"] });
    },
    onError: (e) => toast.error("Check-out thất bại", getApiErrorMessage(e)),
  });

  return (
    <div>
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          Check-in / Check-out
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Nhập mã đơn đặt phòng để thực hiện thủ tục cho khách
        </p>
      </div>

      <Card className="mt-6">
        <CardContent>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
            <div className="flex-1">
              <Input
                label="Mã đơn đặt phòng"
                placeholder="Nhập mã đơn..."
                value={code}
                onChange={(e) => setCode(e.target.value)}
                leftIcon={<Search className="h-4 w-4" />}
                onKeyDown={(e) => e.key === "Enter" && find()}
              />
            </div>
            <Button onClick={find} loading={booking.isFetching}>
              <Search className="h-4 w-4" /> Tìm đơn
            </Button>
          </div>
        </CardContent>
      </Card>

      {booking.isError && (
        <Card className="mt-5 border-rose-200 bg-rose-50">
          <CardContent>
            <p className="text-sm text-rose-700">
              Không tìm thấy đơn hoặc bạn không có quyền truy cập:{" "}
              {getApiErrorMessage(booking.error)}
            </p>
          </CardContent>
        </Card>
      )}

      {booking.data && (
        <Card className="mt-5">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Chi tiết đơn</CardTitle>
              <BookingStatusBadge status={booking.data.status} />
            </div>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <InfoRow
                icon={<UserIcon className="h-4 w-4" />}
                label="Khách"
                value={`${booking.data.customer?.firstName ?? ""} ${booking.data.customer?.lastName ?? ""}`}
              />
              <InfoRow
                icon={<BedDouble className="h-4 w-4" />}
                label="Phòng"
                value={`#${booking.data.room?.roomNumber ?? ""} - ${booking.data.room?.roomType?.name ?? ""}`}
              />
              <InfoRow
                icon={<Calendar className="h-4 w-4" />}
                label="Ngày nhận phòng"
                value={formatDate(booking.data.checkIn)}
              />
              <InfoRow
                icon={<Calendar className="h-4 w-4" />}
                label="Ngày trả phòng"
                value={formatDate(booking.data.checkOut)}
              />
            </div>

            <div className="flex items-center justify-between rounded-xl bg-slate-50 p-4">
              <div>
                <p className="text-xs text-slate-500">Tổng tiền</p>
                <p className="text-2xl font-bold text-brand-700">
                  {formatCurrency(booking.data.totalAmount)}
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={() => checkin.mutate(booking.data!.id)}
                  loading={checkin.isPending}
                  disabled={booking.data.status !== "CONFIRMED"}
                >
                  <LogIn className="h-4 w-4" /> Check-in
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => checkout.mutate(booking.data!.id)}
                  loading={checkout.isPending}
                  disabled={booking.data.status !== "CHECKED_IN"}
                >
                  <LogOut className="h-4 w-4" /> Check-out
                </Button>
              </div>
            </div>

            {booking.data.guestNotes && (
              <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm">
                <p className="font-medium text-amber-800">Ghi chú khách:</p>
                <p className="mt-1 text-amber-700">{booking.data.guestNotes}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-3">
      <p className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
        {icon} {label}
      </p>
      <p className="mt-1 text-sm font-semibold text-slate-900">{value}</p>
    </div>
  );
}
