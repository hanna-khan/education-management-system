"use client";

import Link from "next/link";
import {
  AlertCircle,
  CheckCircle2,
  ClipboardList,
  Clock,
  FileWarning,
  Plus,
  Upload,
} from "lucide-react";
import { ModuleHub, InfoCard, SimpleTable } from "@/components/shared/module-hub";
import { KpiCard } from "@/components/shared/kpi-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MockActionButton, MockToastButton } from "@/components/shared/mock-action";
import { useApp } from "@/hooks/use-app";
import {
  ASSIGNMENTS_TABS,
  assignmentStats,
  getAssignment,
  getSubmission,
  getSubmissionsFor,
  mockAssignments,
  mockSubmissions,
} from "@/mock/assignments";

function useModuleLabel() {
  const { t } = useApp();
  return t("homework_plural");
}

function statusBadge(status: string) {
  const map: Record<string, "default" | "success" | "warning" | "error" | "info" | "outline"> = {
    draft: "outline",
    published: "success",
    closed: "outline",
    grading: "warning",
    submitted: "info",
    graded: "success",
    late: "warning",
    missing: "error",
    returned: "warning",
    not_submitted: "outline",
  };
  return (
    <Badge variant={map[status] ?? "outline"} className="capitalize">
      {status.replace(/_/g, " ")}
    </Badge>
  );
}

export function AssignmentsDashboardPage() {
  const label = useModuleLabel();
  const breadcrumbs = [{ label: "Dashboard", href: "/dashboard" }, { label }];

  return (
    <ModuleHub
      title={label}
      description={
        label === "Homework"
          ? "Create, collect, and grade homework across classes."
          : "Create, collect, and grade university assignments across sections."
      }
      breadcrumbs={breadcrumbs}
      tabs={ASSIGNMENTS_TABS.map((t) => ({ ...t, label: t.id === "dashboard" ? "Dashboard" : t.label }))}
      actions={
        <Button asChild size="sm">
          <Link href="/assignments/create">
            <Plus className="size-4" />
            Create {label === "Homework" ? "homework" : "assignment"}
          </Link>
        </Button>
      }
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <KpiCard label={`Total ${label.toLowerCase()}`} value={assignmentStats.total} icon={ClipboardList} />
        <KpiCard label="Published" value={assignmentStats.published} icon={CheckCircle2} changeType="positive" />
        <KpiCard label="Due this week" value={assignmentStats.dueThisWeek} icon={Clock} />
        <KpiCard label="Pending grading" value={assignmentStats.pendingGrading} icon={FileWarning} changeType="negative" />
        <KpiCard label="Avg completion" value={`${assignmentStats.avgCompletion}%`} icon={CheckCircle2} />
        <KpiCard label="Late rate" value={`${assignmentStats.lateRate}%`} icon={AlertCircle} changeType="negative" />
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Recent {label.toLowerCase()}</CardTitle>
        </CardHeader>
        <CardContent>
          <SimpleTable
            columns={["Title", "Course", "Due", "Submitted", "Missing", "Late", "Status"]}
            rows={mockAssignments.map((a) => [
              <Link key={a.id} href={`/assignments/${a.id}`} className="font-medium hover:underline">
                {a.title}
              </Link>,
              `${a.courseCode} · ${a.section}`,
              a.dueAt.slice(0, 10),
              String(a.submissionsCount),
              String(a.missingCount),
              String(a.lateCount),
              statusBadge(a.status),
            ])}
          />
        </CardContent>
      </Card>
    </ModuleHub>
  );
}

export function AssignmentsCreatePage() {
  const label = useModuleLabel();
  return (
    <ModuleHub
      title={`Create ${label === "Homework" ? "homework" : "assignment"}`}
      description="Draft and publish work for a section (demo form)."
      breadcrumbs={[
        { label: "Dashboard", href: "/dashboard" },
        { label, href: "/assignments" },
        { label: "Create" },
      ]}
      tabs={ASSIGNMENTS_TABS}
    >
      <Card>
        <CardContent className="space-y-4 p-6">
          <MockActionButton
            label="Open create form"
            title={`New ${label === "Homework" ? "homework" : "assignment"}`}
            fields={[
              { name: "title", label: "Title", required: true },
              { name: "course", label: "Course", type: "select", options: ["CS-301", "CS-302", "EE-201", "ME-301", "MT-101"], required: true },
              { name: "section", label: "Section", defaultValue: "A", required: true },
              { name: "due", label: "Due date", type: "date", required: true },
              { name: "max", label: "Max score", type: "number", defaultValue: "100" },
              { name: "late", label: "Allow late", type: "select", options: ["Yes", "No"], defaultValue: "Yes" },
              { name: "penalty", label: "Late penalty %", type: "number", defaultValue: "10" },
              { name: "description", label: "Instructions", type: "textarea", required: true },
            ]}
            submitLabel="Publish"
            icon={<Plus className="size-4" />}
          />
          <p className="text-sm text-[var(--muted)]">
            Published items appear on the student portal immediately. Late submissions apply the configured penalty.
          </p>
        </CardContent>
      </Card>
    </ModuleHub>
  );
}

