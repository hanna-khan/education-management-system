"use client";

import Link from "next/link";
import {
  BookOpen,
  ClipboardCheck,
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
  const { user } = useApp();
  const { events } = useSchoolEvents();
  const firstName = user.name.split(" ")[0];
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
            Your academics, attendance, fees, and upcoming exams at a glance.
          </p>
        </div>
        <Button size="sm" className="rounded-xl" asChild>
          <Link href="/student/applications">New application</Link>
        </Button>
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
        <ChartCard title="This week attendance" subtitle="Daily presence %">
          <SimpleBarTrend data={studentAttendanceWeekly} color={CHART_COLORS.teal} />
        </ChartCard>
        <div className="space-y-3 rounded-[1.25rem] bg-[var(--surface)] p-5 shadow-[var(--shadow-sm)]">
          <h3 className="text-base font-semibold">Upcoming exams</h3>
          <div className="space-y-3">
            {mockExamSchedule.slice(0, 4).map((exam) => (
              <div key={exam.id} className="rounded-xl border border-[var(--border-subtle)] p-3">
                <p className="text-sm font-semibold">{exam.course}</p>
                <p className="mt-1 text-xs text-[var(--muted)]">
                  {exam.date} · {exam.time}
                </p>
                <Badge variant="info" className="mt-2">{exam.type}</Badge>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
        <DashboardUpcomingEvents />
        <SchoolEventCalendar events={events} />
        <ChartCard title="My courses" subtitle="Current enrollment">
          <div className="space-y-3">
            {mockStudentCourses.slice(0, 5).map((course) => (
              <div key={course.code} className="flex items-center justify-between rounded-xl bg-[var(--surface-muted)] px-3 py-2.5">
                <div>
                  <p className="text-sm font-medium">{course.name}</p>
                  <p className="text-xs text-[var(--muted)]">{course.code} · {course.instructor}</p>
                </div>
                <span className="text-sm font-semibold text-[#6B58F6]">{course.attendance}%</span>
              </div>
            ))}
          </div>
        </ChartCard>
      </div>
    </div>
  );
}
