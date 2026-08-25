import type {
  Hostel,
  HostelAllocation,
  HostelApplication,
  HostelBed,
  HostelBuilding,
  HostelComplaint,
  HostelFee,
  HostelFloor,
  HostelMaintenance,
  HostelRoom,
  HostelStats,
  HostelStudent,
  HostelWaitingEntry,
  StudentHostelSummary,
} from "@/types/hostel";

export const HOSTEL_TABS = [
  { id: "dashboard", label: "Dashboard", href: "/hostel" },
  { id: "hostels", label: "Hostels", href: "/hostel/hostels" },
  { id: "buildings", label: "Buildings", href: "/hostel/buildings" },
  { id: "floors", label: "Floors", href: "/hostel/floors" },
  { id: "rooms", label: "Rooms", href: "/hostel/rooms" },
  { id: "beds", label: "Beds", href: "/hostel/beds" },
  { id: "students", label: "Students", href: "/hostel/students" },
  { id: "applications", label: "Applications", href: "/hostel/applications" },
  { id: "allocations", label: "Allocations", href: "/hostel/allocations" },
  { id: "waiting-list", label: "Waiting List", href: "/hostel/waiting-list" },
  { id: "fees", label: "Fees", href: "/hostel/fees" },
  { id: "complaints", label: "Complaints", href: "/hostel/complaints" },
  { id: "maintenance", label: "Maintenance", href: "/hostel/maintenance" },
  { id: "settings", label: "Settings", href: "/hostel/settings" },
];

export const hostelStats: HostelStats = {
  totalHostels: 4,
  totalRooms: 486,
  totalBeds: 1240,
  occupiedBeds: 1086,
  availableBeds: 154,
  pendingApplications: 38,
  hostelFeesOutstanding: 2840000,
};

export const mockHostels: Hostel[] = [
  { id: "hst-001", name: "Quaid-e-Azam Boys Hostel", code: "QABH", gender: "male", warden: "Dr. Asif Raza", phone: "+92-21-99261234", address: "NED University Campus, University Road, Karachi", buildings: 2, rooms: 186, beds: 520, occupied: 468, status: "active" },
  { id: "hst-002", name: "Fatima Jinnah Girls Hostel", code: "FJGH", gender: "female", warden: "Prof. Samina Khursheed", phone: "+92-21-99261235", address: "NED University Campus, Gulistan-e-Johar Block, Karachi", buildings: 2, rooms: 164, beds: 380, occupied: 362, status: "active" },
  { id: "hst-003", name: "Engineering Tower Hostel", code: "ETH", gender: "male", warden: "Engr. Tariq Mehmood", phone: "+92-21-99261236", address: "NED University Campus, Block B, Karachi", buildings: 1, rooms: 96, beds: 240, occupied: 198, status: "active" },
  { id: "hst-004", name: "Graduate Research Hostel", code: "GRH", gender: "mixed", warden: "Dr. Hina Abbas", phone: "+92-21-99261237", address: "NED University Campus, Research Block, Karachi", buildings: 1, rooms: 40, beds: 100, occupied: 58, status: "maintenance" },
];

export const mockBuildings: HostelBuilding[] = [
  { id: "bld-001", hostelId: "hst-001", hostelName: "Quaid-e-Azam Boys Hostel", name: "Block A", code: "QABH-A", floors: 4, rooms: 96, beds: 260, occupied: 238 },
  { id: "bld-002", hostelId: "hst-001", hostelName: "Quaid-e-Azam Boys Hostel", name: "Block B", code: "QABH-B", floors: 4, rooms: 90, beds: 260, occupied: 230 },
  { id: "bld-003", hostelId: "hst-002", hostelName: "Fatima Jinnah Girls Hostel", name: "Main Block", code: "FJGH-M", floors: 5, rooms: 164, beds: 380, occupied: 362 },
  { id: "bld-004", hostelId: "hst-003", hostelName: "Engineering Tower Hostel", name: "Tower", code: "ETH-T", floors: 6, rooms: 96, beds: 240, occupied: 198 },
];

export const mockFloors: HostelFloor[] = [
  { id: "flr-001", buildingId: "bld-001", buildingName: "Block A", hostelName: "Quaid-e-Azam Boys Hostel", floorNumber: 1, rooms: 24, beds: 64, occupied: 60 },
  { id: "flr-002", buildingId: "bld-001", buildingName: "Block A", hostelName: "Quaid-e-Azam Boys Hostel", floorNumber: 2, rooms: 24, beds: 66, occupied: 62 },
  { id: "flr-003", buildingId: "bld-003", buildingName: "Main Block", hostelName: "Fatima Jinnah Girls Hostel", floorNumber: 3, rooms: 32, beds: 76, occupied: 74 },
  { id: "flr-004", buildingId: "bld-004", buildingName: "Tower", hostelName: "Engineering Tower Hostel", floorNumber: 4, rooms: 16, beds: 40, occupied: 38 },
];

