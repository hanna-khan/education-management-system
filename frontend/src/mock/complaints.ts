export const mockComplaints = [
  { id: "cmp-001", category: "Facilities", priority: "high", reporter: "Ahmed Khan", assigned: "Admin Office", status: "in_progress", sla: "1 day left", submitted: "2026-08-21" },
  { id: "cmp-002", category: "Academic", priority: "medium", reporter: "Fatima Sheikh", assigned: "Dr. Kamran Hussain", status: "assigned", sla: "3 days left", submitted: "2026-08-20" },
  { id: "cmp-003", category: "Finance", priority: "high", reporter: "Hassan Raza", assigned: "Finance Dept", status: "waiting", sla: "Breached", submitted: "2026-08-18" },
  { id: "cmp-004", category: "Transport", priority: "low", reporter: "Sara Ahmed", assigned: "Transport Office", status: "resolved", sla: "—", submitted: "2026-08-15" },
  { id: "cmp-005", category: "Harassment", priority: "critical", reporter: "Anonymous", assigned: "Grievance Cell", status: "new", sla: "4 hours left", submitted: "2026-08-22" },
];

export const complaintStats = { new: 3, assigned: 5, inProgress: 8, waiting: 4, resolved: 42, closed: 128 };
