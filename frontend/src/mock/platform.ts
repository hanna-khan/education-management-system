export const platformStats = {
  totalInstitutions: 48,
  activeInstitutions: 36,
  trialInstitutions: 8,
  expiredTrials: 4,
  mrr: 2400000,
  activeStudents: 186420,
  activeUsers: 28400,
  systemHealth: 99.8,
};

export const mockTenants = [
  { id: "inst-ned-demo", name: "NED Demo University", type: "university", plan: "Professional", status: "trial", students: 8426, users: 412, mrr: 0 },
  { id: "inst-kec", name: "Karachi Education College", type: "university", plan: "Enterprise", status: "active", students: 4210, users: 198, mrr: 85000 },
  { id: "inst-crescent", name: "Crescent Demo School", type: "school", plan: "Professional", status: "active", students: 1840, users: 112, mrr: 42000 },
  { id: "inst-lahore", name: "Lahore Tech Institute", type: "university", plan: "Starter", status: "active", students: 2100, users: 86, mrr: 28000 },
  { id: "inst-islamabad", name: "Capital Demo School", type: "school", plan: "Professional", status: "trial", students: 980, users: 54, mrr: 0 },
];

export const mockPlans = [
  { id: "starter", name: "Starter", price: "Contact Sales", students: "Up to 1,000", modules: "Core modules" },
  { id: "professional", name: "Professional", price: "Contact Sales", students: "Up to 10,000", modules: "All modules" },
  { id: "enterprise", name: "Enterprise", price: "Contact Sales", students: "Unlimited", modules: "All + custom" },
];

export const PLATFORM_TABS = [
  { id: "dashboard", label: "Dashboard", href: "/platform/dashboard" },
  { id: "tenants", label: "Institutions", href: "/platform/tenants" },
  { id: "subscriptions", label: "Subscriptions", href: "/platform/subscriptions" },
  { id: "plans", label: "Plans", href: "/platform/plans" },
  { id: "usage", label: "Usage", href: "/platform/usage" },
  { id: "users", label: "Users", href: "/platform/users" },
  { id: "health", label: "System Health", href: "/platform/system-health" },
  { id: "audit", label: "Audit Logs", href: "/platform/audit-logs" },
  { id: "settings", label: "Settings", href: "/platform/settings" },
];

export const mockAuditLogs = [
  { id: "log-001", action: "Institution created", user: "Usman Ali", tenant: "Capital Demo School", time: "2026-08-22 09:15" },
  { id: "log-002", action: "Plan upgraded to Enterprise", user: "Usman Ali", tenant: "Karachi Education College", time: "2026-08-21 16:42" },
  { id: "log-003", action: "Module disabled: HR", user: "Usman Ali", tenant: "Crescent Demo School", time: "2026-08-21 11:30" },
];
