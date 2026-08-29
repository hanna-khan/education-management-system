"use client";

import Link from "next/link";
import {
  BookOpen,
  ClipboardCheck,
  ClipboardPen,
  Trophy,
  Wallet,
} from "lucide-react";
import { useApp } from "@/hooks/use-app";
import { getGreeting } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
import { mockStudentResults, mockExamSchedule } from "@/mock/exams";
import { mockStudentCourses } from "@/mock/portals";

export function StudentPortalDashboard() {
  const { user, institution, institutionMode, t, enabledModules } = useApp();
  const { events } = useSchoolEvents();
  const firstName = user.name.split(" ")[0];
  const isUniversity = institutionMode === "university";
  const avgAttendance = Math.round(
    mockStudentCourses.reduce((sum, c) => sum + c.attendance, 0) /
      Math.max(mockStudentCourses.length, 1),
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{getGreeting(firstName)}</h1>
          <p className="mt-1 text-sm text-[var(--muted)]">
            {institution.shortName} student portal — academics, attendance, fees
            {isUniversity ? ", forms & passes" : ""}.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {enabledModules.forms !== false ? (
            <Button size="sm" variant="outline" className="rounded-xl" asChild>
              <Link href="/student/forms">
                <ClipboardPen className="mr-1.5 size-3.5" />
                Forms
              </Link>
            </Button>
          ) : null}
          <Button size="sm" className="rounded-xl" asChild>
            <Link href="/student/applications">New application</Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <ColorStatCard label="Attendance" value={`${avgAttendance}%`} change="+2%" changeType="up" icon={ClipboardCheck} tone="teal" />
        <ColorStatCard label="Current GPA" value={mockStudentResults.gpa.toFixed(2)} change="+0.04" changeType="up" icon={Trophy} tone="purple" />
        <ColorStatCard label="CGPA" value={mockStudentResults.cgpa.toFixed(2)} icon={BookOpen} tone="blue" />
        <ColorStatCard label="Fee status" value="Paid" change="Clear" changeType="up" icon={Wallet} tone="mint" />
      </div>

      <div className="grid gap-6 xl:grid-cols-5">
        <ChartCard className="xl:col-span-3" title="GPA progress" subtitle="Semester-wise GPA trend">
          <SimpleBarTrend
            data={studentGpaTrend.map((d) => ({ name: d.name, value: Math.round(d.value * 100) }))}
            color={CHART_COLORS.purple}
          />
        </ChartCard>
        <ChartCard className="xl:col-span-2" title="Class attendance mix" subtitle="This month">
          <AttendanceDonut data={attendanceBreakdown} />
        </ChartCard>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <StarStudentsCard />
        <BestPerformersCard />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <ChartCard className="lg:col-span-1" title="This week attendance" subtitle="Daily">
          <SimpleBarTrend data={studentAttendanceWeekly} color={CHART_COLORS.teal} />
        </ChartCard>
        <div className="lg:col-span-1">
          <DashboardUpcomingEvents />
        </div>
        <SchoolEventCalendar
          events={events}
          title={isUniversity ? "Academic calendar" : "School event calendar"}
        />
      </div>

      <div className="rounded-[1.25rem] bg-[var(--surface)] p-5 shadow-[var(--shadow-sm)]">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-base font-semibold">Upcoming exams</h3>
          <Button asChild size="sm" variant="outline" className="rounded-xl">
            <Link href="/student/exams">All exams</Link>
          </Button>
        </div>
        <ul className="space-y-2 text-sm">
          {mockExamSchedule.slice(0, 4).map((exam) => (
            <li key={exam.id} className="flex items-center justify-between gap-3 border-b border-[var(--border-subtle)] py-2 last:border-0">
              <span className="font-medium">{exam.course}</span>
              <Badge variant="outline">{exam.date}</Badge>
            </li>
          ))}
        </ul>
        {isUniversity ? (
          <p className="mt-3 text-xs text-[var(--muted)]">
            Your {t("section_lead")} can help with course advising from the Advising module.
          </p>
        ) : null}
      </div>
    </div>
  );
}
