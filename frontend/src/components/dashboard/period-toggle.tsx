"use client";

import { cn } from "@/lib/utils";

export function PeriodToggle({
  value,
  onChange,
  weeklyLabel = "Weekly",
  monthlyLabel = "Monthly",
  className,
}: {
  value: "weekly" | "monthly";
  onChange: (value: "weekly" | "monthly") => void;
  weeklyLabel?: string;
  monthlyLabel?: string;
  className?: string;
}) {
  return (
    <div className={cn("flex rounded-lg bg-[var(--surface-muted)] p-0.5 text-xs", className)}>
      <button
        type="button"
        onClick={() => onChange("weekly")}
        className={cn(
          "rounded-md px-2.5 py-1 font-medium transition-all",
          value === "weekly"
            ? "bg-[var(--surface)] text-[var(--foreground)] shadow-sm"
            : "text-[var(--muted)] hover:text-[var(--foreground)]",
        )}
      >
        {weeklyLabel}
      </button>
      <button
        type="button"
        onClick={() => onChange("monthly")}
        className={cn(
          "rounded-md px-2.5 py-1 font-medium transition-all",
          value === "monthly"
            ? "bg-[var(--surface)] text-[var(--foreground)] shadow-sm"
            : "text-[var(--muted)] hover:text-[var(--foreground)]",
        )}
      >
        {monthlyLabel}
      </button>
    </div>
  );
}

export function SeriesToggle({
  series,
  active,
  onChange,
}: {
  series: { key: string; label: string; color: string }[];
  active: Record<string, boolean>;
  onChange: (key: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-3">
      {series.map((s) => (
        <button
          key={s.key}
          type="button"
          onClick={() => onChange(s.key)}
          className="flex items-center gap-1.5 text-xs"
        >
          <span
            className={cn(
              "relative h-4 w-7 rounded-full transition-colors",
              active[s.key] ? "bg-[var(--surface-muted)]" : "bg-[var(--surface-muted)]/60",
            )}
          >
            <span
              className={cn(
                "absolute top-0.5 size-3 rounded-full transition-all",
                active[s.key] ? "left-3.5" : "left-0.5",
              )}
              style={{ backgroundColor: active[s.key] ? s.color : "#d1d5db" }}
            />
          </span>
          <span className={cn("font-medium", active[s.key] ? "text-[var(--foreground)]" : "text-[var(--muted)]")}>
            {s.label}
          </span>
        </button>
      ))}
    </div>
  );
}
