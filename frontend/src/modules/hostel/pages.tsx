"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  Bed,
  Building,
  Building2,
  ClipboardList,
  Home,
  Layers,
  Settings,
  Users,
  Wallet,
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
  HOSTEL_TABS,
  hostelStats,
  mockAllocations,
  mockApplications,
  mockBeds,
  mockBuildings,
  mockFloors,
  mockHostelComplaints,
  mockHostelFees,
  mockHostelMaintenance,
  mockHostels,
  mockHostelStudents,
  mockRooms,
  mockWaitingList,
  studentHostelSummary,
} from "@/mock/hostel";
import { formatCurrency, formatNumber } from "@/lib/utils";

const breadcrumbs = [{ label: "Dashboard", href: "/dashboard" }, { label: "Hostel" }];

function statusBadge(status: string) {
  const map: Record<string, "default" | "success" | "warning" | "error" | "info" | "outline"> = {
    active: "success",
    available: "success",
    occupied: "info",
    reserved: "warning",
    maintenance: "warning",
    closed: "error",
    full: "info",
    pending: "warning",
    under_review: "warning",
    approved: "success",
    rejected: "error",
    waitlisted: "info",
    allocated: "success",
    paid: "success",
    partial: "warning",
    overdue: "error",
    waived: "outline",
    open: "warning",
    in_progress: "info",
    resolved: "success",
    scheduled: "info",
    completed: "success",
    checked_out: "outline",
    suspended: "error",
    normal: "outline",
    high: "warning",
    emergency: "error",
  };
  return (
    <Badge variant={map[status] ?? "outline"} className="capitalize">
      {status.replace(/_/g, " ")}
    </Badge>
  );
}

