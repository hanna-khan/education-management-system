import type {
  MaintenanceCategoryInfo,
  MaintenanceStaff,
  MaintenanceStats,
  MaintenanceTicket,
  MaintenanceTimelineEntry,
} from "@/types/maintenance";

export const MAINTENANCE_TABS = [
  { id: "dashboard", label: "Dashboard", href: "/maintenance" },
  { id: "tickets", label: "Tickets", href: "/maintenance/tickets" },
  { id: "categories", label: "Categories", href: "/maintenance/categories" },
  { id: "staff", label: "Staff", href: "/maintenance/staff" },
  { id: "reports", label: "Reports", href: "/maintenance/reports" },
];

export const maintenanceStats: MaintenanceStats = {
  totalTickets: 486,
  openTickets: 34,
  inProgress: 12,
  resolvedThisMonth: 58,
  avgResolutionHours: 18,
  slaBreaches: 3,
};

export const maintenanceCategories: MaintenanceCategoryInfo[] = [
  { id: "electrical", label: "Electrical", slaHours: 24, assignedTeam: "Electrical Maintenance", openCount: 8 },
  { id: "plumbing", label: "Plumbing", slaHours: 24, assignedTeam: "Plumbing Team", openCount: 6 },
  { id: "cleaning", label: "Cleaning", slaHours: 8, assignedTeam: "Housekeeping", openCount: 5 },
  { id: "hvac", label: "HVAC", slaHours: 48, assignedTeam: "HVAC Team", openCount: 4 },
  { id: "furniture", label: "Furniture", slaHours: 72, assignedTeam: "Carpentry Workshop", openCount: 3 },
  { id: "classroom", label: "Classroom", slaHours: 24, assignedTeam: "Facilities — Academic", openCount: 4 },
  { id: "laboratory", label: "Laboratory", slaHours: 12, assignedTeam: "Lab Support", openCount: 2 },
  { id: "general", label: "General", slaHours: 48, assignedTeam: "General Maintenance", openCount: 2 },
];

export const mockMaintenanceStaff: MaintenanceStaff[] = [
  { id: "ms-001", name: "Muhammad Iqbal", employeeId: "EMP-MNT-042", department: "Electrical Maintenance", specialties: ["electrical", "hvac"], activeTickets: 4, phone: "+92-300-4521001" },
  { id: "ms-002", name: "Abdul Rehman", employeeId: "EMP-MNT-038", department: "Plumbing Team", specialties: ["plumbing", "general"], activeTickets: 3, phone: "+92-321-8834521" },
  { id: "ms-003", name: "Shahid Hussain", employeeId: "EMP-MNT-035", department: "HVAC Team", specialties: ["hvac", "electrical"], activeTickets: 2, phone: "+92-333-7721098" },
  { id: "ms-004", name: "Rashid Ali", employeeId: "EMP-MNT-031", department: "Carpentry Workshop", specialties: ["furniture", "general"], activeTickets: 2, phone: "+92-345-6612345" },
  { id: "ms-005", name: "Imran Khan", employeeId: "EMP-MNT-028", department: "Lab Support", specialties: ["laboratory", "electrical"], activeTickets: 1, phone: "+92-300-9987654" },
];

