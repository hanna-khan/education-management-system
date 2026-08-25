export interface PerformerEntry {
  rank: number;
  id: string;
  name: string;
  className: string;
  section: string;
  marks: number;
  gpa: number;
  subject: string;
  avatarInitials: string;
  avatarColor: string;
  trend: "up" | "down" | "same";
  change: string;
}

export const schoolClasses = [
  "All Classes",
  "Grade 8-A",
  "Grade 8-B",
  "Grade 9-A",
  "Grade 9-B",
  "Grade 10-A",
  "Grade 10-B",
  "Grade 11-A",
  "Grade 12-A",
];

export const starStudentsWeekly: PerformerEntry[] = [
  { rank: 1, id: "stu-101", name: "Aisha Rahman", className: "Grade 10-A", section: "A", marks: 98, gpa: 4.0, subject: "Mathematics", avatarInitials: "AR", avatarColor: "#6B58F6", trend: "up", change: "+2" },
  { rank: 2, id: "stu-102", name: "Hassan Ali", className: "Grade 10-B", section: "B", marks: 96, gpa: 3.95, subject: "Science", avatarInitials: "HA", avatarColor: "#1BD0B4", trend: "up", change: "+1" },
  { rank: 3, id: "stu-103", name: "Zara Malik", className: "Grade 11-A", section: "A", marks: 95, gpa: 3.92, subject: "English", avatarInitials: "ZM", avatarColor: "#F4901F", trend: "same", change: "0" },
  { rank: 4, id: "stu-104", name: "Bilal Ahmed", className: "Grade 9-A", section: "A", marks: 94, gpa: 3.88, subject: "Physics", avatarInitials: "BA", avatarColor: "#3B82F6", trend: "up", change: "+3" },
  { rank: 5, id: "stu-105", name: "Sana Iqbal", className: "Grade 12-A", section: "A", marks: 93, gpa: 3.85, subject: "Chemistry", avatarInitials: "SI", avatarColor: "#8C4AF2", trend: "down", change: "-1" },
];

export const starStudentsMonthly: PerformerEntry[] = [
  { rank: 1, id: "stu-106", name: "Omar Farooq", className: "Grade 12-A", section: "A", marks: 99, gpa: 4.0, subject: "Mathematics", avatarInitials: "OF", avatarColor: "#6B58F6", trend: "up", change: "+4" },
  { rank: 2, id: "stu-101", name: "Aisha Rahman", className: "Grade 10-A", section: "A", marks: 97, gpa: 3.98, subject: "Mathematics", avatarInitials: "AR", avatarColor: "#1BD0B4", trend: "up", change: "+2" },
  { rank: 3, id: "stu-107", name: "Fatima Noor", className: "Grade 11-A", section: "A", marks: 96, gpa: 3.94, subject: "Biology", avatarInitials: "FN", avatarColor: "#F4901F", trend: "up", change: "+1" },
  { rank: 4, id: "stu-108", name: "Usman Khan", className: "Grade 10-B", section: "B", marks: 95, gpa: 3.9, subject: "Computer Science", avatarInitials: "UK", avatarColor: "#3B82F6", trend: "same", change: "0" },
  { rank: 5, id: "stu-109", name: "Mariam Shah", className: "Grade 9-B", section: "B", marks: 94, gpa: 3.87, subject: "English", avatarInitials: "MS", avatarColor: "#FF394B", trend: "up", change: "+2" },
];

export const bestPerformersWeekly: PerformerEntry[] = [
  { rank: 1, id: "stu-110", name: "Danish Tariq", className: "Grade 10-A", section: "A", marks: 100, gpa: 4.0, subject: "Overall", avatarInitials: "DT", avatarColor: "#6B58F6", trend: "up", change: "+5" },
  { rank: 2, id: "stu-111", name: "Hira Abbas", className: "Grade 9-A", section: "A", marks: 98, gpa: 3.96, subject: "Overall", avatarInitials: "HA", avatarColor: "#1BD0B4", trend: "up", change: "+2" },
  { rank: 3, id: "stu-112", name: "Rayyan Qureshi", className: "Grade 11-A", section: "A", marks: 97, gpa: 3.93, subject: "Overall", avatarInitials: "RQ", avatarColor: "#F4901F", trend: "up", change: "+1" },
  { rank: 4, id: "stu-113", name: "Amna Siddiqi", className: "Grade 8-B", section: "B", marks: 96, gpa: 3.9, subject: "Overall", avatarInitials: "AS", avatarColor: "#8C4AF2", trend: "same", change: "0" },
  { rank: 5, id: "stu-114", name: "Taimoor Baig", className: "Grade 12-A", section: "A", marks: 95, gpa: 3.88, subject: "Overall", avatarInitials: "TB", avatarColor: "#3B82F6", trend: "down", change: "-1" },
];

export const bestPerformersMonthly: PerformerEntry[] = [
  { rank: 1, id: "stu-110", name: "Danish Tariq", className: "Grade 10-A", section: "A", marks: 99, gpa: 4.0, subject: "Overall", avatarInitials: "DT", avatarColor: "#6B58F6", trend: "up", change: "+3" },
  { rank: 2, id: "stu-106", name: "Omar Farooq", className: "Grade 12-A", section: "A", marks: 98, gpa: 3.98, subject: "Overall", avatarInitials: "OF", avatarColor: "#1BD0B4", trend: "up", change: "+2" },
  { rank: 3, id: "stu-115", name: "Laiba Hassan", className: "Grade 10-B", section: "B", marks: 97, gpa: 3.95, subject: "Overall", avatarInitials: "LH", avatarColor: "#F4901F", trend: "up", change: "+4" },
  { rank: 4, id: "stu-116", name: "Arham Saleem", className: "Grade 9-B", section: "B", marks: 96, gpa: 3.91, subject: "Overall", avatarInitials: "AS", avatarColor: "#8C4AF2", trend: "same", change: "0" },
  { rank: 5, id: "stu-117", name: "Noor Fatima", className: "Grade 8-A", section: "A", marks: 95, gpa: 3.89, subject: "Overall", avatarInitials: "NF", avatarColor: "#3B82F6", trend: "up", change: "+1" },
];

export function filterPerformers(entries: PerformerEntry[], classFilter: string) {
  if (classFilter === "All Classes") return entries;
  return entries.filter((e) => e.className === classFilter);
}
