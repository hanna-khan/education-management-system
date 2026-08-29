import { isNavItemEnabled } from "@/config/modules";
import { NAV_TERM_KEYS, resolveTerm } from "@/config/terminology";
import type { InstitutionType, NavGroup, NavItem, UserRole } from "@/types";

const adminRoles: UserRole[] = [
  "super_admin",
  "institution_admin",
  "principal",
  "dean",
  "hod",
  "registrar",
];

const elevatedRoles: UserRole[] = ["super_admin", "institution_admin", "platform_admin"];

export const INSTITUTION_NAV: NavGroup[] = [
  {
    id: "overview",
    label: "Overview",
    items: [
      { id: "dashboard", label: "Dashboard", href: "/dashboard", icon: "LayoutDashboard" },
    ],
  },
  {
    id: "academics",
    label: "Academics",
    items: [
      { id: "students", label: "Students", href: "/students", icon: "GraduationCap", roles: adminRoles },
      { id: "teachers", label: "Teachers", href: "/teachers", icon: "Users", roles: adminRoles },
      { id: "admissions", label: "Admissions", href: "/admissions", icon: "UserPlus", roles: adminRoles },
      {
        id: "academics-hub",
        label: "Academics",
        href: "/academics",
        icon: "BookOpen",
        roles: adminRoles,
        children: [
          { id: "departments", label: "Departments", href: "/academics/departments", icon: "Building2" },
          { id: "programs", label: "Programs", href: "/academics/programs", icon: "Layers" },
          { id: "courses", label: "Courses", href: "/academics/courses", icon: "BookMarked" },
          { id: "sections", label: "Sections", href: "/academics/sections", icon: "Users" },
          { id: "timetable", label: "Timetable", href: "/academics/timetable", icon: "CalendarDays" },
        ],
      },
      { id: "exams", label: "Exams & Results", href: "/exams", icon: "FileText", roles: adminRoles },
      {
        id: "degree-planning",
        label: "Degree Planning",
        href: "/degree-planning",
        icon: "Route",
        roles: adminRoles,
        institutionTypes: ["university"],
      },
      {
        id: "advising",
        label: "Advising",
        href: "/advising",
        icon: "MessageSquareHeart",
        roles: [...adminRoles, "counselor", "teacher"],
        institutionTypes: ["university"],
      },
      { id: "assignments", label: "Assignments", href: "/assignments", icon: "ClipboardList", roles: [...adminRoles, "teacher"] },
      { id: "lms", label: "LMS", href: "/lms", icon: "Brain", roles: [...adminRoles, "teacher"] },
    ],
  },
  {
    id: "campus",
    label: "Campus Life",
    items: [
      {
        id: "library",
        label: "Library",
        href: "/library",
        icon: "Library",
        roles: [...adminRoles, "librarian"],
      },
      { id: "services", label: "Student Services", href: "/services", icon: "Inbox", roles: adminRoles },
      {
        id: "forms",
        label: "Digital Forms",
        href: "/forms",
        icon: "ClipboardPen",
        roles: [...adminRoles, "exam_officer"],
        moduleId: "forms",
      },
      { id: "certificates", label: "Certificates", href: "/certificates", icon: "ShieldCheck", roles: adminRoles },
      {
        id: "hostel",
        label: "Hostel",
        href: "/hostel",
        icon: "Bed",
        roles: [...adminRoles, "hostel_manager"],
        institutionTypes: ["university"],
      },
      {
        id: "transport",
        label: "Transport",
        href: "/transport",
        icon: "Bus",
        roles: [...adminRoles, "transport_manager"],
      },
      {
        id: "health",
        label: "Health / Clinic",
        href: "/health",
        icon: "Stethoscope",
        roles: adminRoles,
      },
      {
        id: "discipline",
        label: "Discipline",
        href: "/discipline",
        icon: "ShieldAlert",
        roles: [...adminRoles, "teacher"],
      },
      {
        id: "career",
        label: "Career & Internship",
        href: "/career",
        icon: "BriefcaseBusiness",
        roles: [...adminRoles, "career_officer"],
        institutionTypes: ["university"],
      },
      {
        id: "alumni",
        label: "Alumni",
        href: "/alumni",
        icon: "UsersRound",
        roles: [...adminRoles, "alumni_officer"],
        institutionTypes: ["university"],
      },
    ],
  },
  {
    id: "facilities-ops",
    label: "Facilities & Ops",
    items: [
      {
        id: "clubs",
        label: "Clubs & Societies",
        href: "/clubs",
        icon: "Trophy",
        roles: [...adminRoles, "teacher"],
      },
      {
        id: "facilities",
        label: "Facilities",
        href: "/facilities",
        icon: "Building",
        roles: [...adminRoles, "facility_manager"],
      },
      {
        id: "maintenance",
        label: "Maintenance",
        href: "/maintenance",
        icon: "Wrench",
        roles: [...adminRoles, "facility_manager"],
      },
      {
        id: "it-helpdesk",
        label: "IT Helpdesk",
        href: "/it-helpdesk",
        icon: "Monitor",
        roles: [...adminRoles, "it_support"],
      },
      {
        id: "surveys",
        label: "Surveys",
        href: "/surveys",
        icon: "ClipboardPen",
        roles: [...adminRoles, "qec_officer"],
      },
    ],
  },
  {
    id: "enterprise",
    label: "Enterprise",
    items: [
      {
        id: "quality",
        label: "Quality Assurance",
        href: "/quality",
        icon: "Target",
        roles: [...adminRoles, "qec_officer"],
        institutionTypes: ["university"],
      },
      {
        id: "accreditation",
        label: "Accreditation",
        href: "/accreditation",
        icon: "Award",
        roles: [...adminRoles, "qec_officer"],
        institutionTypes: ["university"],
      },
      {
        id: "inventory",
        label: "Inventory",
        href: "/inventory",
        icon: "Package2",
        roles: [...adminRoles, "facility_manager"],
      },
      {
        id: "assets",
        label: "Assets",
        href: "/assets",
        icon: "Boxes",
        roles: [...adminRoles, "facility_manager"],
      },
      {
        id: "procurement",
        label: "Procurement",
        href: "/procurement",
        icon: "ShoppingCart",
        roles: [...adminRoles, "accountant"],
      },
      {
        id: "emergency",
        label: "Emergency & Safety",
        href: "/emergency",
        icon: "Siren",
        roles: [...adminRoles, "security"],
      },
      {
        id: "visitors",
        label: "Visitors",
        href: "/visitors",
        icon: "UserCheck",
        roles: [...adminRoles, "security"],
      },
      {
        id: "ai",
        label: "Zendrock AI",
        href: "/ai",
        icon: "Sparkles",
      },
      {
        id: "audit-logs",
        label: "Audit Logs",
        href: "/admin/audit-logs",
        icon: "ScrollText",
        roles: adminRoles,
      },
    ],
  },
  {
    id: "operations",
    label: "Operations",
    items: [
      { id: "attendance", label: "Attendance", href: "/attendance", icon: "ClipboardCheck", roles: adminRoles },
      { id: "applications", label: "Applications", href: "/applications", icon: "Inbox", badge: 42, roles: adminRoles },
      { id: "workflows", label: "Workflows", href: "/workflows", icon: "GitBranch", roles: adminRoles },
      { id: "fees", label: "Fees & Finance", href: "/fees", icon: "Wallet", roles: [...adminRoles, "accountant"] },
      { id: "scholarships", label: "Scholarships", href: "/fees/scholarships", icon: "Award", roles: adminRoles },
    ],
  },
  {
    id: "people",
    label: "People",
    items: [
      { id: "hr", label: "HR", href: "/hr", icon: "Briefcase", roles: [...adminRoles, "hr"] },
    ],
  },
  {
    id: "communication",
    label: "Communication",
    items: [
      { id: "notices", label: "Notices", href: "/communication/notices", icon: "Megaphone", roles: adminRoles },
      { id: "events", label: "Events", href: "/events", icon: "CalendarDays", roles: adminRoles },
      { id: "complaints", label: "Complaints", href: "/complaints", icon: "MessageSquareWarning", roles: adminRoles },
    ],
  },
  {
    id: "insights",
    label: "Insights",
    items: [
      { id: "reports", label: "Reports", href: "/reports", icon: "BarChart3", roles: adminRoles },
      { id: "calendar", label: "Calendar", href: "/calendar", icon: "CalendarDays", roles: adminRoles },
      { id: "documents", label: "Documents", href: "/documents", icon: "FolderOpen", roles: adminRoles },
    ],
  },
  {
    id: "system",
    label: "System",
    items: [
      { id: "settings", label: "Settings", href: "/settings", icon: "Settings", roles: adminRoles },
      {
        id: "system-audit",
        label: "System Audit",
        href: "/admin/system-audit",
        icon: "ScrollText",
        roles: adminRoles,
      },
    ],
  },
];

