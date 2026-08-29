import type {
  ConvocationPass,
  FormCampaign,
  FormSubmission,
} from "@/types/forms";

export const FORMS_TABS = [
  { id: "dashboard", label: "Dashboard", href: "/forms" },
  { id: "campaigns", label: "Campaigns", href: "/forms/campaigns" },
  { id: "submissions", label: "Submissions", href: "/forms/submissions" },
  { id: "passes", label: "Passes", href: "/forms/passes" },
];

export const mockFormCampaigns: FormCampaign[] = [
  {
    id: "camp-conv-2026",
    code: "CONV-2026",
    title: "35th Convocation 2026 — Registration",
    category: "convocation",
    description:
      "Online registration for degree recipients. Upload required documents and two guest/guardian CNIC photos. Approved students receive a single ceremony pass covering both guests.",
    status: "open",
    opensAt: "2026-08-03",
    closesAt: "2026-09-05",
    institutionTypes: ["university"],
    issuesPass: true,
    passType: "convocation",
    submissionsCount: 1842,
    pendingCount: 126,
    fields: [
      { id: "degree", label: "Degree programme", type: "text", required: true, placeholder: "BE Computer Systems" },
      { id: "batch", label: "Batch / Session", type: "text", required: true, placeholder: "2022" },
      { id: "cgpa", label: "Final CGPA", type: "text", required: true },
      { id: "guest1_name", label: "Guest 1 — Full name", type: "text", required: true },
      { id: "guest1_cnic", label: "Guest 1 — CNIC", type: "cnic", required: true, placeholder: "42101-1234567-1" },
      { id: "guest1_relation", label: "Guest 1 — Relationship", type: "select", required: true, options: ["Father", "Mother", "Guardian", "Sibling", "Spouse"] },
      { id: "guest2_name", label: "Guest 2 — Full name", type: "text", required: true },
      { id: "guest2_cnic", label: "Guest 2 — CNIC", type: "cnic", required: true },
      { id: "guest2_relation", label: "Guest 2 — Relationship", type: "select", required: true, options: ["Father", "Mother", "Guardian", "Sibling", "Spouse"] },
    ],
    documents: [
      {
        id: "doc-photo",
        label: "Student passport photo",
        description: "Recent colour photo, white background",
        required: true,
        accept: "image/*",
        validationHints: ["Face must be clearly visible", "No group photos"],
      },
      {
        id: "doc-guest1-cnic",
        label: "Guest 1 CNIC (front)",
        description: "Clear scan or photo of CNIC front",
        required: true,
        accept: "image/*,.pdf",
        validationHints: ["All corners visible", "Text readable"],
      },
      {
        id: "doc-guest2-cnic",
        label: "Guest 2 CNIC (front)",
        description: "Clear scan or photo of CNIC front",
        required: true,
        accept: "image/*,.pdf",
      },
      {
        id: "doc-clearance",
        label: "No-dues / clearance slip",
        description: "Signed clearance from library, hostel, finance",
        required: true,
        accept: ".pdf,image/*",
      },
    ],
    approvalSteps: [
      { id: "step-validate", label: "Document validation", role: "Registrar Office" },
      { id: "step-registrar", label: "Registrar approval", role: "Registrar" },
      { id: "step-pass", label: "Pass issuance", role: "System" },
    ],
  },
  {
    id: "camp-degree",
    code: "DEG-ISSUE",
    title: "Degree / Transcript Issuance",
    category: "degree",
    description: "Request original degree or official transcript with supporting documents.",
    status: "open",
    opensAt: "2026-01-01",
    closesAt: "2026-12-31",
    institutionTypes: ["university"],
    submissionsCount: 412,
    pendingCount: 38,
    fields: [
      { id: "doc_type", label: "Document type", type: "select", required: true, options: ["Original Degree", "Transcript", "Provisional Certificate"] },
      { id: "copies", label: "Number of copies", type: "text", required: true },
      { id: "purpose", label: "Purpose", type: "textarea", required: true },
    ],
    documents: [
      { id: "doc-cnic", label: "CNIC copy", description: "Student CNIC", required: true, accept: "image/*,.pdf" },
      { id: "doc-fee", label: "Fee challan", description: "Paid challan receipt", required: true, accept: "image/*,.pdf" },
    ],
    approvalSteps: [
      { id: "step-exam", label: "Examination desk", role: "Controller of Examinations" },
      { id: "step-reg", label: "Registrar", role: "Registrar" },
    ],
  },
  {
    id: "camp-bus-monthly",
    code: "BUS-MONTH",
    title: "University Transport — Monthly Pass",
    category: "transport",
    description: "Apply for monthly NED shuttle / van transport. Fee payment then transport ID issued.",
    status: "open",
    opensAt: "2026-08-01",
    closesAt: "2026-08-31",
    institutionTypes: ["university", "school"],
    issuesPass: true,
    passType: "transport_monthly",
    submissionsCount: 268,
    pendingCount: 22,
    fields: [
      { id: "route", label: "Preferred route", type: "select", required: true, options: ["Gulshan — Campus", "North Nazimabad — Campus", "Malir — Campus", "Clifton — Campus"] },
      { id: "stop", label: "Pickup stop", type: "text", required: true },
      { id: "term", label: "Month", type: "select", required: true, options: ["September 2026", "October 2026", "November 2026"] },
    ],
    documents: [
      { id: "doc-student-id", label: "Student ID card", description: "Valid university ID", required: true, accept: "image/*" },
      { id: "doc-fee", label: "Transport fee challan", description: "Paid monthly fee", required: true, accept: "image/*,.pdf" },
    ],
    approvalSteps: [
      { id: "step-transport", label: "Transport office", role: "Transport Manager" },
    ],
  },
  {
    id: "camp-dup-id",
    code: "ID-DUP",
    title: "Duplicate Student Identity Card",
    category: "other",
    description: "Request a replacement student ID card.",
    status: "open",
    opensAt: "2026-01-01",
    closesAt: "2026-12-31",
    institutionTypes: ["university", "school"],
    submissionsCount: 54,
    pendingCount: 7,
    fields: [
      { id: "reason", label: "Reason", type: "select", required: true, options: ["Lost", "Damaged", "Stolen", "Data correction"] },
      { id: "fir", label: "FIR / affidavit number (if lost)", type: "text", required: false },
    ],
    documents: [
      { id: "doc-cnic", label: "CNIC copy", description: "Student CNIC", required: true, accept: "image/*,.pdf" },
      { id: "doc-photo", label: "Passport photo", description: "Recent photo", required: true, accept: "image/*" },
      { id: "doc-fee", label: "Duplicate fee challan", description: "Paid fee receipt", required: true, accept: "image/*,.pdf" },
    ],
    approvalSteps: [
      { id: "step-reg", label: "Registrar / Admin", role: "Registrar" },
    ],
  },
];

