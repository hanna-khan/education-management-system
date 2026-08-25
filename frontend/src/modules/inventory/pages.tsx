"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  AlertTriangle,
  ArrowRightLeft,
  Boxes,
  MapPin,
  Package2,
  Plus,
  Truck,
  Warehouse,
} from "lucide-react";
import { ModuleHub, InfoCard, SimpleTable } from "@/components/shared/module-hub";
import { KpiCard } from "@/components/shared/kpi-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/shared/empty-state";
import { MockActionButton, MockToastButton } from "@/components/shared/mock-action";
import {
  INVENTORY_TABS,
  inventoryStats,
  lowStockItems,
  mockDamagedItems,
  mockInventoryCategories,
  mockInventoryItems,
  mockInventoryLocations,
  mockInventorySuppliers,
  mockStockMovements,
} from "@/mock/inventory";
import { formatCurrency, formatNumber } from "@/lib/utils";

const breadcrumbs = [{ label: "Dashboard", href: "/dashboard" }, { label: "Inventory" }];

function statusBadge(status: string) {
  const map: Record<string, "default" | "success" | "warning" | "error" | "info" | "outline"> = {
    in_stock: "success",
    low_stock: "warning",
    out_of_stock: "error",
    discontinued: "outline",
    active: "success",
    inactive: "outline",
    blacklisted: "error",
    receipt: "success",
    issue: "warning",
    transfer: "info",
    adjustment: "outline",
    return: "info",
    damage: "error",
    pending: "warning",
    written_off: "error",
    repaired: "success",
    good: "success",
    fair: "warning",
    damaged: "error",
    expired: "error",
  };
  return (
    <Badge variant={map[status] ?? "outline"} className="capitalize">
      {status.replace(/_/g, " ")}
    </Badge>
  );
}

export function InventoryDashboardPage() {
  return (
    <ModuleHub
      title="Inventory Management"
      description="Central store and departmental inventory — NED University, Karachi campus."
      breadcrumbs={breadcrumbs}
      tabs={INVENTORY_TABS}
      actions={
        <MockActionButton
          label="Add item"
          fields={[
            { name: "name", label: "Item name", required: true },
            { name: "sku", label: "SKU", required: true },
            { name: "category", label: "Category", type: "select", options: mockInventoryCategories.map((c) => c.name), required: true },
            { name: "reorderLevel", label: "Reorder level", type: "number", required: true },
          ]}
          submitLabel="Add item"
          icon={<Plus className="size-4" />}
        />
      }
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Total items" value={formatNumber(inventoryStats.totalItems)} icon={Package2} />
        <KpiCard label="Categories" value={inventoryStats.totalCategories} icon={Boxes} />
        <KpiCard label="Stock value" value={formatCurrency(inventoryStats.totalStockValue)} icon={Warehouse} />
        <KpiCard label="Low stock items" value={inventoryStats.lowStockItems} icon={AlertTriangle} changeType="negative" />
      </div>
      <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Damaged items" value={inventoryStats.damagedItems} icon={AlertTriangle} changeType="negative" />
        <KpiCard label="Pending movements" value={inventoryStats.pendingMovements} icon={ArrowRightLeft} />
        <KpiCard label="Active suppliers" value={inventoryStats.activeSuppliers} icon={Truck} />
        <KpiCard label="Locations" value={inventoryStats.locations} icon={MapPin} />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Low stock alert</CardTitle>
            <Button asChild size="sm" variant="outline"><Link href="/inventory/low-stock">View all</Link></Button>
          </CardHeader>
          <CardContent>
            <SimpleTable
              columns={["SKU", "Item", "Stock", "Reorder", "Location"]}
              rows={lowStockItems.map((i) => [i.sku, i.name, String(i.currentStock), String(i.reorderLevel), i.location])}
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent movements</CardTitle>
            <Button asChild size="sm" variant="outline"><Link href="/inventory/movements">All movements</Link></Button>
          </CardHeader>
          <CardContent>
            <SimpleTable
              columns={["ID", "Type", "Item", "Qty", "Date"]}
              rows={mockStockMovements.slice(0, 5).map((m) => [m.movementId, statusBadge(m.type), m.itemName, String(m.quantity), m.date])}
            />
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader><CardTitle>Stock by department</CardTitle></CardHeader>
        <CardContent>
          <SimpleTable
            columns={["Department", "Items", "Sample location"]}
            rows={mockInventoryCategories.map((c) => [c.department, String(c.itemCount), c.name])}
          />
        </CardContent>
      </Card>
      <Card className="mt-6">
        <CardHeader><CardTitle>Store policies — NED Karachi</CardTitle></CardHeader>
        <CardContent className="space-y-2 text-sm text-[var(--muted)]">
          <p>• All issues require department head approval for items above PKR 5,000</p>
          <p>• Chemical reagents: MSDS required before storage</p>
          <p>• Monthly stock take mandatory for central store</p>
          <p>• Low stock auto-alerts sent to procurement module</p>
        </CardContent>
      </Card>
    </ModuleHub>
  );
}