export function AssignmentDetailPage({ id }: { id: string }) {
  const label = useModuleLabel();
  const item = getAssignment(id) ?? mockAssignments[0];
  const subs = getSubmissionsFor(item.id);

  return (
    <ModuleHub
      title={item.title}
      description={`${item.courseCode} · ${item.courseTitle} · Sec ${item.section}`}
      breadcrumbs={[
        { label: "Dashboard", href: "/dashboard" },
        { label, href: "/assignments" },
        { label: item.title },
      ]}
      tabs={ASSIGNMENTS_TABS}
      actions={
        <Button asChild size="sm" variant="outline">
          <Link href={`/assignments/${item.id}/submissions`}>View submissions</Link>
        </Button>
      }
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <InfoCard label="Due" value={item.dueAt.slice(0, 10)} />
        <InfoCard label="Max score" value={item.maxScore} />
        <InfoCard label="Submitted" value={`${item.submissionsCount}`} sub={`${item.missingCount} missing`} />
        <InfoCard label="Status" value={item.status.replace(/_/g, " ")} />
      </div>
      <Card className="mt-6">
        <CardHeader><CardTitle>Instructions</CardTitle></CardHeader>
        <CardContent className="text-sm text-[var(--muted)]">{item.description}</CardContent>
      </Card>
      <Card className="mt-6">
        <CardHeader><CardTitle>Submission snapshot</CardTitle></CardHeader>
        <CardContent>
          <SimpleTable
            columns={["Student", "Roll no", "Status", "Score", "Submitted"]}
            rows={subs.map((s) => [
              s.studentName,
              s.rollNo,
              statusBadge(s.status),
              s.score != null ? `${s.score}/${s.maxScore}` : "—",
              s.submittedAt?.slice(0, 16).replace("T", " ") ?? "—",
            ])}
          />
        </CardContent>
      </Card>
    </ModuleHub>
  );
}

export function AssignmentSubmissionsPage({ id }: { id: string }) {
  const label = useModuleLabel();
  const item = getAssignment(id) ?? mockAssignments[0];
  const subs = getSubmissionsFor(item.id);

  return (
    <ModuleHub
      title="Submissions"
      description={item.title}
      breadcrumbs={[
        { label: "Dashboard", href: "/dashboard" },
        { label, href: "/assignments" },
        { label: item.title, href: `/assignments/${item.id}` },
        { label: "Submissions" },
      ]}
      tabs={ASSIGNMENTS_TABS}
    >
      <div className="mb-4 flex flex-wrap gap-2">
        <Badge variant="info">{subs.filter((s) => s.status === "submitted").length} submitted</Badge>
        <Badge variant="warning">{subs.filter((s) => s.status === "late").length} late</Badge>
        <Badge variant="error">{subs.filter((s) => s.status === "missing").length} missing</Badge>
        <Badge variant="success">{subs.filter((s) => s.status === "graded").length} graded</Badge>
      </div>
      <SimpleTable
        columns={["Student", "Status", "Late by", "Files", "Score", ""]}
        rows={subs.map((s) => [
          <Link key={s.id} href={`/assignments/${item.id}/submissions/${s.id}`} className="font-medium hover:underline">
            {s.studentName}
          </Link>,
          statusBadge(s.status),
          s.lateByHours != null ? `${s.lateByHours}h` : "—",
          s.files.join(", ") || "—",
          s.score != null ? `${s.score}/${s.maxScore}` : "—",
          <MockActionButton
            key={`${s.id}-g`}
            label="Grade"
            fields={[
              { name: "score", label: "Score", type: "number", required: true, defaultValue: s.score != null ? String(s.score) : "" },
              { name: "feedback", label: "Feedback", type: "textarea", defaultValue: s.feedback ?? "" },
            ]}
            submitLabel="Save grade"
            size="sm"
            variant="outline"
          />,
        ])}
      />
    </ModuleHub>
  );
}

