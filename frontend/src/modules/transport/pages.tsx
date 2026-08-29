"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Bus,
  MapPin,
  Navigation,
  Route,
  Ticket,
  User,
  Users,
  Wrench,
} from "lucide-react";
import { ModuleHub, InfoCard, SimpleTable } from "@/components/shared/module-hub";
import { KpiCard } from "@/components/shared/kpi-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MockActionButton, MockToastButton } from "@/components/shared/mock-action";
import {
  TRANSPORT_TABS,
  liveTrackingMock,
  mockAssignments,
  mockConductors,
  mockDrivers,
  mockMonthlyPasses,
  mockRoutes,
  mockStops,
  mockTokenBalances,
  mockTokenPacks,
  mockTokenSales,
  mockTransportFees,
  mockTransportMaintenance,
  mockTransportStudents,
  mockVehicles,
  monthlyPassFeePkr,
  parentTransportSummary,
  transportStats,
} from "@/mock/transport";
import { formatCurrency, formatNumber } from "@/lib/utils";
import { useToast } from "@/components/shared/toast";

const breadcrumbs = [{ label: "Dashboard", href: "/dashboard" }, { label: "Transport" }];

function statusBadge(status: string) {
  const map: Record<string, "default" | "success" | "warning" | "error" | "info" | "outline"> = {
    active: "success",
    inactive: "outline",
    seasonal: "info",
    maintenance: "warning",
    retired: "error",
    on_leave: "warning",
    suspended: "error",
    ended: "outline",
    paid: "success",
    pending: "warning",
    overdue: "error",
    waived: "outline",
    scheduled: "info",
    in_progress: "info",
    completed: "success",
    on_route: "info",
    arrived: "success",
    not_started: "outline",
    pending_payment: "warning",
    expired: "outline",
    revoked: "error",
  };
  return (
    <Badge variant={map[status] ?? "outline"} className="capitalize">
      {status.replace(/_/g, " ")}
    </Badge>
  );
}

export function TransportDashboardPage() {
  return (
    <ModuleHub
      title="Transport"
      description="NED University bus fleet — routes across Karachi: Gulshan, North Nazimabad, Malir, Clifton."
      breadcrumbs={breadcrumbs}
      tabs={TRANSPORT_TABS}
      actions={
        <Button asChild size="sm">
          <Link href="/transport/tracking">Live tracking</Link>
        </Button>
      }
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Vehicles" value={transportStats.totalVehicles} icon={Bus} />
        <KpiCard label="Routes" value={transportStats.totalRoutes} icon={Route} />
        <KpiCard label="Drivers" value={transportStats.totalDrivers} icon={User} />
        <KpiCard label="Conductors" value={transportStats.totalConductors} icon={Users} />
      </div>
      <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Enrolled students" value={formatNumber(transportStats.enrolledStudents)} icon={Users} />
        <KpiCard label="Active routes" value={transportStats.activeRoutes} icon={Route} changeType="positive" />
        <KpiCard label="Fleet capacity" value={transportStats.totalCapacity} icon={Bus} />
        <KpiCard label="Utilization" value={`${transportStats.utilizationPct}%`} icon={Navigation} />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Active routes</CardTitle>
            <Button asChild variant="outline" size="sm"><Link href="/transport/routes">All routes</Link></Button>
          </CardHeader>
          <CardContent>
            <SimpleTable
              columns={["Route", "Vehicle", "Students", "Departure", "Status"]}
              rows={mockRoutes.filter((r) => r.status === "active").map((r) => [r.name, r.vehicleReg ?? "—", `${r.students}/${r.capacity}`, r.departureTime, statusBadge(r.status)])}
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Live tracking preview</CardTitle></CardHeader>
          <CardContent>
            <div className="rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-muted)] p-4">
              <p className="text-sm font-medium">{liveTrackingMock.routeName}</p>
              <p className="mt-1 text-xs text-[var(--muted)]">{liveTrackingMock.vehicleReg} · Driver: {liveTrackingMock.driverName}</p>
              <div className="mt-3 flex items-center gap-2">
                <MapPin className="size-4 text-[var(--brand-primary)]" />
                <span className="text-sm">Near {liveTrackingMock.currentStop} → {liveTrackingMock.nextStop}</span>
              </div>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-[var(--border)]">
                <div className="h-full rounded-full bg-[var(--brand-primary)]" style={{ width: `${liveTrackingMock.progressPct}%` }} />
              </div>
              <p className="mt-2 text-xs text-[var(--muted)]">Updated {liveTrackingMock.lastUpdated} · {liveTrackingMock.studentsOnBoard} students on board</p>
              <Button asChild className="mt-3" size="sm" variant="outline"><Link href="/transport/tracking">Open tracking map</Link></Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Fleet status</CardTitle></CardHeader>
          <CardContent>
            <SimpleTable
              columns={["Registration", "Route", "Capacity", "Status"]}
              rows={mockVehicles.map((v) => [v.registrationNo, v.routeName ?? "Unassigned", String(v.capacity), statusBadge(v.status)])}
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Fee overview</CardTitle></CardHeader>
          <CardContent>
            <SimpleTable
              columns={["Student", "Route", "Term", "Amount", "Status"]}
              rows={mockTransportFees.map((f) => [f.studentName, f.routeName, f.term, formatCurrency(f.amount), statusBadge(f.status)])}
            />
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader><CardTitle>Maintenance queue</CardTitle></CardHeader>
        <CardContent>
          <SimpleTable
            columns={["Ticket", "Vehicle", "Issue", "Priority", "Cost", "Status"]}
            rows={mockTransportMaintenance.map((m) => [m.ticketId, m.vehicleReg, m.issue, statusBadge(m.priority), m.cost ? formatCurrency(m.cost) : "—", statusBadge(m.status)])}
          />
        </CardContent>
      </Card>
    </ModuleHub>
  );
}

