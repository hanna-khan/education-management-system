"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  CheckCircle,
  ClipboardPen,
  FileWarning,
  QrCode,
  ShieldCheck,
  Upload,
  Users,
} from "lucide-react";
import { ModuleHub, InfoCard, SimpleTable } from "@/components/shared/module-hub";
import { KpiCard } from "@/components/shared/kpi-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { MockActionButton, MockToastButton } from "@/components/shared/mock-action";
import { EmptyState } from "@/components/shared/empty-state";
import { useToast } from "@/components/shared/toast";
import { useApp } from "@/hooks/use-app";
import {
  FORMS_TABS,
  formStats,
  getConvocationPass,
  getFormCampaign,
  getFormSubmission,
  getPassBySubmission,
  mockConvocationPasses,
  mockFormCampaigns,
  mockFormSubmissions,
} from "@/mock/forms";
import { formatNumber } from "@/lib/utils";

const breadcrumbs = [{ label: "Dashboard", href: "/dashboard" }, { label: "Digital Forms" }];

function statusBadge(status: string) {
  const map: Record<string, "default" | "success" | "warning" | "error" | "info" | "outline"> = {
    open: "success",
    draft: "outline",
    closed: "outline",
    archived: "outline",
    submitted: "info",
    under_review: "info",
    needs_correction: "warning",
    approved: "success",
    rejected: "error",
    active: "success",
    ok: "success",
    missing: "error",
    unclear: "warning",
    wrong_type: "error",
  };
  return (
    <Badge variant={map[status] ?? "outline"} className="capitalize">
      {status.replace(/_/g, " ")}
    </Badge>
  );
}

function campaignsForMode(institutionMode: "university" | "school") {
  return mockFormCampaigns.filter((c) => c.institutionTypes.includes(institutionMode));
}

export function FormsDashboardPage() {
  const { institutionMode, t, institution } = useApp();
  const campaigns = campaignsForMode(institutionMode);

  return (
    <ModuleHub
      title="Digital Forms & Applications"
      description={`Replace counter queues with online submissions for ${institution.shortName}. ${t("registrar")} defines required documents; students upload and get validated before approval.`}
      breadcrumbs={breadcrumbs}
      tabs={FORMS_TABS}
      actions={
        <Button asChild size="sm">
          <Link href="/forms/campaigns/new">Create campaign</Link>
        </Button>
      }
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Open campaigns" value={campaigns.filter((c) => c.status === "open").length} icon={ClipboardPen} />
        <KpiCard label="Submissions" value={formatNumber(formStats.totalSubmissions)} icon={Upload} />
        <KpiCard label="Pending review" value={formatNumber(formStats.pendingReview)} icon={FileWarning} />
        <KpiCard label="Passes issued" value={formatNumber(formStats.passesIssued)} icon={QrCode} />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Active campaigns</CardTitle>
            <Button asChild variant="outline" size="sm">
              <Link href="/forms/campaigns">View all</Link>
            </Button>
          </CardHeader>
          <CardContent>
            <SimpleTable
              columns={["Campaign", "Category", "Deadline", "Pending", ""]}
              rows={campaigns
                .filter((c) => c.status === "open")
                .map((c) => [
                  c.title,
                  <Badge key={`${c.id}-cat`} variant="outline" className="capitalize">{c.category}</Badge>,
                  c.closesAt,
                  String(c.pendingCount),
                  <Button key={c.id} asChild size="sm" variant="outline">
                    <Link href={`/forms/campaigns/${c.id}`}>Open</Link>
                  </Button>,
                ])}
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Needs attention</CardTitle>
            <Button asChild variant="outline" size="sm">
              <Link href="/forms/submissions">Queue</Link>
            </Button>
          </CardHeader>
          <CardContent>
            <SimpleTable
              columns={["Student", "Form", "Status", ""]}
              rows={mockFormSubmissions
                .filter((s) => ["needs_correction", "submitted", "under_review"].includes(s.status))
                .map((s) => [
                  s.studentName,
                  s.campaignTitle.split("—")[0].trim(),
                  statusBadge(s.status),
                  <Button key={s.id} asChild size="sm" variant="outline">
                    <Link href={`/forms/submissions/${s.id}`}>Review</Link>
                  </Button>,
                ])}
            />
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>How it replaces the counter queue</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-3 text-sm text-[var(--muted)]">
          <div>
            <p className="font-medium text-[var(--foreground)]">1. Admin defines requirements</p>
            <p className="mt-1">{t("registrar")} creates a campaign and lists required fields + documents (e.g. two guest CNICs for convocation).</p>
          </div>
          <div>
            <p className="font-medium text-[var(--foreground)]">2. Student submits online</p>
            <p className="mt-1">Portal validates missing or unclear files before accept. Student fixes and resubmits — no hour-long queues.</p>
          </div>
          <div>
            <p className="font-medium text-[var(--foreground)]">3. Approve → issue pass</p>
            <p className="mt-1">On approval, a single ceremony / transport pass is generated with guest names, CNICs, and photos.</p>
          </div>
        </CardContent>
      </Card>
    </ModuleHub>
  );
}