export const mockRooms: HostelRoom[] = [
  { id: "rm-001", roomNumber: "A-101", buildingId: "bld-001", buildingName: "Block A", floorId: "flr-001", floorNumber: 1, hostelName: "Quaid-e-Azam Boys Hostel", type: "triple", capacity: 3, occupied: 3, status: "full", monthlyFee: 18500 },
  { id: "rm-002", roomNumber: "A-102", buildingId: "bld-001", buildingName: "Block A", floorId: "flr-001", floorNumber: 1, hostelName: "Quaid-e-Azam Boys Hostel", type: "triple", capacity: 3, occupied: 2, status: "available", monthlyFee: 18500 },
  { id: "rm-003", roomNumber: "FJ-301", buildingId: "bld-003", buildingName: "Main Block", floorId: "flr-003", floorNumber: 3, hostelName: "Fatima Jinnah Girls Hostel", type: "double", capacity: 2, occupied: 2, status: "full", monthlyFee: 22000 },
  { id: "rm-004", roomNumber: "ET-402", buildingId: "bld-004", buildingName: "Tower", floorId: "flr-004", floorNumber: 4, hostelName: "Engineering Tower Hostel", type: "quad", capacity: 4, occupied: 3, status: "available", monthlyFee: 16000 },
  { id: "rm-005", roomNumber: "A-205", buildingId: "bld-001", buildingName: "Block A", floorId: "flr-002", floorNumber: 2, hostelName: "Quaid-e-Azam Boys Hostel", type: "triple", capacity: 3, occupied: 0, status: "maintenance", monthlyFee: 18500 },
];

export const mockBeds: HostelBed[] = [
  { id: "bd-001", bedNumber: "A-101-B1", roomId: "rm-001", roomNumber: "A-101", buildingName: "Block A", hostelName: "Quaid-e-Azam Boys Hostel", status: "occupied", studentId: "CS-2022-0421", studentName: "Ahmed Hassan Siddiqui" },
  { id: "bd-002", bedNumber: "A-101-B2", roomId: "rm-001", roomNumber: "A-101", buildingName: "Block A", hostelName: "Quaid-e-Azam Boys Hostel", status: "occupied", studentId: "EE-2022-0188", studentName: "Muhammad Usman Khan" },
  { id: "bd-003", bedNumber: "A-102-B1", roomId: "rm-002", roomNumber: "A-102", buildingName: "Block A", hostelName: "Quaid-e-Azam Boys Hostel", status: "available" },
  { id: "bd-004", bedNumber: "FJ-301-B1", roomId: "rm-003", roomNumber: "FJ-301", buildingName: "Main Block", hostelName: "Fatima Jinnah Girls Hostel", status: "occupied", studentId: "CS-2023-0112", studentName: "Fatima Zahra Ali" },
  { id: "bd-005", bedNumber: "ET-402-B3", roomId: "rm-004", roomNumber: "ET-402", buildingName: "Tower", hostelName: "Engineering Tower Hostel", status: "reserved" },
];

export const mockHostelStudents: HostelStudent[] = [
  { id: "hs-001", studentId: "CS-2022-0421", name: "Ahmed Hassan Siddiqui", program: "BS Computer Systems", semester: 7, hostelName: "Quaid-e-Azam Boys Hostel", roomNumber: "A-101", bedNumber: "A-101-B1", checkIn: "2024-08-15", status: "active" },
  { id: "hs-002", studentId: "EE-2022-0188", name: "Muhammad Usman Khan", program: "BS Electrical Engineering", semester: 7, hostelName: "Quaid-e-Azam Boys Hostel", roomNumber: "A-101", bedNumber: "A-101-B2", checkIn: "2024-08-15", status: "active" },
  { id: "hs-003", studentId: "CS-2023-0112", name: "Fatima Zahra Ali", program: "BS Computer Science", semester: 5, hostelName: "Fatima Jinnah Girls Hostel", roomNumber: "FJ-301", bedNumber: "FJ-301-B1", checkIn: "2025-01-10", status: "active" },
  { id: "hs-004", studentId: "ME-2021-0094", name: "Hassan Raza Jaffery", program: "BS Mechanical Engineering", semester: 9, hostelName: "Engineering Tower Hostel", roomNumber: "ET-402", bedNumber: "ET-402-B1", checkIn: "2023-08-20", status: "active" },
];

export const mockApplications: HostelApplication[] = [
  { id: "app-001", applicationId: "HST-2026-0042", studentId: "CS-2024-0088", studentName: "Syed Ali Raza", program: "BS Computer Science", semester: 3, preferredHostel: "Quaid-e-Azam Boys Hostel", reason: "Residing outside Karachi; daily commute not feasible", submittedAt: "2026-02-18", status: "pending", guardianPhone: "+92-300-1234567", city: "Hyderabad" },
  { id: "app-002", applicationId: "HST-2026-0039", studentId: "CE-2024-0021", studentName: "Ayesha Malik", program: "BS Civil Engineering", semester: 3, preferredHostel: "Fatima Jinnah Girls Hostel", reason: "Safety and proximity to campus for evening labs", submittedAt: "2026-02-15", status: "under_review", guardianPhone: "+92-321-9876543", city: "Karachi" },
  { id: "app-003", applicationId: "HST-2026-0035", studentId: "EE-2024-0156", studentName: "Bilal Ahmed Qureshi", program: "BS Electrical Engineering", semester: 3, preferredHostel: "Engineering Tower Hostel", reason: "Merit-based allocation request", submittedAt: "2026-02-10", status: "approved", guardianPhone: "+92-333-5551234", city: "Lahore" },
  { id: "app-004", applicationId: "HST-2026-0028", studentId: "CS-2024-0199", studentName: "Zainab Sheikh", program: "BS Software Engineering", semester: 3, preferredHostel: "Fatima Jinnah Girls Hostel", reason: "Out-of-city student", submittedAt: "2026-02-05", status: "waitlisted", guardianPhone: "+92-345-7778899", city: "Multan" },
];