export const PLATFORM_NAV: NavGroup[] = [
  {
    id: "platform",
    label: "Platform",
    items: [
      { id: "platform-dashboard", label: "Dashboard", href: "/platform/dashboard", icon: "LayoutDashboard" },
      { id: "tenants", label: "Institutions", href: "/platform/tenants", icon: "Building" },
      { id: "subscriptions", label: "Subscriptions", href: "/platform/subscriptions", icon: "CreditCard" },
      { id: "plans", label: "Plans", href: "/platform/plans", icon: "Package" },
      { id: "usage", label: "Usage", href: "/platform/usage", icon: "Activity" },
      { id: "platform-users", label: "Users", href: "/platform/users", icon: "Users" },
      { id: "system-health", label: "System Health", href: "/platform/system-health", icon: "HeartPulse" },
      { id: "audit-logs", label: "Audit Logs", href: "/platform/audit-logs", icon: "ScrollText" },
      { id: "platform-settings", label: "Settings", href: "/platform/settings", icon: "Settings" },
    ],
  },
];

export const TEACHER_NAV: NavGroup[] = [
  {
    id: "teacher",
    label: "Teaching",
    items: [
      { id: "teacher-dashboard", label: "Dashboard", href: "/teacher/dashboard", icon: "LayoutDashboard" },
      { id: "teacher-classes", label: "My Classes", href: "/teacher/classes", icon: "Presentation" },
      { id: "teacher-lms", label: "LMS", href: "/teacher/lms", icon: "Brain" },
      { id: "teacher-assignments", label: "Assignments", href: "/teacher/assignments", icon: "ClipboardList" },
      { id: "teacher-advising", label: "Advising", href: "/teacher/advising", icon: "MessageSquareHeart" },
      { id: "teacher-attendance", label: "Attendance", href: "/teacher/attendance", icon: "ClipboardCheck" },
      { id: "teacher-marks", label: "Marks", href: "/teacher/marks", icon: "PenLine" },
      { id: "teacher-timetable", label: "Timetable", href: "/teacher/timetable", icon: "CalendarDays" },
      { id: "teacher-leave", label: "Leave", href: "/teacher/leave", icon: "CalendarOff" },
      { id: "teacher-applications", label: "Applications", href: "/teacher/applications", icon: "Inbox" },
      { id: "teacher-feedback", label: "Feedback", href: "/teacher/feedback", icon: "MessageSquareHeart" },
      { id: "teacher-parent-requests", label: "Parent requests", href: "/teacher/parent-requests", icon: "Users" },
      { id: "teacher-discipline", label: "Discipline", href: "/teacher/discipline", icon: "ShieldAlert" },
      { id: "teacher-maintenance", label: "Maintenance", href: "/teacher/maintenance", icon: "Wrench" },
      { id: "teacher-it-helpdesk", label: "IT Helpdesk", href: "/teacher/it-helpdesk", icon: "Monitor" },
      { id: "teacher-surveys", label: "Surveys", href: "/surveys/list", icon: "ClipboardPen" },
      { id: "teacher-ai", label: "Zendrock AI", href: "/ai", icon: "Sparkles" },
    ],
  },
];

