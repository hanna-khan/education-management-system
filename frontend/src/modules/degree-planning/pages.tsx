"use client";

import Link from "next/link";
import {
  AlertTriangle,
  BookOpen,
  CheckCircle2,
  GraduationCap,
  Route,
  Target,
} from "lucide-react";
import { ModuleHub, InfoCard, SimpleTable } from "@/components/shared/module-hub";
import { KpiCard } from "@/components/shared/kpi-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MockActionButton, MockToastButton } from "@/components/shared/mock-action";
import {
  DEGREE_TABS,
  creditBreakdown,
  degreeStats,
  mockDegreeProgress,
  mockPlannerCourses,
  mockRequirements,
} from "@/mock/degree-planning";

const breadcrumbs = [{ label: "Dashboard", href: "/dashboard" }, { label: "Degree Planning" }];

function statusBadge(status: string) {
  const map: Record<string, "default" | "success" | "warning" | "error" | "info" | "outline"> = {
    completed: "success",
    in_progress: "info",
    failed: "error",
    remaining: "outline",
    waived: "warning",
  };
  return (
    <Badge variant={map[status] ?? "outline"} className="capitalize">
      {status.replace(/_/g, " ")}
    </Badge>
  );
}

export function DegreePlanningDashboardPage() {
  const p = mockDegreeProgress;
  const completed = mockRequirements.filter((r) => r.status === "completed");
  const failed = mockRequirements.filter((r) => r.status === "failed");
  const inProgress = mockRequirements.filter((r) => r.status === "in_progress");
  const remaining = mockRequirements.filter((r) => r.status === "remaining");

  return (
    <ModuleHub
      title="Degree Planning"
      description="Track degree progress, requirements, and semester plans (university)."
      breadcrumbs={breadcrumbs}
      tabs={DEGREE_TABS}
      actions={
        <Button asChild size="sm" variant="outline">
          <Link href="/degree-planning/planner">Open planner</Link>
        </Button>
      }
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          label="Credits earned"
          value={`${p.creditsEarned}/${p.creditsRequired}`}
          change={`${p.percentComplete}% complete`}
          changeType="positive"
          icon={Target}
        />
        <KpiCard label="GPA / CGPA" value={`${p.gpa} / ${p.cgpa}`} icon={GraduationCap} />
        <KpiCard label="Students on track" value={degreeStats.studentsOnTrack} icon={CheckCircle2} changeType="positive" />
        <KpiCard label="Students behind" value={degreeStats.studentsBehind} icon={AlertTriangle} changeType="negative" />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>
              {p.studentName} · {p.program}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-4xl font-semibold tracking-tight">{p.percentComplete}%</p>
                <p className="mt-1 text-sm text-[var(--muted)]">
                  Batch {p.batch} · Expected {p.expectedGraduation}
                </p>
              </div>
              <Badge variant={p.standing === "good" ? "success" : "warning"} className="capitalize">
                {p.standing} standing
              </Badge>
            </div>
            <div className="mt-4 h-3 overflow-hidden rounded-full bg-[var(--surface-muted)]">
              <div
                className="h-full rounded-full bg-[var(--brand-primary)]"
                style={{ width: `${p.percentComplete}%` }}
              />
            </div>
            <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <InfoCard label="Completed" value={completed.length} />
              <InfoCard label="In progress" value={inProgress.length} />
              <InfoCard label="Failed" value={failed.length} />
              <InfoCard label="Remaining" value={remaining.length} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Credit categories</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {creditBreakdown.map((c) => {
              const pct = Math.min(100, Math.round((c.earned / c.required) * 100));
              return (
                <div key={c.label}>
                  <div className="flex justify-between text-sm">
                    <span className="text-[var(--muted)]">{c.label}</span>
                    <span className="font-medium">
                      {c.earned}/{c.required}
                    </span>
                  </div>
                  <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-[var(--surface-muted)]">
                    <div className="h-full rounded-full bg-[var(--brand-primary)]" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Requirements</CardTitle>
        </CardHeader>
        <CardContent>
          <SimpleTable
            columns={["Code", "Title", "Type", "Credits", "Prerequisites", "Grade", "Status"]}
            rows={mockRequirements.map((r) => [
              r.code,
              r.title,
              r.type,
              String(r.credits),
              r.prerequisites.length ? r.prerequisites.join(", ") : "—",
              r.grade ?? "—",
              statusBadge(r.status),
            ])}
          />
        </CardContent>
      </Card>
    </ModuleHub>
  );
}

export function DegreePlannerPage() {
  const warnings = mockPlannerCourses.filter((c) => !c.prereqMet && c.recommended);

  return (
    <ModuleHub
      title="Semester Planner"
      description="Recommended and eligible courses for next term with prerequisite checks."
      breadcrumbs={[...breadcrumbs, { label: "Planner" }]}
      tabs={DEGREE_TABS}
      actions={
        <MockToastButton label="Save plan" message="Semester plan saved (demo)." icon={<Route className="size-4" />} />
      }
    >
      {warnings.length > 0 ? (
        <Card className="mb-6 border-[var(--warning)]/40 bg-[var(--surface)]">
          <CardContent className="flex items-start gap-3 p-4 text-sm">
            <AlertTriangle className="mt-0.5 size-5 shrink-0 text-[var(--warning)]" />
            <div>
              <p className="font-medium">Prerequisite warnings</p>
              <ul className="mt-1 list-inside list-disc text-[var(--muted)]">
                {warnings.map((w) => (
                  <li key={w.id}>
                    {w.code} requires {w.prereqMissing.join(", ")} before enrollment.
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4 mb-6">
        <InfoCard label="Eligible" value={mockPlannerCourses.filter((c) => c.eligible).length} />
        <InfoCard label="Recommended" value={mockPlannerCourses.filter((c) => c.recommended).length} />
        <InfoCard label="Prereq blocked" value={mockPlannerCourses.filter((c) => !c.prereqMet).length} />
        <InfoCard label="Not offered" value={mockPlannerCourses.filter((c) => !c.offered).length} />
      </div>

      <SimpleTable
        columns={["Code", "Title", "Credits", "Type", "Eligible", "Recommended", "Prereqs", "Seats", ""]}
        rows={mockPlannerCourses.map((c) => [
          c.code,
          c.title,
          String(c.credits),
          c.type,
          c.eligible ? <Badge variant="success">Yes</Badge> : <Badge variant="outline">No</Badge>,
          c.recommended ? <Badge variant="info">Yes</Badge> : "—",
          c.prereqMet ? (
            <Badge variant="success">Met</Badge>
          ) : (
            <Badge variant="error">Missing: {c.prereqMissing.join(", ")}</Badge>
          ),
          c.offered ? String(c.seatsLeft) : "Not offered",
          <MockActionButton
            key={c.id}
            label="Add"
            title={`Add ${c.code}`}
            confirmOnly
            description={
              c.prereqMet
                ? `Add ${c.code} to Fall 2026 plan?`
                : `Warning: prerequisites ${c.prereqMissing.join(", ")} not met. Add anyway?`
            }
            submitLabel="Add to plan"
            size="sm"
            variant="outline"
          />,
        ])}
      />
    </ModuleHub>
  );
}

export function StudentDegreePlanningPage() {
  const p = mockDegreeProgress;
  return (
    <ModuleHub
      title="My Degree Progress"
      description={`${p.program} · ${p.creditsEarned}/${p.creditsRequired} credits`}
      breadcrumbs={[{ label: "Student", href: "/student/dashboard" }, { label: "Degree Planning" }]}
      actions={
        <Button asChild size="sm" variant="outline">
          <Link href="/degree-planning/planner">Plan next semester</Link>
        </Button>
      }
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Complete" value={`${p.percentComplete}%`} icon={Target} changeType="positive" />
        <KpiCard label="Credits" value={`${p.creditsEarned}/${p.creditsRequired}`} icon={BookOpen} />
        <KpiCard label="CGPA" value={p.cgpa} icon={GraduationCap} />
        <KpiCard label="Expected" value={p.expectedGraduation} icon={Route} />
      </div>
      <Card className="mt-6">
        <CardHeader><CardTitle>Course status</CardTitle></CardHeader>
        <CardContent>
          <SimpleTable
            columns={["Code", "Title", "Status", "Grade"]}
            rows={mockRequirements.map((r) => [r.code, r.title, statusBadge(r.status), r.grade ?? "—"])}
          />
        </CardContent>
      </Card>
    </ModuleHub>
  );
}
