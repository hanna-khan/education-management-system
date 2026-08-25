"use client";

import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Award,
  Briefcase,
  Download,
  Edit,
  FileText,
  FolderOpen,
  GraduationCap,
  Mail,
  MapPin,
  Phone,
  Star,
  ArrowLeft,
} from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { Button } from "@/components/ui/button";
import { MockActionButton, MockToastButton, MOCK_FORMS } from "@/components/shared/mock-action";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import {
  getTeacherFullProfile,
  getTeachersBySubject,
  type TeacherDocument,
  type TeacherFullProfile,
} from "@/mock/teachers";

const STATUS = {
  active: { label: "Active", variant: "success" as const },
  on_leave: { label: "On Leave", variant: "warning" as const },
  critical: { label: "Critical", variant: "error" as const },
};

const DOC_STATUS = {
  verified: "success" as const,
  pending: "warning" as const,
  rejected: "error" as const,
};

const DOC_ICON_LABEL: Record<TeacherDocument["category"], string> = {
  resume: "Resume / CV",
  degree: "Degree",
  certificate: "Certificate",
  id: "ID Document",
  other: "Document",
};

export function TeacherProfileContent({ id }: { id: string }) {
  const teacher = getTeacherFullProfile(id);
  if (!teacher) notFound();

  const peers = getTeachersBySubject(teacher.subject).filter((t) => t.id !== teacher.id);

  return (
    <div className="animate-fade-in space-y-6">
      <PageHeader
        breadcrumbs={
          <Breadcrumb
            items={[
              { label: "Dashboard", href: "/dashboard" },
              { label: "Teachers", href: "/teachers" },
              { label: teacher.name },
            ]}
          />
        }
        title=""
        actions={
          <Button variant="outline" size="sm" className="rounded-xl" asChild>
            <Link href="/teachers">
              <ArrowLeft className="size-4" />
              Back to teachers
            </Link>
          </Button>
        }
      />

      <TeacherHero teacher={teacher} />

      <Tabs defaultValue="overview" className="space-y-5">
        <div className="overflow-x-auto rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface)] p-1.5 shadow-[var(--shadow-sm)]">
          <TabsList className="flex h-auto w-max min-w-full justify-start gap-1 bg-transparent p-0">
            {[
              "overview",
              "education",
              "qualifications",
              "experience",
              "documents",
            ].map((tab) => (
              <TabsTrigger
                key={tab}
                value={tab}
                className="rounded-xl px-3.5 py-2 text-xs font-semibold capitalize data-[state=active]:bg-[#6B58F6] data-[state=active]:text-white data-[state=active]:shadow-md"
              >
                {tab}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        <TabsContent value="overview" className="mt-0">
          <div className="grid gap-6 xl:grid-cols-12">
            <div className="space-y-6 xl:col-span-8">
              <Section title="About" subtitle="Professional summary">
                <p className="text-sm leading-relaxed text-[var(--foreground)]">{teacher.about}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {teacher.skills.map((skill) => (
                    <span
                      key={skill}
                      className="rounded-full bg-[#efeaff] px-3 py-1 text-xs font-semibold text-[#6B58F6]"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </Section>

              <div className="grid gap-6 md:grid-cols-2">
                <Section title="Personal details" subtitle="Identity information">
                  <InfoGrid
                    items={[
                      ["Employee ID", teacher.employeeId],
                      ["Date of birth", teacher.dateOfBirth],
                      ["Age", String(teacher.age)],
                      ["Gender", teacher.gender],
                      ["Nationality", teacher.nationality],
                      ["Blood group", teacher.bloodGroup],
                    ]}
                  />
                </Section>
                <Section title="Contact" subtitle="Reach & location">
                  <InfoGrid
                    items={[
                      ["Email", teacher.email],
                      ["Phone", teacher.phone],
                      ["Emergency", teacher.emergencyContact],
                      ["Address", teacher.address],
                      ["Joined", teacher.joinDate],
                      ["Languages", teacher.languages.join(", ")],
                    ]}
                  />
                </Section>
              </div>
            </div>

            <div className="space-y-6 xl:col-span-4">
              <Section title="Teaching load" subtitle="Current assignment">
                <div className="space-y-3">
                  {[
                    ["Subject", teacher.subject],
                    ["Department", teacher.department],
                    ["Designation", teacher.designation],
                    ["Classes", String(teacher.classesCount)],
                    ["Students", String(teacher.studentsCount)],
                    ["Rating", `${teacher.rating} / 5`],
                  ].map(([label, value]) => (
                    <div
                      key={label}
                      className="flex items-center justify-between rounded-xl bg-[var(--surface-muted)] px-3 py-2.5"
                    >
                      <span className="text-xs text-[var(--muted)]">{label}</span>
                      <span className="text-sm font-semibold">{value}</span>
                    </div>
                  ))}
                </div>
              </Section>

              {peers.length > 0 ? (
                <Section title="Same subject" subtitle={`${teacher.subject} faculty`}>
                  <div className="space-y-2">
                    {peers.slice(0, 4).map((peer) => (
                      <Link
                        key={peer.id}
                        href={`/teachers/${peer.id}`}
                        className="flex items-center gap-3 rounded-xl px-2 py-2 hover:bg-[var(--surface-muted)]"
                      >
                        <div
                          className="flex size-9 items-center justify-center rounded-full text-xs font-bold text-white"
                          style={{ backgroundColor: peer.avatarColor }}
                        >
                          {peer.avatarInitials}
                        </div>
                        <div>
                          <p className="text-sm font-semibold">{peer.name}</p>
                          <p className="text-[11px] text-[var(--muted)]">{peer.designation}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </Section>
              ) : null}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="education" className="mt-0">
          <Section title="Education" subtitle="Academic background">
            <div className="space-y-4">
              {teacher.education.map((edu, i) => (
                <div
                  key={`${edu.degree}-${i}`}
                  className="flex gap-4 rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-muted)]/50 p-4"
                >
                  <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-[#efeaff] text-[#6B58F6]">
                    <GraduationCap className="size-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div>
                        <p className="font-semibold">{edu.degree}</p>
                        <p className="text-sm text-[var(--muted)]">
                          {edu.field} · {edu.institution}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-[#6B58F6]">{edu.year}</p>
                        {edu.grade ? (
                          <p className="text-xs text-[var(--muted)]">{edu.grade}</p>
                        ) : null}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Section>
        </TabsContent>

        <TabsContent value="qualifications" className="mt-0">
          <Section title="Qualifications & certifications" subtitle="Licenses, certificates and awards">
            <div className="grid gap-4 sm:grid-cols-2">
              {teacher.qualifications.map((q) => (
                <div
                  key={q.title}
                  className="rounded-2xl border border-[var(--border-subtle)] p-4"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#fff6eb] text-[#F4901F]">
                      <Award className="size-4" />
                    </div>
                    <div>
                      <Badge variant="outline" className="mb-2 capitalize text-[10px]">
                        {q.type}
                      </Badge>
                      <p className="font-semibold">{q.title}</p>
                      <p className="mt-1 text-xs text-[var(--muted)]">
                        {q.issuer} · {q.year}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Section>
        </TabsContent>

        <TabsContent value="experience" className="mt-0">
          <Section title="Work experience" subtitle="Professional history">
            <div className="space-y-4 border-l-2 border-[#efeaff] pl-5">
              {teacher.experience.map((exp) => (
                <div key={`${exp.role}-${exp.from}`} className="relative">
                  <span className="absolute -left-[27px] top-1.5 size-3 rounded-full border-2 border-white bg-[#6B58F6]" />
                  <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface)] p-4 shadow-sm">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <Briefcase className="size-4 text-[#6B58F6]" />
                        <p className="font-semibold">{exp.role}</p>
                      </div>
                      <p className="text-xs font-medium text-[var(--muted)]">
                        {exp.from} — {exp.to}
                      </p>
                    </div>
                    <p className="mt-1 text-sm text-[#6B58F6]">{exp.organization}</p>
                    <p className="mt-2 text-sm text-[var(--muted)]">{exp.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </Section>
        </TabsContent>

        <TabsContent value="documents" className="mt-0">
          <Section
            title="Documents & resume"
            subtitle="Submitted files for HR verification"
            action={
              <MockToastButton
                label="Download all"
                message="All documents downloaded (demo)."
                className="rounded-xl"
                icon={<Download className="size-4" />}
              />
            }
          >
            <div className="space-y-3">
              {teacher.documents.map((doc) => (
                <div
                  key={doc.id}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[var(--border-subtle)] px-4 py-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex size-11 items-center justify-center rounded-xl bg-[#efeaff] text-[#6B58F6]">
                      {doc.category === "resume" ? (
                        <FileText className="size-5" />
                      ) : (
                        <FolderOpen className="size-5" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-semibold">{doc.name}</p>
                      <p className="text-xs text-[var(--muted)]">
                        {DOC_ICON_LABEL[doc.category]} · {doc.size} · {doc.uploadedAt}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={DOC_STATUS[doc.status]} className="capitalize">
                      {doc.status}
                    </Badge>
                    <MockToastButton
                      label="View"
                      message={`${doc.name} opened (demo).`}
                      className="rounded-xl"
                      icon={<Download className="size-3.5" />}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Section>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function TeacherHero({ teacher }: { teacher: TeacherFullProfile }) {
  return (
    <div className="overflow-hidden rounded-[1.5rem] border border-[var(--border-subtle)] bg-[var(--surface)] shadow-[var(--shadow-sm)]">
      <div className="relative h-36 bg-gradient-to-br from-[#6B58F6] via-[#7c6af8] to-[#1BD0B4]">
        <div className="pointer-events-none absolute -right-8 -top-8 size-40 rounded-full bg-white/10" />
      </div>
      <div className="relative px-5 pb-6 sm:px-8">
        <div className="-mt-14 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
            <div
              className="flex size-[104px] items-center justify-center rounded-[1.5rem] border-4 border-white text-2xl font-bold text-white shadow-[0_12px_32px_rgba(107,88,246,0.25)]"
              style={{ backgroundColor: teacher.avatarColor }}
            >
              {teacher.avatarInitials}
            </div>
            <div className="pb-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl font-bold tracking-tight">{teacher.name}</h1>
                <Badge variant={STATUS[teacher.status].variant}>
                  {STATUS[teacher.status].label}
                </Badge>
              </div>
              <p className="mt-1 text-sm font-medium text-[#6B58F6]">
                {teacher.designation} · {teacher.subject}
              </p>
              <p className="mt-0.5 text-sm text-[var(--muted)]">
                {teacher.department} · {teacher.employeeId}
              </p>
              <div className="mt-3 flex flex-wrap gap-2 text-xs text-[var(--muted)]">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--surface-muted)] px-2.5 py-1">
                  <Mail className="size-3.5" />
                  {teacher.email}
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--surface-muted)] px-2.5 py-1">
                  <Phone className="size-3.5" />
                  {teacher.phone}
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--surface-muted)] px-2.5 py-1">
                  <MapPin className="size-3.5" />
                  {teacher.address.split(",")[0]}
                </span>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <MockActionButton
              label="Edit profile"
              title="Edit teacher profile"
              description="Update teacher information (demo)."
              fields={MOCK_FORMS.employee}
              submitLabel="Save changes"
              className="rounded-xl"
              icon={<Edit className="size-4" />}
            />
            <MockToastButton
              label="Download resume"
              message="Resume download started (demo)."
              className="rounded-xl"
              icon={<Download className="size-4" />}
            />
          </div>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {[
            { label: "Rating", value: teacher.rating.toFixed(1), icon: Star, tone: "text-[#F4901F]" },
            { label: "Classes", value: String(teacher.classesCount), icon: Briefcase, tone: "text-[#6B58F6]" },
            { label: "Students", value: String(teacher.studentsCount), icon: GraduationCap, tone: "text-[#1BD0B4]" },
            { label: "Documents", value: String(teacher.documents.length), icon: FolderOpen, tone: "text-[#3B82F6]" },
          ].map((item) => (
            <div
              key={item.label}
              className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-muted)]/60 p-4"
            >
              <div className="flex items-center justify-between">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-[var(--muted)]">
                  {item.label}
                </p>
                <item.icon className={cn("size-4", item.tone)} />
              </div>
              <p className="mt-1 text-xl font-bold">{item.value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Section({
  title,
  subtitle,
  children,
  action,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <section className="rounded-[1.25rem] border border-[var(--border-subtle)] bg-[var(--surface)] p-5 shadow-[var(--shadow-sm)] sm:p-6">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold">{title}</h3>
          {subtitle ? <p className="mt-0.5 text-xs text-[var(--muted)]">{subtitle}</p> : null}
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

function InfoGrid({ items }: { items: [string, string][] }) {
  return (
    <dl className="grid gap-3 sm:grid-cols-2">
      {items.map(([label, value]) => (
        <div
          key={label}
          className="rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-muted)]/50 px-3 py-2.5"
        >
          <dt className="text-[10px] font-semibold uppercase tracking-wide text-[var(--muted)]">
            {label}
          </dt>
          <dd className="mt-0.5 text-sm font-medium">{value}</dd>
        </div>
      ))}
    </dl>
  );
}
