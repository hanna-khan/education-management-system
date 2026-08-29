"use client";

import Link from "next/link";
import { useMemo } from "react";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { EVENT_TONE_STYLES, type EventTone, type SchoolEvent } from "@/mock/events";

const AVATAR_COLORS = ["#6B58F6", "#1BD0B4", "#F4901F", "#3B82F6", "#FF8A65", "#8C4AF2"];

/** Curated timeline rows matching Behance School Events collage */
export const timelineShowcase: {
  dateLabel: string;
  weekday: string;
  events: {
    id: string;
    title: string;
    tone: EventTone;
    participants: string[];
    more: number;
    lane: 0 | 1 | 2;
  }[];
}[] = [
  {
    dateLabel: "07",
    weekday: "Fri",
    events: [
      {
        id: "ts-1",
        title: "School Competition",
        tone: "green",
        participants: ["AM", "HA", "ZM"],
        more: 15,
        lane: 0,
      },
    ],
  },
  {
    dateLabel: "14",
    weekday: "Fri",
    events: [
      {
        id: "ts-2",
        title: "Annual Debating",
        tone: "purple",
        participants: ["BA", "SI", "OF"],
        more: 15,
        lane: 1,
      },
      {
        id: "ts-3",
        title: "Educational Tour",
        tone: "orange",
        participants: ["DT", "RQ", "NF"],
        more: 15,
        lane: 2,
      },
    ],
  },
  {
    dateLabel: "21",
    weekday: "Fri",
    events: [
      {
        id: "ts-4",
        title: "Cultural Competition",
        tone: "blue",
        participants: ["LH", "AS", "UK"],
        more: 15,
        lane: 0,
      },
      {
        id: "ts-5",
        title: "Sports Competition",
        tone: "teal",
        participants: ["MS", "TB", "AR"],
        more: 15,
        lane: 2,
      },
    ],
  },
  {
    dateLabel: "28",
    weekday: "Fri",
    events: [
      {
        id: "ts-6",
        title: "Farewell Reception",
        tone: "purple",
        participants: ["FN", "JC", "FK"],
        more: 15,
        lane: 1,
      },
    ],
  },
];

/** University-flavoured showcase for NED / college demos */
export const timelineShowcaseUniversity: typeof timelineShowcase = [
  {
    dateLabel: "03",
    weekday: "Mon",
    events: [
      {
        id: "tu-1",
        title: "Convocation rehearsal",
        tone: "purple",
        participants: ["AK", "HA", "BH"],
        more: 120,
        lane: 0,
      },
    ],
  },
  {
    dateLabel: "12",
    weekday: "Wed",
    events: [
      {
        id: "tu-2",
        title: "35th Convocation 2026",
        tone: "green",
        participants: ["SR", "UF", "FN"],
        more: 800,
        lane: 1,
      },
      {
        id: "tu-3",
        title: "Industry job fair",
        tone: "orange",
        participants: ["DT", "RQ", "LH"],
        more: 45,
        lane: 2,
      },
    ],
  },
  {
    dateLabel: "18",
    weekday: "Tue",
    events: [
      {
        id: "tu-4",
        title: "IEEE tech symposium",
        tone: "blue",
        participants: ["MS", "TB", "AR"],
        more: 60,
        lane: 0,
      },
      {
        id: "tu-5",
        title: "Sports gala finals",
        tone: "teal",
        participants: ["AS", "UK", "OF"],
        more: 28,
        lane: 2,
      },
    ],
  },
  {
    dateLabel: "25",
    weekday: "Tue",
    events: [
      {
        id: "tu-6",
        title: "Semester orientation",
        tone: "purple",
        participants: ["ZM", "SI", "BA"],
        more: 200,
        lane: 1,
      },
    ],
  },
];

function ParticipantAvatars({
  participants,
  more,
}: {
  participants: string[];
  more: number;
}) {
  return (
    <div className="flex shrink-0 items-center gap-1.5">
      <div className="flex -space-x-2">
        {participants.slice(0, 3).map((p, i) => (
          <div
            key={`${p}-${i}`}
            className="flex size-6 items-center justify-center rounded-full border-2 border-white text-[8px] font-bold text-white shadow-sm"
            style={{ backgroundColor: AVATAR_COLORS[i % AVATAR_COLORS.length] }}
          >
            {p}
          </div>
        ))}
      </div>
      <span className="whitespace-nowrap text-[10px] font-semibold text-[#F4901F]">
        +{more} More
      </span>
    </div>
  );
}

