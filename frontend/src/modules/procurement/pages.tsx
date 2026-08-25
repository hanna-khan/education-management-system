"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  ClipboardList,
  FileText,
  History,
  PackageCheck,
  Plus,
  ShoppingCart,
  Truck,
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
  PROCUREMENT_TABS,
  PROCUREMENT_WORKFLOW,
  getProcurementTimeline,
  getPurchaseRequest,
  mockGoodsReceived,
  mockProcurementHistory,
  mockPurchaseOrders,
  mockPurchaseRequests,
  mockQuotations,
  mockVendors,
  procurementStats,
} from "@/mock/procurement";
import { formatCurrency, formatNumber } from "@/lib/utils";

const breadcrumbs = [{ label: "Dashboard", href: "/dashboard" }, { label: "Procurement" }];

function statusBadge(status: string) {
  const map: Record<string, "default" | "success" | "warning" | "error" | "info" | "outline"> = {
    draft: "outline",
    submitted: "info",
    dept_approved: "info",
    procurement_review: "warning",
    quoted: "info",
    ordered: "warning",
    received: "success",
    rejected: "error",
    cancelled: "outline",
    active: "success",
    inactive: "outline",
    pending: "warning",
    selected: "success",
    issued: "info",
    partial: "warning",
    delivered: "success",
    good: "success",
    damaged: "error",
    pending_inspection: "warning",
    accepted: "success",
    normal: "outline",
    urgent: "warning",
    critical: "error",
  };
  return (
    <Badge variant={map[status] ?? "outline"} className="capitalize">
      {status.replace(/_/g, " ")}
    </Badge>
  );
}

