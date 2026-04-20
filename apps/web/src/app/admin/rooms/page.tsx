"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { api, getApiErrorMessage } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { Select } from "@/components/ui/select";
import { Skeleton, EmptyState } from "@/components/ui/skeleton";
import { RoomStatusBadge } from "@/components/ui/badge";
import { toast } from "@/lib/toast";
import type { Room, RoomStatus } from "@/lib/types";

const schema = z.object({
  roomNumber: z.string().min(1, "Bắt buộc"),
  floor: z.coerce.number().int().min(0).max(100),
  roomTypeId: z.string().min(1, "Bắt buộc"),
  notes: z.string().optional(),
});
type FormValues = z.infer<typeof schema>;

export default function AdminRoomsPage() {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [floor, setFloor] = useState<string>("");
  const [roomTypeId, setRoomTypeId] = useState<string>("");

  const rooms = useQuery({
    queryKey: ["admin-rooms", floor, roomTypeId],
    queryFn: () =>
      api
        .get<Room[]>("/rooms", {
          params: {
            ...(floor ? { floor } : {}),
            ...(roomTypeId ? { roomTypeId } : {}),
          },
        })
        .then((r) => r.data),
  });

  const types = useQuery({
    queryKey: ["roomTypes"],
    queryFn: () => api.get("/rooms/types").then((r) => r.data),
  });

  const create = useMutation({
    mutationFn: (data: FormValues) => api.post("/rooms", data),
    onSuccess: () => {
      toast.success("Tạo phòng thành công");
      setOpen(false);
      qc.invalidateQueries({ queryKey: ["admin-rooms"] });
    },
    onError: (e) => toast.error("Lỗi", getApiErrorMessage(e)),
  });

  const updateStatus = useMutation({
    mutationFn: ({ id, status }: { id: string; status: RoomStatus }) =>
      api.patch(`/rooms/${id}`, { status }),
    onSuccess: () => {
      toast.success("Đã cập nhật");
      qc.invalidateQueries({ queryKey: ["admin-rooms"] });
    },
    onError: (e) => toast.error("Lỗi", getApiErrorMessage(e)),
  });

  const del = useMutation({
    mutationFn: (id: string) => api.delete(`/rooms/${id}`),
    onSuccess: () => {
      toast.success("Đã xóa");
      qc.invalidateQueries({ queryKey: ["admin-rooms"] });
    },
    onError: (e) => toast.error("Không thể xóa", getApiErrorMessage(e)),
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { floor: 1, roomNumber: "", roomTypeId: "", notes: "" },
  });

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Quản lý phòng</h1>
          <p className="mt-1 text-sm text-slate-500">
            Thêm phòng mới và cập nhật trạng thái
          </p>
        </div>
        <Button onClick={() => setOpen(true)}>
          <Plus className="h-4 w-4" /> Thêm phòng
        </Button>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-3 rounded-2xl border border-slate-200 bg-white p-4 sm:grid-cols-3">
        <Select
          label="Loại phòng"
          value={roomTypeId}
          onChange={(e) => setRoomTypeId(e.target.value)}
        >
          <option value="">Tất cả</option>
          {types.data?.map((t: any) => (
            <option key={t.id} value={t.id}>
              {t.name}
            </option>
          ))}
        </Select>
        <Input
          label="Tầng"
          type="number"
          placeholder="Tất cả"
          value={floor}
          onChange={(e) => setFloor(e.target.value)}
        />
      </div>

      <Card className="mt-5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <Th>Số phòng</Th>
                <Th>Tầng</Th>
                <Th>Loại phòng</Th>
                <Th>Trạng thái</Th>
                <Th className="text-right">Hành động</Th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {rooms.isLoading && (
                <tr>
                  <td colSpan={5} className="p-4">
                    <Skeleton className="h-10 w-full" />
                  </td>
                </tr>
              )}
              {rooms.data && rooms.data.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-8">
                    <EmptyState title="Chưa có phòng nào" />
                  </td>
                </tr>
              )}
              {rooms.data?.map((r) => (
                <tr key={r.id} className="hover:bg-slate-50">
                  <Td className="font-semibold text-slate-900">
                    #{r.roomNumber}
                  </Td>
                  <Td>Tầng {r.floor}</Td>
                  <Td>{r.roomType?.name ?? "-"}</Td>
                  <Td>
                    <select
                      value={r.status}
                      onChange={(e) =>
                        updateStatus.mutate({
                          id: r.id,
                          status: e.target.value as RoomStatus,
                        })
                      }
                      className="rounded-md border border-slate-300 bg-white px-2 py-1 text-xs focus:border-brand-500 focus:ring-brand-500"
                    >
                      {(
                        [
                          "AVAILABLE",
                          "OCCUPIED",
                          "DIRTY",
                          "CLEANING",
                          "MAINTENANCE",
                          "RESERVED",
                        ] as RoomStatus[]
                      ).map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                    <span className="ml-2">
                      <RoomStatusBadge status={r.status} />
                    </span>
                  </Td>
                  <Td className="text-right">
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() =>
                        confirm(`Xóa phòng #${r.roomNumber}?`) &&
                        del.mutate(r.id)
                      }
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Thêm phòng mới"
        size="md"
        footer={
          <>
            <Button variant="ghost" onClick={() => setOpen(false)}>
              Hủy
            </Button>
            <Button
              onClick={form.handleSubmit((d) => create.mutate(d))}
              loading={create.isPending}
            >
              Tạo phòng
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input
            label="Số phòng"
            {...form.register("roomNumber")}
            error={form.formState.errors.roomNumber?.message}
          />
          <Input
            label="Tầng"
            type="number"
            {...form.register("floor")}
            error={form.formState.errors.floor?.message}
          />
          <Select
            label="Loại phòng"
            {...form.register("roomTypeId")}
            error={form.formState.errors.roomTypeId?.message}
          >
            <option value="">-- Chọn loại phòng --</option>
            {types.data?.map((t: any) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </Select>
          <Input label="Ghi chú" {...form.register("notes")} />
        </div>
      </Modal>
    </div>
  );
}

function Th({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <th
      className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 ${className}`}
    >
      {children}
    </th>
  );
}
function Td({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <td className={`px-4 py-3 text-sm text-slate-700 ${className}`}>
      {children}
    </td>
  );
}
