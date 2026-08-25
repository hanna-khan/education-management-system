"use client";

import Link from "next/link";
import { ArrowRight, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface DashboardEvent {
  id: string;
  day: string;
  weekday: string;
  title: string;
  meta: string;
  progress: number;
  sold: number;
  capacity: number;
  moreCount?: number;
  tone: "purple" | "teal" | "orange" | "coral" | "blue";
}

const TONE = {
  purple: { date: "bg-[#efeaff] text-[#6B58F6]", bar: "bg-[#6B58F6]", dot: "bg-[#6B58F6]" },
  teal: { date: "bg-[#e6fbf7] text-[#1BD0B4]", bar: "bg-[#1BD0B4]", dot: "bg-[#1BD0B4]" },
  orange: { date: "bg-[#fff6eb] text-[#F4901F]", bar: "bg-[#F4901F]", dot: "bg-[#F4901F]" },
  coral: { date: "bg-[#fff0f1] text-[#FF394B]", bar: "bg-[#FF394B]", dot: "bg-[#FF394B]" },
  blue: { date: "bg-[#eff6ff] text-[#3b82f6]", bar: "bg-[#3b82f6]", dot: "bg-[#3b82f6]" },
};

export function UpcomingEventsCard({
  events,
  onAdd,
  moreCount,
}: {
  events: DashboardEvent[];
  onAdd?: () => void;
  moreCount?: number;
}) {
  const remaining = moreCount ?? Math.max(0, 5);

  return (
    <div className="rounded-[1.25rem] bg-[var(--surface)] p-5 shadow-[var(--shadow-sm)]">
      <h3 className="mb-5 text-base font-semibold">Upcoming Events</h3>
      <div className="space-y-5">
        {events.map((event) => {
          const tone = TONE[event.tone];
          return (
            <div key={event.id} className="flex gap-3">
              <div className="relative shrink-0">
                <div
                  className={cn(
                    "flex size-12 flex-col items-center justify-center rounded-xl",
                    tone.date,
                  )}
                >
                  <span className="text-sm font-bold leading-none text-[var(--foreground)]">
                    {event.day}
                  </span>
                  <span className="mt-0.5 text-[10px] font-medium uppercase text-[var(--foreground)]">
                    {event.weekday}
                  </span>
                </div>
                <span
                  className={cn(
                    "absolute -bottom-1 left-1/2 size-1.5 -translate-x-1/2 rounded-full",
                    tone.dot,
                  )}
                />
              </div>
              <div className="min-w-0 flex-1 pt-0.5">
                <p className="truncate text-sm font-semibold leading-snug">{event.title}</p>
                <div className="mt-2 flex items-center gap-2">
                  <span className="shrink-0 text-[10px] text-[var(--muted)]">Ticket Sold</span>
                  <div className="h-1.5 min-w-0 flex-1 overflow-hidden rounded-full bg-[var(--surface-muted)]">
                    <div
                      className={cn("h-full rounded-full", tone.bar)}
                      style={{ width: `${event.progress}%` }}
                    />
                  </div>
                  <span className="shrink-0 text-[10px] font-semibold text-[var(--muted)]">
                    {event.sold}/{event.capacity}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-5 flex items-center justify-between gap-3">
        <span className="text-xs text-[var(--muted)]">{remaining} events more</span>
        <Link
          href="/events"
          className="inline-flex items-center gap-1 text-xs font-semibold text-[#6B58F6] hover:underline"
        >
          View more
          <ArrowRight className="size-3.5" />
        </Link>
      </div>

      {onAdd ? (
        <Button className="mt-4 w-full rounded-2xl" onClick={onAdd}>
          <Plus className="size-4" />
          New Events
        </Button>
      ) : (
        <Button variant="outline" className="mt-4 w-full rounded-2xl" asChild>
          <Link href="/events">View Events</Link>
        </Button>
      )}
    </div>
  );
}

export function MiniMonthCalendar({
  monthLabel = "August 2026",
  markedDays = [3, 8, 14, 22, 25, 28],
}: {
  monthLabel?: string;
  markedDays?: number[];
}) {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const startOffset = 5;
  const cells: (number | null)[] = [
    ...Array(startOffset).fill(null),
    ...Array.from({ length: 31 }, (_, i) => i + 1),
  ];
  while (cells.length % 7 !== 0) cells.push(null);
  const colors = ["#6B58F6", "#1BD0B4", "#F4901F", "#FF394B", "#8C4AF2"];

  return (
    <div className="rounded-[1.25rem] bg-[var(--surface)] p-5 shadow-[var(--shadow-sm)]">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-base font-semibold">School Calendar</h3>
        <span className="text-xs font-medium text-[var(--muted)]">{monthLabel}</span>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center">
        {days.map((d) => (
          <div key={d} className="py-1 text-[10px] font-semibold uppercase text-[var(--muted)]">
            {d}
          </div>
        ))}
        {cells.map((day, i) => {
          const isToday = day === 22;
          const markIdx = day ? markedDays.indexOf(day) : -1;
          return (
            <div
              key={i}
              className={cn(
                "flex aspect-square flex-col items-center justify-center rounded-xl text-xs",
                isToday && "bg-[#6B58F6] font-bold text-white shadow-md shadow-[#6B58F6]/30",
              )}
            >
              {day}
              {markIdx >= 0 && !isToday ? (
                <span
                  className="mt-0.5 size-1 rounded-full"
                  style={{ backgroundColor: colors[markIdx % colors.length] }}
                />
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function KnowledgeBanner() {
  return (
    <div className="relative h-full min-h-[260px] overflow-hidden rounded-[1.25rem] bg-gradient-to-br from-[#6B58F6] via-[#7c6af8] to-[#8C4AF2] p-6 text-white shadow-[var(--shadow-md)]">
      <div className="pointer-events-none absolute -right-6 -top-6 size-32 rounded-full bg-white/10" />
      <div className="pointer-events-none absolute -bottom-10 right-8 size-40 rounded-full bg-white/10" />
      <div className="relative z-10 max-w-[220px]">
        <h3 className="text-lg font-bold leading-snug">Increase your Knowledge By Learning!</h3>
        <p className="mt-2 text-sm text-white/80">
          Explore courses, notices, and academic resources made for your campus.
        </p>
        <button
          type="button"
          className="mt-5 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-[#6B58F6] shadow-sm"
        >
          OK! Take me there
        </button>
      </div>
      <div className="absolute bottom-5 right-5 flex items-end gap-2">
        <div className="flex size-14 items-center justify-center rounded-2xl bg-white/20 text-2xl backdrop-blur-sm">
          📚
        </div>
        <div className="flex size-12 items-center justify-center rounded-2xl bg-[#1BD0B4]/50 text-xl backdrop-blur-sm">
          🎓
        </div>
        <div className="flex size-10 items-center justify-center rounded-2xl bg-[#F4901F]/50 text-lg backdrop-blur-sm">
          ✨
        </div>
      </div>
    </div>
  );
}
