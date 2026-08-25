"use client";

import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Clock, MoreVertical, Plus, Search } from "lucide-react";
import { ModuleHub } from "@/components/shared/module-hub";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn, getGreeting } from "@/lib/utils";
import { useApp } from "@/hooks/use-app";
import { canManageEvents, useSchoolEvents } from "@/hooks/use-school-events";
import { CreateEventDialog } from "@/components/dashboard/create-event-dialog";
import {
  GoodMorningBanner,
  SchoolEventsStatBanner,
  SchoolEventsTimeline,
} from "@/components/dashboard/school-events-timeline";
import { EVENT_TONE_STYLES, type SchoolEvent } from "@/mock/events";

const AVATAR_COLORS = ["#6B58F6", "#1BD0B4", "#F4901F", "#3B82F6", "#8C4AF2"];

function ParticipantAvatars({ participants }: { participants: string[] }) {
  const shown = participants.slice(0, 3);
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex -space-x-2">
        {shown.map((p, i) => (
          <div
            key={`${p}-${i}`}
            className="flex size-7 items-center justify-center rounded-full border-2 border-white text-[9px] font-bold text-white"
            style={{ backgroundColor: AVATAR_COLORS[i % AVATAR_COLORS.length] }}
          >
            {p}
          </div>
        ))}
      </div>
      <span className="text-[10px] font-semibold text-[#F4901F]">
        +{Math.max(12, participants.length)} More
      </span>
    </div>
  );
}

function EventListItem({ event }: { event: SchoolEvent }) {
  const style = EVENT_TONE_STYLES[event.tone];
  const d = new Date(event.date);
  const dateLabel = d.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
  const ticketsLeft = Math.max(0, event.capacity - event.sold);
  const progress = Math.round((event.sold / Math.max(event.capacity, 1)) * 100);

  return (
    <div className="relative overflow-hidden rounded-xl border border-[var(--border-subtle)] bg-[var(--surface)] p-4 pl-5">
      <span className={cn("absolute inset-y-0 left-0 w-1", style.bar)} />
      <div className="flex items-start justify-between gap-2">
        <p className={cn("text-xs font-semibold", style.text)}>{dateLabel}</p>
        <button type="button" className="text-[var(--muted)] hover:text-[var(--foreground)]">
          <MoreVertical className="size-4" />
        </button>
      </div>
      <p className="mt-1 text-sm font-bold">{event.title}</p>
      <p className="mt-1.5 flex items-center gap-1.5 text-xs text-[var(--muted)]">
        <Clock className="size-3.5" />
        {event.time}
      </p>
      {event.price !== undefined ? (
        <p className="mt-1.5 text-sm font-bold text-[#1BD0B4]">${event.price.toFixed(1)}</p>
      ) : (
        <p className="mt-1.5 text-sm font-bold text-[#1BD0B4]">Free</p>
      )}
      <div className="mt-3">
        <div className="h-1.5 overflow-hidden rounded-full bg-[var(--surface-muted)]">
          <div className={cn("h-full rounded-full", style.bar)} style={{ width: `${progress}%` }} />
        </div>
        <p className="mt-1.5 text-[10px] font-medium text-[var(--muted)]">
          {ticketsLeft} ticket{ticketsLeft === 1 ? "" : "s"} left
        </p>
      </div>
    </div>
  );
}

function PastEventCard({ event }: { event: SchoolEvent }) {
  const d = new Date(event.date);
  return (
    <div className="min-w-[200px] flex-1 rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface)] p-4 shadow-[var(--shadow-sm)]">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold text-[var(--muted)]">
            {d.toLocaleDateString("en-US", { day: "2-digit", month: "short", year: "numeric" })}
          </p>
          <p className="mt-0.5 text-[10px] text-[var(--muted)]">{event.time}</p>
        </div>
        <button type="button" className="text-[var(--muted)]">
          <MoreVertical className="size-4" />
        </button>
      </div>
      <p className="mt-3 text-sm font-bold">{event.title}</p>
      <p className="mt-1 text-[10px] font-medium text-[#6B58F6]">Participate</p>
      <div className="mt-3">
        <ParticipantAvatars
          participants={event.participants.length ? event.participants : ["AM", "HA", "ZM"]}
        />
      </div>
    </div>
  );
}

