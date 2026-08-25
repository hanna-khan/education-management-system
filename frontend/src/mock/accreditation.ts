import type {
  AccreditedProgram,
  AccreditationAudit,
  AccreditationBody,
  AccreditationCycle,
  AccreditationDocument,
  AccreditationEvidence,
  AccreditationFinding,
  AccreditationRequirement,
  AccreditationStandard,
  AccreditationStats,
  CorrectiveAction,
} from "@/types/accreditation";

export const ACCREDITATION_TABS = [
  { id: "dashboard", label: "Dashboard", href: "/accreditation" },
  { id: "bodies", label: "Bodies", href: "/accreditation/bodies" },
  { id: "programs", label: "Programs", href: "/accreditation/programs" },
  { id: "requirements", label: "Requirements", href: "/accreditation/requirements" },
  { id: "standards", label: "Standards", href: "/accreditation/standards" },
  { id: "evidence", label: "Evidence", href: "/accreditation/evidence" },
  { id: "documents", label: "Documents", href: "/accreditation/documents" },
  { id: "cycles", label: "Review Cycles", href: "/accreditation/cycles" },
  { id: "audits", label: "Audits", href: "/accreditation/audits" },
  { id: "findings", label: "Findings", href: "/accreditation/findings" },
  { id: "corrective-actions", label: "Corrective Actions", href: "/accreditation/corrective-actions" },
];

export const ACCREDITATION_TIMELINE = [
  "Preparation",
  "Submission",
  "Review",
  "Visit",
  "Findings",
  "Corrective Action",
  "Approved",
];

export const accreditationStats: AccreditationStats = {
  accreditedPrograms: 18,
  activeCycles: 5,
  pendingRequirements: 23,
  openFindings: 8,
  overdueActions: 3,
  evidenceDocuments: 156,
  upcomingVisits: 2,
};

export const mockAccreditationBodies: AccreditationBody[] = [
  { id: "ab-001", code: "PEC", name: "Pakistan Engineering Council", country: "Pakistan", website: "www.pec.org.pk", contactPerson: "Engr. Tariq Mahmood", programsCovered: 12, status: "active" },
  { id: "ab-002", code: "HEC", name: "Higher Education Commission", country: "Pakistan", website: "www.hec.gov.pk", contactPerson: "Dr. Faisal Mehmood", programsCovered: 18, status: "active" },
  { id: "ab-003", code: "NCEAC", name: "National Computing Education Accreditation Council", country: "Pakistan", website: "www.nceac.org.pk", contactPerson: "Dr. Shahid Hassan", programsCovered: 4, status: "active" },
  { id: "ab-004", code: "NBA", name: "National Business Accreditation", country: "Pakistan", website: "www.nba.org.pk", contactPerson: "Dr. Rubina Ali", programsCovered: 2, status: "active" },
];

export const mockAccreditedPrograms: AccreditedProgram[] = [
  { id: "ap-001", programCode: "BS-EE", programName: "BS Electrical Engineering", department: "Electrical Engineering", body: "PEC", accreditationLevel: "Level II", validUntil: "2028-06-30", status: "accredited" },
  { id: "ap-002", programCode: "BS-CE", programName: "BS Civil Engineering", department: "Civil Engineering", body: "PEC", accreditationLevel: "Level II", validUntil: "2027-12-31", status: "accredited" },
  { id: "ap-003", programCode: "BS-CS", programName: "BS Computer Science", department: "Computer & Info Systems", body: "NCEAC", accreditationLevel: "Full", validUntil: "2029-03-15", status: "accredited" },
  { id: "ap-004", programCode: "BS-ME", programName: "BS Mechanical Engineering", department: "Mechanical Engineering", body: "PEC", accreditationLevel: "Level I", validUntil: "2026-08-31", status: "in_review" },
  { id: "ap-005", programCode: "MBA", programName: "MBA Executive", department: "Management Sciences", body: "NBA", accreditationLevel: "Provisional", validUntil: "2026-12-31", status: "provisional" },
];

