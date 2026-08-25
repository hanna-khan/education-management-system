import type {
  EmergencyAlert,
  EmergencyAnnouncement,
  EmergencyContact,
  EmergencyStats,
  EvacuationPlan,
  SafetyIncident,
} from "@/types/emergency";

export const EMERGENCY_TABS = [
  { id: "dashboard", label: "Dashboard", href: "/emergency" },
  { id: "alerts", label: "Alerts", href: "/emergency/alerts" },
  { id: "contacts", label: "Contacts", href: "/emergency/contacts" },
  { id: "incidents", label: "Incidents", href: "/emergency/incidents" },
  { id: "evacuation", label: "Evacuation", href: "/emergency/evacuation" },
  { id: "announce", label: "Broadcast", href: "/emergency/announce" },
];

export const ANNOUNCEMENT_RECIPIENTS = [
  "entire_institution",
  "campus",
  "department",
  "students",
  "parents",
  "staff",
] as const;

export const emergencyStats: EmergencyStats = {
  activeAlerts: 1,
  openIncidents: 3,
  emergencyContacts: 24,
  drillsThisYear: 4,
  announcementsSent: 12,
  evacuationPlans: 8,
};

export const mockEmergencyAlerts: EmergencyAlert[] = [
  { id: "ea-001", alertId: "EA-2026-001", title: "Heatwave Advisory — Hydration Protocol", severity: "warning", type: "other", location: "All Campus", issuedAt: "2026-02-23 09:00", issuedBy: "Campus Safety Office", status: "active", recipients: ["entire_institution", "students", "staff"] },
  { id: "ea-002", alertId: "EA-2026-002", title: "Fire Drill — Block 7 EE Building", severity: "info", type: "fire", location: "Electrical Engineering Block", issuedAt: "2026-02-20 14:00", issuedBy: "Security Chief — Capt. Javed", status: "resolved", recipients: ["campus", "department"] },
  { id: "ea-003", alertId: "EA-2025-015", title: "Monsoon Flood Preparedness", severity: "warning", type: "natural_disaster", location: "Karachi Campus", issuedAt: "2025-07-15 08:00", issuedBy: "Administration", status: "resolved", recipients: ["entire_institution"] },
];

export const mockEmergencyContacts: EmergencyContact[] = [
  { id: "ec-001", name: "Capt. Javed Iqbal", role: "Chief Security Officer", department: "Security", phone: "+92-21-99261200", alternatePhone: "+92-300-9926120", email: "security@neduet.edu.pk", available24x7: true, priority: 1 },
  { id: "ec-002", name: "Dr. Saba Noor", role: "Campus Medical Officer", department: "Health Clinic", phone: "+92-21-99261250", email: "clinic@neduet.edu.pk", available24x7: false, priority: 2 },
  { id: "ec-003", name: "Engr. Tariq Mehmood", role: "Fire Safety Warden — Block 7", department: "Electrical Engineering", phone: "+92-321-4567890", email: "tariq.m@neduet.edu.pk", available24x7: false, priority: 3 },
  { id: "ec-004", name: "Karachi Fire Brigade", role: "External Emergency", department: "External", phone: "16", alternatePhone: "+92-21-99201234", email: "N/A", available24x7: true, priority: 1 },
  { id: "ec-005", name: "Edhi Ambulance", role: "External Emergency", department: "External", phone: "115", email: "N/A", available24x7: true, priority: 1 },
  { id: "ec-006", name: "Dr. Asif Raza", role: "Emergency Coordinator", department: "Administration", phone: "+92-21-99261100", email: "vc.office@neduet.edu.pk", available24x7: true, priority: 2 },
];

export const mockSafetyIncidents: SafetyIncident[] = [
  { id: "si-001", incidentId: "SI-2026-004", type: "medical", title: "Student fainted during exam — Block 3", location: "Block 3 — Room 301", reportedAt: "2026-02-22 11:30", reportedBy: "Invigilator — Dr. Imran", severity: "warning", status: "resolved", injuries: 0 },
  { id: "si-002", incidentId: "SI-2026-003", type: "security", title: "Unauthorized person at main gate", location: "Main Gate — University Road", reportedAt: "2026-02-20 16:45", reportedBy: "Security Guard — Ali Hassan", severity: "info", status: "investigating", injuries: 0 },
  { id: "si-003", incidentId: "SI-2026-002", type: "chemical", title: "Minor chemical spill in Chemistry Lab", location: "Chemistry Lab — Block 5", reportedAt: "2026-02-18 14:20", reportedBy: "Lab Assistant — Fatima", severity: "warning", status: "resolved", injuries: 0 },
  { id: "si-004", incidentId: "SI-2026-001", type: "fire", title: "Smoke detected in EE Lab — false alarm", location: "EE Lab — Room 701", reportedAt: "2026-02-10 10:15", reportedBy: "Lab Incharge", severity: "critical", status: "closed", injuries: 0 },
];

export const mockEvacuationPlans: EvacuationPlan[] = [
  { id: "ev-001", planId: "EVAC-BLK7", building: "Electrical Engineering Block", assemblyPoint: "Parking Area — North Gate", routes: "Exit via Stairwell A (East) or Stairwell B (West) → Assembly Point", warden: "Engr. Tariq Mehmood", lastDrill: "2026-02-20", nextDrill: "2026-08-20", capacity: 800 },
  { id: "ev-002", planId: "EVAC-MAIN", building: "Main Auditorium & Admin Block", assemblyPoint: "Sports Ground", routes: "Exit via Main Entrance or Side Exit → Sports Ground", warden: "Muhammad Rashid", lastDrill: "2025-11-15", nextDrill: "2026-05-15", capacity: 1200 },
  { id: "ev-003", planId: "EVAC-CIS", building: "Computer & IT Block", assemblyPoint: "Library Lawn", routes: "Exit via Ground Floor exits → Library Lawn", warden: "IT Director", lastDrill: "2026-01-10", nextDrill: "2026-07-10", capacity: 600 },
  { id: "ev-004", planId: "EVAC-HOSTEL", building: "Quaid-e-Azam Boys Hostel", assemblyPoint: "Hostel Courtyard", routes: "Exit via all stairwells → Courtyard assembly", warden: "Dr. Asif Raza", lastDrill: "2025-12-01", nextDrill: "2026-06-01", capacity: 520 },
];

export const mockEmergencyAnnouncements: EmergencyAnnouncement[] = [
  { id: "ann-001", announcementId: "ANN-2026-004", title: "Heatwave Advisory", message: "Due to extreme heat in Karachi, all outdoor activities are suspended until 4 PM. Stay hydrated.", recipients: ["entire_institution"], sentAt: "2026-02-23 09:00", sentBy: "Campus Safety Office", deliveryStatus: "sent", recipientCount: 8420 },
  { id: "ann-002", announcementId: "ANN-2026-003", title: "Fire Drill Notification — Block 7", message: "Mandatory fire drill on Feb 20 at 2 PM. Follow warden instructions.", recipients: ["campus", "department"], sentAt: "2026-02-19 16:00", sentBy: "Capt. Javed Iqbal", deliveryStatus: "sent", recipientCount: 850 },
  { id: "ann-003", announcementId: "ANN-2026-005", title: "Parent Safety Update", message: "Campus security enhanced during exam period. Gate pass required for all visitors.", recipients: ["parents"], sentAt: "2026-02-22 08:00", sentBy: "Registrar Office", deliveryStatus: "scheduled", recipientCount: 3200 },
];

export function getEmergencyAlert(id: string) {
  return mockEmergencyAlerts.find((a) => a.id === id) ?? null;
}
