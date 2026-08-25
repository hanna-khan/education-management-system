"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { ModuleHub } from "@/components/shared/module-hub";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { useApp } from "@/hooks/use-app";
import { canManageEvents, useSchoolEvents } from "@/hooks/use-school-events";
import { CreateEventDialog } from "@/components/dashboard/create-event-dialog";
import {
  classRoutine,
  EVENT_TONE_STYLES,
  getEventsForDay,
  type EventTone,
  type SchoolEvent,
} from "@/mock/events";

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function CalendarPage() {
  const { user } = useApp();
  const { events } = useSchoolEvents();
  const today = new Date(2026, 7, 26);
  const [viewDate, setViewDate] = useState(new Date(2026, 8, 1));
  const [selectedDay, setSelectedDay] = useState<{ day: number; events: SchoolEvent[] } | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const canManage = canManageEvents(user.role);

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells = useMemo(() => {
    const result: { day: number | null; events: SchoolEvent[]; tone: EventTone | null }[] = [
      ...Array.from({ length: firstDay }, () => ({ day: null, events: [], tone: null })),
    ];
    for (let d = 1; d <= daysInMonth; d++) {
      const dayEvents = getEventsForDay(events, year, month, d);
      result.push({ day: d, events: dayEvents, tone: dayEvents[0]?.tone ?? null });
    }
    while (result.length % 7 !== 0) {
      result.push({ day: null, events: [], tone: null });
    }
    return result;
  }, [year, month, daysInMonth, firstDay, events]);

  const isToday = (day: number) =>
    day === today.getDate() && month === today.getMonth() && year === today.getFullYear();

  return (
    <>
      <ModuleHub
        title="Calendar"
        description="Class routine, school events, and monthly schedule at a glance."
        breadcrumbs={[{ label: "Dashboard", href: "/dashboard" }, { label: "Calendar" }]}
        actions={
          canManage ? (
            <Button size="sm" className="rounded-xl" onClick={() => setCreateOpen(true)}>
              Change Routine
            </Button>
          ) : undefined
        }
      >
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="rounded-[1.25rem] bg-[var(--surface)] p-5 shadow-[var(--shadow-sm)]">
            <h3 className="mb-1 text-base font-semibold">Class Routine</h3>
            <p className="mb-4 text-xs text-[var(--muted)]">September, 1st Week</p>
            <div className="space-y-4">
              {classRoutine.map((item) => {
                const style = EVENT_TONE_STYLES[item.tone];
                return (
                  <div key={item.id} className="flex gap-3 rounded-xl border border-[var(--border-subtle)] p-3">
                    <Star className={cn("mt-0.5 size-4 shrink-0", style.text)} fill="currentColor" />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold">{item.subjects.join(", ")}</p>
                      <div className="mt-2 flex items-center justify-between">
                        <div className="flex -space-x-1.5">
                          {item.participants.map((p, i) => (
                            <div
                              key={i}
                              className="flex size-6 items-center justify-center rounded-full border border-white bg-[#6B58F6] text-[8px] font-bold text-white"
                            >
                              {p}
                            </div>
                          ))}
                        </div>
                        <span className="text-[10px] text-[var(--muted)]">{item.date}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="lg:col-span-2 rounded-[1.25rem] bg-[var(--surface)] p-5 shadow-[var(--shadow-sm)]">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Badge variant="info">Today {today.getDate()}</Badge>
                <div className="flex items-center gap-1">
                  <button type="button" onClick={() => setViewDate(new Date(year, month - 1, 1))} className="rounded-lg p-1.5 hover:bg-[var(--surface-muted)]">
                    <ChevronLeft className="size-4" />
                  </button>
                  <span className="min-w-[140px] text-center text-sm font-semibold">
                    {MONTHS[month]} {year}
                  </span>
                  <button type="button" onClick={() => setViewDate(new Date(year, month + 1, 1))} className="rounded-lg p-1.5 hover:bg-[var(--surface-muted)]">
                    <ChevronRight className="size-4" />
                  </button>
                </div>
              </div>
              <Button size="sm" variant="outline" className="rounded-xl" asChild>
                <Link href="/events">View Events</Link>
              </Button>
            </div>

            <div className="grid grid-cols-7 gap-2">
              {WEEKDAYS.map((d) => (
                <div key={d} className="py-1 text-center text-[10px] font-semibold uppercase text-[var(--muted)]">{d}</div>
              ))}
              {cells.map((cell, i) => {
                if (!cell.day) return <div key={i} className="min-h-[80px]" />;

                const todayCell = isToday(cell.day);
                const hasEvents = cell.events.length > 0;
                const style = cell.tone ? EVENT_TONE_STYLES[cell.tone] : null;

                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() => hasEvents && setSelectedDay({ day: cell.day!, events: cell.events })}
                    className={cn(
                      "flex min-h-[80px] flex-col rounded-xl border p-2 text-left text-sm transition-all",
                      todayCell && "border-[#6B58F6] bg-[#6B58F6] font-bold text-white shadow-md",
                      !todayCell && hasEvents && style && `${style.fill} ${style.border}`,
                      !todayCell && !hasEvents && "border-[var(--border-subtle)] hover:bg-[var(--surface-muted)]",
                      hasEvents && "cursor-pointer",
                    )}
                  >
                    <span>{cell.day}</span>
                    {hasEvents ? (
                      <span className={cn("mt-auto text-[10px] font-semibold", todayCell ? "text-white/90" : style?.text)}>
                        {cell.events.length} Task{cell.events.length > 1 ? "s" : ""}
                      </span>
                    ) : null}
                  </button>
                );
              })}
            </div>

            <div className="mt-4 flex justify-end gap-1">
              {[1, 2, 3].map((p) => (
                <span
                  key={p}
                  className={cn(
                    "flex size-7 items-center justify-center rounded-full text-xs font-medium",
                    p === 1 ? "bg-[#6B58F6] text-white" : "text-[var(--muted)]",
                  )}
                >
                  {p}
                </span>
              ))}
            </div>
          </div>
        </div>
      </ModuleHub>

      <Dialog open={!!selectedDay} onOpenChange={() => setSelectedDay(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedDay ? `${MONTHS[month]} ${selectedDay.day}, ${year}` : ""}
            </DialogTitle>
            <DialogDescription>Scheduled events for this day</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            {selectedDay?.events.map((event) => {
              const style = EVENT_TONE_STYLES[event.tone];
              return (
                <div key={event.id} className={cn("rounded-xl border p-4", style.border, style.bg)}>
                  <p className={cn("font-semibold", style.text)}>{event.title}</p>
                  <p className="mt-1 text-xs text-[var(--muted)]">{event.time} · {event.location}</p>
                  <Badge variant="outline" className="mt-2 text-[10px]">{event.type}</Badge>
                </div>
              );
            })}
          </div>
        </DialogContent>
      </Dialog>

      {canManage ? <CreateEventDialog open={createOpen} onOpenChange={setCreateOpen} /> : null}
    </>
  );
}
