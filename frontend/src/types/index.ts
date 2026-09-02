export type InstitutionType = "university" | "school";
export type InstitutionStatus = "active" | "trial" | "suspended" | "expired";

export type UserRole =
  | "platform_admin"
  | "super_admin"
  | "institution_admin"
  | "principal"
  | "vice_principal"
  | "dean"
  | "hod"
  | "teacher"
  | "student"
  | "parent"
  | "accountant"
  | "hr"
  | "exam_officer"
  | "admission_officer"
  | "librarian"
  | "campus_admin"
  | "registrar"
  | "counselor"
  | "career_officer"
  | "alumni_officer"
  | "security"
  | "qec_officer"
  | "transport_manager"
  | "hostel_manager"
  | "it_support"
  | "facility_manager";

export interface Institution {
  id: string;
  name: string;
  shortName: string;
  type: InstitutionType;
  status: InstitutionStatus;
  logoInitials: string;
  logoUrl?: string | null;
  primaryColor: string;
  secondaryColor: string;
  city: string;
  studentCount: number;
  staffCount: number;
  slug?: string;
  /** Optional demo blurb shown in the institution switcher */
  demoNote?: string;
  /** Enabled module map from API */
  modules?: Record<string, boolean>;
  onboardingCompleted?: boolean;
  onboardingStep?: number;
  contactEmail?: string;
  contactPhone?: string;
  subscription?: {
    id: string;
    status: string;
    billingCycle?: string;
    trialEndsAt?: string;
    endsAt?: string;
    plan?: {
      id: string;
      name: string;
      code: string;
      maxCampuses?: number;
      maxStudents?: number;
      maxStaff?: number;
      modules?: Record<string, boolean>;
    };
  };
  access?: {
    locked?: boolean;
    reason?: string | null;
    trialDaysLeft?: number | null;
    status?: string | null;
    trialEndsAt?: string;
    endsAt?: string;
    plan?: {
      id: string;
      name: string;
      code: string;
      modules?: Record<string, boolean>;
    } | null;
  };
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  institutionId: string;
  department?: string;
  title?: string;
}

export interface NavItem {
  id: string;
  label: string;
  href: string;
  icon: string;
  badge?: number;
  roles?: UserRole[];
  institutionTypes?: InstitutionType[];
  /** When set, item is hidden if this module is disabled for the tenant */
  moduleId?: string;
  children?: NavItem[];
}

export interface NavGroup {
  id: string;
  label: string;
  items: NavItem[];
}

export interface KpiMetric {
  id: string;
  label: string;
  value: string | number;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  icon?: string;
  description?: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  category: "attendance" | "application" | "fees" | "exams" | "notices" | "system" | "complaint" | "visit" | "feedback";
  read: boolean;
  createdAt: string;
  href?: string;
}

export interface SearchResult {
  id: string;
  type: "student" | "teacher" | "course" | "application" | "notice" | "document" | "complaint";
  title: string;
  subtitle: string;
  meta?: string;
  href: string;
}
