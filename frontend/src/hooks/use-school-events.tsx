"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  initialSchoolEvents,
  eventToDashboardFormat,
  getUpcomingEvents,
  type SchoolEvent,
} from "@/mock/events";
import type { DashboardEvent } from "@/components/dashboard/widgets";

interface SchoolEventsContextValue {
  events: SchoolEvent[];
  upcomingEvents: SchoolEvent[];
  dashboardEvents: DashboardEvent[];
  addEvent: (event: Omit<SchoolEvent, "id">) => void;
  removeEvent: (id: string) => void;
}

const SchoolEventsContext = createContext<SchoolEventsContextValue | null>(null);

export function SchoolEventsProvider({ children }: { children: ReactNode }) {
  const [events, setEvents] = useState<SchoolEvent[]>(initialSchoolEvents);

  const addEvent = useCallback((event: Omit<SchoolEvent, "id">) => {
    const id = `evt-${Date.now()}`;
    setEvents((prev) => [...prev, { ...event, id }]);
  }, []);

  const removeEvent = useCallback((id: string) => {
    setEvents((prev) => prev.filter((e) => e.id !== id));
  }, []);

  const upcomingEvents = useMemo(() => getUpcomingEvents(events, 20), [events]);
  const dashboardEvents = useMemo(
    () => upcomingEvents.slice(0, 2).map(eventToDashboardFormat),
    [upcomingEvents],
  );

  const value = useMemo(
    () => ({ events, upcomingEvents, dashboardEvents, addEvent, removeEvent }),
    [events, upcomingEvents, dashboardEvents, addEvent, removeEvent],
  );

  return (
    <SchoolEventsContext.Provider value={value}>{children}</SchoolEventsContext.Provider>
  );
}

export function useSchoolEvents() {
  const context = useContext(SchoolEventsContext);
  if (!context) {
    throw new Error("useSchoolEvents must be used within SchoolEventsProvider");
  }
  return context;
}

export const ADMIN_ROLES = [
  "super_admin",
  "institution_admin",
  "principal",
  "dean",
  "hod",
] as const;

export function canManageEvents(role: string) {
  return (ADMIN_ROLES as readonly string[]).includes(role);
}