export const mockAccreditationStandards: AccreditationStandard[] = [
  { id: "std-001", code: "PEC-1", title: "Program Educational Objectives", body: "PEC", category: "Curriculum", description: "PEOs aligned with industry and societal needs", requirementsCount: 8 },
  { id: "std-002", code: "PEC-2", title: "Student Outcomes", body: "PEC", category: "Outcomes", description: "ABET-style student outcomes assessment", requirementsCount: 12 },
  { id: "std-003", code: "HEC-QA-1", title: "Quality Assurance Framework", body: "HEC", category: "Governance", description: "Institutional QA policies and procedures", requirementsCount: 15 },
  { id: "std-004", code: "NCEAC-1", title: "Computing Curriculum", body: "NCEAC", category: "Curriculum", description: "Core computing topics and electives", requirementsCount: 10 },
  { id: "std-005", code: "PEC-3", title: "Faculty Qualifications", body: "PEC", category: "Faculty", description: "Faculty credentials and development", requirementsCount: 6 },
];

export const mockAccreditationRequirements: AccreditationRequirement[] = [
  { id: "req-001", reqId: "REQ-PEC-001", standard: "PEC-1", title: "Documented PEOs with stakeholder input", body: "PEC", program: "BS Electrical Engineering", mandatory: true, status: "met", evidenceCount: 3 },
  { id: "req-002", reqId: "REQ-PEC-002", standard: "PEC-2", title: "SO assessment plan with rubrics", body: "PEC", program: "BS Civil Engineering", mandatory: true, status: "partial", evidenceCount: 2 },
  { id: "req-003", reqId: "REQ-HEC-001", standard: "HEC-QA-1", title: "QEC charter and meeting records", body: "HEC", program: "Institution-wide", mandatory: true, status: "met", evidenceCount: 5 },
  { id: "req-004", reqId: "REQ-NCEAC-001", standard: "NCEAC-1", title: "Capstone project guidelines", body: "NCEAC", program: "BS Computer Science", mandatory: true, status: "met", evidenceCount: 4 },
  { id: "req-005", reqId: "REQ-PEC-003", standard: "PEC-3", title: "Faculty CVs with qualifications", body: "PEC", program: "BS Mechanical Engineering", mandatory: true, status: "not_met", evidenceCount: 1 },
  { id: "req-006", reqId: "REQ-PEC-004", standard: "PEC-2", title: "Continuous improvement loop documented", body: "PEC", program: "BS Mechanical Engineering", mandatory: true, status: "pending", evidenceCount: 0 },
];

export const mockAccreditationEvidence: AccreditationEvidence[] = [
  { id: "ae-001", evidenceId: "AE-2026-001", title: "EE PEO Stakeholder Survey 2025", standard: "PEC-1", program: "BS Electrical Engineering", uploadedBy: "Prof. Saima Rizvi", uploadedAt: "2026-01-10", verified: true },
  { id: "ae-002", evidenceId: "AE-2026-002", title: "CS Capstone Project Rubric", standard: "NCEAC-1", program: "BS Computer Science", uploadedBy: "Dr. Farhan Ahmed", uploadedAt: "2026-02-05", verified: true },
  { id: "ae-003", evidenceId: "AE-2026-003", title: "QEC Annual Report 2025", standard: "HEC-QA-1", program: "Institution-wide", uploadedBy: "Dr. Samina Khursheed", uploadedAt: "2026-01-20", verified: false },
  { id: "ae-004", evidenceId: "AE-2026-004", title: "ME Faculty Qualification Matrix", standard: "PEC-3", program: "BS Mechanical Engineering", uploadedBy: "Engr. Bilal Sheikh", uploadedAt: "2026-02-18", verified: false },
];

export const mockAccreditationDocuments: AccreditationDocument[] = [
  { id: "doc-001", docId: "SAR-EE-2026", title: "Self-Assessment Report — EE", type: "sar", program: "BS Electrical Engineering", version: "2.1", updatedAt: "2026-02-15", status: "approved" },
  { id: "doc-002", docId: "SSR-CS-2025", title: "Self-Study Report — CS", type: "ssr", program: "BS Computer Science", version: "1.0", updatedAt: "2025-11-30", status: "submitted" },
  { id: "doc-003", docId: "POL-QA-001", title: "Quality Assurance Policy", type: "policy", program: "Institution-wide", version: "3.0", updatedAt: "2025-09-01", status: "approved" },
  { id: "doc-004", docId: "CHK-ME-2026", title: "PEC Visit Checklist — ME", type: "checklist", program: "BS Mechanical Engineering", version: "1.2", updatedAt: "2026-02-20", status: "draft" },
];

