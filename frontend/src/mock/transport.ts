import type {
  LiveTrackingMock,
  ParentTransportSummary,
  TransportAssignment,
  TransportConductor,
  TransportDriver,
  TransportFee,
  TransportMaintenance,
  TransportRoute,
  TransportStats,
  TransportStop,
  TransportStudent,
  TransportVehicle,
} from "@/types/transport";

export const TRANSPORT_TABS = [
  { id: "dashboard", label: "Dashboard", href: "/transport" },
  { id: "vehicles", label: "Vehicles", href: "/transport/vehicles" },
  { id: "routes", label: "Routes", href: "/transport/routes" },
  { id: "stops", label: "Stops", href: "/transport/stops" },
  { id: "drivers", label: "Drivers", href: "/transport/drivers" },
  { id: "conductors", label: "Conductors", href: "/transport/conductors" },
  { id: "students", label: "Students", href: "/transport/students" },
  { id: "assignments", label: "Assignments", href: "/transport/assignments" },
  { id: "passes", label: "Monthly Passes", href: "/transport/passes" },
  { id: "tokens", label: "Tokens (Topan)", href: "/transport/tokens" },
  { id: "fees", label: "Fees", href: "/transport/fees" },
  { id: "maintenance", label: "Maintenance", href: "/transport/maintenance" },
  { id: "tracking", label: "Live Tracking", href: "/transport/tracking" },
];

export const transportStats: TransportStats = {
  totalVehicles: 18,
  totalRoutes: 12,
  totalDrivers: 16,
  totalConductors: 14,
  enrolledStudents: 842,
  activeRoutes: 10,
  totalCapacity: 720,
  utilizationPct: 87,
};

export const mockVehicles: TransportVehicle[] = [
  { id: "veh-001", registrationNo: "KHI-2021-4521", make: "Hino", model: "Rainbow", year: 2021, capacity: 45, routeId: "rte-001", routeName: "Gulshan — NED Campus", driverId: "drv-001", driverName: "Muhammad Ashraf", status: "active", lastService: "2026-01-15" },
  { id: "veh-002", registrationNo: "KHI-2020-3892", make: "Master", model: "Foton", year: 2020, capacity: 35, routeId: "rte-002", routeName: "North Nazimabad — NED Campus", driverId: "drv-002", driverName: "Abdul Razzaq", status: "active", lastService: "2026-02-01" },
  { id: "veh-003", registrationNo: "KHI-2019-2145", make: "Hino", model: "Dutro", year: 2019, capacity: 40, routeId: "rte-003", routeName: "Clifton — NED Campus", driverId: "drv-003", driverName: "Imran Siddiqui", status: "maintenance", lastService: "2026-02-18" },
  { id: "veh-004", registrationNo: "KHI-2022-5678", make: "Isuzu", model: "NQR", year: 2022, capacity: 50, routeId: "rte-004", routeName: "Malir — NED Campus", driverId: "drv-004", driverName: "Khalid Mehmood", status: "active", lastService: "2026-01-28" },
];

export const mockRoutes: TransportRoute[] = [
  { id: "rte-001", code: "RT-GUL", name: "Gulshan — NED Campus", startPoint: "Gulshan Chowrangi", endPoint: "NED University Gate 1", stops: 8, distanceKm: 14.2, vehicleId: "veh-001", vehicleReg: "KHI-2021-4521", students: 42, capacity: 45, status: "active", departureTime: "06:45", arrivalTime: "07:35" },
  { id: "rte-002", code: "RT-NN", name: "North Nazimabad — NED Campus", startPoint: "Five Star Chowrangi", endPoint: "NED University Gate 2", stops: 6, distanceKm: 11.8, vehicleId: "veh-002", vehicleReg: "KHI-2020-3892", students: 33, capacity: 35, status: "active", departureTime: "06:50", arrivalTime: "07:30" },
  { id: "rte-003", code: "RT-CLF", name: "Clifton — NED Campus", startPoint: "Boat Basin", endPoint: "NED University Gate 1", stops: 7, distanceKm: 16.5, vehicleId: "veh-003", vehicleReg: "KHI-2019-2145", students: 0, capacity: 40, status: "inactive", departureTime: "06:40", arrivalTime: "07:40" },
  { id: "rte-004", code: "RT-MLR", name: "Malir — NED Campus", startPoint: "Malir Halt", endPoint: "NED University Gate 3", stops: 10, distanceKm: 22.4, vehicleId: "veh-004", vehicleReg: "KHI-2022-5678", students: 48, capacity: 50, status: "active", departureTime: "06:15", arrivalTime: "07:45" },
];

