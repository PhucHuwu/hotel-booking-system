"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Map as MapIcon, RefreshCw } from "lucide-react";
import { api, getApiErrorMessage } from "@/lib/api";
import { Card } from "@/components/ui/card";
import { Skeleton, EmptyState } from "@/components/ui/skeleton";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { roomStatusLabel } from "@/components/ui/badge";
import { toast } from "@/lib/toast";
import { cn } from "@/lib/utils";
import type { RoomStatus } from "@/lib/types";

interface RoomCell {
  id: string;
  roomNumber: string;
  floor: number;
  status: RoomStatus;
  roomType?: { name: string; maxGuests: number };
  bookings?: {
    id: string;
    bookingCode: string;
    customer?: { firstName: string; lastName: string };
  }[];
}

const statusStyle: Record<RoomStatus, string> = {
  AVAILABLE:
    "bg-emerald-50 border-emerald-200 hover:border-emerald-400 text-emerald-900",
  OCCUPIED:
    "bg-violet-50 border-violet-200 hover:border-violet-400 text-violet-900",
  RESERVED: "bg-sky-50 border-sky-200 hover:border-sky-400 text-sky-900",
  DIRTY: "bg-rose-50 border-rose-200 hover:border-rose-400 text-rose-900",
  CLEANING:
    "bg-amber-50 border-amber-200 hover:border-amber-400 text-amber-900",
  MAINTENANCE:
    "bg-slate-100 border-slate-300 hover:border-slate-400 text-slate-900",
};

const statusDot: Record<RoomStatus, string> = {
  AVAILABLE: "bg-emerald-500",
  OCCUPIED: "bg-violet-500",
  RESERVED: "bg-sky-500",
  DIRTY: "bg-rose-500",
  CLEANING: "bg-amber-500",
  MAINTENANCE: "bg-slate-500",
};

export default function StaffRoomMapPage() {
  const qc = useQueryClient();
  const [floor, setFloor] = useState<string>("");
  const [selected, setSelected] = useState<RoomCell | null>(null);

  const q = useQuery({
    queryKey: ["room-map", floor],
    queryFn: () =>
      api
        .get<RoomCell[]>("/staff/room-map", {
          params: floor ? { floor } : {},
        })
        .then((r) => r.data),
  });

  const updateStatus = useMutation({
    mutationFn: ({ id, status }: { id: string; status: RoomStatus }) =>
      api.patch(`/staff/room-map/${id}`, { status }),
    onSuccess: () => {
      toast.success("Đã cập nhật trạng thái");
      qc.invalidateQueries({ queryKey: ["room-map"] });
      setSelected(null);
    },
    onError: (e) => toast.error("Lỗi", getApiErrorMessage(e)),
  });

  const floors = Array.from(new Set((q.data ?? []).map((r) => r.floor))).sort(
    (a, b) => a - b,
  );
  const grouped: Record<number, RoomCell[]> = {};
  (q.data ?? []).forEach((r) => {
    grouped[r.floor] ??= [];
    grouped[r.floor].push(r);
  });

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Sơ đồ phòng</h1>
          <p className="mt-1 text-sm text-slate-500">
            Theo dõi trạng thái phòng theo thời gian thực
          </p>
        </div>
        <div className="flex items-end gap-3">
          <div className="w-40">
            <Select
              label="Tầng"
              value={floor}
              onChange={(e) => setFloor(e.target.value)}
            >
              <option value="">Tất cả</option>
              {floors.map((f) => (
                <option key={f} value={f}>
                  Tầng {f}
                </option>
              ))}
            </Select>
          </div>
          <Button variant="outline" onClick={() => q.refetch()}>
            <RefreshCw className="h-4 w-4" /> Tải lại
          </Button>
        </div>
      </div>

      {/* Legend */}
      <div className="mt-4 flex flex-wrap gap-3 rounded-xl border border-slate-200 bg-white p-3 text-xs">
        {(Object.keys(statusDot) as RoomStatus[]).map((s) => (
          <span key={s} className="inline-flex items-center gap-1.5">
            <span className={cn("h-2.5 w-2.5 rounded-full", statusDot[s])} />
            {roomStatusLabel(s)}
          </span>
        ))}
      </div>

      <div className="mt-6 space-y-6">
        {q.isLoading && <Skeleton className="h-64 w-full" />}
        {q.data && q.data.length === 0 && (
          <EmptyState
            icon={<MapIcon className="h-5 w-5" />}
            title="Không có phòng"
          />
        )}
        {Object.entries(grouped).map(([fl, rooms]) => (
          <Card key={fl} className="p-5">
            <div className="mb-3 flex items-center gap-3">
              <span className="rounded-md bg-slate-900 px-2 py-1 text-xs font-bold text-white">
                Tầng {fl}
              </span>
              <span className="text-sm text-slate-500">
                {rooms.length} phòng
              </span>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8">
              {rooms.map((r) => (
                <button
                  key={r.id}
                  onClick={() => setSelected(r)}
                  className={cn(
                    "rounded-xl border-2 p-3 text-left transition-all hover:-translate-y-0.5 hover:shadow-md",
                    statusStyle[r.status],
                  )}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold">#{r.roomNumber}</span>
                    <span
                      className={cn(
                        "h-2 w-2 rounded-full",
                        statusDot[r.status],
                      )}
                    />
                  </div>
                  <p className="mt-1 truncate text-xs opacity-80">
                    {r.roomType?.name}
                  </p>
                  <p className="mt-0.5 text-[10px] font-medium uppercase tracking-wide opacity-70">
                    {roomStatusLabel(r.status)}
                  </p>
                </button>
              ))}
            </div>
          </Card>
        ))}
      </div>

      {/* Detail modal */}
      {selected && (
        <Detail
          room={selected}
          onClose={() => setSelected(null)}
          loading={updateStatus.isPending}
          onChange={(status) =>
            updateStatus.mutate({ id: selected.id, status })
          }
        />
      )}
    </div>
  );
}

