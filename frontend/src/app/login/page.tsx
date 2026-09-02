"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, Suspense, useState } from "react";
import {
  ArrowRight,
  Check,
  ClipboardCheck,
  GraduationCap,
  Loader2,
  Wallet,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ApiError } from "@/lib/api";
import { useApp } from "@/hooks/use-app";
import { login } from "@/services/auth";

const HIGHLIGHTS = [
  { icon: GraduationCap, title: "Students & academics", desc: "Programs, classes, and records in one view." },
  { icon: ClipboardCheck, title: "Attendance & exams", desc: "Mark, track, and share results with ease." },
  { icon: Wallet, title: "Fees & daily operations", desc: "Invoices, payments, and campus workflows." },
];

function LoginForm() {
  const router = useRouter();
  const search = useSearchParams();
  const { setSession } = useApp();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const result = await login(email, password);
      setSession(result.user, result.institution);
      const next = search.get("next");
      const role = result.user.role;
      if (result.institution && !result.institution.onboardingCompleted) {
        router.push("/onboarding");
      } else if (next) router.push(next);
      else if (role === "platform_admin") router.push("/platform");
      else if (role === "teacher") router.push("/teacher/dashboard");
      else if (role === "student") router.push("/student/dashboard");
      else if (role === "parent") router.push("/parent/dashboard");
      else router.push("/dashboard");
    } catch (err) {
      const message =
        err instanceof ApiError
          ? err.message
          : "We couldn’t sign you in right now. Please try again.";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[minmax(280px,42%)_minmax(0,1fr)]">
      <aside className="relative hidden overflow-hidden bg-gradient-to-br from-[#6B58F6] via-[#7458F4] to-[#8C4AF2] lg:flex lg:flex-col lg:justify-between lg:px-10 lg:py-10 xl:px-12">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-16 top-24 size-56 rounded-full bg-white/10 blur-2xl" />
          <div className="absolute -right-10 bottom-32 size-64 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute inset-0 opacity-[0.07] [background-image:radial-gradient(circle_at_1px_1px,white_1px,transparent_0)] [background-size:22px_22px]" />
        </div>

        <div className="relative">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-white/15 text-sm font-bold text-white backdrop-blur">
              Z
            </div>
            <span className="text-sm font-semibold tracking-wide text-white">Zendrock EMS</span>
          </div>
          <h1 className="mt-10 max-w-sm text-3xl font-bold leading-tight tracking-tight text-white xl:text-[2.15rem]">
            Welcome back to your campus workspace
          </h1>
          <p className="mt-3 max-w-sm text-sm leading-6 text-indigo-100">
            Sign in to manage students, attendance, fees, exams, and day-to-day operations.
          </p>
        </div>

        <ul className="relative my-10 space-y-3">
          {HIGHLIGHTS.map((item) => (
            <li
              key={item.title}
              className="flex gap-3 rounded-2xl border border-white/15 bg-white/10 p-3.5 backdrop-blur-sm"
            >
              <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-white/15 text-white">
                <item.icon className="size-4" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">{item.title}</p>
                <p className="mt-0.5 text-xs leading-5 text-indigo-100">{item.desc}</p>
              </div>
            </li>
          ))}
        </ul>

        <div className="relative rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-sm">
          <p className="text-sm font-medium text-white">New school or university?</p>
          <p className="mt-1 text-xs leading-5 text-indigo-100">
            Create your account and start with a free trial.
          </p>
          <Link
            href="/register"
            className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-white underline-offset-4 hover:underline"
          >
            Get started <ArrowRight className="size-3.5" />
          </Link>
        </div>
      </aside>

      <main className="flex min-h-screen flex-col justify-center bg-[#F8F7FC] px-4 py-10 sm:px-8 lg:px-12">
        <div className="mx-auto w-full max-w-md">
          <div className="mb-8 flex items-center gap-2.5 lg:hidden">
            <div className="flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#6B58F6] to-[#8C4AF2] text-sm font-bold text-white">
              Z
            </div>
            <span className="text-sm font-semibold text-[#3D3558]">Zendrock EMS</span>
          </div>

          <div className="rounded-3xl border border-[#E8E4F4] bg-white p-7 shadow-[0_18px_50px_-28px_rgba(107,88,246,0.28)] sm:p-8">
            <h2 className="text-2xl font-bold tracking-tight text-[#3D3558]">Sign in</h2>
            <p className="mt-2 text-sm text-[#8B86A3]">Enter your work email and password.</p>

            <form className="mt-7 space-y-4" onSubmit={onSubmit}>
              <div className="space-y-1.5">
                <label htmlFor="email" className="text-sm font-medium text-[#3D3558]">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@yourschool.edu"
                  autoComplete="username"
                  className="h-11 rounded-xl border-[#E8E4F4]"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label htmlFor="password" className="text-sm font-medium text-[#3D3558]">
                    Password
                  </label>
                  <Link href="/forgot-password" className="text-xs font-medium text-[#6B58F6]">
                    Forgot password?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  className="h-11 rounded-xl border-[#E8E4F4]"
                  required
                />
              </div>
              {error ? <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p> : null}
              <Button
                type="submit"
                className="h-11 w-full rounded-xl bg-gradient-to-r from-[#6B58F6] to-[#8C4AF2] shadow-sm shadow-[#6B58F6]/25 hover:brightness-105"
                disabled={loading}
              >
                {loading ? <Loader2 className="size-4 animate-spin" /> : null}
                Sign in
                {!loading ? <ArrowRight className="size-4" /> : null}
              </Button>
            </form>

            <p className="mt-6 text-center text-sm text-[#8B86A3]">
              Don&apos;t have an account?{" "}
              <Link href="/register" className="font-semibold text-[#6B58F6]">
                Register
              </Link>
            </p>
          </div>

          <p className="mt-6 flex items-center justify-center gap-1.5 text-xs text-[#8B86A3]">
            <Check className="size-3.5 text-[#6B58F6]" />
            Your institution’s information stays private and secure
          </p>
        </div>
      </main>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#F8F7FC]">
          <Loader2 className="size-6 animate-spin text-[#6B58F6]" />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
