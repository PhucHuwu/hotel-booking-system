"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useMutation } from "@tanstack/react-query";
import { Hotel, Mail, Lock, User, Phone } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { api, getApiErrorMessage } from "@/lib/api";
import { useAuthStore } from "@/lib/auth-store";
import { toast } from "@/lib/toast";

const schema = z.object({
  firstName: z.string().min(1, "Vui lòng nhập họ"),
  lastName: z.string().min(1, "Vui lòng nhập tên"),
  email: z.string().email("Email không hợp lệ"),
  phone: z
    .string()
    .optional()
    .refine((v) => !v || /^[0-9+\-\s()]{8,15}$/.test(v), "SĐT không hợp lệ"),
  password: z
    .string()
    .min(8, "Tối thiểu 8 ký tự")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/,
      "Phải có chữ hoa, chữ thường, số và ký tự đặc biệt",
    ),
});

type FormValues = z.infer<typeof schema>;

export default function RegisterPage() {
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const m = useMutation({
    mutationFn: (data: FormValues) =>
      api.post("/auth/register", data).then((r) => r.data),
    onSuccess: (data) => {
      setAuth({
        user: data.user,
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
      });
      toast.success("Tạo tài khoản thành công", "Chào mừng đến Sapphire Stay!");
      router.push("/");
    },
    onError: (err) => toast.error("Đăng ký thất bại", getApiErrorMessage(err)),
  });

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-slate-50 to-brand-50/40">
      <div className="container-page flex min-h-[calc(100vh-4rem)] items-center justify-center py-12">
        <div className="w-full max-w-lg">
          <div className="mb-6 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-brand-600 text-white shadow-lg">
              <Hotel className="h-6 w-6" />
            </div>
            <h1 className="mt-4 text-2xl font-bold text-slate-900">
              Tạo tài khoản
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Đăng ký để bắt đầu đặt phòng dễ dàng
            </p>
          </div>

          <form
            onSubmit={handleSubmit((d) => m.mutate(d))}
            className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-card"
          >
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Họ"
                placeholder="Nguyễn"
                leftIcon={<User className="h-4 w-4" />}
                error={errors.firstName?.message}
                {...register("firstName")}
              />
              <Input
                label="Tên"
                placeholder="Văn A"
                leftIcon={<User className="h-4 w-4" />}
                error={errors.lastName?.message}
                {...register("lastName")}
              />
            </div>

            <Input
              label="Email"
              type="email"
              placeholder="you@example.com"
              leftIcon={<Mail className="h-4 w-4" />}
              error={errors.email?.message}
              {...register("email")}
            />

            <Input
              label="Số điện thoại"
              type="tel"
              placeholder="0901234567"
              leftIcon={<Phone className="h-4 w-4" />}
              error={errors.phone?.message}
              {...register("phone")}
            />

            <Input
              label="Mật khẩu"
              type="password"
              placeholder="••••••••"
              hint="Tối thiểu 8 ký tự, gồm chữ hoa, chữ thường, số và ký tự đặc biệt"
              leftIcon={<Lock className="h-4 w-4" />}
              error={errors.password?.message}
              {...register("password")}
            />

            <Button
              type="submit"
              className="w-full"
              size="lg"
              loading={m.isPending}
            >
              Tạo tài khoản
            </Button>

            <p className="text-center text-sm text-slate-600">
              Đã có tài khoản?{" "}
              <Link
                href="/login"
                className="font-medium text-brand-600 hover:text-brand-700"
              >
                Đăng nhập
              </Link>
            </p>
          </form>
        </div>
      </div>
    </main>
  );
}
