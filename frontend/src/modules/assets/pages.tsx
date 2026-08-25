"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  Archive,
  BarChart3,
  Boxes,
  Laptop,
  Plus,
  Trash2,
  Wrench,
} from "lucide-react";
import { ModuleHub, InfoCard, SimpleTable } from "@/components/shared/module-hub";
import { KpiCard } from "@/components/shared/kpi-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/shared/empty-state";
import { MockActionButton, MockToastButton } from "@/components/shared/mock-action";
import {
  ASSETS_TABS,
  assetStats,
  mockAssetCategories,
  mockAssetMaintenance,
  mockAssets,
  mockDisposedAssets,
} from "@/mock/assets";
import { formatCurrency, formatNumber } from "@/lib/utils";

const breadcrumbs = [{ label: "Dashboard", href: "/dashboard" }, { label: "Asset Management" }];

function statusBadge(status: string) {
  const map: Record<string, "default" | "success" | "warning" | "error" | "info" | "outline"> = {
    active: "success",
    under_maintenance: "warning",
    lost: "error",
    damaged: "error",
    disposed: "outline",
    excellent: "success",
    good: "info",
    fair: "warning",
    poor: "error",
    scheduled: "info",
    in_progress: "warning",
    completed: "success",
    cancelled: "outline",
    preventive: "info",
    corrective: "warning",
    calibration: "default",
    auction: "info",
    scrap: "outline",
    donation: "success",
    transfer: "default",
  };
  return (
    <Badge variant={map[status] ?? "outline"} className="capitalize">
      {status.replace(/_/g, " ")}
    </Badge>
  );
}

export function AssetsDashboardPage() {
  return (
    <ModuleHub
      title="Asset Management"
      description="Track fixed assets — computers, lab equipment, furniture, vehicles across NED campus."
      breadcrumbs={breadcrumbs}
      tabs={ASSETS_TABS}
      actions={
        <MockActionButton
          label="Register asset"
          fields={[
            { name: "name", label: "Asset name", required: true },
            { name: "category", label: "Category", type: "select", options: mockAssetCategories.map((c) => c.name), required: true },
            { name: "cost", label: "Cost (PKR)", type: "number", required: true },
            { name: "location", label: "Location", required: true },
          ]}
          submitLabel="Register"
          icon={<Plus className="size-4" />}
        />
      }
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Total assets" value={formatNumber(assetStats.totalAssets)} icon={Boxes} />
        <KpiCard label="Active" value={formatNumber(assetStats.activeAssets)} icon={Laptop} changeType="positive" />
        <KpiCard label="Under maintenance" value={assetStats.underMaintenance} icon={Wrench} changeType="negative" />
        <KpiCard label="Total value" value={formatCurrency(assetStats.totalValue)} icon={BarChart3} />
      </div>
      <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Warranty expiring" value={assetStats.warrantyExpiring} icon={Archive} changeType="negative" />
        <KpiCard label="Assigned to staff" value={formatNumber(assetStats.assignedToStaff)} icon={Laptop} />
        <KpiCard label="Disposed (YTD)" value={assetStats.disposedThisYear} icon={Trash2} />
        <KpiCard label="Categories" value={mockAssetCategories.length} icon={Boxes} />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Assets by status</CardTitle>
            <Button asChild size="sm" variant="outline"><Link href="/assets/register">Asset register</Link></Button>
          </CardHeader>
          <CardContent>
            <SimpleTable
              columns={["Status", "Count"]}
              rows={[
                ["Active", String(mockAssets.filter((a) => a.status === "active").length)],
                ["Under Maintenance", String(mockAssets.filter((a) => a.status === "under_maintenance").length)],
                ["Damaged", String(mockAssets.filter((a) => a.status === "damaged").length)],
                ["Lost", String(mockAssets.filter((a) => a.status === "lost").length)],
              ]}
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Upcoming maintenance</CardTitle></CardHeader>
          <CardContent>
            <SimpleTable
              columns={["Ticket", "Asset", "Type", "Date", "Status"]}
              rows={mockAssetMaintenance.filter((m) => m.status !== "completed").map((m) => [m.ticketId, m.assetName.slice(0, 30) + "…", statusBadge(m.type), m.scheduledDate, statusBadge(m.status)])}
            />
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader><CardTitle>Asset categories</CardTitle></CardHeader>
        <CardContent>
          <SimpleTable
            columns={["Category", "Count", "Total Value", "Depreciation (years)"]}
            rows={mockAssetCategories.map((c) => [c.name, String(c.assetCount), formatCurrency(c.totalValue), String(c.depreciationYears)])}
          />
        </CardContent>
      </Card>
      <Card className="mt-6">
        <CardHeader><CardTitle>Asset tagging policy</CardTitle></CardHeader>
        <CardContent className="space-y-2 text-sm text-[var(--muted)]">
          <p>• All assets above PKR 10,000 must be tagged with NED-AST barcode</p>
          <p>• Annual physical verification in June — departments responsible for assigned assets</p>
          <p>• Lost assets reported within 48 hours to administration</p>
          <p>• Warranty documents stored in asset register attachments</p>
        </CardContent>
      </Card>
    </ModuleHub>
  );
}

