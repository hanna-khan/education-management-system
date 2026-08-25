"use client";

import Link from "next/link";
import {
  Building,
  Building2,
  Calendar,
  DoorOpen,
  FlaskConical,
  Monitor,
  Settings,
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
  FACILITIES_TABS,
  facilitiesStats,
  mockBookings,
  mockBuildings,
  mockClassrooms,
  mockEquipment,
  mockLabs,
  mockRooms,
  studentFacilitiesSummary,
} from "@/mock/facilities";
import { formatCurrency, formatNumber } from "@/lib/utils";

const breadcrumbs = [{ label: "Dashboard", href: "/dashboard" }, { label: "Facilities" }];

function statusBadge(status: string) {
  const map: Record<string, "default" | "success" | "warning" | "error" | "info" | "outline"> = {
    available: "success",
    occupied: "info",
    maintenance: "warning",
    reserved: "warning",
    operational: "success",
    retired: "outline",
    pending: "warning",
    approved: "success",
    rejected: "error",
    cancelled: "outline",
    completed: "success",
    classroom: "info",
    lab: "default",
    seminar: "outline",
    auditorium: "success",
    meeting: "info",
    office: "outline",
  };
  return (
    <Badge variant={map[status] ?? "outline"} className="capitalize">
      {status.replace(/_/g, " ")}
    </Badge>
  );
}

