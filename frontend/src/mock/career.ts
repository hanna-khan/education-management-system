import type {
  CareerApplication,
  CareerCompany,
  CareerEvent,
  CareerFair,
  CareerInternship,
  CareerInterview,
  CareerJob,
  CareerPlacement,
  CareerStats,
  StudentCareerSummary,
} from "@/types/career";

export const CAREER_TABS = [
  { id: "dashboard", label: "Dashboard", href: "/career" },
  { id: "jobs", label: "Jobs", href: "/career/jobs" },
  { id: "internships", label: "Internships", href: "/career/internships" },
  { id: "companies", label: "Companies", href: "/career/companies" },
  { id: "applications", label: "Applications", href: "/career/applications" },
  { id: "interviews", label: "Interviews", href: "/career/interviews" },
  { id: "events", label: "Events", href: "/career/events" },
  { id: "placements", label: "Placements", href: "/career/placements" },
];

export const careerStats: CareerStats = {
  totalApplications: 486,
  activeInternships: 42,
  activeJobs: 28,
  upcomingInterviews: 18,
  offersExtended: 12,
  placementsThisYear: 156,
};

export const mockCompanies: CareerCompany[] = [
  { id: "co-001", name: "Systems Limited", industry: "IT Services", city: "Karachi", website: "https://www.systemsltd.com", contactPerson: "Ayesha Khan", contactEmail: "careers@systemsltd.com", activeOpportunities: 8, partnershipSince: "2018" },
  { id: "co-002", name: "Engro Corporation", industry: "Conglomerate", city: "Karachi", website: "https://www.engro.com", contactPerson: "Bilal Ahmed", contactEmail: "talent@engro.com", activeOpportunities: 5, partnershipSince: "2015" },
  { id: "co-003", name: "Jazz (Pakistan Mobile Communications)", industry: "Telecom", city: "Islamabad", website: "https://www.jazz.com.pk", contactPerson: "Sana Malik", contactEmail: "campus@jazz.com.pk", activeOpportunities: 6, partnershipSince: "2019" },
  { id: "co-004", name: "K-Electric", industry: "Power & Utilities", city: "Karachi", website: "https://www.ke.com.pk", contactPerson: "Hassan Raza", contactEmail: "hr@ke.com.pk", activeOpportunities: 4, partnershipSince: "2016" },
  { id: "co-005", name: "10Pearls", industry: "Software Development", city: "Karachi", website: "https://www.10pearls.com", contactPerson: "Zainab Sheikh", contactEmail: "careers@10pearls.com", activeOpportunities: 10, partnershipSince: "2020" },
];

export const mockJobs: CareerJob[] = [
  { id: "job-001", title: "Graduate Software Engineer", companyId: "co-001", companyName: "Systems Limited", type: "full_time", location: "Karachi", salaryRange: "PKR 80,000 – 120,000/month", deadline: "2026-03-15", status: "published", postedAt: "2026-02-01", applications: 48, skills: ["Java", "Spring Boot", "SQL"], description: "Entry-level software engineer for enterprise projects. BS CS/SE required." },
  { id: "job-002", title: "Electrical Engineer — Trainee", companyId: "co-004", companyName: "K-Electric", type: "full_time", location: "Karachi", salaryRange: "PKR 70,000 – 95,000/month", deadline: "2026-03-20", status: "published", postedAt: "2026-02-05", applications: 32, skills: ["Power Systems", "AutoCAD"], description: "Graduate trainee program for EE graduates." },
  { id: "job-003", title: "Data Analyst", companyId: "co-003", companyName: "Jazz (Pakistan Mobile Communications)", type: "full_time", location: "Islamabad", salaryRange: "PKR 90,000 – 130,000/month", deadline: "2026-03-10", status: "pending_approval", postedAt: "2026-02-18", applications: 0, skills: ["Python", "SQL", "Tableau"], description: "Analytics role — pending career office approval." },
];

export const mockInternships: CareerInternship[] = [
  { id: "int-001", title: "Software Development Intern", companyId: "co-005", companyName: "10Pearls", duration: "3 months", stipend: "PKR 35,000/month", location: "Karachi (Hybrid)", deadline: "2026-03-01", status: "published", postedAt: "2026-01-20", applications: 86, department: "Computer Science", description: "Summer internship — React/Node.js stack. Open to 6th semester and above." },
  { id: "int-002", title: "Mechanical Engineering Intern", companyId: "co-002", companyName: "Engro Corporation", duration: "2 months", stipend: "PKR 30,000/month", location: "Karachi", deadline: "2026-02-28", status: "published", postedAt: "2026-02-01", applications: 24, department: "Mechanical Engineering", description: "Plant operations internship at Engro Fertilizer." },
  { id: "int-003", title: "Network Engineering Intern", companyId: "co-003", companyName: "Jazz (Pakistan Mobile Communications)", duration: "3 months", stipend: "PKR 40,000/month", location: "Karachi", deadline: "2026-03-15", status: "published", postedAt: "2026-02-10", applications: 18, department: "Electrical Engineering", description: "Telecom network operations and maintenance." },
];

