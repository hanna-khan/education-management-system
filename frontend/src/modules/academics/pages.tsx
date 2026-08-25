"use client";

import { ModuleHub, InfoCard, SimpleTable } from "@/components/shared/module-hub";
import { KpiCard } from "@/components/shared/kpi-card";
import { Badge } from "@/components/ui/badge";
import { MockActionButton, MOCK_FORMS } from "@/components/shared/mock-action";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  mockDepartments,
  mockPrograms,
  mockCourses,
  mockSections,
  timetableSlots,
  ACADEMICS_TABS,
} from "@/mock/academics";
import { formatNumber } from "@/lib/utils";
import {
  Building2,
  GraduationCap,
  Users,
  UserCheck,
  BookOpen,
  LayoutGrid,
  Plus,
  Clock,
  MapPin,
} from "lucide-react";

const breadcrumbs = [{ label: "Dashboard", href: "/dashboard" }, { label: "Academics" }];

const totalStudents = mockDepartments.reduce((sum, d) => sum + d.students, 0);
const totalFaculty = mockDepartments.reduce((sum, d) => sum + d.faculty, 0);
const totalPrograms = mockPrograms.length;
const totalDepartments = mockDepartments.length;

function programTypeBadge(type: string) {
  const map: Record<string, "default" | "success" | "info" | "outline"> = {
    undergraduate: "info",
    graduate: "success",
  };
  return (
    <Badge variant={map[type] ?? "outline"} className="capitalize">
      {type}
    </Badge>
  );
}

const TIMETABLE_DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"] as const;

function slotsByDay(day: string) {
  return timetableSlots
    .filter((slot) => slot.day === day)
    .sort((a, b) => a.time.localeCompare(b.time));
}

export function AcademicsOverviewPage() {
  return (
    <ModuleHub
      title="Academics"
      description="Manage departments, programs, courses, sections, and timetables."
      breadcrumbs={breadcrumbs}
      tabs={ACADEMICS_TABS}
      actions={
        <MockActionButton
          label="Add course"
          title="Add course"
          description="Create a new course in the academic catalog (demo)."
          fields={MOCK_FORMS.course}
          submitLabel="Create course"
          icon={<Plus className="size-4" />}
        />
      }
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <KpiCard label="Departments" value={totalDepartments} icon={Building2} />
        <KpiCard label="Programs" value={totalPrograms} icon={GraduationCap} />
        <KpiCard
          label="Enrolled students"
          value={formatNumber(totalStudents)}
          icon={Users}
        />
        <KpiCard label="Faculty members" value={totalFaculty} icon={UserCheck} />
        <KpiCard label="Active courses" value={mockCourses.length} icon={BookOpen} />
        <KpiCard label="Sections" value={mockSections.length} icon={LayoutGrid} />
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <InfoCard label="Undergraduate programs" value={mockPrograms.filter((p) => p.type === "undergraduate").length} sub="Across all departments" />
        <InfoCard label="Graduate programs" value={mockPrograms.filter((p) => p.type === "graduate").length} sub="MBA and advanced degrees" />
        <InfoCard label="Timetable slots" value={timetableSlots.length} sub="This week" />
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Department summary</CardTitle>
        </CardHeader>
        <CardContent>
          <SimpleTable
            columns={["Department", "Code", "Programs", "Faculty", "Students", "HOD"]}
            rows={mockDepartments.map((d) => [
              d.name,
              d.code,
              d.programs,
              d.faculty,
              formatNumber(d.students),
              d.hod,
            ])}
          />
        </CardContent>
      </Card>
    </ModuleHub>
  );
}

export function AcademicsDepartmentsPage() {
  return (
    <ModuleHub
      title="Departments"
      description="Academic departments, faculty strength, and head of department assignments."
      breadcrumbs={[
        ...breadcrumbs.slice(0, -1),
        { label: "Academics", href: "/academics" },
        { label: "Departments" },
      ]}
      tabs={ACADEMICS_TABS}
      actions={
        <MockActionButton
          label="Add department"
          title="Add department"
          description="Create a new academic department (demo)."
          fields={MOCK_FORMS.department}
          submitLabel="Create department"
          icon={<Plus className="size-4" />}
        />
      }
    >
      <SimpleTable
        columns={["Code", "Department", "Programs", "Faculty", "Students", "Head of Department"]}
        rows={mockDepartments.map((d) => [
          <span key={d.id} className="font-mono text-xs font-medium text-[var(--muted)]">
            {d.code}
          </span>,
          d.name,
          d.programs,
          d.faculty,
          formatNumber(d.students),
          d.hod,
        ])}
      />
    </ModuleHub>
  );
}

