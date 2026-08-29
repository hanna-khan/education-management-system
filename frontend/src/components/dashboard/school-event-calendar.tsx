"use client";

import { useMemo, useState } from "react";
import { Clock, MapPin, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  EVENT_TONE_STYLES,
  getEventsForDay,
  type SchoolEvent,
  type EventTone,
} from "@/mock/events";

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const TONE_HEX: Record<EventTone, string> = {
  purple: "#6B58F6",
  teal: "#1BD0B4",
  orange: "#F4901F",
  coral: "#FF394B",
  blue: "#3B82F6",
  green: "#10B981",
};

interface CalendarDay {
  day: number | null;
  events: SchoolEvent[];
}

function buildCalendarGrid(year: number, month: number, events: SchoolEvent[]): CalendarDay[] {
  const firstDay = new Date(year, month, 1);
  const startOffset = (firstDay.getDay() + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells: CalendarDay[] = Array.from({ length: startOffset }, () => ({
    day: null,
    events: [],
  }));

  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ day: d, events: getEventsForDay(events, year, month, d) });
  }

  while (cells.length % 7 !== 0) {
    cells.push({ day: null, events: [] });
  }

  return cells;
}

export function SchoolEventCalendar({
  events,
  today = new Date(2026, 7, 22),
  className,
  title = "School Event Calendar",
}: {
  events: SchoolEvent[];
  today?: Date;
  studentCount?: number;
  className?: string;
  title?: string;
}) {
  const [viewDate, setViewDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [selectedDay, setSelectedDay] = useState<{ day: number; events: SchoolEvent[] } | null>(
    null,
  );

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const cells = useMemo(() => buildCalendarGrid(year, month, events), [year, month, events]);

  const isToday = (day: number) =>
    day === today.getDate() && month === today.getMonth() && year === today.getFullYear();

  return (
    <>
      <div
        className={cn(
          "h-fit rounded-[1.25rem] bg-[var(--surface)] p-4 shadow-[var(--shadow-sm)]",
          className,
        )}
      >
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <h3 className="text-base font-semibold">{title}</h3>
          <div className="flex items-center gap-1">
            <Select
              value={String(month)}
              onValueChange={(v) => setViewDate(new Date(year, Number(v), 1))}
            >
              <SelectTrigger className="h-7 w-[100px] rounded-lg border-0 bg-transparent px-1 text-xs font-semibold text-[#6B58F6] shadow-none">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {MONTHS.map((m, i) => (
                  <SelectItem key={m} value={String(i)}>
                    {m}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={String(year)}
              onValueChange={(v) => setViewDate(new Date(Number(v), month, 1))}
            >
              <SelectTrigger className="h-7 w-[72px] rounded-lg border-0 bg-transparent px-1 text-xs font-semibold text-[#6B58F6] shadow-none">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[2025, 2026, 2027].map((y) => (
                  <SelectItem key={y} value={String(y)}>
                    {y}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-0.5 text-center">
          {WEEKDAYS.map((d) => (
            <div key={d} className="py-0.5 text-[10px] font-semibold uppercase text-[var(--muted)]">
              {d}
            </div>
          ))}
          {cells.map((cell, i) => {
            if (!cell.day) return <div key={i} className="h-8" />;

            const todayCell = isToday(cell.day);
            const hasEvents = cell.events.length > 0;
            const tones = [...new Set(cell.events.map((e) => e.tone))].slice(0, 3);

            return (
              <button
                key={i}
                type="button"
                onClick={() =>
                  hasEvents && setSelectedDay({ day: cell.day!, events: cell.events })
                }
                className={cn(
                  "flex h-8 flex-col items-center justify-center rounded-lg text-[11px] transition-all",
                  todayCell && "bg-[#6B58F6] font-bold text-white shadow-sm shadow-[#6B58F6]/30",
                  !todayCell && "text-[var(--foreground)] hover:bg-[var(--surface-muted)]",
                  hasEvents && "cursor-pointer",
                )}
              >
                <span className="leading-none">{cell.day}</span>
                {hasEvents ? (
                  <span className="mt-0.5 flex items-center justify-center gap-0.5">
                    {tones.map((tone) => (
                      <span
                        key={tone}
                        className="size-1.5 rounded-full"
                        style={{
                          backgroundColor: todayCell ? "rgba(255,255,255,0.9)" : TONE_HEX[tone],
                        }}
                      />
                    ))}
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>
      </div>

      <Dialog open={!!selectedDay} onOpenChange={() => setSelectedDay(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              Events on{" "}
              {selectedDay ? `${MONTHS[month]} ${selectedDay.day}, ${year}` : ""}
            </DialogTitle>
            <DialogDescription>
              {selectedDay?.events.length} scheduled event
              {selectedDay && selectedDay.events.length !== 1 ? "s" : ""}
            </DialogDescription>
          </DialogHeader>
          <div className="max-h-[360px] space-y-3 overflow-y-auto">
            {selectedDay?.events.map((event) => {
              const style = EVENT_TONE_STYLES[event.tone];
              return (
                <div
                  key={event.id}
                  className={cn("rounded-xl border p-4", style.border, style.bg)}
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className={cn("font-semibold", style.text)}>{event.title}</p>
                    <Badge variant="outline" className="shrink-0 text-[10px]">
                      {event.type}
                    </Badge>
                  </div>
                  <p className="mt-2 text-xs text-[var(--muted)]">{event.description}</p>
                  <div className="mt-3 space-y-1.5 text-xs text-[var(--muted)]">
                    <p className="flex items-center gap-1.5">
                      <Clock className="size-3.5" />
                      {event.time}
                    </p>
                    <p className="flex items-center gap-1.5">
                      <MapPin className="size-3.5" />
                      {event.location}
                    </p>
                    <p className="flex items-center gap-1.5">
                      <Users className="size-3.5" />
                      {event.sold}/{event.capacity} registered
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
