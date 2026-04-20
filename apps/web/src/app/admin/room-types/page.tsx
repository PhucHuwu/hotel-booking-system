"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Plus,
  Pencil,
  Trash2,
  Users,
  Maximize2,
  BedDouble,
} from "lucide-react";
import { api, getApiErrorMessage } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/select";
import { Skeleton, EmptyState } from "@/components/ui/skeleton";
import { toast } from "@/lib/toast";

const schema = z.object({
  name: z.string().min(1, "Bắt buộc"),
  description: z.string().optional(),
  maxGuests: z.coerce.number().int().min(1).max(20),
  areaSqm: z.coerce.number().min(1),
  bedType: z.string().min(1),
  amenities: z.string().optional(),
  imageUrl: z.string().url().optional().or(z.literal("")),
});
type FormValues = z.infer<typeof schema>;

interface RoomTypeRow {
  id: string;
  name: string;
  description?: string | null;
  maxGuests: number;
  areaSqm: number;
  bedType: string;
  amenities: string[];
  images: string[];
  isActive: boolean;
  _count?: { rooms: number };
}

export default function AdminRoomTypesPage() {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<RoomTypeRow | null>(null);

  const list = useQuery({
    queryKey: ["roomTypes"],
    queryFn: () => api.get<RoomTypeRow[]>("/rooms/types").then((r) => r.data),
  });

  const upsert = useMutation({
    mutationFn: async (data: FormValues) => {
      const payload = {
        name: data.name,
        description: data.description || undefined,
        maxGuests: data.maxGuests,
        areaSqm: data.areaSqm,
        bedType: data.bedType,
        amenities: data.amenities
          ? data.amenities
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean)
          : [],
        images: data.imageUrl ? [data.imageUrl] : [],
      };
      if (editing) return api.patch(`/rooms/types/${editing.id}`, payload);
      return api.post("/rooms/types", payload);
    },
    onSuccess: () => {
      toast.success(
        editing ? "Cập nhật thành công" : "Tạo loại phòng thành công",
      );
      setOpen(false);
      setEditing(null);
      qc.invalidateQueries({ queryKey: ["roomTypes"] });
    },
    onError: (e) => toast.error("Lỗi", getApiErrorMessage(e)),
  });

  const del = useMutation({
    mutationFn: (id: string) => api.delete(`/rooms/types/${id}`),
    onSuccess: () => {
      toast.success("Đã xóa loại phòng");
      qc.invalidateQueries({ queryKey: ["roomTypes"] });
    },
    onError: (e) => toast.error("Không thể xóa", getApiErrorMessage(e)),
  });

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Loại phòng</h1>
          <p className="mt-1 text-sm text-slate-500">
            Quản lý các loại phòng và thông tin chi tiết
          </p>
        </div>
        <Button
          onClick={() => {
            setEditing(null);
            setOpen(true);
          }}
        >
          <Plus className="h-4 w-4" /> Thêm loại phòng
        </Button>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
        {list.isLoading &&
          Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-72 w-full rounded-2xl" />
          ))}
        {list.data && list.data.length === 0 && (
          <div className="md:col-span-2 xl:col-span-3">
            <EmptyState
              title="Chưa có loại phòng"
              description="Tạo loại phòng đầu tiên để bắt đầu cung cấp dịch vụ."
            />
          </div>
        )}
        {list.data?.map((rt) => (
          <Card key={rt.id} className="overflow-hidden">
            <div className="relative h-40 bg-slate-100">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={
                  rt.images?.[0] ||
                  "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600"
                }
                alt={rt.name}
                className="h-full w-full object-cover"
              />
            </div>
            <CardContent className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-semibold text-slate-900">
                  {rt.name}
                </h3>
                <span className="text-xs text-slate-500">
                  {rt._count?.rooms ?? 0} phòng
                </span>
              </div>
              <p className="line-clamp-2 text-xs text-slate-500">
                {rt.description ?? "Không có mô tả"}
              </p>
              <div className="flex flex-wrap gap-2 text-xs text-slate-600">
                <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5">
                  <Users className="h-3 w-3" /> {rt.maxGuests} khách
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5">
                  <Maximize2 className="h-3 w-3" /> {rt.areaSqm}m²
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5">
                  <BedDouble className="h-3 w-3" /> {rt.bedType}
                </span>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setEditing(rt);
                    setOpen(true);
                  }}
                >
                  <Pencil className="h-3.5 w-3.5" /> Sửa
                </Button>
                <Button
                  size="sm"
                  variant="danger"
                  onClick={() => {
                    if (confirm(`Xóa loại phòng "${rt.name}"?`))
                      del.mutate(rt.id);
                  }}
                >
                  <Trash2 className="h-3.5 w-3.5" /> Xóa
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <RoomTypeModal
        open={open}
        onClose={() => {
          setOpen(false);
          setEditing(null);
        }}
        editing={editing}
        onSubmit={(d) => upsert.mutate(d)}
        loading={upsert.isPending}
      />
    </div>
  );
}

function RoomTypeModal({
  open,
  onClose,
  onSubmit,
  loading,
  editing,
}: {
  open: boolean;
  onClose: () => void;
  onSubmit: (d: FormValues) => void;
  loading: boolean;
  editing: RoomTypeRow | null;
}) {
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: editing
      ? {
          name: editing.name,
          description: editing.description ?? "",
          maxGuests: editing.maxGuests,
          areaSqm: editing.areaSqm,
          bedType: editing.bedType,
          amenities: (editing.amenities ?? []).join(", "),
          imageUrl: editing.images?.[0] ?? "",
        }
      : undefined,
    values: editing
      ? {
          name: editing.name,
          description: editing.description ?? "",
          maxGuests: editing.maxGuests,
          areaSqm: editing.areaSqm,
          bedType: editing.bedType,
          amenities: (editing.amenities ?? []).join(", "),
          imageUrl: editing.images?.[0] ?? "",
        }
      : {
          name: "",
          description: "",
          maxGuests: 2,
          areaSqm: 25,
          bedType: "Queen",
          amenities: "Wifi, TV, Minibar",
          imageUrl: "",
        },
  });

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={editing ? "Sửa loại phòng" : "Thêm loại phòng"}
      size="lg"
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Hủy
          </Button>
          <Button onClick={form.handleSubmit(onSubmit)} loading={loading}>
            Lưu
          </Button>
        </>
      }
    >
      <form className="grid grid-cols-2 gap-4">
        <Input
          label="Tên loại phòng"
          {...form.register("name")}
          error={form.formState.errors.name?.message}
        />
        <Input
          label="Loại giường"
          {...form.register("bedType")}
          error={form.formState.errors.bedType?.message}
        />
        <Input
          label="Số khách tối đa"
          type="number"
          {...form.register("maxGuests")}
          error={form.formState.errors.maxGuests?.message}
        />
        <Input
          label="Diện tích (m²)"
          type="number"
          step="0.1"
          {...form.register("areaSqm")}
          error={form.formState.errors.areaSqm?.message}
        />
        <div className="col-span-2">
          <Textarea label="Mô tả" rows={3} {...form.register("description")} />
        </div>
        <div className="col-span-2">
          <Input
            label="Tiện nghi (phân cách bằng dấu phẩy)"
            placeholder="Wifi, TV, Minibar, Smart lock"
            {...form.register("amenities")}
          />
        </div>
        <div className="col-span-2">
          <Input
            label="Ảnh URL"
            placeholder="https://…"
            {...form.register("imageUrl")}
            error={form.formState.errors.imageUrl?.message}
          />
        </div>
      </form>
    </Modal>
  );
}
