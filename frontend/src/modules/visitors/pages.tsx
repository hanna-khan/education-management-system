"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  CheckCircle,
  QrCode,
  ScanLine,
  Shield,
  UserCheck,
  UserPlus,
  Users,
} from "lucide-react";
import { ModuleHub, InfoCard, SimpleTable } from "@/components/shared/module-hub";
import { KpiCard } from "@/components/shared/kpi-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/shared/empty-state";
import { MockActionButton, MockToastButton } from "@/components/shared/mock-action";
import {
  VISITORS_TABS,
  VISITOR_WORKFLOW,
  getGatePass,
  getVisitorWorkflow,
  mockGatePasses,
  mockPickupRequests,
  mockSecurityScans,
  mockVisitorRegistrations,
  visitorStats,
} from "@/mock/visitors";
import { formatNumber } from "@/lib/utils";

const breadcrumbs = [{ label: "Dashboard", href: "/dashboard" }, { label: "Visitors" }];

function statusBadge(status: string) {
  const map: Record<string, "default" | "success" | "warning" | "error" | "info" | "outline"> = {
    pending: "warning",
    approved: "success",
    rejected: "error",
    checked_in: "info",
    checked_out: "outline",
    expired: "error",
    general: "default",
    parent_pickup: "warning",
    vendor: "info",
    guest_lecturer: "success",
    official: "outline",
    completed: "success",
    entry: "success",
    exit: "outline",
    verify: "info",
    allowed: "success",
    denied: "error",
  };
  return (
    <Badge variant={map[status] ?? "outline"} className="capitalize">
      {status.replace(/_/g, " ")}
    </Badge>
  );
}