export function InventoryItemsPage() {
  return (
    <ModuleHub title="Items" description="Inventory item master list." breadcrumbs={[...breadcrumbs, { label: "Items" }]} tabs={INVENTORY_TABS}
      actions={<MockActionButton label="Add item" fields={[{ name: "name", label: "Name", required: true }, { name: "sku", label: "SKU", required: true }]} submitLabel="Add" icon={<Plus className="size-4" />} />}>
      <SimpleTable
        columns={["SKU", "Name", "Category", "Unit", "Stock", "Reorder", "Unit Cost", "Location", "Dept", "Status"]}
        rows={mockInventoryItems.map((i) => [i.sku, i.name, i.category, i.unit, String(i.currentStock), String(i.reorderLevel), formatCurrency(i.unitCost), i.location, i.department, statusBadge(i.status)])}
      />
    </ModuleHub>
  );
}

export function InventoryCategoriesPage() {
  return (
    <ModuleHub title="Categories" description="Inventory category hierarchy." breadcrumbs={[...breadcrumbs, { label: "Categories" }]} tabs={INVENTORY_TABS}>
      <SimpleTable columns={["Code", "Name", "Description", "Department", "Items"]}
        rows={mockInventoryCategories.map((c) => [c.code, c.name, c.description, c.department, String(c.itemCount)])} />
    </ModuleHub>
  );
}

export function InventoryStockPage() {
  return (
    <ModuleHub title="Stock Levels" description="Current stock across all items." breadcrumbs={[...breadcrumbs, { label: "Stock" }]} tabs={INVENTORY_TABS}
      actions={<MockActionButton label="Stock adjustment" fields={[{ name: "sku", label: "SKU", type: "select", options: mockInventoryItems.map((i) => i.sku), required: true }, { name: "qty", label: "Adjustment (+/-)", type: "number", required: true }, { name: "reason", label: "Reason", type: "textarea", required: true }]} submitLabel="Adjust" />}>
      <div className="mb-4 grid gap-4 sm:grid-cols-3">
        <InfoCard label="In stock" value={String(mockInventoryItems.filter((i) => i.status === "in_stock").length)} />
        <InfoCard label="Low stock" value={String(mockInventoryItems.filter((i) => i.status === "low_stock").length)} />
        <InfoCard label="Out of stock" value={String(mockInventoryItems.filter((i) => i.status === "out_of_stock").length)} />
      </div>
      <SimpleTable columns={["SKU", "Item", "Current", "Reorder", "Value", "Last restocked", "Status"]}
        rows={mockInventoryItems.map((i) => [i.sku, i.name, String(i.currentStock), String(i.reorderLevel), formatCurrency(i.currentStock * i.unitCost), i.lastRestocked, statusBadge(i.status)])} />
    </ModuleHub>
  );
}

export function InventoryLocationsPage() {
  return (
    <ModuleHub title="Locations" description="Store locations across campus." breadcrumbs={[...breadcrumbs, { label: "Locations" }]} tabs={INVENTORY_TABS}>
      <SimpleTable columns={["Code", "Name", "Building", "Floor", "Department", "Items", "Capacity"]}
        rows={mockInventoryLocations.map((l) => [l.code, l.name, l.building, l.floor, l.department, String(l.itemCount), l.capacity])} />
    </ModuleHub>
  );
}

