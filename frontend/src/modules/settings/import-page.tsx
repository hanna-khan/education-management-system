"use client";

import { useState } from "react";
import { ModuleHub } from "@/components/shared/module-hub";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SETTINGS_TABS } from "@/mock/portals";

const breadcrumbs = [{ label: "Dashboard", href: "/dashboard" }, { label: "Settings", href: "/settings" }, { label: "Import Data" }];

const validationErrors = [
  { row: 17, field: "department", message: "Invalid department" },
  { row: 24, field: "student_id", message: "Duplicate student ID" },
  { row: 31, field: "email", message: "Invalid email format" },
];

export function SettingsImportPage() {
  const [step, setStep] = useState(0);
  const steps = ["Upload", "Map columns", "Validate", "Preview", "Import", "Complete"];

  return (
    <ModuleHub title="Import Data" description="Import students, staff, and academic data from CSV or Excel." breadcrumbs={breadcrumbs} tabs={SETTINGS_TABS}>
      <div className="mb-6 flex flex-wrap gap-2">
        {steps.map((s, i) => (
          <Badge key={s} variant={i === step ? "default" : i < step ? "success" : "outline"}>{i + 1}. {s}</Badge>
        ))}
      </div>

      {step === 0 && (
        <div className="rounded-xl border border-dashed border-[var(--border)] bg-[var(--surface-muted)] p-12 text-center">
          <p className="font-medium">Drop your file here or click to upload</p>
          <p className="mt-1 text-sm text-[var(--muted)]">Supports .csv, .xlsx — max 10MB</p>
          <Button className="mt-4" onClick={() => setStep(1)}>Choose file</Button>
        </div>
      )}

      {step === 1 && (
        <div className="space-y-3">
          <p className="text-sm text-[var(--muted)]">Map spreadsheet columns to system fields.</p>
          {["Student ID → student_id", "Full Name → full_name", "Program → program", "Department → department"].map((m) => (
            <div key={m} className="flex items-center justify-between rounded-lg border border-[var(--border)] p-3 text-sm">{m}<Badge variant="success">Mapped</Badge></div>
          ))}
          <Button onClick={() => setStep(2)}>Continue to validate</Button>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4">
          <p className="text-sm text-[var(--muted)]">3 validation errors found in 842 rows.</p>
          {validationErrors.map((e) => (
            <div key={e.row} className="rounded-lg border border-[var(--error)]/20 bg-[var(--error-muted)] p-3 text-sm">
              <span className="font-medium">Row {e.row}</span> — {e.message}
            </div>
          ))}
          <Button onClick={() => setStep(3)}>Preview import</Button>
        </div>
      )}

      {step >= 3 && step < 5 && (
        <div className="space-y-4">
          <p className="text-sm">Preview: 839 rows ready to import, 3 rows skipped.</p>
          <Button onClick={() => setStep(5)}>Start import</Button>
        </div>
      )}

      {step === 5 && (
        <div className="rounded-xl border border-[var(--success)]/20 bg-[var(--success-muted)] p-8 text-center">
          <p className="text-lg font-semibold text-[var(--success)]">Import complete</p>
          <p className="mt-2 text-sm text-[var(--muted)]">839 students imported successfully.</p>
        </div>
      )}
    </ModuleHub>
  );
}