export const mockMaintenanceTickets: MaintenanceTicket[] = [
  { id: "mt-001", ticketId: "MNT-2026-0088", requester: "Ahmed Hassan Siddiqui", requesterRole: "Student", category: "electrical", priority: "medium", location: "Quaid-e-Azam Boys Hostel, Room A-101", building: "Hostel Block A", description: "Ceiling fan not working — making noise and not spinning properly", attachment: "fan_photo.jpg", assignedStaff: "Muhammad Iqbal", status: "in_progress", slaDeadline: "2026-02-21T18:00:00", slaBreached: false, submittedAt: "2026-02-20T10:30:00" },
  { id: "mt-002", ticketId: "MNT-2026-0085", requester: "Dr. Farhan Ahmed", requesterRole: "Faculty", category: "classroom", priority: "high", location: "EEB-204, Electrical Engineering Block", building: "Electrical Engineering Block", description: "Smart board not responding — needs calibration or replacement", assignedStaff: "Muhammad Iqbal", status: "assigned", slaDeadline: "2026-02-22T14:00:00", slaBreached: false, submittedAt: "2026-02-21T09:15:00" },
  { id: "mt-003", ticketId: "MNT-2026-0082", requester: "Engr. Saba Tariq", requesterRole: "Faculty", category: "laboratory", priority: "urgent", location: "EEB-L03, Control Systems Lab", building: "Electrical Engineering Block", description: "PLC trainer unit sparking — lab session cancelled, safety concern", attachment: "plc_spark.mp4", assignedStaff: "Imran Khan", status: "in_progress", slaDeadline: "2026-02-21T12:00:00", slaBreached: true, submittedAt: "2026-02-20T08:00:00" },
  { id: "mt-004", ticketId: "MNT-2026-0079", requester: "Prof. Ayesha Malik", requesterRole: "Faculty", category: "plumbing", priority: "medium", location: "CEB Ground Floor Washrooms", building: "Civil Engineering Block", description: "Washroom tap leaking continuously — water wastage", assignedStaff: "Abdul Rehman", status: "waiting", slaDeadline: "2026-02-23T10:00:00", slaBreached: false, submittedAt: "2026-02-19T14:20:00" },
  { id: "mt-005", ticketId: "MNT-2026-0076", requester: "Fatima Zahra Ali", requesterRole: "Student", category: "cleaning", priority: "low", location: "Library Reading Hall, Block 3", building: "Library & Learning Centre", description: "AC vents need cleaning — dust affecting air quality", status: "submitted", slaDeadline: "2026-02-22T08:00:00", slaBreached: false, submittedAt: "2026-02-21T11:45:00" },
  { id: "mt-006", ticketId: "MNT-2026-0072", requester: "Mr. Kamran Butt", requesterRole: "Staff", category: "furniture", priority: "medium", location: "MAB-102, Main Academic Block", building: "Main Academic Block", description: "Broken chair in row 3 — student injured minor scratch", assignedStaff: "Rashid Ali", status: "resolved", slaDeadline: "2026-02-18T17:00:00", slaBreached: false, submittedAt: "2026-02-15T10:00:00", resolvedAt: "2026-02-17T15:30:00" },
  { id: "mt-007", ticketId: "MNT-2026-0068", requester: "Dr. Asif Raza", requesterRole: "Faculty", category: "hvac", priority: "high", location: "MEB-105, Mechanical Lab", building: "Mechanical Engineering Block", description: "AC unit not cooling — lab temperature above 32°C", attachment: "temp_reading.jpg", assignedStaff: "Shahid Hussain", status: "in_progress", slaDeadline: "2026-02-22T08:00:00", slaBreached: false, submittedAt: "2026-02-20T07:30:00" },
  { id: "mt-008", ticketId: "MNT-2026-0065", requester: "Hassan Raza Jaffery", requesterRole: "Student", category: "general", priority: "low", location: "University Ground — Pavilion", building: "Sports Complex", description: "Pavilion roof leaking during rain — equipment stored inside", status: "closed", slaDeadline: "2026-02-10T17:00:00", slaBreached: false, submittedAt: "2026-02-05T16:00:00", resolvedAt: "2026-02-09T11:00:00" },
];

export const maintenanceTimelines: Record<string, MaintenanceTimelineEntry[]> = {
  "mt-001": [
    { at: "2026-02-20 10:30", action: "Ticket submitted", actor: "Ahmed Hassan Siddiqui", note: "Ceiling fan issue reported" },
    { at: "2026-02-20 11:15", action: "Assigned to staff", actor: "Facilities Admin", note: "Assigned to Muhammad Iqbal — Electrical" },
    { at: "2026-02-20 14:00", action: "Status: In Progress", actor: "Muhammad Iqbal", note: "Inspected fan — capacitor replacement needed" },
    { at: "2026-02-21 09:00", action: "Parts ordered", actor: "Muhammad Iqbal", note: "Capacitor ordered from Saddar market" },
  ],
  "mt-003": [
    { at: "2026-02-20 08:00", action: "Ticket submitted", actor: "Engr. Saba Tariq", note: "Urgent — PLC trainer sparking" },
    { at: "2026-02-20 08:15", action: "Escalated — SLA urgent", actor: "System", note: "Lab session cancelled, safety lock applied" },
    { at: "2026-02-20 09:30", action: "Assigned to staff", actor: "Facilities Admin", note: "Assigned to Imran Khan — Lab Support" },
    { at: "2026-02-20 10:00", action: "Status: In Progress", actor: "Imran Khan", note: "Inspected wiring — short circuit in power supply unit" },
    { at: "2026-02-21 08:00", action: "SLA breached", actor: "System", note: "Resolution deadline passed — vendor contacted" },
  ],
  "mt-006": [
    { at: "2026-02-15 10:00", action: "Ticket submitted", actor: "Mr. Kamran Butt" },
    { at: "2026-02-15 14:00", action: "Assigned to staff", actor: "Facilities Admin", note: "Rashid Ali — Carpentry" },
    { at: "2026-02-17 15:30", action: "Resolved", actor: "Rashid Ali", note: "Chair replaced with new unit from workshop" },
    { at: "2026-02-17 16:00", action: "Closed", actor: "Mr. Kamran Butt", note: "Confirmed fix" },
  ],
};

export function getMaintenanceTicket(id: string) {
  return mockMaintenanceTickets.find((t) => t.id === id);
}

export function getMaintenanceTimeline(ticketId: string) {
  return maintenanceTimelines[ticketId] ?? [
    { at: "2026-02-21 12:00", action: "Ticket submitted", actor: "Requester" },
    { at: "2026-02-21 12:30", action: "Pending assignment", actor: "System" },
  ];
}