export function TransportVehiclesPage() {
  return (
    <ModuleHub title="Vehicles" description="Fleet registry." breadcrumbs={[...breadcrumbs, { label: "Vehicles" }]} tabs={TRANSPORT_TABS}
      actions={<MockActionButton label="Add vehicle" fields={[{ name: "reg", label: "Registration", required: true }, { name: "make", label: "Make", required: true }, { name: "capacity", label: "Capacity", type: "number", required: true }]} submitLabel="Add" icon={<Bus className="size-4" />} />}
    >
      <SimpleTable
        columns={["Registration", "Make/Model", "Year", "Capacity", "Route", "Driver", "Last service", "Status"]}
        rows={mockVehicles.map((v) => [v.registrationNo, `${v.make} ${v.model}`, String(v.year), String(v.capacity), v.routeName ?? "—", v.driverName ?? "—", v.lastService, statusBadge(v.status)])}
      />
      <p className="mt-4 text-xs text-[var(--muted)]">Fleet registered with Sindh Excise & Taxation — NED University transport contract vehicles only.</p>
      <Card className="mt-6">
        <CardHeader><CardTitle>Vehicle types in fleet</CardTitle></CardHeader>
        <CardContent className="text-sm text-[var(--muted)]">
          <p>Hino Rainbow 45-seater (Karachi routes) · Master Foton 35-seater (short routes) · Isuzu NQR 50-seater (Malir long route)</p>
        </CardContent>
      </Card>
    </ModuleHub>
  );
}

