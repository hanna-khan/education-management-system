import { api, setInstitutionHeader, setStoredSession, setToken, clearAuthStorage } from "@/lib/api";
import type { Institution, User } from "@/types";

export interface LoginResponse {
  token: string;
  tokenType: string;
  user: User;
  institution: Institution | null;
}

export async function login(email: string, password: string, institutionId?: string) {
  const result = await api<LoginResponse>("/auth/login", {
    method: "POST",
    auth: false,
    body: {
      email,
      password,
      institution_id: institutionId,
      device_name: "ems-web",
    },
  });

  setToken(result.token);
  if (result.institution?.id) {
    setInstitutionHeader(result.institution.id);
  } else if (result.user.institutionId) {
    setInstitutionHeader(result.user.institutionId);
  }
  setStoredSession({ user: result.user, institution: result.institution });

  return result;
}

export async function logout() {
  try {
    await api("/auth/logout", { method: "POST" });
  } finally {
    clearAuthStorage();
  }
}

export async function me() {
  return api<{ user: User; institution: Institution | null }>("/auth/me");
}
