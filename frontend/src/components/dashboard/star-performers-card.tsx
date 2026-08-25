"use client";

import { useMemo, useState } from "react";
import { Star, TrendingDown, TrendingUp, Minus } from "lucide-react";
import { cn } from "@/lib/utils";
import { PeriodToggle } from "@/components/dashboard/period-toggle";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  starStudentsWeekly,
  starStudentsMonthly,
  bestPerformersWeekly,
  bestPerformersMonthly,
  schoolClasses,
  filterPerformers,
  type PerformerEntry,
} from "@/mock/performers";

const TREND_ICON = {
  up: TrendingUp,
  down: TrendingDown,
  same: Minus,
};

const TREND_COLOR = {
  up: "text-[#1BD0B4]",
  down: "text-[#FF394B]",
  same: "text-[var(--muted)]",
};

function PerformerRow({ entry, showStar }: { entry: PerformerEntry; showStar?: boolean }) {
  const TrendIcon = TREND_ICON[entry.trend];
  return (
    <div className="flex items-center gap-3 rounded-xl px-2 py-2.5 transition-colors hover:bg-[var(--surface-muted)]">
      <span className="flex size-7 shrink-0 items-center justify-center text-sm font-bold text-[var(--muted)]">
        {entry.rank <= 3 && showStar ? (
          <Star className="size-4 fill-[#F4901F] text-[#F4901F]" />
        ) : (
          entry.rank
        )}
      </span>
      <div
        className="flex size-9 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white"
        style={{ backgroundColor: entry.avatarColor }}
      >
        {entry.avatarInitials}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold">{entry.name}</p>
        <p className="text-xs text-[var(--muted)]">
          {entry.className} · {entry.subject}
        </p>
      </div>
      <div className="text-right">
        <p className="text-sm font-bold text-[#6B58F6]">{entry.marks}%</p>
        <div className={cn("flex items-center justify-end gap-0.5 text-[10px] font-medium", TREND_COLOR[entry.trend])}>
          <TrendIcon className="size-3" />
          {entry.change}
        </div>
      </div>
    </div>
  );
}

export function StarStudentsCard({ className }: { className?: string }) {
  const [period, setPeriod] = useState<"weekly" | "monthly">("weekly");
  const [classFilter, setClassFilter] = useState("All Classes");

  const entries = useMemo(() => {
    const source = period === "weekly" ? starStudentsWeekly : starStudentsMonthly;
    return filterPerformers(source, classFilter);
  }, [period, classFilter]);

  return (
    <div className={cn("rounded-[1.25rem] bg-[var(--surface)] p-5 shadow-[var(--shadow-sm)]", className)}>
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold">Star Students</h3>
          <p className="mt-0.5 text-xs text-[var(--muted)]">Top marks by class</p>
        </div>
        <PeriodToggle value={period} onChange={setPeriod} />
      </div>
      <Select value={classFilter} onValueChange={setClassFilter}>
        <SelectTrigger className="mb-3 h-8 rounded-lg text-xs">
          <SelectValue placeholder="Select class" />
        </SelectTrigger>
        <SelectContent>
          {schoolClasses.map((c) => (
            <SelectItem key={c} value={c}>{c}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      <div className="space-y-1">
        {entries.length ? (
          entries.map((entry) => <PerformerRow key={entry.id} entry={entry} showStar />)
        ) : (
          <p className="py-6 text-center text-sm text-[var(--muted)]">No students in this class for the selected period.</p>
        )}
      </div>
    </div>
  );
}

export function BestPerformersCard({ className }: { className?: string }) {
  const [period, setPeriod] = useState<"weekly" | "monthly">("weekly");
  const [classFilter, setClassFilter] = useState("All Classes");

  const entries = useMemo(() => {
    const source = period === "weekly" ? bestPerformersWeekly : bestPerformersMonthly;
    return filterPerformers(source, classFilter);
  }, [period, classFilter]);

  return (
    <div className={cn("rounded-[1.25rem] bg-[var(--surface)] p-5 shadow-[var(--shadow-sm)]", className)}>
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold">Best Performers</h3>
          <p className="mt-0.5 text-xs text-[var(--muted)]">Weekly & monthly leaderboard</p>
        </div>
        <PeriodToggle value={period} onChange={setPeriod} />
      </div>
      <Select value={classFilter} onValueChange={setClassFilter}>
        <SelectTrigger className="mb-3 h-8 rounded-lg text-xs">
          <SelectValue placeholder="Select class" />
        </SelectTrigger>
        <SelectContent>
          {schoolClasses.map((c) => (
            <SelectItem key={c} value={c}>{c}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      <div className="space-y-1">
        {entries.length ? (
          entries.map((entry) => <PerformerRow key={entry.id} entry={entry} showStar />)
        ) : (
          <p className="py-6 text-center text-sm text-[var(--muted)]">No performers in this class for the selected period.</p>
        )}
      </div>
    </div>
  );
}
