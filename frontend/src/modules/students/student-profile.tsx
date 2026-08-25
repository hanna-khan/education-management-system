"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { notFound, useSearchParams } from "next/navigation";
import {
  BookOpen,
  ClipboardCheck,
  FileText,
  FolderOpen,
  Inbox,
  MessageSquareWarning,
  ShieldCheck,
  UserRound,
  Wallet,
} from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { StudentProfileHeader } from "@/modules/students/student-profile-header";
import { StudentIdCard } from "@/modules/students/student-id-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { getStudent, getStudentActivities } from "@/services/students";
import type { Student, StudentActivity } from "@/types/students";
import { cn, formatCurrency } from "@/lib/utils";

const activityIcons = {
  application: Inbox,
  fee: Wallet,
  attendance: ClipboardCheck,
  academic: BookOpen,
  document: FolderOpen,
};

const TABS = [
  { id: "overview", label: "Overview", icon: UserRound },
  { id: "academics", label: "Academics", icon: BookOpen },
  { id: "attendance", label: "Attendance", icon: ClipboardCheck },
  { id: "exams", label: "Exams", icon: FileText },
  { id: "fees", label: "Fees", icon: Wallet },
  { id: "applications", label: "Applications", icon: Inbox },
  { id: "documents", label: "Documents", icon: FolderOpen },
  { id: "complaints", label: "Complaints", icon: MessageSquareWarning },
  { id: "activity", label: "Activity", icon: ShieldCheck },
] as const;

