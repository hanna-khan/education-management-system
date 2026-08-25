"use client";

import Link from "next/link";
import {
  AlertCircle,
  Banknote,
  CreditCard,
  FileText,
  GraduationCap,
  Plus,
  Receipt,
  TrendingUp,
  Wallet,
} from "lucide-react";
import { ModuleHub, InfoCard, SimpleTable } from "@/components/shared/module-hub";
import { KpiCard } from "@/components/shared/kpi-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MockActionButton, MockToastButton, MOCK_FORMS } from "@/components/shared/mock-action";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  feeStats,
  mockInvoices,
  mockPayments,
  mockScholarships,
  scholarshipStats,
  FEES_TABS,
  feeBreakdown,
} from "@/mock/fees";
import { formatCurrency, formatNumber } from "@/lib/utils";

const breadcrumbs = [{ label: "Dashboard", href: "/dashboard" }, { label: "Fees" }];

function feeStatusBadge(status: string) {
  const map: Record<string, "default" | "success" | "warning" | "error" | "info" | "outline"> = {
    paid: "success",
    partial: "warning",
    overdue: "error",
    waived: "info",
    awarded: "success",
    approved: "success",
    under_review: "info",
    rejected: "error",
  };
  return (
    <Badge variant={map[status] ?? "outline"} className="capitalize">
      {status.replace(/_/g, " ")}
    </Badge>
  );
}

const collectionRate = Math.round((feeStats.collected / feeStats.totalBilled) * 100);

