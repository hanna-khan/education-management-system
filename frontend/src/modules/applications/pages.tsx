"use client";

import Link from "next/link";
import {
  AlertTriangle,
  CheckCircle,
  Clock,
  FileText,
  Inbox,
  Plus,
  XCircle,
} from "lucide-react";
import { ModuleHub, SimpleTable } from "@/components/shared/module-hub";
import { KpiCard } from "@/components/shared/kpi-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MockActionButton, MockToastButton, MOCK_FORMS } from "@/components/shared/mock-action";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  applicationStats,
  mockApplications,
  applicationWorkflowSteps,
  type ApplicationStatus,
} from "@/mock/applications";
import { cn, formatNumber } from "@/lib/utils";

const breadcrumbs = [{ label: "Dashboard", href: "/dashboard" }, { label: "Applications" }];

const formDataByType: Record<string, { label: string; value: string }[]> = {
  leave: [
    { label: "Leave type", value: "Medical Leave" },
    { label: "Start date", value: "2026-08-25" },
    { label: "End date", value: "2026-08-27" },
    { label: "Reason", value: "Scheduled medical procedure — doctor's note attached." },
  ],
  scholarship: [
    { label: "Scholarship type", value: "Merit-based" },
    { label: "CGPA", value: "3.72" },
    { label: "Family income", value: "PKR 45,000 / month" },
    { label: "Supporting documents", value: "Income certificate, transcript" },
  ],
  default: [
    { label: "Description", value: "Standard application form submitted via student portal." },
    { label: "Priority", value: "Normal" },
    { label: "Attachments", value: "1 file attached" },
  ],
};

const auditHistory = [
  { action: "Application submitted", actor: "Ayesha Sheikh", timestamp: "2026-08-20 10:30", note: "Initial submission via student portal." },
  { action: "Assigned to reviewer", actor: "System", timestamp: "2026-08-20 10:31", note: "Routed to Dr. Imran Malik (HOD)." },
  { action: "Teacher review completed", actor: "Sana Iqbal", timestamp: "2026-08-21 14:15", note: "Approved — attendance verified." },
  { action: "Stage advanced", actor: "System", timestamp: "2026-08-21 14:16", note: "Moved to HOD Review stage." },
];

function statusBadge(status: ApplicationStatus | string) {
  const map: Record<string, "default" | "success" | "warning" | "error" | "info" | "outline"> = {
    pending: "warning",
    in_review: "info",
    approved: "success",
    rejected: "error",
    changes_requested: "warning",
  };
  return (
    <Badge variant={map[status] ?? "outline"} className="capitalize">
      {status.replace(/_/g, " ")}
    </Badge>
  );
}

function slaBadge(sla: string, breached: boolean) {
  if (breached) {
    return (
      <Badge variant="error" className="gap-1">
        <AlertTriangle className="size-3" />
        SLA breached
      </Badge>
    );
  }
  if (sla === "—" || sla === "Completed") {
    return <Badge variant="outline">{sla}</Badge>;
  }
  return (
    <Badge variant="info" className="gap-1">
      <Clock className="size-3" />
      {sla}
    </Badge>
  );
}

