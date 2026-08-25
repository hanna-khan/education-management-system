"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  Calendar,
  GraduationCap,
  Heart,
  Search,
  Users,
  UsersRound,
} from "lucide-react";
import { ModuleHub, InfoCard, SimpleTable } from "@/components/shared/module-hub";
import { KpiCard } from "@/components/shared/kpi-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { MockActionButton, MockToastButton } from "@/components/shared/mock-action";
import {
  ALUMNI_TABS,
  alumniStats,
  mockAlumniEvents,
  mockAlumniProfiles,
  mockDirectory,
  mockDonations,
  mockMentorshipRequests,
  studentAlumniMentorshipSummary,
} from "@/mock/alumni";
import { formatCurrency, formatNumber } from "@/lib/utils";

const breadcrumbs = [{ label: "Dashboard", href: "/dashboard" }, { label: "Alumni" }];

function statusBadge(status: string) {
  const map: Record<string, "default" | "success" | "warning" | "error" | "info" | "outline"> = {
    employed: "success",
    self_employed: "info",
    studying: "info",
    seeking: "warning",
    retired: "outline",
    upcoming: "info",
    ongoing: "success",
    completed: "success",
    cancelled: "outline",
    pending: "warning",
    accepted: "success",
    active: "success",
    declined: "error",
    pledged: "warning",
    received: "success",
    processing: "info",
  };
  return (
    <Badge variant={map[status] ?? "outline"} className="capitalize">
      {status.replace(/_/g, " ")}
    </Badge>
  );
}

export function AlumniDashboardPage() {
  return (
    <ModuleHub
      title="Alumni"
      description="NED University Alumni Association — directory, events, mentorship, and donations."
      breadcrumbs={breadcrumbs}
      tabs={ALUMNI_TABS}
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <KpiCard label="Total alumni" value={formatNumber(alumniStats.totalAlumni)} icon={UsersRound} />
        <KpiCard label="Active profiles" value={formatNumber(alumniStats.activeProfiles)} icon={Users} />
        <KpiCard label="Employed" value={`${alumniStats.employedPct}%`} icon={GraduationCap} changeType="positive" />
        <KpiCard label="Mentorship requests" value={alumniStats.mentorshipRequests} icon={Heart} />
        <KpiCard label="Active mentorships" value={alumniStats.activeMentorships} icon={Users} />
        <KpiCard label="Donations this year" value={formatCurrency(alumniStats.donationsThisYear)} icon={Heart} />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Upcoming events</CardTitle>
            <Button asChild size="sm" variant="outline"><Link href="/alumni/events">All events</Link></Button>
          </CardHeader>
          <CardContent>
            <SimpleTable
              columns={["Event", "Date", "City", "Registrations", "Status"]}
              rows={mockAlumniEvents.filter((e) => e.status === "upcoming").map((e) => [e.title, e.date, e.city, `${e.registrations}/${e.capacity}`, statusBadge(e.status)])}
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Recent mentorship activity</CardTitle></CardHeader>
          <CardContent>
            <SimpleTable
              columns={["Student", "Alumni", "Topic", "Status"]}
              rows={mockMentorshipRequests.slice(0, 4).map((m) => [m.studentName, m.alumniName, m.topic.slice(0, 30) + "…", statusBadge(m.status)])}
            />
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader><CardTitle>Recent donations</CardTitle></CardHeader>
        <CardContent>
          <SimpleTable
            columns={["Donation", "Alumni", "Amount", "Purpose", "Status"]}
            rows={mockDonations.map((d) => [d.donationId, d.alumniName, formatCurrency(d.amount), d.purpose, statusBadge(d.status)])}
          />
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader><CardTitle>Mentorship queue</CardTitle></CardHeader>
        <CardContent>
          <SimpleTable
            columns={["Request", "Student", "Alumni", "Topic", "Status"]}
            rows={mockMentorshipRequests.map((m) => [m.requestId, m.studentName, m.alumniName, m.topic, statusBadge(m.status)])}
          />
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader><CardTitle>Alumni by graduation year</CardTitle></CardHeader>
        <CardContent>
          <SimpleTable
            columns={["Year", "Alumni", "Sample profiles"]}
            rows={[
              ["2012", "1", "Fatima Zahra Siddiqui"],
              ["2015", "1", "Dr. Imran Qureshi"],
              ["2018", "1", "Ayesha Khan"],
              ["2020", "1", "Hassan Raza Jaffery"],
              ["2022", "1", "Bilal Ahmed"],
            ]}
          />
        </CardContent>
      </Card>
    </ModuleHub>
  );
}

