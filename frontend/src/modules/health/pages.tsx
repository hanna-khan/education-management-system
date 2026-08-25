"use client";

import Link from "next/link";
import {
  AlertTriangle,
  FileText,
  Heart,
  Lock,
  Shield,
  Stethoscope,
  Syringe,
} from "lucide-react";
import { ModuleHub, InfoCard, SimpleTable } from "@/components/shared/module-hub";
import { KpiCard } from "@/components/shared/kpi-card";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MockActionButton, MockToastButton } from "@/components/shared/mock-action";
import {
  HEALTH_TABS,
  healthStats,
  mockAllergies,
  mockClinicVisits,
  mockMedicalDocuments,
  mockMedicalIncidents,
  mockMedicalProfiles,
  mockVaccinations,
  parentHealthNotifications,
  studentHealthSummary,
} from "@/mock/health";

const breadcrumbs = [{ label: "Dashboard", href: "/dashboard" }, { label: "Health / Clinic" }];

function statusBadge(status: string) {
  const map: Record<string, "default" | "success" | "warning" | "error" | "info" | "outline"> = {
    completed: "success",
    scheduled: "info",
    in_progress: "info",
    cancelled: "outline",
    no_show: "error",
    reported: "warning",
    under_review: "warning",
    treated: "success",
    referred: "info",
    closed: "outline",
    due: "warning",
    overdue: "error",
    exempt: "outline",
    mild: "info",
    moderate: "warning",
    severe: "error",
    minor: "info",
    serious: "error",
    critical: "error",
  };
  return (
    <Badge variant={map[status] ?? "outline"} className="capitalize">
      {status.replace(/_/g, " ")}
    </Badge>
  );
}

function accessBadge(level: string) {
  const labels: Record<string, string> = {
    public: "Public",
    staff_only: "Staff only",
    clinical_staff: "Clinical staff",
    restricted: "Restricted",
  };
  const variants: Record<string, "default" | "success" | "warning" | "error" | "info" | "outline"> = {
    public: "outline",
    staff_only: "info",
    clinical_staff: "warning",
    restricted: "error",
  };
  return (
    <Badge variant={variants[level] ?? "outline"} className="gap-1">
      <Lock className="size-3" />
      {labels[level] ?? level}
    </Badge>
  );
}

export function HealthDashboardPage() {
  return (
    <ModuleHub
      title="Health & Clinic"
      description="NED Campus Clinic — student/staff medical profiles, visits, incidents, and records."
      breadcrumbs={breadcrumbs}
      tabs={HEALTH_TABS}
      actions={
        <MockActionButton
          label="Create visit"
          title="Record clinic visit"
          fields={[
            { name: "studentId", label: "Student ID", required: true, placeholder: "CS-2022-0421" },
            { name: "date", label: "Visit date", type: "date", required: true },
            { name: "reason", label: "Reason", required: true },
            { name: "symptoms", label: "Symptoms", type: "textarea" },
            { name: "treatment", label: "Treatment", type: "textarea", required: true },
            { name: "followUp", label: "Follow-up", type: "textarea" },
            { name: "notifyParent", label: "Notify parent", type: "select", options: ["yes", "no"], required: true },
          ]}
          submitLabel="Save visit"
          icon={<Stethoscope className="size-4" />}
        />
      }
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Student profiles" value={healthStats.totalStudentProfiles} icon={Heart} />
        <KpiCard label="Staff profiles" value={healthStats.totalStaffProfiles} icon={Shield} />
        <KpiCard label="Visits this month" value={healthStats.visitsThisMonth} icon={Stethoscope} />
        <KpiCard label="Open incidents" value={healthStats.openIncidents} icon={AlertTriangle} changeType="negative" />
      </div>
      <div className="mt-4 grid gap-4 sm:grid-cols-3">
        <KpiCard label="Students with allergies" value={healthStats.studentsWithAllergies} icon={AlertTriangle} />
        <KpiCard label="Vaccinations due" value={healthStats.vaccinationsDue} icon={Syringe} changeType="negative" />
        <KpiCard label="Pending documents" value={healthStats.pendingDocuments} icon={FileText} />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent visits</CardTitle>
            <Link href="/health/visits" className="text-sm text-[var(--brand-primary)] hover:underline">View all</Link>
          </CardHeader>
          <CardContent>
            <SimpleTable
              columns={["Visit", "Student", "Date", "Reason", "Status"]}
              rows={mockClinicVisits.slice(0, 4).map((v) => [v.visitId, v.studentName, v.visitDate, v.reason.slice(0, 25) + "…", statusBadge(v.status)])}
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Permission boundaries</CardTitle></CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex items-center justify-between rounded-lg border border-[var(--border-subtle)] p-3">
              <span>Student medical profiles</span>
              {accessBadge("clinical_staff")}
            </div>
            <div className="flex items-center justify-between rounded-lg border border-[var(--border-subtle)] p-3">
              <span>Allergy records (severe)</span>
              {accessBadge("restricted")}
            </div>
            <div className="flex items-center justify-between rounded-lg border border-[var(--border-subtle)] p-3">
              <span>Parent portal summary</span>
              {accessBadge("public")}
            </div>
            <div className="flex items-center justify-between rounded-lg border border-[var(--border-subtle)] p-3">
              <span>Staff medical records</span>
              {accessBadge("restricted")}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader><CardTitle>Vaccinations due</CardTitle></CardHeader>
        <CardContent>
          <SimpleTable
            columns={["Person", "Vaccine", "Due date", "Status"]}
            rows={mockVaccinations.filter((v) => v.status === "due" || v.status === "overdue").map((v) => [v.name, v.vaccine, v.dueDate ?? "—", statusBadge(v.status)])}
          />
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader><CardTitle>Active medical incidents</CardTitle></CardHeader>
        <CardContent>
          <SimpleTable
            columns={["Incident", "Student", "Severity", "Location", "Status"]}
            rows={mockMedicalIncidents.filter((i) => i.status !== "closed").map((i) => [i.incidentId, i.studentName, statusBadge(i.severity), i.location.slice(0, 30) + "…", statusBadge(i.status)])}
          />
        </CardContent>
      </Card>
    </ModuleHub>
  );
}

