import type {
  Building,
  Classroom,
  Equipment,
  FacilitiesStats,
  FacilityRoom,
  Lab,
  RoomBooking,
  StudentFacilitiesSummary,
} from "@/types/facilities";

export const FACILITIES_TABS = [
  { id: "dashboard", label: "Dashboard", href: "/facilities" },
  { id: "buildings", label: "Buildings", href: "/facilities/buildings" },
  { id: "rooms", label: "Rooms", href: "/facilities/rooms" },
  { id: "labs", label: "Labs", href: "/facilities/labs" },
  { id: "classrooms", label: "Classrooms", href: "/facilities/classrooms" },
  { id: "equipment", label: "Equipment", href: "/facilities/equipment" },
  { id: "bookings", label: "Bookings", href: "/facilities/bookings" },
  { id: "settings", label: "Settings", href: "/facilities/settings" },
];

export const facilitiesStats: FacilitiesStats = {
  totalBuildings: 18,
  totalRooms: 342,
  totalLabs: 48,
  totalClassrooms: 186,
  totalEquipment: 1240,
  activeBookings: 23,
  maintenanceLinked: 7,
};

export const mockBuildings: Building[] = [
  { id: "bld-001", name: "Main Academic Block", code: "MAB", address: "University Road, Block 1, NED Campus, Karachi", floors: 5, rooms: 68, labs: 8, classrooms: 42, department: "General", yearBuilt: 1964 },
  { id: "bld-002", name: "Electrical Engineering Block", code: "EEB", address: "Block 7, NED Campus, Karachi", floors: 4, rooms: 52, labs: 12, classrooms: 28, department: "Electrical Engineering", yearBuilt: 1982 },
  { id: "bld-003", name: "Mechanical Engineering Block", code: "MEB", address: "Block 9, NED Campus, Karachi", floors: 4, rooms: 48, labs: 10, classrooms: 24, department: "Mechanical Engineering", yearBuilt: 1990 },
  { id: "bld-004", name: "Computer Science Block", code: "CSB", address: "Block 16, NED Campus, Karachi", floors: 3, rooms: 36, labs: 8, classrooms: 18, department: "Computer & IT", yearBuilt: 2005 },
  { id: "bld-005", name: "Civil Engineering Block", code: "CEB", address: "Block 5, NED Campus, Karachi", floors: 4, rooms: 44, labs: 6, classrooms: 26, department: "Civil Engineering", yearBuilt: 1978 },
  { id: "bld-006", name: "Library & Learning Centre", code: "LLC", address: "Block 3, NED Campus, Karachi", floors: 3, rooms: 24, labs: 2, classrooms: 8, yearBuilt: 2012 },
];

export const mockRooms: FacilityRoom[] = [
  { id: "rm-001", roomNumber: "MAB-301", buildingId: "bld-001", buildingName: "Main Academic Block", floor: 3, type: "seminar", capacity: 80, department: "General", equipment: ["Projector", "PA System", "Whiteboard"], status: "available", availability: "Mon–Fri 08:00–18:00" },
  { id: "rm-002", roomNumber: "EEB-204", buildingId: "bld-002", buildingName: "Electrical Engineering Block", floor: 2, type: "classroom", capacity: 60, department: "Electrical Engineering", equipment: ["Projector", "Smart Board"], status: "occupied", availability: "Scheduled — EE-301" },
  { id: "rm-003", roomNumber: "CSB-102", buildingId: "bld-004", buildingName: "Computer Science Block", floor: 1, type: "lab", capacity: 40, department: "Computer & IT", equipment: ["40 PCs", "Projector", "Network Switch"], status: "available", availability: "Mon–Sat 08:00–20:00" },
  { id: "rm-004", roomNumber: "MEB-105", buildingId: "bld-003", buildingName: "Mechanical Engineering Block", floor: 1, type: "lab", capacity: 30, department: "Mechanical Engineering", equipment: ["CNC Machine", "Lathe", "Safety Gear"], status: "maintenance", availability: "Under maintenance until 2026-03-10" },
  { id: "rm-005", roomNumber: "CEB-401", buildingId: "bld-005", buildingName: "Civil Engineering Block", floor: 4, type: "classroom", capacity: 50, department: "Civil Engineering", equipment: ["Projector", "Document Camera"], status: "reserved", availability: "Reserved 2026-03-05 14:00–16:00" },
  { id: "rm-006", roomNumber: "LLC-201", buildingId: "bld-006", buildingName: "Library & Learning Centre", floor: 2, type: "meeting", capacity: 20, department: "Library", equipment: ["TV Screen", "Video Conference"], status: "available", availability: "Mon–Sat 09:00–17:00" },
];

