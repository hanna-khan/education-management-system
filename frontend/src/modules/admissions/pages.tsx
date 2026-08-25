"use client";

import Link from "next/link";
import { Plus } from "lucide-react";
import { ModuleHub, InfoCard, SimpleTable } from "@/components/shared/module-hub";
import { KpiCard } from "@/components/shared/kpi-card";
import { Badge } from "@/components/ui/badge";
import { MockActionButton, MOCK_FORMS } from "@/components/shared/mock-action";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  admissionsStats, mockApplicants, admissionCycles, meritLists, ADMISSIONS_TABS,
} from "@/mock/admissions";
import { formatNumber } from "@/lib/utils";
import { Inbox, CheckCircle, XCircle, FileWarning, TrendingUp } from "lucide-react";

const breadcrumbs = [{ label: "Dashboard", href: "/dashboard" }, { label: "Admissions" }];

function statusBadge(status: string) {
  const map: Record<string, "default" | "success" | "warning" | "error" | "info" | "outline"> = {
    under_review: "info", accepted: "success", pending_documents: "warning",
    interview: "default", rejected: "error", enrolled: "success", open: "success", closed: "outline",
  };
  return <Badge variant={map[status] ?? "outline"} className="capitalize">{status.replace(/_/g, " ")}</Badge>;
}

export function AdmissionsDashboardPage() {
  return (
    <ModuleHub title="Admissions" description="Manage applications, merit lists, interviews, and enrollment." breadcrumbs={breadcrumbs} tabs={ADMISSIONS_TABS}
      actions={
        <MockActionButton
          label="New application"
          title="New admission application"
          description="Submit a new applicant into the admissions pipeline (demo)."
          fields={MOCK_FORMS.admission}
          submitLabel="Create application"
          icon={<Plus className="size-4" />}
        />
      }>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <KpiCard label="Total applications" value={formatNumber(admissionsStats.totalApplications)} icon={Inbox} />
        <KpiCard label="Under review" value={admissionsStats.underReview} icon={FileWarning} />
        <KpiCard label="Accepted" value={admissionsStats.accepted} changeType="positive" icon={CheckCircle} />
        <KpiCard label="Rejected" value={admissionsStats.rejected} changeType="negative" icon={XCircle} />
        <KpiCard label="Pending documents" value={admissionsStats.pendingDocuments} icon={FileWarning} />
        <KpiCard label="Enrollment conversion" value={admissionsStats.enrollmentConversion} icon={TrendingUp} />
      </div>
      <Card className="mt-6">
        <CardHeader><CardTitle>Recent applicants</CardTitle></CardHeader>
        <CardContent>
          <SimpleTable
            columns={["Applicant", "Program", "Cycle", "Score", "Status", "Submitted"]}
            rows={mockApplicants.slice(0, 5).map(a => [
              <Link key={a.id} href={`/admissions/applicants/${a.id}`} className="font-medium hover:underline">{a.name}</Link>,
              a.program, a.cycle, a.score, statusBadge(a.status), a.submitted,
            ])}
          />
        </CardContent>
      </Card>
    </ModuleHub>
  );
}

export function AdmissionsApplicantsPage() {
  return (
    <ModuleHub title="Applicants" description="Review and manage admission applicants." breadcrumbs={[...breadcrumbs.slice(0, -1), { label: "Admissions", href: "/admissions" }, { label: "Applicants" }]} tabs={ADMISSIONS_TABS}>
      <SimpleTable
        columns={["ID", "Name", "Program", "Cycle", "Score", "Status", "Submitted"]}
        rows={mockApplicants.map(a => [a.id, a.name, a.program, a.cycle, a.score, statusBadge(a.status), a.submitted])}
      />
    </ModuleHub>
  );
}

export function AdmissionsProgramsPage() {
  return (
    <ModuleHub title="Admission Programs" breadcrumbs={[...breadcrumbs.slice(0, -1), { label: "Admissions", href: "/admissions" }, { label: "Programs" }]} tabs={ADMISSIONS_TABS}>
      <SimpleTable columns={["Program", "Cycle", "Seats", "Applications", "Status"]}
        rows={[["BS Computer Science", "Fall 2026", 120, 486, statusBadge("open")], ["BS Electrical Engineering", "Fall 2026", 100, 312, statusBadge("open")], ["BBA", "Fall 2026", 80, 198, statusBadge("open")], ["MBA", "Fall 2026", 40, 86, statusBadge("open")]]} />
    </ModuleHub>
  );
}

export function AdmissionsCyclesPage() {
  return (
    <ModuleHub title="Admission Cycles" breadcrumbs={[...breadcrumbs.slice(0, -1), { label: "Admissions", href: "/admissions" }, { label: "Cycles" }]} tabs={ADMISSIONS_TABS}>
      <SimpleTable columns={["Cycle", "Status", "Applications", "Deadline"]}
        rows={admissionCycles.map(c => [c.name, statusBadge(c.status), c.applications, c.deadline])} />
    </ModuleHub>
  );
}

export function AdmissionsMeritPage() {
  return (
    <ModuleHub title="Merit Lists" breadcrumbs={[...breadcrumbs.slice(0, -1), { label: "Admissions", href: "/admissions" }, { label: "Merit Lists" }]} tabs={ADMISSIONS_TABS}>
      <SimpleTable columns={["Program", "Published", "Seats", "Filled"]}
        rows={meritLists.map(m => [m.program, m.published, m.seats, m.filled])} />
    </ModuleHub>
  );
}

export function AdmissionsInterviewsPage() {
  return (
    <ModuleHub title="Interviews" breadcrumbs={[...breadcrumbs.slice(0, -1), { label: "Admissions", href: "/admissions" }, { label: "Interviews" }]} tabs={ADMISSIONS_TABS}>
      <SimpleTable columns={["Applicant", "Program", "Date", "Panel", "Status"]}
        rows={[["Hina Akbar", "BS Software Engineering", "2026-08-25", "CS Faculty Panel", statusBadge("interview")], ["Hamza Siddiqui", "BS Computer Science", "2026-08-26", "CS Faculty Panel", statusBadge("under_review")]]} />
    </ModuleHub>
  );
}

export function AdmissionsOffersPage() {
  return (
    <ModuleHub title="Offers" breadcrumbs={[...breadcrumbs.slice(0, -1), { label: "Admissions", href: "/admissions" }, { label: "Offers" }]} tabs={ADMISSIONS_TABS}>
      <SimpleTable columns={["Applicant", "Program", "Offer Date", "Deadline", "Status"]}
        rows={[["Amina Tariq", "BS Electrical Engineering", "2026-08-16", "2026-08-30", statusBadge("accepted")], ["Sadia Noor", "BS Mathematics", "2026-08-14", "2026-08-28", statusBadge("enrolled")]]} />
    </ModuleHub>
  );
}

export function AdmissionsEnrollmentPage() {
  return (
    <ModuleHub title="Enrollment" breadcrumbs={[...breadcrumbs.slice(0, -1), { label: "Admissions", href: "/admissions" }, { label: "Enrollment" }]} tabs={ADMISSIONS_TABS}>
      <div className="grid gap-4 sm:grid-cols-3">
        <InfoCard label="Offers accepted" value={352} sub="Fall 2026 cycle" />
        <InfoCard label="Enrolled" value={286} sub="72.4% conversion" />
        <InfoCard label="Pending enrollment" value={66} sub="Awaiting document submission" />
      </div>
    </ModuleHub>
  );
}
