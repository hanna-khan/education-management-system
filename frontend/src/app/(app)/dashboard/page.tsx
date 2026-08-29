"use client";

import { useState } from "react";
import {
  Bed,
  Bus,
  CalendarDays,
  ClipboardCheck,
  ClipboardPen,
  FileText,
  GraduationCap,
  Inbox,
  Plus,
  Users,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { getGreeting, formatCurrency, formatNumber } from "@/lib/utils";
import { useApp } from "@/hooks/use-app";
import { useSchoolEvents } from "@/hooks/use-school-events";
import { Button } from "@/components/ui/button";
import { ColorStatCard } from "@/components/dashboard/color-stat-card";
import { ChartCard, FinanceLineChart } from "@/components/dashboard/charts";
import { SchoolPerformanceChart } from "@/components/dashboard/school-performance-chart";
import { StarStudentsCard, BestPerformersCard } from "@/components/dashboard/star-performers-card";
import { SchoolEventCalendar } from "@/components/dashboard/school-event-calendar";
import { SchoolEventsTimeline } from "@/components/dashboard/school-events-timeline";
import { DashboardUpcomingEvents } from "@/components/dashboard/dashboard-upcoming-events";
import { PeriodToggle } from "@/components/dashboard/period-toggle";
import { MockActionButton, MOCK_FORMS } from "@/components/shared/mock-action";
import { financeWeekly } from "@/mock/dashboard";
import {
  getInstitutionDashboardStats,
  getRoleDashboardExtras,
  type DashboardStat,
} from "@/mock/dashboard-context";

const ICON_MAP: Record<DashboardStat["icon"], LucideIcon> = {
  users: Users,
  faculty: GraduationCap,
  events: CalendarDays,
  finance: FileText,
  forms: ClipboardPen,
  hostel: Bed,
  transport: Bus,
  attendance: ClipboardCheck,
  applications: Inbox,
};

export default function DashboardPage() {
  const { user, institution, institutionMode, t, roleLabel, demoRoleKey, enabledModules } = useApp();
  const { events, upcomingEvents } = useSchoolEvents();
  const firstName = user.name.split(" ")[0];
  const [financePeriod, setFinancePeriod] = useState<"weekly" | "monthly">("weekly");

  const roleExtras = getRoleDashboardExtras(user.role, institutionMode);
  const baseStats =
    roleExtras.length > 0
      ? roleExtras
      : getInstitutionDashboardStats(
          institutionMode,
          institution.studentCount,
          institution.staffCount,
          Math.max(events.length, upcomingEvents.length),
        );

  const isUniversity = institutionMode === "university";
  const performanceTitle = isUniversity ? "Campus performance" : "School performance";
  const performanceSubtitle = isUniversity
    ? "Students & faculty engagement"
    : "Students & teachers trend";
  const facultySeriesLabel = t("faculty");
  const eventsTitle = isUniversity ? "Campus events" : "School events";
  const calendarTitle = isUniversity ? "Academic calendar" : "School event calendar";
  const financeTitle = isUniversity ? "University finance" : "School finance";

  const primaryAction =
    user.role === "registrar" ? (
      <Button size="sm" className="rounded-xl" asChild>
        <Link href="/forms">Open forms queue</Link>
      </Button>
    ) : (
      <MockActionButton
        label={isUniversity ? "New admission" : "New Admission"}
        title="New admission application"
        description="Create a new admission application (demo)."
        fields={MOCK_FORMS.admission}
        submitLabel="Create application"
        className="rounded-xl"
        icon={<Plus className="size-4" />}
      />
    );

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--foreground)] sm:text-[1.75rem]">
            {institution.shortName} dashboard
          </h1>
          <p className="mt-1 text-sm text-[var(--muted)]">
            {getGreeting(firstName)} · viewing as {roleLabel(user.role, demoRoleKey)} ·{" "}
            <span className="capitalize">{institutionMode}</span> mode
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" size="sm" className="rounded-xl" asChild>
            <Link href="/calendar">View calendar</Link>
          </Button>
          {enabledModules.forms !== false && isUniversity ? (
            <Button variant="outline" size="sm" className="rounded-xl" asChild>
              <Link href="/forms">Digital forms</Link>
            </Button>
          ) : null}
          {primaryAction}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {baseStats.map((stat) => {
          const Icon = ICON_MAP[stat.icon];
          const numeric = Number(String(stat.value).replace(/,/g, ""));
          const displayValue =
            Number.isFinite(numeric) && !String(stat.value).includes("%")
              ? formatNumber(numeric)
              : stat.value;
          return (
            <ColorStatCard
              key={stat.id}
              label={stat.label}
              value={displayValue}
              change={stat.change}
              changeType={stat.changeType}
              icon={Icon}
              tone={stat.tone}
            />
          );
        })}
      </div>

      <SchoolPerformanceChart
        title={performanceTitle}
        subtitle={performanceSubtitle}
        teachersLabel={facultySeriesLabel}
      />

      <div className="grid gap-6 xl:grid-cols-12">
        <SchoolEventsTimeline
          className="xl:col-span-8"
          title={eventsTitle}
          events={events}
          showViewMore
          useShowcase
          variant={isUniversity ? "university" : "school"}
        />
        <div className="xl:col-span-4">
          <DashboardUpcomingEvents />
        </div>
      </div>

      <div className="grid items-start gap-6 xl:grid-cols-12">
        <SchoolEventCalendar className="xl:col-span-6" events={events} title={calendarTitle} />
        <ChartCard
          className="h-fit xl:col-span-6"
          title={financeTitle}
          subtitle="Income & expenses"
          actions={<PeriodToggle value={financePeriod} onChange={setFinancePeriod} />}
        >
          <div className="mb-2 flex gap-6">
            <div>
              <p className="text-xs text-[var(--muted)]">Income</p>
              <p className="text-lg font-bold text-[#1BD0B4]">{formatCurrency(isUniversity ? 12840000 : 469244)}</p>
            </div>
            <div>
              <p className="text-xs text-[var(--muted)]">Expense</p>
              <p className="text-lg font-bold text-[#F4901F]">{formatCurrency(isUniversity ? 4120000 : 33456)}</p>
            </div>
          </div>
          <FinanceLineChart data={financeWeekly} />
        </ChartCard>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <StarStudentsCard />
        <BestPerformersCard />
      </div>
    </div>
  );
}
