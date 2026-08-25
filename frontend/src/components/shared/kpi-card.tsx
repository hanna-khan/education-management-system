import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";

interface KpiCardProps {
  label: string;
  value: string | number;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  icon?: LucideIcon;
  description?: string;
  className?: string;
}

export function KpiCard({
  label,
  value,
  change,
  changeType = "neutral",
  icon: Icon,
  description,
  className,
}: KpiCardProps) {
  const changeColor =
    changeType === "positive"
      ? "text-[var(--success)]"
      : changeType === "negative"
        ? "text-[var(--error)]"
        : "text-[var(--muted)]";

  return (
    <Card className={cn("p-5 transition-shadow hover:shadow-[var(--shadow-sm)]", className)}>
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1.5">
          <p className="ems-label">{label}</p>
          <p className="text-[1.625rem] font-semibold leading-none tracking-tight text-[var(--foreground)]">
            {value}
          </p>
          {change ? (
            <p className={cn("text-xs font-medium", changeColor)}>{change}</p>
          ) : null}
          {description ? (
            <p className="text-xs text-[var(--muted-foreground)]">{description}</p>
          ) : null}
        </div>
        {Icon ? (
          <div className="flex size-9 items-center justify-center rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-muted)] text-[var(--brand-primary)]">
            <Icon className="size-[18px]" />
          </div>
        ) : null}
      </div>
    </Card>
  );
}
