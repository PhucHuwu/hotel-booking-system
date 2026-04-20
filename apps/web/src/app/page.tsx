"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  CalendarDays,
  MapPin,
  Search,
  Users,
  Shield,
  Sparkles,
  Wifi,
} from "lucide-react";
import { Button } from "@/components/ui/button";

function todayISO(offset = 0) {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  return d.toISOString().slice(0, 10);
}

export default function HomePage() {
  const router = useRouter();
  const [checkIn, setCheckIn] = useState(todayISO(1));
  const [checkOut, setCheckOut] = useState(todayISO(2));
  const [guests, setGuests] = useState(2);

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
    <main>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-slate-200 bg-gradient-to-br from-brand-700 via-brand-600 to-brand-800 text-white">
        <div className="absolute inset-0 opacity-20 [background:radial-gradient(closest-side,white,transparent)] [mask-image:linear-gradient(white,transparent)]" />
        <div className="container-page relative py-20 lg:py-28">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-medium ring-1 ring-white/20 backdrop-blur">
              <MapPin className="h-3.5 w-3.5" /> Hà Nội · Việt Nam
            </span>
            <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              Kỳ nghỉ đáng nhớ bắt đầu tại{" "}
              <span className="text-sky-200">Sapphire Stay</span>
            </h1>
            <p className="mt-4 max-w-2xl text-lg text-sky-100/90">
              Đặt phòng khách sạn trực tuyến nhanh chóng, an toàn. Hơn 200 phòng
              hạng sang với đầy đủ tiện nghi và dịch vụ tận tâm 24/7.
            </p>
          </div>

          {/* Search card */}
          <form
            onSubmit={submit}
            className="mt-10 grid grid-cols-1 gap-3 rounded-2xl bg-white p-4 shadow-2xl ring-1 ring-black/5 sm:grid-cols-4"
          >
            <Field
              icon={<CalendarDays className="h-4 w-4" />}
              label="Nhận phòng"
            >
              <input
                type="date"
                value={checkIn}
                min={todayISO()}
                onChange={(e) => setCheckIn(e.target.value)}
                className="w-full border-0 bg-transparent p-0 text-sm text-slate-900 focus:ring-0"
              />
            </Field>
            <Field
              icon={<CalendarDays className="h-4 w-4" />}
              label="Trả phòng"
            >
              <input
                type="date"
                value={checkOut}
                min={checkIn}
                onChange={(e) => setCheckOut(e.target.value)}
                className="w-full border-0 bg-transparent p-0 text-sm text-slate-900 focus:ring-0"
              />
            </Field>
            <Field icon={<Users className="h-4 w-4" />} label="Số khách">
              <select
                value={guests}
                onChange={(e) => setGuests(+e.target.value)}
                className="w-full border-0 bg-transparent p-0 text-sm text-slate-900 focus:ring-0"
              >
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <option key={n} value={n}>
                    {n} khách
                  </option>
                ))}
              </select>
            </Field>
            <Button type="submit" size="lg" className="sm:h-auto">
              <Search className="h-4 w-4" /> Tìm phòng
            </Button>
          </form>
        </div>
      </section>

      {/* Features */}
      <section className="container-page py-16">
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">
            Vì sao chọn Sapphire Stay?
          </h2>
          <p className="mt-3 text-slate-600">
            Chúng tôi mang đến trải nghiệm lưu trú đẳng cấp với công nghệ đặt
            phòng hiện đại.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          <Feature
            icon={<Shield className="h-6 w-6" />}
            title="Thanh toán an toàn"
            desc="Tích hợp VNPay & MoMo với mã hóa đầu cuối, đảm bảo giao dịch an toàn tuyệt đối."
          />
          <Feature
            icon={<Sparkles className="h-6 w-6" />}
            title="Dịch vụ đẳng cấp"
            desc="Đội ngũ nhân viên chuyên nghiệp, phòng được dọn dẹp sạch sẽ trước mỗi lượt khách."
          />
          <Feature
            icon={<Wifi className="h-6 w-6" />}
            title="Tiện nghi đầy đủ"
            desc="Wifi tốc độ cao, TV màn hình lớn, mini-bar và đầy đủ tiện nghi 5 sao trong mỗi phòng."
          />
        </div>
      </section>

      {/* CTA */}
      <section className="bg-slate-900 py-16 text-white">
        <div className="container-page flex flex-col items-center justify-between gap-6 rounded-2xl bg-gradient-to-r from-brand-600 to-brand-800 p-10 md:flex-row">
          <div>
            <h3 className="text-2xl font-bold">Sẵn sàng cho chuyến đi?</h3>
            <p className="mt-1 text-sky-100">
              Tạo tài khoản miễn phí và nhận ưu đãi cho lần đặt phòng đầu tiên.
            </p>
          </div>
          <div className="flex gap-3">
            <Link href="/register">
              <Button size="lg" variant="secondary">
                Tạo tài khoản
              </Button>
            </Link>
            <Link href="/rooms">
              <Button
                size="lg"
                variant="outline"
                className="border-white/30 bg-transparent text-white hover:bg-white/10"
              >
                Xem phòng
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-200 bg-white py-8">
        <div className="container-page text-center text-sm text-slate-500">
          © {new Date().getFullYear()} Sapphire Stay · Nhóm 05 · PTIT
        </div>
      </footer>
    </main>
  );
}

function Field({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3 text-left transition-colors focus-within:border-brand-500 focus-within:bg-white">
      <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-brand-600 shadow-sm ring-1 ring-slate-200">
        {icon}
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
          {label}
        </p>
        <div className="mt-0.5">{children}</div>
      </div>
    </label>
  );
}

function Feature({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <div className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-card transition-all hover:-translate-y-0.5 hover:shadow-lg">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-brand-600 transition-colors group-hover:bg-brand-600 group-hover:text-white">
        {icon}
      </div>
      <h3 className="mt-4 text-lg font-semibold text-slate-900">{title}</h3>
      <p className="mt-2 text-sm text-slate-600">{desc}</p>
    </div>
  );
}
