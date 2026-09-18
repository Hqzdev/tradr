"use client";

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import { IconAlertCircle, IconAlertTriangle, IconCheckCircle, IconInfoCircle, IconX } from "@/components/icons";
import clsx from "@/lib/clsx";

export type ToastTone = "success" | "error" | "warning" | "info";

export interface ToastItem {
  id: string;
  tone: ToastTone;
  title: string;
  description?: string;
}

const toneStyles: Record<ToastTone, { bg: string; fg: string; icon: typeof IconCheckCircle }> = {
  success: { bg: "#F1FAF6", fg: "#00856F", icon: IconCheckCircle },
  error: { bg: "#FFF3F4", fg: "#B63449", icon: IconAlertCircle },
  warning: { bg: "#FFFAEB", fg: "#99722C", icon: IconAlertTriangle },
  info: { bg: "#F6F2FF", fg: "#8251FB", icon: IconInfoCircle },
};

export function Toast({
  tone,
  title,
  description,
  onDismiss,
  className,
}: {
  tone: ToastTone;
  title: string;
  description?: string;
  onDismiss?: () => void;
  className?: string;
}) {
  const styles = toneStyles[tone];
  const Icon = styles.icon;
  return (
    <div
      role="status"
      className={clsx(
        "animate-slide-down-fade flex w-full max-w-[360px] items-start gap-3 rounded-btn border border-black/5 p-3.5 shadow-elevated",
        className
      )}
      style={{ backgroundColor: styles.bg }}
    >
      <Icon className="mt-0.5 h-4.5 w-4.5 shrink-0" style={{ color: styles.fg }} />
      <div className="min-w-0 flex-1">
        <p className="text-body-sm font-[535]" style={{ color: styles.fg }}>
          {title}
        </p>
        {description && (
          <p className="mt-0.5 text-caption text-ink/70">{description}</p>
        )}
      </div>
      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          className="press-98 focus-ring shrink-0 rounded-full p-0.5 text-ink/40 transition-colors duration-150 hover:text-ink/70"
          aria-label="Закрыть уведомление"
        >
          <IconX className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  );
}

// Presentational-only queue: purely UI plumbing (position, stacking,
// auto-dismiss timer) — it never touches trading/business state, so it
// stays within the "no interactivity wiring yet" boundary. Nothing in the
// app currently calls `showToast`; it's here so screens can opt in once
// the backend exists to drive it.
interface ToastContextValue {
  toasts: ToastItem[];
  showToast: (toast: Omit<ToastItem, "id">) => void;
  dismissToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    (toast: Omit<ToastItem, "id">) => {
      const id = Math.random().toString(36).slice(2);
      setToasts((prev) => [...prev, { ...toast, id }]);
      setTimeout(() => dismissToast(id), 5000);
    },
    [dismissToast]
  );

  const value = useMemo(() => ({ toasts, showToast, dismissToast }), [toasts, showToast, dismissToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed right-6 top-6 z-50 flex flex-col items-end gap-2.5">
        {toasts.map((t) => (
          <div key={t.id} className="pointer-events-auto">
            <Toast tone={t.tone} title={t.title} description={t.description} onDismiss={() => dismissToast(t.id)} />
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within a ToastProvider");
  return ctx;
}
