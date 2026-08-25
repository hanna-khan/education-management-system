"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  BarChart3,
  BookOpen,
  ClipboardCheck,
  FileText,
  GraduationCap,
  LineChart,
  Plus,
  Star,
  Target,
  Users,
} from "lucide-react";
import { ModuleHub, InfoCard, SimpleTable } from "@/components/shared/module-hub";
import { KpiCard } from "@/components/shared/kpi-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/shared/empty-state";
import { MockActionButton, MockToastButton } from "@/components/shared/mock-action";
import {
  QUALITY_TABS,
  mockCourseEvaluations,
  mockImprovementPlans,
  mockProgramReviews,
  mockQualityEvidence,
  mockQualityKpis,
  mockQualityReports,
  programPerformance,
  qualityStats,
} from "@/mock/quality";
import { formatNumber } from "@/lib/utils";

const breadcrumbs = [{ label: "Dashboard", href: "/dashboard" }, { label: "Quality Assurance" }];

function statusBadge(status: string) {
  const map: Record<string, "default" | "success" | "warning" | "error" | "info" | "outline"> = {
    on_track: "info",
    at_risk: "warning",
    below_target: "error",
    exceeding: "success",
    scheduled: "info",
    in_progress: "warning",
    completed: "success",
    follow_up: "warning",
    open: "info",
    closed: "outline",
    published: "success",
    draft: "outline",
    submitted: "info",
    overdue: "error",
    document: "default",
    survey: "info",
    report: "success",
    meeting_minutes: "outline",
    data_export: "warning",
    annual: "info",
    semester: "default",
    hec: "success",
    internal: "outline",
  };
  return (
    <Badge variant={map[status] ?? "outline"} className="capitalize">
      {status.replace(/_/g, " ")}
    </Badge>
  );
}

export function QualityDashboardPage() {
  return (
    <ModuleHub
      title="Quality Enhancement Cell"
      description="NED University QEC — program reviews, course evaluations, KPIs, and HEC compliance."
      breadcrumbs={breadcrumbs}
      tabs={QUALITY_TABS}
      actions={
        <MockActionButton
          label="New improvement plan"
          fields={[
            { name: "title", label: "Plan title", required: true },
            { name: "department", label: "Department", type: "select", options: ["QEC", "All Departments", "Electrical Engineering", "Civil Engineering"], required: true },
            { name: "kpi", label: "Linked KPI", type: "select", options: mockQualityKpis.map((k) => k.code), required: true },
          ]}
          submitLabel="Create plan"
          icon={<Plus className="size-4" />}
        />
      }
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Overall QA Score" value={`${qualityStats.overallScore}%`} icon={Target} changeType="positive" />
        <KpiCard label="Student satisfaction" value={`${qualityStats.studentSatisfaction}/5`} icon={Star} changeType="positive" />
        <KpiCard label="Attendance compliance" value={`${qualityStats.attendanceCompliance}%`} icon={ClipboardCheck} changeType="negative" />
        <KpiCard label="Graduation rate" value={`${qualityStats.graduationRate}%`} icon={GraduationCap} />
      </div>
      <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Program reviews due" value={qualityStats.programReviewsDue} icon={BookOpen} changeType="negative" />
        <KpiCard label="Open course evaluations" value={qualityStats.courseEvaluationsOpen} icon={Users} />
        <KpiCard label="Faculty feedback" value={`${qualityStats.facultyFeedbackScore}/5`} icon={LineChart} />
        <KpiCard label="Active improvement plans" value={qualityStats.improvementPlansActive} icon={BarChart3} />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Program performance</CardTitle>
            <Button asChild variant="outline" size="sm">
              <Link href="/quality/program-reviews">Program reviews</Link>
            </Button>
          </CardHeader>
          <CardContent>
            <SimpleTable
              columns={["Program", "Enrollment", "Satisfaction", "Graduation %", "Employment %"]}
              rows={programPerformance.map((p) => [
                p.program,
                formatNumber(p.enrollment),
                `${p.satisfaction}/5`,
                `${p.graduation}%`,
                `${p.employment}%`,
              ])}
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Surveys link</CardTitle></CardHeader>
          <CardContent className="space-y-3 text-sm">
            <p className="text-[var(--muted)]">Course evaluations and satisfaction surveys are managed in the Survey Builder module.</p>
            <Button asChild variant="outline" size="sm" className="w-full">
              <Link href="/surveys">Open Survey Builder</Link>
            </Button>
            <div className="rounded-lg border border-[var(--border-subtle)] p-3">
              <p className="font-medium">Spring 2026 — Course Evaluation</p>
              <p className="text-[var(--muted)]">42 courses open · 68% avg response</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>At-risk KPIs</CardTitle>
            <Button asChild size="sm" variant="outline"><Link href="/quality/kpis">All KPIs</Link></Button>
          </CardHeader>
          <CardContent>
            <SimpleTable
              columns={["KPI", "Target", "Current", "Status"]}
              rows={mockQualityKpis.filter((k) => k.status === "at_risk" || k.status === "below_target").map((k) => [
                k.code,
                `${k.target}${k.unit}`,
                `${k.current}${k.unit}`,
                statusBadge(k.status),
              ])}
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Faculty feedback highlights</CardTitle></CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="rounded-lg border border-[var(--border-subtle)] p-3">
              <p className="font-medium">Lab equipment adequacy</p>
              <p className="text-[var(--muted)]">EE Dept — 3.8/5 · Improvement plan IP-2025-018 in progress</p>
            </div>
            <div className="rounded-lg border border-[var(--border-subtle)] p-3">
              <p className="font-medium">Research support</p>
              <p className="text-[var(--muted)]">R&D — 3.5/5 · Faculty development workshops planned</p>
            </div>
            <div className="rounded-lg border border-[var(--border-subtle)] p-3">
              <p className="font-medium">Teaching load balance</p>
              <p className="text-[var(--muted)]">CIS — 4.1/5 · Within acceptable range</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Recent course evaluations</CardTitle>
          <Button asChild size="sm" variant="outline"><Link href="/quality/course-evaluations">View all</Link></Button>
        </CardHeader>
        <CardContent>
          <SimpleTable
            columns={["Course", "Instructor", "Dept", "Response", "Rating", "Status"]}
            rows={mockCourseEvaluations.slice(0, 5).map((c) => [
              `${c.courseCode} — ${c.courseName}`,
              c.instructor,
              c.department,
              `${c.responseRate}%`,
              `${c.avgRating}/5`,
              statusBadge(c.status),
            ])}
          />
        </CardContent>
      </Card>
      <Card className="mt-6">
        <CardHeader><CardTitle>Academic performance overview</CardTitle></CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 text-sm">
            <div className="rounded-lg border border-[var(--border-subtle)] p-4">
              <p className="text-[var(--muted)]">Avg GPA (institution)</p>
              <p className="mt-1 text-2xl font-semibold">3.24</p>
            </div>
            <div className="rounded-lg border border-[var(--border-subtle)] p-4">
              <p className="text-[var(--muted)]">Dean&apos;s list students</p>
              <p className="mt-1 text-2xl font-semibold">186</p>
            </div>
            <div className="rounded-lg border border-[var(--border-subtle)] p-4">
              <p className="text-[var(--muted)]">Probation count</p>
              <p className="mt-1 text-2xl font-semibold">42</p>
            </div>
            <div className="rounded-lg border border-[var(--border-subtle)] p-4">
              <p className="text-[var(--muted)]">Research publications (2025)</p>
              <p className="mt-1 text-2xl font-semibold">248</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </ModuleHub>
  );
}

