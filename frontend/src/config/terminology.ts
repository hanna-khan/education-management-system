import type { InstitutionType, UserRole } from "@/types";

/** Shared concept keys — resolve to school vs university wording. */
export type TermKey =
  | "campus_head"
  | "campus_head_role"
  | "section_lead"
  | "academic_head"
  | "faculty"
  | "homework"
  | "homework_plural"
  | "grade_level"
  | "program"
  | "club"
  | "clubs"
  | "parent"
  | "campus"
  | "institution"
  | "registrar"
  | "student_affairs";

type TermDictionary = Record<TermKey, string>;

export const TERMINOLOGY: Record<InstitutionType, TermDictionary> = {
  school: {
    campus_head: "Principal",
    campus_head_role: "Principal",
    section_lead: "Class Teacher",
    academic_head: "Section Head",
    faculty: "Teacher",
    homework: "Homework",
    homework_plural: "Homework",
    grade_level: "Class",
    program: "Program",
    club: "House / Club",
    clubs: "Clubs & Houses",
    parent: "Parent",
    campus: "Campus",
    institution: "School",
    registrar: "Admin Office",
    student_affairs: "Student Affairs",
  },
  university: {
    campus_head: "Vice Chancellor",
    campus_head_role: "Vice Chancellor",
    section_lead: "Class Advisor",
    academic_head: "Dean / HOD",
    faculty: "Faculty",
    homework: "Assignment",
    homework_plural: "Assignments",
    grade_level: "Batch / Semester",
    program: "Program",
    club: "Society",
    clubs: "Clubs & Societies",
    parent: "Parent / Guardian",
    campus: "Campus",
    institution: "University",
    registrar: "Registrar",
    student_affairs: "Student Affairs",
  },
};

/** Map demo role keys / UserRole to display labels by institution type. */
export function getRoleDisplayLabel(
  role: UserRole,
  institutionType: InstitutionType,
  demoKey?: string,
): string {
  const t = TERMINOLOGY[institutionType];

  if (demoKey === "principal" || role === "principal") {
    return t.campus_head_role;
  }
  if (demoKey === "teacher" || role === "teacher") {
    return institutionType === "university" ? "Faculty / Advisor" : "Teacher";
  }
  if (role === "dean") return "Dean";
  if (role === "hod") return "HOD / Chairperson";
  if (role === "registrar") return t.registrar;
  if (role === "counselor") {
    return institutionType === "university" ? "Class Advisor" : "Counselor";
  }

  return role
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function resolveTerm(key: TermKey, institutionType: InstitutionType): string {
  return TERMINOLOGY[institutionType][key];
}

/** Nav item id → optional terminology override for the label. */
export const NAV_TERM_KEYS: Partial<Record<string, TermKey>> = {
  assignments: "homework_plural",
  "teacher-assignments": "homework_plural",
  "student-assignments": "homework_plural",
  "parent-assignments": "homework_plural",
  clubs: "clubs",
  "student-clubs": "clubs",
};
