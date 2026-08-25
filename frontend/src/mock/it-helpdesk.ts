import type {
  ItCategoryInfo,
  ItComment,
  ItHelpdeskStats,
  ItTechnician,
  ItTicket,
  ItTimelineEntry,
} from "@/types/it-helpdesk";

export const IT_HELPDESK_TABS = [
  { id: "dashboard", label: "Dashboard", href: "/it-helpdesk" },
  { id: "tickets", label: "Tickets", href: "/it-helpdesk/tickets" },
  { id: "categories", label: "Categories", href: "/it-helpdesk/categories" },
  { id: "technicians", label: "Technicians", href: "/it-helpdesk/technicians" },
  { id: "reports", label: "Reports", href: "/it-helpdesk/reports" },
];

export const itHelpdeskStats: ItHelpdeskStats = {
  totalTickets: 1240,
  openTickets: 28,
  inProgress: 11,
  resolvedToday: 6,
  avgResponseMinutes: 45,
  slaCompliance: 94,
};

export const itCategories: ItCategoryInfo[] = [
  { id: "hardware", label: "Hardware", slaHours: 24, openCount: 6 },
  { id: "software", label: "Software", slaHours: 8, openCount: 8 },
  { id: "network", label: "Network", slaHours: 4, openCount: 3 },
  { id: "wifi", label: "WiFi", slaHours: 2, openCount: 5 },
  { id: "account", label: "Account", slaHours: 4, openCount: 2 },
  { id: "password", label: "Password", slaHours: 1, openCount: 4 },
  { id: "email", label: "Email", slaHours: 4, openCount: 1 },
  { id: "lms", label: "LMS", slaHours: 8, openCount: 3 },
  { id: "other", label: "Other", slaHours: 24, openCount: 2 },
];

export const mockTechnicians: ItTechnician[] = [
  { id: "tech-001", name: "Usman Ali", employeeId: "EMP-IT-042", specialties: ["hardware", "network"], activeTickets: 5, resolvedThisMonth: 42, phone: "+92-300-1122334", shift: "Morning (08:00–16:00)" },
  { id: "tech-002", name: "Saad Mahmood", employeeId: "EMP-IT-038", specialties: ["software", "lms"], activeTickets: 4, resolvedThisMonth: 38, phone: "+92-321-4455667", shift: "Morning (08:00–16:00)" },
  { id: "tech-003", name: "Fahad Khan", employeeId: "EMP-IT-035", specialties: ["wifi", "network"], activeTickets: 3, resolvedThisMonth: 55, phone: "+92-333-7788990", shift: "Evening (14:00–22:00)" },
  { id: "tech-004", name: "Ayesha Siddiqui", employeeId: "EMP-IT-031", specialties: ["account", "password", "email"], activeTickets: 6, resolvedThisMonth: 48, phone: "+92-345-2233445", shift: "Morning (08:00–16:00)" },
];