export function ProcurementDashboardPage() {
  return (
    <ModuleHub
      title="Procurement"
      description="Purchase requests, quotations, POs, and goods receiving — NED University."
      breadcrumbs={breadcrumbs}
      tabs={PROCUREMENT_TABS}
      actions={
        <MockActionButton
          label="New purchase request"
          fields={[
            { name: "title", label: "Title", required: true },
            { name: "department", label: "Department", required: true },
            { name: "items", label: "Items description", type: "textarea", required: true },
            { name: "cost", label: "Estimated cost (PKR)", type: "number", required: true },
          ]}
          submitLabel="Submit request"
          icon={<Plus className="size-4" />}
        />
      }
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Open requests" value={procurementStats.openRequests} icon={ClipboardList} />
        <KpiCard label="Pending approval" value={procurementStats.pendingApproval} icon={Users} changeType="negative" />
        <KpiCard label="Active orders" value={procurementStats.activeOrders} icon={ShoppingCart} />
        <KpiCard label="Received this month" value={procurementStats.receivedThisMonth} icon={PackageCheck} changeType="positive" />
      </div>
      <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Spend YTD" value={formatCurrency(procurementStats.totalSpendYtd)} icon={FileText} />
        <KpiCard label="Active vendors" value={procurementStats.activeVendors} icon={Truck} />
        <KpiCard label="Avg processing" value={`${procurementStats.avgProcessingDays} days`} icon={History} />
        <KpiCard label="Quotations pending" value={String(mockQuotations.filter((q) => q.status === "pending").length)} icon={FileText} />
      </div>

      <Card className="mt-6">
        <CardHeader><CardTitle>Procurement workflow</CardTitle></CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-center gap-2 text-sm">
            {PROCUREMENT_WORKFLOW.map((step, i) => (
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
            <CardTitle>Pending requests</CardTitle>
            <Button asChild size="sm" variant="outline"><Link href="/procurement/requests">All requests</Link></Button>
          </CardHeader>
          <CardContent>
            <SimpleTable
              columns={["Request", "Department", "Cost", "Status", ""]}
              rows={mockPurchaseRequests.filter((r) => !["received", "rejected", "cancelled"].includes(r.status)).map((r) => [
                <Link key={r.id} href={`/procurement/requests/${r.id}`} className="font-medium hover:underline">{r.requestId}</Link>,
                r.department,
                formatCurrency(r.estimatedCost),
                statusBadge(r.status),
                null,
              ])}
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Recent purchase orders</CardTitle></CardHeader>
          <CardContent>
            <SimpleTable
              columns={["PO", "Vendor", "Amount", "Status"]}
              rows={mockPurchaseOrders.map((o) => [o.poId, o.vendor, formatCurrency(o.amount), statusBadge(o.status)])}
            />
          </CardContent>
        </Card>
      </div>
      <Card className="mt-6">
        <CardHeader><CardTitle>Procurement policy summary</CardTitle></CardHeader>
        <CardContent className="space-y-2 text-sm text-[var(--muted)]">
          <p>• Requests above PKR 500,000 require VC approval</p>
          <p>• Minimum 3 quotations for purchases above PKR 100,000</p>
          <p>• Single vendor justification required for proprietary items</p>
          <p>• GRN must be recorded within 3 days of delivery</p>
        </CardContent>
      </Card>
    </ModuleHub>
  );
}

export function ProcurementRequestsPage() {
  const [filter, setFilter] = useState("all");
  const filtered = useMemo(() => filter === "all" ? mockPurchaseRequests : mockPurchaseRequests.filter((r) => r.status === filter), [filter]);
  return (
    <ModuleHub title="Purchase Requests" description="Department purchase requisitions." breadcrumbs={[...breadcrumbs, { label: "Requests" }]} tabs={PROCUREMENT_TABS}
      actions={<MockActionButton label="New request" fields={[{ name: "title", label: "Title", required: true }, { name: "department", label: "Department", required: true }]} submitLabel="Create" icon={<Plus className="size-4" />} />}>
      <div className="mb-4 flex flex-wrap gap-2">
        {["all", "draft", "submitted", "quoted", "ordered", "received"].map((s) => (
          <Button key={s} size="sm" variant={filter === s ? "default" : "outline"} onClick={() => setFilter(s)} className="capitalize">{s}</Button>
        ))}
      </div>
      {filtered.length === 0 ? <EmptyState icon={ClipboardList} title="No requests" description="No requests match filter." /> : (
        <SimpleTable columns={["Request ID", "Title", "Department", "Requested By", "Items", "Est. Cost", "Urgency", "Status", ""]}
          rows={filtered.map((r) => [r.requestId, r.title, r.department, r.requestedBy, r.items.slice(0, 30) + "…", formatCurrency(r.estimatedCost), statusBadge(r.urgency), statusBadge(r.status), <Button key={r.id} asChild size="sm" variant="outline"><Link href={`/procurement/requests/${r.id}`}>View</Link></Button>])} />
      )}
    </ModuleHub>
  );
}

export function ProcurementRequestDetailPage({ id }: { id: string }) {
  const request = getPurchaseRequest(id);
  const timeline = getProcurementTimeline(id);
  if (!request) {
    return (
      <ModuleHub title="Request not found" breadcrumbs={[...breadcrumbs, { label: "Requests", href: "/procurement/requests" }, { label: id }]} tabs={PROCUREMENT_TABS}>
        <EmptyState icon={ClipboardList} title="Request not found" description={`No purchase request found for ID: ${id}`} />
      </ModuleHub>
    );
  }
  const relatedQuotes = mockQuotations.filter((q) => q.requestId === request.requestId);
  const relatedPO = mockPurchaseOrders.find((o) => o.requestId === request.requestId);
  return (
    <ModuleHub title={request.requestId} description={request.title} breadcrumbs={[...breadcrumbs, { label: "Requests", href: "/procurement/requests" }, { label: request.requestId }]} tabs={PROCUREMENT_TABS}
      actions={<MockToastButton label="Approve" message="Request approved (demo)." />}>
      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <InfoCard label="Department" value={request.department} />
        <InfoCard label="Requested by" value={request.requestedBy} />
        <InfoCard label="Estimated cost" value={formatCurrency(request.estimatedCost)} />
        <InfoCard label="Status" value={request.status.replace(/_/g, " ")} />
      </div>
      <Card className="mb-6">
        <CardHeader><CardTitle>Workflow progress</CardTitle></CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-center gap-2 text-sm">
            {timeline.map((t) => (
              <div key={t.stage} className="flex items-center gap-2">
                {PROCUREMENT_WORKFLOW.indexOf(t.stage) > 0 ? <span className="text-[var(--muted)]">→</span> : null}
                <Badge variant={t.current ? "default" : t.completed ? "success" : "outline"}>{t.stage}</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      <Card className="mb-6">
        <CardHeader><CardTitle>Request details</CardTitle></CardHeader>
        <CardContent className="text-sm space-y-2">
          <p><strong>Items:</strong> {request.items}</p>
          <p><strong>Submitted:</strong> {request.submittedAt}</p>
          <p><strong>Urgency:</strong> {statusBadge(request.urgency)}</p>
        </CardContent>
      </Card>
      {relatedQuotes.length > 0 && (
        <Card className="mb-6">
          <CardHeader><CardTitle>Quotations</CardTitle></CardHeader>
          <CardContent>
            <SimpleTable columns={["Quote ID", "Vendor", "Amount", "Valid Until", "Status"]}
              rows={relatedQuotes.map((q) => [q.quoteId, q.vendor, formatCurrency(q.amount), q.validUntil, statusBadge(q.status)])} />
          </CardContent>
        </Card>
      )}
      {relatedPO && (
        <Card>
          <CardHeader><CardTitle>Purchase Order</CardTitle></CardHeader>
          <CardContent>
            <SimpleTable columns={["PO ID", "Vendor", "Amount", "Issued", "Expected", "Status"]}
              rows={[[relatedPO.poId, relatedPO.vendor, formatCurrency(relatedPO.amount), relatedPO.issuedAt, relatedPO.expectedDelivery, statusBadge(relatedPO.status)]]} />
          </CardContent>
        </Card>
      )}
    </ModuleHub>
  );
}

export function ProcurementVendorsPage() {
  return (
    <ModuleHub title="Vendors" description="Approved procurement vendors." breadcrumbs={[...breadcrumbs, { label: "Vendors" }]} tabs={PROCUREMENT_TABS}
      actions={<MockActionButton label="Add vendor" fields={[{ name: "name", label: "Company", required: true }, { name: "contact", label: "Contact", required: true }, { name: "taxNumber", label: "NTN", required: true }]} submitLabel="Add" />}>
      <SimpleTable columns={["Vendor ID", "Name", "Contact", "Phone", "City", "Categories", "NTN", "Rating", "Status"]}
        rows={mockVendors.map((v) => [v.vendorId, v.name, v.contact, v.phone, v.city, v.categories.join(", "), v.taxNumber, v.rating ? `${v.rating}/5` : "—", statusBadge(v.status)])} />
    </ModuleHub>
  );
}

export function ProcurementQuotationsPage() {
  return (
    <ModuleHub title="Quotations" description="Vendor quotations for purchase requests." breadcrumbs={[...breadcrumbs, { label: "Quotations" }]} tabs={PROCUREMENT_TABS}>
      <SimpleTable columns={["Quote ID", "Request", "Vendor", "Amount", "Submitted", "Valid Until", "Status", ""]}
        rows={mockQuotations.map((q) => [q.quoteId, q.requestId, q.vendor, formatCurrency(q.amount), q.submittedAt, q.validUntil, statusBadge(q.status), q.status === "pending" ? <MockToastButton key={q.id} label="Select" message={`${q.quoteId} selected (demo).`} size="sm" variant="outline" /> : null])} />
    </ModuleHub>
  );
}

export function ProcurementOrdersPage() {
  return (
    <ModuleHub title="Purchase Orders" description="Issued purchase orders." breadcrumbs={[...breadcrumbs, { label: "Orders" }]} tabs={PROCUREMENT_TABS}
      actions={<MockToastButton label="Issue PO" message="Purchase order issued (demo)." icon={<ShoppingCart className="size-4" />} />}>
      <SimpleTable columns={["PO ID", "Request", "Vendor", "Amount", "Issued", "Expected Delivery", "Status"]}
        rows={mockPurchaseOrders.map((o) => [o.poId, o.requestId, o.vendor, formatCurrency(o.amount), o.issuedAt, o.expectedDelivery, statusBadge(o.status)])} />
    </ModuleHub>
  );
}

export function ProcurementReceivingPage() {
  return (
    <ModuleHub title="Goods Received" description="GRN — goods receipt notes." breadcrumbs={[...breadcrumbs, { label: "Receiving" }]} tabs={PROCUREMENT_TABS}
      actions={<MockActionButton label="Record receipt" fields={[{ name: "poId", label: "PO ID", type: "select", options: mockPurchaseOrders.map((o) => o.poId), required: true }, { name: "condition", label: "Condition", type: "select", options: ["good", "partial", "damaged"], required: true }]} submitLabel="Record" icon={<PackageCheck className="size-4" />} />}>
      <SimpleTable columns={["GRN ID", "PO", "Vendor", "Items", "Received", "By", "Condition", "Status"]}
        rows={mockGoodsReceived.map((g) => [g.grnId, g.poId, g.vendor, g.items, g.receivedAt, g.receivedBy, statusBadge(g.condition), statusBadge(g.status)])} />
    </ModuleHub>
  );
}

export function ProcurementHistoryPage() {
  return (
    <ModuleHub title="Procurement History" description="Completed procurement cycles." breadcrumbs={[...breadcrumbs, { label: "History" }]} tabs={PROCUREMENT_TABS}>
      <SimpleTable columns={["Request", "Title", "Department", "Final Amount", "Vendor", "Completed", "Duration"]}
        rows={mockProcurementHistory.map((h) => [h.requestId, h.title, h.department, formatCurrency(h.finalAmount), h.vendor, h.completedAt, `${h.durationDays} days`])} />
    </ModuleHub>
  );
}