export function AlumniDirectoryPage() {
  const [q, setQ] = useState("");
  const filtered = useMemo(() => {
    const needle = q.toLowerCase();
    if (!needle) return mockDirectory;
    return mockDirectory.filter(
      (d) =>
        d.name.toLowerCase().includes(needle) ||
        d.program.toLowerCase().includes(needle) ||
        (d.company?.toLowerCase().includes(needle) ?? false) ||
        d.city.toLowerCase().includes(needle),
    );
  }, [q]);

  return (
    <ModuleHub title="Alumni Directory" description="Search alumni by name, program, company, or city." breadcrumbs={[...breadcrumbs, { label: "Directory" }]} tabs={ALUMNI_TABS}>
      <div className="relative mb-4 max-w-md">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[var(--muted)]" />
        <Input className="pl-9" placeholder="Search alumni…" value={q} onChange={(e) => setQ(e.target.value)} />
      </div>
      <SimpleTable
        columns={["Name", "Grad year", "Program", "Company", "Role", "City", "Mentor"]}
        rows={filtered.map((d) => [d.name, String(d.graduationYear), d.program, d.company ?? "—", d.role ?? "—", d.city, d.mentorshipAvailable ? "Available" : "—"])}
      />
    </ModuleHub>
  );
}

export function AlumniProfilesPage() {
  return (
    <ModuleHub title="Alumni Profiles" description="Detailed alumni profile records." breadcrumbs={[...breadcrumbs, { label: "Profiles" }]} tabs={ALUMNI_TABS}>
      <SimpleTable
        columns={["Alumni ID", "Name", "Program", "Grad year", "Company", "Role", "City", "Employment", "Mentor"]}
        rows={mockAlumniProfiles.map((p) => [p.alumniId, p.name, p.program, String(p.graduationYear), p.currentCompany ?? "—", p.currentRole ?? "—", p.city, statusBadge(p.employmentStatus), p.mentorshipAvailable ? "Yes" : "No"])}
      />
      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        {mockAlumniProfiles.map((p) => (
          <Card key={p.id}>
            <CardHeader>
              <CardTitle className="text-base">{p.name}</CardTitle>
              <p className="text-sm text-[var(--muted)]">{p.alumniId} · Class of {p.graduationYear}</p>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p><span className="text-[var(--muted)]">Program: </span>{p.program} · {p.department}</p>
              <p><span className="text-[var(--muted)]">Current: </span>{p.currentRole ?? "—"} at {p.currentCompany ?? "—"}</p>
              <p><span className="text-[var(--muted)]">City: </span>{p.city}</p>
              <p><span className="text-[var(--muted)]">Contact: </span>{p.email} · {p.phone}</p>
              <div className="flex gap-2 pt-2">
                {statusBadge(p.employmentStatus)}
                {p.mentorshipAvailable ? <Badge variant="success">Mentor available</Badge> : null}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </ModuleHub>
  );
}

export function AlumniEventsPage() {
  return (
    <ModuleHub title="Alumni Events" description="Reunions, networking, and fundraising events." breadcrumbs={[...breadcrumbs, { label: "Events" }]} tabs={ALUMNI_TABS}
      actions={<MockActionButton label="Create event" fields={[{ name: "title", label: "Title", required: true }, { name: "type", label: "Type", type: "select", options: ["reunion", "networking", "seminar", "fundraising", "workshop"], required: true }, { name: "date", label: "Date", type: "date", required: true }, { name: "venue", label: "Venue", required: true }]} submitLabel="Create" icon={<Calendar className="size-4" />} />}
    >
      <SimpleTable
        columns={["Event", "Type", "Date", "Venue", "City", "Registrations", "Status"]}
        rows={mockAlumniEvents.map((e) => [e.title, e.type, e.date, e.venue, e.city, `${e.registrations}/${e.capacity}`, statusBadge(e.status)])}
      />
      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        {mockAlumniEvents.map((e) => (
          <Card key={e.id}>
            <CardHeader className="flex flex-row items-start justify-between">
              <CardTitle className="text-base">{e.title}</CardTitle>
              {statusBadge(e.status)}
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p className="capitalize text-[var(--muted)]">{e.type} · {e.city}</p>
              <p>{e.date} · {e.venue}</p>
              <Badge variant="outline">{e.registrations}/{e.capacity} registered</Badge>
              {e.status === "upcoming" ? (
                <MockToastButton className="mt-2" label="Register" message="Event registration confirmed (demo)." size="sm" />
              ) : null}
            </CardContent>
          </Card>
        ))}
      </div>
    </ModuleHub>
  );
}

export function AlumniMentorshipPage() {
  return (
    <ModuleHub
      title="Mentorship"
      description="Student-alumni mentorship requests and active pairings."
      breadcrumbs={[...breadcrumbs, { label: "Mentorship" }]}
      tabs={ALUMNI_TABS}
      actions={
        <MockActionButton
          label="Respond to request"
          title="Alumni mentorship response"
          fields={[
            { name: "requestId", label: "Request ID", required: true },
            { name: "decision", label: "Decision", type: "select", options: ["accept", "decline"], required: true },
            { name: "response", label: "Message to student", type: "textarea", required: true },
          ]}
          submitLabel="Send response"
          successMessage="Mentorship response sent to student (demo)."
        />
      }
    >
      <SimpleTable
        columns={["Request", "Student", "Alumni", "Topic", "Requested", "Status", "Response"]}
        rows={mockMentorshipRequests.map((m) => [
          m.requestId,
          m.studentName,
          m.alumniName,
          m.topic,
          m.requestedAt,
          statusBadge(m.status),
          m.response ? m.response.slice(0, 40) + "…" : "—",
        ])}
      />
      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        {mockMentorshipRequests.map((m) => (
          <Card key={m.id}>
            <CardHeader className="flex flex-row items-start justify-between">
              <CardTitle className="text-base">{m.requestId}</CardTitle>
              {statusBadge(m.status)}
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p><span className="text-[var(--muted)]">Student: </span>{m.studentName} · {m.studentProgram}</p>
              <p><span className="text-[var(--muted)]">Alumni: </span>{m.alumniName}</p>
              <p><span className="text-[var(--muted)]">Topic: </span>{m.topic}</p>
              <p className="italic text-[var(--muted)]">&ldquo;{m.message}&rdquo;</p>
              {m.response ? <p className="border-l-2 border-[var(--brand-primary)] pl-3">{m.response}</p> : null}
              {m.status === "pending" ? (
                <div className="flex gap-2 pt-2">
                  <MockToastButton label="Accept" message="Mentorship accepted (demo)." size="sm" />
                  <MockToastButton label="Decline" message="Mentorship declined (demo)." size="sm" variant="outline" />
                </div>
              ) : null}
            </CardContent>
          </Card>
        ))}
      </div>
    </ModuleHub>
  );
}

export function AlumniDonationsPage() {
  return (
    <ModuleHub title="Donations" description="Alumni contributions to NED endowment and funds." breadcrumbs={[...breadcrumbs, { label: "Donations" }]} tabs={ALUMNI_TABS}>
      <div className="mb-4 grid gap-4 sm:grid-cols-2">
        <InfoCard label="Total this year" value={formatCurrency(alumniStats.donationsThisYear)} />
        <InfoCard label="Donors" value={mockDonations.length} />
      </div>
      <SimpleTable
        columns={["Donation", "Alumni", "Amount", "Purpose", "Date", "Receipt", "Status"]}
        rows={mockDonations.map((d) => [d.donationId, d.alumniName, formatCurrency(d.amount), d.purpose, d.donatedAt, d.receiptNo ?? "—", statusBadge(d.status)])}
      />
      <Card className="mt-6">
        <CardHeader><CardTitle>Donation funds</CardTitle></CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-2 text-sm">
          {[
            ["Student Scholarship Fund", "Merit and need-based scholarships for BS students"],
            ["Lab Equipment Fund", "Computer Science and Engineering lab upgrades"],
            ["Library Digital Resources", "E-journals and online database subscriptions"],
            ["Campus Infrastructure", "Hostel and sports facility improvements"],
          ].map(([title, desc]) => (
            <div key={title} className="rounded-lg border border-[var(--border-subtle)] p-4">
              <p className="font-medium">{title}</p>
              <p className="mt-1 text-[var(--muted)]">{desc}</p>
              <MockToastButton className="mt-2" label="Donate" message="Donation form opened (demo)." size="sm" variant="outline" />
            </div>
          ))}
        </CardContent>
      </Card>
      <Card className="mt-6">
        <CardHeader><CardTitle>Tax receipt information</CardTitle></CardHeader>
        <CardContent className="text-sm text-[var(--muted)]">
          <p>Donations to NED University Endowment Fund qualify for tax deduction under applicable Pakistan tax laws. Receipts are issued within 7 business days of processing.</p>
        </CardContent>
      </Card>
    </ModuleHub>
  );
}

export function StudentAlumniPage() {
  const summary = studentAlumniMentorshipSummary;
  const myRequests = mockMentorshipRequests.filter((m) => m.studentId === "CS-2022-0421");
  const availableMentors = mockAlumniProfiles.filter((p) => p.mentorshipAvailable);

  return (
    <ModuleHub
      title="Alumni Mentorship"
      description="Request mentorship from NED alumni."
      breadcrumbs={[{ label: "Student", href: "/student/dashboard" }, { label: "Alumni Mentorship" }]}
      actions={
        <MockActionButton
          label="Request mentorship"
          title="Alumni mentorship request"
          fields={[
            { name: "alumni", label: "Alumni mentor", type: "select", options: availableMentors.map((p) => p.name), required: true },
            { name: "topic", label: "Topic", required: true },
            { name: "message", label: "Message", type: "textarea", required: true },
          ]}
          submitLabel="Send request"
          successMessage="Mentorship request sent to alumni (demo)."
        />
      }
    >
      <div className="grid gap-4 sm:grid-cols-3">
        <InfoCard label="Pending requests" value={summary.pendingRequests} />
        <InfoCard label="Active mentorships" value={summary.activeMentorships} />
        <InfoCard label="Available mentors" value={summary.availableMentors} />
      </div>

      {myRequests.length > 0 ? (
        <Card className="mt-6">
          <CardHeader><CardTitle>My mentorship requests</CardTitle></CardHeader>
          <CardContent>
            <SimpleTable
              columns={["Request", "Alumni", "Topic", "Requested", "Status", "Response"]}
              rows={myRequests.map((m) => [m.requestId, m.alumniName, m.topic, m.requestedAt, statusBadge(m.status), m.response ?? "Awaiting response"])}
            />
          </CardContent>
        </Card>
      ) : null}

      <Card className="mt-6">
        <CardHeader><CardTitle>Available mentors</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {availableMentors.slice(0, 4).map((p) => (
            <div key={p.id} className="flex items-center justify-between rounded-lg border border-[var(--border-subtle)] p-3 text-sm">
              <div>
                <p className="font-medium">{p.name}</p>
                <p className="text-[var(--muted)]">{p.currentRole} at {p.currentCompany} · Class of {p.graduationYear}</p>
              </div>
              <MockActionButton label="Request" size="sm" variant="outline" fields={[{ name: "topic", label: "Topic", required: true }, { name: "message", label: "Message", type: "textarea", required: true }]} submitLabel="Send" successMessage={`Request sent to ${p.name} (demo).`} />
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader><CardTitle>Alumni network benefits</CardTitle></CardHeader>
        <CardContent className="space-y-2 text-sm text-[var(--muted)]">
          <p>• Connect with {summary.availableMentors}+ alumni mentors across Pakistan</p>
          <p>• Attend reunions, networking dinners, and industry seminars</p>
          <p>• Access career referrals through the NED Alumni Association</p>
          <p>• Contribute to scholarships and lab equipment through the endowment fund</p>
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader><CardTitle>Upcoming alumni events</CardTitle></CardHeader>
        <CardContent>
          <SimpleTable
            columns={["Event", "Date", "City", "Registrations"]}
            rows={mockAlumniEvents.filter((e) => e.status === "upcoming").map((e) => [e.title, e.date, e.city, `${e.registrations}/${e.capacity}`])}
          />
        </CardContent>
      </Card>
    </ModuleHub>
  );
}