export const mockAllocations: HostelAllocation[] = [
  { id: "alc-001", studentId: "CS-2022-0421", studentName: "Ahmed Hassan Siddiqui", hostelName: "Quaid-e-Azam Boys Hostel", roomNumber: "A-101", bedNumber: "A-101-B1", allocatedAt: "2024-08-14", allocatedBy: "Dr. Asif Raza", status: "active" },
  { id: "alc-002", studentId: "EE-2024-0156", studentName: "Bilal Ahmed Qureshi", hostelName: "Engineering Tower Hostel", roomNumber: "ET-402", bedNumber: "ET-402-B2", allocatedAt: "2026-02-20", allocatedBy: "Engr. Tariq Mehmood", status: "active" },
];

export const mockWaitingList: HostelWaitingEntry[] = [
  { id: "wl-001", studentId: "CS-2024-0199", studentName: "Zainab Sheikh", preferredHostel: "Fatima Jinnah Girls Hostel", position: 1, appliedAt: "2026-02-05", priority: "normal" },
  { id: "wl-002", studentId: "ME-2024-0033", studentName: "Omar Farooq", preferredHostel: "Quaid-e-Azam Boys Hostel", position: 2, appliedAt: "2026-02-08", priority: "high" },
  { id: "wl-003", studentId: "CE-2024-0077", studentName: "Sana Iqbal", preferredHostel: "Fatima Jinnah Girls Hostel", position: 3, appliedAt: "2026-02-12", priority: "normal" },
];

export const mockHostelFees: HostelFee[] = [
  { id: "hf-001", studentId: "CS-2022-0421", studentName: "Ahmed Hassan Siddiqui", hostelName: "Quaid-e-Azam Boys Hostel", month: "Feb 2026", amount: 18500, paid: 18500, dueDate: "2026-02-05", status: "paid" },
  { id: "hf-002", studentId: "EE-2022-0188", studentName: "Muhammad Usman Khan", hostelName: "Quaid-e-Azam Boys Hostel", month: "Feb 2026", amount: 18500, paid: 9250, dueDate: "2026-02-05", status: "partial" },
  { id: "hf-003", studentId: "ME-2021-0094", studentName: "Hassan Raza Jaffery", hostelName: "Engineering Tower Hostel", month: "Feb 2026", amount: 16000, paid: 0, dueDate: "2026-02-05", status: "overdue" },
];

export const mockHostelComplaints: HostelComplaint[] = [
  { id: "hc-001", complaintId: "HST-CMP-042", studentId: "CS-2022-0421", studentName: "Ahmed Hassan Siddiqui", hostelName: "Quaid-e-Azam Boys Hostel", roomNumber: "A-101", category: "Plumbing", description: "Washroom tap leaking since 3 days", submittedAt: "2026-02-19", status: "in_progress" },
  { id: "hc-002", complaintId: "HST-CMP-038", studentId: "CS-2023-0112", studentName: "Fatima Zahra Ali", hostelName: "Fatima Jinnah Girls Hostel", roomNumber: "FJ-301", category: "Electricity", description: "Ceiling fan not working in room", submittedAt: "2026-02-17", status: "open" },
];

export const mockHostelMaintenance: HostelMaintenance[] = [
  { id: "hm-001", ticketId: "HST-MNT-012", hostelName: "Quaid-e-Azam Boys Hostel", location: "Block A, Floor 2, Room A-205", issue: "Plumbing repair — bathroom renovation", priority: "medium", reportedAt: "2026-02-10", status: "in_progress", assignedTo: "Facilities Team — Block A" },
  { id: "hm-002", ticketId: "HST-MNT-009", hostelName: "Graduate Research Hostel", location: "Research Block, Ground Floor", issue: "Generator maintenance scheduled", priority: "high", reportedAt: "2026-02-01", status: "scheduled", assignedTo: "Electrical Maintenance" },
];

export const studentHostelSummary: StudentHostelSummary = {
  applicationStatus: "none",
  allocation: {
    hostelName: "Quaid-e-Azam Boys Hostel",
    roomNumber: "A-101",
    bedNumber: "A-101-B1",
    checkIn: "2024-08-15",
  },
  pendingFees: 0,
  complaints: 1,
};

export function getHostelApplication(id: string) {
  return mockApplications.find((a) => a.id === id);
}

export function getHostelBed(id: string) {
  return mockBeds.find((b) => b.id === id);
}
