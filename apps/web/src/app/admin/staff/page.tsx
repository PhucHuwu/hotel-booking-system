"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus, Lock, Unlock } from "lucide-react";
import { api, getApiErrorMessage } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Modal } from "@/components/ui/modal";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/lib/toast";
import type { Role } from "@/lib/types";

const schema = z.object({
  email: z.string().email(),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  phone: z.string().optional(),
  password: z
    .string()
    .min(8)
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/, "Mật khẩu mạnh"),
  role: z.enum(["RECEPTIONIST", "HOUSEKEEPING", "ADMIN"]),
});
type FormValues = z.infer<typeof schema>;

interface UserRow {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: Role;
  isActive: boolean;
}

export default function AdminStaffPage() {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [role, setRole] = useState<string>("");

  const list = useQuery({
    queryKey: ["users", role],
    queryFn: () =>
      api
        .get("/users", {
          params: { page: 1, limit: 50, ...(role ? { role } : {}) },
        })
        .then((r) => r.data),
  });

  const create = useMutation({
    mutationFn: (data: FormValues) => api.post("/users/staff", data),
    onSuccess: () => {
      toast.success("Tạo nhân viên thành công");
      setOpen(false);
      qc.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (e) => toast.error("Lỗi", getApiErrorMessage(e)),
  });

  const toggle = useMutation({
    mutationFn: (id: string) => api.patch(`/users/${id}/toggle-lock`),
    onSuccess: () => {
      toast.success("Đã cập nhật trạng thái");
      qc.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (e) => toast.error("Lỗi", getApiErrorMessage(e)),
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { role: "RECEPTIONIST" },
  });

  const items: UserRow[] = list.data?.data ?? list.data ?? [];

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Nhân viên</h1>
          <p className="mt-1 text-sm text-slate-500">
            Quản lý tài khoản nhân viên và phân quyền
          </p>
        </div>
        <Button onClick={() => setOpen(true)}>
          <Plus className="h-4 w-4" /> Thêm nhân viên
        </Button>
      </div>

      <div className="mt-4 flex gap-3">
        <div className="w-60">
          <Select
            label="Vai trò"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="">Tất cả</option>
            <option value="ADMIN">Admin</option>
            <option value="RECEPTIONIST">Receptionist</option>
            <option value="HOUSEKEEPING">Housekeeping</option>
            <option value="CUSTOMER">Customer</option>
          </Select>
        </div>
      </div>

      <Card className="mt-5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <Th>Họ tên</Th>
                <Th>Email</Th>
                <Th>Vai trò</Th>
                <Th>Trạng thái</Th>
                <Th className="text-right">Hành động</Th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {list.isLoading && (
                <tr>
                  <td colSpan={5} className="p-4">
                    <Skeleton className="h-10 w-full" />
                  </td>
                </tr>
              )}
              {items.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50">
                  <Td className="font-semibold text-slate-900">
                    {u.firstName} {u.lastName}
                  </Td>
                  <Td>{u.email}</Td>
                  <Td>
                    <Badge tone={roleTone(u.role)}>{u.role}</Badge>
                  </Td>
                  <Td>
                    {u.isActive ? (
                      <Badge tone="emerald">Hoạt động</Badge>
                    ) : (
                      <Badge tone="rose">Đã khóa</Badge>
                    )}
                  </Td>
                  <Td className="text-right">
                    <Button
                      size="sm"
                      variant={u.isActive ? "outline" : "primary"}
                      onClick={() => toggle.mutate(u.id)}
                    >
                      {u.isActive ? (
                        <>
                          <Lock className="h-3.5 w-3.5" /> Khóa
                        </>
                      ) : (
                        <>
                          <Unlock className="h-3.5 w-3.5" /> Mở khóa
                        </>
                      )}
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
        title="Thêm nhân viên"
        size="lg"
        footer={
          <>
            <Button variant="ghost" onClick={() => setOpen(false)}>
              Hủy
            </Button>
            <Button
              onClick={form.handleSubmit((d) => create.mutate(d))}
              loading={create.isPending}
            >
              Tạo
            </Button>
          </>
        }
      >
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Họ"
            {...form.register("firstName")}
            error={form.formState.errors.firstName?.message}
          />
          <Input
            label="Tên"
            {...form.register("lastName")}
            error={form.formState.errors.lastName?.message}
          />
          <Input
            label="Email"
            type="email"
            {...form.register("email")}
            error={form.formState.errors.email?.message}
          />
          <Input label="SĐT" {...form.register("phone")} />
          <Input
            label="Mật khẩu tạm"
            type="password"
            {...form.register("password")}
            error={form.formState.errors.password?.message}
          />
          <Select label="Vai trò" {...form.register("role")}>
            <option value="RECEPTIONIST">Receptionist</option>
            <option value="HOUSEKEEPING">Housekeeping</option>
            <option value="ADMIN">Admin</option>
          </Select>
        </div>
      </Modal>
    </div>
  );
}

function roleTone(r: Role): any {
  return r === "ADMIN"
    ? "violet"
    : r === "RECEPTIONIST"
      ? "sky"
      : r === "HOUSEKEEPING"
        ? "amber"
        : "slate";
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