export const STUDENT_NAV: NavGroup[] = [
  {
    id: "student",
    label: "Student Portal",
    items: [
      { id: "student-dashboard", label: "Dashboard", href: "/student/dashboard", icon: "LayoutDashboard" },
      { id: "student-profile", label: "Profile", href: "/student/profile", icon: "User" },
      { id: "student-attendance", label: "Attendance", href: "/student/attendance", icon: "ClipboardCheck" },
      { id: "student-courses", label: "Courses", href: "/student/courses", icon: "BookOpen" },
      { id: "student-lms", label: "LMS", href: "/student/lms", icon: "Brain" },
      { id: "student-assignments", label: "Assignments", href: "/student/assignments", icon: "ClipboardList" },
      { id: "student-degree", label: "Degree Planning", href: "/student/degree-planning", icon: "Route" },
      { id: "student-advising", label: "Advising", href: "/student/advising", icon: "MessageSquareHeart" },
      { id: "student-library", label: "Library", href: "/student/library", icon: "Library" },
      { id: "student-services", label: "Services", href: "/student/services", icon: "Inbox" },
      { id: "student-forms", label: "Forms & Applications", href: "/student/forms", icon: "ClipboardPen" },
      { id: "student-certificates", label: "Certificates", href: "/student/certificates", icon: "ShieldCheck" },
      { id: "student-hostel", label: "Hostel", href: "/student/hostel", icon: "Bed", institutionTypes: ["university"] },
      { id: "student-transport", label: "Transport", href: "/student/transport", icon: "Bus" },
      { id: "student-health", label: "Health", href: "/student/health", icon: "Stethoscope" },
      { id: "student-career", label: "Career", href: "/student/career", icon: "BriefcaseBusiness", institutionTypes: ["university"] },
      { id: "student-alumni", label: "Alumni Mentorship", href: "/student/alumni", icon: "UsersRound", institutionTypes: ["university"] },
      { id: "student-clubs", label: "Clubs & Societies", href: "/student/clubs", icon: "Trophy" },
      { id: "student-facilities", label: "Book a Room", href: "/student/facilities", icon: "DoorOpen" },
      { id: "student-maintenance", label: "Maintenance", href: "/student/maintenance", icon: "Wrench" },
      { id: "student-it-helpdesk", label: "IT Helpdesk", href: "/student/it-helpdesk", icon: "Monitor" },
      { id: "student-surveys", label: "Surveys", href: "/student/surveys", icon: "ClipboardPen" },
      { id: "student-timetable", label: "Timetable", href: "/student/timetable", icon: "CalendarDays" },
      { id: "student-exams", label: "Exams", href: "/student/exams", icon: "FileText" },
      { id: "student-results", label: "Results", href: "/student/results", icon: "Trophy" },
      { id: "student-fees", label: "Fees", href: "/student/fees", icon: "Wallet" },
      { id: "student-applications", label: "Applications", href: "/student/applications", icon: "Inbox" },
      { id: "student-documents", label: "Documents", href: "/student/documents", icon: "FolderOpen" },
      { id: "student-notices", label: "Notices", href: "/student/notices", icon: "Megaphone" },
      { id: "student-ai", label: "Zendrock AI", href: "/ai", icon: "Sparkles" },
    ],
  },
];

