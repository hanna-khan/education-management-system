"use client";

import Link from "next/link";
import {
  Award,
  Calendar,
  ClipboardList,
  DoorOpen,
  FileText,
  Plus,
  TrendingUp,
  Users,
} from "lucide-react";
import { ModuleHub, InfoCard, SimpleTable } from "@/components/shared/module-hub";
import { KpiCard } from "@/components/shared/kpi-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MockActionButton, MockToastButton, MOCK_FORMS } from "@/components/shared/mock-action";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  examStats,
  mockExamSchedule,
  mockMarksEntry,
  mockStudentResults,
  EXAMS_TABS,
} from "@/mock/exams";
import { formatNumber } from "@/lib/utils";

const breadcrumbs = [{ label: "Dashboard", href: "/dashboard" }, { label: "Exams & Results" }];

function gradeBadge(grade: string) {
  if (grade === "—") return <Badge variant="outline">{grade}</Badge>;
  const highGrades = ["A", "A-", "A+"];
  return (
    <Badge variant={highGrades.some((g) => grade.startsWith(g)) ? "success" : "default"}>
      {grade}
    </Badge>
  );
}

export function ExamsDashboardPage() {
  return (
    <ModuleHub
      title="Exams & Results"
      description="Manage exam schedules, marks entry, grading, and result publication."
      breadcrumbs={breadcrumbs}
      tabs={EXAMS_TABS}
      actions={
        <MockActionButton
          label="Schedule exam"
          fields={MOCK_FORMS.exam}
          submitLabel="Schedule"
          icon={<Plus className="size-4" />}
        />
      }
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <KpiCard label="Upcoming exams" value={examStats.upcoming} icon={Calendar} />
        <KpiCard label="Completed" value={formatNumber(examStats.completed)} icon={FileText} />
        <KpiCard label="Results pending" value={examStats.resultsPending} icon={ClipboardList} />
        <KpiCard label="Exam rooms" value={examStats.rooms} icon={DoorOpen} />
        <KpiCard label="Invigilators assigned" value={examStats.invigilators} icon={Users} />
        <KpiCard label="Avg. semester GPA" value={mockStudentResults.gpa} icon={TrendingUp} changeType="positive" />
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Upcoming exam schedule</CardTitle>
        </CardHeader>
        <CardContent>
          <SimpleTable
            columns={["Course", "Type", "Date", "Time", "Room", "Invigilator"]}
            rows={mockExamSchedule.slice(0, 3).map((exam) => [
              exam.course,
              exam.type,
              exam.date,
              exam.time,
              exam.room,
              exam.invigilator,
            ])}
          />
        </CardContent>
      </Card>
    </ModuleHub>
  );
}

export function ExamsSchedulesPage() {
  return (
    <ModuleHub
      title="Exam Schedules"
      description="View and manage midterm, final, and supplementary exam timetables."
      breadcrumbs={[...breadcrumbs.slice(0, -1), { label: "Exams", href: "/exams" }, { label: "Schedules" }]}
      tabs={EXAMS_TABS}
      actions={
        <MockToastButton label="Export schedule" message="Exam schedule exported (demo)." />
      }
    >
      <SimpleTable
        columns={["ID", "Course", "Type", "Date", "Time", "Room", "Invigilator"]}
        rows={mockExamSchedule.map((exam) => [
          exam.id,
          exam.course,
          <Badge key={`${exam.id}-type`} variant="info">
            {exam.type}
          </Badge>,
          exam.date,
          exam.time,
          exam.room,
          exam.invigilator,
        ])}
      />
    </ModuleHub>
  );
}

export function ExamsMarksPage() {
  return (
    <ModuleHub
      title="Marks Entry"
      description="Enter and review assignment, midterm, and final marks for enrolled students."
      breadcrumbs={[...breadcrumbs.slice(0, -1), { label: "Exams", href: "/exams" }, { label: "Marks Entry" }]}
      tabs={EXAMS_TABS}
      actions={
        <MockActionButton
          label="Import marks"
          title="Import marks"
          description="Upload marks file (demo)."
          fields={MOCK_FORMS.document}
          submitLabel="Import"
          icon={<Plus className="size-4" />}
        />
      }
    >
      <Card className="mb-6">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">CS-301 Data Structures · Midterm</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-xs text-[var(--muted)]">
            Total marks: 100 · Assignment (20) + Midterm (40) + Final (40)
          </p>
        </CardContent>
      </Card>

      <SimpleTable
        columns={["Student", "ID", "Assignment /20", "Midterm /40", "Final /40", "Total", "Grade"]}
        rows={mockMarksEntry.map((row) => [
          row.student,
          row.id,
          row.assignment,
          row.midterm,
          row.final,
          row.total,
          gradeBadge(row.grade),
        ])}
      />
    </ModuleHub>
  );
}

export function ExamsResultsPage() {
  const { semester, gpa, cgpa, courses } = mockStudentResults;

  return (
    <ModuleHub
      title="Results"
      description="View semester results, GPA summaries, and grade breakdowns."
      breadcrumbs={[...breadcrumbs.slice(0, -1), { label: "Exams", href: "/exams" }, { label: "Results" }]}
      tabs={EXAMS_TABS}
      actions={
        <MockToastButton label="Download transcript" message="Transcript download started (demo)." />
      }
    >
      <div className="grid gap-4 sm:grid-cols-3">
        <InfoCard label="Semester" value={semester} sub="Current academic period" />
        <InfoCard label="Semester GPA" value={gpa} sub="Fall 2025" />
        <InfoCard label="Cumulative GPA" value={cgpa} sub="All semesters" />
      </div>

      <Card className="mt-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Award className="size-5 text-[var(--brand-primary)]" />
              Course results
            </CardTitle>
            <Link href="/students" className="text-xs font-medium text-[var(--brand-primary)] hover:underline">
              View all students
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          <SimpleTable
            columns={["Code", "Course", "Credits", "Marks", "Grade", "Grade points"]}
            rows={courses.map((course) => [
              course.code,
              course.name,
              course.credits,
              `${course.marks}%`,
              gradeBadge(course.grade),
              course.points.toFixed(1),
            ])}
          />
        </CardContent>
      </Card>
    </ModuleHub>
  );
}