function Detail({
  room,
  onClose,
  onChange,
  loading,
}: {
  room: RoomCell;
  onClose: () => void;
  onChange: (s: RoomStatus) => void;
  loading: boolean;
}) {
  const all: RoomStatus[] = [
    "AVAILABLE",
    "OCCUPIED",
    "DIRTY",
    "CLEANING",
    "MAINTENANCE",
    "RESERVED",
  ];
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/50" onClick={onClose} />
      <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
        <h3 className="text-lg font-semibold text-slate-900">
          Phòng #{room.roomNumber}
        </h3>
        <p className="text-sm text-slate-500">
          Tầng {room.floor} · {room.roomType?.name}
        </p>

        {room.bookings && room.bookings.length > 0 && (
          <div className="mt-3 rounded-xl bg-slate-50 p-3 text-sm">
            <p className="font-medium text-slate-700">Khách hiện tại:</p>
            <p className="text-slate-900">
              {room.bookings[0].customer?.firstName}{" "}
              {room.bookings[0].customer?.lastName}
            </p>
            <p className="text-xs text-slate-500">
              Mã đơn: {room.bookings[0].bookingCode}
            </p>
          </div>
        )}

        <div className="mt-4">
          <p className="mb-2 text-sm font-medium text-slate-700">
            Cập nhật trạng thái
          </p>
          <div className="grid grid-cols-2 gap-2">
            {all.map((s) => (
              <button
                key={s}
                onClick={() => onChange(s)}
                disabled={loading || s === room.status}
                className={cn(
                  "rounded-lg border-2 p-2 text-sm font-medium transition-colors",
                  s === room.status
                    ? "border-brand-500 bg-brand-50 text-brand-700"
                    : "border-slate-200 hover:border-slate-300",
                )}
              >
                {roomStatusLabel(s)}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-5 flex justify-end">
          <button
            onClick={onClose}
            className="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}
