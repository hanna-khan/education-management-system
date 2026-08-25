"use client";

import type { LucideIcon } from "lucide-react";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

const TONES = {
  purple: { bg: "bg-[#efeaff]", text: "text-[#6B58F6]", ring: "ring-[#6B58F6]/10" },
  teal: { bg: "bg-[#e6fbf7]", text: "text-[#1BD0B4]", ring: "ring-[#1BD0B4]/10" },
  orange: { bg: "bg-[#fff6eb]", text: "text-[#F4901F]", ring: "ring-[#F4901F]/10" },
  coral: { bg: "bg-[#fff0f1]", text: "text-[#FF394B]", ring: "ring-[#FF394B]/10" },
  mint: { bg: "bg-[#ecfdf5]", text: "text-[#10b981]", ring: "ring-[#10b981]/10" },
  blue: { bg: "bg-[#eff6ff]", text: "text-[#3b82f6]", ring: "ring-[#3b82f6]/10" },
  pink: { bg: "bg-[#fdf2f8]", text: "text-[#ec4899]", ring: "ring-[#ec4899]/10" },
  indigo: { bg: "bg-[#eef2ff]", text: "text-[#6366f1]", ring: "ring-[#6366f1]/10" },
} as const;

export type StatTone = keyof typeof TONES;

export function ColorStatCard({
  label,
  value,
  change,
  changeType = "neutral",
  icon: Icon,
  tone = "purple",
  className,
}: {
  label: string;
  value: string | number;
  change?: string;
  changeType?: "up" | "down" | "neutral";
  icon: LucideIcon;
  tone?: StatTone;
  className?: string;
}) {
  const colors = TONES[tone];

  return (
    <div
      className={cn(
        "rounded-[1.25rem] bg-[var(--surface)] p-5 shadow-[var(--shadow-sm)] transition-shadow hover:shadow-[var(--shadow-md)]",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 space-y-2">
          <p className="text-sm font-medium text-[var(--muted)]">{label}</p>
          <p className="truncate text-2xl font-bold tracking-tight capitalize">{value}</p>
          {change ? (
            <div
              className={cn(
                "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold",
                changeType === "up" && "bg-[#ecfdf5] text-[#059669]",
                changeType === "down" && "bg-[#fff0f1] text-[#FF394B]",
                changeType === "neutral" && "bg-[var(--surface-muted)] text-[var(--muted)]",
              )}
            >
              {changeType === "up" ? <ArrowUpRight className="size-3" /> : null}
              {changeType === "down" ? <ArrowDownRight className="size-3" /> : null}
              {change}
            </div>
          ) : null}
        </div>
        <div className={cn("flex size-12 shrink-0 items-center justify-center rounded-2xl ring-4", colors.bg, colors.text, colors.ring)}>
          <Icon className="size-6" strokeWidth={1.75} />
        </div>
      </div>
    </div>
  );
}
