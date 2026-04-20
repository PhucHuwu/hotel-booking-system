"use client";

export const dynamic = "force-dynamic";

import { Suspense } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import {
  CalendarDays,
  Users,
  Search,
  BedDouble,
  Maximize2,
  Wifi,
  Coffee,
  AlertCircle,
} from "lucide-react";
import { api, getApiErrorMessage } from "@/lib/api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton, EmptyState } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import type { RoomType } from "@/lib/types";

interface SearchItem {
  roomType: RoomType;
  availableRooms: number;
  availableRoomIds: string[];
  pricePerNight: number;
  totalPrice: number;
  nights: number;
}

function todayISO(offset = 0) {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  return d.toISOString().slice(0, 10);
}

export default function RoomsSearchPage() {
  return (
    <Suspense fallback={null}>
      <RoomsSearchInner />
    </Suspense>
  );
}

function RoomsSearchInner() {
  const sp = useSearchParams();
  const router = useRouter();

  const [checkIn, setCheckIn] = useState(sp.get("checkIn") ?? todayISO(1));
  const [checkOut, setCheckOut] = useState(sp.get("checkOut") ?? todayISO(2));
  const [guests, setGuests] = useState(Number(sp.get("guests") ?? 2));

  // Reflect URL params changes
  useEffect(() => {
    const i = sp.get("checkIn");
    const o = sp.get("checkOut");
    const g = sp.get("guests");
    if (i) setCheckIn(i);
    if (o) setCheckOut(o);
    if (g) setGuests(Number(g));
  }, [sp]);

  const enabled = Boolean(checkIn && checkOut && guests > 0);
  const q = useQuery({
    queryKey: ["search", checkIn, checkOut, guests],
    enabled,
    queryFn: () =>
      api
        .get<SearchItem[]>("/search", {
          params: { checkIn, checkOut, guests },
        })
        .then((r) => r.data),
  });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const qs = new URLSearchParams({
      checkIn,
      checkOut,
      guests: String(guests),
    });
    router.push(`/rooms?${qs.toString()}`);
  };

  return (
    <main className="container-page py-8">
      <h1 className="text-2xl font-bold text-slate-900">
        Tìm phòng phù hợp với bạn
      </h1>
      <p className="mt-1 text-sm text-slate-500">
        Lựa chọn ngày và số khách để xem các phòng còn trống
      </p>

      <form
        onSubmit={submit}
        className="mt-6 grid grid-cols-1 gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-card md:grid-cols-4"
      >
        <Input
          label="Nhận phòng"
          type="date"
          min={todayISO()}
          value={checkIn}
          onChange={(e) => setCheckIn(e.target.value)}
          leftIcon={<CalendarDays className="h-4 w-4" />}
        />
        <Input
          label="Trả phòng"
          type="date"
          min={checkIn}
          value={checkOut}
          onChange={(e) => setCheckOut(e.target.value)}
          leftIcon={<CalendarDays className="h-4 w-4" />}
        />
        <Input
          label="Số khách"
          type="number"
          min={1}
          max={10}
          value={guests}
          onChange={(e) => setGuests(Number(e.target.value))}
          leftIcon={<Users className="h-4 w-4" />}
        />
        <div className="flex items-end">
          <Button
            type="submit"
            className="w-full"
            size="lg"
            loading={q.isFetching}
          >
            <Search className="h-4 w-4" /> Tìm kiếm
          </Button>
        </div>
      </form>

      <div className="mt-8">
        {q.isLoading && <ResultsSkeleton />}
        {q.error && (
          <EmptyState
            icon={<AlertCircle className="h-5 w-5" />}
            title="Không thể tải kết quả"
            description={getApiErrorMessage(q.error)}
          />
        )}
        {q.data && q.data.length === 0 && (
          <EmptyState
            icon={<BedDouble className="h-5 w-5" />}
            title="Không tìm thấy phòng phù hợp"
            description="Hãy thử thay đổi ngày hoặc số khách để xem thêm lựa chọn."
          />
        )}
        {q.data && q.data.length > 0 && (
          <>
            <p className="mb-4 text-sm text-slate-600">
              Tìm thấy <span className="font-semibold">{q.data.length}</span>{" "}
              loại phòng phù hợp ·{" "}
              <span className="font-semibold">{q.data[0].nights}</span> đêm
            </p>
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
              {q.data.map((item) => (
                <RoomCard
                  key={item.roomType.id}
                  item={item}
                  checkIn={checkIn}
                  checkOut={checkOut}
                  guests={guests}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </main>
  );
}

function RoomCard({
  item,
  checkIn,
  checkOut,
  guests,
}: {
  item: SearchItem;
  checkIn: string;
  checkOut: string;
  guests: number;
}) {
  const router = useRouter();
  const img =
    (item.roomType.images && item.roomType.images[0]) ||
    `https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=900&auto=format&fit=crop`;

  const goBook = () => {
    const qs = new URLSearchParams({
      roomTypeId: item.roomType.id,
      roomId: item.availableRoomIds[0] ?? "",
      checkIn,
      checkOut,
      guests: String(guests),
    });
    router.push(`/booking?${qs.toString()}`);
  };

  return (
    <Card className="overflow-hidden">
      <div className="relative h-56 w-full overflow-hidden bg-slate-100">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={img}
          alt={item.roomType.name}
          className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
        />
        <div className="absolute top-3 right-3 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-emerald-700 shadow ring-1 ring-emerald-200">
          Còn {item.availableRooms} phòng
        </div>
      </div>
      <CardContent className="space-y-3">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">
            {item.roomType.name}
          </h3>
          <p className="mt-1 line-clamp-2 text-sm text-slate-500">
            {item.roomType.description ?? "Phòng đầy đủ tiện nghi."}
          </p>
        </div>

        <div className="flex flex-wrap gap-3 text-xs text-slate-600">
          <span className="inline-flex items-center gap-1.5">
            <Users className="h-4 w-4 text-slate-400" /> Tối đa{" "}
            {item.roomType.maxGuests} khách
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Maximize2 className="h-4 w-4 text-slate-400" />{" "}
            {item.roomType.areaSqm} m²
          </span>
          <span className="inline-flex items-center gap-1.5">
            <BedDouble className="h-4 w-4 text-slate-400" />{" "}
            {item.roomType.bedType}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Wifi className="h-4 w-4 text-slate-400" /> Wifi
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Coffee className="h-4 w-4 text-slate-400" /> Mini-bar
          </span>
        </div>

        <div className="flex items-end justify-between border-t border-slate-100 pt-3">
          <div>
            <p className="text-xs text-slate-500">
              {item.nights} đêm · Tổng cộng
            </p>
            <p className="text-2xl font-bold text-brand-700">
              {formatCurrency(item.totalPrice)}
            </p>
            <p className="text-xs text-slate-500">
              {formatCurrency(item.pricePerNight)} / đêm
            </p>
          </div>
          <Button onClick={goBook}>Đặt phòng</Button>
        </div>
      </CardContent>
    </Card>
  );
}

function ResultsSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="overflow-hidden rounded-2xl border border-slate-200 bg-white"
        >
          <Skeleton className="h-56 w-full rounded-none" />
          <div className="space-y-3 p-5">
            <Skeleton className="h-5 w-2/3" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <div className="flex justify-between pt-2">
              <Skeleton className="h-8 w-32" />
              <Skeleton className="h-9 w-24" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
