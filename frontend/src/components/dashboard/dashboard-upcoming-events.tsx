"use client";

import { useState } from "react";
import { useApp } from "@/hooks/use-app";
import { canManageEvents, useSchoolEvents } from "@/hooks/use-school-events";
import { UpcomingEventsCard } from "@/components/dashboard/widgets";
import { CreateEventDialog } from "@/components/dashboard/create-event-dialog";

export function DashboardUpcomingEvents() {
  const { user } = useApp();
  const { dashboardEvents, upcomingEvents } = useSchoolEvents();
  const [createOpen, setCreateOpen] = useState(false);
  const canManage = canManageEvents(user.role);
  const moreCount = Math.max(0, upcomingEvents.length - dashboardEvents.length);

  return (
    <>
      <UpcomingEventsCard
        events={dashboardEvents}
        moreCount={moreCount || 5}
        onAdd={canManage ? () => setCreateOpen(true) : undefined}
      />
      {canManage ? (
        <CreateEventDialog open={createOpen} onOpenChange={setCreateOpen} />
      ) : null}
    </>
  );
}
