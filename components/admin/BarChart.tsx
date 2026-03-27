"use client";

interface BarChartProps {
  title: string;
  data: Record<string, number>;
  color?: string;
  hoverColor?: string;
  unitLabel?: string;
  /** Optional overlay data shown as a lighter bar behind the main bar */
  overlay?: Record<string, number>;
  overlayColor?: string;
  overlayLabel?: string;
  mainLabel?: string;
}

export default function BarChart({
  title,
  data,
  color = "bg-primary/80",
  hoverColor = "bg-primary",
  unitLabel = "views",
  overlay,
  overlayColor = "bg-primary/30",
  overlayLabel,
  mainLabel,
}: BarChartProps) {
  const entries = Object.entries(data);
  const maxValue = Math.max(...entries.map(([, v]) => v), 1);
  const overlayMax = overlay
    ? Math.max(...Object.values(overlay), 1)
    : 1;
  const combinedMax = overlay ? Math.max(maxValue, overlayMax) : maxValue;

  return (
    <div className="bg-admin-card rounded-xl border border-border-light p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <p className="text-admin-text-secondary text-xs font-semibold uppercase tracking-wider">
          {title}
        </p>
        {overlay && overlayLabel && mainLabel && (
          <div className="flex items-center gap-4 text-[10px] text-admin-text-secondary">
            <span className="flex items-center gap-1.5">
              <span className={`inline-block w-3 h-3 rounded-sm ${color}`} />
              {mainLabel}
            </span>
            <span className="flex items-center gap-1.5">
              <span
                className={`inline-block w-3 h-3 rounded-sm ${overlayColor}`}
              />
              {overlayLabel}
            </span>
          </div>
        )}
      </div>
      <div className="flex items-end gap-1 h-40">
        {entries.map(([day, count]) => {
          const overlayCount = overlay?.[day] || 0;
          return (
            <div key={day} className="flex-1 flex flex-col items-center gap-1">
              <span className="text-[10px] text-admin-text-secondary font-medium">
                {count > 0 ? count : ""}
              </span>
              <div className="w-full relative" style={{ height: "100%" }}>
                {overlay && (
                  <div
                    className={`absolute bottom-0 left-0 w-full ${overlayColor} rounded-t transition-all`}
                    style={{
                      height: `${Math.max((overlayCount / combinedMax) * 100, overlayCount > 0 ? 4 : 0)}%`,
                      minHeight: overlayCount > 0 ? "4px" : "0px",
                    }}
                    title={`${day}: ${overlayCount} ${overlayLabel || "overlay"}`}
                  />
                )}
                <div
                  className={`absolute bottom-0 left-0 w-full ${color} rounded-t transition-all hover:${hoverColor}`}
                  style={{
                    height: `${Math.max((count / combinedMax) * 100, count > 0 ? 4 : 0)}%`,
                    minHeight: count > 0 ? "4px" : "0px",
                  }}
                  title={`${day}: ${count} ${unitLabel}`}
                />
              </div>
              <span className="text-[9px] text-admin-text-secondary mt-1 hidden sm:block">
                {new Date(day + "T12:00:00").toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