export const mockFormSubmissions: FormSubmission[] = [
  {
    id: "sub-001",
    campaignId: "camp-conv-2026",
    campaignTitle: "35th Convocation 2026 — Registration",
    studentId: "CS-2022-0421",
    studentName: "Ahmed Khan",
    program: "BE Computer Systems",
    status: "approved",
    submittedAt: "2026-08-12 11:20",
    currentStep: "Pass issued",
    fieldValues: {
      degree: "BE Computer Systems",
      batch: "2022",
      cgpa: "3.41",
      guest1_name: "Muhammad Khan",
      guest1_cnic: "42101-9988776-5",
      guest1_relation: "Father",
      guest2_name: "Fatima Khan",
      guest2_cnic: "42101-5544332-2",
      guest2_relation: "Mother",
    },
    documents: [
      { documentId: "doc-photo", fileName: "ahmed-photo.jpg", status: "ok" },
      { documentId: "doc-guest1-cnic", fileName: "father-cnic.jpg", status: "ok" },
      { documentId: "doc-guest2-cnic", fileName: "mother-cnic.jpg", status: "ok" },
      { documentId: "doc-clearance", fileName: "clearance.pdf", status: "ok" },
    ],
    guests: [
      { name: "Muhammad Khan", cnic: "42101-9988776-5", relationship: "Father", photoStatus: "ok" },
      { name: "Fatima Khan", cnic: "42101-5544332-2", relationship: "Mother", photoStatus: "ok" },
    ],
    validationErrors: [],
    passId: "pass-conv-001",
  },
  {
    id: "sub-002",
    campaignId: "camp-conv-2026",
    campaignTitle: "35th Convocation 2026 — Registration",
    studentId: "EE-2023-0188",
    studentName: "Hira Ali",
    program: "BE Electrical Engineering",
    status: "needs_correction",
    submittedAt: "2026-08-18 09:45",
    currentStep: "Document validation",
    fieldValues: {
      degree: "BE Electrical Engineering",
      batch: "2023",
      cgpa: "3.18",
      guest1_name: "Ali Raza",
      guest1_cnic: "42201-1122334-1",
      guest1_relation: "Father",
      guest2_name: "Saima Ali",
      guest2_cnic: "",
      guest2_relation: "Mother",
    },
    documents: [
      { documentId: "doc-photo", fileName: "hira.jpg", status: "ok" },
      { documentId: "doc-guest1-cnic", fileName: "guest1.jpg", status: "ok" },
      { documentId: "doc-guest2-cnic", fileName: "guest2-blur.jpg", status: "unclear", note: "Image too blurry — CNIC number not readable" },
      { documentId: "doc-clearance", fileName: "", status: "missing", note: "Clearance slip not uploaded" },
    ],
    guests: [
      { name: "Ali Raza", cnic: "42201-1122334-1", relationship: "Father", photoStatus: "ok" },
      { name: "Saima Ali", cnic: "", relationship: "Mother", photoStatus: "unclear" },
    ],
    validationErrors: [
      "Guest 2 CNIC number is missing",
      "Guest 2 CNIC image is unclear",
      "No-dues / clearance slip is required",
    ],
    reviewerNote: "Please re-upload a clear Guest 2 CNIC and attach clearance before resubmitting.",
  },
  {
    id: "sub-003",
    campaignId: "camp-degree",
    campaignTitle: "Degree / Transcript Issuance",
    studentId: "CE-2021-0092",
    studentName: "Bilal Hussain",
    program: "BE Civil Engineering",
    status: "under_review",
    submittedAt: "2026-08-20 14:02",
    currentStep: "Examination desk",
    fieldValues: {
      doc_type: "Original Degree",
      copies: "1",
      purpose: "Job joining — multinational",
    },
    documents: [
      { documentId: "doc-cnic", fileName: "cnic.pdf", status: "ok" },
      { documentId: "doc-fee", fileName: "challan.pdf", status: "ok" },
    ],
    validationErrors: [],
  },
  {
    id: "sub-004",
    campaignId: "camp-bus-monthly",
    campaignTitle: "University Transport — Monthly Pass",
    studentId: "CS-2022-0421",
    studentName: "Ahmed Khan",
    program: "BE Computer Systems",
    status: "submitted",
    submittedAt: "2026-08-22 08:15",
    currentStep: "Transport office",
    fieldValues: {
      route: "Gulshan — Campus",
      stop: "NIPA Chowrangi",
      term: "September 2026",
    },
    documents: [
      { documentId: "doc-student-id", fileName: "id.jpg", status: "ok" },
      { documentId: "doc-fee", fileName: "transport-fee.pdf", status: "ok" },
    ],
    validationErrors: [],
  },
];

