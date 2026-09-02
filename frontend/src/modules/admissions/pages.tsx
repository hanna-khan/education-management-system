"use client";

import Link from "next/link";
import { useEffect, useState, type ReactNode } from "react";
import { Plus, Inbox, CheckCircle, XCircle, FileWarning, TrendingUp, Loader2 } from "lucide-react";
import { ModuleHub, SimpleTable } from "@/components/shared/module-hub";
import { KpiCard } from "@/components/shared/kpi-card";
import { Badge } from "@/components/ui/badge";
import { MockActionButton, MOCK_FORMS } from "@/components/shared/mock-action";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ADMISSIONS_TABS } from "@/mock/admissions";
import { formatNumber } from "@/lib/utils";
import {
  getAdmissionCycles,
  getAdmissionStats,
  getApplicants,
  getInterviews,
  getMeritLists,
  getOffers,
} from "@/services/admissions";

const breadcrumbs = [{ label: "Dashboard", href: "/dashboard" }, { label: "Admissions" }];

type Applicant = {
  id: string;
  name: string;
  program: string;
  cycle: string;
  status: string;
  score: number;
  submitted?: string;
};

function statusBadge(status: string) {
  const map: Record<string, "default" | "success" | "warning" | "error" | "info" | "outline"> = {
    under_review: "info",
    accepted: "success",
    pending_documents: "warning",
    interview: "default",
    rejected: "error",
    enrolled: "success",
    offered: "info",
    open: "success",
    closed: "outline",
    pending: "warning",
    scheduled: "info",
  };
  return (
    <Badge variant={map[status] ?? "outline"} className="capitalize">
      {status.replace(/_/g, " ")}
    </Badge>
  );
}

function LoadingBlock() {
  return (
    <div className="flex items-center justify-center py-16 text-[var(--muted)]">
      <Loader2 className="size-5 animate-spin" />
    </div>
  );
}

function ErrorBlock({ message }: { message: string }) {
  return <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{message}</p>;
}

export function AdmissionsDashboardPage() {
  const [stats, setStats] = useState<Record<string, number | string> | null>(null);
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([getAdmissionStats(), getApplicants()])
      .then(([s, a]) => {
        setStats(s);
        setApplicants(a as Applicant[]);
      })
      .catch((e) => setError(e.message || "Failed to load admissions"));
  }, []);

  return (
    <ModuleHub
      title="Admissions"
      description="Manage applications, merit lists, interviews, and enrollment."
      breadcrumbs={breadcrumbs}
      tabs={ADMISSIONS_TABS}
      actions={
        <MockActionButton
          label="New application"
          title="New admission application"
          description="Submit a new applicant into the admissions pipeline."
          fields={MOCK_FORMS.admission}
          submitLabel="Create application"
          icon={<Plus className="size-4" />}
        />
      }
    >
      {error ? <ErrorBlock message={error} /> : null}
      {!stats && !error ? <LoadingBlock /> : null}
      {stats ? (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            <KpiCard label="Total applications" value={formatNumber(Number(stats.totalApplications || 0))} icon={Inbox} />
            <KpiCard label="Under review" value={Number(stats.underReview || 0)} icon={FileWarning} />
            <KpiCard label="Accepted" value={Number(stats.accepted || 0)} changeType="positive" icon={CheckCircle} />
            <KpiCard label="Rejected" value={Number(stats.rejected || 0)} changeType="negative" icon={XCircle} />
            <KpiCard label="Pending documents" value={Number(stats.pendingDocuments || 0)} icon={FileWarning} />
            <KpiCard label="Enrollment conversion" value={String(stats.enrollmentConversion || "0%")} icon={TrendingUp} />
          </div>
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Recent applicants</CardTitle>
            </CardHeader>
            <CardContent>
              <SimpleTable
                columns={["Applicant", "Program", "Cycle", "Score", "Status", "Submitted"]}
                rows={applicants.slice(0, 5).map((a) => [
                  <Link key={a.id} href={`/admissions/applicants/${a.id}`} className="font-medium hover:underline">
                    {a.name}
                  </Link>,
                  a.program,
                  a.cycle,
                  a.score,
                  statusBadge(a.status),
                  a.submitted,
                ])}
              />
            </CardContent>
          </Card>
        </>
      ) : null}
    </ModuleHub>
  );
}

