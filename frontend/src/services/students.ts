import { api } from "@/lib/api";
import type {
  PaginatedResult,
  Student,
  StudentActivity,
  StudentFilters,
} from "@/types/students";

export async function getStudents(
  filters: StudentFilters = {},
  page = 1,
  pageSize = 10,
): Promise<PaginatedResult<Student>> {
  const params = new URLSearchParams({
    page: String(page),
    pageSize: String(pageSize),
  });
  if (filters.search) params.set("search", filters.search);
  if (filters.department && filters.department !== "all") params.set("department", filters.department);
  if (filters.program && filters.program !== "all") params.set("program", filters.program);
  if (filters.status && filters.status !== "all") params.set("status", filters.status);
  if (filters.feeStatus && filters.feeStatus !== "all") params.set("feeStatus", filters.feeStatus);
  if (filters.semester && filters.semester !== "all") params.set("semester", String(filters.semester));

  return api<PaginatedResult<Student>>(`/students?${params.toString()}`);
}

export async function getStudent(id: string): Promise<Student | null> {
  return api<Student>(`/students/${encodeURIComponent(id)}`);
}

export async function getStudentActivities(_studentId: string): Promise<StudentActivity[]> {
  return [];
}

export async function getStudentFilterOptions() {
  return api<{
    departments: string[];
    programs: string[];
    semesters: number[];
  }>("/students/filter-options");
}

export async function getStudentStats() {
  return api<{
    total: number;
    active: number;
    overdue: number;
    avgAttendance: string;
  }>("/students/stats");
}