export const mockConvocationPasses: ConvocationPass[] = [
  {
    id: "pass-conv-001",
    submissionId: "sub-001",
    passCode: "NED-CONV-2026-08421",
    qrCode: "QR-CONV-08421-AHMED",
    studentName: "Ahmed Khan",
    studentId: "CS-2022-0421",
    program: "BE Computer Systems",
    ceremonyDate: "2026-09-12",
    venue: "NED Main Campus — Convocation Ground",
    seat: "Block B · Row 12 · Seat 08",
    guests: [
      { name: "Muhammad Khan", cnic: "42101-9988776-5", relationship: "Father", photoStatus: "ok" },
      { name: "Fatima Khan", cnic: "42101-5544332-2", relationship: "Mother", photoStatus: "ok" },
    ],
    issuedAt: "2026-08-15 16:40",
    status: "active",
  },
];

export const formStats = {
  openCampaigns: mockFormCampaigns.filter((c) => c.status === "open").length,
  totalSubmissions: mockFormSubmissions.length + 2560,
  pendingReview: mockFormSubmissions.filter((s) =>
    ["submitted", "under_review", "needs_correction"].includes(s.status),
  ).length + 180,
  passesIssued: mockConvocationPasses.length + 920,
};

export function getFormCampaign(id: string) {
  return mockFormCampaigns.find((c) => c.id === id);
}

export function getFormSubmission(id: string) {
  return mockFormSubmissions.find((s) => s.id === id);
}

export function getConvocationPass(id: string) {
  return mockConvocationPasses.find((p) => p.id === id || p.passCode === id);
}

export function getPassBySubmission(submissionId: string) {
  return mockConvocationPasses.find((p) => p.submissionId === submissionId);
}
