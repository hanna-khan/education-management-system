"use client";

import Link from "next/link";
import {
  AlertTriangle,
  Award,
  BookOpen,
  Building2,
  Bus,
  CalendarOff,
  ClipboardCheck,
  CreditCard,
  FileText,
  GraduationCap,
  Inbox,
  MessageSquareHeart,
  MessageSquareWarning,
  User,
  Wallet,
  type LucideIcon,
} from "lucide-react";
import { ModuleHub, InfoCard, SimpleTable } from "@/components/shared/module-hub";
import { KpiCard } from "@/components/shared/kpi-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MockActionButton, MockToastButton } from "@/components/shared/mock-action";
import {
  SERVICES_TABS,
  getServiceRequest,
  mockServiceRequests,
  serviceCatalog,
  serviceStats,
} from "@/mock/services";
import { formatCurrency, formatNumber } from "@/lib/utils";

const breadcrumbs = [{ label: "Dashboard", href: "/dashboard" }, { label: "Student Services" }];

const ICONS: Record<string, LucideIcon> = {
  FileText,
  Award,
  GraduationCap,
  CreditCard,
  User,
  Wallet,
  BookOpen,
  AlertTriangle,
  ClipboardCheck,
  CalendarOff,
  Building2,
  Bus,
  MessageSquareWarning,
  MessageSquareHeart,
};

function statusBadge(status: string) {
  const map: Record<string, "default" | "success" | "warning" | "error" | "info" | "outline"> = {
    draft: "outline",
    submitted: "info",
    under_review: "warning",
    pending_approval: "warning",
    approved: "success",
    rejected: "error",
    completed: "success",
  };
  return (
    <Badge variant={map[status] ?? "outline"} className="capitalize">
      {status.replace(/_/g, " ")}
    </Badge>
  );
}

export function ServicesCatalogPage() {
  return (
    <ModuleHub
      title="One-Window Student Services"
      description="Request transcripts, certificates, academic changes, hostel, transport, and more."
      breadcrumbs={breadcrumbs}
      tabs={SERVICES_TABS}
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Total requests" value={formatNumber(serviceStats.totalRequests)} icon={Inbox} />
        <KpiCard label="Pending" value={serviceStats.pending} icon={ClipboardCheck} changeType="negative" />
        <KpiCard label="Completed this month" value={serviceStats.completedThisMonth} icon={Award} changeType="positive" />
        <KpiCard label="Avg processing" value={`${serviceStats.avgProcessingDays} days`} icon={FileText} />
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {serviceCatalog.map((svc) => {
          const Icon = ICONS[svc.icon] ?? FileText;
          return (
            <Card key={svc.id} className="transition-shadow hover:shadow-[var(--shadow-sm)]">
              <CardContent className="p-5">
                <div className="flex size-10 items-center justify-center rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-muted)] text-[var(--brand-primary)]">
                  <Icon className="size-5" />
                </div>
                <p className="mt-4 font-semibold tracking-tight">{svc.title}</p>
                <p className="mt-1 text-xs text-[var(--muted)]">{svc.description}</p>
                <p className="mt-3 text-xs text-[var(--muted)]">
                  {svc.department} · ~{svc.avgDays} days
                  {svc.fee ? ` · ${formatCurrency(svc.fee)}` : " · Free"}
                </p>
                <MockActionButton
                  className="mt-4 w-full"
                  label="Start request"
                  title={svc.title}
                  fields={[
                    { name: "purpose", label: "Purpose", required: true },
                    { name: "details", label: "Details", type: "textarea" },
                  ]}
                  submitLabel="Submit"
                  successMessage={`${svc.title} request submitted (demo).`}
                />
              </CardContent>
            </Card>
          );
        })}
      </div>
    </ModuleHub>
  );
}

export function ServicesRequestsPage() {
  return (
    <ModuleHub
      title="Service Requests"
      description="Track drafts through completion."
      breadcrumbs={[...breadcrumbs, { label: "Requests" }]}
      tabs={SERVICES_TABS}
    >
      <div className="mb-4 flex flex-wrap gap-2">
        {["draft", "submitted", "under_review", "pending_approval", "approved", "rejected", "completed"].map((s) => (
          <Badge key={s} variant="outline" className="capitalize">
            {s.replace(/_/g, " ")}: {mockServiceRequests.filter((r) => r.status === s).length}
          </Badge>
        ))}
      </div>
      <SimpleTable
        columns={["Request ID", "Title", "Student", "Department", "Stage", "Status", "Updated"]}
        rows={mockServiceRequests.map((r) => [
          <Link key={r.id} href={`/services/requests/${r.id}`} className="font-medium hover:underline">
            {r.requestId}
          </Link>,
          r.title,
          r.studentName,
          r.department,
          r.stage,
          statusBadge(r.status),
          r.updatedAt,
        ])}
      />
    </ModuleHub>
  );
}

