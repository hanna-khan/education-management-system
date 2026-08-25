import {
  mockStudents,
  studentDepartments,
  studentPrograms,
  getStudentActivity,
} from "@/mock/students";
import type {
  PaginatedResult,
  Student,
  StudentActivity,
  StudentFilters,
} from "@/types/students";

function filterStudents(students: Student[], filters: StudentFilters): Student[] {
  return students.filter((student) => {
    if (filters.search) {
      const q = filters.search.toLowerCase();
      const haystack = [
        student.firstName,
        student.lastName,
        student.studentId,
        student.email,
        student.program,
        student.department,
      ]
        .join(" ")
        .toLowerCase();
      if (!haystack.includes(q)) return false;
    }
    if (filters.department && filters.department !== "all") {
      if (student.department !== filters.department) return false;
    }
    if (filters.program && filters.program !== "all") {
      if (student.program !== filters.program) return false;
    }
    if (filters.status && filters.status !== "all") {
      if (student.status !== filters.status) return false;
    }
    if (filters.feeStatus && filters.feeStatus !== "all") {
      if (student.feeStatus !== filters.feeStatus) return false;
    }
    if (filters.semester && filters.semester !== "all") {
      if (student.semester !== filters.semester) return false;
    }
    return true;
  });
}

export async function getStudents(
  filters: StudentFilters = {},
  page = 1,
  pageSize = 10,
): Promise<PaginatedResult<Student>> {
  await delay(120);
  const filtered = filterStudents(mockStudents, filters);
  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const start = (page - 1) * pageSize;
  const data = filtered.slice(start, start + pageSize);

  return { data, total, page, pageSize, totalPages };
}

export async function getStudent(id: string): Promise<Student | null> {
  await delay(80);
  return mockStudents.find((s) => s.id === id || s.studentId.toLowerCase() === id.toLowerCase()) ?? null;
}

export async function getStudentActivities(studentId: string): Promise<StudentActivity[]> {
  await delay(60);
  return getStudentActivity(studentId);
}

export async function getStudentFilterOptions() {
  return {
    departments: studentDepartments,
    programs: studentPrograms,
    semesters: [1, 2, 3, 4, 5, 6, 7, 8],
  };
}

export async function getStudentStats() {
  const active = mockStudents.filter((s) => s.status === "active").length;
  const overdue = mockStudents.filter((s) => s.feeStatus === "overdue").length;
  const avgAttendance =
    mockStudents.reduce((sum, s) => sum + s.attendanceRate, 0) / mockStudents.length;

  return {
    total: mockStudents.length,
    active,
    overdue,
    avgAttendance: avgAttendance.toFixed(1),
  };
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
