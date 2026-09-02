import { api, setInstitutionHeader, setStoredSession, setToken } from "@/lib/api";
import type { Institution, User } from "@/types";

export interface Plan {
  id: string;
  name: string;
  code: string;
  audience: string;
  description?: string;
  priceMonthly: number;
  priceYearly: number;
  currency: string;
  maxStudents?: number;
  maxStaff?: number;
  maxCampuses?: number;
  trialDays: number;
  features: string[];
}

export async function getPlans(type?: string) {
  const qs = type ? `?type=${type}` : "";
  const res = await api<{ data: Plan[] }>(`/plans${qs}`, { auth: false });
  return res.data;
}

export async function registerInstitution(payload: Record<string, unknown> & { logo?: File | null }) {
  const { logo, ...fields } = payload;
  const form = new FormData();
  Object.entries(fields).forEach(([key, value]) => {
    if (value === undefined || value === null) return;
    form.append(key, String(value));
  });
  if (logo instanceof File) {
    form.append("logo", logo);
  }

  const result = await api<{
    token: string;
    user: User;
    institution: Institution;
    nextStep: string;
    message: string;
  }>("/register", { method: "POST", auth: false, body: form });

  setToken(result.token);
  if (result.institution?.id) setInstitutionHeader(result.institution.id);
  setStoredSession({ user: result.user, institution: result.institution });
  return result;
}

export async function getCampuses() {
  const res = await api<{ data: unknown[] }>("/campuses");
  return res.data;
}

export async function createCampus(payload: Record<string, unknown>) {
  return api("/campuses", { method: "POST", body: payload });
}

export async function getSubscription() {
  return api("/subscription");
}

export async function changePlan(planId: string, billingCycle: "monthly" | "yearly" = "monthly") {
  return api("/subscription/change-plan", {
    method: "POST",
    body: { planId, billingCycle },
  });
}

export async function updateInstitution(payload: Record<string, unknown>) {
  return api("/institution", { method: "PUT", body: payload });
}

export async function getOnboarding() {
  return api<{
    step: number;
    completed: boolean;
    institution: Institution;
  }>("/onboarding");
}

export async function advanceOnboarding(step: number, complete = false) {
  return api("/onboarding/advance", {
    method: "POST",
    body: { step, complete },
  });
}
