"use client";

import Link from "next/link";
import {
  AlertTriangle,
  Calendar,
  MessageSquare,
  User,
  Users,
} from "lucide-react";
import { ModuleHub, InfoCard, SimpleTable } from "@/components/shared/module-hub";
import { KpiCard } from "@/components/shared/kpi-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MockActionButton, MockToastButton } from "@/components/shared/mock-action";
import {
  ADVISING_TABS,
  advisingStats,
  getAdvisee,
  mockAdvisees,
  mockAdvisingNotes,
  mockAdvisingRequests,
  mockAppointments,
  mockAdvisors,
  mockRecommendations,
} from "@/mock/advising";

const breadcrumbs = [{ label: "Dashboard", href: "/dashboard" }, { label: "Advising" }];

function warningBadge(level: string) {
  const map: Record<string, "default" | "success" | "warning" | "error" | "info" | "outline"> = {
    none: "success",
    academic: "warning",
    attendance: "warning",
    conduct: "error",
    probation: "error",
  };
  return (
    <Badge variant={map[level] ?? "outline"} className="capitalize">
      {level === "none" ? "Good standing" : level}
    </Badge>
  );
}

function statusBadge(status: string) {
  const map: Record<string, "default" | "success" | "warning" | "error" | "info" | "outline"> = {
    scheduled: "info",
    completed: "success",
    cancelled: "outline",
    no_show: "error",
    requested: "warning",
    open: "warning",
    in_progress: "info",
    resolved: "success",
    closed: "outline",
    pending: "warning",
    accepted: "success",
    declined: "error",
  };
  return (
    <Badge variant={map[status] ?? "outline"} className="capitalize">
      {status.replace(/_/g, " ")}
    </Badge>
  );
}

export function AdvisingDashboardPage() {
  return (
    <ModuleHub
      title="Student Advising"
      description="Advisees, appointments, notes, recommendations, and academic warnings."
      breadcrumbs={breadcrumbs}
      tabs={ADVISING_TABS}
      actions={
        <MockActionButton
          label="Schedule meeting"
          fields={[
            { name: "student", label: "Student", type: "select", options: mockAdvisees.map((a) => a.name), required: true },
            { name: "date", label: "Date", type: "date", required: true },
            { name: "topic", label: "Topic", required: true },
            { name: "mode", label: "Mode", type: "select", options: ["in_person", "online"], required: true },
          ]}
          submitLabel="Schedule"
          icon={<Calendar className="size-4" />}
        />
      }
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <KpiCard label="Advisees" value={advisingStats.totalAdvisees} icon={Users} />
        <KpiCard label="Meetings this week" value={advisingStats.meetingsThisWeek} icon={Calendar} />
        <KpiCard label="Open requests" value={advisingStats.openRequests} icon={MessageSquare} />
        <KpiCard label="At risk" value={advisingStats.atRiskStudents} icon={AlertTriangle} changeType="negative" />
        <KpiCard label="Pending recs" value={advisingStats.pendingRecommendations} icon={User} />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>At-risk advisees</CardTitle>
            <Button asChild size="sm" variant="outline">
              <Link href="/advising/students">All advisees</Link>
            </Button>
          </CardHeader>
          <CardContent>
            <SimpleTable
              columns={["Student", "CGPA", "Warning", "Last meeting"]}
              rows={mockAdvisees
                .filter((a) => a.warning !== "none")
                .map((a) => [
                  <Link key={a.id} href={`/advising/students/${a.id}`} className="font-medium hover:underline">
                    {a.name}
                  </Link>,
                  String(a.cgpa),
                  warningBadge(a.warning),
                  a.lastMeeting ?? "—",
                ])}
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Upcoming appointments</CardTitle>
          </CardHeader>
          <CardContent>
            <SimpleTable
              columns={["Student", "When", "Topic", "Status"]}
              rows={mockAppointments
                .filter((a) => a.status === "scheduled" || a.status === "requested")
                .map((a) => [
                  a.studentName,
                  a.datetime.slice(0, 16).replace("T", " "),
                  a.topic,
                  statusBadge(a.status),
                ])}
            />
          </CardContent>
        </Card>
      </div>
    </ModuleHub>
  );
}

