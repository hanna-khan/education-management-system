"use client";

import Link from "next/link";
import {
  Bell,
  ClipboardCheck,
  Trophy,
  Users,
  Wallet,
} from "lucide-react";
import { useApp } from "@/hooks/use-app";
import { cn, formatCurrency, getGreeting } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ColorStatCard } from "@/components/dashboard/color-stat-card";
import {
  ChartCard,
  AttendanceDonut,
  SimpleBarTrend,
  CHART_COLORS,
} from "@/components/dashboard/charts";
import { DashboardUpcomingEvents } from "@/components/dashboard/dashboard-upcoming-events";
import { SchoolEventCalendar } from "@/components/dashboard/school-event-calendar";
import { StarStudentsCard, BestPerformersCard } from "@/components/dashboard/star-performers-card";
import { useSchoolEvents } from "@/hooks/use-school-events";
import {
  attendanceBreakdown,
  studentAttendanceWeekly,
  studentGpaTrend,
} from "@/mock/dashboard";
import { mockParentAlerts, mockParentChildren, mockParentFeeInstallments, mockSubjectGradeMix } from "@/mock/portals";
import { mockNotices } from "@/mock/communication";

export function ParentPortalDashboard() {
  const { user, selectedChildId, setSelectedChildId, selectedChild, institution, t } = useApp();
  const { events } = useSchoolEvents();
  const firstName = user.name.split(" ")[0];
  const child = selectedChild;
  const notices = mockNotices.filter((n) => n.status === "published").slice(0, 4);
  const unreadAlerts = mockParentAlerts.filter((a) => !a.read).length;
  const childOutstanding = mockParentFeeInstallments
    .filter((f) => f.studentId === child.id)
    .reduce((sum, f) => sum + Math.max(f.amount - f.paid, 0), 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{getGreeting(firstName)}</h1>
          <p className="mt-1 text-sm text-[var(--muted)]">
            {institution.shortName} {t("parent").toLowerCase()} portal — follow {child.name}&apos;s progress.
          </p>
        </div>
        {unreadAlerts > 0 ? (
          <Button size="sm" variant="outline" className="rounded-xl" asChild>
            <Link href="/parent/alerts">
              <Bell className="size-4" />
              {unreadAlerts} new alerts
            </Link>
          </Button>
        ) : null}
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        {mockParentChildren.map((item) => {
          const active = item.id === selectedChildId;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setSelectedChildId(item.id)}
              className={cn(
                "rounded-2xl border p-4 text-left transition-all",
                active
                  ? "border-[#6B58F6] bg-[#efeaff] shadow-[var(--shadow-sm)] ring-2 ring-[#6B58F6]/20"
                  : "border-[var(--border)] bg-[var(--surface)] hover:border-[#6B58F6]/40",
              )}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-semibold">{item.name}</p>
                  <p className="text-xs text-[var(--muted)]">{item.grade} · {item.program}</p>
                </div>
                <Badge
                  variant={
                    item.attendanceToday === "present"
                      ? "success"
                      : item.attendanceToday === "absent"
                        ? "error"
                        : "warning"
                  }
                >
                  {item.attendanceToday}
                </Badge>
              </div>
            </button>
          );
        })}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <ColorStatCard
          label={`${child.name.split(" ")[0]} · Attendance`}
          value={child.attendanceToday === "present" ? "Present" : child.attendanceToday}
          changeType={child.attendanceToday === "present" ? "up" : "down"}
          icon={ClipboardCheck}
          tone="teal"
        />
        <ColorStatCard label="GPA" value={child.gpa.toFixed(2)} icon={Trophy} tone="purple" />
        <ColorStatCard
          label="Fee status"
          value={childOutstanding === 0 ? "Clear" : formatCurrency(childOutstanding)}
          changeType={childOutstanding === 0 ? "up" : "down"}
          icon={Wallet}
          tone="orange"
        />
        <ColorStatCard label="Children" value={mockParentChildren.length} icon={Users} tone="blue" />
      </div>

      <div className="grid gap-6 xl:grid-cols-5">
        <ChartCard className="xl:col-span-3" title={`${child.name.split(" ")[0]}'s GPA progress`} subtitle="Semester-wise performance">
          <SimpleBarTrend
            data={studentGpaTrend.map((d) => ({ name: d.name, value: Math.round(d.value * 100) }))}
            color={CHART_COLORS.purple}
          />
        </ChartCard>
        <ChartCard className="xl:col-span-2" title="Grade mix" subtitle="Current courses">
          <AttendanceDonut data={mockSubjectGradeMix} />
        </ChartCard>
      </div>

      <div className="grid gap-6 xl:grid-cols-5">
        <ChartCard className="xl:col-span-3" title={`${child.name.split(" ")[0]}'s weekly attendance`} subtitle="Presence percentage">
          <SimpleBarTrend data={studentAttendanceWeekly} color={CHART_COLORS.teal} />
        </ChartCard>
        <ChartCard className="xl:col-span-2" title="Campus attendance mix">
          <AttendanceDonut data={attendanceBreakdown} />
        </ChartCard>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <StarStudentsCard />
        <BestPerformersCard />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <DashboardUpcomingEvents />
        <SchoolEventCalendar events={events} title={`${institution.shortName} calendar`} />
        <div className="rounded-[1.25rem] bg-[var(--surface)] p-5 shadow-[var(--shadow-sm)]">
          <h3 className="mb-4 text-base font-semibold">Latest notices</h3>
          <div className="space-y-3">
            {notices.map((notice) => (
              <div key={notice.id} className="rounded-xl border border-[var(--border-subtle)] p-3">
                <p className="text-sm font-medium">{notice.title}</p>
                <p className="mt-1 text-xs text-[var(--muted)]">{notice.published}</p>
              </div>
            ))}
          </div>
          <p className="mt-4 text-xs text-[var(--muted)]">
            Class teacher: {child.classTeacher} · {child.classTeacherTitle}
          </p>
        </div>
      </div>
    </div>
  );
}
