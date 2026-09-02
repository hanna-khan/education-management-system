"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, Check, Loader2, MapPin, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { ApiError, getToken } from "@/lib/api";
import { useApp } from "@/hooks/use-app";
import {
  advanceOnboarding,
  createCampus,
  getCampuses,
  getOnboarding,
  updateInstitution,
} from "@/services/tenancy";
import { api } from "@/lib/api";

const STEPS = ["Details", "Campuses", "Appearance", "Features", "Done"] as const;

const STEP_HINTS = [
  "Confirm your institution details",
  "Review campuses and add more if needed",
  "Choose a brand color for your workspace",
  "Turn on the features you need",
  "You’re ready to open the dashboard",
];

export default function OnboardingPage() {
  const router = useRouter();
  const { setSession, institution: liveInstitution } = useApp();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [campuses, setCampuses] = useState<Array<{ id: string; name: string; isPrimary?: boolean; city?: string; address?: string }>>([]);
  const [modules, setModules] = useState<Array<{ id: string; name: string; enabled: boolean; available: boolean }>>([]);
  const [institutionForm, setInstitutionForm] = useState({
    name: "",
    shortName: "",
    city: "",
    primaryColor: "#6B58F6",
  });
  const [campusForm, setCampusForm] = useState({ name: "", address: "", city: "" });

  useEffect(() => {
    if (!getToken()) {
      router.replace("/login");
      return;
    }
    (async () => {
      try {
        const status = await getOnboarding();
        if (status.completed) {
          router.replace("/dashboard");
          return;
        }
        setStep(Math.min(status.step || 0, STEPS.length - 1));
        setInstitutionForm({
          name: status.institution.name,
          shortName: status.institution.shortName,
          city: status.institution.city || "",
          primaryColor: status.institution.primaryColor || "#6B58F6",
        });
        const { me } = await import("@/services/auth");
        const session = await me();
        setSession(session.user, session.institution);
        const [campusRows, moduleRes] = await Promise.all([
          getCampuses(),
          api<{ data: Array<{ id: string; name: string; enabled: boolean; available: boolean }> }>("/modules"),
        ]);
        setCampuses(
          campusRows as Array<{ id: string; name: string; isPrimary?: boolean; city?: string; address?: string }>,
        );
        setModules(moduleRes.data);
      } catch (err) {
        setError(err instanceof ApiError ? err.message : "We couldn’t load your setup. Please try again.");
      } finally {
        setLoading(false);
      }
    })();
  }, [router, setSession]);

  async function saveAndNext() {
    setSaving(true);
    setError(null);
    try {
      if (step === 0) {
        const updated = (await updateInstitution(institutionForm)) as typeof liveInstitution;
        const { me } = await import("@/services/auth");
        const session = await me();
        setSession(session.user, session.institution ?? updated);
      }
      if (step === 2) {
        await updateInstitution({ primaryColor: institutionForm.primaryColor });
      }
      if (step === 3) {
        const payload: Record<string, boolean> = {};
        modules.forEach((m) => {
          if (m.available) payload[m.id] = m.enabled;
        });
        await api("/modules", { method: "PUT", body: { modules: payload } });
      }
      const next = step + 1;
      const complete = next >= STEPS.length - 1;
      await advanceOnboarding(next, complete);
      const { me } = await import("@/services/auth");
      const session = await me();
      setSession(session.user, session.institution);
      if (complete) {
        router.push("/dashboard");
        return;
      }
      setStep(next);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not save. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  async function addCampus() {
    if (!campusForm.name.trim()) return;
    setSaving(true);
    setError(null);
    try {
      await createCampus(campusForm);
      setCampuses(
        (await getCampuses()) as Array<{
          id: string;
          name: string;
          isPrimary?: boolean;
          city?: string;
          address?: string;
        }>,
      );
      setCampusForm({ name: "", address: "", city: "" });
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : "Could not add campus. You may have reached your plan limit.",
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F8F7FC]">
        <Loader2 className="size-7 animate-spin text-[#6B58F6]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[minmax(280px,38%)_minmax(0,1fr)]">
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
          <h1 className="mt-10 max-w-sm text-3xl font-bold leading-tight tracking-tight text-white">
            Finish setting up your institution
          </h1>
          <p className="mt-3 max-w-sm text-sm leading-6 text-indigo-100">
            A short guided setup so your dashboard is ready for your team.
          </p>
        </div>

        {/* Progress checklist — open rows, not cards */}
        <ol className="relative my-10 space-y-5">
          {STEPS.map((label, i) => {
            const done = i < step;
            const active = i === step;
            return (
              <li key={label} className="flex items-start gap-3.5">
                <span
                  className={cn(
                    "mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full text-xs font-bold shadow-sm",
                    done || active
                      ? "bg-white text-[#6B58F6]"
                      : "bg-white/20 text-white/80",
                  )}
                >
                  {done ? <Check className="size-3.5" strokeWidth={2.5} /> : i + 1}
                </span>
                <div className={cn(!done && !active && "opacity-70")}>
                  <p
                    className={cn(
                      "text-sm font-semibold",
                      active ? "text-white" : "text-white/95",
                    )}
                  >
                    {label}
                  </p>
                  <p className="mt-0.5 text-xs leading-5 text-indigo-100/90">{STEP_HINTS[i]}</p>
                </div>
              </li>
            );
          })}
        </ol>

        {/* Distinct footer tip — solid white card */}
        <div className="relative overflow-hidden rounded-2xl bg-white p-4 shadow-lg shadow-black/10">
          <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-[#6B58F6] to-[#8C4AF2]" />
          <p className="pl-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#6B58F6]">
            Almost there
          </p>
          <p className="mt-1.5 pl-2 text-sm leading-5 text-[#3D3558]">
            You can change campuses, colors, and features anytime from Settings.
          </p>
        </div>
      </aside>

      <main className="flex min-h-screen flex-col bg-[#F8F7FC]">
        <div className="flex items-center justify-between border-b border-[#E8E4F4] bg-white/80 px-4 py-3 backdrop-blur sm:px-8 lg:hidden">
          <div className="flex items-center gap-2.5">
            <div className="flex size-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#6B58F6] to-[#8C4AF2] text-xs font-bold text-white">
              Z
            </div>
            <span className="text-sm font-semibold text-[#3D3558]">Setup</span>
          </div>
          <p className="text-xs font-medium text-[#8B86A3]">
            Step {step + 1}/{STEPS.length}
          </p>
        </div>

        <div className="flex flex-1 flex-col px-4 py-6 sm:px-8 sm:py-8 lg:px-12 xl:px-16">
          <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col">
            <nav className="mb-6 hidden gap-1 sm:grid sm:grid-cols-5 lg:hidden" aria-label="Setup steps">
              {STEPS.map((label, i) => (
                <div key={label} className="min-w-0">
                  <div
                    className={cn(
                      "mb-2 h-1.5 rounded-full",
                      i <= step ? "bg-gradient-to-r from-[#6B58F6] to-[#8C4AF2]" : "bg-[#E8E4F4]",
                    )}
                  />
                  <p
                    className={cn(
                      "truncate text-[11px] font-medium",
                      i === step ? "text-[#6B58F6]" : "text-[#8B86A3]",
                    )}
                  >
                    {label}
                  </p>
                </div>
              ))}
            </nav>

            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#6B58F6]">
              Step {step + 1} of {STEPS.length}
            </p>
            <h2 className="mt-1 text-2xl font-bold tracking-tight text-[#3D3558]">{STEPS[step]}</h2>
            <p className="mt-1.5 text-sm text-[#8B86A3]">{STEP_HINTS[step]}</p>

            <div className="mt-6 flex min-h-[min(560px,calc(100vh-12rem))] flex-1 flex-col rounded-3xl border border-[#E8E4F4] bg-white p-5 shadow-[0_18px_50px_-28px_rgba(107,88,246,0.28)] sm:p-7">
              {step === 0 && (
                <div className="flex flex-1 flex-col justify-center space-y-5">
                  <Field label="Institution name">
                    <Input
                      className="h-12 rounded-xl border-[#E8E4F4]"
                      value={institutionForm.name}
                      onChange={(e) => setInstitutionForm({ ...institutionForm, name: e.target.value })}
                    />
                  </Field>
                  <div className="grid gap-5 sm:grid-cols-2">
                    <Field label="Short name">
                      <Input
                        className="h-12 rounded-xl border-[#E8E4F4]"
                        value={institutionForm.shortName}
                        onChange={(e) =>
                          setInstitutionForm({ ...institutionForm, shortName: e.target.value })
                        }
                      />
                    </Field>
                    <Field label="City">
                      <Input
                        className="h-12 rounded-xl border-[#E8E4F4]"
                        value={institutionForm.city}
                        onChange={(e) => setInstitutionForm({ ...institutionForm, city: e.target.value })}
                      />
                    </Field>
                  </div>
                </div>
              )}

              {step === 1 && (
                <div className="flex flex-1 flex-col gap-5">
                  <div>
                    <p className="mb-3 text-sm font-medium text-[#3D3558]">
                      Your campuses ({campuses.length})
                    </p>
                    <div className="grid gap-3 sm:grid-cols-2">
                      {campuses.map((c) => (
                        <div
                          key={c.id}
                          className="flex gap-3 rounded-2xl border border-[#E8E4F4] bg-[#F8F7FC] p-4"
                        >
                          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#6B58F6] to-[#8C4AF2] text-white">
                            <MapPin className="size-4" />
                          </div>
                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <p className="font-semibold text-[#3D3558]">{c.name}</p>
                              {c.isPrimary ? (
                                <span className="rounded-full bg-[#EFEAFF] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[#6B58F6]">
                                  Main
                                </span>
                              ) : null}
                            </div>
                            <p className="mt-1 truncate text-xs text-[#8B86A3]">
                              {[c.city, c.address].filter(Boolean).join(" · ") || "Campus location"}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-auto rounded-2xl border border-dashed border-[#C9C0EF] bg-[#F4F2FB]/60 p-5">
                    <p className="mb-4 flex items-center gap-2 text-sm font-semibold text-[#3D3558]">
                      <Plus className="size-4 text-[#6B58F6]" />
                      Add another campus
                    </p>
                    <div className="grid gap-3 sm:grid-cols-5">
                      <div className="sm:col-span-3">
                        <label className="mb-1.5 block text-xs font-medium text-[#8B86A3]">
                          Campus name
                        </label>
                        <Input
                          className="h-11 rounded-xl border-[#E8E4F4] bg-white"
                          placeholder="e.g. North Campus"
                          value={campusForm.name}
                          onChange={(e) => setCampusForm({ ...campusForm, name: e.target.value })}
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="mb-1.5 block text-xs font-medium text-[#8B86A3]">City</label>
                        <Input
                          className="h-11 rounded-xl border-[#E8E4F4] bg-white"
                          placeholder="e.g. Karachi"
                          value={campusForm.city}
                          onChange={(e) => setCampusForm({ ...campusForm, city: e.target.value })}
                        />
                      </div>
                      <div className="sm:col-span-5">
                        <label className="mb-1.5 block text-xs font-medium text-[#8B86A3]">
                          Address
                        </label>
                        <Input
                          className="h-11 rounded-xl border-[#E8E4F4] bg-white"
                          placeholder="Street, area, landmark"
                          value={campusForm.address}
                          onChange={(e) => setCampusForm({ ...campusForm, address: e.target.value })}
                        />
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      className="mt-4 rounded-xl border-[#E8E4F4] bg-white"
                      onClick={addCampus}
                      disabled={saving || !campusForm.name.trim()}
                    >
                      {saving ? <Loader2 className="size-4 animate-spin" /> : <Plus className="size-4" />}
                      Save campus
                    </Button>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="flex flex-1 flex-col justify-center gap-5">
                  <Field label="Brand color">
                    <div className="flex gap-3">
                      <Input
                        className="h-12 rounded-xl border-[#E8E4F4]"
                        value={institutionForm.primaryColor}
                        onChange={(e) =>
                          setInstitutionForm({ ...institutionForm, primaryColor: e.target.value })
                        }
                      />
                      <input
                        type="color"
                        value={institutionForm.primaryColor}
                        onChange={(e) =>
                          setInstitutionForm({ ...institutionForm, primaryColor: e.target.value })
                        }
                        className="h-12 w-14 cursor-pointer rounded-xl border border-[#E8E4F4]"
                      />
                    </div>
                  </Field>
                  <div
                    className="flex h-36 flex-col justify-end rounded-2xl p-5 text-white shadow-inner"
                    style={{ background: institutionForm.primaryColor }}
                  >
                    <p className="text-sm font-medium text-white/90">Preview</p>
                    <p className="text-lg font-semibold">Your brand accent</p>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="grid flex-1 content-start gap-2 overflow-y-auto pr-1 sm:grid-cols-2">
                  {modules.map((m) => (
                    <label
                      key={m.id}
                      className="flex h-fit items-center justify-between gap-3 rounded-2xl border border-[#E8E4F4] px-4 py-3.5 text-sm"
                    >
                      <span className={cn(!m.available && "text-[#8B86A3]")}>
                        {m.name}
                        {!m.available ? " · not available" : ""}
                      </span>
                      <input
                        type="checkbox"
                        disabled={!m.available}
                        checked={m.enabled && m.available}
                        onChange={(e) =>
                          setModules((prev) =>
                            prev.map((row) =>
                              row.id === m.id ? { ...row, enabled: e.target.checked } : row,
                            ),
                          )
                        }
                      />
                    </label>
                  ))}
                </div>
              )}

              {step === 4 && (
                <div className="flex flex-1 flex-col items-center justify-center text-center">
                  <div className="mb-4 flex size-16 items-center justify-center rounded-full bg-[#EFEAFF] text-[#6B58F6]">
                    <Check className="size-8" />
                  </div>
                  <h3 className="text-xl font-semibold text-[#3D3558]">You’re all set</h3>
                  <p className="mt-2 max-w-sm text-sm text-[#8B86A3]">
                    Your institution is ready. Continue to your dashboard to get started.
                  </p>
                </div>
              )}

              {error ? (
                <p className="mt-4 rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
              ) : null}

              <div className="mt-auto flex justify-between gap-3 border-t border-[#F0EDF7] pt-6">
                <Button
                  variant="outline"
                  className="rounded-xl border-[#E8E4F4]"
                  disabled={step === 0 || saving}
                  onClick={() => setStep(step - 1)}
                >
                  <ArrowLeft className="size-4" /> Back
                </Button>
                {step < STEPS.length - 1 ? (
                  <Button
                    className="rounded-xl bg-gradient-to-r from-[#6B58F6] to-[#8C4AF2] px-6 shadow-sm shadow-[#6B58F6]/25 hover:brightness-105"
                    onClick={saveAndNext}
                    disabled={saving}
                  >
                    {saving ? <Loader2 className="size-4 animate-spin" /> : null}
                    Continue <ArrowRight className="size-4" />
                  </Button>
                ) : (
                  <Button
                    asChild
                    className="rounded-xl bg-gradient-to-r from-[#6B58F6] to-[#8C4AF2] px-6 shadow-sm shadow-[#6B58F6]/25 hover:brightness-105"
                  >
                    <Link href="/dashboard">
                      Go to dashboard <ArrowRight className="size-4" />
                    </Link>
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

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium text-[#3D3558]">{label}</label>
      {children}
    </div>
  );
}
