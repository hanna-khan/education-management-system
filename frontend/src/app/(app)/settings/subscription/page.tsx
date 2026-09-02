"use client";

import { useEffect, useState } from "react";
import { Check, Loader2, Sparkles } from "lucide-react";
import { ModuleHub } from "@/components/shared/module-hub";
import { Button } from "@/components/ui/button";
import { SETTINGS_TABS } from "@/mock/portals";
import { ApiError } from "@/lib/api";
import { useApp } from "@/hooks/use-app";
import { changePlan, getPlans, getSubscription, type Plan } from "@/services/tenancy";
import { me } from "@/services/auth";
import { cn } from "@/lib/utils";

export default function SubscriptionSettingsPage() {
  const { institution, setSession, institutionMode } = useApp();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [sub, setSub] = useState<{
    status?: string;
    trialEndsAt?: string;
    plan?: { id: string; name: string; features?: string[] };
  } | null>(null);
  const [access, setAccess] = useState<{
    locked?: boolean;
    reason?: string | null;
    trialDaysLeft?: number | null;
  } | null>(null);

  async function refresh() {
    setLoading(true);
    setError(null);
    try {
      const [planRows, subRes] = await Promise.all([
        getPlans(institutionMode),
        getSubscription() as Promise<{
          access?: { locked?: boolean; reason?: string | null; trialDaysLeft?: number | null };
          subscription?: {
            status?: string;
            trialEndsAt?: string;
            billingCycle?: "monthly" | "yearly";
            plan?: { id: string; name: string; features?: string[] };
          } | null;
        }>,
      ]);
      setPlans(planRows);
      setSub(subRes.subscription ?? null);
      setAccess(subRes.access ?? null);
      if (subRes.subscription?.billingCycle) {
        setBillingCycle(subRes.subscription.billingCycle);
      }
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not load subscription.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [institutionMode]);

  async function onChoose(planId: string) {
    setSaving(planId);
    setError(null);
    try {
      await changePlan(planId, billingCycle);
      const session = await me();
      setSession(session.user, session.institution);
      await refresh();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not update plan.");
    } finally {
      setSaving(null);
    }
  }

  return (
    <ModuleHub
      title="Subscription"
      description="Your plan controls campuses, staff limits, and which features you can use."
      breadcrumbs={[
        { label: "Dashboard", href: "/dashboard" },
        { label: "Settings", href: "/settings" },
        { label: "Subscription" },
      ]}
      tabs={SETTINGS_TABS}
    >
      {access?.locked ? (
        <div className="mb-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {access.reason || "Your trial has ended. Choose a plan below to continue."}
        </div>
      ) : sub?.status === "trialing" ? (
        <div className="mb-5 flex items-start gap-3 rounded-2xl border border-[#F5D9B8] bg-[#FFF7ED] px-4 py-3">
          <Sparkles className="mt-0.5 size-4 text-[#E67A12]" />
          <div>
            <p className="text-sm font-semibold text-[#3D3558]">
              Free trial
              {typeof access?.trialDaysLeft === "number"
                ? ` · ${access.trialDaysLeft} day${access.trialDaysLeft === 1 ? "" : "s"} left`
                : ""}
            </p>
            <p className="text-xs text-[#8B86A3]">
              Current plan: {sub.plan?.name || institution.subscription?.plan?.name || "—"}
            </p>
          </div>
        </div>
      ) : null}

      <div className="mb-4 inline-flex gap-1 rounded-full bg-[#F4F2FB] p-1">
        {(["monthly", "yearly"] as const).map((cycle) => (
          <button
            key={cycle}
            type="button"
            onClick={() => setBillingCycle(cycle)}
            className={cn(
              "rounded-full px-4 py-2 text-sm font-medium capitalize",
              billingCycle === cycle ? "bg-white text-[#3D3558] shadow-sm" : "text-[#8B86A3]",
            )}
          >
            {cycle}
          </button>
        ))}
      </div>

      {error ? (
        <p className="mb-4 rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
      ) : null}

      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="size-6 animate-spin text-[#6B58F6]" />
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {plans.map((plan) => {
            const price = billingCycle === "yearly" ? plan.priceYearly : plan.priceMonthly;
            const current = sub?.plan?.id === plan.id;
            return (
              <div
                key={plan.id}
                className={cn(
                  "flex flex-col rounded-3xl border bg-white p-5 shadow-sm",
                  current ? "border-[#6B58F6] ring-1 ring-[#6B58F6]/25" : "border-[#E8E4F4]",
                )}
              >
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-lg font-semibold text-[#3D3558]">{plan.name}</h3>
                  {current ? (
                    <span className="rounded-full bg-[#EFEAFF] px-2 py-0.5 text-[10px] font-semibold uppercase text-[#6B58F6]">
                      Current
                    </span>
                  ) : null}
                </div>
                <p className="mt-1 text-sm text-[#8B86A3]">{plan.description}</p>
                <p className="mt-4 text-2xl font-bold text-[#3D3558]">
                  {plan.currency} {price.toLocaleString()}
                  <span className="ml-1 text-xs font-medium text-[#8B86A3]">
                    /{billingCycle === "yearly" ? "year" : "month"}
                  </span>
                </p>
                <ul className="mt-4 flex-1 space-y-2">
                  {plan.features.slice(0, 5).map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-[#3D3558]">
                      <Check className="mt-0.5 size-3.5 shrink-0 text-[#6B58F6]" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Button
                  className="mt-5 h-11 rounded-xl bg-gradient-to-r from-[#6B58F6] to-[#8C4AF2]"
                  disabled={current || saving === plan.id}
                  onClick={() => onChoose(plan.id)}
                >
                  {saving === plan.id ? <Loader2 className="size-4 animate-spin" /> : null}
                  {current ? "Selected" : access?.locked ? "Activate plan" : "Switch to this plan"}
                </Button>
              </div>
            );
          })}
        </div>
      )}
    </ModuleHub>
  );
}
