import type {
  AlumniDirectoryEntry,
  AlumniDonation,
  AlumniEvent,
  AlumniProfile,
  AlumniStats,
  MentorshipRequest,
  StudentAlumniMentorshipSummary,
} from "@/types/alumni";

export const ALUMNI_TABS = [
  { id: "dashboard", label: "Dashboard", href: "/alumni" },
  { id: "directory", label: "Directory", href: "/alumni/directory" },
  { id: "profiles", label: "Profiles", href: "/alumni/profiles" },
  { id: "events", label: "Events", href: "/alumni/events" },
  { id: "mentorship", label: "Mentorship", href: "/alumni/mentorship" },
  { id: "donations", label: "Donations", href: "/alumni/donations" },
];

export const alumniStats: AlumniStats = {
  totalAlumni: 28400,
  activeProfiles: 8420,
  employedPct: 78,
  mentorshipRequests: 24,
  activeMentorships: 86,
  eventsThisYear: 8,
  donationsThisYear: 12500000,
};

export const mockAlumniProfiles: AlumniProfile[] = [
  { id: "al-001", alumniId: "ALM-2015-0421", name: "Dr. Imran Qureshi", email: "imran.qureshi@ned.edu.pk", phone: "+92-300-1112233", graduationYear: 2015, program: "BS Computer Systems", department: "Computer Systems", currentCompany: "NED University", currentRole: "Associate Professor", city: "Karachi", employmentStatus: "employed", linkedIn: "linkedin.com/in/imranqureshi", mentorshipAvailable: true },
  { id: "al-002", alumniId: "ALM-2018-0188", name: "Ayesha Khan", email: "ayesha.khan@systemsltd.com", phone: "+92-321-4445566", graduationYear: 2018, program: "BS Software Engineering", department: "Computer Science", currentCompany: "Systems Limited", currentRole: "Senior Software Architect", city: "Karachi", employmentStatus: "employed", mentorshipAvailable: true },
  { id: "al-003", alumniId: "ALM-2020-0094", name: "Hassan Raza Jaffery", email: "hassan.jaffery@engro.com", phone: "+92-333-7778899", graduationYear: 2020, program: "BS Mechanical Engineering", department: "Mechanical Engineering", currentCompany: "Engro Corporation", currentRole: "Plant Engineer", city: "Karachi", employmentStatus: "employed", mentorshipAvailable: false },
  { id: "al-004", alumniId: "ALM-2012-0033", name: "Fatima Zahra Siddiqui", email: "fatima.s@10pearls.com", phone: "+92-345-9990011", graduationYear: 2012, program: "BS Computer Science", department: "Computer Science", currentCompany: "10Pearls", currentRole: "VP Engineering", city: "Karachi", employmentStatus: "employed", mentorshipAvailable: true },
  { id: "al-005", alumniId: "ALM-2022-0156", name: "Bilal Ahmed", email: "bilal.ahmed@startup.pk", phone: "+92-300-5556677", graduationYear: 2022, program: "BS Electrical Engineering", department: "Electrical Engineering", currentCompany: "PowerTech Solutions (Self)", currentRole: "Founder & CEO", city: "Lahore", employmentStatus: "self_employed", mentorshipAvailable: true },
];

export const mockAlumniEvents: AlumniEvent[] = [
  { id: "ae-001", title: "NED Alumni Reunion 2026 — Golden Batch 2000", type: "reunion", date: "2026-04-18", venue: "Main Auditorium, NED Campus", city: "Karachi", registrations: 420, capacity: 600, status: "upcoming" },
  { id: "ae-002", title: "Alumni Networking Dinner — Tech Leaders", type: "networking", date: "2026-03-22", venue: "Pearl Continental Hotel, Karachi", city: "Karachi", registrations: 86, capacity: 100, status: "upcoming" },
  { id: "ae-003", title: "Alumni Mentorship Orientation", type: "workshop", date: "2026-02-01", venue: "Career Centre, Block D", city: "Karachi", registrations: 45, capacity: 50, status: "completed" },
  { id: "ae-004", title: "NED Endowment Fund Gala 2025", type: "fundraising", date: "2025-12-10", venue: "Marriott Hotel, Karachi", city: "Karachi", registrations: 280, capacity: 300, status: "completed" },
];

export const mockMentorshipRequests: MentorshipRequest[] = [
  { id: "mr-001", requestId: "MNT-2026-0024", studentId: "CS-2022-0421", studentName: "Ahmed Hassan Siddiqui", studentProgram: "BS Computer Systems", alumniId: "al-002", alumniName: "Ayesha Khan", topic: "Software engineering career path", message: "I am in my final year and interested in backend development. Would appreciate guidance on industry expectations and interview prep.", requestedAt: "2026-02-15", status: "accepted", response: "Happy to mentor you! Let's schedule a call next week.", respondedAt: "2026-02-16" },
  { id: "mr-002", requestId: "MNT-2026-0022", studentId: "EE-2023-0245", studentName: "Sara Ahmed", studentProgram: "BS Electrical Engineering", alumniId: "al-005", alumniName: "Bilal Ahmed", topic: "Entrepreneurship in power sector", message: "Interested in starting a solar solutions startup after graduation.", requestedAt: "2026-02-18", status: "pending" },
  { id: "mr-003", requestId: "MNT-2026-0018", studentId: "CS-2024-0088", studentName: "Syed Ali Raza", studentProgram: "BS Computer Science", alumniId: "al-004", alumniName: "Fatima Zahra Siddiqui", topic: "Leadership in tech", message: "Seeking mentorship on growing into a tech lead role.", requestedAt: "2026-02-10", status: "active" },
];

export const mockDonations: AlumniDonation[] = [
  { id: "dn-001", donationId: "DON-2026-008", alumniName: "Fatima Zahra Siddiqui", alumniId: "al-004", amount: 500000, purpose: "Computer Science Lab Equipment", donatedAt: "2026-01-20", status: "received", receiptNo: "NED-DON-2026-008" },
  { id: "dn-002", donationId: "DON-2026-006", alumniName: "Dr. Imran Qureshi", alumniId: "al-001", amount: 100000, purpose: "Student Scholarship Fund", donatedAt: "2026-02-01", status: "received", receiptNo: "NED-DON-2026-006" },
  { id: "dn-003", donationId: "DON-2026-004", alumniName: "Ayesha Khan", alumniId: "al-002", amount: 250000, purpose: "Library Digital Resources", donatedAt: "2026-02-15", status: "processing" },
];

export const mockDirectory: AlumniDirectoryEntry[] = mockAlumniProfiles.map((p) => ({
  id: p.id,
  name: p.name,
  graduationYear: p.graduationYear,
  program: p.program,
  company: p.currentCompany,
  role: p.currentRole,
  city: p.city,
  mentorshipAvailable: p.mentorshipAvailable,
}));

export const studentAlumniMentorshipSummary: StudentAlumniMentorshipSummary = {
  pendingRequests: 0,
  activeMentorships: 1,
  availableMentors: 42,
};

export function getAlumniProfile(id: string) {
  return mockAlumniProfiles.find((p) => p.id === id);
}

export function getMentorshipRequest(id: string) {
  return mockMentorshipRequests.find((r) => r.id === id);
}