export const mockLabs: Lab[] = [
  { id: "lab-001", roomNumber: "EEB-L01", buildingId: "bld-002", buildingName: "Electrical Engineering Block", floor: 1, type: "lab", capacity: 30, department: "Electrical Engineering", equipment: ["Oscilloscopes", "Power Supplies", "Multimeters"], status: "available", availability: "Mon–Fri 08:00–17:00", labType: "Electronics Lab", safetyLevel: "Medium", supervisor: "Engr. Saba Tariq" },
  { id: "lab-002", roomNumber: "CSB-L01", buildingId: "bld-004", buildingName: "Computer Science Block", floor: 2, type: "lab", capacity: 40, department: "Computer & IT", equipment: ["40 Workstations", "Server Rack", "Network Equipment"], status: "available", availability: "Mon–Sat 08:00–20:00", labType: "Computer Lab", safetyLevel: "Low", supervisor: "Dr. Farhan Ahmed" },
  { id: "lab-003", roomNumber: "MEB-L02", buildingId: "bld-003", buildingName: "Mechanical Engineering Block", floor: 2, type: "lab", capacity: 25, department: "Mechanical Engineering", equipment: ["Heat Transfer Apparatus", "Fluid Mechanics Bench"], status: "available", availability: "Mon–Fri 08:00–16:00", labType: "Thermodynamics Lab", safetyLevel: "High", supervisor: "Dr. Asif Raza" },
  { id: "lab-004", roomNumber: "CEB-L01", buildingId: "bld-005", buildingName: "Civil Engineering Block", floor: 1, type: "lab", capacity: 20, department: "Civil Engineering", equipment: ["Concrete Testing", "Soil Analysis Kit"], status: "occupied", availability: "In use — CE-401", labType: "Materials Lab", safetyLevel: "Medium", supervisor: "Prof. Ayesha Malik" },
  { id: "lab-005", roomNumber: "EEB-L03", buildingId: "bld-002", buildingName: "Electrical Engineering Block", floor: 3, type: "lab", capacity: 20, department: "Electrical Engineering", equipment: ["PLC Trainers", "Motor Control Panels"], status: "maintenance", availability: "Maintenance until 2026-03-08", labType: "Control Systems Lab", safetyLevel: "High", supervisor: "Engr. Tariq Mehmood" },
];

export const mockClassrooms: Classroom[] = [
  { id: "cls-001", roomNumber: "MAB-101", buildingId: "bld-001", buildingName: "Main Academic Block", floor: 1, type: "classroom", capacity: 80, department: "General", equipment: ["Projector", "Whiteboard"], status: "available", availability: "Mon–Fri 08:00–18:00", hasProjector: true, hasAc: true, seatingType: "Fixed rows" },
  { id: "cls-002", roomNumber: "MAB-102", buildingId: "bld-001", buildingName: "Main Academic Block", floor: 1, type: "classroom", capacity: 80, department: "General", equipment: ["Projector", "Smart Board"], status: "occupied", availability: "CS-101 in session", hasProjector: true, hasAc: true, seatingType: "Fixed rows" },
  { id: "cls-003", roomNumber: "EEB-301", buildingId: "bld-002", buildingName: "Electrical Engineering Block", floor: 3, type: "classroom", capacity: 60, department: "Electrical Engineering", equipment: ["Projector"], status: "available", availability: "Mon–Fri 08:00–17:00", hasProjector: true, hasAc: true, seatingType: "Fixed rows" },
  { id: "cls-004", roomNumber: "CSB-201", buildingId: "bld-004", buildingName: "Computer Science Block", floor: 2, type: "classroom", capacity: 50, department: "Computer & IT", equipment: ["Projector", "Document Camera"], status: "available", availability: "Mon–Sat 08:00–20:00", hasProjector: true, hasAc: true, seatingType: "Flexible" },
  { id: "cls-005", roomNumber: "CEB-201", buildingId: "bld-005", buildingName: "Civil Engineering Block", floor: 2, type: "classroom", capacity: 55, department: "Civil Engineering", equipment: ["Projector", "Whiteboard"], status: "reserved", availability: "Exam scheduled 2026-03-10", hasProjector: true, hasAc: false, seatingType: "Fixed rows" },
];

