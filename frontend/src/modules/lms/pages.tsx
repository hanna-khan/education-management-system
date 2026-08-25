"use client";

import { useState } from "react";
import Link from "next/link";
import {
  BookOpen,
  ClipboardList,
  FileText,
  GraduationCap,
  MessageSquare,
  Plus,
  Upload,
  Users,
} from "lucide-react";
import { ModuleHub, InfoCard, SimpleTable } from "@/components/shared/module-hub";
import { KpiCard } from "@/components/shared/kpi-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MockActionButton, MockToastButton } from "@/components/shared/mock-action";
import {
  LMS_TABS,
  getLmsCourse,
  lmsStats,
  mockAnnouncements,
  mockDiscussions,
  mockLessons,
  mockLmsAssignments,
  mockLmsAttendance,
  mockLmsCourses,
  mockLmsGrades,
  mockMaterials,
  mockQuizzes,
} from "@/mock/lms";
import { cn, formatNumber } from "@/lib/utils";

const breadcrumbs = [{ label: "Dashboard", href: "/dashboard" }, { label: "LMS" }];

const COURSE_TABS = [
  "Overview",
  "Announcements",
  "Materials",
  "Lessons",
  "Assignments",
  "Quizzes",
  "Discussions",
  "Attendance",
  "Grades",
] as const;

function statusBadge(status: string) {
  const map: Record<string, "default" | "success" | "warning" | "error" | "info" | "outline"> = {
    active: "success",
    draft: "outline",
    archived: "outline",
    published: "success",
    closed: "outline",
    grading: "warning",
    open: "info",
    submitted: "info",
    graded: "success",
    late: "warning",
    missing: "error",
    returned: "warning",
    not_submitted: "outline",
  };
  return (
    <Badge variant={map[status] ?? "outline"} className="capitalize">
      {status.replace(/_/g, " ")}
    </Badge>
  );
}

export function LmsDashboardPage() {
  return (
    <ModuleHub
      title="Learning Management"
      description="Courses, materials, assignments, quizzes, and discussions for NED programmes."
      breadcrumbs={breadcrumbs}
      tabs={LMS_TABS}
      actions={
        <MockActionButton
          label="New course shell"
          fields={[
            { name: "code", label: "Course code", required: true, placeholder: "CS-301" },
            { name: "title", label: "Title", required: true },
            { name: "section", label: "Section", defaultValue: "A" },
            { name: "semester", label: "Semester", defaultValue: "Fall 2026" },
          ]}
          submitLabel="Create"
          icon={<Plus className="size-4" />}
        />
      }
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <KpiCard label="Active courses" value={lmsStats.activeCourses} icon={BookOpen} />
        <KpiCard label="Enrolled students" value={formatNumber(lmsStats.totalStudents)} icon={Users} />
        <KpiCard label="Pending grading" value={lmsStats.pendingGrading} icon={ClipboardList} changeType="negative" />
        <KpiCard label="Open quizzes" value={lmsStats.openQuizzes} icon={FileText} />
        <KpiCard label="Materials" value={formatNumber(lmsStats.materialsUploaded)} icon={Upload} />
        <KpiCard label="Discussions" value={formatNumber(lmsStats.discussionPosts)} icon={MessageSquare} />
      </div>

      <Card className="mt-6">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Active courses</CardTitle>
          <Button asChild variant="outline" size="sm">
            <Link href="/lms/courses">View all</Link>
          </Button>
        </CardHeader>
        <CardContent>
          <SimpleTable
            columns={["Code", "Title", "Instructor", "Section", "Students", "Progress", "Status"]}
            rows={mockLmsCourses.slice(0, 5).map((c) => [
              <Link key={c.id} href={`/lms/courses/${c.id}`} className="font-medium hover:underline">
                {c.code}
              </Link>,
              c.title,
              c.instructor,
              c.section,
              String(c.students),
              `${c.progress}%`,
              statusBadge(c.status),
            ])}
          />
        </CardContent>
      </Card>
    </ModuleHub>
  );
}

