import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[var(--background)] lg:grid lg:grid-cols-2">
      <div className="relative hidden overflow-hidden bg-[var(--brand-primary)] lg:flex lg:flex-col lg:justify-between lg:p-12">
        <div>
          <div className="flex size-11 items-center justify-center rounded-xl bg-white/10 text-sm font-bold text-white">
            Z
          </div>
          <h1 className="mt-10 max-w-md text-4xl font-semibold tracking-tight text-white">
            Education operations, simplified for modern institutions.
          </h1>
          <p className="mt-4 max-w-md text-sm leading-6 text-indigo-100">
            Manage students, academics, attendance, exams, fees, workflows, and communication
            from one premium platform — built for universities and schools.
          </p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
          <p className="text-sm font-medium text-white">NED Demo University</p>
          <p className="mt-2 text-sm text-indigo-100">
            8,426 students · 386 faculty · 18 departments · Fall 2026 semester active
          </p>
        </div>
      </div>

      <div className="flex items-center justify-center px-4 py-12">
        <Card className="w-full max-w-md border-[var(--border)] shadow-[var(--shadow-md)]">
          <CardHeader>
            <CardTitle>Sign in to Zendrock EMS</CardTitle>
            <p className="text-sm text-[var(--muted)]">
              Use your institution email to access the admin or portal experience.
            </p>
          </CardHeader>
          <CardContent>
            <form className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">
                  Email address
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="ayesha.malik@neddemo.edu.pk"
                  defaultValue="ayesha.malik@neddemo.edu.pk"
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label htmlFor="password" className="text-sm font-medium">
                    Password
                  </label>
                  <Link href="/forgot-password" className="text-xs text-[var(--brand-primary)]">
                    Forgot password?
                  </Link>
                </div>
                <Input id="password" type="password" defaultValue="demo-password" />
              </div>
              <Button asChild className="w-full">
                <Link href="/dashboard">
                  Sign in
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
            </form>
            <p className="mt-6 text-center text-xs text-[var(--muted)]">
              Demo mode — no authentication backend connected yet.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
