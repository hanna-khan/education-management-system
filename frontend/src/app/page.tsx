import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  Building2,
  CheckCircle2,
  GraduationCap,
  Shield,
  Sparkles,
  Users,
  Workflow,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

const features = [
  {
    icon: Workflow,
    title: "Workflow automation",
    description:
      "Turn leave requests, scholarships, certificates, and approvals into trackable digital workflows.",
  },
  {
    icon: GraduationCap,
    title: "Student lifecycle",
    description:
      "Manage admissions, academics, attendance, exams, fees, and documents in one unified platform.",
  },
  {
    icon: Users,
    title: "Multi-portal experience",
    description:
      "Dedicated experiences for admins, teachers, students, and parents — university and school modes.",
  },
  {
    icon: BarChart3,
    title: "Operational intelligence",
    description:
      "Real-time dashboards for attendance, applications, finance, and academic performance.",
  },
  {
    icon: Building2,
    title: "Multi-tenant architecture",
    description:
      "Each institution gets its own branding, modules, users, and data — managed from a platform admin portal.",
  },
  {
    icon: Shield,
    title: "Enterprise-ready",
    description:
      "Role-based access, audit trails, subscription management, and security controls built for institutions.",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[var(--background)]">
      <header className="border-b border-[var(--border)] bg-[var(--surface)]/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 lg:px-6">
          <div className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-lg bg-[var(--brand-primary)] text-sm font-bold text-white">
              Z
            </div>
            <div>
              <p className="text-sm font-semibold">Zendrock EMS</p>
              <p className="text-xs text-[var(--muted)]">Education Management System</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button asChild variant="ghost">
              <Link href="/login">Sign in</Link>
            </Button>
            <Button asChild>
              <Link href="/login">Start free trial</Link>
            </Button>
          </div>
        </div>
      </header>

      <main>
        <section className="mx-auto max-w-7xl px-4 py-20 lg:px-6 lg:py-28">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <Badge variant="info" className="mb-4">
                <Sparkles className="mr-1 size-3" />
                Premium Education Operations SaaS
              </Badge>
              <h1 className="text-4xl font-semibold tracking-tight text-[var(--foreground)] sm:text-5xl">
                Run your institution without the paperwork.
              </h1>
              <p className="mt-5 max-w-xl text-lg text-[var(--muted)]">
                Digitize student services, attendance, academics, approvals, communication,
                and administration in one platform built for universities and schools in Pakistan.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button asChild size="lg">
                  <Link href="/login">
                    Start free trial
                    <ArrowRight className="size-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href="/dashboard">View product demo</Link>
                </Button>
              </div>
              <div className="mt-10 flex flex-wrap gap-6 text-sm text-[var(--muted)]">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="size-4 text-[var(--success)]" />
                  30-day free trial
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="size-4 text-[var(--success)]" />
                  University & school modes
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="size-4 text-[var(--success)]" />
                  Multi-tenant platform
                </div>
              </div>
            </div>

            <Card className="overflow-hidden border-[var(--border)] shadow-[var(--shadow-md)]">
              <CardContent className="p-0">
                <div className="border-b border-[var(--border)] bg-[var(--secondary)] px-6 py-4">
                  <p className="text-sm font-medium text-[var(--secondary-foreground)]">
                    NED Demo University — Admin Dashboard
                  </p>
                </div>
                <div className="space-y-4 p-6">
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      ["8,426", "Students"],
                      ["93.9%", "Attendance"],
                      ["42", "Applications"],
                      ["PKR 12.8M", "Fees collected"],
                    ].map(([value, label]) => (
                      <div
                        key={label}
                        className="rounded-xl border border-[var(--border)] bg-[var(--surface-muted)] p-4"
                      >
                        <p className="text-lg font-semibold">{value}</p>
                        <p className="text-xs text-[var(--muted)]">{label}</p>
                      </div>
                    ))}
                  </div>
                  <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-muted)] p-4">
                    <p className="text-sm font-medium">Application pipeline</p>
                    <div className="mt-3 flex h-2 overflow-hidden rounded-full bg-[var(--border)]">
                      <div className="w-[35%] bg-[var(--brand-primary)]" />
                      <div className="w-[25%] bg-[var(--info)]" />
                      <div className="w-[20%] bg-[var(--success)]" />
                      <div className="w-[20%] bg-[var(--warning)]" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="border-t border-[var(--border)] bg-[var(--surface)] py-20">
          <div className="mx-auto max-w-7xl px-4 lg:px-6">
            <div className="max-w-2xl">
              <h2 className="text-3xl font-semibold tracking-tight">
                Everything your institution needs to operate digitally
              </h2>
              <p className="mt-3 text-[var(--muted)]">
                From admissions to graduation — workflows, portals, and analytics designed for
                enterprise education operations.
              </p>
            </div>
            <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {features.map((feature) => (
                <Card key={feature.title} className="p-6">
                  <div className="mb-4 flex size-10 items-center justify-center rounded-lg bg-[var(--secondary)] text-[var(--brand-primary)]">
                    <feature.icon className="size-5" />
                  </div>
                  <h3 className="text-base font-semibold">{feature.title}</h3>
                  <p className="mt-2 text-sm text-[var(--muted)]">{feature.description}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
