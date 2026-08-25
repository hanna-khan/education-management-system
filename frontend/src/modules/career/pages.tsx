"use client";

import Link from "next/link";
import {
  Briefcase,
  Building2,
  Calendar,
  FileText,
  GraduationCap,
  Handshake,
  Upload,
} from "lucide-react";
import { ModuleHub, InfoCard, SimpleTable } from "@/components/shared/module-hub";
import { KpiCard } from "@/components/shared/kpi-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/shared/empty-state";
import { MockActionButton, MockToastButton } from "@/components/shared/mock-action";
import {
  CAREER_TABS,
  careerStats,
  mockCareerApplications,
  mockCareerEvents,
  mockCareerFairs,
  mockCompanies,
  mockInternships,
  mockInterviews,
  mockJobs,
  mockPlacements,
  studentCareerSummary,
} from "@/mock/career";

const breadcrumbs = [{ label: "Dashboard", href: "/dashboard" }, { label: "Career & Internship" }];

function statusBadge(status: string) {
  const map: Record<string, "default" | "success" | "warning" | "error" | "info" | "outline"> = {
    published: "success",
    draft: "outline",
    pending_approval: "warning",
    closed: "error",
    rejected: "error",
    applied: "info",
    under_review: "warning",
    shortlisted: "info",
    interview: "info",
    offered: "success",
    accepted: "success",
    withdrawn: "outline",
    scheduled: "info",
    completed: "success",
    cancelled: "outline",
    no_show: "error",
    upcoming: "info",
    ongoing: "success",
    planning: "warning",
    confirmed: "success",
    placed: "success",
    seeking: "warning",
    not_seeking: "outline",
  };
  return (
    <Badge variant={map[status] ?? "outline"} className="capitalize">
      {status.replace(/_/g, " ")}
    </Badge>
  );
}

