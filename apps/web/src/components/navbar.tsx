"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/auth-store";
import { Button } from "./ui/button";
import { Hotel, LogOut, Menu, X } from "lucide-react";
import { useState } from "react";
import { api } from "@/lib/api";
import { cn } from "@/lib/utils";

const customerLinks = [
  { href: "/", label: "Trang chủ" },
  { href: "/rooms", label: "Tìm phòng" },
  { href: "/my-bookings", label: "Đơn của tôi" },
];

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const clear = useAuthStore((s) => s.clear);
  const [open, setOpen] = useState(false);

  // Hide nav on admin/staff layouts (they have own sidebar)
  if (pathname.startsWith("/admin") || pathname.startsWith("/staff"))
    return null;

  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } catch {
      /* noop */
    }
    clear();
    router.push("/login");
  };

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/80 backdrop-blur">
      <div className="container-page flex h-16 items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-600 text-white shadow">
            <Hotel className="h-5 w-5" />
          </div>
          <div className="leading-tight">
            <p className="text-sm font-bold text-slate-900">Sapphire Stay</p>
            <p className="text-xs text-slate-500">Hệ thống đặt phòng</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {customerLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={cn(
                "rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                pathname === l.href
                  ? "bg-brand-50 text-brand-700"
                  : "text-slate-600 hover:bg-slate-100",
              )}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          {user ? (
            <>
              {user.role === "ADMIN" && (
                <Link href="/admin/dashboard">
                  <Button variant="outline" size="sm">
                    Admin
                  </Button>
                </Link>
              )}
              {(user.role === "RECEPTIONIST" ||
                user.role === "HOUSEKEEPING" ||
                user.role === "ADMIN") && (
                <Link href="/staff/room-map">
                  <Button variant="outline" size="sm">
                    Staff
                  </Button>
                </Link>
              )}
              <div className="ml-1 flex items-center gap-2 rounded-full bg-slate-100 py-1 pr-3 pl-1">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-600 text-xs font-semibold text-white">
                  {user.firstName?.[0]?.toUpperCase()}
                </span>
                <span className="text-sm font-medium text-slate-700">
                  {user.firstName} {user.lastName}
                </span>
              </div>
              <Button variant="ghost" size="sm" onClick={logout}>
                <LogOut className="h-4 w-4" />
              </Button>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  Đăng nhập
                </Button>
              </Link>
              <Link href="/register">
                <Button size="sm">Đăng ký</Button>
              </Link>
            </>
          )}
        </div>

        <button
          className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 md:hidden"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-slate-200 bg-white md:hidden">
          <div className="container-page py-3 space-y-1">
            {customerLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="block rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
              >
                {l.label}
              </Link>
            ))}
            <div className="border-t border-slate-100 pt-2">
              {user ? (
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={logout}
                >
                  <LogOut className="h-4 w-4" /> Đăng xuất
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Link href="/login" className="flex-1">
                    <Button variant="outline" className="w-full">
                      Đăng nhập
                    </Button>
                  </Link>
                  <Link href="/register" className="flex-1">
                    <Button className="w-full">Đăng ký</Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