export function FormsCampaignsPage() {
  const { institutionMode } = useApp();
  const campaigns = campaignsForMode(institutionMode);

  return (
    <ModuleHub
      title="Form campaigns"
      description="Reusable form templates students can apply to from the portal."
      breadcrumbs={[...breadcrumbs, { label: "Campaigns" }]}
      tabs={FORMS_TABS}
      actions={
        <Button asChild size="sm">
          <Link href="/forms/campaigns/new">Create campaign</Link>
        </Button>
      }
    >
      <SimpleTable
        columns={["Code", "Title", "Category", "Status", "Submissions", "Pending", ""]}
        rows={campaigns.map((c) => [
          c.code,
          c.title,
          <span key={`${c.id}-cat`} className="capitalize">{c.category}</span>,
          statusBadge(c.status),
          formatNumber(c.submissionsCount),
          String(c.pendingCount),
          <Button key={c.id} asChild size="sm" variant="outline">
            <Link href={`/forms/campaigns/${c.id}`}>Manage</Link>
          </Button>,
        ])}
      />
    </ModuleHub>
  );
}

export function FormsCampaignNewPage() {
  const { t } = useApp();
  return (
    <ModuleHub
      title="Create form campaign"
      description={`Define documents and approval steps. Typical owners: ${t("registrar")}, Student Affairs, Transport.`}
      breadcrumbs={[...breadcrumbs, { label: "Campaigns", href: "/forms/campaigns" }, { label: "New" }]}
      tabs={FORMS_TABS}
    >
      <Card>
        <CardContent className="p-6">
          <MockActionButton
            label="Save campaign (demo)"
            title="New digital form campaign"
            fields={[
              { name: "title", label: "Title", required: true, placeholder: "e.g. Convocation 2027 Registration" },
              {
                name: "category",
                label: "Category",
                type: "select",
                required: true,
                options: ["convocation", "degree", "transport", "certificate", "clearance", "other"],
              },
              { name: "opens", label: "Opens at", type: "date", required: true },
              { name: "closes", label: "Closes at", type: "date", required: true },
              {
                name: "docs",
                label: "Required documents (comma-separated)",
                required: true,
                placeholder: "Student photo, Guest 1 CNIC, Guest 2 CNIC, Clearance",
              },
              {
                name: "pass",
                label: "Issue pass on approval?",
                type: "select",
                options: ["Yes — Convocation pass", "Yes — Transport pass", "No"],
              },
            ]}
            submitLabel="Create campaign"
            successMessage="Campaign created as draft (demo). Publish from campaign detail."
          />
        </CardContent>
      </Card>
    </ModuleHub>
  );
}