export const mockStops: TransportStop[] = [
  { id: "stp-001", routeId: "rte-001", routeName: "Gulshan — NED Campus", name: "Gulshan Chowrangi", area: "Gulshan-e-Iqbal", pickupTime: "06:45", dropTime: "16:30", sequence: 1, students: 8 },
  { id: "stp-002", routeId: "rte-001", routeName: "Gulshan — NED Campus", name: "Discounter", area: "Gulshan Block 5", pickupTime: "06:52", dropTime: "16:22", sequence: 2, students: 6 },
  { id: "stp-003", routeId: "rte-001", routeName: "Gulshan — NED Campus", name: "NIPA Chowrangi", area: "Gulistan-e-Johar", pickupTime: "07:05", dropTime: "16:10", sequence: 3, students: 12 },
  { id: "stp-004", routeId: "rte-002", routeName: "North Nazimabad — NED Campus", name: "Five Star Chowrangi", area: "North Nazimabad", pickupTime: "06:50", dropTime: "16:25", sequence: 1, students: 10 },
  { id: "stp-005", routeId: "rte-004", routeName: "Malir — NED Campus", name: "Malir Halt", area: "Malir", pickupTime: "06:15", dropTime: "17:00", sequence: 1, students: 15 },
];

export const mockDrivers: TransportDriver[] = [
  { id: "drv-001", employeeId: "EMP-TR-001", name: "Muhammad Ashraf", phone: "+92-300-1112233", licenseNo: "KHI-DL-2018-4521", licenseExpiry: "2028-06-30", routeId: "rte-001", routeName: "Gulshan — NED Campus", status: "active", experienceYears: 12 },
  { id: "drv-002", employeeId: "EMP-TR-002", name: "Abdul Razzaq", phone: "+92-321-4445566", licenseNo: "KHI-DL-2019-3892", licenseExpiry: "2027-12-15", routeId: "rte-002", routeName: "North Nazimabad — NED Campus", status: "active", experienceYears: 8 },
  { id: "drv-003", employeeId: "EMP-TR-003", name: "Imran Siddiqui", phone: "+92-333-7778899", licenseNo: "KHI-DL-2017-2145", licenseExpiry: "2026-09-20", routeId: "rte-003", routeName: "Clifton — NED Campus", status: "on_leave", experienceYears: 15 },
  { id: "drv-004", employeeId: "EMP-TR-004", name: "Khalid Mehmood", phone: "+92-345-9990011", licenseNo: "KHI-DL-2020-5678", licenseExpiry: "2029-03-10", routeId: "rte-004", routeName: "Malir — NED Campus", status: "active", experienceYears: 6 },
];

export const mockConductors: TransportConductor[] = [
  { id: "cnd-001", employeeId: "EMP-TC-001", name: "Rashid Ali", phone: "+92-300-2223344", routeId: "rte-001", routeName: "Gulshan — NED Campus", status: "active" },
  { id: "cnd-002", employeeId: "EMP-TC-002", name: "Shahid Hussain", phone: "+92-321-5556677", routeId: "rte-002", routeName: "North Nazimabad — NED Campus", status: "active" },
  { id: "cnd-003", employeeId: "EMP-TC-003", name: "Nadeem Akhtar", phone: "+92-333-8889900", routeId: "rte-004", routeName: "Malir — NED Campus", status: "active" },
];