export function AcademicsProgramsPage() {
  return (
    <ModuleHub
      title="Programs"
      description="Degree programs offered across all academic departments."
      breadcrumbs={[
        ...breadcrumbs.slice(0, -1),
        { label: "Academics", href: "/academics" },
        { label: "Programs" },
      ]}
      tabs={ACADEMICS_TABS}
      actions={
        <MockActionButton
          label="Add program"
          title="Add program"
          description="Create a new degree program (demo)."
          fields={MOCK_FORMS.program}
          submitLabel="Create program"
          icon={<Plus className="size-4" />}
        />
      }
    >
      <SimpleTable
        columns={["Program", "Department", "Type", "Duration", "Credits", "Students"]}
        rows={mockPrograms.map((p) => [
          p.name,
          p.department,
          programTypeBadge(p.type),
          p.duration,
          p.credits,
          formatNumber(p.students),
        ])}
      />
    </ModuleHub>
  );
}

export function AcademicsCoursesPage() {
  return (
    <ModuleHub
      title="Courses"
      description="Course catalog with instructors, credits, and enrollment."
      breadcrumbs={[
        ...breadcrumbs.slice(0, -1),
        { label: "Academics", href: "/academics" },
        { label: "Courses" },
      ]}
      tabs={ACADEMICS_TABS}
      actions={
        <MockActionButton
          label="Add course"
          title="Add course"
          description="Create a new course in the academic catalog (demo)."
          fields={MOCK_FORMS.course}
          submitLabel="Create course"
          icon={<Plus className="size-4" />}
        />
      }
    >
      <SimpleTable
        columns={["Code", "Course", "Department", "Credits", "Instructor", "Section", "Students"]}
        rows={mockCourses.map((c) => [
          <span key={c.id} className="font-mono text-xs font-medium">
            {c.code}
          </span>,
          c.name,
          c.department,
          c.credits,
          c.instructor,
          c.section,
          c.students,
        ])}
      />
    </ModuleHub>
  );
}

export function AcademicsSectionsPage() {
  return (
    <ModuleHub
      title="Sections"
      description="Class sections with assigned teachers, rooms, and schedules."
      breadcrumbs={[
        ...breadcrumbs.slice(0, -1),
        { label: "Academics", href: "/academics" },
        { label: "Sections" },
      ]}
      tabs={ACADEMICS_TABS}
      actions={
        <MockActionButton
          label="Add section"
          title="Add section"
          description="Create a new class section (demo)."
          fields={MOCK_FORMS.section}
          submitLabel="Create section"
          icon={<Plus className="size-4" />}
        />
      }
    >
      <SimpleTable
        columns={["Course", "Section", "Teacher", "Room", "Schedule", "Students"]}
        rows={mockSections.map((s) => [
          s.course,
          s.section,
          s.teacher,
          s.room,
          s.schedule,
          s.students,
        ])}
      />
    </ModuleHub>
  );
}

export function AcademicsTimetablePage() {
  return (
    <ModuleHub
      title="Timetable"
      description="Weekly class schedule across all departments and sections."
      breadcrumbs={[
        ...breadcrumbs.slice(0, -1),
        { label: "Academics", href: "/academics" },
        { label: "Timetable" },
      ]}
      tabs={ACADEMICS_TABS}
    >
      <div className="grid gap-4 lg:grid-cols-5">
        {TIMETABLE_DAYS.map((day) => {
          const slots = slotsByDay(day);
          return (
            <div key={day} className="space-y-3">
              <div className="flex items-center justify-between border-b border-[var(--border)] pb-2">
                <h3 className="text-sm font-semibold text-[var(--foreground)]">{day}</h3>
                <Badge variant="outline" className="text-xs">
                  {slots.length} {slots.length === 1 ? "class" : "classes"}
                </Badge>
              </div>
              {slots.length === 0 ? (
                <div className="rounded-lg border border-dashed border-[var(--border-subtle)] bg-[var(--surface-muted)] px-3 py-6 text-center text-xs text-[var(--muted)]">
                  No classes scheduled
                </div>
              ) : (
                slots.map((slot, i) => (
                  <Card
                    key={`${day}-${slot.time}-${i}`}
                    className="border-[var(--border-subtle)] shadow-[var(--shadow-xs)] transition-shadow hover:shadow-[var(--shadow-sm)]"
                  >
                    <CardContent className="space-y-2 p-3">
                      <div className="flex items-center justify-between gap-2">
                        <span className="flex items-center gap-1 text-xs font-medium text-[var(--brand-primary)]">
                          <Clock className="size-3" />
                          {slot.time}
                        </span>
                        <Badge variant="outline" className="text-[10px]">
                          Sec {slot.section}
                        </Badge>
                      </div>
                      <p className="text-sm font-medium leading-snug text-[var(--foreground)]">
                        {slot.course}
                      </p>
                      <p className="text-xs text-[var(--muted)]">{slot.teacher}</p>
                      <p className="flex items-center gap-1 text-xs text-[var(--muted-foreground)]">
                        <MapPin className="size-3 shrink-0" />
                        {slot.room}
                      </p>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          );
        })}
      </div>
    </ModuleHub>
  );
}