export function FormsCampaignDetailPage({ id }: { id: string }) {
  const campaign = getFormCampaign(id);
  if (!campaign) {
    return (
      <ModuleHub title="Campaign not found" breadcrumbs={[...breadcrumbs, { label: "Campaigns", href: "/forms/campaigns" }, { label: id }]} tabs={FORMS_TABS}>
        <EmptyState icon={ClipboardPen} title="Campaign not found" description={`No campaign for ID ${id}`} />
      </ModuleHub>
    );
  }

  const related = mockFormSubmissions.filter((s) => s.campaignId === campaign.id);

  return (
    <ModuleHub
      title={campaign.title}
      description={campaign.description}
      breadcrumbs={[...breadcrumbs, { label: "Campaigns", href: "/forms/campaigns" }, { label: campaign.code }]}
      tabs={FORMS_TABS}
      actions={
        <div className="flex gap-2">
          <MockToastButton label="Publish" message="Campaign published (demo)." size="sm" />
          <Button asChild size="sm" variant="outline">
            <Link href="/student/forms">Student view</Link>
          </Button>
        </div>
      }
    >
      <div className="mb-4 flex flex-wrap gap-2">
        {statusBadge(campaign.status)}
        <Badge variant="outline" className="capitalize">{campaign.category}</Badge>
        {campaign.issuesPass ? <Badge variant="info">Issues pass</Badge> : null}
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <InfoCard label="Opens" value={campaign.opensAt} />
        <InfoCard label="Closes" value={campaign.closesAt} />
        <InfoCard label="Submissions" value={formatNumber(campaign.submissionsCount)} />
        <InfoCard label="Pending" value={campaign.pendingCount} />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Required documents</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {campaign.documents.map((d) => (
              <div key={d.id} className="rounded-lg border border-[var(--border-subtle)] p-3">
                <div className="flex items-center justify-between gap-2">
                  <p className="font-medium text-sm">{d.label}</p>
                  {d.required ? <Badge variant="warning">Required</Badge> : <Badge variant="outline">Optional</Badge>}
                </div>
                <p className="mt-1 text-xs text-[var(--muted)]">{d.description}</p>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Approval pipeline</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {campaign.approvalSteps.map((step, i) => (
              <div key={step.id} className="flex items-start gap-3">
                <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-[var(--brand-primary)]/10 text-xs font-bold text-[var(--brand-primary)]">
                  {i + 1}
                </div>
                <div>
                  <p className="text-sm font-medium">{step.label}</p>
                  <p className="text-xs text-[var(--muted)]">{step.role}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader><CardTitle>Recent submissions</CardTitle></CardHeader>
        <CardContent>
          <SimpleTable
            columns={["Student", "Program", "Submitted", "Status", ""]}
            rows={related.map((s) => [
              s.studentName,
              s.program,
              s.submittedAt ?? "—",
              statusBadge(s.status),
              <Button key={s.id} asChild size="sm" variant="outline">
                <Link href={`/forms/submissions/${s.id}`}>Review</Link>
              </Button>,
            ])}
          />
        </CardContent>
      </Card>
    </ModuleHub>
  );
}

export function FormsSubmissionsPage() {
  return (
    <ModuleHub
      title="Submission queue"
      description="Validate documents, request corrections, approve, and issue passes."
      breadcrumbs={[...breadcrumbs, { label: "Submissions" }]}
      tabs={FORMS_TABS}
    >
      <SimpleTable
        columns={["Student", "Form", "Submitted", "Step", "Status", ""]}
        rows={mockFormSubmissions.map((s) => [
          s.studentName,
          s.campaignTitle.split("—")[0].trim(),
          s.submittedAt ?? "—",
          s.currentStep ?? "—",
          statusBadge(s.status),
          <Button key={s.id} asChild size="sm" variant="outline">
            <Link href={`/forms/submissions/${s.id}`}>Open</Link>
          </Button>,
        ])}
      />
    </ModuleHub>
  );
}

export function FormsSubmissionDetailPage({ id }: { id: string }) {
  const submission = getFormSubmission(id);
  const campaign = submission ? getFormCampaign(submission.campaignId) : undefined;
  const pass = submission?.passId ? getConvocationPass(submission.passId) : undefined;

  if (!submission || !campaign) {
    return (
      <ModuleHub title="Submission not found" breadcrumbs={[...breadcrumbs, { label: "Submissions", href: "/forms/submissions" }, { label: id }]} tabs={FORMS_TABS}>
        <EmptyState icon={ClipboardPen} title="Submission not found" description={`No submission for ID ${id}`} />
      </ModuleHub>
    );
  }

  return (
    <ModuleHub
      title={`${submission.studentName} · ${campaign.code}`}
      description={campaign.title}
      breadcrumbs={[...breadcrumbs, { label: "Submissions", href: "/forms/submissions" }, { label: submission.id }]}
      tabs={FORMS_TABS}
      actions={
        <div className="flex flex-wrap gap-2">
          {submission.status === "needs_correction" ? (
            <MockToastButton label="Resend correction notice" message="Student notified (demo)." variant="outline" size="sm" />
          ) : null}
          {["submitted", "under_review", "needs_correction"].includes(submission.status) ? (
            <>
              <MockToastButton label="Request correction" message="Marked needs correction (demo)." variant="outline" size="sm" />
              <MockToastButton
                label={campaign.issuesPass ? "Approve & issue pass" : "Approve"}
                message={campaign.issuesPass ? "Approved — pass generated (demo)." : "Submission approved (demo)."}
                size="sm"
                icon={<CheckCircle className="size-4" />}
              />
            </>
          ) : null}
          {pass ? (
            <Button asChild size="sm" variant="outline">
              <Link href={`/forms/passes/${pass.id}`}>View pass</Link>
            </Button>
          ) : null}
        </div>
      }
    >
      <div className="mb-4 flex flex-wrap gap-2">
        {statusBadge(submission.status)}
        {submission.currentStep ? <Badge variant="outline">{submission.currentStep}</Badge> : null}
      </div>

      {submission.validationErrors.length > 0 ? (
        <Card className="mb-6 border-amber-300/60 bg-amber-50/50 dark:bg-amber-950/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <AlertTriangle className="size-4 text-amber-600" />
              Validation issues
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-1 text-sm">
            {submission.validationErrors.map((err) => (
              <p key={err}>• {err}</p>
            ))}
            {submission.reviewerNote ? (
              <p className="mt-3 text-[var(--muted)]">{submission.reviewerNote}</p>
            ) : null}
          </CardContent>
        </Card>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Form data</CardTitle></CardHeader>
          <CardContent className="space-y-2 text-sm">
            {Object.entries(submission.fieldValues).map(([key, value]) => (
              <div key={key} className="flex justify-between gap-4 border-b border-[var(--border-subtle)] py-1.5">
                <span className="text-[var(--muted)] capitalize">{key.replace(/_/g, " ")}</span>
                <span className="font-medium text-right">{value || "—"}</span>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Documents</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {submission.documents.map((doc) => {
              const def = campaign.documents.find((d) => d.id === doc.documentId);
              return (
                <div key={doc.documentId} className="flex items-start justify-between gap-3 rounded-lg border border-[var(--border-subtle)] p-3">
                  <div>
                    <p className="text-sm font-medium">{def?.label ?? doc.documentId}</p>
                    <p className="text-xs text-[var(--muted)]">{doc.fileName || "Not uploaded"}</p>
                    {doc.note ? <p className="mt-1 text-xs text-amber-700 dark:text-amber-400">{doc.note}</p> : null}
                  </div>
                  {statusBadge(doc.status)}
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>

      {submission.guests && submission.guests.length > 0 ? (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="size-4" />
              Guests on pass (after approval)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <SimpleTable
              columns={["Name", "CNIC", "Relationship", "Photo"]}
              rows={submission.guests.map((g) => [g.name, g.cnic || "—", g.relationship, statusBadge(g.photoStatus)])}
            />
          </CardContent>
        </Card>
      ) : null}
    </ModuleHub>
  );
}

export function FormsPassesPage() {
  return (
    <ModuleHub
      title="Issued passes"
      description="Convocation and other form-issued passes (one pass can include two guests)."
      breadcrumbs={[...breadcrumbs, { label: "Passes" }]}
      tabs={FORMS_TABS}
    >
      <SimpleTable
        columns={["Pass code", "Student", "Ceremony", "Guests", "Status", ""]}
        rows={mockConvocationPasses.map((p) => [
          p.passCode,
          p.studentName,
          p.ceremonyDate,
          String(p.guests.length),
          statusBadge(p.status),
          <Button key={p.id} asChild size="sm" variant="outline">
            <Link href={`/forms/passes/${p.id}`}>View</Link>
          </Button>,
        ])}
      />
    </ModuleHub>
  );
}

export function FormsPassDetailPage({ id }: { id: string }) {
  const pass = getConvocationPass(id);
  if (!pass) {
    return (
      <ModuleHub title="Pass not found" breadcrumbs={[...breadcrumbs, { label: "Passes", href: "/forms/passes" }, { label: id }]} tabs={FORMS_TABS}>
        <EmptyState icon={QrCode} title="Pass not found" description={`No pass for ID ${id}`} />
      </ModuleHub>
    );
  }

  return (
    <ModuleHub
      title="Convocation pass"
      description="Single student pass listing both guardians — names, CNICs, and photos."
      breadcrumbs={[...breadcrumbs, { label: "Passes", href: "/forms/passes" }, { label: pass.passCode }]}
      tabs={FORMS_TABS}
      actions={
        <div className="flex gap-2">
          <MockToastButton label="Download PDF" message="Pass PDF downloaded (demo)." size="sm" />
          <MockToastButton label="Email to student" message="Pass emailed (demo)." variant="outline" size="sm" />
        </div>
      }
    >
      <Card className="overflow-hidden border-[var(--brand-primary)]/30">
        <div className="bg-gradient-to-r from-[var(--brand-primary)] to-[#8C4AF2] px-6 py-4 text-white">
          <p className="text-xs uppercase tracking-wider opacity-80">NED Demo University</p>
          <h2 className="text-xl font-semibold tracking-tight">35th Convocation 2026 — Entry Pass</h2>
          <p className="mt-1 font-mono text-sm opacity-90">{pass.passCode}</p>
        </div>
        <CardContent className="grid gap-6 p-6 lg:grid-cols-[1fr_180px]">
          <div className="space-y-4">
            <div>
              <p className="text-xs text-[var(--muted)]">Graduate</p>
              <p className="text-lg font-semibold">{pass.studentName}</p>
              <p className="text-sm text-[var(--muted)]">{pass.studentId} · {pass.program}</p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 text-sm">
              <InfoCard label="Ceremony" value={pass.ceremonyDate} sub={pass.venue} />
              <InfoCard label="Seat" value={pass.seat ?? "TBA"} sub={`Issued ${pass.issuedAt}`} />
            </div>
            <div>
              <p className="mb-2 text-sm font-medium">Accompanying guests (included on this pass)</p>
              <div className="grid gap-3 sm:grid-cols-2">
                {pass.guests.map((g) => (
                  <div key={g.cnic} className="flex gap-3 rounded-xl border border-[var(--border-subtle)] p-3">
                    <div className="flex size-14 shrink-0 items-center justify-center rounded-lg bg-[var(--surface-muted)] text-xs font-bold text-[var(--muted)]">
                      PHOTO
                    </div>
                    <div className="min-w-0">
                      <p className="truncate font-medium text-sm">{g.name}</p>
                      <p className="text-xs text-[var(--muted)]">{g.relationship}</p>
                      <p className="mt-1 font-mono text-[11px]">{g.cnic}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-[var(--border)] p-4 text-center">
            <div className="flex size-28 items-center justify-center rounded-lg bg-[var(--surface-muted)]">
              <QrCode className="size-16 text-[var(--brand-primary)]" />
            </div>
            <p className="mt-3 font-mono text-xs">{pass.qrCode}</p>
            <Badge className="mt-2" variant="success">{pass.status}</Badge>
          </div>
        </CardContent>
      </Card>
    </ModuleHub>
  );
}

/** Student portal — available forms */
export function StudentFormsPage() {
  const { institutionMode, t } = useApp();
  const campaigns = campaignsForMode(institutionMode).filter((c) => c.status === "open");
  const mine = mockFormSubmissions.filter((s) => s.studentId === "CS-2022-0421");

  return (
    <ModuleHub
      title="Forms & Applications"
      description={`Apply online — ${t("registrar")} requirements, document checks, and digital passes. No counter queues.`}
      breadcrumbs={[{ label: "Student", href: "/student/dashboard" }, { label: "Forms" }]}
    >
      <div className="grid gap-4 lg:grid-cols-2">
        {campaigns.map((c) => (
          <Card key={c.id}>
            <CardHeader>
              <div className="flex items-start justify-between gap-2">
                <CardTitle className="text-base">{c.title}</CardTitle>
                <Badge variant="outline" className="capitalize shrink-0">{c.category}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-[var(--muted)]">{c.description}</p>
              <p className="mt-2 text-xs text-[var(--muted)]">Closes {c.closesAt} · {c.documents.length} required documents</p>
              <Button asChild className="mt-4" size="sm">
                <Link href={`/student/forms/${c.id}/apply`}>Apply</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="mt-6">
        <CardHeader><CardTitle>My submissions</CardTitle></CardHeader>
        <CardContent>
          <SimpleTable
            columns={["Form", "Submitted", "Status", ""]}
            rows={mine.map((s) => [
              s.campaignTitle.split("—")[0].trim(),
              s.submittedAt ?? "—",
              statusBadge(s.status),
              <div key={s.id} className="flex gap-2">
                <Button asChild size="sm" variant="outline">
                  <Link href={`/student/forms/submissions/${s.id}`}>View</Link>
                </Button>
                {s.passId ? (
                  <Button asChild size="sm">
                    <Link href={`/forms/passes/${s.passId}`}>Pass</Link>
                  </Button>
                ) : null}
              </div>,
            ])}
          />
        </CardContent>
      </Card>
    </ModuleHub>
  );
}

export function StudentFormApplyPage({ id }: { id: string }) {
  const campaign = getFormCampaign(id);
  const { toast } = useToast();
  const [fieldValues, setFieldValues] = useState<Record<string, string>>({});
  const [uploads, setUploads] = useState<Record<string, string>>({});
  const [attempted, setAttempted] = useState(false);

  const errors = useMemo(() => {
    if (!campaign) return [] as string[];
    const list: string[] = [];
    for (const field of campaign.fields) {
      if (field.required && !fieldValues[field.id]?.trim()) {
        list.push(`${field.label} is required`);
      }
      if (field.type === "cnic" && fieldValues[field.id] && !/^\d{5}-\d{7}-\d$/.test(fieldValues[field.id])) {
        list.push(`${field.label} must look like 42101-1234567-1`);
      }
    }
    for (const doc of campaign.documents) {
      if (doc.required && !uploads[doc.id]) {
        list.push(`${doc.label} is missing`);
      }
    }
    return list;
  }, [campaign, fieldValues, uploads]);

  if (!campaign) {
    return (
      <ModuleHub title="Form not found" breadcrumbs={[{ label: "Student", href: "/student/dashboard" }, { label: "Forms", href: "/student/forms" }, { label: id }]}>
        <EmptyState icon={ClipboardPen} title="Form not available" description="This campaign is closed or does not exist." />
      </ModuleHub>
    );
  }

  const handleSubmit = () => {
    setAttempted(true);
    if (errors.length) {
      toast("Blocked: fix validation errors first (demo).");
      return;
    }
    toast(
      campaign.issuesPass
        ? "Submitted for review. Pass will issue after approval (demo)."
        : "Submitted for review (demo).",
    );
  };

  return (
    <ModuleHub
      title={campaign.title}
      description="Complete all fields and upload clear documents. Validation runs before submit."
      breadcrumbs={[{ label: "Student", href: "/student/dashboard" }, { label: "Forms", href: "/student/forms" }, { label: "Apply" }]}
    >
      <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
        <div className="space-y-6">
          <Card>
            <CardHeader><CardTitle>Details</CardTitle></CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              {campaign.fields.map((field) => (
                <div key={field.id} className={field.type === "textarea" ? "sm:col-span-2" : undefined}>
                  <label className="mb-1.5 block text-sm font-medium">
                    {field.label}
                    {field.required ? <span className="text-red-500"> *</span> : null}
                  </label>
                  {field.type === "select" ? (
                    <select
                      className="flex h-10 w-full rounded-md border border-[var(--border)] bg-[var(--surface)] px-3 text-sm"
                      value={fieldValues[field.id] ?? ""}
                      onChange={(e) => setFieldValues((p) => ({ ...p, [field.id]: e.target.value }))}
                    >
                      <option value="">Select…</option>
                      {field.options?.map((o) => (
                        <option key={o} value={o}>{o}</option>
                      ))}
                    </select>
                  ) : field.type === "textarea" ? (
                    <textarea
                      className="min-h-[88px] w-full rounded-md border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm"
                      value={fieldValues[field.id] ?? ""}
                      onChange={(e) => setFieldValues((p) => ({ ...p, [field.id]: e.target.value }))}
                    />
                  ) : (
                    <Input
                      placeholder={field.placeholder}
                      value={fieldValues[field.id] ?? ""}
                      onChange={(e) => setFieldValues((p) => ({ ...p, [field.id]: e.target.value }))}
                    />
                  )}
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Required documents</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {campaign.documents.map((doc) => (
                <div key={doc.id} className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-[var(--border-subtle)] p-3">
                  <div>
                    <p className="text-sm font-medium">{doc.label}{doc.required ? " *" : ""}</p>
                    <p className="text-xs text-[var(--muted)]">{doc.description}</p>
                  </div>
                  <Button
                    size="sm"
                    variant={uploads[doc.id] ? "outline" : "default"}
                    onClick={() =>
                      setUploads((p) => ({
                        ...p,
                        [doc.id]: `${doc.id.replace(/doc-/, "")}.jpg`,
                      }))
                    }
                  >
                    <Upload className="mr-1.5 size-3.5" />
                    {uploads[doc.id] ? "Replaced (demo)" : "Upload (demo)"}
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>

          {attempted && errors.length > 0 ? (
            <Card className="border-red-300/50 bg-red-50/40 dark:bg-red-950/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base text-red-700 dark:text-red-300">
                  <ShieldCheck className="size-4" />
                  Incomplete — fix before submit
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-1 text-sm">
                {errors.map((e) => (
                  <p key={e}>• {e}</p>
                ))}
              </CardContent>
            </Card>
          ) : null}

          <Button type="button" size="sm" onClick={handleSubmit}>
            <CheckCircle className="mr-1.5 size-4" />
            Submit application
          </Button>
        </div>

        <Card className="h-fit">
          <CardHeader><CardTitle className="text-base">Checklist</CardTitle></CardHeader>
          <CardContent className="space-y-2 text-sm text-[var(--muted)]">
            <p>• All required fields filled</p>
            <p>• CNIC format ####-#######-#</p>
            <p>• Clear document photos (no blur)</p>
            {campaign.issuesPass ? <p>• After approval you get one pass covering both guests</p> : null}
            <p className="pt-2 text-xs">Closes {campaign.closesAt}</p>
          </CardContent>
        </Card>
      </div>
    </ModuleHub>
  );
}

export function StudentFormSubmissionPage({ id }: { id: string }) {
  const submission = getFormSubmission(id);
  const pass = submission ? getPassBySubmission(submission.id) ?? (submission.passId ? getConvocationPass(submission.passId) : undefined) : undefined;

  if (!submission) {
    return (
      <ModuleHub title="Not found" breadcrumbs={[{ label: "Student", href: "/student/dashboard" }, { label: "Forms", href: "/student/forms" }, { label: id }]}>
        <EmptyState icon={ClipboardPen} title="Submission not found" description="" />
      </ModuleHub>
    );
  }

  return (
    <ModuleHub
      title={submission.campaignTitle}
      description={`Status: ${submission.status.replace(/_/g, " ")}`}
      breadcrumbs={[{ label: "Student", href: "/student/dashboard" }, { label: "Forms", href: "/student/forms" }, { label: "Submission" }]}
      actions={
        pass ? (
          <Button asChild size="sm">
            <Link href={`/forms/passes/${pass.id}`}>Open pass</Link>
          </Button>
        ) : submission.status === "needs_correction" ? (
          <Button asChild size="sm">
            <Link href={`/student/forms/${submission.campaignId}/apply`}>Fix & resubmit</Link>
          </Button>
        ) : null
      }
    >
      {statusBadge(submission.status)}
      {submission.validationErrors.length > 0 ? (
        <Card className="mt-4 border-amber-300/60">
          <CardContent className="space-y-1 p-4 text-sm">
            {submission.validationErrors.map((e) => (
              <p key={e}>• {e}</p>
            ))}
          </CardContent>
        </Card>
      ) : null}
      <Card className="mt-4">
        <CardContent className="space-y-2 p-4 text-sm">
          {Object.entries(submission.fieldValues).map(([k, v]) => (
            <div key={k} className="flex justify-between gap-4">
              <span className="text-[var(--muted)] capitalize">{k.replace(/_/g, " ")}</span>
              <span>{v || "—"}</span>
            </div>
          ))}
        </CardContent>
      </Card>
    </ModuleHub>
  );
}