export const PARENT_NAV: NavGroup[] = [
  {
    id: "parent",
    label: "Parent Portal",
    items: [
      { id: "parent-dashboard", label: "Dashboard", href: "/parent/dashboard", icon: "LayoutDashboard" },
      { id: "parent-children", label: "My Children", href: "/parent/children", icon: "Users" },
      { id: "parent-attendance", label: "Attendance", href: "/parent/attendance", icon: "ClipboardCheck" },
      { id: "parent-results", label: "Results", href: "/parent/results", icon: "Trophy" },
      { id: "parent-assignments", label: "Assignments", href: "/parent/assignments", icon: "ClipboardList" },
      { id: "parent-timetable", label: "Timetable", href: "/parent/timetable", icon: "CalendarDays" },
      { id: "parent-fees", label: "Fees", href: "/parent/fees", icon: "Wallet" },
      { id: "parent-alerts", label: "Alerts", href: "/parent/alerts", icon: "Bell", badge: 3 },
      { id: "parent-applications", label: "Applications", href: "/parent/applications", icon: "Inbox" },
      { id: "parent-complaints", label: "Complaints", href: "/parent/complaints", icon: "MessageSquareWarning" },
      { id: "parent-transport", label: "Transport", href: "/parent/transport", icon: "Bus" },
      { id: "parent-health", label: "Health", href: "/parent/health", icon: "Stethoscope" },
      { id: "parent-discipline", label: "Discipline", href: "/parent/discipline", icon: "ShieldAlert" },
      { id: "parent-feedback", label: "Feedback", href: "/parent/feedback", icon: "MessageSquareHeart" },
      { id: "parent-surveys", label: "Surveys", href: "/surveys/list", icon: "ClipboardPen" },
      { id: "parent-notices", label: "Notices", href: "/parent/notices", icon: "Megaphone" },
      { id: "parent-visitors", label: "Visitor Pickup", href: "/parent/visitors", icon: "UserCheck" },
      { id: "parent-ai", label: "Zendrock AI", href: "/ai", icon: "Sparkles" },
    ],
  },
];