export function AdvisingStudentsPage() {
  return (
    <ModuleHub
      title="Advisees"
      description="Students assigned to academic advisors."
      breadcrumbs={[...breadcrumbs, { label: "Advisees" }]}
      tabs={ADVISING_TABS}
    >
      <SimpleTable
        columns={["Student ID", "Name", "Program", "Sem", "CGPA", "Credits", "Warning", ""]}
        rows={mockAdvisees.map((a) => [
          a.studentId,
          a.name,
          a.program,
          String(a.semester),
          String(a.cgpa),
          String(a.credits),
          warningBadge(a.warning),
          <Button key={a.id} asChild size="sm" variant="outline">
            <Link href={`/advising/students/${a.id}`}>Profile</Link>
          </Button>,
        ])}
      />
    </ModuleHub>
  );
}

export function AdvisingStudentDetailPage({ id }: { id: string }) {
  const advisee = getAdvisee(id) ?? mockAdvisees[0];
  const notes = mockAdvisingNotes.filter((n) => n.studentId === advisee.studentId);
  const appts = mockAppointments.filter((a) => a.studentId === advisee.studentId);
  const recs = mockRecommendations.filter((r) => r.studentId === advisee.studentId);
  const reqs = mockAdvisingRequests.filter((r) => r.studentId === advisee.studentId);
  const advisor = mockAdvisors.find((a) => a.id === advisee.advisorId);

  return (
    <ModuleHub
      title={advisee.name}
      description={`${advisee.studentId} · ${advisee.program}`}
      breadcrumbs={[...breadcrumbs, { label: "Advisees", href: "/advising/students" }, { label: advisee.name }]}
      tabs={ADVISING_TABS}
      actions={
        <MockActionButton
          label="Add note"
          fields={[
            { name: "category", label: "Category", type: "select", options: ["academic", "career", "personal", "general"], required: true },
            { name: "body", label: "Note", type: "textarea", required: true },
          ]}
          submitLabel="Save note"
        />
      }
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <InfoCard label="CGPA" value={advisee.cgpa} />
        <InfoCard label="Credits" value={advisee.credits} />
        <InfoCard label="Semester" value={advisee.semester} />
        <InfoCard label="Standing" value={advisee.warning === "none" ? "Good" : advisee.warning} />
      </div>

      {advisor ? (
        <Card className="mt-6">
          <CardHeader><CardTitle>Advisor</CardTitle></CardHeader>
          <CardContent className="text-sm">
            <p className="font-medium">{advisor.name}</p>
            <p className="text-[var(--muted)]">{advisor.title}</p>
            <p className="mt-2 text-[var(--muted)]">{advisor.office} · {advisor.email}</p>
          </CardContent>
        </Card>
      ) : null}

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Notes</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {notes.map((n) => (
              <div key={n.id} className="rounded-lg border border-[var(--border-subtle)] p-3 text-sm">
                <div className="flex items-center justify-between gap-2">
                  <Badge variant="outline" className="capitalize">{n.category}</Badge>
                  <span className="text-xs text-[var(--muted)]">{n.createdAt}</span>
                </div>
                <p className="mt-2">{n.body}</p>
                <p className="mt-1 text-xs text-[var(--muted)]">{n.author}{n.private ? " · private" : ""}</p>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Recommendations</CardTitle></CardHeader>
          <CardContent>
            <SimpleTable
              columns={["Recommendation", "Type", "Status"]}
              rows={recs.map((r) => [r.title, r.type, statusBadge(r.status)])}
            />
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Appointments</CardTitle></CardHeader>
          <CardContent>
            <SimpleTable
              columns={["When", "Topic", "Status"]}
              rows={appts.map((a) => [a.datetime.slice(0, 16).replace("T", " "), a.topic, statusBadge(a.status)])}
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Requests</CardTitle></CardHeader>
          <CardContent>
            <SimpleTable
              columns={["Subject", "Type", "Status"]}
              rows={reqs.map((r) => [r.subject, r.type, statusBadge(r.status)])}
            />
          </CardContent>
        </Card>
      </div>
    </ModuleHub>
  );
}

export function AdvisingAppointmentsPage() {
  return (
    <ModuleHub title="Appointments" description="Advisor calendar." breadcrumbs={[...breadcrumbs, { label: "Appointments" }]} tabs={ADVISING_TABS}>
      <SimpleTable
        columns={["Student", "Advisor", "When", "Mode", "Topic", "Status"]}
        rows={mockAppointments.map((a) => [
          a.studentName,
          a.advisorName,
          a.datetime.slice(0, 16).replace("T", " "),
          a.mode.replace("_", " "),
          a.topic,
          statusBadge(a.status),
        ])}
      />
    </ModuleHub>
  );
}

export function AdvisingRequestsPage() {
  return (
    <ModuleHub title="Requests" description="Meeting and petition requests." breadcrumbs={[...breadcrumbs, { label: "Requests" }]} tabs={ADVISING_TABS}>
      <SimpleTable
        columns={["Student", "Type", "Subject", "Status", "Created"]}
        rows={mockAdvisingRequests.map((r) => [r.studentName, r.type, r.subject, statusBadge(r.status), r.createdAt])}
      />
    </ModuleHub>
  );
}

export function StudentAdvisingPage() {
  const advisor = mockAdvisors[0];
  const myAppts = mockAppointments.filter((a) => a.studentId === "CS-2022-0421");
  const myNotes = mockAdvisingNotes.filter((n) => n.studentId === "CS-2022-0421" && !n.private);
  const myRecs = mockRecommendations.filter((r) => r.studentId === "CS-2022-0421");

  return (
    <ModuleHub
      title="Academic Advising"
      description="Your advisor, appointments, notes, and recommendations."
      breadcrumbs={[{ label: "Student", href: "/student/dashboard" }, { label: "Advising" }]}
      actions={
        <MockActionButton
          label="Request meeting"
          fields={[
            { name: "topic", label: "Topic", required: true },
            { name: "date", label: "Preferred date", type: "date", required: true },
            { name: "mode", label: "Mode", type: "select", options: ["in_person", "online"], required: true },
            { name: "notes", label: "Notes", type: "textarea" },
          ]}
          submitLabel="Request"
          icon={<Calendar className="size-4" />}
        />
      }
    >
      <Card>
        <CardContent className="flex flex-wrap items-start justify-between gap-4 p-5">
          <div>
            <p className="text-xs text-[var(--muted)]">Your advisor</p>
            <p className="mt-1 text-lg font-semibold">{advisor.name}</p>
            <p className="text-sm text-[var(--muted)]">{advisor.title}</p>
            <p className="mt-2 text-sm text-[var(--muted)]">{advisor.office}</p>
            <p className="text-sm text-[var(--muted)]">{advisor.email}</p>
          </div>
          <MockToastButton label="Email advisor" message="Compose email opened (demo)." variant="outline" />
        </CardContent>
      </Card>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Appointments</CardTitle></CardHeader>
          <CardContent>
            <SimpleTable
              columns={["When", "Topic", "Status"]}
              rows={myAppts.map((a) => [a.datetime.slice(0, 16).replace("T", " "), a.topic, statusBadge(a.status)])}
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Recommendations</CardTitle></CardHeader>
          <CardContent>
            <SimpleTable
              columns={["Item", "Type", "Status"]}
              rows={myRecs.map((r) => [r.title, r.type, statusBadge(r.status)])}
            />
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader><CardTitle>Shared notes</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {myNotes.map((n) => (
            <div key={n.id} className="rounded-lg border border-[var(--border-subtle)] p-3 text-sm">
              <p>{n.body}</p>
              <p className="mt-1 text-xs text-[var(--muted)]">{n.author} · {n.createdAt}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </ModuleHub>
  );
}

export function TeacherAdvisingPage() {
  return (
    <ModuleHub
      title="Advising"
      description="Counselor / advisor view of advisees and meetings."
      breadcrumbs={[{ label: "Teacher", href: "/teacher/dashboard" }, { label: "Advising" }]}
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Advisees" value={advisingStats.totalAdvisees} icon={Users} />
        <KpiCard label="Meetings" value={advisingStats.meetingsThisWeek} icon={Calendar} />
        <KpiCard label="At risk" value={advisingStats.atRiskStudents} icon={AlertTriangle} changeType="negative" />
        <KpiCard label="Requests" value={advisingStats.openRequests} icon={MessageSquare} />
      </div>
      <Card className="mt-6">
        <CardHeader><CardTitle>Advisees</CardTitle></CardHeader>
        <CardContent>
          <SimpleTable
            columns={["Name", "Program", "CGPA", "Warning", ""]}
            rows={mockAdvisees.slice(0, 5).map((a) => [
              a.name,
              a.program,
              String(a.cgpa),
              warningBadge(a.warning),
              <Button key={a.id} asChild size="sm" variant="outline">
                <Link href={`/advising/students/${a.id}`}>Open</Link>
              </Button>,
            ])}
          />
        </CardContent>
      </Card>
    </ModuleHub>
  );
}