export const mockTransportStudents: TransportStudent[] = [
  { id: "ts-001", studentId: "CS-2022-0421", name: "Ahmed Hassan Siddiqui", program: "BS Computer Systems", routeId: "rte-001", routeName: "Gulshan — NED Campus", stopName: "NIPA Chowrangi", pickupTime: "07:05", status: "active" },
  { id: "ts-002", studentId: "EE-2023-0245", name: "Sara Ahmed", program: "BS Electrical Engineering", routeId: "rte-002", routeName: "North Nazimabad — NED Campus", stopName: "Five Star Chowrangi", pickupTime: "06:50", status: "active" },
  { id: "ts-003", studentId: "CE-2024-0088", name: "Hamza Iqbal", program: "BS Civil Engineering", routeId: "rte-004", routeName: "Malir — NED Campus", stopName: "Malir Halt", pickupTime: "06:15", status: "active" },
];

export const mockAssignments: TransportAssignment[] = [
  { id: "asg-001", studentId: "CS-2022-0421", studentName: "Ahmed Hassan Siddiqui", routeId: "rte-001", routeName: "Gulshan — NED Campus", stopId: "stp-003", stopName: "NIPA Chowrangi", vehicleReg: "KHI-2021-4521", assignedAt: "2024-08-20", status: "active" },
  { id: "asg-002", studentId: "EE-2023-0245", studentName: "Sara Ahmed", routeId: "rte-002", routeName: "North Nazimabad — NED Campus", stopId: "stp-004", stopName: "Five Star Chowrangi", vehicleReg: "KHI-2020-3892", assignedAt: "2025-01-15", status: "active" },
];

export const mockTransportFees: TransportFee[] = [
  { id: "tf-001", studentId: "CS-2022-0421", studentName: "Ahmed Hassan Siddiqui", routeName: "Gulshan — NED Campus", term: "Spring 2026", amount: 12000, paid: 12000, dueDate: "2026-01-15", status: "paid" },
  { id: "tf-002", studentId: "CE-2024-0088", studentName: "Hamza Iqbal", routeName: "Malir — NED Campus", term: "Spring 2026", amount: 15000, paid: 7500, dueDate: "2026-01-15", status: "pending" },
  { id: "tf-003", studentId: "ME-2023-0177", studentName: "Usama Farooq", routeName: "North Nazimabad — NED Campus", term: "Spring 2026", amount: 11000, paid: 0, dueDate: "2026-01-15", status: "overdue" },
];

export const mockTransportMaintenance: TransportMaintenance[] = [
  { id: "tm-001", ticketId: "TR-MNT-008", vehicleReg: "KHI-2019-2145", issue: "Engine overhaul — scheduled service", priority: "high", reportedAt: "2026-02-15", status: "in_progress", cost: 85000 },
  { id: "tm-002", ticketId: "TR-MNT-006", vehicleReg: "KHI-2021-4521", issue: "Tyre replacement — front axle", priority: "medium", reportedAt: "2026-02-10", status: "completed", cost: 42000 },
];

export const liveTrackingMock: LiveTrackingMock = {
  routeId: "rte-001",
  routeName: "Gulshan — NED Campus",
  vehicleReg: "KHI-2021-4521",
  driverName: "Muhammad Ashraf",
  conductorName: "Rashid Ali",
  currentStop: "NIPA Chowrangi",
  nextStop: "NED University Gate 1",
  progressPct: 72,
  lastUpdated: "2026-02-23 07:28",
  speedKmh: 32,
  studentsOnBoard: 38,
};

export const parentTransportSummary: ParentTransportSummary = {
  childName: "Ahmed Hassan Siddiqui",
  childId: "CS-2022-0421",
  routeName: "Gulshan — NED Campus",
  vehicleReg: "KHI-2021-4521",
  driverName: "Muhammad Ashraf",
  driverPhone: "+92-300-1112233",
  pickupStop: "NIPA Chowrangi",
  pickupTime: "07:05",
  dropStop: "NED University Gate 1",
  dropTime: "07:35",
  status: "on_route",
};