export const mockItTickets: ItTicket[] = [
  { id: "it-001", ticketId: "IT-2026-0156", requester: "Ahmed Hassan Siddiqui", requesterRole: "Student", category: "wifi", priority: "high", subject: "Cannot connect to NED-Student WiFi", description: "Laptop shows connected but no internet access in Block 16. Tried restarting — same issue since yesterday.", deviceInfo: "Dell Inspiron 15, Windows 11", assignedTechnician: "Fahad Khan", status: "in_progress", slaDeadline: "2026-02-21T12:30:00", slaBreached: false, submittedAt: "2026-02-21T10:30:00" },
  { id: "it-002", ticketId: "IT-2026-0152", requester: "Dr. Farhan Ahmed", requesterRole: "Faculty", category: "hardware", priority: "medium", subject: "Projector bulb replacement — EEB-204", description: "Projector display is dim — students cannot see slides. Needs bulb or full unit check.", assignedTechnician: "Usman Ali", status: "assigned", slaDeadline: "2026-02-23T09:15:00", slaBreached: false, submittedAt: "2026-02-21T09:15:00" },
  { id: "it-003", ticketId: "IT-2026-0148", requester: "Muhammad Usman Khan", requesterRole: "Student", category: "lms", priority: "medium", subject: "Cannot submit assignment on LMS", description: "Getting error 500 when uploading PDF for CS-401 assignment. File size 2.1 MB.", attachment: "error_screenshot.png", assignedTechnician: "Saad Mahmood", status: "waiting_for_user", slaDeadline: "2026-02-21T18:00:00", slaBreached: false, submittedAt: "2026-02-20T14:00:00" },
  { id: "it-004", ticketId: "IT-2026-0144", requester: "Fatima Zahra Ali", requesterRole: "Student", category: "password", priority: "critical", subject: "Portal password reset — locked out", description: "Account locked after 5 failed attempts. Need urgent access for exam registration deadline today.", assignedTechnician: "Ayesha Siddiqui", status: "resolved", slaDeadline: "2026-02-20T15:30:00", slaBreached: false, submittedAt: "2026-02-20T14:30:00", resolvedAt: "2026-02-20T14:45:00" },
  { id: "it-005", ticketId: "IT-2026-0140", requester: "Engr. Saba Tariq", requesterRole: "Faculty", category: "software", priority: "high", subject: "MATLAB license not activating", description: "MATLAB R2024b shows license error on lab computers in CSB-L01. 40 students affected.", assignedTechnician: "Saad Mahmood", status: "in_progress", slaDeadline: "2026-02-21T16:00:00", slaBreached: false, submittedAt: "2026-02-21T08:00:00" },
  { id: "it-006", ticketId: "IT-2026-0136", requester: "Prof. Ayesha Malik", requesterRole: "Faculty", category: "email", priority: "medium", subject: "Email quota exceeded", description: "Cannot receive new emails — inbox full at 2GB limit. Need quota increase or cleanup guidance.", assignedTechnician: "Ayesha Siddiqui", status: "submitted", slaDeadline: "2026-02-22T11:00:00", slaBreached: false, submittedAt: "2026-02-21T11:00:00" },
  { id: "it-007", ticketId: "IT-2026-0132", requester: "Bilal Ahmed Qureshi", requesterRole: "Student", category: "network", priority: "low", subject: "Lab PC slow network speed", description: "Download speed only 5 Mbps in CSB-L01 vs 50 Mbps on personal hotspot.", deviceInfo: "Lab PC #12", assignedTechnician: "Fahad Khan", status: "closed", slaDeadline: "2026-02-18T17:00:00", slaBreached: false, submittedAt: "2026-02-17T10:00:00", resolvedAt: "2026-02-18T11:30:00" },
  { id: "it-008", ticketId: "IT-2026-0128", requester: "Hassan Raza Jaffery", requesterRole: "Student", category: "account", priority: "medium", subject: "Student portal showing wrong semester", description: "Portal displays Semester 5 but I am in Semester 7. Affecting course registration.", status: "submitted", slaDeadline: "2026-02-22T09:00:00", slaBreached: false, submittedAt: "2026-02-21T09:00:00" },
];

export const itTicketComments: Record<string, ItComment[]> = {
  "it-001": [
    { id: "c-001", author: "Fahad Khan", message: "Checked AP in Block 16 corridor — firmware update pending. Applying patch now.", at: "2026-02-21 10:45" },
    { id: "c-002", author: "Ahmed Hassan Siddiqui", message: "Still no internet after reconnecting. Tried different browser too.", at: "2026-02-21 11:00" },
    { id: "c-003", author: "Fahad Khan", message: "AP rebooted. Please forget network and reconnect with your student credentials.", at: "2026-02-21 11:15", internal: false },
  ],
  "it-003": [
    { id: "c-004", author: "Saad Mahmood", message: "Server logs show file upload limit was 2MB. Increased to 10MB for LMS.", at: "2026-02-20 15:30" },
    { id: "c-005", author: "Saad Mahmood", message: "Please retry upload and confirm if issue persists.", at: "2026-02-20 15:35" },
  ],
};

export const itTimelines: Record<string, ItTimelineEntry[]> = {
  "it-001": [
    { at: "2026-02-21 10:30", action: "Ticket submitted", actor: "Ahmed Hassan Siddiqui" },
    { at: "2026-02-21 10:35", action: "Auto-assigned", actor: "System", note: "WiFi category → Fahad Khan" },
    { at: "2026-02-21 10:45", action: "In Progress", actor: "Fahad Khan", note: "Checking Block 16 AP" },
  ],
  "it-004": [
    { at: "2026-02-20 14:30", action: "Ticket submitted", actor: "Fatima Zahra Ali", note: "Critical — exam registration deadline" },
    { at: "2026-02-20 14:32", action: "Assigned", actor: "System", note: "Password reset → Ayesha Siddiqui" },
    { at: "2026-02-20 14:40", action: "In Progress", actor: "Ayesha Siddiqui", note: "Identity verified via CNIC last 4 digits" },
    { at: "2026-02-20 14:45", action: "Resolved", actor: "Ayesha Siddiqui", note: "Password reset link sent to registered email" },
    { at: "2026-02-20 15:00", action: "Closed", actor: "Fatima Zahra Ali", note: "Confirmed access restored" },
  ],
};

export function getItTicket(id: string) {
  return mockItTickets.find((t) => t.id === id);
}

export function getItTimeline(ticketId: string) {
  return itTimelines[ticketId] ?? [
    { at: "2026-02-21 12:00", action: "Ticket submitted", actor: "Requester" },
    { at: "2026-02-21 12:15", action: "Pending assignment", actor: "System" },
  ];
}

export function getItComments(ticketId: string) {
  return itTicketComments[ticketId] ?? [];
}