export function LmsCoursesPage() {
  return (
    <ModuleHub
      title="LMS Courses"
      description="All course shells for the current semester."
      breadcrumbs={[...breadcrumbs, { label: "Courses" }]}
      tabs={LMS_TABS}
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {mockLmsCourses.map((c) => (
          <Card key={c.id} className="transition-shadow hover:shadow-[var(--shadow-sm)]">
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-medium text-[var(--brand-primary)]">{c.code}</p>
                  <p className="mt-1 font-semibold tracking-tight">{c.title}</p>
                </div>
                {statusBadge(c.status)}
              </div>
              <p className="mt-2 text-sm text-[var(--muted)]">{c.instructor} · Sec {c.section}</p>
              <div className="mt-4">
                <div className="flex justify-between text-xs text-[var(--muted)]">
                  <span>Progress</span>
                  <span>{c.progress}%</span>
                </div>
                <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-[var(--surface-muted)]">
                  <div className="h-full rounded-full bg-[var(--brand-primary)]" style={{ width: `${c.progress}%` }} />
                </div>
              </div>
              <Button asChild className="mt-4 w-full" size="sm" variant="outline">
                <Link href={`/lms/courses/${c.id}`}>Open course</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </ModuleHub>
  );
}

export function LmsCourseDetailPage({ id }: { id: string }) {
  const course = getLmsCourse(id) ?? mockLmsCourses[0];
  const [tab, setTab] = useState<(typeof COURSE_TABS)[number]>("Overview");
  const announcements = mockAnnouncements.filter((a) => a.courseId === course.id);
  const materials = mockMaterials.filter((m) => m.courseId === course.id);
  const lessons = mockLessons.filter((l) => l.courseId === course.id);
  const assignments = mockLmsAssignments.filter((a) => a.courseId === course.id);
  const quizzes = mockQuizzes.filter((q) => q.courseId === course.id);
  const discussions = mockDiscussions.filter((d) => d.courseId === course.id);
  const attendance = mockLmsAttendance.filter((a) => a.courseId === course.id);

  return (
    <ModuleHub
      title={`${course.code} · ${course.title}`}
      description={course.description}
      breadcrumbs={[...breadcrumbs, { label: "Courses", href: "/lms/courses" }, { label: course.code }]}
      tabs={LMS_TABS}
      actions={
        <div className="flex flex-wrap gap-2">
          <MockActionButton
            label="Add material"
            fields={[
              { name: "title", label: "Title", required: true },
              { name: "type", label: "Type", type: "select", options: ["pdf", "video", "slides", "code", "link"], required: true },
              { name: "week", label: "Week", type: "number", defaultValue: "1" },
            ]}
            submitLabel="Upload"
            icon={<Upload className="size-4" />}
          />
          <MockActionButton
            label="Create assignment"
            fields={[
              { name: "title", label: "Title", required: true },
              { name: "due", label: "Due date", type: "date", required: true },
              { name: "max", label: "Max score", type: "number", defaultValue: "100" },
            ]}
            submitLabel="Publish"
            icon={<Plus className="size-4" />}
          />
        </div>
      }
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <InfoCard label="Instructor" value={course.instructor} />
        <InfoCard label="Students" value={course.students} />
        <InfoCard label="Credits" value={course.credits} />
        <InfoCard label="Schedule" value={course.schedule} sub={course.semester} />
      </div>

      <nav className="mt-6 flex flex-wrap gap-1 border-b border-[var(--border)] pb-px">
        {COURSE_TABS.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={cn(
              "relative px-3 py-2 text-sm font-medium transition-colors",
              tab === t ? "text-[var(--brand-primary)]" : "text-[var(--muted)] hover:text-[var(--foreground)]",
            )}
          >
            {t}
            {tab === t ? <span className="absolute inset-x-0 -bottom-px h-0.5 bg-[var(--brand-primary)]" /> : null}
          </button>
        ))}
      </nav>

      <div className="mt-6">
        {tab === "Overview" && (
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader><CardTitle>Course progress</CardTitle></CardHeader>
              <CardContent>
                <div className="flex items-end justify-between">
                  <p className="text-3xl font-semibold tracking-tight">{course.progress}%</p>
                  <Badge variant="info">Fall 2026</Badge>
                </div>
                <div className="mt-3 h-3 overflow-hidden rounded-full bg-[var(--surface-muted)]">
                  <div className="h-full rounded-full bg-[var(--brand-primary)]" style={{ width: `${course.progress}%` }} />
                </div>
                <p className="mt-4 text-sm text-[var(--muted)]">{course.department} · Section {course.section}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Quick stats</CardTitle></CardHeader>
              <CardContent className="grid grid-cols-2 gap-3">
                <InfoCard label="Materials" value={materials.length} />
                <InfoCard label="Assignments" value={assignments.length} />
                <InfoCard label="Quizzes" value={quizzes.length} />
                <InfoCard label="Discussions" value={discussions.length} />
              </CardContent>
            </Card>
          </div>
        )}

        {tab === "Announcements" && (
          <div className="space-y-3">
            <MockActionButton
              label="Post announcement"
              fields={[
                { name: "title", label: "Title", required: true },
                { name: "body", label: "Message", type: "textarea", required: true },
              ]}
              submitLabel="Post"
            />
            {announcements.map((a) => (
              <Card key={a.id}>
                <CardContent className="p-5">
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-semibold">{a.title}</p>
                    {a.pinned ? <Badge variant="info">Pinned</Badge> : null}
                  </div>
                  <p className="mt-2 text-sm text-[var(--muted)]">{a.body}</p>
                  <p className="mt-3 text-xs text-[var(--muted)]">{a.author} · {a.createdAt}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {tab === "Materials" && (
          <SimpleTable
            columns={["Title", "Type", "Week", "Size", "Uploaded", ""]}
            rows={materials.map((m) => [
              m.title,
              m.type,
              `Week ${m.week}`,
              m.size ?? "—",
              m.uploadedAt,
              m.downloadable ? (
                <MockToastButton key={m.id} label="Download" message={`${m.title} downloaded (demo).`} size="sm" />
              ) : (
                <Badge key={m.id} variant="outline">View only</Badge>
              ),
            ])}
          />
        )}

        {tab === "Lessons" && (
          <SimpleTable
            columns={["Week", "Title", "Type", "Duration", "Status"]}
            rows={lessons.map((l) => [
              String(l.week),
              l.title,
              l.type,
              l.duration,
              l.completed ? <Badge variant="success">Completed</Badge> : <Badge variant="outline">Upcoming</Badge>,
            ])}
          />
        )}

        {tab === "Assignments" && (
          <div className="space-y-4">
            <SimpleTable
              columns={["Title", "Due", "Submissions", "Graded", "Status", ""]}
              rows={assignments.map((a) => [
                a.title,
                a.dueAt.slice(0, 10),
                `${a.submissionsCount}`,
                `${a.gradedCount}`,
                statusBadge(a.status),
                <MockActionButton
                  key={a.id}
                  label="Grade"
                  title="Grade submission"
                  fields={[
                    { name: "student", label: "Student", type: "select", options: mockLmsGrades.map((g) => g.studentName), required: true },
                    { name: "score", label: "Score", type: "number", required: true },
                    { name: "feedback", label: "Feedback", type: "textarea" },
                  ]}
                  submitLabel="Save grade"
                  size="sm"
                  variant="outline"
                />,
              ])}
            />
          </div>
        )}

        {tab === "Quizzes" && (
          <SimpleTable
            columns={["Title", "Questions", "Duration", "Due", "Avg", "Status"]}
            rows={quizzes.map((q) => [
              q.title,
              String(q.questions),
              `${q.durationMin} min`,
              q.dueAt.slice(0, 10),
              q.avgScore ? `${q.avgScore}%` : "—",
              statusBadge(q.status),
            ])}
          />
        )}

        {tab === "Discussions" && (
          <SimpleTable
            columns={["Topic", "Author", "Replies", "Last activity", ""]}
            rows={discussions.map((d) => [
              <span key={d.id} className="font-medium">
                {d.pinned ? "[Pinned] " : ""}
                {d.title}
              </span>,
              d.author,
              String(d.replies),
              d.lastActivity,
              <MockToastButton key={d.id} label="Reply" message="Reply posted (demo)." size="sm" />,
            ])}
          />
        )}

        {tab === "Attendance" && (
          <SimpleTable
            columns={["Date", "Present", "Absent", "Late", "Total"]}
            rows={attendance.map((a) => [a.date, String(a.present), String(a.absent), String(a.late), String(a.total)])}
          />
        )}

        {tab === "Grades" && (
          <SimpleTable
            columns={["Student", "Assignment", "Score", "Status", "Submitted"]}
            rows={mockLmsGrades.map((g) => [
              g.studentName,
              g.assignment,
              g.score != null ? `${g.score}/${g.maxScore}` : "—",
              statusBadge(g.status),
              g.submittedAt?.slice(0, 10) ?? "—",
            ])}
          />
        )}
      </div>
    </ModuleHub>
  );
}

export function StudentLmsPage() {
  const myCourses = mockLmsCourses.slice(0, 4);
  const myMaterials = mockMaterials.filter((m) => m.courseId === "lms-001");
  return (
    <ModuleHub
      title="My LMS"
      description="Enrolled courses, materials, and submissions."
      breadcrumbs={[{ label: "Student", href: "/student/dashboard" }, { label: "LMS" }]}
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {myCourses.map((c) => (
          <Card key={c.id}>
            <CardContent className="p-5">
              <p className="text-xs text-[var(--brand-primary)]">{c.code}</p>
              <p className="mt-1 font-semibold">{c.title}</p>
              <p className="mt-2 text-xs text-[var(--muted)]">{c.progress}% complete</p>
              <Button asChild size="sm" variant="outline" className="mt-3 w-full">
                <Link href={`/lms/courses/${c.id}`}>Open</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
      <Card className="mt-6">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>CS-301 materials</CardTitle>
          <MockActionButton
            label="Submit assignment"
            title="Submit Assignment 3"
            fields={[
              { name: "file", label: "File name", required: true, placeholder: "graphs.zip" },
              { name: "notes", label: "Notes", type: "textarea" },
            ]}
            submitLabel="Submit"
            icon={<Upload className="size-4" />}
          />
        </CardHeader>
        <CardContent>
          <SimpleTable
            columns={["Material", "Type", "Week", ""]}
            rows={myMaterials.map((m) => [
              m.title,
              m.type,
              `Week ${m.week}`,
              <MockToastButton key={m.id} label="Open" message="Material opened (demo)." size="sm" />,
            ])}
          />
        </CardContent>
      </Card>
    </ModuleHub>
  );
}

export function TeacherLmsPage() {
  const teaching = mockLmsCourses.filter((c) => c.instructor.includes("Sana") || c.instructor.includes("Imran")).slice(0, 3);
  return (
    <ModuleHub
      title="Teaching — LMS"
      description="Create content and grade submissions."
      breadcrumbs={[{ label: "Teacher", href: "/teacher/dashboard" }, { label: "LMS" }]}
      actions={
        <MockActionButton
          label="Create content"
          fields={[
            { name: "course", label: "Course", type: "select", options: teaching.map((c) => c.code), required: true },
            { name: "kind", label: "Type", type: "select", options: ["Material", "Assignment", "Quiz", "Announcement"], required: true },
            { name: "title", label: "Title", required: true },
          ]}
          submitLabel="Create"
          icon={<Plus className="size-4" />}
        />
      }
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <KpiCard label="My courses" value={teaching.length || 2} icon={GraduationCap} />
        <KpiCard label="To grade" value={lmsStats.pendingGrading} icon={ClipboardList} changeType="negative" />
        <KpiCard label="Open quizzes" value={2} icon={FileText} />
      </div>
      <Card className="mt-6">
        <CardHeader><CardTitle>Needs grading</CardTitle></CardHeader>
        <CardContent>
          <SimpleTable
            columns={["Student", "Assignment", "Status", ""]}
            rows={mockLmsGrades
              .filter((g) => g.status === "submitted" || g.status === "late")
              .map((g) => [
                g.studentName,
                g.assignment,
                statusBadge(g.status),
                <MockActionButton
                  key={g.id}
                  label="Grade"
                  fields={[
                    { name: "score", label: "Score", type: "number", required: true },
                    { name: "feedback", label: "Feedback", type: "textarea" },
                  ]}
                  submitLabel="Save"
                  size="sm"
                />,
              ])}
          />
        </CardContent>
      </Card>
    </ModuleHub>
  );
}
