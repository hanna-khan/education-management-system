"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  Award,
  Building2,
  CheckCircle,
  ClipboardList,
  FileCheck,
  FileText,
  Plus,
  Shield,
  Upload,
} from "lucide-react";
import { ModuleHub, InfoCard, SimpleTable } from "@/components/shared/module-hub";
import { KpiCard } from "@/components/shared/kpi-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/shared/empty-state";
import { MockActionButton, MockToastButton } from "@/components/shared/mock-action";
import {
  ACCREDITATION_TABS,
  ACCREDITATION_TIMELINE,
  mockAccreditationAudits,
  mockAccreditationBodies,
  mockAccreditationCycles,
  mockAccreditationDocuments,
  mockAccreditationEvidence,
  mockAccreditationFindings,
  mockAccreditationRequirements,
  mockAccreditationStandards,
  mockAccreditedPrograms,
  mockCorrectiveActions,
  accreditationStats,
} from "@/mock/accreditation";
import { formatNumber } from "@/lib/utils";

const breadcrumbs = [{ label: "Dashboard", href: "/dashboard" }, { label: "Accreditation" }];

function statusBadge(status: string) {
  const map: Record<string, "default" | "success" | "warning" | "error" | "info" | "outline"> = {
    active: "success",
    inactive: "outline",
    accredited: "success",
    provisional: "warning",
    expired: "error",
    in_review: "info",
    met: "success",
    partial: "warning",
    not_met: "error",
    pending: "info",
    preparation: "outline",
    submission: "info",
    review: "warning",
    visit: "info",
    findings: "error",
    corrective_action: "warning",
    approved: "success",
    scheduled: "info",
    in_progress: "warning",
    completed: "success",
    minor: "outline",
    major: "warning",
    critical: "error",
    open: "warning",
    addressed: "info",
    closed: "success",
    verified: "success",
    draft: "outline",
    submitted: "info",
    internal: "default",
    external: "info",
    desk_review: "outline",
  };
  return (
    <Badge variant={map[status] ?? "outline"} className="capitalize">
      {status.replace(/_/g, " ")}
    </Badge>
  );
}

function TimelineBar({ stage }: { stage: string }) {
  const idx = ACCREDITATION_TIMELINE.findIndex((s) => s.toLowerCase().replace(/ /g, "_") === stage || s === stage);
  return (
    <div className="flex flex-wrap items-center gap-2 text-sm">
      {ACCREDITATION_TIMELINE.map((step, i) => (
        <div key={step} className="flex items-center gap-2">
          {i > 0 ? <span className="text-[var(--muted)]">→</span> : null}
          <Badge variant={i <= idx ? "default" : "outline"}>{step}</Badge>
        </div>
      ))}
    </div>
  );
}

