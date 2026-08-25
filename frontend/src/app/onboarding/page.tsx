"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const STEPS = [
  "Institution details",
  "Campus",
  "Academic structure",
  "Admin user",
  "Branding",
  "Import data",
  "Configure modules",
  "Complete",
];

export default function OnboardingPage() {
  const [step, setStep] = useState(0);

  return (
    <div className="min-h-screen bg-[var(--background)] px-4 py-10">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex size-11 items-center justify-center rounded-xl bg-[var(--brand-primary)] text-sm font-bold text-white">Z</div>
          <h1 className="ems-page-title">Set up your institution</h1>
          <p className="mt-2 text-sm text-[var(--muted)]">Step {step + 1} of {STEPS.length} — {STEPS[step]}</p>
        </div>

        <div className="mb-8 flex justify-center gap-1">
          {STEPS.map((_, i) => (
            <div key={i} className={cn("h-1.5 w-8 rounded-full transition-colors", i <= step ? "bg-[var(--brand-primary)]" : "bg-[var(--border)]")} />
          ))}
        </div>

        <Card className="shadow-[var(--shadow-md)]">
          <CardContent className="p-6">
            {step === 0 && (
              <div className="space-y-4">
                <div className="space-y-2"><label className="text-sm font-medium">Institution name</label><Input defaultValue="NED Demo University" /></div>
                <div className="space-y-2"><label className="text-sm font-medium">Institution type</label><Input defaultValue="University" /></div>
                <div className="space-y-2"><label className="text-sm font-medium">City</label><Input defaultValue="Karachi" /></div>
              </div>
            )}
            {step === 1 && (
              <div className="space-y-4">
                <div className="space-y-2"><label className="text-sm font-medium">Campus name</label><Input defaultValue="Main Campus" /></div>
                <div className="space-y-2"><label className="text-sm font-medium">Address</label><Input defaultValue="University Road, Karachi" /></div>
              </div>
            )}
            {step === 4 && (
              <div className="space-y-4">
                <div className="space-y-2"><label className="text-sm font-medium">Primary color</label><Input defaultValue="#152238" /></div>
                <div className="rounded-lg border border-[var(--border)] p-4"><p className="text-sm font-medium">Preview</p><div className="mt-2 h-10 rounded-lg bg-[var(--brand-primary)]" /></div>
              </div>
            )}
            {step === 5 && (
              <div className="rounded-xl border border-dashed border-[var(--border)] p-8 text-center">
                <p className="text-sm font-medium">Upload CSV or Excel file</p>
                <p className="mt-1 text-xs text-[var(--muted)]">Students, staff, and academic structure</p>
                <Button variant="outline" className="mt-4">Choose file</Button>
              </div>
            )}
            {step === 7 && (
              <div className="py-8 text-center">
                <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-full bg-[var(--success-muted)]"><Check className="size-7 text-[var(--success)]" /></div>
                <h2 className="text-xl font-semibold">Setup complete</h2>
                <p className="mt-2 text-sm text-[var(--muted)]">Your institution is ready. Start managing students, academics, and operations.</p>
                <Button asChild className="mt-6"><Link href="/dashboard">Go to dashboard <ArrowRight className="size-4" /></Link></Button>
              </div>
            )}
            {![0, 1, 4, 5, 7].includes(step) && (
              <p className="text-sm text-[var(--muted)]">Configure {STEPS[step].toLowerCase()} for your institution.</p>
            )}
          </CardContent>
        </Card>

        {step < 7 && (
          <div className="mt-6 flex justify-between">
            <Button variant="outline" disabled={step === 0} onClick={() => setStep(step - 1)}>Back</Button>
            <Button onClick={() => setStep(step + 1)}>Continue <ArrowRight className="size-4" /></Button>
          </div>
        )}
      </div>
    </div>
  );
}