export function AdmissionsApplicantsPage() {
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getApplicants()
      .then((a) => setApplicants(a as Applicant[]))
      .catch((e) => setError(e.message || "Failed to load"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <ModuleHub
      title="Applicants"
      description="Review and manage admission applicants."
      breadcrumbs={[...breadcrumbs.slice(0, -1), { label: "Admissions", href: "/admissions" }, { label: "Applicants" }]}
      tabs={ADMISSIONS_TABS}
    >
      {loading ? <LoadingBlock /> : null}
      {error ? <ErrorBlock message={error} /> : null}
      {!loading && !error ? (
        <SimpleTable
          columns={["ID", "Name", "Program", "Cycle", "Score", "Status", "Submitted"]}
          rows={applicants.map((a) => [a.id, a.name, a.program, a.cycle, a.score, statusBadge(a.status), a.submitted])}
        />
      ) : null}
    </ModuleHub>
  );
}

export function AdmissionsProgramsPage() {
  const [rows, setRows] = useState<ReactNode[][]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMeritLists()
      .then((lists) => {
        setRows(
          (lists as Array<{ program: string; seats: number; filled: number }>).map((m) => [
            m.program,
            "Current cycle",
            m.seats,
            m.filled,
            statusBadge("open"),
          ]),
        );
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <ModuleHub
      title="Admission Programs"
      breadcrumbs={[...breadcrumbs.slice(0, -1), { label: "Admissions", href: "/admissions" }, { label: "Programs" }]}
      tabs={ADMISSIONS_TABS}
    >
      {loading ? <LoadingBlock /> : <SimpleTable columns={["Program", "Cycle", "Seats", "Applications", "Status"]} rows={rows} />}
    </ModuleHub>
  );
}

export function AdmissionsCyclesPage() {
  const [cycles, setCycles] = useState<Array<{ id: string; name: string; status: string; applications: number; deadline?: string }>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAdmissionCycles()
      .then((c) => setCycles(c as typeof cycles))
      .finally(() => setLoading(false));
  }, []);

  return (
    <ModuleHub
      title="Admission Cycles"
      breadcrumbs={[...breadcrumbs.slice(0, -1), { label: "Admissions", href: "/admissions" }, { label: "Cycles" }]}
      tabs={ADMISSIONS_TABS}
    >
      {loading ? (
        <LoadingBlock />
      ) : (
        <SimpleTable
          columns={["Name", "Status", "Applications", "Deadline"]}
          rows={cycles.map((c) => [c.name, statusBadge(c.status), c.applications, c.deadline])}
        />
      )}
    </ModuleHub>
  );
}

export function AdmissionsMeritPage() {
  return <AdmissionsMeritListsPage />;
}

export function AdmissionsMeritListsPage() {
  const [lists, setLists] = useState<Array<{ id: string; program: string; published?: string; seats: number; filled: number }>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMeritLists()
      .then((l) => setLists(l as typeof lists))
      .finally(() => setLoading(false));
  }, []);

  return (
    <ModuleHub
      title="Merit Lists"
      breadcrumbs={[...breadcrumbs.slice(0, -1), { label: "Admissions", href: "/admissions" }, { label: "Merit Lists" }]}
      tabs={ADMISSIONS_TABS}
    >
      {loading ? (
        <LoadingBlock />
      ) : (
        <SimpleTable
          columns={["Program", "Published", "Seats", "Filled"]}
          rows={lists.map((m) => [m.program, m.published, m.seats, m.filled])}
        />
      )}
    </ModuleHub>
  );
}

export function AdmissionsInterviewsPage() {
  const [rows, setRows] = useState<Array<{ applicant?: string; program?: string; date?: string; panel?: string; status: string }>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getInterviews()
      .then((i) => setRows(i as typeof rows))
      .finally(() => setLoading(false));
  }, []);

  return (
    <ModuleHub
      title="Interviews"
      breadcrumbs={[...breadcrumbs.slice(0, -1), { label: "Admissions", href: "/admissions" }, { label: "Interviews" }]}
      tabs={ADMISSIONS_TABS}
    >
      {loading ? (
        <LoadingBlock />
      ) : (
        <SimpleTable
          columns={["Applicant", "Program", "Date", "Panel", "Status"]}
          rows={rows.map((r) => [r.applicant, r.program, r.date, r.panel, statusBadge(r.status)])}
        />
      )}
    </ModuleHub>
  );
}

export function AdmissionsOffersPage() {
  const [rows, setRows] = useState<Array<{ applicant?: string; program?: string; offerDate?: string; deadline?: string; status: string }>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getOffers()
      .then((o) => setRows(o as typeof rows))
      .finally(() => setLoading(false));
  }, []);

  return (
    <ModuleHub
      title="Offers"
      breadcrumbs={[...breadcrumbs.slice(0, -1), { label: "Admissions", href: "/admissions" }, { label: "Offers" }]}
      tabs={ADMISSIONS_TABS}
    >
      {loading ? (
        <LoadingBlock />
      ) : (
        <SimpleTable
          columns={["Applicant", "Program", "Offer Date", "Deadline", "Status"]}
          rows={rows.map((r) => [r.applicant, r.program, r.offerDate, r.deadline, statusBadge(r.status)])}
        />
      )}
    </ModuleHub>
  );
}

export function AdmissionsEnrollmentPage() {
  const [summary, setSummary] = useState<Record<string, number> | null>(null);

  useEffect(() => {
    import("@/lib/api").then(({ api }) =>
      api<Record<string, number>>("/admissions/enrollment").then(setSummary).catch(() => setSummary(null)),
    );
  }, []);

  return (
    <ModuleHub
      title="Enrollment"
      breadcrumbs={[...breadcrumbs.slice(0, -1), { label: "Admissions", href: "/admissions" }, { label: "Enrollment" }]}
      tabs={ADMISSIONS_TABS}
    >
      {!summary ? (
        <LoadingBlock />
      ) : (
        <div className="grid gap-4 sm:grid-cols-3">
          <KpiCard label="Offers accepted" value={summary.offersAccepted || 0} icon={CheckCircle} />
          <KpiCard label="Enrolled" value={summary.enrolled || 0} icon={Inbox} />
          <KpiCard label="Pending offers" value={summary.pending || 0} icon={FileWarning} />
        </div>
      )}
    </ModuleHub>
  );
}