export function ServicesRequestDetailPage({ id }: { id: string }) {
  const req = getServiceRequest(id) ?? mockServiceRequests[0];

  return (
    <ModuleHub
      title={req.requestId}
      description={req.title}
      breadcrumbs={[...breadcrumbs, { label: "Requests", href: "/services/requests" }, { label: req.requestId }]}
      tabs={SERVICES_TABS}
      actions={
        <div className="flex flex-wrap gap-2">
          <MockToastButton label="Add comment" message="Comment added (demo)." variant="outline" />
          <MockActionButton
            label="Update status"
            fields={[
              {
                name: "status",
                label: "Status",
                type: "select",
                options: ["under_review", "pending_approval", "approved", "rejected", "completed"],
                required: true,
              },
            ]}
            submitLabel="Update"
          />
        </div>
      }
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <InfoCard label="Status" value={req.status.replace(/_/g, " ")} />
        <InfoCard label="Stage" value={req.stage} />
        <InfoCard label="Department" value={req.department} />
        <InfoCard label="Submitted" value={req.submittedAt ?? "—"} sub={`Updated ${req.updatedAt}`} />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader><CardTitle>Details</CardTitle></CardHeader>
          <CardContent className="space-y-2 text-sm">
            {Object.entries(req.details).map(([k, v]) => (
              <div key={k} className="flex justify-between gap-4 border-b border-[var(--border-subtle)] py-2">
                <span className="capitalize text-[var(--muted)]">{k.replace(/_/g, " ")}</span>
                <span className="font-medium text-right">{v}</span>
              </div>
            ))}
            <div className="pt-3">
              <p className="ems-label">Attachments</p>
              <p className="mt-1">{req.attachments.length ? req.attachments.join(", ") : "None"}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Timeline</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            {req.timeline.map((t, i) => (
              <div key={`${t.at}-${i}`} className="relative border-l-2 border-[var(--border)] pl-4">
                <p className="text-sm font-medium">{t.action}</p>
                <p className="text-xs text-[var(--muted)]">{t.actor} · {t.at}</p>
                {t.note ? <p className="mt-1 text-xs text-[var(--muted)]">{t.note}</p> : null}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {req.comments.length > 0 ? (
        <Card className="mt-6">
          <CardHeader><CardTitle>Comments</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {req.comments.map((c, i) => (
              <div key={i} className="rounded-lg border border-[var(--border-subtle)] p-3 text-sm">
                <p>{c.body}</p>
                <p className="mt-1 text-xs text-[var(--muted)]">{c.author} · {c.at}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      ) : null}
    </ModuleHub>
  );
}

export function StudentServicesPage() {
  const mine = mockServiceRequests.filter((r) => r.studentId === "CS-2022-0421");
  return (
    <ModuleHub
      title="Student Services"
      description="One-window requests for certificates, academic changes, and campus services."
      breadcrumbs={[{ label: "Student", href: "/student/dashboard" }, { label: "Services" }]}
      actions={
        <Button asChild size="sm">
          <Link href="/services">Browse services</Link>
        </Button>
      }
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="My requests" value={mine.length} icon={Inbox} />
        <KpiCard label="In progress" value={mine.filter((r) => !["completed", "rejected", "draft"].includes(r.status)).length} icon={ClipboardCheck} />
        <KpiCard label="Completed" value={mine.filter((r) => r.status === "completed").length} icon={Award} changeType="positive" />
        <KpiCard label="Drafts" value={mine.filter((r) => r.status === "draft").length} icon={FileText} />
      </div>
      <Card className="mt-6">
        <CardHeader><CardTitle>My requests</CardTitle></CardHeader>
        <CardContent>
          <SimpleTable
            columns={["Request ID", "Title", "Status", "Updated"]}
            rows={mine.map((r) => [
              <Link key={r.id} href={`/services/requests/${r.id}`} className="font-medium hover:underline">
                {r.requestId}
              </Link>,
              r.title,
              statusBadge(r.status),
              r.updatedAt,
            ])}
          />
        </CardContent>
      </Card>
    </ModuleHub>
  );
}