export function StudentProfileContent({ id }: { id: string }) {
  const searchParams = useSearchParams();
  const defaultTab = searchParams.get("tab") ?? "overview";
  const [student, setStudent] = useState<Student | null>(null);
  const [activities, setActivities] = useState<StudentActivity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const data = await getStudent(id);
      if (!data) {
        setLoading(false);
        return;
      }
      setStudent(data);
      setActivities(await getStudentActivities(data.id));
      setLoading(false);
    }
    load();
  }, [id]);

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-56 w-full rounded-[1.5rem]" />
        <Skeleton className="h-96 w-full rounded-[1.5rem]" />
      </div>
    );
  }

  if (!student) notFound();

  return (
    <div className="animate-fade-in space-y-6">
      <PageHeader
        breadcrumbs={
          <Breadcrumb
            items={[
              { label: "Dashboard", href: "/dashboard" },
              { label: "Students", href: "/students" },
              { label: `${student.firstName} ${student.lastName}` },
            ]}
          />
        }
        title=""
      />

      <StudentProfileHeader student={student} />

      <Tabs defaultValue={defaultTab === "id-card" ? "documents" : defaultTab} className="space-y-5">
        <div className="overflow-x-auto rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface)] p-1.5 shadow-[var(--shadow-sm)]">
          <TabsList className="flex h-auto w-max min-w-full justify-start gap-1 bg-transparent p-0">
            {TABS.map((tab) => (
              <TabsTrigger
                key={tab.id}
                value={tab.id}
                className="rounded-xl px-3.5 py-2 text-xs font-semibold capitalize data-[state=active]:bg-[#6B58F6] data-[state=active]:text-white data-[state=active]:shadow-md"
              >
                <tab.icon className="mr-1.5 size-3.5" />
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        <TabsContent value="overview" className="mt-0 space-y-6">
          <div className="grid gap-6 xl:grid-cols-12">
            <div className="space-y-6 xl:col-span-8">
              <PremiumSection title="Personal information" subtitle="Identity and contact details">
                <InfoGrid
                  items={[
                    ["Full name", `${student.firstName} ${student.lastName}`],
                    ["Date of birth", student.dateOfBirth],
                    ["Gender", student.gender],
                    ["CNIC", student.cnic],
                    ["Email", student.email],
                    ["Phone", student.phone],
                  ]}
                />
              </PremiumSection>

              <div className="grid gap-6 md:grid-cols-2">
                <PremiumSection title="Address" subtitle="Residential information">
                  <InfoGrid
                    items={[
                      ["Address", student.address],
                      ["City", student.city],
                      ["Campus", student.campus],
                    ]}
                  />
                </PremiumSection>
                <PremiumSection title="Guardian" subtitle="Emergency & parent contact">
                  <InfoGrid
                    items={[
                      ["Name", student.guardianName],
                      ["Relation", student.guardianRelation],
                      ["Phone", student.guardianPhone],
                    ]}
                  />
                </PremiumSection>
              </div>
            </div>

            <div className="space-y-6 xl:col-span-4">
              <PremiumSection title="Academic summary" subtitle="Program snapshot">
                <div className="space-y-3">
                  {[
                    ["Program", student.program],
                    ["Department", student.department],
                    ["Semester", `Semester ${student.semester}`],
                    ["Section", student.section],
                    ["CGPA", student.cgpa.toFixed(2)],
                    ["Enrolled", student.enrollmentDate],
                  ].map(([label, value]) => (
                    <div
                      key={label}
                      className="flex items-center justify-between gap-3 rounded-xl bg-[var(--surface-muted)] px-3 py-2.5"
                    >
                      <span className="text-xs text-[var(--muted)]">{label}</span>
                      <span className="text-sm font-semibold">{value}</span>
                    </div>
                  ))}
                </div>
              </PremiumSection>

              <PremiumSection title="Fee status" subtitle="Current term">
                <Badge
                  variant={
                    student.feeStatus === "paid"
                      ? "success"
                      : student.feeStatus === "overdue"
                        ? "error"
                        : "warning"
                  }
                  className="capitalize"
                >
                  {student.feeStatus}
                </Badge>
                <p className="mt-3 text-sm text-[var(--muted)]">
                  Fall 2026 semester fee:{" "}
                  <span className="font-semibold text-[var(--foreground)]">
                    {formatCurrency(85000)}
                  </span>
                </p>
                <div className="mt-4 h-2 overflow-hidden rounded-full bg-[var(--surface-muted)]">
                  <div
                    className={cn(
                      "h-full rounded-full",
                      student.feeStatus === "paid" ? "w-full bg-[#1BD0B4]" : "w-2/3 bg-[#F4901F]",
                    )}
                  />
                </div>
              </PremiumSection>

              <PremiumSection title="Recent activity" subtitle="Latest updates">
                <ActivityTimeline activities={activities.slice(0, 4)} />
              </PremiumSection>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="academics" className="mt-0">
          <ContentStub
            icon={BookOpen}
            title="Academic records"
            description="Course enrollment, credit hours, and semester progress will appear here."
            href="/academics"
            linkLabel="Open Academics"
          />
        </TabsContent>
        <TabsContent value="attendance" className="mt-0">
          <ContentStub
            icon={ClipboardCheck}
            title="Attendance history"
            description={`Current attendance rate: ${student.attendanceRate}%. Detailed course-wise records are available in Attendance.`}
            href="/attendance/students"
            linkLabel="Open Attendance"
          />
        </TabsContent>
        <TabsContent value="exams" className="mt-0">
          <ContentStub
            icon={FileText}
            title="Exam records"
            description="Exam registrations, marks, and grade history will be available in Exams."
            href="/exams"
            linkLabel="Open Exams"
          />
        </TabsContent>
        <TabsContent value="fees" className="mt-0">
          <ContentStub
            icon={Wallet}
            title="Fee records"
            description="Invoices, payments, receipts, and concessions for this student."
            href="/fees/students"
            linkLabel="Open Fees"
          />
        </TabsContent>
        <TabsContent value="applications" className="mt-0">
          <ContentStub
            icon={Inbox}
            title="Applications"
            description="Leave, scholarship, certificate, and other service requests."
            href="/applications"
            linkLabel="Open Applications"
          />
        </TabsContent>
        <TabsContent value="documents" className="mt-0">
          <div className="grid gap-6 lg:grid-cols-2">
            <PremiumSection title="Documents" subtitle="Uploaded files & verification">
              <div className="space-y-3">
                {[
                  { name: "CNIC Copy", status: "Verified", date: "2026-01-12" },
                  { name: "Matric Certificate", status: "Verified", date: "2026-01-12" },
                  { name: "Photo", status: "Pending", date: "2026-08-01" },
                ].map((doc) => (
                  <div
                    key={doc.name}
                    className="flex items-center justify-between rounded-xl border border-[var(--border-subtle)] px-4 py-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex size-10 items-center justify-center rounded-xl bg-[#efeaff] text-[#6B58F6]">
                        <FolderOpen className="size-4" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold">{doc.name}</p>
                        <p className="text-xs text-[var(--muted)]">{doc.date}</p>
                      </div>
                    </div>
                    <Badge variant={doc.status === "Verified" ? "success" : "warning"}>
                      {doc.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </PremiumSection>
            <div>
              <p className="mb-3 text-sm font-semibold">Digital ID card</p>
              <StudentIdCard student={student} />
            </div>
          </div>
        </TabsContent>
        <TabsContent value="complaints" className="mt-0">
          <ContentStub
            icon={MessageSquareWarning}
            title="Complaints"
            description="Grievances and complaint history for this student."
            href="/complaints"
            linkLabel="Open Complaints"
          />
        </TabsContent>
        <TabsContent value="activity" className="mt-0">
          <PremiumSection title="Activity timeline" subtitle="Full audit of student actions">
            <ActivityTimeline activities={activities} full />
          </PremiumSection>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function PremiumSection({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-[1.25rem] border border-[var(--border-subtle)] bg-[var(--surface)] p-5 shadow-[var(--shadow-sm)] sm:p-6">
      <div className="mb-4">
        <h3 className="text-base font-semibold text-[var(--foreground)]">{title}</h3>
        {subtitle ? <p className="mt-0.5 text-xs text-[var(--muted)]">{subtitle}</p> : null}
      </div>
      {children}
    </section>
  );
}

function InfoGrid({ items }: { items: [string, string][] }) {
  return (
    <dl className="grid gap-4 sm:grid-cols-2">
      {items.map(([label, value]) => (
        <div
          key={label}
          className="rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-muted)]/60 px-4 py-3"
        >
          <dt className="text-[11px] font-semibold uppercase tracking-wide text-[var(--muted)]">
            {label}
          </dt>
          <dd className="mt-1 text-sm font-medium text-[var(--foreground)]">{value}</dd>
        </div>
      ))}
    </dl>
  );
}

function ActivityTimeline({
  activities,
  full = false,
}: {
  activities: StudentActivity[];
  full?: boolean;
}) {
  const grouped = groupActivitiesByDate(activities);

  return (
    <div className="space-y-4">
      {Object.entries(grouped).map(([date, items]) => (
        <div key={date}>
          <p className="mb-2 text-xs font-semibold text-[var(--muted)]">{date}</p>
          <div className="space-y-3 border-l-2 border-[#efeaff] pl-4">
            {items.map((activity) => {
              const Icon = activityIcons[activity.type];
              return (
                <div key={activity.id} className="relative">
                  <div className="absolute -left-[21px] top-1.5 size-2.5 rounded-full border-2 border-white bg-[#6B58F6]" />
                  <div className="flex gap-3 rounded-xl bg-[var(--surface-muted)]/80 p-3">
                    <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-white text-[#6B58F6] shadow-sm">
                      <Icon className="size-3.5" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold">{activity.title}</p>
                      <p className="text-xs text-[var(--muted)]">{activity.description}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
      {!full && activities.length === 0 ? (
        <p className="text-sm text-[var(--muted)]">No recent activity.</p>
      ) : null}
    </div>
  );
}

function groupActivitiesByDate(activities: StudentActivity[]) {
  const groups: Record<string, StudentActivity[]> = {};
  const now = new Date();

  for (const activity of activities) {
    const date = new Date(activity.date);
    const diffDays = Math.floor((now.getTime() - date.getTime()) / 86400000);
    let label: string;
    if (diffDays === 0) label = "Today";
    else if (diffDays === 1) label = "Yesterday";
    else
      label = date.toLocaleDateString("en-PK", {
        month: "short",
        day: "numeric",
      });

    if (!groups[label]) groups[label] = [];
    groups[label].push(activity);
  }
  return groups;
}

function ContentStub({
  icon: Icon,
  title,
  description,
  href,
  linkLabel,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  href: string;
  linkLabel: string;
}) {
  return (
    <section className="flex flex-col items-center rounded-[1.25rem] border border-[var(--border-subtle)] bg-[var(--surface)] px-6 py-14 text-center shadow-[var(--shadow-sm)]">
      <div className="mb-4 flex size-14 items-center justify-center rounded-2xl bg-[#efeaff] text-[#6B58F6]">
        <Icon className="size-6" />
      </div>
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="mt-2 max-w-md text-sm text-[var(--muted)]">{description}</p>
      <div className="mt-5 flex gap-3">
        <Link
          href={href}
          className="rounded-xl bg-[#6B58F6] px-4 py-2 text-sm font-semibold text-white"
        >
          {linkLabel}
        </Link>
        <Link
          href="/students"
          className="rounded-xl border border-[var(--border)] px-4 py-2 text-sm font-medium text-[var(--muted)]"
        >
          Back to students
        </Link>
      </div>
    </section>
  );
}