export function VisitorsDashboardPage() {
  return (
    <ModuleHub
      title="Visitor & Gate Pass"
      description="Visitor registration, QR gate passes, parent pickup — NED University security."
      breadcrumbs={breadcrumbs}
      tabs={VISITORS_TABS}
      actions={
        <MockActionButton
          label="Register visitor"
          fields={[
            { name: "name", label: "Visitor name", required: true },
            { name: "cnic", label: "CNIC", required: true, placeholder: "42101-1234567-1" },
            { name: "purpose", label: "Purpose", required: true },
            { name: "host", label: "Host name", required: true },
          ]}
          submitLabel="Register"
          icon={<UserPlus className="size-4" />}
        />
      }
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Visitors today" value={visitorStats.visitorsToday} icon={Users} />
        <KpiCard label="Checked in now" value={visitorStats.checkedInNow} icon={UserCheck} />
        <KpiCard label="Pending approvals" value={visitorStats.pendingApprovals} icon={Shield} changeType="negative" />
        <KpiCard label="Security scans today" value={visitorStats.securityScansToday} icon={ScanLine} />
      </div>
      <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <KpiCard label="Active passes" value={visitorStats.activePasses} icon={QrCode} />
        <KpiCard label="Pickup requests" value={visitorStats.pickupRequests} icon={Users} />
        <KpiCard label="Registrations today" value={formatNumber(mockVisitorRegistrations.length)} icon={UserPlus} />
      </div>

      <Card className="mt-6">
        <CardHeader><CardTitle>Gate pass workflow</CardTitle></CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-center gap-2 text-sm">
            {VISITOR_WORKFLOW.map((step, i) => (
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
            <CardTitle>Pending approvals</CardTitle>
            <Button asChild size="sm" variant="outline"><Link href="/visitors/approval">Approval queue</Link></Button>
          </CardHeader>
          <CardContent>
            <SimpleTable
              columns={["Pass", "Visitor", "Type", "Host", "Valid", "Status"]}
              rows={mockGatePasses.filter((p) => p.status === "pending" || p.status === "approved").slice(0, 5).map((p) => [
                p.passId,
                p.visitorName,
                statusBadge(p.passType),
                p.hostName,
                p.validUntil,
                statusBadge(p.status),
              ])}
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Recent security scans</CardTitle></CardHeader>
          <CardContent>
            <SimpleTable
              columns={["Scan", "Visitor", "Type", "Gate", "Result", "Time"]}
              rows={mockSecurityScans.slice(0, 4).map((s) => [s.scanId, s.visitorName, statusBadge(s.scanType), s.gate, statusBadge(s.result), s.scannedAt])}
            />
          </CardContent>
        </Card>
      </div>
    </ModuleHub>
  );
}

export function VisitorsRegisterPage() {
  return (
    <ModuleHub title="Visitor Registration" description="Register new campus visitors." breadcrumbs={[...breadcrumbs, { label: "Register" }]} tabs={VISITORS_TABS}
      actions={
        <MockActionButton label="Register visitor" fields={[
          { name: "name", label: "Full name", required: true },
          { name: "cnic", label: "CNIC", required: true },
          { name: "phone", label: "Phone", required: true, placeholder: "+92-300-…" },
          { name: "purpose", label: "Purpose", required: true },
          { name: "host", label: "Host", required: true },
          { name: "department", label: "Host department", required: true },
        ]} submitLabel="Register" icon={<UserPlus className="size-4" />} successMessage="Visitor registered. Gate pass pending approval (demo)." />
      }>
      <SimpleTable columns={["Registration", "Visitor", "CNIC", "Purpose", "Host", "Department", "Registered", "Status"]}
        rows={mockVisitorRegistrations.map((v) => [v.registrationId, v.visitorName, v.cnic, v.purpose, v.hostName, v.hostDepartment, v.registeredAt, statusBadge(v.status)])} />
    </ModuleHub>
  );
}

export function VisitorsPassesPage() {
  return (
    <ModuleHub title="Gate Passes" description="QR-based gate passes for campus entry." breadcrumbs={[...breadcrumbs, { label: "Passes" }]} tabs={VISITORS_TABS}>
      <SimpleTable columns={["Pass ID", "Visitor", "Type", "Host", "Valid From", "Valid Until", "QR Code", "Status", ""]}
        rows={mockGatePasses.map((p) => [
          p.passId,
          p.visitorName,
          statusBadge(p.passType),
          p.hostName,
          p.validFrom,
          p.validUntil,
          p.qrCode,
          statusBadge(p.status),
          <Button key={p.id} asChild size="sm" variant="outline"><Link href={`/visitors/passes/${p.id}`}>View</Link></Button>,
        ])} />
    </ModuleHub>
  );
}

export function VisitorPassDetailPage({ id }: { id: string }) {
  const pass = getGatePass(id);
  const workflow = getVisitorWorkflow(id);
  if (!pass) {
    return (
      <ModuleHub title="Pass not found" breadcrumbs={[...breadcrumbs, { label: "Passes", href: "/visitors/passes" }, { label: id }]} tabs={VISITORS_TABS}>
        <EmptyState icon={QrCode} title="Gate pass not found" description={`No gate pass found for ID: ${id}`} />
      </ModuleHub>
    );
  }
  return (
    <ModuleHub title={pass.passId} description={`Gate pass for ${pass.visitorName}`} breadcrumbs={[...breadcrumbs, { label: "Passes", href: "/visitors/passes" }, { label: pass.passId }]} tabs={VISITORS_TABS}
      actions={pass.status === "pending" ? <MockToastButton label="Approve pass" message="Gate pass approved and QR activated (demo)." icon={<CheckCircle className="size-4" />} /> : null}>
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Pass details</CardTitle></CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p><strong>Visitor:</strong> {pass.visitorName}</p>
            <p><strong>CNIC:</strong> {pass.cnic}</p>
            <p><strong>Type:</strong> {statusBadge(pass.passType)}</p>
            <p><strong>Host:</strong> {pass.hostName}</p>
            <p><strong>Valid:</strong> {pass.validFrom} — {pass.validUntil}</p>
            <p><strong>Status:</strong> {statusBadge(pass.status)}</p>
            {pass.approvedBy && <p><strong>Approved by:</strong> {pass.approvedBy}</p>}
            {pass.entryTime && <p><strong>Entry:</strong> {pass.entryTime}</p>}
            {pass.exitTime && <p><strong>Exit:</strong> {pass.exitTime}</p>}
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>QR Code</CardTitle></CardHeader>
          <CardContent className="flex flex-col items-center gap-4">
            <div className="flex size-48 items-center justify-center rounded-xl border-2 border-dashed border-[var(--border)] bg-[var(--surface-muted)]">
              <QrCode className="size-24 text-[var(--muted)]" />
            </div>
            <p className="font-mono text-sm">{pass.qrCode}</p>
            <MockToastButton label="Download QR" message="QR code downloaded (demo)." variant="outline" />
          </CardContent>
        </Card>
      </div>
      <Card className="mt-6">
        <CardHeader><CardTitle>Workflow status</CardTitle></CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-center gap-2 text-sm">
            {workflow.map((w) => (
              <div key={w.stage} className="flex items-center gap-2">
                {VISITOR_WORKFLOW.indexOf(w.stage) > 0 ? <span className="text-[var(--muted)]">→</span> : null}
                <Badge variant={w.current ? "default" : w.completed ? "success" : "outline"}>{w.stage}</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </ModuleHub>
  );
}

export function VisitorsPickupRequestsPage() {
  return (
    <ModuleHub title="Parent Pickup Requests" description="Authorized parent/guardian pickup requests." breadcrumbs={[...breadcrumbs, { label: "Pickup Requests" }]} tabs={VISITORS_TABS}>
      <SimpleTable columns={["Request", "Parent", "Student", "Class", "Pickup Time", "Authorized Person", "CNIC", "Submitted", "Status", ""]}
        rows={mockPickupRequests.map((p) => [p.requestId, p.parentName, p.studentName, p.classSection, p.pickupTime, p.authorizedPerson, p.authorizedCnic, p.submittedAt, statusBadge(p.status), p.status === "pending" ? <MockToastButton key={p.id} label="Approve" message="Pickup request approved (demo)." size="sm" variant="outline" /> : null])} />
    </ModuleHub>
  );
}

export function VisitorsApprovalPage() {
  const pending = mockGatePasses.filter((p) => p.status === "pending");
  return (
    <ModuleHub title="Visitor Approval" description="Approve or reject gate pass requests." breadcrumbs={[...breadcrumbs, { label: "Approval" }]} tabs={VISITORS_TABS}>
      {pending.length === 0 ? (
        <EmptyState icon={CheckCircle} title="No pending approvals" description="All visitor requests have been processed." />
      ) : (
        <SimpleTable columns={["Pass", "Visitor", "CNIC", "Type", "Host", "Purpose", "Actions"]}
          rows={pending.map((p) => {
            const reg = mockVisitorRegistrations.find((r) => r.visitorName === p.visitorName);
            return [p.passId, p.visitorName, p.cnic, statusBadge(p.passType), p.hostName, reg?.purpose ?? "—", (
              <div key={p.id} className="flex gap-1">
                <MockToastButton label="Approve" message={`${p.passId} approved (demo).`} size="sm" variant="outline" />
                <MockToastButton label="Reject" message={`${p.passId} rejected (demo).`} size="sm" variant="outline" />
              </div>
            )];
          })} />
      )}
    </ModuleHub>
  );
}

export function VisitorsSecurityPage() {
  return (
    <ModuleHub title="Security Dashboard" description="Gate scan logs and live verification." breadcrumbs={[...breadcrumbs, { label: "Security" }]} tabs={VISITORS_TABS}
      actions={<Button asChild variant="outline"><Link href="/visitors/scan"><ScanLine className="mr-2 size-4" />Scan QR</Link></Button>}>
      <div className="mb-4 grid gap-4 sm:grid-cols-3">
        <InfoCard label="Scans today" value={String(visitorStats.securityScansToday)} />
        <InfoCard label="Currently inside" value={String(visitorStats.checkedInNow)} />
        <InfoCard label="Denied/expired" value={String(mockSecurityScans.filter((s) => s.result !== "allowed").length)} />
      </div>
      <SimpleTable columns={["Scan ID", "Pass", "Visitor", "Type", "Gate", "Guard", "Result", "Time"]}
        rows={mockSecurityScans.map((s) => [s.scanId, s.passId, s.visitorName, statusBadge(s.scanType), s.gate, s.guardName, statusBadge(s.result), s.scannedAt])} />
    </ModuleHub>
  );
}

export function VisitorsScanPage() {
  return (
    <ModuleHub title="QR Scan Verification" description="Scan visitor gate pass QR code at security checkpoint." breadcrumbs={[...breadcrumbs, { label: "Scan" }]}>
      <Card className="mx-auto max-w-md">
        <CardHeader><CardTitle>Scan gate pass</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="flex size-64 mx-auto items-center justify-center rounded-xl border-2 border-dashed border-[var(--brand-primary)] bg-[var(--surface-muted)]">
            <ScanLine className="size-32 text-[var(--brand-primary)] animate-pulse" />
          </div>
          <MockActionButton
            label="Simulate scan"
            title="Verify gate pass"
            fields={[
              { name: "qrCode", label: "QR Code", type: "select", options: mockGatePasses.map((p) => p.qrCode), required: true },
              { name: "gate", label: "Gate", type: "select", options: ["Main Gate — University Road", "North Gate", "Hostel Gate"], required: true },
            ]}
            submitLabel="Verify & allow entry"
            successMessage="Scan successful — visitor allowed entry (demo)."
            icon={<ScanLine className="size-4" />}
          />
          <p className="text-center text-sm text-[var(--muted)]">Demo mode — select a QR code to simulate scan result</p>
        </CardContent>
      </Card>
    </ModuleHub>
  );
}

export function ParentVisitorsPage() {
  return (
    <ModuleHub
      title="Parent Pickup Request"
      description="Request authorized pickup for your child from campus."
      breadcrumbs={[{ label: "Parent", href: "/parent/dashboard" }, { label: "Visitor Pickup" }]}
      actions={
        <MockActionButton
          label="Submit pickup request"
          title="Parent pickup request"
          fields={[
            { name: "studentName", label: "Student name", required: true },
            { name: "studentId", label: "Student ID", required: true, placeholder: "CS-2022-0421" },
            { name: "pickupTime", label: "Pickup time", type: "date", required: true },
            { name: "authorizedPerson", label: "Authorized person", required: true },
            { name: "authorizedCnic", label: "Authorized CNIC", required: true, placeholder: "42101-1234567-1" },
          ]}
          submitLabel="Submit request"
          successMessage="Pickup request submitted. You will receive a QR gate pass once approved (demo)."
          icon={<UserPlus className="size-4" />}
        />
      }
    >
      <Card className="mb-6">
        <CardHeader><CardTitle>How it works</CardTitle></CardHeader>
        <CardContent className="text-sm text-[var(--muted)] space-y-2">
          <p>1. Submit a pickup request with authorized person details and CNIC</p>
          <p>2. Security reviews and approves the request</p>
          <p>3. QR gate pass is generated and sent to your registered phone/email</p>
          <p>4. Authorized person scans QR at main gate for entry and exit</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle>Your recent requests</CardTitle></CardHeader>
        <CardContent>
          <SimpleTable
            columns={["Request", "Student", "Pickup Time", "Authorized", "Status"]}
            rows={mockPickupRequests.slice(0, 3).map((p) => [p.requestId, p.studentName, p.pickupTime, p.authorizedPerson, statusBadge(p.status)])}
          />
        </CardContent>
      </Card>
    </ModuleHub>
  );
}