export const mockCareerApplications: CareerApplication[] = [
  { id: "ca-001", applicationId: "CAR-2026-0124", studentId: "CS-2022-0421", studentName: "Ahmed Hassan Siddiqui", program: "BS Computer Systems", opportunityType: "internship", opportunityTitle: "Software Development Intern", companyName: "10Pearls", appliedAt: "2026-02-05", status: "interview", cvUploaded: true },
  { id: "ca-002", applicationId: "CAR-2026-0118", studentId: "CS-2022-0421", studentName: "Ahmed Hassan Siddiqui", program: "BS Computer Systems", opportunityType: "job", opportunityTitle: "Graduate Software Engineer", companyName: "Systems Limited", appliedAt: "2026-02-10", status: "applied", cvUploaded: true },
  { id: "ca-003", applicationId: "CAR-2026-0096", studentId: "EE-2023-0245", studentName: "Sara Ahmed", program: "BS Electrical Engineering", opportunityType: "internship", opportunityTitle: "Network Engineering Intern", companyName: "Jazz (Pakistan Mobile Communications)", appliedAt: "2026-02-12", status: "shortlisted", cvUploaded: true },
  { id: "ca-004", applicationId: "CAR-2026-0088", studentId: "ME-2023-0177", studentName: "Usama Farooq", program: "BS Mechanical Engineering", opportunityType: "internship", opportunityTitle: "Mechanical Engineering Intern", companyName: "Engro Corporation", appliedAt: "2026-02-08", status: "rejected", cvUploaded: true },
];

export const mockInterviews: CareerInterview[] = [
  { id: "ci-001", applicationId: "ca-001", studentName: "Ahmed Hassan Siddiqui", companyName: "10Pearls", opportunityTitle: "Software Development Intern", scheduledAt: "2026-02-28 10:00", mode: "online", location: "Zoom — link sent via email", interviewer: "Zainab Sheikh (HR)", status: "scheduled" },
  { id: "ci-002", applicationId: "ca-003", studentName: "Sara Ahmed", companyName: "Jazz (Pakistan Mobile Communications)", opportunityTitle: "Network Engineering Intern", scheduledAt: "2026-03-02 14:00", mode: "in_person", location: "Jazz Campus, Islamabad", interviewer: "Campus Recruitment Team", status: "scheduled" },
];

export const mockCareerEvents: CareerEvent[] = [
  { id: "ce-001", title: "Resume Writing Workshop", type: "workshop", date: "2026-03-05", time: "14:00", venue: "NED Auditorium, Block A", organizer: "Career Development Centre", registrations: 86, capacity: 120, status: "upcoming" },
  { id: "ce-002", title: "Industry Speaker — Engro CEO", type: "seminar", date: "2026-03-12", time: "11:00", venue: "Main Auditorium", organizer: "Career Development Centre", registrations: 210, capacity: 300, status: "upcoming" },
  { id: "ce-003", title: "Mock Interview Day", type: "networking", date: "2026-02-15", time: "09:00", venue: "Career Centre, Block D", organizer: "Alumni Association", registrations: 45, capacity: 50, status: "completed" },
];

export const mockCareerFairs: CareerFair[] = [
  { id: "cf-001", name: "NED Annual Career Fair 2026", date: "2026-04-10", venue: "Sports Complex, NED Campus", companies: 42, expectedStudents: 1200, status: "planning" },
  { id: "cf-002", name: "Tech Industry Meet 2025", date: "2025-10-15", venue: "Block A Ground", companies: 28, expectedStudents: 800, status: "completed" },
];

export const mockPlacements: CareerPlacement[] = [
  { id: "pl-001", studentId: "CS-2021-0088", studentName: "Muhammad Ali Khan", program: "BS Computer Science", graduationYear: 2025, companyName: "Systems Limited", role: "Software Engineer", salary: "PKR 95,000/month", placedAt: "2025-08-01", status: "placed" },
  { id: "pl-002", studentId: "EE-2021-0042", studentName: "Fatima Noor", program: "BS Electrical Engineering", graduationYear: 2025, companyName: "K-Electric", role: "Graduate Engineer", salary: "PKR 85,000/month", placedAt: "2025-07-15", status: "placed" },
  { id: "pl-003", studentId: "CS-2022-0421", studentName: "Ahmed Hassan Siddiqui", program: "BS Computer Systems", graduationYear: 2026, companyName: "—", role: "—", salary: "—", placedAt: "—", status: "seeking" },
];

export const studentCareerSummary: StudentCareerSummary = {
  applications: 2,
  interviews: 1,
  offers: 0,
  cvUploaded: true,
  profileComplete: 85,
};

export function getCareerJob(id: string) {
  return mockJobs.find((j) => j.id === id);
}

export function getCareerInternship(id: string) {
  return mockInternships.find((i) => i.id === id);
}

export function getCareerApplication(id: string) {
  return mockCareerApplications.find((a) => a.id === id);
}
