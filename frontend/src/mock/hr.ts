export const mockEmployees = [
  { id: "emp-2019-044", name: "Dr. Kamran Hussain", department: "Computer Science", designation: "Professor", status: "active", joinDate: "2019-03-01" },
  { id: "emp-2020-012", name: "Sana Iqbal", department: "Computer Science", designation: "Assistant Professor", status: "active", joinDate: "2020-08-15" },
  { id: "emp-2018-089", name: "Dr. Farah Naz", department: "Electrical Engineering", designation: "Associate Professor", status: "active", joinDate: "2018-01-10" },
  { id: "emp-2021-056", name: "Dr. Imran Malik", department: "Business Administration", designation: "Professor", status: "active", joinDate: "2021-02-01" },
  { id: "emp-2022-034", name: "Ayesha Malik", department: "Administration", designation: "HR Manager", status: "active", joinDate: "2022-06-01" },
];

export const mockPayroll = [
  { employee: "Dr. Kamran Hussain", basic: 280000, allowances: 45000, deductions: 32000, net: 293000, status: "processed" },
  { employee: "Sana Iqbal", basic: 180000, allowances: 28000, deductions: 18000, net: 190000, status: "processed" },
  { employee: "Dr. Farah Naz", basic: 240000, allowances: 38000, deductions: 26000, net: 252000, status: "pending" },
  { employee: "Ayesha Malik", basic: 160000, allowances: 22000, deductions: 15000, net: 167000, status: "processed" },
];

export const payrollStats = { total: 12400000, employees: 386, pending: 12, processed: 374 };

export const HR_TABS = [
  { id: "dashboard", label: "Dashboard", href: "/hr" },
  { id: "employees", label: "Employees", href: "/hr/employees" },
  { id: "attendance", label: "Attendance", href: "/hr/attendance" },
  { id: "leave", label: "Leave", href: "/hr/leave" },
  { id: "payroll", label: "Payroll", href: "/hr/payroll" },
];
