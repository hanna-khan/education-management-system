"use client";

import Link from "next/link";
import {
  AlertTriangle,
  Bell,
  CheckCircle,
  FileWarning,
  ShieldAlert,
  User,
} from "lucide-react";
import { ModuleHub, InfoCard, SimpleTable } from "@/components/shared/module-hub";
import { KpiCard } from "@/components/shared/kpi-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MockActionButton, MockToastButton } from "@/components/shared/mock-action";
import {
  DISCIPLINE_TABS,
  disciplineStats,
  getIncident,
  getIncidentTimeline,
  mockActions,
  mockBehaviourHistory,
  mockFollowUps,
  mockIncidents,
  mockParentNotifications,
  mockWarnings,
} from "@/mock/discipline";

const breadcrumbs = [{ label: "Dashboard", href: "/dashboard" }, { label: "Discipline" }];

function statusBadge(status: string) {
  const map: Record<string, "default" | "success" | "warning" | "error" | "info" | "outline"> = {
    reported: "warning",
    under_review: "warning",
    action_pending: "info",
    action_taken: "info",
    parent_notified: "info",
    resolved: "success",
    appealed: "warning",
    closed: "outline",
    active: "success",
    expired: "outline",
    revoked: "error",
    pending: "warning",
    completed: "success",
    cancelled: "outline",
    scheduled: "info",
    missed: "error",
    minor: "info",
    moderate: "warning",
    major: "error",
    critical: "error",
    verbal: "outline",
    first_written: "warning",
    second_written: "error",
    final: "error",
    positive: "success",
    incident: "warning",
    warning: "warning",
    action: "error",
  };
  return (
    <Badge variant={map[status] ?? "outline"} className="capitalize">
      {status.replace(/_/g, " ")}
    </Badge>
  );
}