export const mockAccreditationCycles: AccreditationCycle[] = [
  { id: "cyc-001", cycleId: "CYC-ME-2026", program: "BS Mechanical Engineering", body: "PEC", stage: "preparation", startDate: "2025-09-01", coordinator: "Engr. Bilal Sheikh", progress: 35 },
  { id: "cyc-002", cycleId: "CYC-EE-2025", program: "BS Electrical Engineering", body: "PEC", stage: "review", startDate: "2025-03-01", visitDate: "2026-04-15", coordinator: "Prof. Saima Rizvi", progress: 70 },
  { id: "cyc-003", cycleId: "CYC-CS-2024", program: "BS Computer Science", body: "NCEAC", stage: "approved", startDate: "2024-01-01", visitDate: "2025-06-10", coordinator: "Dr. Farhan Ahmed", progress: 100 },
  { id: "cyc-004", cycleId: "CYC-CE-2025", program: "BS Civil Engineering", body: "PEC", stage: "findings", startDate: "2025-06-01", visitDate: "2026-01-20", coordinator: "Dr. Kamran Hashmi", progress: 85 },
  { id: "cyc-005", cycleId: "CYC-MBA-2026", program: "MBA Executive", body: "NBA", stage: "submission", startDate: "2025-12-01", coordinator: "Dr. Ayesha Malik", progress: 50 },
];

export const mockAccreditationAudits: AccreditationAudit[] = [
  { id: "aud-001", auditId: "AUD-2026-001", program: "BS Electrical Engineering", body: "PEC", auditType: "external", scheduledDate: "2026-04-15", auditor: "PEC Visit Team", status: "scheduled" },
  { id: "aud-002", auditId: "AUD-2026-002", program: "BS Civil Engineering", body: "PEC", auditType: "external", scheduledDate: "2026-01-20", auditor: "PEC Visit Team", status: "completed" },
  { id: "aud-003", auditId: "AUD-2026-003", program: "BS Mechanical Engineering", body: "PEC", auditType: "internal", scheduledDate: "2026-03-01", auditor: "QEC Internal Team", status: "in_progress" },
  { id: "aud-004", auditId: "AUD-2025-012", program: "Institution-wide", body: "HEC", auditType: "desk_review", scheduledDate: "2025-11-15", auditor: "HEC QA Division", status: "completed" },
];

export const mockAccreditationFindings: AccreditationFinding[] = [
  { id: "fnd-001", findingId: "FND-2026-001", auditId: "AUD-2026-002", standard: "PEC-2", description: "Student outcome assessment rubrics incomplete for 2 courses", severity: "major", program: "BS Civil Engineering", dueDate: "2026-04-30", status: "open" },
  { id: "fnd-002", findingId: "FND-2026-002", auditId: "AUD-2026-002", standard: "PEC-3", description: "Two adjunct faculty lack documented industry experience", severity: "minor", program: "BS Civil Engineering", dueDate: "2026-05-15", status: "addressed" },
  { id: "fnd-003", findingId: "FND-2026-003", auditId: "AUD-2026-003", standard: "PEC-1", description: "PEO review cycle exceeds recommended 3-year interval", severity: "minor", program: "BS Mechanical Engineering", dueDate: "2026-06-01", status: "open" },
  { id: "fnd-004", findingId: "FND-2025-008", auditId: "AUD-2025-012", standard: "HEC-QA-1", description: "QEC meeting quorum not met in 2 of 4 meetings", severity: "major", program: "Institution-wide", dueDate: "2026-03-31", status: "open" },
];

export const mockCorrectiveActions: CorrectiveAction[] = [
  { id: "ca-001", actionId: "CA-2026-001", findingId: "FND-2026-001", title: "Complete SO rubrics for CE-301 and CE-405", owner: "Dr. Omar Siddiqui", department: "Civil Engineering", dueDate: "2026-04-15", status: "in_progress", progress: 50 },
  { id: "ca-002", actionId: "CA-2026-002", findingId: "FND-2026-002", title: "Obtain industry experience letters for adjunct faculty", owner: "HR Office", department: "HR", dueDate: "2026-05-01", status: "open", progress: 20 },
  { id: "ca-003", actionId: "CA-2026-003", findingId: "FND-2025-008", title: "Revise QEC quorum policy and notify members", owner: "Dr. Samina Khursheed", department: "QEC", dueDate: "2026-03-15", status: "in_progress", progress: 75 },
  { id: "ca-004", actionId: "CA-2025-015", findingId: "FND-2025-005", title: "Update lab equipment inventory for EE power lab", owner: "Prof. Nadia Khan", department: "Electrical Engineering", dueDate: "2026-01-31", status: "closed", progress: 100 },
];

export function getAccreditationCycle(id: string) {
  return mockAccreditationCycles.find((c) => c.id === id) ?? null;
}
