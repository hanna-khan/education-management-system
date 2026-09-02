"use client";

import { cn } from "@/lib/utils";
import { useApp } from "@/hooks/use-app";
import { Badge } from "@/components/ui/badge";

interface InstitutionSwitcherProps {
  compact?: boolean;
  tone?: "default" | "onBrand";
}

/** Shows the current institution only. */
export function InstitutionSwitcher({
  compact = false,
  tone = "default",
}: InstitutionSwitcherProps) {
  const { institution } = useApp();
  const onBrand = tone === "onBrand";

  if (!institution?.id) return null;

  return (
    <div
      className={cn(
        "flex w-full items-center gap-3 rounded-2xl px-3 text-left",
        compact ? "py-2.5" : "py-3",
        onBrand
          ? "bg-white/15"
          : "border border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow-xs)]",
      )}
    >
      <div
        className={cn(
          "flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-full text-xs font-bold",
          onBrand ? "bg-white text-[#6B58F6] shadow-sm" : "text-white",
        )}
        style={onBrand || institution.logoUrl ? undefined : { backgroundColor: institution.primaryColor }}
      >
        {institution.logoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={institution.logoUrl} alt="" className="size-full object-cover" />
        ) : (
          institution.logoInitials
        )}
      </div>
      <div className="min-w-0 flex-1">
        <p
          className={cn(
            "truncate text-sm font-semibold",
            onBrand ? "text-white" : "text-[var(--foreground)]",
          )}
        >
          {institution.shortName || institution.name}
        </p>
        <p
          className={cn(
            "truncate text-[11px] capitalize",
            onBrand ? "text-white/70" : "text-[var(--muted)]",
          )}
        >
          {institution.type}
          {institution.city ? ` · ${institution.city}` : ""}
        </p>
      </div>
      <Badge
        variant={institution.status === "trial" ? "warning" : "success"}
        className="shrink-0 capitalize"
      >
        {institution.status === "trial" ? "Trial" : institution.status}
      </Badge>
    </div>
  );
}
