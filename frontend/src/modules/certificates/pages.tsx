"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Award,
  FileCheck2,
  FileText,
  IdCard,
  QrCode,
  ShieldCheck,
} from "lucide-react";
import { ModuleHub, InfoCard, SimpleTable } from "@/components/shared/module-hub";
import { KpiCard } from "@/components/shared/kpi-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MockActionButton, MockToastButton } from "@/components/shared/mock-action";
import {
  CERTIFICATES_TABS,
  certificateStats,
  mockCertificateRequests,
  mockTemplates,
  verifyCode,
} from "@/mock/certificates";
import { formatCurrency, formatNumber } from "@/lib/utils";

const breadcrumbs = [{ label: "Dashboard", href: "/dashboard" }, { label: "Certificates" }];

function statusBadge(status: string) {
  const map: Record<string, "default" | "success" | "warning" | "error" | "info" | "outline"> = {
    draft: "outline",
    submitted: "info",
    processing: "warning",
    ready: "info",
    issued: "success",
    rejected: "error",
    verified: "success",
  };
  return (
    <Badge variant={map[status] ?? "outline"} className="capitalize">
      {status.replace(/_/g, " ")}
    </Badge>
  );
}

export function CertificatesDashboardPage() {
  return (
    <ModuleHub
      title="Documents & Certificates"
      description="Templates, issuance requests, and QR verification for NED credentials."
      breadcrumbs={breadcrumbs}
      tabs={CERTIFICATES_TABS}
      actions={
        <MockActionButton
          label="New request"
          fields={[
            { name: "type", label: "Type", type: "select", options: ["transcript", "bonafide", "degree", "provisional", "id_card", "character"], required: true },
            { name: "student", label: "Student ID", required: true },
            { name: "copies", label: "Copies", type: "number", defaultValue: "1" },
            { name: "purpose", label: "Purpose", required: true },
          ]}
          submitLabel="Submit"
          icon={<FileText className="size-4" />}
        />
      }
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <KpiCard label="Templates" value={certificateStats.templates} icon={FileText} />
        <KpiCard label="Open requests" value={certificateStats.requestsOpen} icon={FileCheck2} />
        <KpiCard label="Issued this month" value={certificateStats.issuedThisMonth} icon={Award} changeType="positive" />
        <KpiCard label="Verifications today" value={certificateStats.verificationsToday} icon={ShieldCheck} />
        <KpiCard label="Pending print" value={certificateStats.pendingPrint} icon={IdCard} />
      </div>

      <Card className="mt-6">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Recent requests</CardTitle>
          <Button asChild size="sm" variant="outline">
            <Link href="/certificates/requests">View all</Link>
          </Button>
        </CardHeader>
        <CardContent>
          <SimpleTable
            columns={["Request", "Type", "Student", "Status", "Fee", "Code"]}
            rows={mockCertificateRequests.slice(0, 5).map((r) => [
              r.requestId,
              r.type,
              r.studentName,
              statusBadge(r.status),
              formatCurrency(r.fee),
              <span key={r.id} className="font-mono text-xs">{r.verificationCode}</span>,
            ])}
          />
        </CardContent>
      </Card>
    </ModuleHub>
  );
}

export function CertificatesTemplatesPage() {
  return (
    <ModuleHub
      title="Certificate templates"
      description="Transcript, bonafide, degree, ID card, and related layouts."
      breadcrumbs={[...breadcrumbs, { label: "Templates" }]}
      tabs={CERTIFICATES_TABS}
      actions={
        <MockActionButton
          label="New template"
          fields={[
            { name: "name", label: "Name", required: true },
            { name: "type", label: "Type", type: "select", options: ["transcript", "bonafide", "degree", "id_card", "character"], required: true },
          ]}
          submitLabel="Create"
        />
      }
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {mockTemplates.map((t) => (
          <Card key={t.id}>
            <CardContent className="p-5">
              <div className="flex items-start justify-between gap-2">
                <p className="font-semibold tracking-tight">{t.name}</p>
                {t.active ? <Badge variant="success">Active</Badge> : <Badge variant="outline">Inactive</Badge>}
              </div>
              <p className="mt-1 text-xs text-[var(--muted)]">
                {t.type} · {t.version} · updated {t.lastUpdated}
              </p>
              <p className="mt-3 text-sm text-[var(--muted)]">{t.description}</p>
              <div className="mt-3 flex flex-wrap gap-1">
                {t.fields.slice(0, 4).map((f) => (
                  <Badge key={f} variant="outline">{f}</Badge>
                ))}
                {t.fields.length > 4 ? <Badge variant="outline">+{t.fields.length - 4}</Badge> : null}
              </div>
              <MockToastButton className="mt-4" label="Preview" message={`Previewing ${t.name} (demo).`} size="sm" variant="outline" />
            </CardContent>
          </Card>
        ))}
      </div>
    </ModuleHub>
  );
}

export function CertificatesRequestsPage() {
  return (
    <ModuleHub
      title="Certificate requests"
      description="Issuance pipeline from submission to print."
      breadcrumbs={[...breadcrumbs, { label: "Requests" }]}
      tabs={CERTIFICATES_TABS}
    >
      <SimpleTable
        columns={["Request ID", "Type", "Student", "Program", "Status", "Copies", "Fee", "Submitted"]}
        rows={mockCertificateRequests.map((r) => [
          r.requestId,
          r.type,
          r.studentName,
          r.program,
          statusBadge(r.status),
          String(r.copies),
          formatCurrency(r.fee),
          r.submittedAt,
        ])}
      />
    </ModuleHub>
  );
}