export function HostelDashboardPage() {
  return (
    <ModuleHub
      title="Hostel Management"
      description="NED University hostels — Quaid-e-Azam Boys, Fatima Jinnah Girls, Engineering Tower, and Graduate Research."
      breadcrumbs={breadcrumbs}
      tabs={HOSTEL_TABS}
      actions={
        <MockActionButton
          label="Review application"
          title="Review hostel application"
          fields={[
            { name: "applicationId", label: "Application ID", required: true, placeholder: "HST-2026-0042" },
            { name: "decision", label: "Decision", type: "select", options: ["approve", "reject", "waitlist"], required: true },
            { name: "notes", label: "Notes", type: "textarea" },
          ]}
          submitLabel="Submit review"
          icon={<ClipboardList className="size-4" />}
        />
      }
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Hostels" value={hostelStats.totalHostels} icon={Home} change="Karachi campus" />
        <KpiCard label="Rooms" value={formatNumber(hostelStats.totalRooms)} icon={Building2} />
        <KpiCard label="Total beds" value={formatNumber(hostelStats.totalBeds)} icon={Bed} />
        <KpiCard label="Occupied" value={formatNumber(hostelStats.occupiedBeds)} icon={Users} changeType="neutral" />
      </div>
      <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Available beds" value={hostelStats.availableBeds} icon={Bed} changeType="positive" />
        <KpiCard label="Pending applications" value={hostelStats.pendingApplications} icon={ClipboardList} changeType="negative" />
        <KpiCard label="Outstanding fees" value={formatCurrency(hostelStats.hostelFeesOutstanding)} icon={Wallet} changeType="negative" />
        <KpiCard label="Occupancy" value={`${Math.round((hostelStats.occupiedBeds / hostelStats.totalBeds) * 100)}%`} icon={Layers} />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Pending applications</CardTitle>
            <Button asChild variant="outline" size="sm">
              <Link href="/hostel/applications">View all</Link>
            </Button>
          </CardHeader>
          <CardContent>
            <SimpleTable
              columns={["Application", "Student", "Program", "Preferred hostel", "Status", ""]}
              rows={mockApplications
                .filter((a) => a.status === "pending" || a.status === "under_review")
                .map((a) => [
                  a.applicationId,
                  a.studentName,
                  a.program,
                  a.preferredHostel,
                  statusBadge(a.status),
                  <MockActionButton
                    key={a.id}
                    label="Review"
                    size="sm"
                    variant="outline"
                    fields={[
                      { name: "decision", label: "Decision", type: "select", options: ["approve", "reject", "waitlist"], required: true },
                    ]}
                    submitLabel="Submit"
                    successMessage={`Application ${a.applicationId} reviewed (demo).`}
                  />,
                ])}
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Hostel occupancy</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {mockHostels.map((h) => {
              const pct = Math.round((h.occupied / h.beds) * 100);
              return (
                <div key={h.id}>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-[var(--muted)]">{h.code} · {h.name.split(" ")[0]}</span>
                    <span className="font-medium">{pct}%</span>
                  </div>
                  <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-[var(--surface-muted)]">
                    <div className="h-full rounded-full bg-[var(--brand-primary)]" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Recent allocations</CardTitle></CardHeader>
          <CardContent>
            <SimpleTable
              columns={["Student", "Hostel", "Room/Bed", "Date"]}
              rows={mockAllocations.map((a) => [a.studentName, a.hostelName, `${a.roomNumber} / ${a.bedNumber}`, a.allocatedAt])}
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Open complaints & maintenance</CardTitle></CardHeader>
          <CardContent className="space-y-3 text-sm">
            {mockHostelComplaints.filter((c) => c.status !== "resolved").map((c) => (
              <div key={c.id} className="flex items-center justify-between rounded-lg border border-[var(--border-subtle)] p-3">
                <div>
                  <p className="font-medium">{c.complaintId} · {c.category}</p>
                  <p className="text-[var(--muted)]">{c.studentName} · {c.hostelName}</p>
                </div>
                {statusBadge(c.status)}
              </div>
            ))}
            {mockHostelMaintenance.filter((m) => m.status !== "completed").map((m) => (
              <div key={m.id} className="flex items-center justify-between rounded-lg border border-[var(--border-subtle)] p-3">
                <div>
                  <p className="font-medium">{m.ticketId}</p>
                  <p className="text-[var(--muted)]">{m.hostelName} · {m.issue.slice(0, 35)}…</p>
                </div>
                {statusBadge(m.status)}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader><CardTitle>Fee collection summary</CardTitle></CardHeader>
        <CardContent>
          <SimpleTable
            columns={["Student", "Hostel", "Month", "Amount", "Paid", "Status"]}
            rows={mockHostelFees.map((f) => [f.studentName, f.hostelName, f.month, formatCurrency(f.amount), formatCurrency(f.paid), statusBadge(f.status)])}
          />
        </CardContent>
      </Card>
    </ModuleHub>
  );
}

export function HostelHostelsPage() {
  return (
    <ModuleHub title="Hostels" description="Campus hostel registry." breadcrumbs={[...breadcrumbs, { label: "Hostels" }]} tabs={HOSTEL_TABS}
      actions={
        <MockActionButton
          label="Add hostel"
          fields={[
            { name: "name", label: "Name", required: true },
            { name: "code", label: "Code", required: true },
            { name: "gender", label: "Gender", type: "select", options: ["male", "female", "mixed"], required: true },
          ]}
          submitLabel="Create"
          icon={<Home className="size-4" />}
        />
      }
    >
      <SimpleTable
        columns={["Code", "Name", "Gender", "Warden", "Buildings", "Beds", "Occupied", "Status"]}
        rows={mockHostels.map((h) => [h.code, h.name, h.gender, h.warden, String(h.buildings), String(h.beds), String(h.occupied), statusBadge(h.status)])}
      />
    </ModuleHub>
  );
}

export function HostelBuildingsPage() {
  return (
    <ModuleHub title="Buildings" description="Hostel building blocks." breadcrumbs={[...breadcrumbs, { label: "Buildings" }]} tabs={HOSTEL_TABS}>
      <SimpleTable
        columns={["Code", "Name", "Hostel", "Floors", "Rooms", "Beds", "Occupied"]}
        rows={mockBuildings.map((b) => [b.code, b.name, b.hostelName, String(b.floors), String(b.rooms), String(b.beds), String(b.occupied)])}
      />
    </ModuleHub>
  );
}

export function HostelFloorsPage() {
  return (
    <ModuleHub title="Floors" description="Floor-wise occupancy." breadcrumbs={[...breadcrumbs, { label: "Floors" }]} tabs={HOSTEL_TABS}>
      <SimpleTable
        columns={["Floor", "Building", "Hostel", "Rooms", "Beds", "Occupied"]}
        rows={mockFloors.map((f) => [String(f.floorNumber), f.buildingName, f.hostelName, String(f.rooms), String(f.beds), String(f.occupied)])}
      />
    </ModuleHub>
  );
}

export function HostelRoomsPage() {
  return (
    <ModuleHub title="Rooms" description="Room inventory and fees (PKR/month)." breadcrumbs={[...breadcrumbs, { label: "Rooms" }]} tabs={HOSTEL_TABS}
      actions={<MockActionButton label="Add room" fields={[{ name: "roomNumber", label: "Room number", required: true }, { name: "type", label: "Type", type: "select", options: ["single", "double", "triple", "quad"], required: true }, { name: "fee", label: "Monthly fee (PKR)", type: "number", required: true }]} submitLabel="Create" />}
    >
      <SimpleTable
        columns={["Room", "Hostel", "Building", "Floor", "Type", "Capacity", "Occupied", "Fee", "Status"]}
        rows={mockRooms.map((r) => [r.roomNumber, r.hostelName, r.buildingName, String(r.floorNumber), r.type, String(r.capacity), String(r.occupied), formatCurrency(r.monthlyFee), statusBadge(r.status)])}
      />
    </ModuleHub>
  );
}

export function HostelBedsPage() {
  return (
    <ModuleHub title="Beds" description="Bed-level allocation status." breadcrumbs={[...breadcrumbs, { label: "Beds" }]} tabs={HOSTEL_TABS}
      actions={
        <MockActionButton
          label="Allocate bed"
          title="Allocate room/bed"
          fields={[
            { name: "studentId", label: "Student ID", required: true, placeholder: "CS-2024-0088" },
            { name: "bedId", label: "Bed ID", type: "select", options: mockBeds.filter((b) => b.status === "available").map((b) => b.bedNumber), required: true },
            { name: "checkIn", label: "Check-in date", type: "date", required: true },
          ]}
          submitLabel="Allocate"
          successMessage="Bed allocated successfully (demo)."
          icon={<Bed className="size-4" />}
        />
      }
    >
      <SimpleTable
        columns={["Bed", "Room", "Hostel", "Student", "Status", ""]}
        rows={mockBeds.map((b) => [
          b.bedNumber,
          b.roomNumber,
          b.hostelName,
          b.studentName ?? "—",
          statusBadge(b.status),
          b.status === "available" ? (
            <MockToastButton key={b.id} label="Reserve" message={`Bed ${b.bedNumber} reserved (demo).`} size="sm" variant="outline" />
          ) : null,
        ])}
      />
    </ModuleHub>
  );
}

export function HostelStudentsPage() {
  return (
    <ModuleHub title="Hostel Students" description="Currently residing students." breadcrumbs={[...breadcrumbs, { label: "Students" }]} tabs={HOSTEL_TABS}>
      <SimpleTable
        columns={["Student ID", "Name", "Program", "Sem", "Hostel", "Room", "Bed", "Check-in", "Status"]}
        rows={mockHostelStudents.map((s) => [s.studentId, s.name, s.program, String(s.semester), s.hostelName, s.roomNumber, s.bedNumber, s.checkIn, statusBadge(s.status)])}
      />
    </ModuleHub>
  );
}

export function HostelApplicationsPage() {
  const [filter, setFilter] = useState<string>("all");
  const filtered = useMemo(() => {
    if (filter === "all") return mockApplications;
    return mockApplications.filter((a) => a.status === filter);
  }, [filter]);

  return (
    <ModuleHub
      title="Applications"
      description="Hostel admission applications — admin review workflow."
      breadcrumbs={[...breadcrumbs, { label: "Applications" }]}
      tabs={HOSTEL_TABS}
    >
      <div className="mb-4 flex flex-wrap gap-2">
        {["all", "pending", "under_review", "approved", "rejected", "waitlisted"].map((s) => (
          <Button key={s} size="sm" variant={filter === s ? "default" : "outline"} onClick={() => setFilter(s)} className="capitalize">
            {s.replace(/_/g, " ")}
          </Button>
        ))}
      </div>
      {filtered.length === 0 ? (
        <EmptyState icon={ClipboardList} title="No applications" description="No applications match the selected filter." />
      ) : (
        <SimpleTable
          columns={["Application", "Student", "Program", "City", "Preferred", "Submitted", "Status", "Actions"]}
          rows={filtered.map((a) => [
            a.applicationId,
            a.studentName,
            a.program,
            a.city,
            a.preferredHostel.split(" ")[0],
            a.submittedAt,
            statusBadge(a.status),
            <div key={a.id} className="flex gap-1">
              <MockActionButton label="Approve" size="sm" variant="outline" fields={[{ name: "bed", label: "Assign bed", type: "select", options: mockBeds.filter((b) => b.status === "available").map((b) => b.bedNumber) }]} submitLabel="Approve" successMessage="Application approved and bed allocated (demo)." />
              <MockToastButton label="Reject" message="Application rejected (demo)." size="sm" variant="outline" />
            </div>,
          ])}
        />
      )}
    </ModuleHub>
  );
}

export function HostelAllocationsPage() {
  return (
    <ModuleHub title="Allocations" description="Active room/bed allocations." breadcrumbs={[...breadcrumbs, { label: "Allocations" }]} tabs={HOSTEL_TABS}>
      <SimpleTable
        columns={["Student", "Hostel", "Room", "Bed", "Allocated", "By", "Status"]}
        rows={mockAllocations.map((a) => [a.studentName, a.hostelName, a.roomNumber, a.bedNumber, a.allocatedAt, a.allocatedBy, statusBadge(a.status)])}
      />
    </ModuleHub>
  );
}

export function HostelWaitingListPage() {
  return (
    <ModuleHub title="Waiting List" description="Students awaiting hostel vacancy." breadcrumbs={[...breadcrumbs, { label: "Waiting List" }]} tabs={HOSTEL_TABS}
      actions={<MockToastButton label="Process next" message="Next student on waiting list notified (demo)." />}
    >
      <SimpleTable
        columns={["Position", "Student", "Preferred hostel", "Applied", "Priority", ""]}
        rows={mockWaitingList.map((w) => [
          String(w.position),
          w.studentName,
          w.preferredHostel,
          w.appliedAt,
          statusBadge(w.priority),
          <MockActionButton key={w.id} label="Allocate" size="sm" variant="outline" fields={[{ name: "bed", label: "Bed", type: "select", options: mockBeds.filter((b) => b.status === "available").map((b) => b.bedNumber), required: true }]} submitLabel="Allocate" successMessage="Allocated from waiting list (demo)." />,
        ])}
      />
    </ModuleHub>
  );
}

export function HostelFeesPage() {
  return (
    <ModuleHub title="Hostel Fees" description="Monthly hostel charges — PKR." breadcrumbs={[...breadcrumbs, { label: "Fees" }]} tabs={HOSTEL_TABS}>
      <div className="mb-4 grid gap-4 sm:grid-cols-3">
        <InfoCard label="Outstanding" value={formatCurrency(hostelStats.hostelFeesOutstanding)} />
        <InfoCard label="Overdue accounts" value={String(mockHostelFees.filter((f) => f.status === "overdue").length)} />
        <InfoCard label="Collected this month" value={formatCurrency(mockHostelFees.filter((f) => f.status === "paid").reduce((s, f) => s + f.paid, 0))} />
      </div>
      <SimpleTable
        columns={["Student", "Hostel", "Month", "Amount", "Paid", "Due", "Status"]}
        rows={mockHostelFees.map((f) => [f.studentName, f.hostelName, f.month, formatCurrency(f.amount), formatCurrency(f.paid), f.dueDate, statusBadge(f.status)])}
      />
    </ModuleHub>
  );
}

export function HostelComplaintsPage() {
  return (
    <ModuleHub title="Complaints" description="Student hostel complaints." breadcrumbs={[...breadcrumbs, { label: "Complaints" }]} tabs={HOSTEL_TABS}>
      <SimpleTable
        columns={["ID", "Student", "Hostel", "Room", "Category", "Description", "Submitted", "Status"]}
        rows={mockHostelComplaints.map((c) => [c.complaintId, c.studentName, c.hostelName, c.roomNumber, c.category, c.description.slice(0, 40) + "…", c.submittedAt, statusBadge(c.status)])}
      />
    </ModuleHub>
  );
}

export function HostelMaintenancePage() {
  return (
    <ModuleHub title="Maintenance" description="Hostel maintenance tickets." breadcrumbs={[...breadcrumbs, { label: "Maintenance" }]} tabs={HOSTEL_TABS}
      actions={
        <MockActionButton
          label="Create ticket"
          fields={[
            { name: "hostel", label: "Hostel", type: "select", options: mockHostels.map((h) => h.name), required: true },
            { name: "issue", label: "Issue", required: true },
            { name: "priority", label: "Priority", type: "select", options: ["low", "medium", "high", "urgent"], required: true },
          ]}
          submitLabel="Create"
          icon={<Wrench className="size-4" />}
        />
      }
    >
      <SimpleTable
        columns={["Ticket", "Hostel", "Location", "Issue", "Priority", "Reported", "Assigned", "Status"]}
        rows={mockHostelMaintenance.map((m) => [m.ticketId, m.hostelName, m.location, m.issue, statusBadge(m.priority), m.reportedAt, m.assignedTo ?? "—", statusBadge(m.status)])}
      />
    </ModuleHub>
  );
}

export function HostelSettingsPage() {
  return (
    <ModuleHub title="Hostel Settings" description="Allocation rules, fees, and policies." breadcrumbs={[...breadcrumbs, { label: "Settings" }]} tabs={HOSTEL_TABS}
      actions={<MockToastButton label="Save settings" message="Hostel settings saved (demo)." icon={<Settings className="size-4" />} />}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Fee structure (PKR/month)</CardTitle></CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex justify-between border-b border-[var(--border-subtle)] py-2"><span>Single room</span><span className="font-medium">PKR 28,000</span></div>
            <div className="flex justify-between border-b border-[var(--border-subtle)] py-2"><span>Double room</span><span className="font-medium">PKR 22,000</span></div>
            <div className="flex justify-between border-b border-[var(--border-subtle)] py-2"><span>Triple room</span><span className="font-medium">PKR 18,500</span></div>
            <div className="flex justify-between py-2"><span>Quad room</span><span className="font-medium">PKR 16,000</span></div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Allocation policy</CardTitle></CardHeader>
          <CardContent className="space-y-2 text-sm text-[var(--muted)]">
            <p>• Out-of-city students given priority</p>
            <p>• Merit-based allocation for limited seats</p>
            <p>• Maximum 4 semesters continuous stay</p>
            <p>• Fee clearance required before allocation</p>
          </CardContent>
        </Card>
      </div>
    </ModuleHub>
  );
}

export function StudentHostelPage() {
  const summary = studentHostelSummary;
  return (
    <ModuleHub
      title="Hostel"
      description="Apply for hostel accommodation or view your allocation."
      breadcrumbs={[{ label: "Student", href: "/student/dashboard" }, { label: "Hostel" }]}
      actions={
        summary.applicationStatus === "none" && !summary.allocation ? (
          <MockActionButton
            label="Apply for hostel"
            title="Hostel application"
            fields={[
              { name: "preferredHostel", label: "Preferred hostel", type: "select", options: mockHostels.filter((h) => h.status === "active").map((h) => h.name), required: true },
              { name: "reason", label: "Reason", type: "textarea", required: true },
              { name: "guardianPhone", label: "Guardian phone", required: true, placeholder: "+92-300-…" },
              { name: "city", label: "Home city", required: true },
            ]}
            submitLabel="Submit application"
            successMessage="Hostel application submitted (demo). You will be notified once reviewed."
          />
        ) : null
      }
    >
      {summary.allocation ? (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <InfoCard label="Hostel" value={summary.allocation.hostelName} />
            <InfoCard label="Room" value={summary.allocation.roomNumber} />
            <InfoCard label="Bed" value={summary.allocation.bedNumber} />
            <InfoCard label="Check-in" value={summary.allocation.checkIn} />
          </div>
          <Card className="mt-6">
            <CardHeader><CardTitle>Your allocation</CardTitle></CardHeader>
            <CardContent className="text-sm text-[var(--muted)]">
              <p>You are currently allocated a bed at {summary.allocation.hostelName}, room {summary.allocation.roomNumber}.</p>
              <p className="mt-2">Pending fees: {formatCurrency(summary.pendingFees)} · Open complaints: {summary.complaints}</p>
            </CardContent>
          </Card>
        </>
      ) : (
        <EmptyState icon={Bed} title="No hostel allocation" description="Submit an application to request hostel accommodation. Out-of-city students are given priority." />
      )}
    </ModuleHub>
  );
}
