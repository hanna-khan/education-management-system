import type { InstitutionType } from "@/types";

export interface ModuleCatalogEntry {
  id: string;
  name: string;
  category: string;
  university: boolean;
  school: boolean;
  /** Default on when available for the institution type */
  defaultEnabled: boolean;
}

export const MODULE_CATALOG: ModuleCatalogEntry[] = [
  { id: "admissions", name: "Admissions", category: "Core", university: true, school: true, defaultEnabled: true },
  { id: "academics", name: "Academics", category: "Core", university: true, school: true, defaultEnabled: true },
  { id: "attendance", name: "Attendance", category: "Core", university: true, school: true, defaultEnabled: true },
  { id: "exams", name: "Exams & Results", category: "Core", university: true, school: true, defaultEnabled: true },
  { id: "fees", name: "Fees & Finance", category: "Core", university: true, school: true, defaultEnabled: true },
  { id: "library", name: "Library", category: "Campus", university: true, school: true, defaultEnabled: true },
  { id: "lms", name: "LMS / Learning", category: "Academic", university: true, school: true, defaultEnabled: true },
  { id: "assignments", name: "Assignments / Homework", category: "Academic", university: true, school: true, defaultEnabled: true },
  { id: "degree_planning", name: "Degree Planning", category: "Academic", university: true, school: false, defaultEnabled: true },
  { id: "advising", name: "Student Advising", category: "Academic", university: true, school: false, defaultEnabled: true },
  { id: "student_services", name: "One-Window Services", category: "Campus", university: true, school: true, defaultEnabled: true },
  { id: "certificates", name: "Documents & Certificates", category: "Campus", university: true, school: true, defaultEnabled: true },
  { id: "forms", name: "Digital Forms & Applications", category: "Campus", university: true, school: true, defaultEnabled: true },
  { id: "hostel", name: "Hostel", category: "Campus", university: true, school: false, defaultEnabled: true },
  { id: "transport", name: "Transport", category: "Campus", university: true, school: true, defaultEnabled: true },
  { id: "health", name: "Health / Clinic", category: "Campus", university: true, school: true, defaultEnabled: true },
  { id: "discipline", name: "Discipline", category: "Campus", university: true, school: true, defaultEnabled: true },
  { id: "career", name: "Career & Internship", category: "Engagement", university: true, school: false, defaultEnabled: true },
  { id: "alumni", name: "Alumni", category: "Engagement", university: true, school: false, defaultEnabled: true },
  { id: "clubs", name: "Clubs / Societies", category: "Engagement", university: true, school: true, defaultEnabled: true },
  { id: "facilities", name: "Facility Management", category: "Operations", university: true, school: true, defaultEnabled: true },
  { id: "maintenance", name: "Maintenance", category: "Operations", university: true, school: true, defaultEnabled: true },
  { id: "it_helpdesk", name: "IT Helpdesk", category: "Operations", university: true, school: true, defaultEnabled: true },
  { id: "surveys", name: "Survey Builder", category: "Engagement", university: true, school: true, defaultEnabled: true },
  { id: "quality", name: "Quality Assurance", category: "Enterprise", university: true, school: false, defaultEnabled: true },
  { id: "accreditation", name: "Accreditation", category: "Enterprise", university: true, school: false, defaultEnabled: true },
  { id: "inventory", name: "Inventory", category: "Enterprise", university: true, school: true, defaultEnabled: true },
  { id: "assets", name: "Asset Management", category: "Enterprise", university: true, school: true, defaultEnabled: true },
  { id: "procurement", name: "Procurement", category: "Enterprise", university: true, school: true, defaultEnabled: true },
  { id: "emergency", name: "Emergency & Safety", category: "Enterprise", university: true, school: true, defaultEnabled: true },
  { id: "visitors", name: "Visitor Management", category: "Enterprise", university: true, school: true, defaultEnabled: true },
  { id: "ai", name: "Zendrock AI", category: "Enterprise", university: true, school: true, defaultEnabled: true },
];