export function FacilitiesDashboardPage() {
  return (
    <ModuleHub
      title="Facility Management"
      description="NED University campus — buildings, rooms, labs, classrooms, equipment, and room bookings across Karachi."
      breadcrumbs={breadcrumbs}
      tabs={FACILITIES_TABS}
      actions={
        <MockActionButton
          label="New booking"
          fields={[
            { name: "room", label: "Room", type: "select", options: mockRooms.filter((r) => r.status === "available").map((r) => `${r.roomNumber} — ${r.buildingName}`), required: true },
            { name: "date", label: "Date", type: "date", required: true },
            { name: "purpose", label: "Purpose", required: true },
          ]}
          submitLabel="Book"
          icon={<Calendar className="size-4" />}
        />
      }
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <KpiCard label="Buildings" value={facilitiesStats.totalBuildings} icon={Building2} change="University Road campus" />
        <KpiCard label="Total rooms" value={formatNumber(facilitiesStats.totalRooms)} icon={DoorOpen} />
        <KpiCard label="Labs" value={facilitiesStats.totalLabs} icon={FlaskConical} />
        <KpiCard label="Classrooms" value={facilitiesStats.totalClassrooms} icon={Monitor} />
        <KpiCard label="Equipment assets" value={formatNumber(facilitiesStats.totalEquipment)} icon={Settings} />
        <KpiCard label="Active bookings" value={facilitiesStats.activeBookings} icon={Calendar} changeType="neutral" />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent bookings</CardTitle>
            <Button asChild variant="outline" size="sm"><Link href="/facilities/bookings">View all</Link></Button>
          </CardHeader>
          <CardContent>
            <SimpleTable
              columns={["Booking", "Room", "Requester", "Date", "Time", "Status"]}
              rows={mockBookings.map((b) => [
                b.bookingId,
                b.roomNumber,
                b.requester,
                b.date,
                `${b.startTime}–${b.endTime}`,
                statusBadge(b.status),
              ])}
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Room availability</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            {(["available", "occupied", "maintenance", "reserved"] as const).map((status) => {
              const count = mockRooms.filter((r) => r.status === status).length;
              const pct = Math.round((count / mockRooms.length) * 100);
              return (
                <div key={status}>
                  <div className="flex items-center justify-between text-sm">
                    <span className="capitalize text-[var(--muted)]">{status}</span>
                    <span className="font-medium">{count}</span>
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
          <CardHeader><CardTitle>Buildings overview</CardTitle></CardHeader>
          <CardContent>
            <SimpleTable
              columns={["Code", "Building", "Floors", "Rooms", "Labs", "Classrooms"]}
              rows={mockBuildings.map((b) => [b.code, b.name, String(b.floors), String(b.rooms), String(b.labs), String(b.classrooms)])}
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Maintenance linked</CardTitle>
            <Button asChild variant="outline" size="sm"><Link href="/maintenance">Maintenance</Link></Button>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            {mockRooms.filter((r) => r.status === "maintenance").map((r) => (
              <div key={r.id} className="flex items-center justify-between rounded-lg border border-[var(--border-subtle)] p-3">
                <div>
                  <p className="font-medium">{r.roomNumber} · {r.buildingName}</p>
                  <p className="text-[var(--muted)]">{r.availability}</p>
                </div>
                {statusBadge(r.status)}
              </div>
            ))}
            {mockEquipment.filter((e) => e.status === "maintenance").map((e) => (
              <div key={e.id} className="flex items-center justify-between rounded-lg border border-[var(--border-subtle)] p-3">
                <div>
                  <p className="font-medium">{e.assetId} · {e.name}</p>
                  <p className="text-[var(--muted)]">{e.buildingName}, {e.roomNumber}</p>
                </div>
                {statusBadge(e.status)}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </ModuleHub>
  );
}

export function FacilitiesBuildingsPage() {
  return (
    <ModuleHub title="Buildings" description="Campus building registry — NED University, Karachi." breadcrumbs={[...breadcrumbs, { label: "Buildings" }]} tabs={FACILITIES_TABS}
      actions={<MockActionButton label="Add building" fields={[{ name: "name", label: "Name", required: true }, { name: "code", label: "Code", required: true }, { name: "floors", label: "Floors", type: "number", required: true }]} submitLabel="Create" icon={<Building className="size-4" />} />}
    >
      <SimpleTable
        columns={["Code", "Name", "Address", "Department", "Floors", "Rooms", "Labs", "Built"]}
        rows={mockBuildings.map((b) => [b.code, b.name, b.address.slice(0, 30) + "…", b.department ?? "General", String(b.floors), String(b.rooms), String(b.labs), String(b.yearBuilt)])}
      />
    </ModuleHub>
  );
}

export function FacilitiesRoomsPage() {
  return (
    <ModuleHub title="Rooms" description="All rooms — capacity, equipment, location, availability, assigned department." breadcrumbs={[...breadcrumbs, { label: "Rooms" }]} tabs={FACILITIES_TABS}
      actions={<MockActionButton label="Add room" fields={[{ name: "roomNumber", label: "Room number", required: true }, { name: "building", label: "Building", type: "select", options: mockBuildings.map((b) => b.name), required: true }, { name: "capacity", label: "Capacity", type: "number", required: true }]} submitLabel="Create" />}
    >
      <SimpleTable
        columns={["Room", "Building", "Floor", "Type", "Capacity", "Department", "Equipment", "Status", "Availability"]}
        rows={mockRooms.map((r) => [
          r.roomNumber,
          r.buildingName,
          String(r.floor),
          statusBadge(r.type),
          String(r.capacity),
          r.department,
          r.equipment.slice(0, 2).join(", ") + (r.equipment.length > 2 ? "…" : ""),
          statusBadge(r.status),
          r.availability.slice(0, 25) + "…",
        ])}
      />
      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        {mockRooms.map((r) => (
          <Card key={r.id}>
            <CardHeader className="flex flex-row items-start justify-between">
              <CardTitle className="text-base">{r.roomNumber}</CardTitle>
              {statusBadge(r.status)}
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p><span className="text-[var(--muted)]">Building: </span>{r.buildingName}, Floor {r.floor}</p>
              <p><span className="text-[var(--muted)]">Capacity: </span>{r.capacity} · {r.department}</p>
              <p><span className="text-[var(--muted)]">Equipment: </span>{r.equipment.join(", ")}</p>
              <p><span className="text-[var(--muted)]">Availability: </span>{r.availability}</p>
              <MockToastButton label="Book room" message={`Booking form for ${r.roomNumber} opened (demo).`} size="sm" variant="outline" />
            </CardContent>
          </Card>
        ))}
      </div>
    </ModuleHub>
  );
}

export function FacilitiesLabsPage() {
  return (
    <ModuleHub title="Laboratories" description="Engineering and science labs — safety levels, supervisors, equipment." breadcrumbs={[...breadcrumbs, { label: "Labs" }]} tabs={FACILITIES_TABS}>
      <SimpleTable
        columns={["Lab", "Building", "Type", "Supervisor", "Capacity", "Safety", "Equipment", "Status"]}
        rows={mockLabs.map((l) => [l.roomNumber, l.buildingName, l.labType, l.supervisor, String(l.capacity), l.safetyLevel, l.equipment.slice(0, 2).join(", ") + "…", statusBadge(l.status)])}
      />
    </ModuleHub>
  );
}

export function FacilitiesClassroomsPage() {
  return (
    <ModuleHub title="Classrooms" description="Lecture halls and classrooms — projector, AC, seating." breadcrumbs={[...breadcrumbs, { label: "Classrooms" }]} tabs={FACILITIES_TABS}>
      <SimpleTable
        columns={["Room", "Building", "Capacity", "Department", "Projector", "AC", "Seating", "Status"]}
        rows={mockClassrooms.map((c) => [c.roomNumber, c.buildingName, String(c.capacity), c.department, c.hasProjector ? "Yes" : "No", c.hasAc ? "Yes" : "No", c.seatingType, statusBadge(c.status)])}
      />
    </ModuleHub>
  );
}

export function FacilitiesEquipmentPage() {
  return (
    <ModuleHub title="Equipment" description="AV, lab, and HVAC assets — PKR values, maintenance history." breadcrumbs={[...breadcrumbs, { label: "Equipment" }]} tabs={FACILITIES_TABS}
      actions={<MockActionButton label="Register asset" fields={[{ name: "name", label: "Asset name", required: true }, { name: "category", label: "Category", type: "select", options: ["AV Equipment", "Computer", "Lab Equipment", "HVAC"], required: true }, { name: "value", label: "Value (PKR)", type: "number", required: true }]} submitLabel="Register" />}
    >
      <div className="mb-4 grid gap-4 sm:grid-cols-3">
        <InfoCard label="Total asset value" value={formatCurrency(mockEquipment.reduce((s, e) => s + e.value, 0))} />
        <InfoCard label="Operational" value={String(mockEquipment.filter((e) => e.status === "operational").length)} />
        <InfoCard label="Under maintenance" value={String(mockEquipment.filter((e) => e.status === "maintenance").length)} />
      </div>
      <SimpleTable
        columns={["Asset ID", "Name", "Category", "Location", "Department", "Value", "Purchased", "Status"]}
        rows={mockEquipment.map((e) => [e.assetId, e.name, e.category, `${e.buildingName} ${e.roomNumber}`, e.department, formatCurrency(e.value), e.purchaseDate, statusBadge(e.status)])}
      />
    </ModuleHub>
  );
}

export function FacilitiesBookingsPage() {
  return (
    <ModuleHub title="Room Bookings" description="Approve and manage room reservations." breadcrumbs={[...breadcrumbs, { label: "Bookings" }]} tabs={FACILITIES_TABS}
      actions={<MockActionButton label="Create booking" fields={[{ name: "room", label: "Room", type: "select", options: mockRooms.map((r) => r.roomNumber), required: true }, { name: "date", label: "Date", type: "date", required: true }, { name: "startTime", label: "Start time", required: true }, { name: "endTime", label: "End time", required: true }, { name: "purpose", label: "Purpose", required: true }]} submitLabel="Submit" icon={<Calendar className="size-4" />} />}
    >
      <div className="mb-4 flex flex-wrap gap-2">
        {["pending", "approved", "rejected", "cancelled", "completed"].map((s) => (
          <Badge key={s} variant="outline" className="capitalize">
            {s.replace(/_/g, " ")}: {mockBookings.filter((b) => b.status === s).length}
          </Badge>
        ))}
      </div>
      <SimpleTable
        columns={["Booking", "Room", "Building", "Requester", "Purpose", "Date", "Time", "Attendees", "Status", ""]}
        rows={mockBookings.map((b) => [
          b.bookingId,
          b.roomNumber,
          b.buildingName,
          b.requester,
          b.purpose.slice(0, 30) + "…",
          b.date,
          `${b.startTime}–${b.endTime}`,
          String(b.attendees),
          statusBadge(b.status),
          b.status === "pending" ? (
            <div key={b.id} className="flex gap-1">
              <MockToastButton label="Approve" message={`Booking ${b.bookingId} approved (demo).`} size="sm" variant="outline" />
              <MockToastButton label="Reject" message="Booking rejected (demo)." size="sm" variant="outline" />
            </div>
          ) : null,
        ])}
      />
    </ModuleHub>
  );
}

export function FacilitiesSettingsPage() {
  return (
    <ModuleHub title="Facility Settings" description="Booking rules, operating hours, and maintenance links." breadcrumbs={[...breadcrumbs, { label: "Settings" }]} tabs={FACILITIES_TABS}
      actions={<MockToastButton label="Save settings" message="Facility settings saved (demo)." icon={<Settings className="size-4" />} />}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Booking rules</CardTitle></CardHeader>
          <CardContent className="space-y-2 text-sm text-[var(--muted)]">
            <p>• Students may book meeting rooms up to 7 days in advance</p>
            <p>• Maximum booking duration: 4 hours for students, 8 hours for faculty</p>
            <p>• Labs require supervisor approval for non-scheduled sessions</p>
            <p>• Auditorium bookings require Dean approval</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Operating hours</CardTitle></CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex justify-between border-b border-[var(--border-subtle)] py-2"><span>Academic blocks</span><span className="font-medium">Mon–Sat 08:00–20:00</span></div>
            <div className="flex justify-between border-b border-[var(--border-subtle)] py-2"><span>Labs</span><span className="font-medium">Mon–Fri 08:00–17:00</span></div>
            <div className="flex justify-between border-b border-[var(--border-subtle)] py-2"><span>Library rooms</span><span className="font-medium">Mon–Sat 09:00–17:00</span></div>
            <div className="flex justify-between py-2"><span>Maintenance link</span><Link href="/maintenance" className="font-medium text-[var(--brand-primary)] hover:underline">Open maintenance →</Link></div>
          </CardContent>
        </Card>
      </div>
      <Card className="mt-6">
        <CardHeader><CardTitle>Maintenance integration</CardTitle></CardHeader>
        <CardContent className="flex items-center gap-4 text-sm">
          <Wrench className="size-8 text-[var(--muted)]" />
          <div>
            <p>Rooms and equipment flagged for maintenance automatically create tickets in the Maintenance module.</p>
            <Button asChild className="mt-3" variant="outline" size="sm"><Link href="/maintenance/tickets">View maintenance tickets</Link></Button>
          </div>
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader><CardTitle>Department room allocation</CardTitle></CardHeader>
        <CardContent>
          <SimpleTable
            columns={["Department", "Primary block", "Classrooms", "Labs", "Contact"]}
            rows={[
              ["Electrical Engineering", "EEB — Block 7", "28", "12", "Dr. Farhan Ahmed"],
              ["Mechanical Engineering", "MEB — Block 9", "24", "10", "Dr. Asif Raza"],
              ["Computer & IT", "CSB — Block 16", "18", "8", "Engr. Saba Tariq"],
              ["Civil Engineering", "CEB — Block 5", "26", "6", "Prof. Ayesha Malik"],
              ["Library", "LLC — Block 3", "8", "2", "Ms. Nadia Hussain"],
            ]}
          />
        </CardContent>
      </Card>
    </ModuleHub>
  );
}

export function StudentFacilitiesPage() {
  const summary = studentFacilitiesSummary;
  return (
    <ModuleHub
      title="Book a Room"
      description="Reserve meeting rooms and study spaces on NED campus."
      breadcrumbs={[{ label: "Student", href: "/student/dashboard" }, { label: "Facilities" }]}
      actions={
        <MockActionButton
          label="Book room"
          title="Room booking request"
          fields={[
            { name: "room", label: "Room", type: "select", options: summary.availableRooms.map((r) => `${r.roomNumber} — ${r.buildingName} (${r.capacity} seats)`), required: true },
            { name: "date", label: "Date", type: "date", required: true },
            { name: "startTime", label: "Start time", required: true },
            { name: "endTime", label: "End time", required: true },
            { name: "purpose", label: "Purpose", required: true },
            { name: "attendees", label: "Expected attendees", type: "number", required: true },
          ]}
          submitLabel="Submit booking"
          successMessage="Room booking request submitted for approval (demo)."
        />
      }
    >
      {summary.upcomingBookings.length > 0 ? (
        <Card>
          <CardHeader><CardTitle>Your upcoming bookings</CardTitle></CardHeader>
          <CardContent>
            <SimpleTable
              columns={["Booking", "Room", "Date", "Time", "Purpose", "Status"]}
              rows={summary.upcomingBookings.map((b) => [b.bookingId, b.roomNumber, b.date, `${b.startTime}–${b.endTime}`, b.purpose, statusBadge(b.status)])}
            />
          </CardContent>
        </Card>
      ) : (
        <EmptyState icon={Calendar} title="No upcoming bookings" description="Book a room for your study group or club meeting." />
      )}
      <Card className="mt-6">
        <CardHeader><CardTitle>Available rooms</CardTitle></CardHeader>
        <CardContent>
          <SimpleTable
            columns={["Room", "Building", "Capacity", ""]}
            rows={summary.availableRooms.map((r) => [
              r.roomNumber,
              r.buildingName,
              String(r.capacity),
              <MockToastButton key={r.roomNumber} label="Quick book" message={`Quick book for ${r.roomNumber} (demo).`} size="sm" variant="outline" />,
            ])}
          />
        </CardContent>
      </Card>
    </ModuleHub>
  );
}