export function getTransportRoute(id: string) {
  return mockRoutes.find((r) => r.id === id);
}

export function getTransportVehicle(id: string) {
  return mockVehicles.find((v) => v.id === id);
}

export interface TransportMonthlyPass {
  id: string;
  passCode: string;
  studentId: string;
  studentName: string;
  routeName: string;
  month: string;
  amount: number;
  status: "active" | "pending_payment" | "expired" | "revoked";
  issuedAt?: string;
  validUntil: string;
  qrCode: string;
}

export interface TransportTokenPack {
  id: string;
  name: string;
  rides: number;
  price: number;
  validityDays: number;
  popular?: boolean;
}

export interface TransportTokenBalance {
  studentId: string;
  studentName: string;
  remainingRides: number;
  packName: string;
  purchasedAt: string;
  expiresAt: string;
  lastUsedAt?: string;
}

export interface TransportTokenSale {
  id: string;
  studentName: string;
  packName: string;
  rides: number;
  amount: number;
  purchasedAt: string;
  paymentRef: string;
}

export const mockTokenPacks: TransportTokenPack[] = [
  { id: "pack-2", name: "2-Ride Topan", rides: 2, price: 200, validityDays: 30 },
  { id: "pack-5", name: "5-Ride Topan", rides: 5, price: 450, validityDays: 45, popular: true },
  { id: "pack-10", name: "10-Ride Topan", rides: 10, price: 800, validityDays: 60 },
];

export const mockMonthlyPasses: TransportMonthlyPass[] = [
  {
    id: "mp-001",
    passCode: "NED-BUS-SEP-0421",
    studentId: "CS-2022-0421",
    studentName: "Ahmed Khan",
    routeName: "Gulshan — NED Campus",
    month: "September 2026",
    amount: 4500,
    status: "active",
    issuedAt: "2026-08-28",
    validUntil: "2026-09-30",
    qrCode: "QR-BUS-MP-0421",
  },
  {
    id: "mp-002",
    passCode: "NED-BUS-SEP-0245",
    studentId: "EE-2023-0245",
    studentName: "Sara Ahmed",
    routeName: "North Nazimabad — NED Campus",
    month: "September 2026",
    amount: 4200,
    status: "pending_payment",
    validUntil: "2026-09-30",
    qrCode: "QR-BUS-MP-0245",
  },
  {
    id: "mp-003",
    passCode: "NED-BUS-AUG-0088",
    studentId: "CE-2024-0088",
    studentName: "Hamza Iqbal",
    routeName: "Malir — NED Campus",
    month: "August 2026",
    amount: 5000,
    status: "expired",
    issuedAt: "2026-07-29",
    validUntil: "2026-08-31",
    qrCode: "QR-BUS-MP-0088",
  },
];

export const mockTokenBalances: TransportTokenBalance[] = [
  {
    studentId: "CS-2022-0421",
    studentName: "Ahmed Khan",
    remainingRides: 3,
    packName: "5-Ride Topan",
    purchasedAt: "2026-08-20",
    expiresAt: "2026-10-04",
    lastUsedAt: "2026-08-27 07:12",
  },
];

export const mockTokenSales: TransportTokenSale[] = [
  { id: "tsale-1", studentName: "Ahmed Khan", packName: "5-Ride Topan", rides: 5, amount: 450, purchasedAt: "2026-08-20", paymentRef: "PAY-TR-9921" },
  { id: "tsale-2", studentName: "Hira Ali", packName: "2-Ride Topan", rides: 2, amount: 200, purchasedAt: "2026-08-22", paymentRef: "PAY-TR-9934" },
  { id: "tsale-3", studentName: "Bilal Hussain", packName: "10-Ride Topan", rides: 10, amount: 800, purchasedAt: "2026-08-25", paymentRef: "PAY-TR-9950" },
];

export const monthlyPassFeePkr = 4500;
