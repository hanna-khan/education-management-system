"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  Award,
  Calendar,
  ClipboardList,
  Home,
  Medal,
  Star,
  Trophy,
  Users,
  UsersRound,
} from "lucide-react";
import { ModuleHub, InfoCard, SimpleTable } from "@/components/shared/module-hub";
import { KpiCard } from "@/components/shared/kpi-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/shared/empty-state";
import { MockActionButton, MockToastButton } from "@/components/shared/mock-action";
import { useApp } from "@/hooks/use-app";
import {
  clubsStats,
  getClubsTabs,
  mockAchievements,
  mockActivityTypes,
  mockClubApplications,
  mockClubEvents,
  mockClubMembers,
  mockHouseCompetitions,
  mockHousePoints,
  mockHouses,
  mockOrganizations,
  studentClubsSummary,
} from "@/mock/clubs";
import { formatCurrency, formatNumber } from "@/lib/utils";

const breadcrumbs = [{ label: "Dashboard", href: "/dashboard" }, { label: "Clubs & Societies" }];

function statusBadge(status: string) {
  const map: Record<string, "default" | "success" | "warning" | "error" | "info" | "outline"> = {
    active: "success",
    inactive: "outline",
    pending_approval: "warning",
    suspended: "error",
    submitted: "info",
    under_review: "warning",
    approved: "success",
    rejected: "error",
    scheduled: "info",
    ongoing: "warning",
    completed: "success",
    cancelled: "error",
    pending: "warning",
    club: "info",
    society: "default",
    sport: "success",
    student_org: "outline",
    university: "info",
    provincial: "default",
    national: "success",
    international: "warning",
    upcoming: "info",
  };
  return (
    <Badge variant={map[status] ?? "outline"} className="capitalize">
      {status.replace(/_/g, " ")}
    </Badge>
  );
}

function useClubsTabs() {
  const { institutionMode } = useApp();
  return getClubsTabs(institutionMode);
}