export function CertificatesVerifyAdminPage() {
  const [code, setCode] = useState("NED-BF-4C11E0");
  const [result, setResult] = useState(() => verifyCode("NED-BF-4C11E0"));

  return (
    <ModuleHub
      title="Verification desk"
      description="Admin mock for QR / code lookup."
      breadcrumbs={[...breadcrumbs, { label: "Verify" }]}
      tabs={CERTIFICATES_TABS}
    >
      <Card>
        <CardContent className="flex flex-wrap items-end gap-3 p-5">
          <div className="min-w-[240px] flex-1">
            <label className="ems-label">Verification code</label>
            <Input className="mt-1.5 font-mono" value={code} onChange={(e) => setCode(e.target.value)} />
          </div>
          <Button
            size="sm"
            onClick={() => setResult(verifyCode(code))}
          >
            <QrCode className="size-4" />
            Verify
          </Button>
        </CardContent>
      </Card>
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShieldCheck className="size-5 text-[var(--brand-primary)]" />
            Result
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-2">
            {result.valid ? <Badge variant="success">Valid</Badge> : <Badge variant="error">Invalid / pending</Badge>}
            <span className="font-mono text-sm">{result.code}</span>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <InfoCard label="Student" value={result.studentName} />
            <InfoCard label="Program" value={result.program} />
            <InfoCard label="Type" value={result.type} />
            <InfoCard label="Serial" value={result.serialNo} />
          </div>
          <p className="text-sm text-[var(--muted)]">{result.message}</p>
          <p className="text-xs text-[var(--muted)]">{result.institution}</p>
        </CardContent>
      </Card>
    </ModuleHub>
  );
}

export function StudentCertificatesPage() {
  const mine = mockCertificateRequests.filter((r) => r.studentId === "CS-2022-0421");
  return (
    <ModuleHub
      title="My Certificates"
      description="Request and track transcripts, bonafide, and other credentials."
      breadcrumbs={[{ label: "Student", href: "/student/dashboard" }, { label: "Certificates" }]}
      actions={
        <MockActionButton
          label="Request certificate"
          fields={[
            { name: "type", label: "Type", type: "select", options: ["transcript", "bonafide", "provisional", "character"], required: true },
            { name: "purpose", label: "Purpose", required: true },
            { name: "copies", label: "Copies", type: "number", defaultValue: "1" },
          ]}
          submitLabel="Submit"
        />
      }
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Requests" value={mine.length} icon={FileText} />
        <KpiCard label="Issued" value={mine.filter((r) => r.status === "issued").length} icon={Award} />
        <KpiCard label="Processing" value={mine.filter((r) => r.status === "processing" || r.status === "submitted").length} icon={FileCheck2} />
        <KpiCard label="Templates" value={formatNumber(mockTemplates.filter((t) => t.active).length)} icon={IdCard} />
      </div>
      <Card className="mt-6">
        <CardHeader><CardTitle>My requests</CardTitle></CardHeader>
        <CardContent>
          <SimpleTable
            columns={["Request", "Type", "Status", "Code", "Fee"]}
            rows={mine.map((r) => [
              r.requestId,
              r.type,
              statusBadge(r.status),
              <span key={r.id} className="font-mono text-xs">{r.verificationCode}</span>,
              formatCurrency(r.fee),
            ])}
          />
        </CardContent>
      </Card>
    </ModuleHub>
  );
}

/** Public verification page content (used outside app chrome or inside). */
export function PublicVerifyPage({ code }: { code: string }) {
  const result = verifyCode(code || "INVALID");
  return (
    <div className="mx-auto max-w-lg animate-fade-in px-4 py-16">
      <div className="mb-8 text-center">
        <p className="text-sm font-medium text-[var(--brand-primary)]">NED University · Document Verification</p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight">Certificate verification</h1>
        <p className="mt-2 text-sm text-[var(--muted)]">Scan QR or enter the code printed on the document.</p>
      </div>
      <Card>
        <CardContent className="space-y-4 p-6">
          <div className="flex items-center justify-center gap-2">
            <QrCode className="size-8 text-[var(--brand-primary)]" />
            <span className="font-mono text-sm">{result.code}</span>
          </div>
          <div className="flex justify-center">
            {result.valid ? <Badge variant="success">Authentic</Badge> : <Badge variant="error">Not verified</Badge>}
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between border-b border-[var(--border-subtle)] py-2">
              <span className="text-[var(--muted)]">Student</span>
              <span className="font-medium">{result.studentName}</span>
            </div>
            <div className="flex justify-between border-b border-[var(--border-subtle)] py-2">
              <span className="text-[var(--muted)]">Program</span>
              <span className="font-medium">{result.program}</span>
            </div>
            <div className="flex justify-between border-b border-[var(--border-subtle)] py-2">
              <span className="text-[var(--muted)]">Type</span>
              <span className="font-medium capitalize">{result.type}</span>
            </div>
            <div className="flex justify-between border-b border-[var(--border-subtle)] py-2">
              <span className="text-[var(--muted)]">Issued</span>
              <span className="font-medium">{result.issuedAt || "—"}</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-[var(--muted)]">Serial</span>
              <span className="font-medium">{result.serialNo}</span>
            </div>
          </div>
          <p className="text-center text-sm text-[var(--muted)]">{result.message}</p>
          <p className="text-center text-xs text-[var(--muted)]">{result.institution}</p>
        </CardContent>
      </Card>
    </div>
  );
}