function TimelineEventPill({
  title,
  tone,
  participants,
  more,
}: {
  title: string;
  tone: EventTone;
  participants: string[];
  more: number;
}) {
  const style = EVENT_TONE_STYLES[tone];
  return (
    <div className="relative flex min-w-[200px] max-w-[240px] items-center gap-2 overflow-hidden rounded-2xl border border-[#f0f0f5] bg-white py-2.5 pl-3 pr-3 shadow-[0_8px_24px_rgba(60,60,100,0.08)]">
      <span className={cn("absolute inset-y-2 left-0 w-1 rounded-full", style.bar)} />
      <p className="min-w-0 flex-1 truncate pl-1.5 text-xs font-bold text-[var(--foreground)]">
        {title}
      </p>
      <ParticipantAvatars participants={participants} more={more} />
    </div>
  );
}

/** Behance-style School Events horizontal timeline */
export function SchoolEventsTimeline({
  events,
  className,
  title = "School Events",
  showViewMore = false,
  useShowcase = true,
  variant = "school",
}: {
  events?: SchoolEvent[];
  className?: string;
  title?: string;
  showViewMore?: boolean;
  /** Prefer curated Behance layout; falls back to live events when false */
  useShowcase?: boolean;
  variant?: "school" | "university";
}) {
  const showcase = variant === "university" ? timelineShowcaseUniversity : timelineShowcase;

  const columns = useMemo(() => {
    if (useShowcase) return showcase;

    const sorted = [...(events ?? [])].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    );
    const byDate = new Map<string, SchoolEvent[]>();
    for (const event of sorted) {
      const list = byDate.get(event.date) ?? [];
      list.push(event);
      byDate.set(event.date, list);
    }

    const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const built = Array.from(byDate.entries())
      .slice(0, 4)
      .map(([date, dayEvents], colIdx) => {
        const d = new Date(date);
        return {
          dateLabel: String(d.getDate()).padStart(2, "0"),
          weekday: weekdays[d.getDay()],
          events: dayEvents.slice(0, 2).map((e, i) => ({
            id: e.id,
            title: e.title,
            tone: e.tone,
            participants: e.participants.length ? e.participants : ["AM", "HA", "ZM"],
            more: 15,
            lane: (i === 0 ? (colIdx % 2 === 0 ? 0 : 1) : 2) as 0 | 1 | 2,
          })),
        };
      });

    // Never render an empty timeline — fall back to curated showcase
    return built.length > 0 ? built : showcase;
  }, [events, useShowcase, showcase]);

  if (columns.length === 0) {
    return (
      <div
        className={cn(
          "rounded-[1.25rem] bg-[var(--surface)] p-5 shadow-[var(--shadow-sm)]",
          className,
        )}
      >
        <div className="mb-5 flex items-center justify-between">
          <h3 className="text-lg font-bold text-[#6B58F6]">{title}</h3>
        </div>
        <p className="py-10 text-center text-sm text-[var(--muted)]">No upcoming events yet.</p>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "rounded-[1.25rem] bg-[var(--surface)] p-5 shadow-[var(--shadow-sm)]",
        className,
      )}
    >
      <div className="mb-5 flex items-center justify-between">
        <h3 className="text-lg font-bold text-[#6B58F6]">{title}</h3>
        {showViewMore ? (
          <Link
            href="/events"
            className="inline-flex items-center gap-1 text-xs font-semibold text-[#6B58F6] hover:underline"
          >
            View more
            <ArrowRight className="size-3.5" />
          </Link>
        ) : null}
      </div>

      <div className="overflow-x-auto pb-1">
        <div
          className="relative min-w-[780px]"
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${columns.length}, minmax(180px, 1fr))`,
          }}
        >
          {/* Date headers + dashed rails */}
          {columns.map((col) => (
            <div key={col.dateLabel} className="relative flex flex-col items-center">
              <div className="z-10 rounded-xl border border-[#eeeef5] bg-white px-2.5 py-1.5 text-center shadow-sm">
                <p className="text-[11px] font-bold leading-none text-[var(--foreground)]">
                  {col.dateLabel}
                </p>
                <p className="mt-0.5 text-[9px] font-medium text-[var(--muted)]">{col.weekday}</p>
              </div>
              <div className="absolute top-10 bottom-0 w-px border-l border-dashed border-[#dcd8f0]" />
            </div>
          ))}

          {/* Staggered event lanes */}
          <div
            className="col-span-full mt-3 grid min-h-[220px] gap-0"
            style={{
              gridTemplateColumns: `repeat(${columns.length}, minmax(180px, 1fr))`,
            }}
          >
            {columns.map((col) => (
              <div key={`lane-${col.dateLabel}`} className="relative px-2 pt-2">
                {[0, 1, 2].map((lane) => {
                  const event = col.events.find((e) => e.lane === lane);
                  return (
                    <div
                      key={lane}
                      className={cn(
                        "flex min-h-[64px] items-start justify-center",
                        lane === 0 && "pt-1",
                        lane === 1 && "pt-2",
                        lane === 2 && "pt-1",
                      )}
                    >
                      {event ? (
                        <TimelineEventPill
                          title={event.title}
                          tone={event.tone}
                          participants={event.participants}
                          more={event.more}
                        />
                      ) : null}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function ActivityStatsList({
  className,
  items = [
    { id: "#123456789", date: "2 March 2026, 13:45 PM", amount: "+$240" },
    { id: "#123456790", date: "2 March 2026, 11:20 AM", amount: "+$180" },
    { id: "#123456791", date: "1 March 2026, 16:05 PM", amount: "+$95" },
    { id: "#123456792", date: "1 March 2026, 09:12 AM", amount: "+$320" },
  ],
}: {
  className?: string;
  items?: { id: string; date: string; amount: string }[];
}) {
  return (
    <div
      className={cn(
        "rounded-[1.25rem] bg-[var(--surface)] p-5 shadow-[var(--shadow-sm)]",
        className,
      )}
    >
      <h3 className="mb-4 text-base font-semibold">Recent Activity</h3>
      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.id} className="flex items-center gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#6B58F6] text-white shadow-md shadow-[#6B58F6]/25">
              <ArrowUpRight className="size-4" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold">{item.id}</p>
              <p className="text-[11px] text-[var(--muted)]">{item.date}</p>
            </div>
            <span className="text-xs font-bold text-[#1BD0B4]">{item.amount}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function SchoolEventsStatBanner({
  progress = 68,
  rangeLabel = "Jan - Feb",
}: {
  progress?: number;
  rangeLabel?: string;
}) {
  return (
    <div className="rounded-[1.25rem] bg-[var(--surface)] p-5 shadow-[var(--shadow-sm)]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-bold">School Events</h3>
          <p className="mt-1 text-xs text-[var(--muted)]">{rangeLabel}</p>
        </div>
        <div className="flex size-10 items-center justify-center rounded-xl bg-[#efeaff] text-lg">
          📅
        </div>
      </div>
      <div className="mt-4">
        <div className="mb-1.5 flex items-center justify-between text-[10px] font-medium text-[var(--muted)]">
          <span>Progress</span>
          <span>{progress}%</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-[var(--surface-muted)]">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#6B58F6] to-[#8C4AF2]"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}

export function GoodMorningBanner({ eventCount }: { eventCount: number }) {
  return (
    <div className="relative overflow-hidden rounded-[1.25rem] bg-gradient-to-r from-[#efeaff] via-[#f5f3ff] to-[#e6fbf7] p-5 shadow-[var(--shadow-sm)]">
      <div className="pointer-events-none absolute -right-4 -top-4 size-24 rounded-full bg-[#6B58F6]/10" />
      <div className="relative z-10 flex items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-[var(--foreground)]">Hello, Good Morning!</h3>
          <p className="mt-1 max-w-sm text-sm text-[var(--muted)]">
            You have {eventCount} upcoming school events. Stay updated with the timeline and event
            list.
          </p>
        </div>
        <div className="hidden shrink-0 items-end gap-2 sm:flex">
          <div className="flex size-12 items-center justify-center rounded-2xl bg-white text-xl shadow-sm">
            🎓
          </div>
          <div className="flex size-14 items-center justify-center rounded-2xl bg-[#6B58F6] text-2xl text-white shadow-md">
            🎉
          </div>
        </div>
      </div>
    </div>
  );
}