export function AssetsRegisterPage() {
  const [filter, setFilter] = useState("all");
  const filtered = useMemo(() => filter === "all" ? mockAssets : mockAssets.filter((a) => a.status === filter), [filter]);
  return (
    <ModuleHub title="Asset Register" description="Complete asset registry with ID, cost, location, and assignment." breadcrumbs={[...breadcrumbs, { label: "Register" }]} tabs={ASSETS_TABS}
      actions={<MockActionButton label="Register asset" fields={[{ name: "name", label: "Name", required: true }, { name: "serial", label: "Serial number", required: true }]} submitLabel="Register" icon={<Plus className="size-4" />} />}>
      <div className="mb-4 flex flex-wrap gap-2">
        {["all", "active", "under_maintenance", "damaged", "lost", "disposed"].map((s) => (
          <Button key={s} size="sm" variant={filter === s ? "default" : "outline"} onClick={() => setFilter(s)} className="capitalize">{s.replace(/_/g, " ")}</Button>
        ))}
      </div>
      {filtered.length === 0 ? <EmptyState icon={Boxes} title="No assets" description="No assets match filter." /> : (
        <SimpleTable columns={["Asset ID", "Name", "Category", "Purchase", "Cost", "Location", "Assigned", "Condition", "Warranty", "Status"]}
          rows={filtered.map((a) => [a.assetId, a.name, a.category, a.purchaseDate, formatCurrency(a.cost), a.location, a.assignedTo ?? "—", statusBadge(a.condition), a.warrantyUntil ?? "—", statusBadge(a.status)])} />
      )}
    </ModuleHub>
  );
}

export function AssetsCategoriesPage() {
  return (
    <ModuleHub title="Categories" description="Asset classification and depreciation." breadcrumbs={[...breadcrumbs, { label: "Categories" }]} tabs={ASSETS_TABS}>
      <SimpleTable columns={["Code", "Category", "Assets", "Total Value", "Depreciation Years"]}
        rows={mockAssetCategories.map((c) => [c.code, c.name, String(c.assetCount), formatCurrency(c.totalValue), String(c.depreciationYears)])} />
    </ModuleHub>
  );
}

export function AssetsMaintenancePage() {
  return (
    <ModuleHub title="Asset Maintenance" description="Preventive and corrective maintenance schedule." breadcrumbs={[...breadcrumbs, { label: "Maintenance" }]} tabs={ASSETS_TABS}
      actions={<MockActionButton label="Schedule maintenance" fields={[{ name: "assetId", label: "Asset ID", type: "select", options: mockAssets.map((a) => a.assetId), required: true }, { name: "type", label: "Type", type: "select", options: ["preventive", "corrective", "calibration"], required: true }, { name: "date", label: "Date", type: "date", required: true }]} submitLabel="Schedule" icon={<Wrench className="size-4" />} />}>
      <SimpleTable columns={["Ticket", "Asset ID", "Asset", "Type", "Scheduled", "Vendor", "Cost", "Status"]}
        rows={mockAssetMaintenance.map((m) => [m.ticketId, m.assetId, m.assetName.slice(0, 35) + "…", statusBadge(m.type), m.scheduledDate, m.vendor ?? "—", m.cost ? formatCurrency(m.cost) : "—", statusBadge(m.status)])} />
    </ModuleHub>
  );
}

export function AssetsDisposedPage() {
  return (
    <ModuleHub title="Disposed Assets" description="Asset disposal history." breadcrumbs={[...breadcrumbs, { label: "Disposed" }]} tabs={ASSETS_TABS}>
      <SimpleTable columns={["Asset ID", "Name", "Category", "Disposed", "Method", "Original Cost", "Recovered", "Approved By"]}
        rows={mockDisposedAssets.map((d) => [d.assetId, d.name, d.category, d.disposedDate, statusBadge(d.disposalMethod), formatCurrency(d.originalCost), formatCurrency(d.recoveredValue), d.approvedBy])} />
    </ModuleHub>
  );
}

export function AssetsReportsPage() {
  return (
    <ModuleHub title="Asset Reports" description="Depreciation, valuation, and audit reports." breadcrumbs={[...breadcrumbs, { label: "Reports" }]} tabs={ASSETS_TABS}
      actions={<MockToastButton label="Generate report" message="Asset report generated (demo)." icon={<BarChart3 className="size-4" />} />}>
      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Available reports</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {["Asset register summary", "Depreciation schedule", "Warranty expiry list", "Maintenance cost analysis", "Category-wise valuation"].map((r) => (
              <div key={r} className="flex items-center justify-between rounded-lg border border-[var(--border-subtle)] p-3 text-sm">
                <span>{r}</span>
                <MockToastButton label="Generate" message={`${r} generated (demo).`} size="sm" variant="outline" />
              </div>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Summary</CardTitle></CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex justify-between border-b py-2"><span>Total asset value</span><span className="font-medium">{formatCurrency(assetStats.totalValue)}</span></div>
            <div className="flex justify-between border-b py-2"><span>Active assets</span><span className="font-medium">{formatNumber(assetStats.activeAssets)}</span></div>
            <div className="flex justify-between py-2"><span>Disposed this year</span><span className="font-medium">{assetStats.disposedThisYear}</span></div>
          </CardContent>
        </Card>
      </div>
    </ModuleHub>
  );
}
