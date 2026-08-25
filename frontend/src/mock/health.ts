import type {
  AllergyRecord,
  ClinicVisit,
  EmergencyContact,
  HealthStats,
  MedicalDocument,
  MedicalIncident,
  MedicalProfile,
  ParentHealthNotification,
  StudentHealthSummary,
  VaccinationRecord,
} from "@/types/health";

export const HEALTH_TABS = [
  { id: "dashboard", label: "Dashboard", href: "/health" },
  { id: "profiles", label: "Profiles", href: "/health/profiles" },
  { id: "visits", label: "Clinic Visits", href: "/health/visits" },
  { id: "incidents", label: "Incidents", href: "/health/incidents" },
  { id: "allergies", label: "Allergies", href: "/health/allergies" },
  { id: "vaccinations", label: "Vaccinations", href: "/health/vaccinations" },
  { id: "documents", label: "Documents", href: "/health/documents" },
];

export const healthStats: HealthStats = {
  totalStudentProfiles: 8420,
  totalStaffProfiles: 680,
  visitsThisMonth: 186,
  openIncidents: 4,
  studentsWithAllergies: 312,
  vaccinationsDue: 89,
  pendingDocuments: 24,
};

export const mockMedicalProfiles: MedicalProfile[] = [
  { id: "mp-001", personId: "CS-2022-0421", name: "Ahmed Hassan Siddiqui", type: "student", department: "Computer Systems", bloodGroup: "B+", heightCm: 175, weightKg: 72, chronicConditions: [], lastVisit: "2026-01-22", emergencyContact: "Siddiqui Hassan (Father)", emergencyPhone: "+92-300-1234567", accessLevel: "clinical_staff" },
  { id: "mp-002", personId: "CS-2023-0112", name: "Fatima Zahra Ali", type: "student", department: "Computer Science", bloodGroup: "O+", heightCm: 162, weightKg: 58, chronicConditions: ["Asthma"], lastVisit: "2026-02-10", emergencyContact: "Ali Raza (Father)", emergencyPhone: "+92-321-9876543", accessLevel: "clinical_staff" },
  { id: "mp-003", personId: "EMP-042", name: "Dr. Samina Khursheed", type: "staff", department: "Electrical Engineering", bloodGroup: "A+", chronicConditions: [], emergencyContact: "Khursheed Ahmed (Spouse)", emergencyPhone: "+92-333-5551234", accessLevel: "restricted" },
  { id: "mp-004", personId: "EE-2024-0156", name: "Bilal Ahmed Qureshi", type: "student", department: "Electrical Engineering", bloodGroup: "AB+", heightCm: 178, weightKg: 75, chronicConditions: ["Diabetes Type 1"], lastVisit: "2026-02-18", emergencyContact: "Qureshi Mehmood (Father)", emergencyPhone: "+92-345-7778899", accessLevel: "clinical_staff" },
];

export const mockClinicVisits: ClinicVisit[] = [
  { id: "cv-001", visitId: "CLN-2026-0186", studentId: "CS-2022-0421", studentName: "Ahmed Hassan Siddiqui", visitDate: "2026-02-20", reason: "Headache and fever", symptoms: "Headache, mild fever (100.4°F)", diagnosis: "Viral fever", treatment: "Paracetamol 500mg — 3 days; rest advised", notes: "No travel history. Hydration recommended.", followUp: "2026-02-25 if symptoms persist", nurseName: "Sister Ayesha Bibi", status: "completed", parentNotified: false },
  { id: "cv-002", visitId: "CLN-2026-0182", studentId: "CS-2023-0112", studentName: "Fatima Zahra Ali", visitDate: "2026-02-18", reason: "Asthma episode", symptoms: "Shortness of breath, wheezing", diagnosis: "Mild asthma exacerbation", treatment: "Salbutamol inhaler administered; observed 30 min", notes: "Triggered during PE class. Inhaler refilled.", followUp: "Follow up with pulmonologist recommended", nurseName: "Dr. Farah Naz", status: "completed", parentNotified: true },
  { id: "cv-003", visitId: "CLN-2026-0178", studentId: "EE-2024-0156", studentName: "Bilal Ahmed Qureshi", visitDate: "2026-02-15", reason: "Routine check-up", symptoms: "Blood sugar monitoring", treatment: "Glucose level checked — 110 mg/dL (normal)", notes: "Diabetic student — insulin schedule reviewed.", nurseName: "Sister Ayesha Bibi", status: "completed", parentNotified: false },
];

export const mockMedicalIncidents: MedicalIncident[] = [
  { id: "mi-001", incidentId: "MED-INC-042", studentId: "ME-2023-0177", studentName: "Usama Farooq", reportedAt: "2026-02-19 11:30", location: "Mechanical Workshop, Block C", description: "Minor cut on left hand during lab session", severity: "minor", status: "treated", reportedBy: "Engr. Tariq Mehmood", treatment: "Wound cleaned, bandaged. Tetanus booster given.", parentNotified: true },
  { id: "mi-002", incidentId: "MED-INC-038", studentId: "CE-2024-0021", studentName: "Ayesha Malik", reportedAt: "2026-02-17 14:15", location: "Sports Ground", description: "Ankle sprain during football practice", severity: "moderate", status: "referred", reportedBy: "Coach Imran Ali", treatment: "Ice pack applied; referred to Aga Khan Hospital for X-ray", parentNotified: true },
  { id: "mi-003", incidentId: "MED-INC-035", studentId: "CS-2024-0088", studentName: "Syed Ali Raza", reportedAt: "2026-02-14 09:00", location: "Main Campus Cafeteria", description: "Allergic reaction — suspected peanut exposure", severity: "serious", status: "under_review", reportedBy: "Cafeteria Staff", parentNotified: true },
];

