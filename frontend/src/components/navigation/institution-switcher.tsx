"use client";

import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useApp } from "@/hooks/use-app";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface InstitutionSwitcherProps {
  compact?: boolean;
  /** Soft glass style for colored/purple sidebars — no black logo chip. */
  tone?: "default" | "onBrand";
}

export function InstitutionSwitcher({
  compact = false,
  tone = "default",
}: InstitutionSwitcherProps) {
  const { institution, institutions, setInstitution } = useApp();
  const onBrand = tone === "onBrand";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className={cn(
            "flex w-full items-center gap-3 rounded-2xl px-3 text-left transition-colors outline-none focus-visible:ring-2 focus-visible:ring-white/40",
            compact ? "py-2.5" : "py-3",
            onBrand
              ? "bg-white/15 hover:bg-white/20"
              : "border border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow-xs)] hover:bg-[var(--surface-muted)]",
          )}
        >
          <div
            className={cn(
              "flex size-9 shrink-0 items-center justify-center rounded-full text-xs font-bold",
              onBrand
                ? "bg-white text-[#6B58F6] shadow-sm"
                : "text-white",
            )}
            style={onBrand ? undefined : { backgroundColor: institution.primaryColor }}
          >
            {institution.logoInitials}
          </div>
          <div className="min-w-0 flex-1">
            <p
              className={cn(
                "truncate text-sm font-semibold",
                onBrand ? "text-white" : "text-[var(--foreground)]",
              )}
            >
              {institution.shortName}
            </p>
            <p
              className={cn(
                "truncate text-[11px] capitalize",
                onBrand ? "text-white/70" : "text-[var(--muted)]",
              )}
            >
              {institution.type} · {institution.city}
            </p>
          </div>
          <ChevronsUpDown
            className={cn(
              "size-4 shrink-0",
              onBrand ? "text-white/70" : "text-[var(--muted)]",
            )}
          />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-[280px]">
        <DropdownMenuLabel>Switch institution</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {institutions.map((item) => (
          <DropdownMenuItem
            key={item.id}
            onClick={() => setInstitution(item.id)}
            className="flex items-start gap-3 py-2.5"
          >
            <div
              className="flex size-8 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white"
              style={{ backgroundColor: item.primaryColor }}
            >
              {item.logoInitials}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <p className="truncate text-sm font-medium">{item.name}</p>
                {item.id === institution.id ? (
                  <Check className="size-4 text-[var(--brand-primary)]" />
                ) : null}
              </div>
              <div className="mt-1 flex items-center gap-2">
                <Badge variant="outline" className="capitalize">
                  {item.type}
                </Badge>
                <Badge
                  variant={
                    item.status === "active"
                      ? "success"
                      : item.status === "trial"
                        ? "warning"
                        : "error"
                  }
                  className="capitalize"
                >
                  {item.status}
                </Badge>
              </div>
              {item.demoNote ? (
                <p className="mt-1.5 text-[11px] leading-snug text-[var(--muted)]">{item.demoNote}</p>
              ) : null}
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