export function InventorySuppliersPage() {
  return (
    <ModuleHub title="Suppliers" description="Approved vendors for inventory procurement." breadcrumbs={[...breadcrumbs, { label: "Suppliers" }]} tabs={INVENTORY_TABS}
      actions={<MockActionButton label="Add supplier" fields={[{ name: "name", label: "Company name", required: true }, { name: "contact", label: "Contact person", required: true }, { name: "phone", label: "Phone", required: true }]} submitLabel="Add" />}>
      <SimpleTable columns={["Code", "Name", "Contact", "Phone", "City", "Categories", "Rating", "Status"]}
        rows={mockInventorySuppliers.map((s) => [s.code, s.name, s.contact, s.phone, s.city, s.categories.join(", "), `${s.rating}/5`, statusBadge(s.status)])} />
    </ModuleHub>
  );
}

export function InventoryMovementsPage() {
  const [filter, setFilter] = useState("all");
  const filtered = useMemo(() => filter === "all" ? mockStockMovements : mockStockMovements.filter((m) => m.type === filter), [filter]);
  return (
    <ModuleHub title="Stock Movements" description="Receipts, issues, transfers, and adjustments." breadcrumbs={[...breadcrumbs, { label: "Movements" }]} tabs={INVENTORY_TABS}>
      <div className="mb-4 flex flex-wrap gap-2">
        {["all", "receipt", "issue", "transfer", "damage", "return"].map((s) => (
          <Button key={s} size="sm" variant={filter === s ? "default" : "outline"} onClick={() => setFilter(s)} className="capitalize">{s}</Button>
        ))}
      </div>
      {filtered.length === 0 ? <EmptyState icon={ArrowRightLeft} title="No movements" description="No movements match filter." /> : (
        <SimpleTable columns={["Movement ID", "Type", "Item", "SKU", "Qty", "From", "To", "Dept", "By", "Date", "Ref"]}
          rows={filtered.map((m) => [m.movementId, statusBadge(m.type), m.itemName, m.sku, String(m.quantity), m.fromLocation ?? "—", m.toLocation ?? "—", m.department, m.performedBy, m.date, m.reference])} />
      )}
    </ModuleHub>
  );
}

export function InventoryLowStockPage() {
  return (
    <ModuleHub title="Low Stock" description="Items at or below reorder level." breadcrumbs={[...breadcrumbs, { label: "Low Stock" }]} tabs={INVENTORY_TABS}
      actions={<MockToastButton label="Generate purchase requests" message="Purchase requests generated for low stock items (demo)." />}>
      {lowStockItems.length === 0 ? <EmptyState icon={Package2} title="All stocked" description="No items below reorder level." /> : (
        <SimpleTable columns={["SKU", "Item", "Stock", "Reorder", "Shortage", "Location", "Dept", "Status", ""]}
          rows={lowStockItems.map((i) => [i.sku, i.name, String(i.currentStock), String(i.reorderLevel), String(Math.max(0, i.reorderLevel - i.currentStock)), i.location, i.department, statusBadge(i.status), <MockToastButton key={i.id} label="Reorder" message={`Reorder request for ${i.sku} (demo).`} size="sm" variant="outline" />])} />
      )}
    </ModuleHub>
  );
}

export function InventoryDamagedPage() {
  return (
    <ModuleHub title="Damaged Items" description="Damaged stock reports and write-offs." breadcrumbs={[...breadcrumbs, { label: "Damaged" }]} tabs={INVENTORY_TABS}
      actions={<MockActionButton label="Report damage" fields={[{ name: "sku", label: "SKU", type: "select", options: mockInventoryItems.map((i) => i.sku), required: true }, { name: "qty", label: "Quantity", type: "number", required: true }, { name: "condition", label: "Condition", type: "select", options: ["damaged", "expired"], required: true }]} submitLabel="Report" />}>
      <SimpleTable columns={["Report ID", "Item", "SKU", "Qty", "Condition", "Location", "Reported By", "Date", "Status"]}
        rows={mockDamagedItems.map((d) => [d.reportId, d.itemName, d.sku, String(d.quantity), statusBadge(d.condition), d.location, d.reportedBy, d.reportedAt, statusBadge(d.status)])} />
    </ModuleHub>
  );
}