export function FeesDashboardPage() {
  return (
    <ModuleHub
      title="Fees"
      description="Monitor billing, collections, invoices, payments, and scholarships."
      breadcrumbs={breadcrumbs}
      tabs={FEES_TABS}
      actions={
        <MockActionButton
          label="Generate invoice"
          fields={MOCK_FORMS.invoice}
          submitLabel="Generate"
          icon={<Plus className="size-4" />}
        />
      }
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          label="Total billed"
          value={formatCurrency(feeStats.totalBilled)}
          change="Fall 2026 semester"
          icon={FileText}
        />
        <KpiCard
          label="Collected"
          value={formatCurrency(feeStats.collected)}
          change={`${collectionRate}% collection rate`}
          changeType="positive"
          icon={Wallet}
        />
        <KpiCard
          label="Outstanding"
          value={formatCurrency(feeStats.outstanding)}
          changeType="neutral"
          icon={Banknote}
        />
        <KpiCard
          label="Overdue"
          value={formatCurrency(feeStats.overdue)}
          change="Requires follow-up"
          changeType="negative"
          icon={AlertCircle}
        />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent invoices</CardTitle>
          </CardHeader>
          <CardContent>
            <SimpleTable
              columns={["Invoice", "Student", "Program", "Total", "Outstanding", "Status"]}
              rows={mockInvoices.map((inv) => [
                <Link key={inv.id} href={`/fees/invoices`} className="font-medium hover:underline">
                  {inv.id}
                </Link>,
                inv.student,
                inv.program,
                formatCurrency(inv.total),
                formatCurrency(inv.outstanding),
                feeStatusBadge(inv.status),
              ])}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Fee breakdown</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {feeBreakdown.map((item) => {
              const pct = Math.round((item.amount / feeBreakdown.reduce((s, f) => s + f.amount, 0)) * 100);
              return (
                <div key={item.head}>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-[var(--muted)]">{item.head}</span>
                    <span className="font-medium">{formatCurrency(item.amount)}</span>
                  </div>
                  <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-[var(--surface-muted)]">
                    <div
                      className="h-full rounded-full bg-[var(--brand-primary)]"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
            <div className="border-t border-[var(--border-subtle)] pt-3">
              <div className="flex items-center justify-between text-sm font-semibold">
                <span>Total per student</span>
                <span>{formatCurrency(feeBreakdown.reduce((s, f) => s + f.amount, 0))}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <InfoCard label="Payments today" value={formatCurrency(127500)} sub="3 transactions recorded" />
        <InfoCard label="Scholarships awarded" value={formatCurrency(scholarshipStats.awardedAmount)} sub={`${scholarshipStats.approved} approved this semester`} />
        <InfoCard label="Defaulters" value={formatNumber(186)} sub={`${formatCurrency(feeStats.overdue)} overdue amount`} />
      </div>
    </ModuleHub>
  );
}

export function FeesStudentsPage() {
  const studentRows = mockInvoices.map((inv) => [
    inv.student,
    inv.program,
    inv.semester,
    formatCurrency(inv.total),
    formatCurrency(inv.paid),
    formatCurrency(inv.outstanding),
    feeStatusBadge(inv.status),
  ]);

  return (
    <ModuleHub
      title="Student Fees"
      description="View fee status and outstanding balances by student."
      breadcrumbs={[...breadcrumbs.slice(0, -1), { label: "Fees", href: "/fees" }, { label: "Student Fees" }]}
      tabs={FEES_TABS}
      actions={
        <MockToastButton label="Export ledger" message="Ledger exported (demo)." />
      }
    >
      <div className="mb-6 grid gap-4 sm:grid-cols-4">
        <InfoCard label="Fully paid" value={mockInvoices.filter((i) => i.status === "paid").length} sub="Students" />
        <InfoCard label="Partial payment" value={mockInvoices.filter((i) => i.status === "partial").length} sub="Students" />
        <InfoCard label="Overdue" value={mockInvoices.filter((i) => i.status === "overdue").length} sub="Students" />
        <InfoCard label="Waived / scholarship" value={mockInvoices.filter((i) => i.status === "waived").length} sub="Students" />
      </div>
      <SimpleTable
        columns={["Student", "Program", "Semester", "Total", "Paid", "Outstanding", "Status"]}
        rows={studentRows}
      />
    </ModuleHub>
  );
}

export function FeesInvoicesPage() {
  return (
    <ModuleHub
      title="Invoices"
      description="Manage and track all fee invoices across programs."
      breadcrumbs={[...breadcrumbs.slice(0, -1), { label: "Fees", href: "/fees" }, { label: "Invoices" }]}
      tabs={FEES_TABS}
      actions={
        <MockActionButton
          label="New invoice"
          fields={MOCK_FORMS.invoice}
          submitLabel="Create invoice"
          icon={<Plus className="size-4" />}
        />
      }
    >
      <SimpleTable
        columns={["Invoice ID", "Student", "Program", "Semester", "Total", "Paid", "Outstanding", "Status"]}
        rows={mockInvoices.map((inv) => [
          inv.id,
          inv.student,
          inv.program,
          inv.semester,
          formatCurrency(inv.total),
          formatCurrency(inv.paid),
          formatCurrency(inv.outstanding),
          feeStatusBadge(inv.status),
        ])}
      />
    </ModuleHub>
  );
}

export function FeesPaymentsPage() {
  return (
    <ModuleHub
      title="Payments"
      description="Record and reconcile fee payments and receipts."
      breadcrumbs={[...breadcrumbs.slice(0, -1), { label: "Fees", href: "/fees" }, { label: "Payments" }]}
      tabs={FEES_TABS}
      actions={
        <MockActionButton
          label="Record payment"
          fields={MOCK_FORMS.payment}
          submitLabel="Record"
          icon={<Receipt className="size-4" />}
        />
      }
    >
      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <KpiCard
          label="Total received"
          value={formatCurrency(mockPayments.reduce((s, p) => s + p.amount, 0))}
          icon={CreditCard}
        />
        <KpiCard label="Transactions" value={mockPayments.length} icon={Receipt} />
        <KpiCard label="Avg. payment" value={formatCurrency(Math.round(mockPayments.reduce((s, p) => s + p.amount, 0) / mockPayments.length))} icon={TrendingUp} />
      </div>
      <SimpleTable
        columns={["Payment ID", "Student", "Amount", "Method", "Date", "Receipt"]}
        rows={mockPayments.map((pay) => [
          pay.id,
          pay.student,
          formatCurrency(pay.amount),
          pay.method,
          pay.date,
          <span key={pay.receipt} className="font-mono text-xs">{pay.receipt}</span>,
        ])}
      />
    </ModuleHub>
  );
}

export function FeesScholarshipsPage() {
  return (
    <ModuleHub
      title="Scholarships"
      description="Review scholarship applications, approvals, and disbursements."
      breadcrumbs={[...breadcrumbs.slice(0, -1), { label: "Fees", href: "/fees" }, { label: "Scholarships" }]}
      tabs={FEES_TABS}
      actions={
        <MockActionButton
          label="New application"
          title="Scholarship application"
          fields={MOCK_FORMS.application}
          submitLabel="Submit"
          icon={<GraduationCap className="size-4" />}
        />
      }
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <KpiCard label="Applications" value={scholarshipStats.applications} icon={FileText} />
        <KpiCard label="Under review" value={scholarshipStats.underReview} icon={AlertCircle} />
        <KpiCard label="Approved" value={scholarshipStats.approved} changeType="positive" icon={TrendingUp} />
        <KpiCard label="Rejected" value={scholarshipStats.rejected} changeType="negative" icon={AlertCircle} />
        <KpiCard label="Awarded amount" value={formatCurrency(scholarshipStats.awardedAmount)} icon={Wallet} />
      </div>
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Scholarship records</CardTitle>
        </CardHeader>
        <CardContent>
          <SimpleTable
            columns={["Student", "Type", "Amount", "Semester", "Status"]}
            rows={mockScholarships.map((sch) => [
              sch.student,
              sch.type,
              formatCurrency(sch.amount),
              sch.semester,
              feeStatusBadge(sch.status),
            ])}
          />
        </CardContent>
      </Card>
    </ModuleHub>
  );
}
