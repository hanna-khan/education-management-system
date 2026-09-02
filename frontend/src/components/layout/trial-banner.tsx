"use client";

import Link from "next/link";
import { ArrowUpRight, Lock, Sparkles } from "lucide-react";
import { useApp } from "@/hooks/use-app";

export function TrialBanner() {
  const { institution } = useApp();
  if (!institution?.id) return null;

  const access = institution.access;
  const locked = access?.locked || institution.status === "expired";
  const trialDaysLeft = access?.trialDaysLeft;
  const trialEndsAt = institution.subscription?.trialEndsAt || access?.trialEndsAt;
  const isTrial =
    !locked &&
    (institution.status === "trial" || institution.subscription?.status === "trialing");

  if (!isTrial && !locked) return null;

  if (locked) {
    return (
      <div className="px-4 pt-3 lg:px-6">
        <div className="relative overflow-hidden rounded-2xl border border-red-200 bg-gradient-to-r from-[#FFF1F0] to-[#F8F0FF] px-4 py-3 sm:px-5">
          <div className="relative flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-xl bg-white text-red-500 shadow-sm">
                <Lock className="size-4" />
              </div>
              <div>
                <p className="text-sm font-semibold text-[#3D3558]">
                  {access?.reason || "Your trial has ended. Choose a plan to continue."}
                </p>
                <p className="mt-0.5 text-xs text-[#7A7394]">
                  You can still browse, but adding or changing data is paused until you pick a plan.
                </p>
              </div>
            </div>
            <Link
              href="/settings/subscription"
              className="inline-flex h-9 items-center gap-1.5 rounded-xl bg-gradient-to-r from-[#6B58F6] to-[#8C4AF2] px-3.5 text-sm font-semibold text-white shadow-sm"
            >
              Choose plan
              <ArrowUpRight className="size-3.5" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const daysLeft =
    typeof trialDaysLeft === "number"
      ? trialDaysLeft
      : trialEndsAt
        ? Math.max(0, Math.ceil((new Date(trialEndsAt).getTime() - Date.now()) / 86400000))
        : null;

  if (daysLeft === null) return null;

  const planName = institution.subscription?.plan?.name || "your plan";

  return (
    <div className="px-4 pt-3 lg:px-6">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#FFF4E8] via-[#FFF0F5] to-[#F0EBFF] px-4 py-3 sm:px-5">
        <div className="relative flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex min-w-0 items-start gap-3">
            <div className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-xl bg-white/80 text-[#F4901F] shadow-sm">
              <Sparkles className="size-4" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-[#3D3558]">
                Free trial ·{" "}
                <span className="text-[#E67A12]">
                  {daysLeft === 0 ? "ends today" : `${daysLeft} day${daysLeft === 1 ? "" : "s"} left`}
                </span>
              </p>
              <p className="mt-0.5 text-xs text-[#7A7394]">
                You&apos;re on {planName}. Modules outside your plan stay locked until you upgrade.
              </p>
            </div>
          </div>
          <Link
            href="/settings/subscription"
            className="inline-flex h-9 items-center gap-1.5 rounded-xl bg-gradient-to-r from-[#6B58F6] to-[#8C4AF2] px-3.5 text-sm font-semibold text-white shadow-sm shadow-[#6B58F6]/25 transition hover:brightness-105"
          >
            View plans
            <ArrowUpRight className="size-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
