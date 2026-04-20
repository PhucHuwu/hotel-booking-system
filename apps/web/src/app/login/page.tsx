"use client";

export const dynamic = "force-dynamic";

import { Suspense } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useMutation } from "@tanstack/react-query";
import { Hotel, Mail, Lock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { api, getApiErrorMessage } from "@/lib/api";
import { useAuthStore } from "@/lib/auth-store";
import { toast } from "@/lib/toast";

const schema = z.object({
  email: z.string().email("Email không hợp lệ"),
  password: z.string().min(1, "Vui lòng nhập mật khẩu"),
});

type FormValues = z.infer<typeof schema>;

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginInner />
    </Suspense>
  );
}

function LoginInner() {
  const router = useRouter();
  const params = useSearchParams();
  const setAuth = useAuthStore((s) => s.setAuth);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const m = useMutation({
    mutationFn: (data: FormValues) =>
      api.post("/auth/login", data).then((r) => r.data),
    onSuccess: (data) => {
      setAuth({
        user: data.user,
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
      });
      toast.success("Đăng nhập thành công", `Xin chào ${data.user.firstName}!`);
      const next = params.get("next");
      if (next) router.push(next);
      else if (data.user.role === "ADMIN") router.push("/admin/dashboard");
      else if (
        data.user.role === "RECEPTIONIST" ||
        data.user.role === "HOUSEKEEPING"
      )
        router.push("/staff/room-map");
      else router.push("/");
    },
    onError: (err) =>
      toast.error("Đăng nhập thất bại", getApiErrorMessage(err)),
  });

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-slate-50 to-brand-50/40">
      <div className="container-page flex min-h-[calc(100vh-4rem)] items-center justify-center py-12">
        <div className="w-full max-w-md">
          <div className="mb-6 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-brand-600 text-white shadow-lg">
              <Hotel className="h-6 w-6" />
            </div>
            <h1 className="mt-4 text-2xl font-bold text-slate-900">
              Đăng nhập
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Đăng nhập để tiếp tục đặt phòng
            </p>
          </div>

          <form
            onSubmit={handleSubmit((d) => m.mutate(d))}
            className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-card"
          >
            <Input
              label="Email"
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              leftIcon={<Mail className="h-4 w-4" />}
              error={errors.email?.message}
              {...register("email")}
            />
            <Input
              label="Mật khẩu"
              type="password"
              placeholder="••••••••"
              autoComplete="current-password"
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
              Đăng nhập
            </Button>

            <p className="text-center text-sm text-slate-600">
              Chưa có tài khoản?{" "}
              <Link
                href="/register"
                className="font-medium text-brand-600 hover:text-brand-700"
              >
                Đăng ký ngay
              </Link>
            </p>
          </form>

          <div className="mt-4 rounded-xl border border-dashed border-slate-300 bg-white/60 p-3 text-xs text-slate-500">
            <p className="font-medium text-slate-700">Tài khoản demo:</p>
            <p>
              Admin: <code>admin@hotel.com</code> / <code>Admin@123</code>
            </p>
            <p>
              Customer: <code>customer@hotel.com</code> /{" "}
              <code>Customer@123</code>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
