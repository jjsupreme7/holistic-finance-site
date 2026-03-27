"use client";

interface AdminNoticeProps {
  tone: "success" | "error" | "warning" | "info";
  message: string;
  onDismiss?: () => void;
}

const toneClasses: Record<AdminNoticeProps["tone"], string> = {
  success: "border-green-800 bg-green-900/20 text-green-400",
  error: "border-red-800 bg-red-900/20 text-red-400",
  warning: "border-amber-800 bg-amber-900/20 text-amber-400",
  info: "border-blue-800 bg-blue-900/20 text-blue-400",
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
