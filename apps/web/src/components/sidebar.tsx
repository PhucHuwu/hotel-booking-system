"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import {
  LayoutDashboard,
  BedDouble,
  Tags,
  Users,
  LogOut,
  Hotel,
  Map,
  CheckSquare,
  type LucideIcon,
} from "lucide-react";
import { useAuthStore } from "@/lib/auth-store";
import { api } from "@/lib/api";
import { cn } from "@/lib/utils";
import type { Role } from "@/lib/types";

interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  roles: Role[];
}

const ITEMS: NavItem[] = [
  // Admin
  {
    href: "/admin/dashboard",
    label: "Tổng quan",
    icon: LayoutDashboard,
    roles: ["ADMIN"],
  },
  {
    href: "/admin/room-types",
    label: "Loại phòng",
    icon: Tags,
    roles: ["ADMIN"],
  },
  {
    href: "/admin/rooms",
    label: "Quản lý phòng",
    icon: BedDouble,
    roles: ["ADMIN"],
  },
  { href: "/admin/staff", label: "Nhân viên", icon: Users, roles: ["ADMIN"] },
  // Staff
  {
    href: "/staff/room-map",
    label: "Sơ đồ phòng",
    icon: Map,
    roles: ["RECEPTIONIST", "HOUSEKEEPING", "ADMIN"],
  },
  {
    href: "/staff/check-in",
    label: "Check-in / out",
    icon: CheckSquare,
    roles: ["RECEPTIONIST", "ADMIN"],
  },
];

export function Sidebar({ section }: { section: "admin" | "staff" }) {
  const pathname = usePathname();
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const hydrated = useAuthStore((s) => s.hydrated);
  const clear = useAuthStore((s) => s.clear);

  useEffect(() => {
    if (!hydrated) return;
    if (!user) {
      router.replace(`/login?next=${pathname}`);
      return;
    }
    if (section === "admin" && user.role !== "ADMIN") {
      router.replace("/");
      return;
    }
    if (
      section === "staff" &&
      !["RECEPTIONIST", "HOUSEKEEPING", "ADMIN"].includes(user.role)
    ) {
      router.replace("/");
    }
  }, [hydrated, user, section, router, pathname]);

  const items = ITEMS.filter((i) =>
    user ? i.roles.includes(user.role) : false,
  ).filter((i) =>
    section === "admin"
      ? i.href.startsWith("/admin") ||
        (user?.role === "ADMIN" && i.href.startsWith("/staff"))
      : i.href.startsWith("/staff") ||
        (user?.role === "ADMIN" && i.href.startsWith("/admin")),
  );

  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } catch {}
    clear();
    router.push("/login");
  };

  return (
    <aside className="flex h-screen w-64 shrink-0 flex-col border-r border-slate-200 bg-white">
      <Link
        href="/"
        className="flex h-16 items-center gap-2 border-b border-slate-200 px-5"
      >
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-600 text-white">
          <Hotel className="h-5 w-5" />
        </div>
        <div>
          <p className="text-sm font-bold text-slate-900">Sapphire Stay</p>
          <p className="text-xs uppercase tracking-wide text-slate-500">
            {section === "admin" ? "Admin Panel" : "Staff Panel"}
          </p>
        </div>
      </Link>

      <nav className="flex-1 space-y-0.5 overflow-y-auto p-3">
        {items.map((it) => {
          const active =
            pathname === it.href || pathname.startsWith(it.href + "/");
          return (
            <Link
              key={it.href}
              href={it.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-brand-50 text-brand-700"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
              )}
            >
              <it.icon className="h-5 w-5" />
              {it.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-slate-200 p-3">
        <div className="mb-2 flex items-center gap-3 rounded-lg p-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-600 text-sm font-semibold text-white">
            {user?.firstName?.[0]?.toUpperCase()}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-slate-900">
              {user?.firstName} {user?.lastName}
            </p>
            <p className="truncate text-xs text-slate-500">{user?.role}</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900"
        >
          <LogOut className="h-4 w-4" /> Đăng xuất
        </button>
      </div>
    </aside>
  );
}
