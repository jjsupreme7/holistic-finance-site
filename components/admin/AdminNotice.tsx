"use client";

interface AdminNoticeProps {
  tone: "success" | "error" | "warning" | "info";
  message: string;
  onDismiss?: () => void;
}

const toneClasses: Record<AdminNoticeProps["tone"], string> = {
  success: "border-green-200 bg-green-50 text-green-800",
  error: "border-red-200 bg-red-50 text-red-700",
  warning: "border-amber-200 bg-amber-50 text-amber-800",
  info: "border-blue-200 bg-blue-50 text-blue-700",
};

export default function AdminNotice({ tone, message, onDismiss }: AdminNoticeProps) {
  return (
    <div
      className={`rounded-2xl border px-4 py-3 text-sm shadow-sm ${toneClasses[tone]}`}
      role="status"
      aria-live="polite"
    >
      <div className="flex items-start justify-between gap-4">
        <p className="leading-6">{message}</p>
        {onDismiss && (
          <button
            type="button"
            onClick={onDismiss}
            className="shrink-0 rounded-full border border-current/15 px-2 py-0.5 text-xs font-semibold transition-opacity hover:opacity-80"
          >
            Dismiss
          </button>
        )}
      </div>
    </div>
  );
}
