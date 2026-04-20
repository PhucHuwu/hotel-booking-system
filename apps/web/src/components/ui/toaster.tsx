"use client";

import { useToastStore, type ToastVariant } from "@/lib/toast";
import { CheckCircle2, XCircle, Info, AlertTriangle, X } from "lucide-react";
import { cn } from "@/lib/utils";

const styles: Record<
  ToastVariant,
  { ring: string; icon: React.ReactNode; iconBg: string }
> = {
  success: {
    ring: "ring-emerald-200",
    icon: <CheckCircle2 className="h-5 w-5 text-emerald-600" />,
    iconBg: "bg-emerald-50",
  },
  error: {
    ring: "ring-rose-200",
    icon: <XCircle className="h-5 w-5 text-rose-600" />,
    iconBg: "bg-rose-50",
  },
  info: {
    ring: "ring-sky-200",
    icon: <Info className="h-5 w-5 text-sky-600" />,
    iconBg: "bg-sky-50",
  },
  warning: {
    ring: "ring-amber-200",
    icon: <AlertTriangle className="h-5 w-5 text-amber-600" />,
    iconBg: "bg-amber-50",
  },
};

export function Toaster() {
  const toasts = useToastStore((s) => s.toasts);
  const dismiss = useToastStore((s) => s.dismiss);

  return (
    <div className="pointer-events-none fixed top-4 right-4 z-[100] flex w-full max-w-sm flex-col gap-2">
      {toasts.map((t) => {
        const s = styles[t.variant];
        return (
          <div
            key={t.id}
            className={cn(
              "pointer-events-auto flex items-start gap-3 rounded-xl bg-white p-3 shadow-card ring-1 animate-slide-in-right",
              s.ring,
            )}
          >
            <div className={cn("rounded-lg p-2", s.iconBg)}>{s.icon}</div>
            <div className="min-w-0 flex-1 pt-0.5">
              <p className="text-sm font-semibold text-slate-900">{t.title}</p>
              {t.description && (
                <p className="mt-0.5 text-sm text-slate-600">{t.description}</p>
              )}
            </div>
            <button
              onClick={() => dismiss(t.id)}
              className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
