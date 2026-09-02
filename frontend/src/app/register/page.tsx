"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  GraduationCap,
  ImagePlus,
  Loader2,
  School,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ApiError } from "@/lib/api";
import { useApp } from "@/hooks/use-app";
import { getPlans, registerInstitution, type Plan } from "@/services/tenancy";
import { cn } from "@/lib/utils";

const STEPS = ["Type", "Plan", "School details", "Campus", "Your account"] as const;

const BENEFITS = [
  {
    icon: Users,
    title: "Students, staff & parents",
    desc: "One place for daily school operations.",
  },
  {
    icon: Check,
    title: "Attendance, fees & exams",
    desc: "Track the work that keeps campuses running.",
  },
  {
    icon: ShieldCheck,
    title: "Secure by design",
    desc: "Each institution’s data stays private.",
  },
  {
    icon: Sparkles,
    title: "Free trial included",
    desc: "Explore the full product before you pay.",
  },
];

export default function RegisterPage() {
  const router = useRouter();
  const { setSession } = useApp();
  const [step, setStep] = useState(0);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loadingPlans, setLoadingPlans] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [type, setType] = useState<"school" | "university">("school");
  const [planId, setPlanId] = useState("");
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [form, setForm] = useState({
    institutionName: "",
    shortName: "",
    city: "",
    contactEmail: "",
    contactPhone: "",
    campusName: "Main Campus",
    campusAddress: "",
    adminName: "",
    adminEmail: "",
    password: "",
    password_confirmation: "",
  });

  useEffect(() => {
    setLoadingPlans(true);
    getPlans(type)
      .then((data) => {
        setPlans(data);
        setPlanId((current) => (data.some((p) => p.id === current) ? current : data[0]?.id ?? ""));
      })
      .catch(() => setError("We couldn’t load plans right now. Please try again in a moment."))
      .finally(() => setLoadingPlans(false));
  }, [type]);

  const selectedPlan = useMemo(() => plans.find((p) => p.id === planId), [plans, planId]);

  function update<K extends keyof typeof form>(key: K, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function canContinue() {
    if (step === 0) return Boolean(type);
    if (step === 1) return Boolean(planId);
    if (step === 2) return Boolean(form.institutionName && form.shortName && form.contactEmail);
    if (step === 3) return Boolean(form.campusName);
    if (step === 4) {
      return (
        Boolean(form.adminName && form.adminEmail && form.password.length >= 8) &&
        form.password === form.password_confirmation
      );
    }
    return false;
  }

  async function onCreate() {
    setError(null);
    setSubmitting(true);
    try {
      const result = await registerInstitution({
        ...form,
        type,
        planId,
        billingCycle,
        logo: logoFile,
      });
      setSession(result.user, result.institution);
      router.push("/onboarding");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Registration failed. Please check your details.");
    } finally {
      setSubmitting(false);
    }
  }

  function onLogoChange(file: File | null) {
    if (logoPreview) URL.revokeObjectURL(logoPreview);
    setLogoFile(file);
    setLogoPreview(file ? URL.createObjectURL(file) : null);
  }

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[minmax(280px,42%)_minmax(0,1fr)]">
      {/* Brand panel — filled top → middle → bottom (no empty void) */}
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
            Set up your school or university in a few clear steps
          </h1>
          <p className="mt-3 max-w-sm text-sm leading-6 text-indigo-100">
            Create your account, pick a plan, and start managing campus life with confidence.
          </p>
        </div>

        <ul className="relative my-10 space-y-5">
          {BENEFITS.map((item) => (
            <li key={item.title} className="flex items-start gap-3.5">
              <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-white text-[#6B58F6] shadow-sm">
                <item.icon className="size-3.5" strokeWidth={2.5} />
              </span>
              <div>
                <p className="text-sm font-semibold text-white">{item.title}</p>
                <p className="mt-0.5 text-xs leading-5 text-indigo-100/90">{item.desc}</p>
              </div>
            </li>
          ))}
        </ul>

        <div className="relative overflow-hidden rounded-2xl bg-white p-4 shadow-lg shadow-black/10">
          <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-[#6B58F6] to-[#8C4AF2]" />
          <p className="pl-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#6B58F6]">
            Trusted by education teams
          </p>
          <p className="mt-1.5 pl-2 text-sm leading-5 text-[#3D3558]">
            Built for principals, registrars, and campus admins — clear screens, plain language.
          </p>
        </div>
      </aside>

      {/* Form panel */}
      <main className="flex min-h-screen flex-col bg-[#F8F7FC]">
        <div className="flex items-center justify-between border-b border-[#E8E4F4] bg-white/80 px-4 py-3 backdrop-blur sm:px-8 lg:hidden">
          <div className="flex items-center gap-2.5">
            <div className="flex size-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#6B58F6] to-[#8C4AF2] text-xs font-bold text-white">
              Z
            </div>
            <span className="text-sm font-semibold text-[#3D3558]">Zendrock EMS</span>
          </div>
          <Link href="/login" className="text-sm font-medium text-[#6B58F6]">
            Sign in
          </Link>
        </div>

        <div className="flex flex-1 flex-col px-4 py-6 sm:px-8 sm:py-8 lg:px-12 xl:px-16">
          <div className="mb-6 hidden items-center justify-between lg:flex">
            <p className="text-sm text-[#8B86A3]">
              Already have an account?{" "}
              <Link href="/login" className="font-semibold text-[#6B58F6] hover:underline">
                Sign in
              </Link>
            </p>
            <p className="text-xs font-medium text-[#8B86A3]">
              Step {step + 1} of {STEPS.length}
            </p>
          </div>

          <div
            className={cn(
              "mx-auto flex w-full flex-1 flex-col",
              step === 1 ? "max-w-5xl" : "max-w-2xl",
            )}
          >
            {/* Labeled step rail */}
            <nav className="mb-6 hidden gap-1 sm:grid sm:grid-cols-5" aria-label="Registration steps">
              {STEPS.map((label, i) => {
                const done = i < step;
                const active = i === step;
                return (
                  <div key={label} className="min-w-0">
                    <div
                      className={cn(
                        "mb-2 h-1.5 rounded-full",
                        done || active
                          ? "bg-gradient-to-r from-[#6B58F6] to-[#8C4AF2]"
                          : "bg-[#E8E4F4]",
                      )}
                    />
                    <p
                      className={cn(
                        "truncate text-[11px] font-medium",
                        active ? "text-[#6B58F6]" : done ? "text-[#3D3558]" : "text-[#8B86A3]",
                      )}
                    >
                      {label}
                    </p>
                  </div>
                );
              })}
            </nav>

            <div className="mb-4 sm:hidden">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#6B58F6]">
                Step {step + 1} of {STEPS.length}
              </p>
              <div className="mt-2 flex gap-1">
                {STEPS.map((label, i) => (
                  <div
                    key={label}
                    className={cn(
                      "h-1.5 flex-1 rounded-full",
                      i <= step ? "bg-[#6B58F6]" : "bg-[#E8E4F4]",
                    )}
                  />
                ))}
              </div>
            </div>

            <h2 className="text-2xl font-bold tracking-tight text-[#3D3558] sm:text-[1.75rem]">
              {STEPS[step]}
            </h2>
            <p className="mt-1.5 text-sm text-[#8B86A3]">
              {step === 0 && "Choose the type of institution you manage."}
              {step === 1 && "Select a plan that matches your campus size."}
              {step === 2 && "Add your institution’s basic information."}
              {step === 3 && "Add your main campus — you can add more later."}
              {step === 4 && "Create the admin account you’ll use to sign in."}
            </p>

            <div
              className={cn(
                "mt-6 flex flex-col rounded-3xl border border-[#E8E4F4] bg-white p-5 shadow-[0_18px_50px_-28px_rgba(107,88,246,0.28)] sm:p-7",
                step === 0 && "min-h-[min(520px,calc(100vh-14rem))] flex-1",
              )}
            >
              {step === 0 && (
                <div className="grid flex-1 gap-4 sm:grid-cols-2 sm:items-stretch">
                  {[
                    {
                      id: "school" as const,
                      title: "School",
                      desc: "Students, parents, and daily campus operations — attendance, fees, and parent updates.",
                      points: ["Parent-friendly portals", "Daily operations", "Classroom tools"],
                      icon: School,
                    },
                    {
                      id: "university" as const,
                      title: "University",
                      desc: "Programs, campuses, and larger academic teams — admissions through graduation.",
                      points: ["Multi-campus ready", "Programs & exams", "Campus life modules"],
                      icon: GraduationCap,
                    },
                  ].map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setType(item.id)}
                      className={cn(
                        "flex h-full min-h-[240px] flex-col rounded-2xl border p-6 text-left transition sm:min-h-0 sm:p-7",
                        type === item.id
                          ? "border-[#6B58F6] bg-[#EFEAFF] shadow-sm"
                          : "border-[#E8E4F4] hover:border-[#6B58F6]/40",
                      )}
                    >
                      <div className="flex size-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#6B58F6] to-[#8C4AF2] text-white">
                        <item.icon className="size-6" />
                      </div>
                      <p className="mt-5 text-lg font-semibold text-[#3D3558]">{item.title}</p>
                      <p className="mt-2 text-sm leading-6 text-[#8B86A3]">{item.desc}</p>
                      <ul className="mt-auto space-y-2 border-t border-[#E8E4F4]/80 pt-5">
                        {item.points.map((point) => (
                          <li key={point} className="flex items-center gap-2 text-sm text-[#3D3558]">
                            <Check className="size-3.5 shrink-0 text-[#6B58F6]" />
                            {point}
                          </li>
                        ))}
                      </ul>
                    </button>
                  ))}
                </div>
              )}

              {step === 1 && (
                <div className="space-y-4">
                  <div className="inline-flex gap-1 rounded-full bg-[#F4F2FB] p-1">
                    {(["monthly", "yearly"] as const).map((cycle) => (
                      <button
                        key={cycle}
                        type="button"
                        onClick={() => setBillingCycle(cycle)}
                        className={cn(
                          "rounded-full px-4 py-2 text-sm font-medium capitalize transition",
                          billingCycle === cycle
                            ? "bg-white text-[#3D3558] shadow-sm"
                            : "text-[#8B86A3]",
                        )}
                      >
                        {cycle}
                      </button>
                    ))}
                  </div>
                  {loadingPlans ? (
                    <div className="flex justify-center py-10">
                      <Loader2 className="size-6 animate-spin text-[#6B58F6]" />
                    </div>
                  ) : (
                    <div
                      className={cn(
                        "grid gap-3 max-md:grid-cols-1",
                        plans.length === 1 && "md:grid-cols-1",
                        plans.length === 2 && "md:grid-cols-2",
                        plans.length === 3 && "md:grid-cols-3",
                        plans.length >= 4 && "md:grid-cols-4",
                      )}
                    >
                      {plans.map((plan) => {
                        const price = billingCycle === "yearly" ? plan.priceYearly : plan.priceMonthly;
                        const active = planId === plan.id;
                        return (
                          <button
                            key={plan.id}
                            type="button"
                            onClick={() => setPlanId(plan.id)}
                            className={cn(
                              "flex min-w-0 flex-col rounded-2xl border p-4 text-left transition",
                              active
                                ? "border-[#6B58F6] bg-[#EFEAFF] ring-1 ring-[#6B58F6]/30"
                                : "border-[#E8E4F4] hover:border-[#6B58F6]/35",
                            )}
                          >
                            <div className="flex items-start justify-between gap-2">
                              <p className="font-semibold text-[#3D3558]">{plan.name}</p>
                              {active ? (
                                <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-[#6B58F6] text-white">
                                  <Check className="size-3" />
                                </span>
                              ) : null}
                            </div>
                            <p className="mt-1 line-clamp-2 text-xs leading-5 text-[#8B86A3]">
                              {plan.description}
                            </p>
                            <p className="mt-3 text-base font-bold text-[#3D3558] xl:text-lg">
                              {plan.currency} {price.toLocaleString()}
                              <span className="ml-1 text-[11px] font-medium text-[#8B86A3]">
                                /{billingCycle === "yearly" ? "yr" : "mo"}
                              </span>
                            </p>
                            <p className="mt-1 text-[11px] text-[#8B86A3]">
                              {plan.trialDays}-day free trial
                            </p>
                            <ul className="mt-3 space-y-1.5 border-t border-[#E8E4F4]/80 pt-3">
                              {plan.features.slice(0, 3).map((f) => (
                                <li key={f} className="flex items-start gap-1.5 text-[11px] text-[#6B7280]">
                                  <Check className="mt-0.5 size-3 shrink-0 text-[#6B58F6]" />
                                  <span className="line-clamp-2">{f}</span>
                                </li>
                              ))}
                            </ul>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {step === 2 && (
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <label className="mb-1.5 block text-sm font-medium text-[#3D3558]">
                      Institution logo
                    </label>
                    <div className="flex flex-col gap-3 rounded-2xl border border-dashed border-[#C9C0EF] bg-[#F8F7FC] p-4 sm:flex-row sm:items-center">
                      <div className="flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-[#6B58F6] to-[#8C4AF2] text-lg font-bold text-white">
                        {logoPreview ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={logoPreview} alt="Logo preview" className="size-full object-cover" />
                        ) : (
                          form.shortName.slice(0, 2).toUpperCase() || <ImagePlus className="size-5" />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-[#3D3558]">Upload your school or university logo</p>
                        <p className="mt-0.5 text-xs text-[#8B86A3]">PNG or JPG, up to 2 MB. Optional — you can add it later.</p>
                        <div className="mt-2 flex flex-wrap gap-2">
                          <label className="inline-flex h-9 cursor-pointer items-center rounded-xl bg-white px-3 text-sm font-medium text-[#6B58F6] ring-1 ring-[#E8E4F4]">
                            Choose file
                            <input
                              type="file"
                              accept="image/png,image/jpeg,image/webp"
                              className="hidden"
                              onChange={(e) => onLogoChange(e.target.files?.[0] ?? null)}
                            />
                          </label>
                          {logoFile ? (
                            <button
                              type="button"
                              className="h-9 rounded-xl px-3 text-sm text-[#8B86A3] hover:text-[#3D3558]"
                              onClick={() => onLogoChange(null)}
                            >
                              Remove
                            </button>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  </div>
                  <Field label="Institution name" className="sm:col-span-2">
                    <Input
                      value={form.institutionName}
                      onChange={(e) => update("institutionName", e.target.value)}
                      placeholder="e.g. Crescent Public School"
                      className="h-11 rounded-xl border-[#E8E4F4]"
                    />
                  </Field>
                  <Field label="Short name">
                    <Input
                      value={form.shortName}
                      onChange={(e) => update("shortName", e.target.value)}
                      placeholder="e.g. CPS"
                      className="h-11 rounded-xl border-[#E8E4F4]"
                    />
                  </Field>
                  <Field label="City">
                    <Input
                      value={form.city}
                      onChange={(e) => update("city", e.target.value)}
                      placeholder="Karachi"
                      className="h-11 rounded-xl border-[#E8E4F4]"
                    />
                  </Field>
                  <Field label="Contact email">
                    <Input
                      type="email"
                      value={form.contactEmail}
                      onChange={(e) => update("contactEmail", e.target.value)}
                      className="h-11 rounded-xl border-[#E8E4F4]"
                    />
                  </Field>
                  <Field label="Contact phone">
                    <Input
                      value={form.contactPhone}
                      onChange={(e) => update("contactPhone", e.target.value)}
                      className="h-11 rounded-xl border-[#E8E4F4]"
                    />
                  </Field>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-4">
                  <Field label="Main campus name">
                    <Input
                      value={form.campusName}
                      onChange={(e) => update("campusName", e.target.value)}
                      className="h-11 rounded-xl border-[#E8E4F4]"
                    />
                  </Field>
                  <Field label="Campus address">
                    <Input
                      value={form.campusAddress}
                      onChange={(e) => update("campusAddress", e.target.value)}
                      placeholder="Street, area, city"
                      className="h-11 rounded-xl border-[#E8E4F4]"
                    />
                  </Field>
                  <p className="text-xs text-[#8B86A3]">
                    You can add more campuses after setup
                    {selectedPlan?.maxCampuses ? ` (up to ${selectedPlan.maxCampuses} on your plan)` : ""}.
                  </p>
                </div>
              )}

              {step === 4 && (
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Your full name" className="sm:col-span-2">
                    <Input
                      value={form.adminName}
                      onChange={(e) => update("adminName", e.target.value)}
                      className="h-11 rounded-xl border-[#E8E4F4]"
                    />
                  </Field>
                  <Field label="Sign-in email" className="sm:col-span-2">
                    <Input
                      type="email"
                      value={form.adminEmail}
                      onChange={(e) => update("adminEmail", e.target.value)}
                      className="h-11 rounded-xl border-[#E8E4F4]"
                    />
                  </Field>
                  <Field label="Password">
                    <Input
                      type="password"
                      minLength={8}
                      value={form.password}
                      onChange={(e) => update("password", e.target.value)}
                      className="h-11 rounded-xl border-[#E8E4F4]"
                    />
                  </Field>
                  <Field label="Confirm password">
                    <Input
                      type="password"
                      minLength={8}
                      value={form.password_confirmation}
                      onChange={(e) => update("password_confirmation", e.target.value)}
                      className="h-11 rounded-xl border-[#E8E4F4]"
                    />
                  </Field>
                  {selectedPlan ? (
                    <div className="sm:col-span-2 flex items-start gap-3 rounded-2xl bg-[#EFEAFF] p-3.5 text-sm text-[#3D3558]">
                      <Sparkles className="mt-0.5 size-4 shrink-0 text-[#6B58F6]" />
                      <p>
                        You’ll start with <strong>{selectedPlan.name}</strong> and a{" "}
                        {selectedPlan.trialDays}-day free trial. No payment needed now.
                      </p>
                    </div>
                  ) : null}
                </div>
              )}

              {error ? (
                <p className="mt-4 rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
              ) : null}

              <div
                className={cn(
                  "flex items-center justify-between gap-3 border-t border-[#F0EDF7] pt-5",
                  step === 0 ? "mt-auto pt-8" : "mt-7",
                )}
              >
                <Button
                  type="button"
                  variant="outline"
                  className="rounded-xl border-[#E8E4F4]"
                  disabled={step === 0 || submitting}
                  onClick={() => setStep((s) => Math.max(0, s - 1))}
                >
                  <ArrowLeft className="size-4" />
                  Back
                </Button>
                {step < STEPS.length - 1 ? (
                  <Button
                    type="button"
                    className="rounded-xl bg-gradient-to-r from-[#6B58F6] to-[#8C4AF2] px-6 shadow-sm shadow-[#6B58F6]/25 hover:brightness-105"
                    disabled={!canContinue()}
                    onClick={() => setStep((s) => s + 1)}
                  >
                    Continue
                    <ArrowRight className="size-4" />
                  </Button>
                ) : (
                  <Button
                    type="button"
                    className="rounded-xl bg-gradient-to-r from-[#6B58F6] to-[#8C4AF2] px-6 shadow-sm shadow-[#6B58F6]/25 hover:brightness-105"
                    disabled={!canContinue() || submitting}
                    onClick={onCreate}
                  >
                    {submitting ? <Loader2 className="size-4 animate-spin" /> : <Check className="size-4" />}
                    Create account
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function Field({
  label,
  children,
  className,
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <label className="text-sm font-medium text-[#3D3558]">{label}</label>
      {children}
    </div>
  );
}
