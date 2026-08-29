"use client";

import Link from "next/link";
import {
  ClipboardCheck,
  Inbox,
  PenLine,
  Presentation,
  Users,
} from "lucide-react";
import { useApp } from "@/hooks/use-app";
import { getGreeting } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ColorStatCard } from "@/components/dashboard/color-stat-card";
import {
  ChartCard,
  PerformanceAreaChart,
  SimpleBarTrend,
  CHART_COLORS,
} from "@/components/dashboard/charts";
import { DashboardUpcomingEvents } from "@/components/dashboard/dashboard-upcoming-events";
import { SchoolEventCalendar } from "@/components/dashboard/school-event-calendar";
import { StarStudentsCard, BestPerformersCard } from "@/components/dashboard/star-performers-card";
import { useSchoolEvents } from "@/hooks/use-school-events";
import { teacherClassLoad } from "@/mock/dashboard";
import { mockTeacherClasses, mockTeacherSchedule } from "@/mock/portals";

export function TeacherPortalDashboard() {
  const { user, institution, institutionMode, t } = useApp();
  const { events } = useSchoolEvents();
  const firstName = user.name.split(" ")[0];
  const isUniversity = institutionMode === "university";
  const pendingAttendance = mockTeacherClasses.filter((c) => c.attendancePending).length;
  const totalStudents = mockTeacherClasses.reduce((sum, c) => sum + c.students, 0);
  const todaySlots = mockTeacherSchedule[0]?.slots ?? [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{getGreeting(firstName)}</h1>
          <p className="mt-1 text-sm text-[var(--muted)]">
            {institution.shortName} · {isUniversity ? `${t("faculty")} / ${t("section_lead")}` : "Teacher"} portal —
            classes, attendance, marks
            {isUniversity ? ", and advising" : ""}.
          </p>
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" className="rounded-xl" asChild>
            <Link href="/teacher/attendance">Mark attendance</Link>
          </Button>
          <Button size="sm" className="rounded-xl" asChild>
            <Link href="/teacher/marks">Enter marks</Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <ColorStatCard
          label={isUniversity ? "Active sections" : "Active classes"}
          value={mockTeacherClasses.length}
          icon={Presentation}
          tone="purple"
        />
        <ColorStatCard label="Total students" value={totalStudents} icon={Users} tone="teal" />
        <ColorStatCard
          label="Attendance pending"
          value={pendingAttendance}
          change={pendingAttendance > 0 ? "Action needed" : "All clear"}
          changeType={pendingAttendance > 0 ? "down" : "up"}
          icon={ClipboardCheck}
          tone="orange"
        />
        <ColorStatCard
          label={isUniversity ? "Advisor reviews" : "Reviews waiting"}
          value={4}
          change="Applications"
          changeType="neutral"
          icon={Inbox}
          tone="coral"
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-5">
        <ChartCard
          className="xl:col-span-3"
          title="Weekly class load"
          subtitle="Students taught per day"
        >
          <PerformanceAreaChart data={teacherClassLoad} />
        </ChartCard>
        <ChartCard className="xl:col-span-2" title="Marks progress" subtitle="Assessment completion">
          <SimpleBarTrend
            data={[
              { name: "Assign", value: 85 },
              { name: "Quiz", value: 70 },
              { name: "Mid", value: 40 },
              { name: "Lab", value: 90 },
            ]}
            color={CHART_COLORS.coral}
          />
        </ChartCard>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-[1.25rem] bg-[var(--surface)] p-5 shadow-[var(--shadow-sm)]">
          <h3 className="mb-3 text-base font-semibold">Today&apos;s schedule</h3>
          <ul className="space-y-2 text-sm">
            {todaySlots.map((slot) => (
              <li key={`${slot.time}-${slot.course}`} className="flex items-center justify-between gap-2 border-b border-[var(--border-subtle)] py-2 last:border-0">
                <div>
                  <p className="font-medium">{slot.course}</p>
                  <p className="text-xs text-[var(--muted)]">{slot.room}</p>
                </div>
                <Badge variant="outline">{slot.time}</Badge>
              </li>
            ))}
          </ul>
          {isUniversity ? (
            <p className="mt-3 text-xs text-[var(--muted)]">
              {t("section_lead")} assignment is per section + semester — HOD can reassign from Academics → Sections.
            </p>
          ) : null}
        </div>
        <SchoolEventCalendar
          events={events}
          title={isUniversity ? "Academic calendar" : "School event calendar"}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <StarStudentsCard />
        <BestPerformersCard />
      </div>

      <DashboardUpcomingEvents />
    </div>
  );
}