export const mockAllergies: AllergyRecord[] = [
  { id: "al-001", personId: "CS-2024-0088", name: "Syed Ali Raza", type: "student", allergen: "Peanuts", severity: "severe", reaction: "Anaphylaxis risk — throat swelling, hives", notes: "EpiPen kept at clinic. Cafeteria notified.", accessLevel: "clinical_staff" },
  { id: "al-002", personId: "CS-2023-0112", name: "Fatima Zahra Ali", type: "student", allergen: "Dust mites", severity: "moderate", reaction: "Asthma exacerbation, sneezing", accessLevel: "staff_only" },
  { id: "al-003", personId: "EE-2024-0156", name: "Bilal Ahmed Qureshi", type: "student", allergen: "Penicillin", severity: "severe", reaction: "Rash, difficulty breathing", accessLevel: "clinical_staff" },
];

export const mockVaccinations: VaccinationRecord[] = [
  { id: "vac-001", personId: "CS-2022-0421", name: "Ahmed Hassan Siddiqui", type: "student", vaccine: "Hepatitis B", dose: "Booster", administeredAt: "2024-08-10", status: "completed", provider: "NED Campus Clinic" },
  { id: "vac-002", personId: "CS-2024-0088", name: "Syed Ali Raza", type: "student", vaccine: "Tetanus", dose: "Primary", dueDate: "2026-03-01", status: "due", provider: "NED Campus Clinic" },
  { id: "vac-003", personId: "ME-2023-0177", name: "Usama Farooq", type: "student", vaccine: "COVID-19", dose: "Annual booster", dueDate: "2026-01-15", status: "overdue" },
];

export const mockMedicalDocuments: MedicalDocument[] = [
  { id: "md-001", documentId: "DOC-MED-042", personId: "CS-2023-0112", name: "Fatima Zahra Ali", type: "report", title: "Pulmonologist Report — Asthma Management", uploadedAt: "2025-09-15", uploadedBy: "Parent Portal", accessLevel: "clinical_staff", fileSize: "1.2 MB" },
  { id: "md-002", documentId: "DOC-MED-038", personId: "EE-2024-0156", name: "Bilal Ahmed Qureshi", type: "prescription", title: "Endocrinologist Prescription — Insulin Regimen", uploadedAt: "2026-01-20", uploadedBy: "Dr. Farah Naz", accessLevel: "restricted", fileSize: "340 KB" },
  { id: "md-003", documentId: "DOC-MED-035", personId: "CE-2024-0021", name: "Ayesha Malik", type: "xray", title: "Ankle X-ray — Aga Khan Hospital", uploadedAt: "2026-02-17", uploadedBy: "Clinic Staff", accessLevel: "clinical_staff", fileSize: "2.8 MB" },
];

export const mockEmergencyContacts: EmergencyContact[] = [
  { id: "ec-001", personId: "CS-2022-0421", name: "Siddiqui Hassan", relation: "Father", phone: "+92-300-1234567", alternatePhone: "+92-21-34567890", address: "House 42, Block 5, Gulshan-e-Iqbal, Karachi", isPrimary: true },
  { id: "ec-002", personId: "CS-2023-0112", name: "Ali Raza", relation: "Father", phone: "+92-321-9876543", address: "Flat 12, PECHS Block 6, Karachi", isPrimary: true },
];

export const studentHealthSummary: StudentHealthSummary = {
  bloodGroup: "B+",
  allergies: [],
  lastVisit: "2026-01-22",
  vaccinationsDue: 0,
  emergencyContact: "Siddiqui Hassan (Father)",
  emergencyPhone: "+92-300-1234567",
};

export const parentHealthNotifications: ParentHealthNotification[] = [
  { id: "phn-001", childName: "Ahmed Hassan Siddiqui", type: "visit", title: "Clinic visit recorded", message: "Your child visited the campus clinic on 20 Feb 2026 for headache and fever. Treatment: Paracetamol prescribed.", sentAt: "2026-02-20 15:30", read: false },
  { id: "phn-002", childName: "Fatima Zahra Ali", type: "incident", title: "Medical incident — asthma episode", message: "Fatima experienced a mild asthma episode during PE. Treated at clinic. Please follow up with pulmonologist.", sentAt: "2026-02-18 12:00", read: true },
];

export function getMedicalProfile(id: string) {
  return mockMedicalProfiles.find((p) => p.id === id);
}

export function getClinicVisit(id: string) {
  return mockClinicVisits.find((v) => v.id === id);
}

export function getMedicalIncident(id: string) {
  return mockMedicalIncidents.find((i) => i.id === id);
}