export function EventsPage() {
  const { user } = useApp();
  const { events, upcomingEvents } = useSchoolEvents();
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("newest");
  const [createOpen, setCreateOpen] = useState(false);
  const [listPage, setListPage] = useState(1);
  const canManage = canManageEvents(user.role);
  const firstName = user.name.split(" ")[0];
  const pageSize = 4;

  const filtered = useMemo(() => {
    let list = [...events];
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (e) =>
          e.title.toLowerCase().includes(q) ||
          e.type.toLowerCase().includes(q) ||
          e.location.toLowerCase().includes(q),
      );
    }
    list.sort((a, b) =>
      sort === "newest"
        ? new Date(b.date).getTime() - new Date(a.date).getTime()
        : new Date(a.date).getTime() - new Date(b.date).getTime(),
    );
    return list;
  }, [events, search, sort]);

  const timelineEvents = useMemo(() => {
    const source = upcomingEvents.length ? upcomingEvents : events;
    return source.slice(0, 8);
  }, [upcomingEvents, events]);

  const pastEvents = useMemo(
    () =>
      events
        .filter((e) => new Date(e.date) < new Date("2026-08-22"))
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 4),
    [events],
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const pagedList = filtered.slice((listPage - 1) * pageSize, listPage * pageSize);

  return (
    <>
      <ModuleHub
        title="Events"
        description={`${getGreeting(firstName)} Welcome to Edu-Center Dashboard.`}
        breadcrumbs={[{ label: "Dashboard", href: "/dashboard" }, { label: "Events" }]}
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative hidden sm:block">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[var(--muted)]" />
              <Input
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setListPage(1);
                }}
                placeholder="Search here..."
                className="h-9 w-48 rounded-xl pl-9 lg:w-56"
              />
            </div>
            <Select value={sort} onValueChange={setSort}>
              <SelectTrigger className="h-9 w-[110px] rounded-xl text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="oldest">Oldest</SelectItem>
              </SelectContent>
            </Select>
            {canManage ? (
              <Button size="sm" className="rounded-xl" onClick={() => setCreateOpen(true)}>
                <Plus className="size-4" />
                Add Events
              </Button>
            ) : null}
          </div>
        }
      >
        <div className="mb-6 grid gap-4 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <SchoolEventsStatBanner
              progress={Math.min(95, upcomingEvents.length * 12 + 20)}
              rangeLabel="Aug - Sep"
            />
          </div>
          <div className="lg:col-span-3">
            <GoodMorningBanner eventCount={upcomingEvents.length} />
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-3">
          <div className="space-y-6 xl:col-span-2">
            <SchoolEventsTimeline events={timelineEvents} title="School Events" />

            <div>
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-base font-semibold">Recent Past Events</h3>
                <button type="button" className="text-xs font-semibold text-[#6B58F6] hover:underline">
                  View All &gt;
                </button>
              </div>
              <div className="flex gap-4 overflow-x-auto pb-1">
                {(pastEvents.length ? pastEvents : events.slice(0, 4)).map((event) => (
                  <PastEventCard key={event.id} event={event} />
                ))}
              </div>
            </div>
          </div>

          <div className="rounded-[1.25rem] bg-[var(--surface)] p-5 shadow-[var(--shadow-sm)]">
            <h3 className="mb-4 text-base font-semibold">Event List</h3>
            <div className="space-y-3">
              {pagedList.map((event) => (
                <EventListItem key={event.id} event={event} />
              ))}
              {pagedList.length === 0 ? (
                <p className="py-8 text-center text-sm text-[var(--muted)]">No events found.</p>
              ) : null}
            </div>

            <Button
              variant="outline"
              className="mt-4 w-full rounded-xl"
              onClick={() => setListPage((p) => Math.min(totalPages, p + 1))}
              disabled={listPage >= totalPages}
            >
              See More
            </Button>

            <div className="mt-4 flex items-center justify-center gap-1.5">
              <button
                type="button"
                disabled={listPage <= 1}
                onClick={() => setListPage((p) => Math.max(1, p - 1))}
                className="flex size-8 items-center justify-center rounded-full text-[var(--muted)] hover:bg-[var(--surface-muted)] disabled:opacity-40"
              >
                <ChevronLeft className="size-4" />
              </button>
              {Array.from({ length: Math.min(totalPages, 4) }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  type="button"
                  onClick={() => setListPage(page)}
                  className={cn(
                    "flex size-8 items-center justify-center rounded-full text-xs font-semibold transition-colors",
                    listPage === page
                      ? "bg-[#6B58F6] text-white"
                      : "text-[var(--muted)] hover:bg-[var(--surface-muted)]",
                  )}
                >
                  {page}
                </button>
              ))}
              <button
                type="button"
                disabled={listPage >= totalPages}
                onClick={() => setListPage((p) => Math.min(totalPages, p + 1))}
                className="flex size-8 items-center justify-center rounded-full text-[var(--muted)] hover:bg-[var(--surface-muted)] disabled:opacity-40"
              >
                <ChevronRight className="size-4" />
              </button>
            </div>
          </div>
        </div>
      </ModuleHub>

      {canManage ? <CreateEventDialog open={createOpen} onOpenChange={setCreateOpen} /> : null}
    </>
  );
}
