"use client";

import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { DollarSign, TrendingUp, BedDouble, CheckCircle2 } from "lucide-react";
import {
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import { api } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency } from "@/lib/utils";

function firstOfMonth() {
  const d = new Date();
  d.setDate(1);
  return d.toISOString().slice(0, 10);
}

function today() {
  return new Date().toISOString().slice(0, 10);
}

export default function AdminDashboard() {
  const [from, setFrom] = useState(firstOfMonth());
  const [to, setTo] = useState(today());

  const revenue = useQuery({
    queryKey: ["reports-revenue", from, to],
    queryFn: () =>
      api
        .get("/reports/revenue", { params: { from, to, groupBy: "day" } })
        .then((r) => r.data),
  });
  const occupancy = useQuery({
    queryKey: ["reports-occupancy", from, to],
    queryFn: () =>
      api
        .get("/reports/occupancy", { params: { from, to } })
        .then((r) => r.data),
  });
  const summary = useQuery({
    queryKey: ["reports-summary", from, to],
    queryFn: () =>
      api
        .get("/reports/bookings/summary", { params: { from, to } })
        .then((r) => r.data),
  });

  const total = Array.isArray(revenue.data)
    ? revenue.data.reduce((s: number, x: any) => s + Number(x.revenue ?? 0), 0)
    : Number(revenue.data?.total ?? 0);

  const occRate = Number(occupancy.data?.occupancyRate ?? 0);
  const confirmed = Number(
    summary.data?.CONFIRMED ?? summary.data?.confirmed ?? 0,
  );
  const checkedIn = Number(
    summary.data?.CHECKED_IN ?? summary.data?.checkedIn ?? 0,
  );

  return (
    <div>
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Tổng quan</h1>
          <p className="mt-1 text-sm text-slate-500">
            Thống kê doanh thu và hiệu suất phòng
          </p>
        </div>
        <div className="flex gap-3">
          <Input
            label="Từ ngày"
            type="date"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
          />
          <Input
            label="Đến ngày"
            type="date"
            value={to}
            onChange={(e) => setTo(e.target.value)}
          />
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat
          icon={<DollarSign className="h-5 w-5" />}
          label="Doanh thu"
          value={formatCurrency(total)}
          tone="brand"
          loading={revenue.isLoading}
        />
        <Stat
          icon={<TrendingUp className="h-5 w-5" />}
          label="Tỷ lệ lấp phòng"
          value={`${(occRate * 100).toFixed(1)}%`}
          tone="emerald"
          loading={occupancy.isLoading}
        />
        <Stat
          icon={<CheckCircle2 className="h-5 w-5" />}
          label="Đơn xác nhận"
          value={String(confirmed)}
          tone="sky"
          loading={summary.isLoading}
        />
        <Stat
          icon={<BedDouble className="h-5 w-5" />}
          label="Đang lưu trú"
          value={String(checkedIn)}
          tone="violet"
          loading={summary.isLoading}
        />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Doanh thu theo ngày</CardTitle>
          </CardHeader>
          <CardContent>
            {revenue.isLoading ? (
              <Skeleton className="h-64 w-full" />
            ) : Array.isArray(revenue.data) && revenue.data.length > 0 ? (
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={revenue.data}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 12, fill: "#64748b" }}
                  />
                  <YAxis
                    tick={{ fontSize: 12, fill: "#64748b" }}
                    tickFormatter={(v) =>
                      new Intl.NumberFormat("vi-VN", {
                        notation: "compact",
                      }).format(v)
                    }
                  />
                  <Tooltip
                    formatter={(v: number) => formatCurrency(v)}
                    contentStyle={{
                      borderRadius: 8,
                      border: "1px solid #e2e8f0",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="#0070c5"
                    strokeWidth={2.5}
                    dot={{ r: 3 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <p className="py-16 text-center text-sm text-slate-500">
                Chưa có dữ liệu doanh thu trong khoảng thời gian đã chọn.
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Trạng thái đơn</CardTitle>
          </CardHeader>
          <CardContent>
            {summary.isLoading ? (
              <Skeleton className="h-64 w-full" />
            ) : (
              <ResponsiveContainer width="100%" height={280}>
                <BarChart
                  data={
                    summary.data
                      ? Object.entries(summary.data).map(([k, v]) => ({
                          status: k,
                          count: Number(v),
                        }))
                      : []
                  }
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    dataKey="status"
                    tick={{ fontSize: 10, fill: "#64748b" }}
                  />
                  <YAxis tick={{ fontSize: 12, fill: "#64748b" }} />
                  <Tooltip
                    contentStyle={{
                      borderRadius: 8,
                      border: "1px solid #e2e8f0",
                    }}
                  />
                  <Bar dataKey="count" fill="#0c8ee7" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function Stat({
  icon,
  label,
  value,
  tone,
  loading,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  tone: "brand" | "emerald" | "sky" | "violet";
  loading?: boolean;
}) {
  const tones = {
    brand: "from-brand-500 to-brand-700",
    emerald: "from-emerald-500 to-emerald-700",
    sky: "from-sky-500 to-sky-700",
    violet: "from-violet-500 to-violet-700",
  } as const;
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-card">
      <div className="flex items-center justify-between">
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br text-white ${tones[tone]}`}
        >
          {icon}
        </div>
      </div>
      <p className="mt-4 text-sm text-slate-500">{label}</p>
      {loading ? (
        <Skeleton className="mt-1 h-7 w-24" />
      ) : (
        <p className="mt-1 text-2xl font-bold text-slate-900">{value}</p>
      )}
    </div>
  );
}