export function QualityKpisPage() {
  const [filter, setFilter] = useState("all");
  const filtered = useMemo(() => {
    if (filter === "all") return mockQualityKpis;
    return mockQualityKpis.filter((k) => k.status === filter);
  }, [filter]);

  return (
    <ModuleHub title="Quality KPIs" description="Key performance indicators tracked by QEC." breadcrumbs={[...breadcrumbs, { label: "KPIs" }]} tabs={QUALITY_TABS}
      actions={<MockToastButton label="Export KPI report" message="KPI report exported (demo)." icon={<FileText className="size-4" />} />}>
      <div className="mb-4 flex flex-wrap gap-2">
        {["all", "exceeding", "on_track", "at_risk", "below_target"].map((s) => (
          <Button key={s} size="sm" variant={filter === s ? "default" : "outline"} onClick={() => setFilter(s)} className="capitalize">
            {s.replace(/_/g, " ")}
          </Button>
        ))}
      </div>
      {filtered.length === 0 ? (
        <EmptyState icon={Target} title="No KPIs" description="No KPIs match the selected filter." />
      ) : (
        <SimpleTable
          columns={["Code", "Name", "Category", "Department", "Target", "Current", "Status", "Updated"]}
          rows={filtered.map((k) => [k.code, k.name, k.category, k.department, `${k.target}${k.unit}`, `${k.current}${k.unit}`, statusBadge(k.status), k.lastUpdated])}
        />
      )}
    </ModuleHub>
  );
}

export function QualityProgramReviewsPage() {
  return (
    <ModuleHub title="Program Reviews" description="Periodic program review cycles." breadcrumbs={[...breadcrumbs, { label: "Program Reviews" }]} tabs={QUALITY_TABS}
      actions={
        <MockActionButton label="Schedule review" fields={[
          { name: "program", label: "Program", type: "select", options: programPerformance.map((p) => p.program), required: true },
          { name: "reviewer", label: "Lead reviewer", required: true },
          { name: "date", label: "Scheduled date", type: "date", required: true },
        ]} submitLabel="Schedule" />
      }>
      <SimpleTable
        columns={["Review ID", "Program", "Department", "Cycle", "Lead", "Date", "Score", "Status", ""]}
        rows={mockProgramReviews.map((r) => [
          r.reviewId,
          r.program,
          r.department,
          r.cycle,
          r.leadReviewer,
          r.scheduledDate,
          r.score ? `${r.score}%` : "—",
          statusBadge(r.status),
          <MockActionButton key={r.id} label="Update" size="sm" variant="outline" fields={[{ name: "status", label: "Status", type: "select", options: ["scheduled", "in_progress", "completed", "follow_up"], required: true }]} submitLabel="Save" successMessage="Review updated (demo)." />,
        ])}
      />
    </ModuleHub>
  );
}