export function AssignmentSubmissionDetailPage({
  id,
  submissionId,
}: {
  id: string;
  submissionId: string;
}) {
  const label = useModuleLabel();
  const item = getAssignment(id) ?? mockAssignments[0];
  const sub = getSubmission(submissionId) ?? mockSubmissions[0];

  return (
    <ModuleHub
      title={sub.studentName}
      description={`Submission for ${item.title}`}
      breadcrumbs={[
        { label: "Dashboard", href: "/dashboard" },
        { label, href: "/assignments" },
        { label: item.title, href: `/assignments/${item.id}` },
        { label: "Submissions", href: `/assignments/${item.id}/submissions` },
        { label: sub.studentName },
      ]}
      tabs={ASSIGNMENTS_TABS}
      actions={
        <MockActionButton
          label="Save grade"
          fields={[
            { name: "score", label: "Score", type: "number", required: true },
            { name: "feedback", label: "Feedback", type: "textarea" },
          ]}
          submitLabel="Save"
        />
      }
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <InfoCard label="Status" value={sub.status.replace(/_/g, " ")} />
        <InfoCard label="Submitted" value={sub.submittedAt?.slice(0, 16).replace("T", " ") ?? "Not submitted"} />
        <InfoCard label="Score" value={sub.score != null ? `${sub.score}/${sub.maxScore}` : "—"} />
        <InfoCard label="Late" value={sub.lateByHours != null ? `${sub.lateByHours} hours` : "No"} />
      </div>
      <Card className="mt-6">
        <CardHeader><CardTitle>Files</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          {sub.files.length === 0 ? (
            <p className="text-sm text-[var(--muted)]">No files attached.</p>
          ) : (
            sub.files.map((f) => (
              <div key={f} className="flex items-center justify-between rounded-lg border border-[var(--border-subtle)] px-3 py-2 text-sm">
                <span>{f}</span>
                <MockToastButton label="Download" message={`${f} downloaded (demo).`} size="sm" />
              </div>
            ))
          )}
        </CardContent>
      </Card>
      {sub.feedback ? (
        <Card className="mt-6">
          <CardHeader><CardTitle>Feedback</CardTitle></CardHeader>
          <CardContent className="text-sm">{sub.feedback}</CardContent>
        </Card>
      ) : null}
    </ModuleHub>
  );
}

export function TeacherAssignmentsPage() {
  const label = useModuleLabel();
  return (
    <ModuleHub
      title={`My ${label}`}
      description="Published work and grading queue."
      breadcrumbs={[{ label: "Teacher", href: "/teacher/dashboard" }, { label }]}
      actions={
        <Button asChild size="sm">
          <Link href="/assignments/create"><Plus className="size-4" />Create</Link>
        </Button>
      }
    >
      <SimpleTable
        columns={["Title", "Course", "Due", "Pending grade", "Status"]}
        rows={mockAssignments
          .filter((a) => a.status !== "draft")
          .map((a) => [
            <Link key={a.id} href={`/assignments/${a.id}/submissions`} className="font-medium hover:underline">
              {a.title}
            </Link>,
            a.courseCode,
            a.dueAt.slice(0, 10),
            String(a.submissionsCount - a.gradedCount),
            statusBadge(a.status),
          ])}
      />
    </ModuleHub>
  );
}

export function StudentAssignmentsPage() {
  const label = useModuleLabel();
  const mine = mockSubmissions.filter((s) => s.studentId === "CS-2022-0421");
  return (
    <ModuleHub
      title={`My ${label}`}
      description="Upcoming work, submissions, and grades."
      breadcrumbs={[{ label: "Student", href: "/student/dashboard" }, { label }]}
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Open" value={mockAssignments.filter((a) => a.status === "published").length} icon={ClipboardList} />
        <KpiCard label="Submitted" value={mine.filter((s) => s.status === "submitted" || s.status === "graded").length} icon={CheckCircle2} />
        <KpiCard label="Late / missing" value={mine.filter((s) => s.status === "late" || s.status === "missing").length} icon={AlertCircle} changeType="negative" />
        <KpiCard label="Graded" value={mine.filter((s) => s.status === "graded" || s.status === "returned").length} icon={CheckCircle2} />
      </div>
      <Card className="mt-6">
        <CardHeader><CardTitle>Assigned work</CardTitle></CardHeader>
        <CardContent>
          <SimpleTable
            columns={["Title", "Course", "Due", "Your status", ""]}
            rows={mockAssignments
              .filter((a) => a.status === "published" || a.status === "grading" || a.status === "closed")
              .map((a) => {
                const sub = mockSubmissions.find((s) => s.assignmentId === a.id && s.studentId === "CS-2022-0421");
                return [
                  a.title,
                  a.courseCode,
                  a.dueAt.slice(0, 10),
                  statusBadge(sub?.status ?? "not_submitted"),
                  <MockActionButton
                    key={a.id}
                    label="Submit"
                    title={`Submit — ${a.title}`}
                    fields={[
                      { name: "file", label: "File", required: true, placeholder: "work.zip" },
                      { name: "notes", label: "Notes", type: "textarea" },
                    ]}
                    submitLabel="Submit"
                    icon={<Upload className="size-4" />}
                    size="sm"
                  />,
                ];
              })}
          />
        </CardContent>
      </Card>
    </ModuleHub>
  );
}

export function ParentAssignmentsPage() {
  const label = useModuleLabel();
  const { selectedChild } = useApp();
  return (
    <ModuleHub
      title={`${selectedChild.name}'s ${label}`}
      description="Track due dates, late work, and grades."
      breadcrumbs={[{ label: "Parent", href: "/parent/dashboard" }, { label }]}
    >
      <SimpleTable
        columns={["Title", "Course", "Due", "Status", "Score"]}
        rows={mockAssignments.slice(0, 5).map((a) => {
          const sub = mockSubmissions.find((s) => s.assignmentId === a.id);
          return [
            a.title,
            a.courseCode,
            a.dueAt.slice(0, 10),
            statusBadge(sub?.status ?? "not_submitted"),
            sub?.score != null ? `${sub.score}/${sub.maxScore}` : "—",
          ];
        })}
      />
    </ModuleHub>
  );
}