export const mockEquipment: Equipment[] = [
  { id: "eq-001", assetId: "NED-EQ-4521", name: "Epson Projector EB-X06", category: "AV Equipment", buildingName: "Main Academic Block", roomNumber: "MAB-301", department: "General", purchaseDate: "2023-08-15", value: 85000, status: "operational", lastMaintenance: "2025-11-20" },
  { id: "eq-002", assetId: "NED-EQ-3892", name: "Dell OptiPlex Workstation", category: "Computer", buildingName: "Computer Science Block", roomNumber: "CSB-L01", department: "Computer & IT", purchaseDate: "2024-01-10", value: 95000, status: "operational", lastMaintenance: "2025-12-05" },
  { id: "eq-003", assetId: "NED-EQ-2104", name: "Tektronix Oscilloscope TBS1052B", category: "Lab Equipment", buildingName: "Electrical Engineering Block", roomNumber: "EEB-L01", department: "Electrical Engineering", purchaseDate: "2022-06-20", value: 180000, status: "operational", lastMaintenance: "2025-10-15" },
  { id: "eq-004", assetId: "NED-EQ-1567", name: "Haier Split AC 2 Ton", category: "HVAC", buildingName: "Mechanical Engineering Block", roomNumber: "MEB-105", department: "Mechanical Engineering", purchaseDate: "2021-03-05", value: 120000, status: "maintenance", lastMaintenance: "2026-02-01" },
  { id: "eq-005", assetId: "NED-EQ-9834", name: "Smart Board 75\"", category: "AV Equipment", buildingName: "Electrical Engineering Block", roomNumber: "EEB-204", department: "Electrical Engineering", purchaseDate: "2024-09-01", value: 350000, status: "operational" },
  { id: "eq-006", assetId: "NED-EQ-7721", name: "CNC Milling Machine", category: "Lab Equipment", buildingName: "Mechanical Engineering Block", roomNumber: "MEB-L01", department: "Mechanical Engineering", purchaseDate: "2020-11-12", value: 2500000, status: "operational", lastMaintenance: "2025-09-20" },
];

export const mockBookings: RoomBooking[] = [
  { id: "bk-001", bookingId: "FAC-BK-042", roomNumber: "MAB-301", buildingName: "Main Academic Block", requester: "Dr. Farhan Ahmed", requesterRole: "Faculty", purpose: "IEEE Tech Talk — AI in Power Systems", date: "2026-03-05", startTime: "14:00", endTime: "16:00", attendees: 200, status: "approved" },
  { id: "bk-002", bookingId: "FAC-BK-039", roomNumber: "CSB-L01", buildingName: "Computer Science Block", requester: "Engr. Saba Tariq", requesterRole: "Faculty", purpose: "Robotics Workshop", date: "2026-03-08", startTime: "10:00", endTime: "14:00", attendees: 40, status: "approved" },
  { id: "bk-003", bookingId: "FAC-BK-035", roomNumber: "LLC-201", buildingName: "Library & Learning Centre", requester: "Ahmed Hassan Siddiqui", requesterRole: "Student", purpose: "Study group — Final year project", date: "2026-03-02", startTime: "15:00", endTime: "17:00", attendees: 6, status: "pending" },
  { id: "bk-004", bookingId: "FAC-BK-031", roomNumber: "CEB-401", buildingName: "Civil Engineering Block", requester: "Prof. Ayesha Malik", requesterRole: "Faculty", purpose: "Department meeting", date: "2026-03-05", startTime: "14:00", endTime: "16:00", attendees: 15, status: "approved" },
  { id: "bk-005", bookingId: "FAC-BK-028", roomNumber: "MAB-101", buildingName: "Main Academic Block", requester: "Muhammad Usman Khan", requesterRole: "Student", purpose: "Entrepreneurship Cell meeting", date: "2026-03-01", startTime: "16:00", endTime: "18:00", attendees: 25, status: "pending" },
];

export const studentFacilitiesSummary: StudentFacilitiesSummary = {
  upcomingBookings: mockBookings.filter((b) => b.requesterRole === "Student" && b.status === "approved"),
  availableRooms: [
    { roomNumber: "MAB-301", buildingName: "Main Academic Block", capacity: 80 },
    { roomNumber: "LLC-201", buildingName: "Library & Learning Centre", capacity: 20 },
    { roomNumber: "CSB-201", buildingName: "Computer Science Block", capacity: 50 },
  ],
};

export function getRoom(id: string) {
  return mockRooms.find((r) => r.id === id);
}

export function getBooking(id: string) {
  return mockBookings.find((b) => b.id === id);
}
