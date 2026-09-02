const API_BASE =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") || "http://127.0.0.1:8000/api/v1";

const TOKEN_KEY = "ems_token";
const INSTITUTION_HEADER_KEY = "ems_institution_id";
const SESSION_KEY = "ems_session";

export function getApiBase() {
  return API_BASE;
}

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string | null) {
  if (typeof window === "undefined") return;
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
}

export function getInstitutionHeader(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(INSTITUTION_HEADER_KEY);
}

export function setInstitutionHeader(id: string | null) {
  if (typeof window === "undefined") return;
  if (id) localStorage.setItem(INSTITUTION_HEADER_KEY, id);
  else localStorage.removeItem(INSTITUTION_HEADER_KEY);
}

export type StoredSession = {
  user: unknown;
  institution: unknown;
};

export function getStoredSession<T extends StoredSession>(): T | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

export function setStoredSession(session: StoredSession | null) {
  if (typeof window === "undefined") return;
  if (session) localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  else localStorage.removeItem(SESSION_KEY);
}

export function clearAuthStorage() {
  setToken(null);
  setInstitutionHeader(null);
  setStoredSession(null);
}

export class ApiError extends Error {
  status: number;
  details: unknown;

  constructor(message: string, status: number, details?: unknown) {
    super(message);
    this.status = status;
    this.details = details;
  }
}

type ApiOptions = Omit<RequestInit, "body"> & {
  body?: unknown;
  auth?: boolean;
};

export async function api<T>(path: string, options: ApiOptions = {}): Promise<T> {
  const { body, auth = true, headers, ...rest } = options;
  const finalHeaders = new Headers(headers);
  finalHeaders.set("Accept", "application/json");

  const isFormData = typeof FormData !== "undefined" && body instanceof FormData;
  if (body !== undefined && !isFormData) {
    finalHeaders.set("Content-Type", "application/json");
  }

  if (auth) {
    const token = getToken();
    if (token) finalHeaders.set("Authorization", `Bearer ${token}`);
    const institutionId = getInstitutionHeader();
    if (institutionId) finalHeaders.set("X-Institution-Id", institutionId);
  }

  const response = await fetch(`${API_BASE}${path.startsWith("/") ? path : `/${path}`}`, {
    ...rest,
    headers: finalHeaders,
    body: body === undefined ? undefined : isFormData ? (body as FormData) : JSON.stringify(body),
  });

  if (response.status === 204) {
    return undefined as T;
  }

  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    if (response.status === 401 && auth) {
      clearAuthStorage();
    }
    const message =
      payload?.message ||
      payload?.errors?.email?.[0] ||
      payload?.errors?.adminEmail?.[0] ||
      `Request failed (${response.status})`;
    throw new ApiError(message, response.status, payload);
  }

  return payload as T;
}

/** Production: nnd.app.zendrock.io — Local: shown as nnd.localhost (same app origin; tenant from session). */
export function workspaceUrl(slug: string) {
  const root = process.env.NEXT_PUBLIC_ROOT_DOMAIN || "localhost:3000";
  const protocol = root.includes("localhost") ? "http" : "https";
  return `${protocol}://${slug}.${root}`;
}
