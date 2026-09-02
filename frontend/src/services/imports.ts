import { api, getApiBase, getInstitutionHeader, getToken } from "@/lib/api";

export type ImportType = "students" | "teachers";

export interface DataImportJob {
  id: string;
  type: ImportType;
  originalFilename: string;
  status: string;
  totalRows: number;
  validRows: number;
  errorRows: number;
  importedRows: number;
  skippedRows: number;
  processedRows: number;
  columnMap?: Record<string, string | null>;
  preview?: Array<Record<string, string>>;
  summary?: {
    headers?: string[];
    errorSamples?: Array<{ row: number; field: string; message: string }>;
    errorCount?: number;
    imported?: number;
    skipped?: number;
  };
  hasErrorReport?: boolean;
  validatedAt?: string;
  completedAt?: string;
  createdAt?: string;
}

export async function listImports() {
  const res = await api<{ data: DataImportJob[] }>("/imports");
  return res.data;
}

export async function uploadImport(type: ImportType, file: File) {
  const form = new FormData();
  form.append("type", type);
  form.append("file", file);
  return api<{ import: DataImportJob; message: string }>("/imports", {
    method: "POST",
    body: form,
  });
}

export async function getImport(id: string) {
  const res = await api<{ import: DataImportJob }>(`/imports/${id}`);
  return res.import;
}

export async function remapImport(id: string, columnMap: Record<string, string | null>) {
  return api<{ import: DataImportJob; message: string }>(`/imports/${id}/mapping`, {
    method: "PUT",
    body: { columnMap },
  });
}

export async function runImport(id: string) {
  return api<{ import: DataImportJob; message: string }>(`/imports/${id}/run`, {
    method: "POST",
  });
}

async function downloadBlob(path: string, filename: string) {
  const token = getToken();
  const institutionId = getInstitutionHeader();
  const res = await fetch(`${getApiBase()}${path.startsWith("/") ? path : `/${path}`}`, {
    headers: {
      Accept: "application/json, */*",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(institutionId ? { "X-Institution-Id": institutionId } : {}),
    },
  });

  if (!res.ok) {
    let message = "Download failed.";
    try {
      const payload = await res.json();
      message = payload?.message || message;
    } catch {
      /* binary error body */
    }
    throw new Error(message);
  }

  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.rel = "noopener";
  document.body.appendChild(a);
  a.click();
  a.remove();
  // Delay revoke so the browser can start the download
  window.setTimeout(() => URL.revokeObjectURL(url), 1500);
}

export async function downloadTemplate(type: ImportType, format: "xlsx" | "csv" = "xlsx") {
  await downloadBlob(
    `/imports/templates/${type}?format=${format}`,
    `zendrock-${type}-template.${format}`,
  );
}

export async function downloadImportErrors(id: string) {
  await downloadBlob(`/imports/${id}/errors`, `import-errors-${id}.csv`);
}