export function DisciplineDashboardPage() {
  return (
    <ModuleHub
      title="Discipline"
      description="Incident management — teacher reports, admin review, actions, and parent notifications."
      breadcrumbs={breadcrumbs}
      tabs={DISCIPLINE_TABS}
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <KpiCard label="Total incidents" value={disciplineStats.totalIncidents} icon={ShieldAlert} />
        <KpiCard label="Open incidents" value={disciplineStats.openIncidents} icon={AlertTriangle} changeType="negative" />
        <KpiCard label="Pending review" value={disciplineStats.pendingReview} icon={FileWarning} />
        <KpiCard label="Actions this month" value={disciplineStats.actionsThisMonth} icon={CheckCircle} />
        <KpiCard label="Parent notifications" value={disciplineStats.parentNotificationsSent} icon={Bell} />
        <KpiCard label="Resolved this month" value={disciplineStats.resolvedThisMonth} icon={CheckCircle} changeType="positive" />
      </div>

      <Card className="mt-6">
        <CardHeader><CardTitle>Workflow pipeline</CardTitle></CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-center gap-2 text-sm">
            {["Teacher reports", "Admin/HOD review", "Action", "Parent notification", "Resolution"].map((step, i) => (
              <div key={step} className="flex items-center gap-2">
                {i > 0 ? <span className="text-[var(--muted)]">→</span> : null}
                <Badge variant="outline">{step}</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Open incidents</CardTitle>
            <Button asChild size="sm" variant="outline"><Link href="/discipline/incidents">All incidents</Link></Button>
          </CardHeader>
          <CardContent>
            <SimpleTable
              columns={["ID", "Student", "Category", "Severity", "Status"]}
              rows={mockIncidents.filter((i) => !["resolved", "closed"].includes(i.status)).map((i) => [
                <Link key={i.id} href={`/discipline/incidents/${i.id}`} className="font-medium hover:underline">{i.incidentId}</Link>,
                i.studentName,
                i.category.replace(/_/g, " "),
                statusBadge(i.severity),
                statusBadge(i.status),
              ])}
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Follow-ups</CardTitle></CardHeader>
          <CardContent>
            <SimpleTable
              columns={["Student", "Scheduled", "Assigned", "Status"]}
              rows={mockFollowUps.map((f) => [f.studentName, f.scheduledAt, f.assignedTo, statusBadge(f.status)])}
            />
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader><CardTitle>Behaviour history (recent)</CardTitle></CardHeader>
        <CardContent>
          <SimpleTable
            columns={["Student", "Date", "Type", "Summary", "Points"]}
            rows={mockBehaviourHistory.map((b) => [b.studentName, b.date, statusBadge(b.type), b.summary, b.points > 0 ? `+${b.points}` : String(b.points)])}
          />
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader><CardTitle>Parent notifications pending acknowledgment</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {mockParentNotifications.filter((n) => n.requiresAcknowledgment && !n.acknowledged).map((n) => (
            <div key={n.id} className="rounded-lg border border-[var(--border-subtle)] p-3 text-sm">
              <p className="font-medium">{n.title}</p>
              <p className="text-[var(--muted)]">{n.studentName} · {n.sentAt}</p>
              <p className="mt-1">{n.message.slice(0, 120)}…</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </ModuleHub>
  );
}

export function DisciplineIncidentsPage() {
  return (
    <ModuleHub title="Incidents" description="All disciplinary incidents." breadcrumbs={[...breadcrumbs, { label: "Incidents" }]} tabs={DISCIPLINE_TABS}>
      <SimpleTable
        columns={["ID", "Student", "Category", "Severity", "Location", "Reported", "Reporter", "Status", ""]}
        rows={mockIncidents.map((i) => [
          <Link key={i.id} href={`/discipline/incidents/${i.id}`} className="font-medium hover:underline">{i.incidentId}</Link>,
          i.studentName,
          i.category.replace(/_/g, " "),
          statusBadge(i.severity),
          i.location.slice(0, 25) + "…",
          i.reportedAt.slice(0, 10),
          i.reportedBy,
          statusBadge(i.status),
          <Button key={i.id} asChild size="sm" variant="outline"><Link href={`/discipline/incidents/${i.id}`}>View</Link></Button>,
        ])}
      />
    </ModuleHub>
  );
}

export function DisciplineIncidentDetailPage({ id }: { id: string }) {
  const incident = getIncident(id) ?? mockIncidents[0];
  const timeline = getIncidentTimeline(incident.id);
  const warnings = mockWarnings.filter((w) => w.incidentId === incident.id);
  const actions = mockActions.filter((a) => a.incidentId === incident.id);
  const notifications = mockParentNotifications.filter((n) => n.incidentId === incident.id);

  return (
    <ModuleHub
      title={incident.incidentId}
      description={`${incident.studentName} · ${incident.category.replace(/_/g, " ")}`}
      breadcrumbs={[...breadcrumbs, { label: "Incidents", href: "/discipline/incidents" }, { label: incident.incidentId }]}
      tabs={DISCIPLINE_TABS}
      actions={
        <div className="flex flex-wrap gap-2">
          <MockActionButton label="Issue action" fields={[{ name: "type", label: "Action type", type: "select", options: ["verbal_warning", "written_warning", "detention", "suspension", "counseling"], required: true }, { name: "notes", label: "Notes", type: "textarea" }]} submitLabel="Issue" />
          <MockToastButton label="Notify parent" message="Parent notification sent via SMS and portal (demo)." variant="outline" />
          <MockToastButton label="Mark resolved" message="Incident marked resolved (demo)." variant="outline" />
        </div>
      }
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <InfoCard label="Student" value={incident.studentName} sub={incident.studentId} />
        <InfoCard label="Severity" value={incident.severity} />
        <InfoCard label="Status" value={incident.status.replace(/_/g, " ")} />
        <InfoCard label="Reported by" value={incident.reportedBy} sub={incident.reporterRole} />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader><CardTitle>Incident details</CardTitle></CardHeader>
          <CardContent className="space-y-3 text-sm">
            <p><span className="text-[var(--muted)]">Location: </span>{incident.location}</p>
            <p><span className="text-[var(--muted)]">Reported: </span>{incident.reportedAt}</p>
            <p className="pt-2">{incident.description}</p>
            {incident.witnesses?.length ? <p><span className="text-[var(--muted)]">Witnesses: </span>{incident.witnesses.join("; ")}</p> : null}
            {incident.evidence?.length ? <p><span className="text-[var(--muted)]">Evidence: </span>{incident.evidence.join("; ")}</p> : null}
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Workflow timeline</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            {timeline.map((t, i) => (
              <div key={`${t.at}-${i}`} className="relative border-l-2 border-[var(--border)] pl-4">
                <p className="text-sm font-medium">{t.action}</p>
                <p className="text-xs text-[var(--muted)]">{t.actor} · {t.at}</p>
                {t.note ? <p className="mt-1 text-xs text-[var(--muted)]">{t.note}</p> : null}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {warnings.length > 0 ? (
        <Card className="mt-6">
          <CardHeader><CardTitle>Warnings</CardTitle></CardHeader>
          <CardContent>
            <SimpleTable columns={["Warning", "Level", "Reason", "Issued", "Status"]} rows={warnings.map((w) => [w.warningId, statusBadge(w.level), w.reason, w.issuedAt, statusBadge(w.status)])} />
          </CardContent>
        </Card>
      ) : null}

      {actions.length > 0 ? (
        <Card className="mt-6">
          <CardHeader><CardTitle>Actions taken</CardTitle></CardHeader>
          <CardContent>
            <SimpleTable columns={["Action", "Type", "Description", "Start", "Status"]} rows={actions.map((a) => [a.actionId, a.type.replace(/_/g, " "), a.description, a.startDate, statusBadge(a.status)])} />
          </CardContent>
        </Card>
      ) : null}

      {notifications.length > 0 ? (
        <Card className="mt-6">
          <CardHeader><CardTitle>Parent notifications</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {notifications.map((n) => (
              <div key={n.id} className="rounded-lg border border-[var(--border-subtle)] p-3 text-sm">
                <p className="font-medium">{n.title}</p>
                <p className="mt-1 text-[var(--muted)]">{n.sentAt} · {n.read ? "Read" : "Unread"} · {n.acknowledged ? "Acknowledged" : "Pending acknowledgment"}</p>
                <p className="mt-2">{n.message}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      ) : null}
    </ModuleHub>
  );
}

export function DisciplineWarningsPage() {
  return (
    <ModuleHub title="Warnings" description="Verbal and written warnings." breadcrumbs={[...breadcrumbs, { label: "Warnings" }]} tabs={DISCIPLINE_TABS}>
      <SimpleTable
        columns={["Warning", "Student", "Level", "Reason", "Issued by", "Issued", "Expires", "Status"]}
        rows={mockWarnings.map((w) => [w.warningId, w.studentName, statusBadge(w.level), w.reason, w.issuedBy, w.issuedAt, w.expiresAt ?? "—", statusBadge(w.status)])}
      />
      <Card className="mt-6">
        <CardHeader><CardTitle>Warning escalation policy</CardTitle></CardHeader>
        <CardContent className="space-y-2 text-sm text-[var(--muted)]">
          <p>1. Verbal warning — documented, no formal record on transcript</p>
          <p>2. First written warning — valid 6 months</p>
          <p>3. Second written warning — may trigger suspension review</p>
          <p>4. Final warning — referral to Disciplinary Committee</p>
        </CardContent>
      </Card>
      <Card className="mt-6">
        <CardHeader><CardTitle>Active warnings by student</CardTitle></CardHeader>
        <CardContent>
          <SimpleTable
            columns={["Student", "Warnings", "Highest level"]}
            rows={Array.from(new Set(mockWarnings.map((w) => w.studentName))).map((name) => {
              const studentWarnings = mockWarnings.filter((w) => w.studentName === name && w.status === "active");
              const levels = studentWarnings.map((w) => w.level);
              const highest = levels.includes("final") ? "final" : levels.includes("second_written") ? "second_written" : levels.includes("first_written") ? "first_written" : "verbal";
              return [name, String(studentWarnings.length), highest.replace(/_/g, " ")];
            })}
          />
        </CardContent>
      </Card>
    </ModuleHub>
  );
}

export function DisciplineActionsPage() {
  return (
    <ModuleHub title="Disciplinary Actions" description="Actions issued following incident review." breadcrumbs={[...breadcrumbs, { label: "Actions" }]} tabs={DISCIPLINE_TABS}>
      <SimpleTable
        columns={["Action", "Student", "Type", "Description", "Start", "End", "Issued by", "Status"]}
        rows={mockActions.map((a) => [a.actionId, a.studentName, a.type.replace(/_/g, " "), a.description.slice(0, 40) + "…", a.startDate, a.endDate ?? "—", a.issuedBy, statusBadge(a.status)])}
      />
      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        {mockActions.map((a) => (
          <Card key={a.id}>
            <CardHeader className="flex flex-row items-start justify-between">
              <CardTitle className="text-base">{a.actionId}</CardTitle>
              {statusBadge(a.status)}
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p><span className="text-[var(--muted)]">Student: </span>{a.studentName}</p>
              <p><span className="text-[var(--muted)]">Type: </span>{a.type.replace(/_/g, " ")}</p>
              <p>{a.description}</p>
              <p className="text-[var(--muted)]">{a.startDate}{a.endDate ? ` → ${a.endDate}` : ""} · Issued by {a.issuedBy}</p>
              <MockToastButton label="Mark complete" message="Action marked complete (demo)." size="sm" variant="outline" />
            </CardContent>
          </Card>
        ))}
      </div>
      <Card className="mt-6">
        <CardHeader><CardTitle>Follow-up schedule</CardTitle></CardHeader>
        <CardContent>
          <SimpleTable
            columns={["Student", "Scheduled", "Assigned", "Notes", "Status"]}
            rows={mockFollowUps.map((f) => [f.studentName, f.scheduledAt, f.assignedTo, f.notes, statusBadge(f.status)])}
          />
        </CardContent>
      </Card>
    </ModuleHub>
  );
}

export function TeacherDisciplinePage() {
  return (
    <ModuleHub
      title="Report Incident"
      description="Report a disciplinary incident for admin/HOD review."
      breadcrumbs={[{ label: "Teacher", href: "/teacher/dashboard" }, { label: "Discipline" }]}
      actions={
        <MockActionButton
          label="Report incident"
          title="Report disciplinary incident"
          fields={[
            { name: "studentId", label: "Student ID", required: true, placeholder: "CS-2023-0245" },
            { name: "category", label: "Category", type: "select", options: ["academic_dishonesty", "misconduct", "bullying", "violence", "property_damage", "attendance", "dress_code", "other"], required: true },
            { name: "severity", label: "Severity", type: "select", options: ["minor", "moderate", "major", "critical"], required: true },
            { name: "location", label: "Location", required: true },
            { name: "description", label: "Description", type: "textarea", required: true },
            { name: "witnesses", label: "Witnesses", type: "textarea" },
          ]}
          submitLabel="Submit report"
          successMessage="Incident reported. Admin/HOD will review and take action."
          icon={<ShieldAlert className="size-4" />}
        />
      }
    >
      <Card>
        <CardHeader><CardTitle>Reporting guidelines</CardTitle></CardHeader>
        <CardContent className="space-y-2 text-sm text-[var(--muted)]">
          <p>• Report incidents within 24 hours of occurrence</p>
          <p>• Include specific details: date, time, location, witnesses</p>
          <p>• Academic dishonesty cases should include exam/course details</p>
          <p>• Serious incidents (violence, bullying) are escalated immediately</p>
          <p>• You will be notified when admin takes action</p>
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader><CardTitle>Your recent reports</CardTitle></CardHeader>
        <CardContent>
          <SimpleTable
            columns={["ID", "Student", "Category", "Reported", "Status"]}
            rows={mockIncidents.filter((i) => i.reportedBy.includes("Dr.") || i.reportedBy.includes("Engr.") || i.reportedBy.includes("Prof.")).map((i) => [i.incidentId, i.studentName, i.category.replace(/_/g, " "), i.reportedAt.slice(0, 10), statusBadge(i.status)])}
          />
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader><CardTitle>Category reference</CardTitle></CardHeader>
        <CardContent className="grid gap-2 sm:grid-cols-2 text-sm">
          {[
            ["academic_dishonesty", "Cheating, plagiarism, unauthorized materials in exams"],
            ["misconduct", "Disruptive behaviour, insubordination"],
            ["bullying", "Harassment, verbal or physical intimidation"],
            ["violence", "Physical altercations, threats"],
            ["property_damage", "Damage to university or personal property"],
            ["attendance", "Chronic absenteeism below required threshold"],
            ["dress_code", "Lab safety gear, uniform violations"],
            ["other", "Cases not covered above"],
          ].map(([cat, desc]) => (
            <div key={cat} className="rounded-lg border border-[var(--border-subtle)] p-3">
              <p className="font-medium capitalize">{cat.replace(/_/g, " ")}</p>
              <p className="mt-1 text-[var(--muted)]">{desc}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </ModuleHub>
  );
}

export function ParentDisciplinePage() {
  return (
    <ModuleHub title="Discipline Notifications" description="Disciplinary incidents involving your child." breadcrumbs={[{ label: "Parent", href: "/parent/dashboard" }, { label: "Discipline" }]}>
      <div className="space-y-3">
        {mockParentNotifications.map((n) => (
          <Card key={n.id}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-medium">{n.title}</p>
                  <p className="mt-1 text-sm text-[var(--muted)]">{n.studentName} · {n.sentAt}</p>
                  <p className="mt-2 text-sm">{n.message}</p>
                </div>
                {n.requiresAcknowledgment && !n.acknowledged ? <Badge variant="warning">Acknowledgment required</Badge> : null}
              </div>
              {n.requiresAcknowledgment && !n.acknowledged ? (
                <MockToastButton className="mt-3" label="Acknowledge" message="Discipline notification acknowledged (demo)." size="sm" />
              ) : null}
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="mt-6">
        <CardHeader><CardTitle>Behaviour history</CardTitle></CardHeader>
        <CardContent>
          <SimpleTable
            columns={["Date", "Type", "Summary", "Points"]}
            rows={mockBehaviourHistory.map((b) => [b.date, statusBadge(b.type), b.summary, b.points > 0 ? `+${b.points}` : String(b.points)])}
          />
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader><CardTitle>Parent guidance</CardTitle></CardHeader>
        <CardContent className="space-y-2 text-sm text-[var(--muted)]">
          <p>• Acknowledge all discipline notifications within 48 hours</p>
          <p>• Contact the Dean of Students office for appeals or clarifications</p>
          <p>• Attend scheduled follow-up meetings when requested</p>
          <p>• Support your child in completing assigned corrective actions</p>
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader><CardTitle>Active warnings & actions</CardTitle></CardHeader>
        <CardContent>
          <SimpleTable
            columns={["Student", "Type", "Details", "Status"]}
            rows={[
              ...mockWarnings.filter((w) => w.status === "active").map((w) => [w.studentName, "Warning", w.reason, statusBadge(w.status)]),
              ...mockActions.filter((a) => a.status === "active").map((a) => [a.studentName, "Action", a.type.replace(/_/g, " "), statusBadge(a.status)]),
            ]}
          />
        </CardContent>
      </Card>
    </ModuleHub>
  );
}