export function CareerDashboardPage() {
  return (
    <ModuleHub
      title="Career & Internship"
      description="NED Career Development Centre — jobs, internships, placements for university students."
      breadcrumbs={breadcrumbs}
      tabs={CAREER_TABS}
      actions={
        <MockActionButton
          label="Approve opportunity"
          title="Approve job/internship posting"
          fields={[
            { name: "opportunityId", label: "Opportunity ID", required: true },
            { name: "decision", label: "Decision", type: "select", options: ["approve", "reject"], required: true },
            { name: "notes", label: "Notes", type: "textarea" },
          ]}
          submitLabel="Submit"
          icon={<Handshake className="size-4" />}
        />
      }
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <KpiCard label="Applications" value={careerStats.totalApplications} icon={FileText} />
        <KpiCard label="Active internships" value={careerStats.activeInternships} icon={Briefcase} />
        <KpiCard label="Active jobs" value={careerStats.activeJobs} icon={Building2} />
        <KpiCard label="Upcoming interviews" value={careerStats.upcomingInterviews} icon={Calendar} />
        <KpiCard label="Offers extended" value={careerStats.offersExtended} icon={Handshake} changeType="positive" />
        <KpiCard label="Placements this year" value={careerStats.placementsThisYear} icon={GraduationCap} changeType="positive" />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Pending approval</CardTitle>
            <Button asChild size="sm" variant="outline"><Link href="/career/jobs">All jobs</Link></Button>
          </CardHeader>
          <CardContent>
            {(() => {
              const pending = [
                ...mockJobs.filter((j) => j.status === "pending_approval").map((j) => ({ title: j.title, companyName: j.companyName, kind: "Job", deadline: j.deadline, status: j.status })),
                ...mockInternships.filter((i) => i.status === "pending_approval").map((i) => ({ title: i.title, companyName: i.companyName, kind: "Internship", deadline: i.deadline, status: i.status })),
              ];
              if (pending.length === 0) {
                return <p className="text-sm text-[var(--muted)]">No opportunities pending approval.</p>;
              }
              return (
                <SimpleTable
                  columns={["Title", "Company", "Type", "Deadline", "Status"]}
                  rows={pending.map((o) => [o.title, o.companyName, o.kind, o.deadline, statusBadge(o.status)])}
                />
              );
            })()}
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Upcoming career fair</CardTitle></CardHeader>
          <CardContent>
            {mockCareerFairs.filter((f) => f.status !== "completed").map((f) => (
              <div key={f.id} className="space-y-2 text-sm">
                <p className="font-medium">{f.name}</p>
                <p className="text-[var(--muted)]">{f.date} · {f.venue}</p>
                <p>{f.companies} companies · {f.expectedStudents} expected students</p>
                {statusBadge(f.status)}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader><CardTitle>Application pipeline</CardTitle></CardHeader>
        <CardContent>
          <div className="mb-4 flex flex-wrap gap-2">
            {["applied", "under_review", "shortlisted", "interview", "offered", "rejected"].map((s) => (
              <Badge key={s} variant="outline" className="capitalize">
                {s.replace(/_/g, " ")}: {mockCareerApplications.filter((a) => a.status === s).length}
              </Badge>
            ))}
          </div>
          <SimpleTable
            columns={["Application", "Student", "Opportunity", "Company", "Status"]}
            rows={mockCareerApplications.slice(0, 8).map((a) => [a.applicationId, a.studentName, a.opportunityTitle, a.companyName, statusBadge(a.status)])}
          />
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader><CardTitle>Partner companies</CardTitle></CardHeader>
        <CardContent>
          <SimpleTable
            columns={["Company", "Industry", "City", "Opportunities"]}
            rows={mockCompanies.map((c) => [c.name, c.industry, c.city, String(c.activeOpportunities)])}
          />
        </CardContent>
      </Card>
    </ModuleHub>
  );
}

export function CareerJobsPage() {
  return (
    <ModuleHub title="Jobs" description="Full-time and part-time job postings." breadcrumbs={[...breadcrumbs, { label: "Jobs" }]} tabs={CAREER_TABS}
      actions={<MockActionButton label="Post job (company)" title="Company job posting" fields={[{ name: "title", label: "Job title", required: true }, { name: "company", label: "Company", required: true }, { name: "location", label: "Location", required: true }, { name: "salary", label: "Salary range (PKR)", required: true }, { name: "description", label: "Description", type: "textarea", required: true }]} submitLabel="Submit for approval" successMessage="Job posted — pending career office approval (demo)." />}
    >
      <SimpleTable
        columns={["Title", "Company", "Type", "Location", "Salary", "Deadline", "Applications", "Status"]}
        rows={mockJobs.map((j) => [j.title, j.companyName, j.type.replace(/_/g, " "), j.location, j.salaryRange, j.deadline, String(j.applications), statusBadge(j.status)])}
      />
      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        {mockJobs.map((j) => (
          <Card key={j.id}>
            <CardHeader className="flex flex-row items-start justify-between gap-2">
              <div>
                <CardTitle className="text-base">{j.title}</CardTitle>
                <p className="mt-1 text-sm text-[var(--muted)]">{j.companyName} · {j.location}</p>
              </div>
              {statusBadge(j.status)}
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p>{j.description}</p>
              <p className="text-[var(--muted)]">Salary: {j.salaryRange}</p>
              <div className="flex flex-wrap gap-1 pt-1">
                {j.skills.map((s) => <Badge key={s} variant="outline">{s}</Badge>)}
              </div>
              <div className="flex gap-2 pt-2">
                <Badge variant="outline">{j.applications} applications</Badge>
                <Badge variant="outline">Deadline {j.deadline}</Badge>
              </div>
              {j.status === "pending_approval" ? (
                <MockActionButton className="mt-2" label="Approve" size="sm" fields={[{ name: "notes", label: "Notes", type: "textarea" }]} submitLabel="Approve" successMessage="Job approved and published (demo)." />
              ) : null}
            </CardContent>
          </Card>
        ))}
      </div>
    </ModuleHub>
  );
}

export function CareerInternshipsPage() {
  return (
    <ModuleHub title="Internships" description="Summer and semester internships." breadcrumbs={[...breadcrumbs, { label: "Internships" }]} tabs={CAREER_TABS}
      actions={<MockActionButton label="Post internship" fields={[{ name: "title", label: "Title", required: true }, { name: "company", label: "Company", required: true }, { name: "stipend", label: "Stipend (PKR)", required: true }, { name: "duration", label: "Duration", required: true }]} submitLabel="Submit" successMessage="Internship posted for approval (demo)." />}
    >
      <SimpleTable
        columns={["Title", "Company", "Department", "Duration", "Stipend", "Deadline", "Applications", "Status"]}
        rows={mockInternships.map((i) => [i.title, i.companyName, i.department, i.duration, i.stipend, i.deadline, String(i.applications), statusBadge(i.status)])}
      />
      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        {mockInternships.map((i) => (
          <Card key={i.id}>
            <CardHeader className="flex flex-row items-start justify-between">
              <div>
                <CardTitle className="text-base">{i.title}</CardTitle>
                <p className="mt-1 text-sm text-[var(--muted)]">{i.companyName} · {i.department}</p>
              </div>
              {statusBadge(i.status)}
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p>{i.description}</p>
              <p className="text-[var(--muted)]">{i.duration} · Stipend {i.stipend} · {i.location}</p>
              <Badge variant="outline">{i.applications} applications · Deadline {i.deadline}</Badge>
            </CardContent>
          </Card>
        ))}
      </div>
    </ModuleHub>
  );
}

export function CareerCompaniesPage() {
  return (
    <ModuleHub title="Companies" description="Partner companies and recruiters." breadcrumbs={[...breadcrumbs, { label: "Companies" }]} tabs={CAREER_TABS}>
      <SimpleTable
        columns={["Company", "Industry", "City", "Contact", "Opportunities", "Partner since"]}
        rows={mockCompanies.map((c) => [c.name, c.industry, c.city, c.contactPerson, String(c.activeOpportunities), c.partnershipSince])}
      />
    </ModuleHub>
  );
}

export function CareerApplicationsPage() {
  return (
    <ModuleHub title="Applications" description="Student job and internship applications." breadcrumbs={[...breadcrumbs, { label: "Applications" }]} tabs={CAREER_TABS}>
      <div className="mb-4 flex flex-wrap gap-2">
        {["applied", "under_review", "shortlisted", "interview", "offered", "accepted", "rejected"].map((s) => (
          <Badge key={s} variant="outline" className="capitalize">
            {s.replace(/_/g, " ")}: {mockCareerApplications.filter((a) => a.status === s).length}
          </Badge>
        ))}
      </div>
      <SimpleTable
        columns={["Application", "Student", "Program", "Opportunity", "Company", "Applied", "CV", "Status"]}
        rows={mockCareerApplications.map((a) => [a.applicationId, a.studentName, a.program, a.opportunityTitle, a.companyName, a.appliedAt, a.cvUploaded ? "Yes" : "No", statusBadge(a.status)])}
      />
      <Card className="mt-6">
        <CardHeader><CardTitle>Application workflow</CardTitle></CardHeader>
        <CardContent className="flex flex-wrap items-center gap-2 text-sm">
          {["Applied", "Under review", "Shortlisted", "Interview", "Offered", "Accepted"].map((step, i) => (
            <div key={step} className="flex items-center gap-2">
              {i > 0 ? <span className="text-[var(--muted)]">→</span> : null}
              <Badge variant="outline">{step}</Badge>
            </div>
          ))}
        </CardContent>
      </Card>
    </ModuleHub>
  );
}

export function CareerInterviewsPage() {
  return (
    <ModuleHub title="Interviews" description="Scheduled interviews." breadcrumbs={[...breadcrumbs, { label: "Interviews" }]} tabs={CAREER_TABS}>
      <SimpleTable
        columns={["Student", "Company", "Opportunity", "Scheduled", "Mode", "Location", "Interviewer", "Status"]}
        rows={mockInterviews.map((i) => [i.studentName, i.companyName, i.opportunityTitle, i.scheduledAt, i.mode.replace(/_/g, " "), i.location, i.interviewer, statusBadge(i.status)])}
      />
    </ModuleHub>
  );
}

export function CareerEventsPage() {
  return (
    <ModuleHub title="Events & Career Fairs" description="Workshops, seminars, and career fairs." breadcrumbs={[...breadcrumbs, { label: "Events" }]} tabs={CAREER_TABS}
      actions={<MockActionButton label="Create event" fields={[{ name: "title", label: "Title", required: true }, { name: "type", label: "Type", type: "select", options: ["workshop", "seminar", "networking", "career_fair"], required: true }, { name: "date", label: "Date", type: "date", required: true }, { name: "venue", label: "Venue", required: true }]} submitLabel="Create" />}
    >
      <div className="mb-6">
        <h3 className="mb-3 text-sm font-medium">Career fairs</h3>
        <SimpleTable
          columns={["Fair", "Date", "Venue", "Companies", "Expected", "Status"]}
          rows={mockCareerFairs.map((f) => [f.name, f.date, f.venue, String(f.companies), String(f.expectedStudents), statusBadge(f.status)])}
        />
      </div>
      <h3 className="mb-3 text-sm font-medium">Events</h3>
      <SimpleTable
        columns={["Event", "Type", "Date", "Venue", "Registrations", "Capacity", "Status"]}
        rows={mockCareerEvents.map((e) => [e.title, e.type, e.date, e.venue, `${e.registrations}/${e.capacity}`, String(e.capacity), statusBadge(e.status)])}
      />
    </ModuleHub>
  );
}

export function CareerPlacementsPage() {
  return (
    <ModuleHub title="Placements" description="Graduate placement records." breadcrumbs={[...breadcrumbs, { label: "Placements" }]} tabs={CAREER_TABS}>
      <div className="mb-4 grid gap-4 sm:grid-cols-3">
        <InfoCard label="Placed this year" value={careerStats.placementsThisYear} />
        <InfoCard label="Offers extended" value={careerStats.offersExtended} />
        <InfoCard label="Seeking placement" value={mockPlacements.filter((p) => p.status === "seeking").length} />
      </div>
      <SimpleTable
        columns={["Student", "Program", "Grad year", "Company", "Role", "Salary", "Placed", "Status"]}
        rows={mockPlacements.map((p) => [p.studentName, p.program, String(p.graduationYear), p.companyName, p.role, p.salary, p.placedAt, statusBadge(p.status)])}
      />
      <Card className="mt-6">
        <CardHeader><CardTitle>Top hiring companies (2025)</CardTitle></CardHeader>
        <CardContent>
          <SimpleTable
            columns={["Company", "Placements", "Industry"]}
            rows={mockCompanies.slice(0, 5).map((c) => [c.name, String(c.activeOpportunities), c.industry])}
          />
        </CardContent>
      </Card>
      <Card className="mt-6">
        <CardHeader><CardTitle>Placement support services</CardTitle></CardHeader>
        <CardContent className="space-y-2 text-sm text-[var(--muted)]">
          <p>• Resume and cover letter review — Career Centre Block D</p>
          <p>• Mock interviews with industry alumni volunteers</p>
          <p>• LinkedIn profile optimization workshops</p>
          <p>• On-campus recruitment drives every April and October</p>
        </CardContent>
      </Card>
    </ModuleHub>
  );
}

export function StudentCareerPage() {
  const summary = studentCareerSummary;
  const myApps = mockCareerApplications.filter((a) => a.studentId === "CS-2022-0421");
  const myInterviews = mockInterviews.filter((i) => i.studentName === "Ahmed Hassan Siddiqui");

  return (
    <ModuleHub
      title="Career Portal"
      description="Browse jobs and internships, apply, and track your applications."
      breadcrumbs={[{ label: "Student", href: "/student/dashboard" }, { label: "Career" }]}
      actions={
        <div className="flex gap-2">
          <MockToastButton label={summary.cvUploaded ? "Update CV" : "Upload CV"} message="CV upload dialog opened (demo)." icon={<Upload className="size-4" />} variant="outline" />
          <MockActionButton label="Apply" title="Apply for opportunity" fields={[{ name: "opportunity", label: "Opportunity", type: "select", options: [...mockJobs, ...mockInternships].filter((o) => o.status === "published").map((o) => o.title), required: true }, { name: "coverLetter", label: "Cover letter", type: "textarea" }]} submitLabel="Submit application" successMessage="Application submitted (demo)." />
        </div>
      }
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <InfoCard label="Applications" value={summary.applications} />
        <InfoCard label="Interviews" value={summary.interviews} />
        <InfoCard label="Offers" value={summary.offers} />
        <InfoCard label="Profile complete" value={`${summary.profileComplete}%`} />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>My applications</CardTitle></CardHeader>
          <CardContent>
            {myApps.length === 0 ? (
              <EmptyState icon={FileText} title="No applications yet" description="Browse jobs and internships to apply." />
            ) : (
              <SimpleTable
                columns={["Opportunity", "Company", "Applied", "Status"]}
                rows={myApps.map((a) => [a.opportunityTitle, a.companyName, a.appliedAt, statusBadge(a.status)])}
              />
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Open opportunities</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {[...mockJobs, ...mockInternships].filter((o) => o.status === "published").slice(0, 4).map((o) => (
              <div key={o.id} className="rounded-lg border border-[var(--border-subtle)] p-3 text-sm">
                <p className="font-medium">{o.title}</p>
                <p className="text-[var(--muted)]">{o.companyName} · Deadline {o.deadline}</p>
                <MockActionButton className="mt-2" label="Apply" size="sm" variant="outline" fields={[{ name: "note", label: "Note", type: "textarea" }]} submitLabel="Apply" successMessage={`Applied to ${o.title} (demo).`} />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {myInterviews.length > 0 ? (
        <Card className="mt-6">
          <CardHeader><CardTitle>Upcoming interviews</CardTitle></CardHeader>
          <CardContent>
            <SimpleTable
              columns={["Company", "Opportunity", "When", "Mode", "Status"]}
              rows={myInterviews.map((i) => [i.companyName, i.opportunityTitle, i.scheduledAt, i.mode, statusBadge(i.status)])}
            />
          </CardContent>
        </Card>
      ) : null}

      <Card className="mt-6">
        <CardHeader><CardTitle>Career resources</CardTitle></CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-2 text-sm">
          <div className="rounded-lg border border-[var(--border-subtle)] p-4">
            <p className="font-medium">CV & profile</p>
            <p className="mt-1 text-[var(--muted)]">Keep your profile {summary.profileComplete}% complete. Upload latest CV for applications.</p>
            <MockToastButton className="mt-2" label="Upload CV" message="CV upload opened (demo)." size="sm" variant="outline" />
          </div>
          <div className="rounded-lg border border-[var(--border-subtle)] p-4">
            <p className="font-medium">Upcoming events</p>
            <p className="mt-1 text-[var(--muted)]">{mockCareerEvents.filter((e) => e.status === "upcoming").length} workshops and seminars this month.</p>
            <MockToastButton className="mt-2" label="Browse events" message="Events calendar opened (demo)." size="sm" variant="outline" />
          </div>
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader><CardTitle>Recommended for you</CardTitle></CardHeader>
        <CardContent>
          <SimpleTable
            columns={["Opportunity", "Company", "Type", "Deadline"]}
            rows={mockInternships.filter((i) => i.status === "published").map((i) => [i.title, i.companyName, "Internship", i.deadline])}
          />
        </CardContent>
      </Card>
    </ModuleHub>
  );
}
