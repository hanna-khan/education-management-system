"use client";

import { useEffect, useMemo, useState } from "react";
import {
  CheckCircle2,
  Download,
  FileSpreadsheet,
  Loader2,
  Upload,
  Users,
  GraduationCap,
} from "lucide-react";
import { ModuleHub } from "@/components/shared/module-hub";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SETTINGS_TABS } from "@/mock/portals";
import { ApiError } from "@/lib/api";
import { cn } from "@/lib/utils";
import { useApp } from "@/hooks/use-app";
import {
  downloadImportErrors,
  downloadTemplate,
  listImports,
  runImport,
  uploadImport,
  type DataImportJob,
  type ImportType,
} from "@/services/imports";

const breadcrumbs = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Settings", href: "/settings" },
  { label: "Import Data" },
];

const IMPORT_ROLES = [
  "platform_admin",
  "super_admin",
  "institution_admin",
  "principal",
  "vice_principal",
  "registrar",
  "dean",
  "hod",
];

export function SettingsImportPage() {
  const { user, roleLabel, clearSession } = useApp();
  const canImport = IMPORT_ROLES.includes(user.role);

  const [type, setType] = useState<ImportType>("students");
  const [history, setHistory] = useState<DataImportJob[]>([]);
  const [current, setCurrent] = useState<DataImportJob | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [running, setRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const step = useMemo(() => {
    if (!current) return 0;
    if (current.status === "completed") return 3;
    if (current.status === "validated" || current.status === "importing") return 2;
    return 1;
  }, [current]);

  const [downloading, setDownloading] = useState(false);

  async function refreshHistory() {
    if (!canImport) return;
    try {
      const rows = await listImports();
      setHistory(rows);
    } catch {
      /* ignore */
    }
  }

  useEffect(() => {
    (async () => {
      setLoading(true);
      await refreshHistory();
      setLoading(false);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canImport]);

  async function onFile(file: File | null) {
    if (!file) return;
    setUploading(true);
    setError(null);
    setMessage(null);
    try {
      const res = await uploadImport(type, file);
      setCurrent(res.import);
      setMessage(res.message);
      await refreshHistory();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Upload failed. Check the file and try again.");
    } finally {
      setUploading(false);
    }
  }

  async function onDownloadTemplate(format: "xlsx" | "csv") {
    setDownloading(true);
    setError(null);
    setMessage(null);
    try {
      await downloadTemplate(type, format);
      setMessage(`${format.toUpperCase()} template downloaded.`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not download template.");
    } finally {
      setDownloading(false);
    }
  }

  async function onRun() {
    if (!current) return;
    setRunning(true);
    setError(null);
    setMessage(null);
    try {
      const res = await runImport(current.id);
      setCurrent(res.import);
      setMessage(res.message);
      await refreshHistory();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Import failed.");
    } finally {
      setRunning(false);
    }
  }

  return (
    <ModuleHub
      title="Import Data"
      description="Bring students and teachers from your old system using Excel or CSV — no retyping."
      breadcrumbs={breadcrumbs}
      tabs={SETTINGS_TABS}
    >
      {!canImport ? (
        <div className="rounded-3xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-950">
          <p className="font-semibold">Wrong account for imports</p>
          <p className="mt-1 text-amber-900/80">
            You’re signed in as <strong>{roleLabel(user.role)}</strong>. Only the institution admin
            (or a principal) can download templates and import data. Sign out, then sign in with
            your admin email.
          </p>
          <Button
            className="mt-4 rounded-xl bg-gradient-to-r from-[#6B58F6] to-[#8C4AF2]"
            onClick={() => {
              clearSession();
              window.location.href = "/login";
            }}
          >
            Sign in as admin
          </Button>
        </div>
      ) : (
      <>
      <div className="mb-6 flex flex-wrap gap-2">
        {["Choose type", "Upload & validate", "Review", "Import"].map((label, i) => (
          <Badge key={label} variant={i === step ? "default" : i < step ? "success" : "outline"}>
            {i + 1}. {label}
          </Badge>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.3fr)_minmax(0,0.9fr)]">
        <div className="space-y-5">
          <div className="rounded-3xl border border-[#E8E4F4] bg-white p-5 shadow-sm sm:p-6">
            <h2 className="text-base font-semibold text-[#3D3558]">What are you importing?</h2>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              {[
                {
                  id: "students" as const,
                  title: "Students",
                  desc: "IDs, names, emails, guardians, campus, class info",
                  icon: GraduationCap,
                },
                {
                  id: "teachers" as const,
                  title: "Teachers / staff",
                  desc: "Employee IDs, names, emails, departments",
                  icon: Users,
                },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setType(item.id);
                    setCurrent(null);
                    setError(null);
                    setMessage(null);
                  }}
                  className={cn(
                    "rounded-2xl border p-4 text-left transition",
                    type === item.id
                      ? "border-[#6B58F6] bg-[#EFEAFF]"
                      : "border-[#E8E4F4] hover:border-[#6B58F6]/40",
                  )}
                >
                  <item.icon className="mb-2 size-5 text-[#6B58F6]" />
                  <p className="font-semibold text-[#3D3558]">{item.title}</p>
                  <p className="mt-1 text-xs text-[#8B86A3]">{item.desc}</p>
                </button>
              ))}
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <Button
                type="button"
                variant="outline"
                className="rounded-xl border-[#E8E4F4]"
                disabled={downloading}
                onClick={() => onDownloadTemplate("xlsx")}
              >
                {downloading ? <Loader2 className="size-4 animate-spin" /> : <Download className="size-4" />}
                Download Excel template
              </Button>
              <Button
                type="button"
                variant="outline"
                className="rounded-xl border-[#E8E4F4]"
                disabled={downloading}
                onClick={() => onDownloadTemplate("csv")}
              >
                {downloading ? <Loader2 className="size-4 animate-spin" /> : <Download className="size-4" />}
                CSV template
              </Button>
            </div>
            <p className="mt-2 text-xs text-[#8B86A3]">
              Export from your old system into this template (or match the column names). Then upload below.
            </p>
          </div>

          <div className="rounded-3xl border border-dashed border-[#C9C0EF] bg-[#F8F7FC] p-8 text-center">
            <FileSpreadsheet className="mx-auto size-8 text-[#6B58F6]" />
            <p className="mt-3 font-medium text-[#3D3558]">Upload your filled file</p>
            <p className="mt-1 text-sm text-[#8B86A3]">.xlsx or .csv · up to 20 MB</p>
            <label className="mt-4 inline-flex cursor-pointer">
              <span className="inline-flex h-11 items-center gap-2 rounded-xl bg-gradient-to-r from-[#6B58F6] to-[#8C4AF2] px-5 text-sm font-semibold text-white">
                {uploading ? <Loader2 className="size-4 animate-spin" /> : <Upload className="size-4" />}
                {uploading ? "Validating…" : "Choose file"}
              </span>
              <input
                type="file"
                accept=".csv,.xlsx,.xls,text/csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                className="hidden"
                disabled={uploading}
                onChange={(e) => onFile(e.target.files?.[0] ?? null)}
              />
            </label>
          </div>

          {error ? (
            <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
          ) : null}
          {message ? (
            <p className="rounded-xl bg-[#EFEAFF] px-3 py-2 text-sm text-[#3D3558]">{message}</p>
          ) : null}

          {current ? (
            <div className="rounded-3xl border border-[#E8E4F4] bg-white p-5 shadow-sm sm:p-6">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h3 className="font-semibold text-[#3D3558]">{current.originalFilename}</h3>
                  <p className="mt-1 text-sm text-[#8B86A3] capitalize">
                    {current.type} · {current.status.replace("_", " ")}
                  </p>
                </div>
                <Badge variant={current.status === "completed" ? "success" : "outline"}>
                  {current.status}
                </Badge>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                <Stat label="Total rows" value={current.totalRows} />
                <Stat label="Valid" value={current.validRows} />
                <Stat label="Errors" value={current.errorRows} />
                <Stat label="Imported" value={current.importedRows} />
              </div>

              {current.summary?.errorSamples && current.summary.errorSamples.length > 0 ? (
                <div className="mt-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-[#3D3558]">Validation issues</p>
                    {current.hasErrorReport ? (
                      <button
                        type="button"
                        className="text-xs font-semibold text-[#6B58F6]"
                        onClick={() => downloadImportErrors(current.id)}
                      >
                        Download error report
                      </button>
                    ) : null}
                  </div>
                  {current.summary.errorSamples.slice(0, 8).map((e, idx) => (
                    <div
                      key={`${e.row}-${e.field}-${idx}`}
                      className="rounded-xl border border-red-100 bg-red-50 px-3 py-2 text-sm text-red-800"
                    >
                      Row {e.row} · {e.field}: {e.message}
                    </div>
                  ))}
                </div>
              ) : null}

              {current.preview && current.preview.length > 0 ? (
                <div className="mt-4">
                  <p className="mb-2 text-sm font-medium text-[#3D3558]">Preview (valid rows)</p>
                  <div className="overflow-x-auto rounded-xl border border-[#E8E4F4]">
                    <table className="min-w-full text-left text-xs">
                      <thead className="bg-[#F8F7FC] text-[#8B86A3]">
                        <tr>
                          {Object.keys(current.preview[0])
                            .slice(0, 6)
                            .map((k) => (
                              <th key={k} className="px-3 py-2 font-medium">
                                {k}
                              </th>
                            ))}
                        </tr>
                      </thead>
                      <tbody>
                        {current.preview.map((row, i) => (
                          <tr key={i} className="border-t border-[#F0EDF7]">
                            {Object.keys(current.preview![0])
                              .slice(0, 6)
                              .map((k) => (
                                <td key={k} className="px-3 py-2 text-[#3D3558]">
                                  {row[k] || "—"}
                                </td>
                              ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : null}

              {current.status === "validated" ? (
                <div className="mt-5 flex flex-wrap gap-2">
                  <Button
                    className="rounded-xl bg-gradient-to-r from-[#6B58F6] to-[#8C4AF2]"
                    disabled={running || current.validRows < 1}
                    onClick={onRun}
                  >
                    {running ? <Loader2 className="size-4 animate-spin" /> : <CheckCircle2 className="size-4" />}
                    Import {current.validRows} valid row{current.validRows === 1 ? "" : "s"}
                  </Button>
                  <p className="self-center text-xs text-[#8B86A3]">
                    Existing matching IDs/emails are updated (safe to re-run).
                  </p>
                </div>
              ) : null}

              {current.status === "completed" ? (
                <div className="mt-5 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
                  Import complete · {current.importedRows} imported
                  {current.skippedRows ? ` · ${current.skippedRows} skipped` : ""}.
                </div>
              ) : null}
            </div>
          ) : null}
        </div>

        <div className="rounded-3xl border border-[#E8E4F4] bg-white p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-[#3D3558]">Recent imports</h3>
          {loading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="size-5 animate-spin text-[#6B58F6]" />
            </div>
          ) : history.length === 0 ? (
            <p className="py-10 text-center text-sm text-[#8B86A3]">No imports yet</p>
          ) : (
            <ul className="mt-3 max-h-[28rem] space-y-2 overflow-y-auto">
              {history.map((job) => (
                <li key={job.id}>
                  <button
                    type="button"
                    onClick={() => setCurrent(job)}
                    className={cn(
                      "w-full rounded-2xl border px-3 py-2.5 text-left",
                      current?.id === job.id
                        ? "border-[#6B58F6] bg-[#EFEAFF]"
                        : "border-[#E8E4F4] hover:border-[#6B58F6]/35",
                    )}
                  >
                    <p className="truncate text-sm font-medium text-[#3D3558]">{job.originalFilename}</p>
                    <p className="mt-0.5 text-xs text-[#8B86A3] capitalize">
                      {job.type} · {job.status} · {job.importedRows}/{job.totalRows}
                    </p>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      </>
      )}
    </ModuleHub>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl bg-[#F8F7FC] px-3 py-2.5">
      <p className="text-[11px] text-[#8B86A3]">{label}</p>
      <p className="text-lg font-semibold text-[#3D3558]">{value}</p>
    </div>
  );
}
