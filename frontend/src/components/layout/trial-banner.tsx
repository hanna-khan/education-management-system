"use client";

import Link from "next/link";
import { ArrowUpRight, Sparkles } from "lucide-react";
import { useApp } from "@/hooks/use-app";

export function TrialBanner() {
  const { institution } = useApp();

  if (institution.status !== "trial") return null;

  const daysLeft = 18;
  const daysUsed = 12;
  const total = daysUsed + daysLeft;
  const progress = Math.round((daysUsed / total) * 100);

  return (
    <div className="px-4 pt-3 lg:px-6">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#FFF4E8] via-[#FFF0F5] to-[#F0EBFF] px-4 py-3 sm:px-5">
        <div className="pointer-events-none absolute -right-8 -top-8 size-28 rounded-full bg-[#6B58F6]/10" />
        <div className="pointer-events-none absolute -bottom-10 left-1/3 size-24 rounded-full bg-[#F4901F]/10" />

        <div className="relative flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex min-w-0 items-start gap-3">
            <div className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-xl bg-white/80 text-[#F4901F] shadow-sm">
              <Sparkles className="size-4" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-[#3D3558]">
                Your free trial ends in{" "}
                <span className="text-[#E67A12]">{daysLeft} days</span>
              </p>
              <p className="mt-0.5 text-xs text-[#7A7394]">
                {daysUsed} days used · {daysLeft} days remaining · All core modules enabled for{" "}
                {institution.shortName}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 sm:shrink-0">
            <div className="hidden items-center gap-2 sm:flex">
              <div className="h-2 w-28 overflow-hidden rounded-full bg-white/80">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#F4901F] to-[#FF6B4A]"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <span className="text-[11px] font-semibold text-[#E67A12]">{progress}%</span>
            </div>
            <Link
              href="/settings/subscription"
              className="inline-flex h-9 items-center gap-1.5 rounded-xl bg-gradient-to-r from-[#6B58F6] to-[#8C4AF2] px-3.5 text-sm font-semibold text-white shadow-sm shadow-[#6B58F6]/25 transition hover:brightness-105"
            >
              Choose plan
              <ArrowUpRight className="size-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