export function ClubsDashboardPage() {
  const tabs = useClubsTabs();
  const { institutionMode, t, institution } = useApp();

  return (
    <ModuleHub
      title={t("clubs")}
      description={`${institution.shortName} — student organizations and activities.`}
      breadcrumbs={[{ label: "Dashboard", href: "/dashboard" }, { label: t("clubs") }]}
      tabs={tabs}
      actions={
        <MockActionButton
          label="Approve application"
          title="Review club application"
          fields={[
            { name: "applicationId", label: "Application ID", required: true, placeholder: "CLB-APP-088" },
            { name: "decision", label: "Decision", type: "select", options: ["approve", "reject"], required: true },
            { name: "notes", label: "Notes", type: "textarea" },
          ]}
          submitLabel="Submit review"
          icon={<ClipboardList className="size-4" />}
        />
      }
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Organizations" value={clubsStats.totalOrganizations} icon={UsersRound} change="Karachi campus" />
        <KpiCard label="Active members" value={formatNumber(clubsStats.activeMembers)} icon={Users} />
        <KpiCard label="Upcoming events" value={clubsStats.upcomingEvents} icon={Calendar} changeType="positive" />
        <KpiCard label="Pending applications" value={clubsStats.pendingApplications} icon={ClipboardList} changeType="negative" />
      </div>
      <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Achievements (2026)" value={clubsStats.achievementsThisYear} icon={Award} changeType="positive" />
        {institutionMode === "school" ? (
          <>
            <KpiCard label="Houses" value={clubsStats.houses ?? 4} icon={Home} />
            <KpiCard label="Total house points" value={formatNumber(clubsStats.housePointsTotal ?? 0)} icon={Trophy} />
          </>
        ) : (
          <>
            <KpiCard label="Societies" value={mockOrganizations.filter((o) => o.type === "society").length} icon={Medal} />
            <KpiCard label="Sports teams" value={mockOrganizations.filter((o) => o.type === "sport").length} icon={Trophy} />
          </>
        )}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Pending applications</CardTitle>
            <Button asChild variant="outline" size="sm">
              <Link href="/clubs/applications">View all</Link>
            </Button>
          </CardHeader>
          <CardContent>
            <SimpleTable
              columns={["Application", "Student", "Organization", "Submitted", "Status", ""]}
              rows={mockClubApplications
                .filter((a) => a.status === "submitted" || a.status === "under_review")
                .map((a) => [
                  a.applicationId,
                  a.studentName,
                  a.organizationName,
                  a.submittedAt,
                  statusBadge(a.status),
                  <MockActionButton
                    key={a.id}
                    label="Review"
                    size="sm"
                    variant="outline"
                    fields={[
                      { name: "decision", label: "Decision", type: "select", options: ["approve", "reject"], required: true },
                    ]}
                    submitLabel="Submit"
                    successMessage={`Application ${a.applicationId} reviewed (demo).`}
                  />,
                ])}
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Organization types</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            {(["club", "society", "sport", "student_org"] as const).map((type) => {
              const count = mockOrganizations.filter((o) => o.type === type).length;
              const pct = Math.round((count / mockOrganizations.length) * 100);
              return (
                <div key={type}>
                  <div className="flex items-center justify-between text-sm">
                    <span className="capitalize text-[var(--muted)]">{type.replace(/_/g, " ")}</span>
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
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Upcoming events</CardTitle>
            <Button asChild variant="outline" size="sm"><Link href="/clubs/events">All events</Link></Button>
          </CardHeader>
          <CardContent>
            <SimpleTable
              columns={["Event", "Organization", "Date", "Venue", "Status"]}
              rows={mockClubEvents.filter((e) => e.status === "scheduled" || e.status === "ongoing").map((e) => [
                e.title.slice(0, 35) + "…",
                e.organizationName.split(" ")[0],
                e.date,
                e.venue.slice(0, 20) + "…",
                statusBadge(e.status),
              ])}
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Recent achievements</CardTitle></CardHeader>
          <CardContent className="space-y-3 text-sm">
            {mockAchievements.slice(0, 4).map((a) => (
              <div key={a.id} className="flex items-center justify-between rounded-lg border border-[var(--border-subtle)] p-3">
                <div>
                  <p className="font-medium">{a.title}</p>
                  <p className="text-[var(--muted)]">{a.organizationName} · {a.date}</p>
                </div>
                {statusBadge(a.level)}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {institutionMode === "school" ? (
        <Card className="mt-6">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>House standings</CardTitle>
            <Button asChild variant="outline" size="sm"><Link href="/clubs/houses">View houses</Link></Button>
          </CardHeader>
          <CardContent>
            <SimpleTable
              columns={["Rank", "House", "House Master", "Students", "Points"]}
              rows={mockHouses.map((h) => [String(h.rank), h.name, h.houseMaster, String(h.students), formatNumber(h.totalPoints)])}
            />
          </CardContent>
        </Card>
      ) : null}
    </ModuleHub>
  );
}

export function ClubsOrganizationsPage() {
  const tabs = useClubsTabs();
  const [filter, setFilter] = useState<string>("all");
  const filtered = useMemo(() => {
    if (filter === "all") return mockOrganizations;
    return mockOrganizations.filter((o) => o.type === filter);
  }, [filter]);

  return (
    <ModuleHub
      title="Organizations"
      description="Clubs, societies, sports teams, and student organizations at NED University."
      breadcrumbs={[...breadcrumbs, { label: "Organizations" }]}
      tabs={tabs}
      actions={
        <MockActionButton
          label="Register organization"
          fields={[
            { name: "name", label: "Name", required: true },
            { name: "type", label: "Type", type: "select", options: ["club", "society", "sport", "student_org"], required: true },
            { name: "advisor", label: "Faculty advisor", required: true },
          ]}
          submitLabel="Register"
          icon={<UsersRound className="size-4" />}
        />
      }
    >
      <div className="mb-4 flex flex-wrap gap-2">
        {["all", "club", "society", "sport", "student_org"].map((s) => (
          <Button key={s} size="sm" variant={filter === s ? "default" : "outline"} onClick={() => setFilter(s)} className="capitalize">
            {s.replace(/_/g, " ")}
          </Button>
        ))}
      </div>
      <SimpleTable
        columns={["Code", "Name", "Type", "Category", "Advisor", "President", "Members", "Status"]}
        rows={filtered.map((o) => [o.code, o.name, statusBadge(o.type), o.category, o.facultyAdvisor, o.president, String(o.members), statusBadge(o.status)])}
      />
      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        {filtered.slice(0, 4).map((o) => (
          <Card key={o.id}>
            <CardHeader className="flex flex-row items-start justify-between">
              <CardTitle className="text-base">{o.name}</CardTitle>
              {statusBadge(o.status)}
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p className="text-[var(--muted)]">{o.description}</p>
              <p><span className="text-[var(--muted)]">Meeting: </span>{o.meetingDay ?? "—"} · {o.venue ?? "—"}</p>
              <p><span className="text-[var(--muted)]">Founded: </span>{o.founded} · {o.members} members</p>
              <MockToastButton label="View members" message={`${o.name} member list opened (demo).`} size="sm" variant="outline" />
            </CardContent>
          </Card>
        ))}
      </div>
    </ModuleHub>
  );
}

export function ClubsMembersPage() {
  const tabs = useClubsTabs();
  return (
    <ModuleHub title="Members" description="Student memberships across all organizations." breadcrumbs={[...breadcrumbs, { label: "Members" }]} tabs={tabs}
      actions={<MockActionButton label="Add member" fields={[{ name: "studentId", label: "Student ID", required: true }, { name: "organization", label: "Organization", type: "select", options: mockOrganizations.map((o) => o.name), required: true }, { name: "role", label: "Role", type: "select", options: ["member", "secretary", "treasurer", "vice_president", "president"], required: true }]} submitLabel="Add" />}
    >
      <SimpleTable
        columns={["Student ID", "Name", "Program", "Organization", "Role", "Joined", "Status"]}
        rows={mockClubMembers.map((m) => [m.studentId, m.studentName, m.program, m.organizationName, m.role.replace(/_/g, " "), m.joinedAt, statusBadge(m.status)])}
      />
    </ModuleHub>
  );
}

export function ClubsEventsPage() {
  const tabs = useClubsTabs();
  return (
    <ModuleHub title="Events" description="Club and society events — workshops, competitions, cultural programs." breadcrumbs={[...breadcrumbs, { label: "Events" }]} tabs={tabs}
      actions={<MockActionButton label="Schedule event" fields={[{ name: "title", label: "Event title", required: true }, { name: "organization", label: "Organization", type: "select", options: mockOrganizations.map((o) => o.name), required: true }, { name: "date", label: "Date", type: "date", required: true }, { name: "budget", label: "Budget (PKR)", type: "number" }]} submitLabel="Schedule" icon={<Calendar className="size-4" />} />}
    >
      <div className="mb-4 grid gap-4 sm:grid-cols-3">
        <InfoCard label="Scheduled" value={String(mockClubEvents.filter((e) => e.status === "scheduled").length)} />
        <InfoCard label="Ongoing" value={String(mockClubEvents.filter((e) => e.status === "ongoing").length)} />
        <InfoCard label="Total budget (upcoming)" value={formatCurrency(mockClubEvents.filter((e) => e.status === "scheduled").reduce((s, e) => s + e.budget, 0))} />
      </div>
      <SimpleTable
        columns={["Event ID", "Title", "Organization", "Date", "Venue", "Attendees", "Budget", "Status"]}
        rows={mockClubEvents.map((e) => [e.eventId, e.title.slice(0, 40) + "…", e.organizationName, e.date, e.venue.slice(0, 25) + "…", String(e.expectedAttendees), formatCurrency(e.budget), statusBadge(e.status)])}
      />
    </ModuleHub>
  );
}

export function ClubsApplicationsPage() {
  const tabs = useClubsTabs();
  const [filter, setFilter] = useState<string>("all");
  const filtered = useMemo(() => {
    if (filter === "all") return mockClubApplications;
    return mockClubApplications.filter((a) => a.status === filter);
  }, [filter]);

  return (
    <ModuleHub title="Applications" description="Membership applications — faculty advisor and admin approval workflow." breadcrumbs={[...breadcrumbs, { label: "Applications" }]} tabs={tabs}>
      <div className="mb-4 flex flex-wrap gap-2">
        {["all", "submitted", "under_review", "approved", "rejected"].map((s) => (
          <Button key={s} size="sm" variant={filter === s ? "default" : "outline"} onClick={() => setFilter(s)} className="capitalize">
            {s.replace(/_/g, " ")}: {s === "all" ? mockClubApplications.length : mockClubApplications.filter((a) => a.status === s).length}
          </Button>
        ))}
      </div>
      {filtered.length === 0 ? (
        <EmptyState icon={ClipboardList} title="No applications" description="No applications match the selected filter." />
      ) : (
        <SimpleTable
          columns={["Application", "Student", "Organization", "Reason", "Submitted", "Reviewer", "Status", "Actions"]}
          rows={filtered.map((a) => [
            a.applicationId,
            a.studentName,
            a.organizationName,
            a.reason.slice(0, 35) + "…",
            a.submittedAt,
            a.reviewedBy ?? "—",
            statusBadge(a.status),
            <div key={a.id} className="flex gap-1">
              <MockActionButton label="Approve" size="sm" variant="outline" submitLabel="Approve" successMessage="Application approved (demo)." fields={[]} />
              <MockToastButton label="Reject" message="Application rejected (demo)." size="sm" variant="outline" />
            </div>,
          ])}
        />
      )}
    </ModuleHub>
  );
}

export function ClubsAchievementsPage() {
  const tabs = useClubsTabs();
  return (
    <ModuleHub title="Achievements" description="Awards, competitions, and recognitions — national and international." breadcrumbs={[...breadcrumbs, { label: "Achievements" }]} tabs={tabs}
      actions={<MockActionButton label="Record achievement" fields={[{ name: "title", label: "Title", required: true }, { name: "organization", label: "Organization", type: "select", options: mockOrganizations.map((o) => o.name), required: true }, { name: "level", label: "Level", type: "select", options: ["university", "provincial", "national", "international"], required: true }]} submitLabel="Record" icon={<Award className="size-4" />} />}
    >
      <SimpleTable
        columns={["Title", "Organization", "Student", "Level", "Date", "Award"]}
        rows={mockAchievements.map((a) => [a.title, a.organizationName, a.studentName ?? "Team", statusBadge(a.level), a.date, a.award ?? "—"])}
      />
      <Card className="mt-6">
        <CardHeader><CardTitle>Achievement highlights 2025–2026</CardTitle></CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-2">
          {mockAchievements.map((a) => (
            <div key={a.id} className="rounded-lg border border-[var(--border-subtle)] p-4 text-sm">
              <div className="flex items-start justify-between gap-2">
                <p className="font-medium">{a.title}</p>
                {statusBadge(a.level)}
              </div>
              <p className="mt-1 text-[var(--muted)]">{a.organizationName} · {a.date}</p>
              <p className="mt-2">{a.description}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </ModuleHub>
  );
}

export function ClubsHousesPage() {
  const tabs = useClubsTabs();
  return (
    <ModuleHub title="Houses" description="School house system — Jinnah, Iqbal, Liaquat, and Fatima houses." breadcrumbs={[...breadcrumbs, { label: "Houses" }]} tabs={tabs}
      actions={<MockActionButton label="Add house" fields={[{ name: "name", label: "House name", required: true }, { name: "master", label: "House master", required: true }]} submitLabel="Create" icon={<Home className="size-4" />} />}
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {mockHouses.map((h) => (
          <Card key={h.id}>
            <CardContent className="p-5">
              <div className="flex items-center gap-3">
                <div className="size-4 rounded-full" style={{ backgroundColor: h.color }} />
                <div>
                  <p className="font-semibold">{h.name}</p>
                  <p className="text-xs text-[var(--muted)]">Rank #{h.rank} · {h.code}</p>
                </div>
              </div>
              <div className="mt-4 space-y-1 text-sm">
                <p><span className="text-[var(--muted)]">House Master: </span>{h.houseMaster}</p>
                <p><span className="text-[var(--muted)]">Students: </span>{h.students}</p>
                <p><span className="text-[var(--muted)]">Points: </span>{formatNumber(h.totalPoints)}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <Card className="mt-6">
        <CardHeader><CardTitle>House competitions</CardTitle></CardHeader>
        <CardContent>
          <SimpleTable
            columns={["Competition", "Date", "Houses", "Winner", "Status"]}
            rows={mockHouseCompetitions.map((c) => [c.name, c.date, c.participatingHouses.length + " houses", c.winner ?? "—", statusBadge(c.status)])}
          />
        </CardContent>
      </Card>
    </ModuleHub>
  );
}

export function ClubsPointsPage() {
  const tabs = useClubsTabs();
  return (
    <ModuleHub title="House Points" description="Award and track house points for academics, sports, and discipline." breadcrumbs={[...breadcrumbs, { label: "House Points" }]} tabs={tabs}
      actions={<MockActionButton label="Award points" fields={[{ name: "house", label: "House", type: "select", options: mockHouses.map((h) => h.name), required: true }, { name: "student", label: "Student name", required: true }, { name: "points", label: "Points", type: "number", required: true }, { name: "reason", label: "Reason", required: true }, { name: "category", label: "Category", type: "select", options: ["Academics", "Sports", "Literary", "Discipline", "Community"], required: true }]} submitLabel="Award" icon={<Star className="size-4" />} />}
    >
      <SimpleTable
        columns={["House", "Student", "Points", "Category", "Reason", "Awarded by", "Date"]}
        rows={mockHousePoints.map((p) => [p.houseName, p.studentName, `+${p.points}`, p.category, p.reason, p.awardedBy, p.date])}
      />
      <Card className="mt-6">
        <CardHeader><CardTitle>Points leaderboard</CardTitle></CardHeader>
        <CardContent>
          <SimpleTable
            columns={["Rank", "House", "Total Points", "Recent (+)"]}
            rows={mockHouses.map((h) => {
              const recent = mockHousePoints.filter((p) => p.houseId === h.id).reduce((s, p) => s + p.points, 0);
              return [String(h.rank), h.name, formatNumber(h.totalPoints), `+${recent}`];
            })}
          />
        </CardContent>
      </Card>
    </ModuleHub>
  );
}

export function StudentClubsPage() {
  const summary = studentClubsSummary;
  return (
    <ModuleHub
      title="Clubs & Societies"
      description="Join organizations, view events, and track your memberships."
      breadcrumbs={[{ label: "Student", href: "/student/dashboard" }, { label: "Clubs" }]}
      actions={
        <MockActionButton
          label="Apply to join"
          title="Club membership application"
          fields={[
            { name: "organization", label: "Organization", type: "select", options: mockOrganizations.filter((o) => o.status === "active").map((o) => o.name), required: true },
            { name: "reason", label: "Why do you want to join?", type: "textarea", required: true },
          ]}
          submitLabel="Submit application"
          successMessage="Membership application submitted (demo)."
        />
      }
    >
      {summary.memberships.length > 0 ? (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {summary.memberships.map((m) => (
              <InfoCard key={m.organizationName} label={m.organizationName} value={m.role.replace(/_/g, " ")} sub={`Member since ${m.since}`} />
            ))}
          </div>
          <Card className="mt-6">
            <CardHeader><CardTitle>Upcoming events from your clubs</CardTitle></CardHeader>
            <CardContent>
              <SimpleTable
                columns={["Event", "Organization", "Date", "Venue"]}
                rows={summary.upcomingEvents.map((e) => [e.title, e.organizationName, e.date, e.venue])}
              />
            </CardContent>
          </Card>
        </>
      ) : (
        <EmptyState icon={UsersRound} title="No memberships yet" description="Apply to join a club or society to get started." />
      )}
      <Card className="mt-6">
        <CardHeader><CardTitle>Available organizations</CardTitle></CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-2">
          {mockOrganizations.filter((o) => o.status === "active").slice(0, 6).map((o) => (
            <div key={o.id} className="rounded-lg border border-[var(--border-subtle)] p-3 text-sm">
              <p className="font-medium">{o.name}</p>
              <p className="text-[var(--muted)]">{o.category} · {o.members} members</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </ModuleHub>
  );
}