export function AccreditationDashboardPage() {
  return (
    <ModuleHub
      title="Accreditation Management"
      description="PEC, HEC, NCEAC accreditation — programs, standards, evidence, and review cycles at NED University."
      breadcrumbs={breadcrumbs}
      tabs={ACCREDITATION_TABS}
      actions={
        <MockActionButton
          label="Start review cycle"
          fields={[
            { name: "program", label: "Program", type: "select", options: mockAccreditedPrograms.map((p) => p.programName), required: true },
            { name: "body", label: "Accreditation body", type: "select", options: mockAccreditationBodies.map((b) => b.name), required: true },
          ]}
          submitLabel="Start cycle"
          icon={<Plus className="size-4" />}
        />
      }
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Accredited programs" value={accreditationStats.accreditedPrograms} icon={Award} changeType="positive" />
        <KpiCard label="Active cycles" value={accreditationStats.activeCycles} icon={ClipboardList} />
        <KpiCard label="Pending requirements" value={accreditationStats.pendingRequirements} icon={FileCheck} changeType="negative" />
        <KpiCard label="Open findings" value={accreditationStats.openFindings} icon={Shield} changeType="negative" />
      </div>
      <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Overdue actions" value={accreditationStats.overdueActions} icon={FileText} changeType="negative" />
        <KpiCard label="Evidence documents" value={formatNumber(accreditationStats.evidenceDocuments)} icon={Upload} />
        <KpiCard label="Upcoming visits" value={accreditationStats.upcomingVisits} icon={Building2} />
        <KpiCard label="Accreditation bodies" value={mockAccreditationBodies.length} icon={CheckCircle} />
      </div>

      <Card className="mt-6">
        <CardHeader><CardTitle>Accreditation timeline</CardTitle></CardHeader>
        <CardContent>
          <TimelineBar stage="review" />
          <p className="mt-3 text-sm text-[var(--muted)]">Standard cycle: Preparation → Submission → Review → Visit → Findings → Corrective Action → Approved</p>
        </CardContent>
      </Card>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Active review cycles</CardTitle>
            <Button asChild size="sm" variant="outline"><Link href="/accreditation/cycles">All cycles</Link></Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {mockAccreditationCycles.filter((c) => c.progress < 100).map((c) => (
              <div key={c.id} className="rounded-lg border border-[var(--border-subtle)] p-3">
                <div className="flex items-center justify-between">
                  <p className="font-medium">{c.program}</p>
                  {statusBadge(c.stage)}
                </div>
                <p className="mt-1 text-sm text-[var(--muted)]">{c.body} · {c.coordinator}</p>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-[var(--surface-muted)]">
                  <div className="h-full rounded-full bg-[var(--brand-primary)]" style={{ width: `${c.progress}%` }} />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Open findings & corrective actions</CardTitle></CardHeader>
          <CardContent>
            <SimpleTable
              columns={["Finding", "Severity", "Program", "Due", "Status"]}
              rows={mockAccreditationFindings.filter((f) => f.status === "open").map((f) => [
                f.findingId,
                statusBadge(f.severity),
                f.program,
                f.dueDate,
                statusBadge(f.status),
              ])}
            />
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Accredited programs</CardTitle>
          <Button asChild size="sm" variant="outline"><Link href="/accreditation/programs">View all</Link></Button>
        </CardHeader>
        <CardContent>
          <SimpleTable
            columns={["Program", "Department", "Body", "Level", "Valid Until", "Status"]}
            rows={mockAccreditedPrograms.map((p) => [p.programName, p.department, p.body, p.accreditationLevel, p.validUntil, statusBadge(p.status)])}
          />
        </CardContent>
      </Card>
      <Card className="mt-6">
        <CardHeader><CardTitle>HEC compliance checklist</CardTitle></CardHeader>
        <CardContent className="space-y-2 text-sm text-[var(--muted)]">
          <p>• QEC charter and steering committee — Complete</p>
          <p>• Annual self-assessment report — Submitted Jan 2026</p>
          <p>• Program learning outcomes assessment — 16/18 programs documented</p>
          <p>• Faculty development plan — In progress (ME, BS programs)</p>
          <p>• Student feedback mechanism — Linked to Survey Builder module</p>
        </CardContent>
      </Card>
    </ModuleHub>
  );
}

export function AccreditationBodiesPage() {
  return (
    <ModuleHub title="Accreditation Bodies" description="PEC, HEC, NCEAC, and other accrediting organizations." breadcrumbs={[...breadcrumbs, { label: "Bodies" }]} tabs={ACCREDITATION_TABS}>
      <SimpleTable
        columns={["Code", "Name", "Country", "Contact", "Programs", "Website", "Status"]}
        rows={mockAccreditationBodies.map((b) => [b.code, b.name, b.country, b.contactPerson, String(b.programsCovered), b.website, statusBadge(b.status)])}
      />
    </ModuleHub>
  );
}

export function AccreditationProgramsPage() {
  return (
    <ModuleHub title="Accredited Programs" description="Program accreditation status and validity." breadcrumbs={[...breadcrumbs, { label: "Programs" }]} tabs={ACCREDITATION_TABS}>
      <SimpleTable
        columns={["Code", "Program", "Department", "Body", "Level", "Valid Until", "Status"]}
        rows={mockAccreditedPrograms.map((p) => [p.programCode, p.programName, p.department, p.body, p.accreditationLevel, p.validUntil, statusBadge(p.status)])}
      />
    </ModuleHub>
  );
}

export function AccreditationRequirementsPage() {
  const [filter, setFilter] = useState("all");
  const filtered = useMemo(() => filter === "all" ? mockAccreditationRequirements : mockAccreditationRequirements.filter((r) => r.status === filter), [filter]);
  return (
    <ModuleHub title="Requirements" description="Standard requirements compliance tracking." breadcrumbs={[...breadcrumbs, { label: "Requirements" }]} tabs={ACCREDITATION_TABS}>
      <div className="mb-4 flex flex-wrap gap-2">
        {["all", "met", "partial", "not_met", "pending"].map((s) => (
          <Button key={s} size="sm" variant={filter === s ? "default" : "outline"} onClick={() => setFilter(s)} className="capitalize">{s.replace(/_/g, " ")}</Button>
        ))}
      </div>
      {filtered.length === 0 ? <EmptyState icon={FileCheck} title="No requirements" description="No requirements match filter." /> : (
        <SimpleTable columns={["Req ID", "Standard", "Title", "Body", "Program", "Mandatory", "Evidence", "Status"]}
          rows={filtered.map((r) => [r.reqId, r.standard, r.title, r.body, r.program, r.mandatory ? "Yes" : "No", String(r.evidenceCount), statusBadge(r.status)])} />
      )}
    </ModuleHub>
  );
}

export function AccreditationStandardsPage() {
  return (
    <ModuleHub title="Standards" description="Accreditation standards catalog." breadcrumbs={[...breadcrumbs, { label: "Standards" }]} tabs={ACCREDITATION_TABS}>
      <SimpleTable columns={["Code", "Title", "Body", "Category", "Requirements", "Description"]}
        rows={mockAccreditationStandards.map((s) => [s.code, s.title, s.body, s.category, String(s.requirementsCount), s.description])} />
    </ModuleHub>
  );
}

export function AccreditationEvidencePage() {
  return (
    <ModuleHub title="Evidence" description="Accreditation evidence repository." breadcrumbs={[...breadcrumbs, { label: "Evidence" }]} tabs={ACCREDITATION_TABS}
      actions={<MockActionButton label="Upload" fields={[{ name: "title", label: "Title", required: true }, { name: "standard", label: "Standard", required: true }]} submitLabel="Upload" icon={<Upload className="size-4" />} />}>
      <SimpleTable columns={["Evidence ID", "Title", "Standard", "Program", "Uploaded By", "Date", "Verified"]}
        rows={mockAccreditationEvidence.map((e) => [e.evidenceId, e.title, e.standard, e.program, e.uploadedBy, e.uploadedAt, e.verified ? statusBadge("verified") : statusBadge("pending")])} />
    </ModuleHub>
  );
}

export function AccreditationDocumentsPage() {
  return (
    <ModuleHub title="Documents" description="SAR, SSR, policies, and checklists." breadcrumbs={[...breadcrumbs, { label: "Documents" }]} tabs={ACCREDITATION_TABS}>
      <SimpleTable columns={["Doc ID", "Title", "Type", "Program", "Version", "Updated", "Status", ""]}
        rows={mockAccreditationDocuments.map((d) => [d.docId, d.title, d.type.toUpperCase(), d.program, d.version, d.updatedAt, statusBadge(d.status), <MockToastButton key={d.id} label="Download" message={`${d.docId} downloaded (demo).`} size="sm" variant="outline" />])} />
    </ModuleHub>
  );
}

export function AccreditationCyclesPage() {
  return (
    <ModuleHub title="Review Cycles" description="Accreditation review cycle tracking." breadcrumbs={[...breadcrumbs, { label: "Review Cycles" }]} tabs={ACCREDITATION_TABS}>
      {mockAccreditationCycles.map((c) => (
        <Card key={c.id} className="mb-4">
          <CardHeader><CardTitle>{c.cycleId} — {c.program}</CardTitle></CardHeader>
          <CardContent>
            <TimelineBar stage={c.stage} />
            <p className="mt-3 text-sm text-[var(--muted)]">{c.body} · Coordinator: {c.coordinator} · Progress: {c.progress}%</p>
          </CardContent>
        </Card>
      ))}
    </ModuleHub>
  );
}

export function AccreditationAuditsPage() {
  return (
    <ModuleHub title="Audits" description="Internal and external accreditation audits." breadcrumbs={[...breadcrumbs, { label: "Audits" }]} tabs={ACCREDITATION_TABS}>
      <SimpleTable columns={["Audit ID", "Program", "Body", "Type", "Date", "Auditor", "Status"]}
        rows={mockAccreditationAudits.map((a) => [a.auditId, a.program, a.body, statusBadge(a.auditType), a.scheduledDate, a.auditor, statusBadge(a.status)])} />
    </ModuleHub>
  );
}

export function AccreditationFindingsPage() {
  return (
    <ModuleHub title="Findings" description="Audit findings and observations." breadcrumbs={[...breadcrumbs, { label: "Findings" }]} tabs={ACCREDITATION_TABS}>
      <SimpleTable columns={["Finding ID", "Audit", "Standard", "Description", "Severity", "Program", "Due", "Status"]}
        rows={mockAccreditationFindings.map((f) => [f.findingId, f.auditId, f.standard, f.description.slice(0, 50) + "…", statusBadge(f.severity), f.program, f.dueDate, statusBadge(f.status)])} />
    </ModuleHub>
  );
}

export function AccreditationCorrectiveActionsPage() {
  return (
    <ModuleHub title="Corrective Actions" description="Actions to address accreditation findings." breadcrumbs={[...breadcrumbs, { label: "Corrective Actions" }]} tabs={ACCREDITATION_TABS}
      actions={<MockActionButton label="New action" fields={[{ name: "findingId", label: "Finding ID", required: true }, { name: "title", label: "Action title", required: true }, { name: "owner", label: "Owner", required: true }]} submitLabel="Create" />}>
      <SimpleTable columns={["Action ID", "Finding", "Title", "Owner", "Department", "Due", "Progress", "Status"]}
        rows={mockCorrectiveActions.map((a) => [a.actionId, a.findingId, a.title, a.owner, a.department, a.dueDate, `${a.progress}%`, statusBadge(a.status)])} />
    </ModuleHub>
  );
}