export function TransportRoutesPage() {
  return (
    <ModuleHub title="Routes" description="Bus routes across Karachi." breadcrumbs={[...breadcrumbs, { label: "Routes" }]} tabs={TRANSPORT_TABS}
      actions={<MockActionButton label="Add route" fields={[{ name: "name", label: "Route name", required: true }, { name: "start", label: "Start point", required: true }, { name: "end", label: "End point", required: true }]} submitLabel="Create" />}
    >
      <SimpleTable
        columns={["Code", "Route", "Stops", "Distance", "Departure", "Students", "Vehicle", "Status"]}
        rows={mockRoutes.map((r) => [r.code, r.name, String(r.stops), `${r.distanceKm} km`, r.departureTime, `${r.students}/${r.capacity}`, r.vehicleReg ?? "—", statusBadge(r.status)])}
      />
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {mockRoutes.map((r) => (
          <Card key={r.id}>
            <CardHeader><CardTitle>{r.code} — {r.name}</CardTitle></CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p><span className="text-[var(--muted)]">From: </span>{r.startPoint}</p>
              <p><span className="text-[var(--muted)]">To: </span>{r.endPoint}</p>
              <p><span className="text-[var(--muted)]">Schedule: </span>{r.departureTime} → {r.arrivalTime}</p>
              <p><span className="text-[var(--muted)]">Distance: </span>{r.distanceKm} km · {r.stops} stops</p>
              <div className="flex gap-2 pt-2">
                {statusBadge(r.status)}
                <Badge variant="outline">{r.students}/{r.capacity} seats</Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </ModuleHub>
  );
}

export function TransportStopsPage() {
  return (
    <ModuleHub title="Stops" description="Pickup and drop-off stops." breadcrumbs={[...breadcrumbs, { label: "Stops" }]} tabs={TRANSPORT_TABS}>
      <SimpleTable
        columns={["Stop", "Route", "Area", "Pickup", "Drop", "Seq", "Students"]}
        rows={mockStops.map((s) => [s.name, s.routeName, s.area, s.pickupTime, s.dropTime, String(s.sequence), String(s.students)])}
      />
      <Card className="mt-6">
        <CardHeader><CardTitle>Stop timing guide</CardTitle></CardHeader>
        <CardContent className="space-y-4 text-sm">
          {mockRoutes.filter((r) => r.status === "active").map((r) => (
            <div key={r.id} className="rounded-lg border border-[var(--border-subtle)] p-4">
              <p className="font-medium">{r.name}</p>
              <p className="mt-1 text-[var(--muted)]">Morning departure {r.departureTime} · Campus arrival {r.arrivalTime}</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {mockStops.filter((s) => s.routeId === r.id).map((s) => (
                  <Badge key={s.id} variant="outline">{s.name} {s.pickupTime}</Badge>
                ))}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </ModuleHub>
  );
}

export function TransportDriversPage() {
  return (
    <ModuleHub title="Drivers" description="Licensed drivers." breadcrumbs={[...breadcrumbs, { label: "Drivers" }]} tabs={TRANSPORT_TABS}>
      <SimpleTable
        columns={["Employee", "Name", "Phone", "License", "Expiry", "Route", "Experience", "Status"]}
        rows={mockDrivers.map((d) => [d.employeeId, d.name, d.phone, d.licenseNo, d.licenseExpiry, d.routeName ?? "—", `${d.experienceYears} yrs`, statusBadge(d.status)])}
      />
      <Card className="mt-6">
        <CardHeader><CardTitle>License expiry alerts</CardTitle></CardHeader>
        <CardContent>
          <SimpleTable
            columns={["Driver", "License", "Expires", "Route", "Status"]}
            rows={mockDrivers.map((d) => [d.name, d.licenseNo, d.licenseExpiry, d.routeName ?? "—", statusBadge(d.status)])}
          />
        </CardContent>
      </Card>
      <Card className="mt-6">
        <CardHeader><CardTitle>Driver assignment rules</CardTitle></CardHeader>
        <CardContent className="space-y-2 text-sm text-[var(--muted)]">
          <p>• Commercial license (HTV) mandatory for all route drivers</p>
          <p>• Annual medical fitness certificate required</p>
          <p>• Defensive driving refresher every 2 years</p>
          <p>• One backup driver assigned per active route</p>
        </CardContent>
      </Card>
    </ModuleHub>
  );
}

export function TransportConductorsPage() {
  return (
    <ModuleHub title="Conductors" description="Route conductors." breadcrumbs={[...breadcrumbs, { label: "Conductors" }]} tabs={TRANSPORT_TABS}>
      <SimpleTable
        columns={["Employee", "Name", "Phone", "Route", "Status"]}
        rows={mockConductors.map((c) => [c.employeeId, c.name, c.phone, c.routeName ?? "—", statusBadge(c.status)])}
      />
    </ModuleHub>
  );
}

export function TransportStudentsPage() {
  return (
    <ModuleHub title="Transport Students" description="Students enrolled in transport." breadcrumbs={[...breadcrumbs, { label: "Students" }]} tabs={TRANSPORT_TABS}>
      <SimpleTable
        columns={["Student ID", "Name", "Program", "Route", "Stop", "Pickup", "Status"]}
        rows={mockTransportStudents.map((s) => [s.studentId, s.name, s.program, s.routeName, s.stopName, s.pickupTime, statusBadge(s.status)])}
      />
    </ModuleHub>
  );
}

export function TransportAssignmentsPage() {
  return (
    <ModuleHub title="Assignments" description="Student-route assignments." breadcrumbs={[...breadcrumbs, { label: "Assignments" }]} tabs={TRANSPORT_TABS}
      actions={<MockActionButton label="Assign student" fields={[{ name: "studentId", label: "Student ID", required: true }, { name: "route", label: "Route", type: "select", options: mockRoutes.filter((r) => r.status === "active").map((r) => r.name), required: true }, { name: "stop", label: "Stop", required: true }]} submitLabel="Assign" successMessage="Student assigned to route (demo)." />}
    >
      <SimpleTable
        columns={["Student", "Route", "Stop", "Vehicle", "Assigned", "Status"]}
        rows={mockAssignments.map((a) => [a.studentName, a.routeName, a.stopName, a.vehicleReg, a.assignedAt, statusBadge(a.status)])}
      />
      <Card className="mt-6">
        <CardHeader><CardTitle>Route capacity</CardTitle></CardHeader>
        <CardContent>
          <SimpleTable
            columns={["Route", "Enrolled", "Capacity", "Available"]}
            rows={mockRoutes.filter((r) => r.status === "active").map((r) => [r.name, String(r.students), String(r.capacity), String(r.capacity - r.students)])}
          />
        </CardContent>
      </Card>
      <Card className="mt-6">
        <CardHeader><CardTitle>Assignment policy</CardTitle></CardHeader>
        <CardContent className="space-y-2 text-sm text-[var(--muted)]">
          <p>• Assignments are term-based — Spring and Fall semesters</p>
          <p>• Fee clearance required before route activation</p>
          <p>• Route changes allowed once per term with 2 weeks notice</p>
          <p>• Priority given to out-of-area students living 10+ km from campus</p>
        </CardContent>
      </Card>
    </ModuleHub>
  );
}

export function TransportFeesPage() {
  return (
    <ModuleHub title="Transport Fees" description="Term-wise transport charges — PKR." breadcrumbs={[...breadcrumbs, { label: "Fees" }]} tabs={TRANSPORT_TABS}>
      <SimpleTable
        columns={["Student", "Route", "Term", "Amount", "Paid", "Due", "Status"]}
        rows={mockTransportFees.map((f) => [f.studentName, f.routeName, f.term, formatCurrency(f.amount), formatCurrency(f.paid), f.dueDate, statusBadge(f.status)])}
      />
    </ModuleHub>
  );
}

export function TransportMaintenancePage() {
  return (
    <ModuleHub title="Maintenance" description="Vehicle maintenance tickets." breadcrumbs={[...breadcrumbs, { label: "Maintenance" }]} tabs={TRANSPORT_TABS}
      actions={<MockActionButton label="Create ticket" fields={[{ name: "vehicle", label: "Vehicle", type: "select", options: mockVehicles.map((v) => v.registrationNo), required: true }, { name: "issue", label: "Issue", required: true }]} submitLabel="Create" icon={<Wrench className="size-4" />} />}
    >
      <SimpleTable
        columns={["Ticket", "Vehicle", "Issue", "Priority", "Reported", "Cost", "Status"]}
        rows={mockTransportMaintenance.map((m) => [m.ticketId, m.vehicleReg, m.issue, statusBadge(m.priority), m.reportedAt, m.cost ? formatCurrency(m.cost) : "—", statusBadge(m.status)])}
      />
    </ModuleHub>
  );
}

export function TransportTrackingPage() {
  const [selectedRoute, setSelectedRoute] = useState(liveTrackingMock.routeId);
  const tracking = liveTrackingMock;

  return (
    <ModuleHub
      title="Live Tracking"
      description="Mock GPS tracking — static map UI with simulated bus position. Not real GPS."
      breadcrumbs={[...breadcrumbs, { label: "Live Tracking" }]}
      tabs={TRANSPORT_TABS}
      actions={<MockToastButton label="Refresh" message="Tracking data refreshed (demo)." variant="outline" />}
    >
      <div className="mb-4 flex flex-wrap gap-2">
        {mockRoutes.filter((r) => r.status === "active").map((r) => (
          <Button key={r.id} size="sm" variant={selectedRoute === r.id ? "default" : "outline"} onClick={() => setSelectedRoute(r.id)}>
            {r.code}
          </Button>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader><CardTitle>Route map (mock)</CardTitle></CardHeader>
          <CardContent>
            <div className="relative aspect-[16/9] overflow-hidden rounded-lg border border-[var(--border-subtle)] bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900">
              <div className="absolute inset-0 opacity-30" style={{ backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 24px, rgba(0,0,0,0.05) 24px, rgba(0,0,0,0.05) 25px), repeating-linear-gradient(90deg, transparent, transparent 24px, rgba(0,0,0,0.05) 24px, rgba(0,0,0,0.05) 25px)" }} />
              <div className="absolute left-[8%] top-[70%] size-3 rounded-full bg-green-500 ring-2 ring-white" title="Start" />
              <div className="absolute left-[18%] top-[55%] size-2 rounded-full bg-gray-400" />
              <div className="absolute left-[35%] top-[45%] size-2 rounded-full bg-gray-400" />
              <div className="absolute left-[52%] top-[38%] size-2 rounded-full bg-gray-400" />
              <div className="absolute left-[72%] top-[28%] flex flex-col items-center">
                <div className="flex size-8 items-center justify-center rounded-full bg-[var(--brand-primary)] text-white shadow-lg">
                  <Bus className="size-4" />
                </div>
                <span className="mt-1 rounded bg-white px-1.5 py-0.5 text-[10px] font-medium shadow dark:bg-slate-800">{tracking.vehicleReg}</span>
              </div>
              <div className="absolute right-[8%] top-[18%] size-3 rounded-full bg-red-500 ring-2 ring-white" title="Campus" />
              <svg className="absolute inset-0 size-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                <path d="M 8 70 Q 25 50 52 38 T 92 18" fill="none" stroke="var(--brand-primary)" strokeWidth="0.5" strokeDasharray="2 1" opacity="0.6" />
              </svg>
              <div className="absolute bottom-3 left-3 rounded-lg bg-white/90 px-3 py-2 text-xs shadow dark:bg-slate-800/90">
                <p className="font-medium">{tracking.currentStop}</p>
                <p className="text-[var(--muted)]">→ {tracking.nextStop}</p>
              </div>
            </div>
            <p className="mt-2 text-xs text-[var(--muted)]">Simulated position — not connected to real GPS hardware.</p>
          </CardContent>
        </Card>
        <div className="space-y-4">
          <InfoCard label="Vehicle" value={tracking.vehicleReg} sub={tracking.routeName} />
          <InfoCard label="Driver" value={tracking.driverName} sub={`Conductor: ${tracking.conductorName}`} />
          <InfoCard label="Speed" value={`${tracking.speedKmh} km/h`} sub={`Updated ${tracking.lastUpdated}`} />
          <InfoCard label="On board" value={tracking.studentsOnBoard} sub={`${tracking.progressPct}% route complete`} />
          <Card>
            <CardHeader><CardTitle>Stops</CardTitle></CardHeader>
            <CardContent className="space-y-2 text-sm">
              {mockStops.filter((s) => s.routeId === tracking.routeId).map((s) => (
                <div key={s.id} className="flex items-center gap-2">
                  <div className={`size-2 rounded-full ${s.name === tracking.currentStop ? "bg-[var(--brand-primary)]" : "bg-[var(--border)]"}`} />
                  <span className={s.name === tracking.currentStop ? "font-medium" : "text-[var(--muted)]"}>{s.name} · {s.pickupTime}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </ModuleHub>
  );
}

export function TransportMonthlyPassesPage() {
  return (
    <ModuleHub
      title="Monthly transport passes"
      description="Students pay monthly fee → transport ID / QR pass issued for the selected route."
      breadcrumbs={[...breadcrumbs, { label: "Monthly Passes" }]}
      tabs={TRANSPORT_TABS}
      actions={
        <MockActionButton
          label="Issue pass"
          title="Issue monthly pass"
          fields={[
            { name: "student", label: "Student ID", required: true, placeholder: "CS-2022-0421" },
            { name: "route", label: "Route", type: "select", options: mockRoutes.map((r) => r.name), required: true },
            { name: "month", label: "Month", type: "select", options: ["September 2026", "October 2026"], required: true },
          ]}
          submitLabel="Issue"
          successMessage="Monthly pass issued (demo)."
        />
      }
    >
      <div className="mb-4 grid gap-4 sm:grid-cols-3">
        <KpiCard label="Active passes" value={mockMonthlyPasses.filter((p) => p.status === "active").length} icon={Ticket} />
        <KpiCard label="Pending payment" value={mockMonthlyPasses.filter((p) => p.status === "pending_payment").length} icon={Users} />
        <KpiCard label="Monthly fee (Gulshan)" value={formatCurrency(monthlyPassFeePkr)} icon={Bus} />
      </div>
      <SimpleTable
        columns={["Pass", "Student", "Route", "Month", "Amount", "Valid until", "Status"]}
        rows={mockMonthlyPasses.map((p) => [
          p.passCode,
          p.studentName,
          p.routeName,
          p.month,
          formatCurrency(p.amount),
          p.validUntil,
          statusBadge(p.status),
        ])}
      />
    </ModuleHub>
  );
}

export function TransportTokensPage() {
  return (
    <ModuleHub
      title="Transport tokens (Topan)"
      description="Pay-per-ride packs for occasional travellers — buy 2, 5, or 10 rides instead of a monthly plan."
      breadcrumbs={[...breadcrumbs, { label: "Tokens" }]}
      tabs={TRANSPORT_TABS}
    >
      <div className="grid gap-4 sm:grid-cols-3">
        {mockTokenPacks.map((pack) => (
          <Card key={pack.id} className={pack.popular ? "border-[var(--brand-primary)]" : undefined}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">{pack.name}</CardTitle>
                {pack.popular ? <Badge variant="info">Popular</Badge> : null}
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold tracking-tight">{formatCurrency(pack.price)}</p>
              <p className="mt-1 text-sm text-[var(--muted)]">{pack.rides} rides · valid {pack.validityDays} days</p>
              <MockToastButton
                className="mt-4"
                label="Sell pack (demo)"
                message={`${pack.name} sold (demo).`}
                size="sm"
              />
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="mt-6">
        <CardHeader><CardTitle>Recent token sales</CardTitle></CardHeader>
        <CardContent>
          <SimpleTable
            columns={["Student", "Pack", "Rides", "Amount", "Payment", "Purchased"]}
            rows={mockTokenSales.map((s) => [
              s.studentName,
              s.packName,
              String(s.rides),
              formatCurrency(s.amount),
              s.paymentRef,
              s.purchasedAt,
            ])}
          />
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader><CardTitle>Active balances</CardTitle></CardHeader>
        <CardContent>
          <SimpleTable
            columns={["Student", "Pack", "Rides left", "Expires", "Last used"]}
            rows={mockTokenBalances.map((b) => [
              b.studentName,
              b.packName,
              String(b.remainingRides),
              b.expiresAt,
              b.lastUsedAt ?? "—",
            ])}
          />
        </CardContent>
      </Card>
    </ModuleHub>
  );
}

export function StudentTransportPage() {
  const { toast } = useToast();
  const assignment = mockAssignments.find((a) => a.studentId === "CS-2022-0421");
  const fees = mockTransportFees.filter((f) => f.studentId === "CS-2022-0421");
  const monthly = mockMonthlyPasses.find((p) => p.studentId === "CS-2022-0421" && p.status === "active");
  const tokens = mockTokenBalances.find((b) => b.studentId === "CS-2022-0421");

  return (
    <ModuleHub
      title="My Transport"
      description="Monthly van pass or Topan ride tokens — pay online, get QR boarding."
      breadcrumbs={[{ label: "Student", href: "/student/dashboard" }, { label: "Transport" }]}
      actions={
        <Button asChild size="sm" variant="outline">
          <Link href="/transport/tracking">Track bus</Link>
        </Button>
      }
    >
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Monthly plan</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            {monthly ? (
              <>
                <InfoCard label="Pass" value={monthly.passCode} sub={`${monthly.routeName} · until ${monthly.validUntil}`} />
                <Badge variant="success">Active</Badge>
                <p className="text-[var(--muted)]">Show QR {monthly.qrCode} to the conductor when boarding.</p>
              </>
            ) : (
              <p className="text-[var(--muted)]">No active monthly pass.</p>
            )}
            <div className="flex flex-wrap gap-2 pt-2">
              <Button
                size="sm"
                onClick={() => toast(`Monthly fee ${formatCurrency(monthlyPassFeePkr)} paid — pass pending issuance (demo).`)}
              >
                Pay monthly fee
              </Button>
              <Button asChild size="sm" variant="outline">
                <Link href="/student/forms/camp-bus-monthly/apply">Apply via Forms</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Topan tokens (occasional rides)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            {tokens ? (
              <InfoCard
                label="Balance"
                value={`${tokens.remainingRides} rides left`}
                sub={`${tokens.packName} · expires ${tokens.expiresAt}`}
              />
            ) : (
              <p className="text-[var(--muted)]">No token balance — buy a small pack for a few trips.</p>
            )}
            <div className="grid gap-2">
              {mockTokenPacks.map((pack) => (
                <button
                  key={pack.id}
                  type="button"
                  onClick={() => toast(`${pack.name} purchased for ${formatCurrency(pack.price)} (demo).`)}
                  className="flex items-center justify-between rounded-lg border border-[var(--border-subtle)] px-3 py-2 text-left hover:bg-[var(--surface-muted)]"
                >
                  <span>
                    {pack.name}
                    {pack.popular ? <Badge className="ml-2" variant="info">Best value</Badge> : null}
                  </span>
                  <span className="font-medium">{formatCurrency(pack.price)}</span>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {assignment ? (
        <>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            <InfoCard label="Route" value={assignment.routeName} />
            <InfoCard label="Stop" value={assignment.stopName} />
            <InfoCard label="Vehicle" value={assignment.vehicleReg} />
          </div>
          <Card className="mt-6">
            <CardHeader><CardTitle>Term fees</CardTitle></CardHeader>
            <CardContent>
              <SimpleTable
                columns={["Term", "Amount", "Paid", "Status"]}
                rows={fees.map((f) => [f.term, formatCurrency(f.amount), formatCurrency(f.paid), statusBadge(f.status)])}
              />
            </CardContent>
          </Card>
        </>
      ) : null}
    </ModuleHub>
  );
}

export function ParentTransportPage() {
  const t = parentTransportSummary;
  return (
    <ModuleHub
      title="Child Transport"
      description={`Transport details for ${t.childName}.`}
      breadcrumbs={[{ label: "Parent", href: "/parent/dashboard" }, { label: "Transport" }]}
      actions={<MockToastButton label="Contact driver" message={`Calling ${t.driverPhone} (demo).`} variant="outline" />}
    >
      <div className="mb-4">{statusBadge(t.status)}</div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <InfoCard label="Child" value={t.childName} sub={t.childId} />
        <InfoCard label="Route" value={t.routeName} />
        <InfoCard label="Bus" value={t.vehicleReg} />
        <InfoCard label="Driver" value={t.driverName} sub={t.driverPhone} />
        <InfoCard label="Pickup" value={t.pickupStop} sub={t.pickupTime} />
        <InfoCard label="Drop-off" value={t.dropStop} sub={t.dropTime} />
      </div>
      <Card className="mt-6">
        <CardHeader><CardTitle>Today&apos;s status</CardTitle></CardHeader>
        <CardContent className="text-sm text-[var(--muted)]">
          <p>Bus {t.vehicleReg} is currently {t.status === "on_route" ? "en route to campus" : t.status.replace(/_/g, " ")}.</p>
          <p className="mt-2">Expected arrival at campus: {t.dropTime}. For delays, contact transport office at +92-21-99261200.</p>
        </CardContent>
      </Card>
      <Card className="mt-6">
        <CardHeader><CardTitle>Route stops</CardTitle></CardHeader>
        <CardContent>
          <SimpleTable
            columns={["Stop", "Pickup", "Drop"]}
            rows={mockStops.filter((s) => s.routeName === t.routeName).map((s) => [s.name, s.pickupTime, s.dropTime])}
          />
        </CardContent>
      </Card>
      <Card className="mt-6">
        <CardHeader><CardTitle>Safety & policies</CardTitle></CardHeader>
        <CardContent className="space-y-2 text-sm text-[var(--muted)]">
          <p>• Students must be at the stop 5 minutes before pickup time</p>
          <p>• Monthly QR pass or Topan tokens are mandatory for boarding</p>
          <p>• Report route changes at least 2 weeks in advance</p>
          <p>• Emergency contact: NED Transport Office +92-21-99261200</p>
        </CardContent>
      </Card>
    </ModuleHub>
  );
}
