"use client";

export const dynamic = "force-dynamic";

import { Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import {
  CalendarDays,
  Users,
  CheckCircle2,
  CreditCard,
  Wallet,
  Banknote,
} from "lucide-react";
import { api, getApiErrorMessage } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuthStore } from "@/lib/auth-store";
import { toast } from "@/lib/toast";
import { formatCurrency, formatDate, diffNights, cn } from "@/lib/utils";

interface RoomTypeDetail {
  id: string;
  name: string;
  description?: string | null;
  maxGuests: number;
  areaSqm: number;
  bedType: string;
  images: string[];
  amenities: string[];
}

type Method = "VNPAY" | "MOMO" | "CASH";

export default function BookingPage() {
  return (
    <Suspense fallback={null}>
      <BookingInner />
    </Suspense>
  );
}

function BookingInner() {
  const sp = useSearchParams();
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const hydrated = useAuthStore((s) => s.hydrated);

  const roomTypeId = sp.get("roomTypeId") ?? "";
  const roomId = sp.get("roomId") ?? "";
  const checkIn = sp.get("checkIn") ?? "";
  const checkOut = sp.get("checkOut") ?? "";
  const guests = Number(sp.get("guests") ?? 2);

  const [notes, setNotes] = useState("");
  const [method, setMethod] = useState<Method>("VNPAY");

  useEffect(() => {
    if (hydrated && !user) {
      router.replace(
        `/login?next=${encodeURIComponent("/booking?" + sp.toString())}`,
      );
    }
  }, [hydrated, user, router, sp]);

  const rt = useQuery({
    queryKey: ["roomType", roomTypeId],
    enabled: Boolean(roomTypeId),
    queryFn: () =>
      api.get<RoomTypeDetail>(`/rooms/types/${roomTypeId}`).then((r) => r.data),
  });

  // Recompute price (using search endpoint with constraint)
  const priceQ = useQuery({
    queryKey: ["bookingPrice", roomTypeId, checkIn, checkOut, guests],
    enabled: Boolean(roomTypeId && checkIn && checkOut),
    queryFn: () =>
      api
        .get("/search", {
          params: { checkIn, checkOut, guests, roomTypeId },
        })
        .then((r) => r.data?.[0]),
  });

  const create = useMutation({
    mutationFn: () =>
      api
        .post("/bookings", {
          roomId,
          checkIn,
          checkOut,
          guestNotes: notes || undefined,
        })
        .then((r) => r.data),
    onSuccess: async (booking) => {
      toast.success("Tạo đơn thành công", `Mã đơn: ${booking.bookingCode}`);
      // Init payment
      try {
        const pay = await api
          .post("/payments/initiate", { bookingId: booking.id, method })
          .then((r) => r.data);
        if (pay.gatewayUrl) {
          toast.info("Đang chuyển sang cổng thanh toán…");
          window.location.href = pay.gatewayUrl;
          return;
        }
        if (method === "CASH") {
          toast.info(
            "Vui lòng thanh toán tại quầy",
            "Đơn của bạn đã được tạo và đang chờ xác nhận.",
          );
        }
        router.push("/my-bookings");
      } catch (e) {
        toast.warning(
          "Không tạo được phiên thanh toán",
          "Vui lòng thử lại trong mục Đơn của tôi.",
        );
        router.push("/my-bookings");
      }
    },
    onError: (err) =>
      toast.error("Đặt phòng thất bại", getApiErrorMessage(err)),
  });

  if (!roomTypeId || !roomId || !checkIn || !checkOut) {
    return (
      <main className="container-page py-10">
        <Card>
          <CardContent>
            <p className="text-slate-700">
              Thiếu thông tin đặt phòng. Vui lòng quay lại và chọn phòng.
            </p>
            <div className="mt-4">
              <Button onClick={() => router.push("/rooms")}>Tìm phòng</Button>
            </div>
          </CardContent>
        </Card>
      </main>
    );
  }

  const nights = diffNights(checkIn, checkOut);
  const total = priceQ.data?.totalPrice ?? 0;
  const pricePerNight = priceQ.data?.pricePerNight ?? 0;

  return (
    <main className="container-page py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">
          Xác nhận đặt phòng
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Vui lòng kiểm tra lại thông tin trước khi xác nhận
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Thông tin lưu trú</CardTitle>
            </CardHeader>
            <CardContent>
              {rt.isLoading ? (
                <Skeleton className="h-32 w-full" />
              ) : rt.data ? (
                <div className="flex gap-4">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={
                      rt.data.images[0] ||
                      "https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=400"
                    }
                    alt={rt.data.name}
                    className="h-32 w-44 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-slate-900">
                      {rt.data.name}
                    </h3>
                    <p className="text-sm text-slate-500">
                      {rt.data.bedType} · {rt.data.areaSqm} m² · Tối đa{" "}
                      {rt.data.maxGuests} khách
                    </p>
                    <div className="mt-3 flex flex-wrap gap-3 text-sm text-slate-700">
                      <Stat
                        icon={<CalendarDays className="h-4 w-4" />}
                        label="Nhận phòng"
                        value={formatDate(checkIn)}
                      />
                      <Stat
                        icon={<CalendarDays className="h-4 w-4" />}
                        label="Trả phòng"
                        value={formatDate(checkOut)}
                      />
                      <Stat
                        icon={<Users className="h-4 w-4" />}
                        label="Khách"
                        value={`${guests} người`}
                      />
                    </div>
                  </div>
                </div>
              ) : null}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Yêu cầu đặc biệt</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                rows={4}
                placeholder="Ví dụ: Phòng tầng cao, gần thang máy…"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Phương thức thanh toán</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <PayOption
                  active={method === "VNPAY"}
                  onClick={() => setMethod("VNPAY")}
                  icon={<CreditCard className="h-5 w-5" />}
                  title="VNPay"
                  desc="Thanh toán bằng ATM/Visa qua VNPay"
                />
                <PayOption
                  active={method === "MOMO"}
                  onClick={() => setMethod("MOMO")}
                  icon={<Wallet className="h-5 w-5" />}
                  title="MoMo"
                  desc="Ví điện tử MoMo"
                />
                <PayOption
                  active={method === "CASH"}
                  onClick={() => setMethod("CASH")}
                  icon={<Banknote className="h-5 w-5" />}
                  title="Tại quầy"
                  desc="Thanh toán khi nhận phòng"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle>Tóm tắt đơn</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Row
                label={`${formatCurrency(pricePerNight)} × ${nights} đêm`}
                value={formatCurrency(pricePerNight * nights)}
              />
              <Row label="Phí dịch vụ" value="Miễn phí" />
              <div className="border-t border-slate-100 pt-3">
                <Row bold label="Tổng cộng" value={formatCurrency(total)} />
              </div>
              <Button
                size="lg"
                className="w-full"
                loading={create.isPending}
                disabled={!user || priceQ.isLoading}
                onClick={() => create.mutate()}
              >
                <CheckCircle2 className="h-4 w-4" /> Xác nhận đặt phòng
              </Button>
              <p className="text-xs text-slate-500">
                Đơn sẽ tự động hủy sau 15 phút nếu không thanh toán.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}

function Stat({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-lg bg-slate-50 px-3 py-2">
      <p className="flex items-center gap-1.5 text-xs text-slate-500">
        {icon} {label}
      </p>
      <p className="text-sm font-medium text-slate-900">{value}</p>
    </div>
  );
}

function Row({
  label,
  value,
  bold,
}: {
  label: string;
  value: string;
  bold?: boolean;
}) {
  return (
    <div className="flex items-center justify-between">
      <span
        className={cn(
          "text-sm",
          bold ? "font-semibold text-slate-900" : "text-slate-600",
        )}
      >
        {label}
      </span>
      <span
        className={cn(
          bold ? "text-lg font-bold text-brand-700" : "text-sm text-slate-900",
        )}
      >
        {value}
      </span>
    </div>
  );
}

function PayOption({
  active,
  onClick,
  icon,
  title,
  desc,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex flex-col gap-2 rounded-xl border p-4 text-left transition-all",
        active
          ? "border-brand-500 bg-brand-50/50 ring-2 ring-brand-200"
          : "border-slate-200 bg-white hover:border-slate-300",
      )}
    >
      <span
        className={cn(
          "flex h-9 w-9 items-center justify-center rounded-lg",
          active ? "bg-brand-600 text-white" : "bg-slate-100 text-slate-600",
        )}
      >
        {icon}
      </span>
      <div>
        <p className="text-sm font-semibold text-slate-900">{title}</p>
        <p className="text-xs text-slate-500">{desc}</p>
      </div>
    </button>
  );
}