export function QualityCourseEvaluationsPage() {
  return (
    <ModuleHub title="Course Evaluations" description="Semester course evaluation summaries." breadcrumbs={[...breadcrumbs, { label: "Course Evaluations" }]} tabs={QUALITY_TABS}
      actions={<Button asChild size="sm"><Link href="/surveys/create">Create evaluation survey</Link></Button>}>
      <div className="mb-4 grid gap-4 sm:grid-cols-3">
        <InfoCard label="Open evaluations" value={String(mockCourseEvaluations.filter((c) => c.status === "open").length)} />
        <InfoCard label="Avg response rate" value={`${Math.round(mockCourseEvaluations.reduce((s, c) => s + c.responseRate, 0) / mockCourseEvaluations.length)}%`} />
        <InfoCard label="Avg rating" value={`${(mockCourseEvaluations.reduce((s, c) => s + c.avgRating, 0) / mockCourseEvaluations.length).toFixed(1)}/5`} />
      </div>
      <SimpleTable
        columns={["Course", "Instructor", "Department", "Semester", "Response", "Rating", "Status"]}
        rows={mockCourseEvaluations.map((c) => [
          `${c.courseCode} — ${c.courseName}`,
          c.instructor,
          c.department,
          c.semester,
          `${c.responseRate}%`,
          `${c.avgRating}/5`,
          statusBadge(c.status),
        ])}
      />
    </ModuleHub>
  );
}

export function QualityImprovementPlansPage() {
  return (
    <ModuleHub title="Improvement Plans" description="Corrective and enhancement action plans." breadcrumbs={[...breadcrumbs, { label: "Improvement Plans" }]} tabs={QUALITY_TABS}
      actions={
        <MockActionButton label="New plan" fields={[
          { name: "title", label: "Title", required: true },
          { name: "owner", label: "Owner", required: true },
          { name: "dueDate", label: "Due date", type: "date", required: true },
        ]} submitLabel="Create" icon={<Plus className="size-4" />} />
      }>
      <SimpleTable
        columns={["Plan ID", "Title", "Department", "Owner", "Linked KPI", "Due", "Progress", "Status"]}
        rows={mockImprovementPlans.map((p) => [
          p.planId,
          p.title,
          p.department,
          p.owner,
          p.linkedKpi,
          p.dueDate,
          `${p.progress}%`,
          statusBadge(p.status),
        ])}
      />
    </ModuleHub>
  );
}

export function QualityEvidencePage() {
  return (
    <ModuleHub title="Evidence Repository" description="QA evidence documents and artifacts." breadcrumbs={[...breadcrumbs, { label: "Evidence" }]} tabs={QUALITY_TABS}
      actions={
        <MockActionButton label="Upload evidence" fields={[
          { name: "title", label: "Title", required: true },
          { name: "type", label: "Type", type: "select", options: ["document", "survey", "report", "meeting_minutes", "data_export"], required: true },
          { name: "linkedTo", label: "Linked to", required: true },
        ]} submitLabel="Upload" successMessage="Evidence uploaded (demo)." />
      }>
      <SimpleTable
        columns={["Evidence ID", "Title", "Type", "Module", "Linked To", "Uploaded By", "Date"]}
        rows={mockQualityEvidence.map((e) => [e.evidenceId, e.title, statusBadge(e.type), e.module, e.linkedTo, e.uploadedBy, e.uploadedAt])}
      />
    </ModuleHub>
  );
}

export function QualityReportsPage() {
  return (
    <ModuleHub title="QA Reports" description="Annual, semester, and HEC reports." breadcrumbs={[...breadcrumbs, { label: "Reports" }]} tabs={QUALITY_TABS}
      actions={<MockToastButton label="Generate report" message="Report generation started (demo)." icon={<FileText className="size-4" />} />}>
      <SimpleTable
        columns={["Report ID", "Title", "Type", "Period", "Generated", "Status", ""]}
        rows={mockQualityReports.map((r) => [
          r.reportId,
          r.title,
          statusBadge(r.type),
          r.period,
          r.generatedAt,
          statusBadge(r.status),
          <MockToastButton key={r.id} label="Download" message={`${r.reportId} downloaded (demo).`} size="sm" variant="outline" />,
        ])}
      />
    </ModuleHub>
  );
}