/** Per-tenant overrides on top of type defaults (demo realism). */
const INSTITUTION_MODULE_OVERRIDES: Record<string, Partial<Record<string, boolean>>> = {
  "inst-ned-demo": {},
  "inst-kec": {
    alumni: false,
    hostel: false,
  },
  "inst-crescent": {
    library: true,
    transport: true,
    maintenance: false,
    inventory: false,
    assets: false,
    procurement: false,
    facilities: false,
    it_helpdesk: true,
  },
};

/** Nav item id → module catalog id (items without a mapping always show). */
export const NAV_MODULE_MAP: Record<string, string> = {
  admissions: "admissions",
  "academics-hub": "academics",
  departments: "academics",
  programs: "academics",
  courses: "academics",
  sections: "academics",
  timetable: "academics",
  exams: "exams",
  "degree-planning": "degree_planning",
  "student-degree": "degree_planning",
  advising: "advising",
  "student-advising": "advising",
  "teacher-advising": "advising",
  assignments: "assignments",
  "teacher-assignments": "assignments",
  "student-assignments": "assignments",
  "parent-assignments": "assignments",
  lms: "lms",
  "teacher-lms": "lms",
  "student-lms": "lms",
  library: "library",
  "student-library": "library",
  services: "student_services",
  "student-services": "student_services",
  certificates: "certificates",
  "student-certificates": "certificates",
  forms: "forms",
  "student-forms": "forms",
  hostel: "hostel",
  "student-hostel": "hostel",
  transport: "transport",
  "student-transport": "transport",
  "parent-transport": "transport",
  health: "health",
  "student-health": "health",
  "parent-health": "health",
  discipline: "discipline",
  "teacher-discipline": "discipline",
  "parent-discipline": "discipline",
  career: "career",
  "student-career": "career",
  alumni: "alumni",
  "student-alumni": "alumni",
  clubs: "clubs",
  "student-clubs": "clubs",
  facilities: "facilities",
  "student-facilities": "facilities",
  maintenance: "maintenance",
  "student-maintenance": "maintenance",
  "teacher-maintenance": "maintenance",
  "it-helpdesk": "it_helpdesk",
  "student-it-helpdesk": "it_helpdesk",
  "teacher-it-helpdesk": "it_helpdesk",
  surveys: "surveys",
  "student-surveys": "surveys",
  "teacher-surveys": "surveys",
  "parent-surveys": "surveys",
  quality: "quality",
  accreditation: "accreditation",
  inventory: "inventory",
  assets: "assets",
  procurement: "procurement",
  emergency: "emergency",
  visitors: "visitors",
  "parent-visitors": "visitors",
  ai: "ai",
  "teacher-ai": "ai",
  "student-ai": "ai",
  "parent-ai": "ai",
  attendance: "attendance",
  "teacher-attendance": "attendance",
  "student-attendance": "attendance",
  "parent-attendance": "attendance",
  fees: "fees",
  scholarships: "fees",
  "student-fees": "fees",
  "parent-fees": "fees",
};

export function isModuleAvailableForType(moduleId: string, type: InstitutionType): boolean {
  const entry = MODULE_CATALOG.find((m) => m.id === moduleId);
  if (!entry) return true;
  return type === "university" ? entry.university : entry.school;
}

export function getDefaultEnabledModules(
  institutionId: string,
  type: InstitutionType,
): Record<string, boolean> {
  const overrides = INSTITUTION_MODULE_OVERRIDES[institutionId] ?? {};
  const result: Record<string, boolean> = {};

  for (const mod of MODULE_CATALOG) {
    const available = type === "university" ? mod.university : mod.school;
    if (!available) {
      result[mod.id] = false;
      continue;
    }
    result[mod.id] = overrides[mod.id] ?? mod.defaultEnabled;
  }

  return result;
}

export function isNavItemEnabled(
  navItemId: string,
  enabledModules: Record<string, boolean>,
): boolean {
  const moduleId = NAV_MODULE_MAP[navItemId];
  if (!moduleId) return true;
  return enabledModules[moduleId] !== false;
}