export function HealthProfilesPage() {
  return (
    <ModuleHub title="Medical Profiles" description="Student and staff health profiles." breadcrumbs={[...breadcrumbs, { label: "Profiles" }]} tabs={HEALTH_TABS}>
      <div className="mb-4 flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 px-4 py-2 text-sm text-amber-800 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-200">
        <Lock className="size-4 shrink-0" />
        Clinical staff access required — sensitive medical data
      </div>
      <SimpleTable
        columns={["ID", "Name", "Type", "Department", "Blood", "Conditions", "Last visit", "Access"]}
        rows={mockMedicalProfiles.map((p) => [
          p.personId,
          p.name,
          p.type,
          p.department,
          p.bloodGroup,
          p.chronicConditions.length ? p.chronicConditions.join(", ") : "None",
          p.lastVisit ?? "—",
          accessBadge(p.accessLevel),
        ])}
      />
    </ModuleHub>
  );
}

export function HealthVisitsPage() {
  return (
    <ModuleHub
      title="Clinic Visits"
      description="Record and review clinic visits."
      breadcrumbs={[...breadcrumbs, { label: "Visits" }]}
      tabs={HEALTH_TABS}
      actions={
        <MockActionButton
          label="New visit"
          title="Create clinic visit"
          fields={[
            { name: "student", label: "Student", type: "select", options: mockMedicalProfiles.filter((p) => p.type === "student").map((p) => p.name), required: true },
            { name: "date", label: "Date", type: "date", required: true },
            { name: "reason", label: "Reason", required: true },
            { name: "notes", label: "Notes", type: "textarea" },
            { name: "treatment", label: "Treatment", type: "textarea", required: true },
            { name: "followUp", label: "Follow-up", type: "textarea" },
          ]}
          submitLabel="Save"
          icon={<Stethoscope className="size-4" />}
        />
      }
    >
      <SimpleTable
        columns={["Visit", "Student", "Date", "Reason", "Treatment", "Nurse", "Parent notified", "Status"]}
        rows={mockClinicVisits.map((v) => [
          v.visitId,
          v.studentName,
          v.visitDate,
          v.reason,
          v.treatment.slice(0, 30) + "…",
          v.nurseName,
          v.parentNotified ? "Yes" : "No",
          statusBadge(v.status),
        ])}
      />
      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        {mockClinicVisits.map((v) => (
          <Card key={v.id}>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base">{v.visitId}</CardTitle>
              {statusBadge(v.status)}
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p><span className="text-[var(--muted)]">Student: </span>{v.studentName}</p>
              <p><span className="text-[var(--muted)]">Reason: </span>{v.reason}</p>
              <p><span className="text-[var(--muted)]">Symptoms: </span>{v.symptoms}</p>
              <p><span className="text-[var(--muted)]">Treatment: </span>{v.treatment}</p>
              {v.followUp ? <p><span className="text-[var(--muted)]">Follow-up: </span>{v.followUp}</p> : null}
              <p className="text-[var(--muted)]">Recorded by {v.nurseName}</p>
              {v.parentNotified ? (
                <Badge variant="info">Parent notified</Badge>
              ) : (
                <MockToastButton label="Notify parent" message="Parent notification sent (demo)." size="sm" variant="outline" />
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </ModuleHub>
  );
}

export function HealthIncidentsPage() {
  return (
    <ModuleHub title="Medical Incidents" description="Campus medical emergencies and injuries." breadcrumbs={[...breadcrumbs, { label: "Incidents" }]} tabs={HEALTH_TABS}>
      <SimpleTable
        columns={["Incident", "Student", "Location", "Severity", "Reported", "Treatment", "Parent", "Status"]}
        rows={mockMedicalIncidents.map((i) => [
          i.incidentId,
          i.studentName,
          i.location,
          statusBadge(i.severity),
          i.reportedAt,
          i.treatment?.slice(0, 30) ?? "—",
          i.parentNotified ? "Notified" : "—",
          statusBadge(i.status),
        ])}
      />
      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        {mockMedicalIncidents.map((i) => (
          <Card key={i.id}>
            <CardHeader className="flex flex-row items-start justify-between">
              <CardTitle className="text-base">{i.incidentId}</CardTitle>
              {statusBadge(i.severity)}
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p><span className="text-[var(--muted)]">Student: </span>{i.studentName}</p>
              <p><span className="text-[var(--muted)]">Location: </span>{i.location}</p>
              <p><span className="text-[var(--muted)]">Reported: </span>{i.reportedAt} by {i.reportedBy}</p>
              <p>{i.description}</p>
              {i.treatment ? <p><span className="text-[var(--muted)]">Treatment: </span>{i.treatment}</p> : null}
              {i.parentNotified ? (
                <Badge variant="info">Parent notified</Badge>
              ) : (
                <MockToastButton label="Notify parent" message="Parent emergency notification sent (demo)." size="sm" variant="outline" />
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </ModuleHub>
  );
}

export function HealthAllergiesPage() {
  return (
    <ModuleHub title="Allergies" description="Allergy registry with severity levels." breadcrumbs={[...breadcrumbs, { label: "Allergies" }]} tabs={HEALTH_TABS}>
      <div className="mb-4 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-800 dark:border-red-900 dark:bg-red-950 dark:text-red-200">
        <Lock className="size-4 shrink-0" />
        Restricted access — severe allergy data visible to clinical staff only
      </div>
      <SimpleTable
        columns={["Person", "Type", "Allergen", "Severity", "Reaction", "Access"]}
        rows={mockAllergies.map((a) => [a.name, a.type, a.allergen, statusBadge(a.severity), a.reaction.slice(0, 40) + "…", accessBadge(a.accessLevel)])}
      />
      <Card className="mt-6">
        <CardHeader><CardTitle>Severe allergy protocol</CardTitle></CardHeader>
        <CardContent className="space-y-2 text-sm text-[var(--muted)]">
          <p>• EpiPen locations: Campus Clinic, Hostel warden offices, Main cafeteria</p>
          <p>• Cafeteria staff notified for food allergen cases</p>
          <p>• PE instructors alerted for exercise-induced reactions</p>
          <p>• Parent/guardian contacted immediately for severe cases</p>
        </CardContent>
      </Card>
      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        {mockAllergies.map((a) => (
          <Card key={a.id}>
            <CardHeader className="flex flex-row items-start justify-between">
              <CardTitle className="text-base">{a.name}</CardTitle>
              {statusBadge(a.severity)}
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p><span className="text-[var(--muted)]">Allergen: </span>{a.allergen}</p>
              <p><span className="text-[var(--muted)]">Reaction: </span>{a.reaction}</p>
              {a.notes ? <p className="text-[var(--muted)]">{a.notes}</p> : null}
              {accessBadge(a.accessLevel)}
            </CardContent>
          </Card>
        ))}
      </div>
    </ModuleHub>
  );
}

export function HealthVaccinationsPage() {
  return (
    <ModuleHub title="Vaccinations" description="Immunization records and due dates." breadcrumbs={[...breadcrumbs, { label: "Vaccinations" }]} tabs={HEALTH_TABS}>
      <SimpleTable
        columns={["Person", "Type", "Vaccine", "Dose", "Administered", "Due", "Status"]}
        rows={mockVaccinations.map((v) => [v.name, v.type, v.vaccine, v.dose, v.administeredAt ?? "—", v.dueDate ?? "—", statusBadge(v.status)])}
      />
    </ModuleHub>
  );
}

export function HealthDocumentsPage() {
  return (
    <ModuleHub title="Medical Documents" description="Uploaded reports, prescriptions, and certificates." breadcrumbs={[...breadcrumbs, { label: "Documents" }]} tabs={HEALTH_TABS}>
      <div className="mb-4 flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 px-4 py-2 text-sm text-amber-800 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-200">
        <Lock className="size-4 shrink-0" />
        Document access is role-restricted — restricted files require clinical staff authorization
      </div>
      <SimpleTable
        columns={["Document", "Person", "Type", "Title", "Uploaded", "Size", "Access"]}
        rows={mockMedicalDocuments.map((d) => [d.documentId, d.name, d.type, d.title, d.uploadedAt, d.fileSize, accessBadge(d.accessLevel)])}
      />
      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        {mockMedicalDocuments.map((d) => (
          <Card key={d.id}>
            <CardHeader className="flex flex-row items-start justify-between">
              <CardTitle className="text-base">{d.title}</CardTitle>
              {accessBadge(d.accessLevel)}
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p><span className="text-[var(--muted)]">Patient: </span>{d.name}</p>
              <p><span className="text-[var(--muted)]">Type: </span>{d.type.replace(/_/g, " ")}</p>
              <p><span className="text-[var(--muted)]">Uploaded: </span>{d.uploadedAt} by {d.uploadedBy}</p>
              <p><span className="text-[var(--muted)]">Size: </span>{d.fileSize}</p>
              <MockToastButton label="View document" message="Document viewer opened (demo — access logged)." size="sm" variant="outline" />
            </CardContent>
          </Card>
        ))}
      </div>
    </ModuleHub>
  );
}

export function StudentHealthPage() {
  const h = studentHealthSummary;
  return (
    <ModuleHub title="My Health" description="Your medical summary and clinic records." breadcrumbs={[{ label: "Student", href: "/student/dashboard" }, { label: "Health" }]}>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <InfoCard label="Blood group" value={h.bloodGroup} />
        <InfoCard label="Allergies" value={h.allergies.length ? h.allergies.join(", ") : "None recorded"} />
        <InfoCard label="Last visit" value={h.lastVisit ?? "—"} />
        <InfoCard label="Vaccinations due" value={h.vaccinationsDue} />
      </div>
      <Card className="mt-6">
        <CardHeader><CardTitle>Emergency contact</CardTitle></CardHeader>
        <CardContent className="text-sm">
          <p className="font-medium">{h.emergencyContact}</p>
          <p className="text-[var(--muted)]">{h.emergencyPhone}</p>
        </CardContent>
      </Card>
      <Card className="mt-6">
        <CardHeader><CardTitle>Clinic information</CardTitle></CardHeader>
        <CardContent className="space-y-2 text-sm text-[var(--muted)]">
          <p>NED Campus Clinic — Block D, Ground Floor</p>
          <p>Hours: Mon–Fri 08:00–16:00 · Sat 08:00–12:00</p>
          <p>Emergency: +92-21-99261299</p>
          <MockActionButton className="mt-2" label="Request appointment" fields={[{ name: "reason", label: "Reason", required: true }, { name: "preferredDate", label: "Preferred date", type: "date" }]} submitLabel="Request" successMessage="Appointment request submitted (demo)." size="sm" />
        </CardContent>
      </Card>
      <Card className="mt-6">
        <CardHeader><CardTitle>Your vaccination status</CardTitle></CardHeader>
        <CardContent>
          <SimpleTable
            columns={["Vaccine", "Status", "Due"]}
            rows={mockVaccinations.filter((v) => v.personId === "CS-2022-0421").map((v) => [v.vaccine, statusBadge(v.status), v.dueDate ?? v.administeredAt ?? "—"])}
          />
        </CardContent>
      </Card>
    </ModuleHub>
  );
}

export function ParentHealthPage() {
  return (
    <ModuleHub
      title="Child Health"
      description="Health notifications and clinic visit summaries for your child."
      breadcrumbs={[{ label: "Parent", href: "/parent/dashboard" }, { label: "Health" }]}
      actions={<MockToastButton label="Update emergency contact" message="Emergency contact form opened (demo)." variant="outline" />}
    >
      <div className="mb-4 rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-muted)] px-4 py-3 text-sm">
        <p className="font-medium">Parent notification portal</p>
        <p className="text-[var(--muted)]">You receive alerts when your child visits the clinic or is involved in a medical incident.</p>
      </div>
      <div className="space-y-3">
        {parentHealthNotifications.map((n) => (
          <Card key={n.id} className={!n.read ? "border-[var(--brand-primary)]" : undefined}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-medium">{n.title}</p>
                  <p className="mt-1 text-sm text-[var(--muted)]">{n.childName} · {n.sentAt}</p>
                  <p className="mt-2 text-sm">{n.message}</p>
                </div>
                {!n.read ? <Badge variant="info">New</Badge> : null}
              </div>
              <MockToastButton className="mt-3" label="Acknowledge" message="Notification acknowledged (demo)." size="sm" variant="outline" />
            </CardContent>
          </Card>
        ))}
      </div>
    </ModuleHub>
  );
}
