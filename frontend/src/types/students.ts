export type StudentStatus = "active" | "inactive" | "graduated" | "suspended" | "on_leave";
export type FeeStatus = "paid" | "partial" | "overdue" | "waived";

export interface Student {
  id: string;
  studentId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  program: string;
  department: string;
  semester: number;
  section: string;
  status: StudentStatus;
  attendanceRate: number;
  feeStatus: FeeStatus;
  avatarInitials: string;
  enrollmentDate: string;
  cgpa: number;
  dateOfBirth: string;
  gender: string;
  cnic: string;
  address: string;
  city: string;
  guardianName: string;
  guardianPhone: string;
  guardianRelation: string;
  campus: string;
}

export interface StudentActivity {
  id: string;
  title: string;
  description: string;
  date: string;
  type: "application" | "fee" | "attendance" | "academic" | "document";
}

export interface StudentFilters {
  search?: string;
  department?: string;
  program?: string;
  status?: StudentStatus | "all";
  feeStatus?: FeeStatus | "all";
  semester?: number | "all";
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