function applyNavLabels(items: NavItem[], institutionType: InstitutionType): NavItem[] {
  return items.map((item) => {
    const termKey = NAV_TERM_KEYS[item.id];
    const label = termKey ? resolveTerm(termKey, institutionType) : item.label;
    return {
      ...item,
      label,
      children: item.children ? applyNavLabels(item.children, institutionType) : undefined,
    };
  });
}

export function getNavigationForRole(
  role: UserRole,
  institutionType: InstitutionType = "university",
  enabledModules: Record<string, boolean> = {},
): NavGroup[] {
  let groups: NavGroup[];
  switch (role) {
    case "platform_admin":
      groups = PLATFORM_NAV;
      break;
    case "teacher":
      groups = TEACHER_NAV;
      break;
    case "student":
      groups = STUDENT_NAV.map((group) => ({
        ...group,
        items: group.items.map((item) =>
          item.id === "student-degree" ||
          item.id === "student-advising" ||
          item.id === "student-hostel" ||
          item.id === "student-career" ||
          item.id === "student-alumni"
            ? { ...item, institutionTypes: ["university"] as InstitutionType[] }
            : item,
        ),
      }));
      break;
    case "parent":
      groups = PARENT_NAV;
      break;
    default:
      groups = INSTITUTION_NAV;
  }

  return groups
    .map((group) => ({
      ...group,
      items: applyNavLabels(
        group.items.filter((item) => {
          if (item.roles && item.roles.length > 0) {
            if (!elevatedRoles.includes(role) && !item.roles.includes(role)) return false;
          }
          if (item.institutionTypes && item.institutionTypes.length > 0) {
            if (!item.institutionTypes.includes(institutionType)) return false;
          }
          if (!isNavItemEnabled(item.id, enabledModules)) return false;
          return true;
        }),
        institutionType,
      ),
    }))
    .filter((group) => group.items.length > 0);
}