function typeLabel(type: string) {
  return type.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export function ApplicationsDashboardPage() {
  return (
    <ModuleHub
      title="Applications"
      description="Track leave, scholarship, certificate, and service requests across approval workflows."
      breadcrumbs={breadcrumbs}
      actions={
        <MockActionButton
          label="New application"
          title="New application"
          description="Submit a service request (demo)."
          fields={MOCK_FORMS.application}
          submitLabel="Submit"
          icon={<Plus className="size-4" />}
        />
      }
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <KpiCard label="All applications" value={formatNumber(applicationStats.all)} icon={Inbox} />
        <KpiCard label="Pending" value={applicationStats.pending} icon={Clock} />
        <KpiCard label="In review" value={applicationStats.inReview} icon={FileText} />
        <KpiCard label="Approved" value={applicationStats.approved} changeType="positive" icon={CheckCircle} />
        <KpiCard label="Rejected" value={applicationStats.rejected} changeType="negative" icon={XCircle} />
        <KpiCard label="SLA breached" value={applicationStats.slaBreached} changeType="negative" icon={AlertTriangle} />
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Recent applications</CardTitle>
        </CardHeader>
        <CardContent>
          <SimpleTable
            columns={["ID", "Applicant", "Type", "Stage", "Assigned to", "SLA", "Status"]}
            rows={mockApplications.map((app) => [
              <Link
                key={app.id}
                href={`/applications/${app.id}`}
                className="font-medium text-[var(--brand-primary)] hover:underline"
              >
                {app.id}
              </Link>,
              app.applicant,
              typeLabel(app.type),
              app.stage,
              app.assignedTo,
              slaBadge(app.sla, app.slaBreached),
              statusBadge(app.status),
            ])}
          />
        </CardContent>
      </Card>
    </ModuleHub>
  );
}

export function ApplicationDetailPage({ id }: { id: string }) {
  const application = mockApplications.find((a) => a.id === id) ?? mockApplications[0];
  const formFields = formDataByType[application.type] ?? formDataByType.default;

  return (
    <ModuleHub
      title={application.id}
      description={`${typeLabel(application.type)} · ${application.applicant}`}
      breadcrumbs={[
        ...breadcrumbs.slice(0, -1),
        { label: "Applications", href: "/applications" },
        { label: application.id },
      ]}
      actions={
        application.status !== "approved" && application.status !== "rejected" ? (
          <div className="flex gap-2">
            <MockActionButton
              label="Request changes"
              title="Request changes"
              description="Ask the applicant to update their submission (demo)."
              fields={[{ name: "comment", label: "Comment", type: "textarea", required: true }]}
              submitLabel="Send request"
              variant="outline"
            />
            <MockActionButton
              label="Reject"
              title="Reject application"
              description="Reject this application (demo)."
              fields={[{ name: "reason", label: "Reason", type: "textarea", required: true }]}
              submitLabel="Reject"
              variant="destructive"
              icon={<XCircle className="size-4" />}
              successMessage="Application rejected (demo)."
            />
            <MockActionButton
              label="Approve"
              title="Approve application"
              description="Approve this application (demo)."
              confirmOnly
              submitLabel="Approve"
              icon={<CheckCircle className="size-4" />}
              successMessage="Application approved (demo)."
            />
          </div>
        ) : (
          statusBadge(application.status)
        )
      }
    >
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Workflow timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="relative space-y-0 border-l border-[var(--border)] pl-6">
                {applicationWorkflowSteps.map((step, i) => (
                  <li key={step.step} className={cn("pb-6 last:pb-0", i === applicationWorkflowSteps.length - 1 && "pb-0")}>
                    <span
                      className={cn(
                        "absolute -left-[5px] size-2.5 rounded-full border-2 border-[var(--surface)]",
                        step.status === "completed" && "bg-[var(--success)]",
                        step.status === "current" && "bg-[var(--brand-primary)] ring-4 ring-[var(--brand-primary)]/20",
                        step.status === "pending" && "bg-[var(--border)]",
                      )}
                    />
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="text-sm font-medium text-[var(--foreground)]">{step.step}</p>
                      <Badge
                        variant={
                          step.status === "completed"
                            ? "success"
                            : step.status === "current"
                              ? "info"
                              : "outline"
                        }
                        className="capitalize"
                      >
                        {step.status.replace(/_/g, " ")}
                      </Badge>
                    </div>
                    <p className="mt-0.5 text-xs text-[var(--muted)]">{step.date || "Pending"}</p>
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Form data</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="divide-y divide-[var(--border-subtle)]">
                {formFields.map((field) => (
                  <div key={field.label} className="flex flex-col gap-0.5 py-3 first:pt-0 last:pb-0 sm:flex-row sm:gap-4">
                    <dt className="min-w-[140px] text-sm font-medium text-[var(--muted)]">{field.label}</dt>
                    <dd className="text-sm text-[var(--foreground)]">{field.value}</dd>
                  </div>
                ))}
              </dl>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Application summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <SummaryRow label="Applicant" value={application.applicant} />
              <SummaryRow label="Applicant ID" value={application.applicantId} />
              <SummaryRow label="Type" value={typeLabel(application.type)} />
              <SummaryRow label="Submitted" value={application.submitted} />
              <SummaryRow label="Current stage" value={application.stage} />
              <SummaryRow label="Assigned to" value={application.assignedTo} />
              <div className="flex items-center justify-between pt-1">
                <span className="text-sm text-[var(--muted)]">SLA</span>
                {slaBadge(application.sla, application.slaBreached)}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-[var(--muted)]">Status</span>
                {statusBadge(application.status)}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Audit history</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                {auditHistory.map((entry, i) => (
                  <li key={i} className="border-b border-[var(--border-subtle)] pb-4 last:border-0 last:pb-0">
                    <p className="text-sm font-medium text-[var(--foreground)]">{entry.action}</p>
                    <p className="mt-0.5 text-xs text-[var(--muted)]">
                      {entry.actor} · {entry.timestamp}
                    </p>
                    <p className="mt-1 text-xs text-[var(--muted-foreground)]">{entry.note}</p>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </ModuleHub>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-2">
      <span className="text-sm text-[var(--muted)]">{label}</span>
      <span className="text-right text-sm font-medium text-[var(--foreground)]">{value}</span>
    </div>
  );
}
