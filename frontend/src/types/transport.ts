export type VehicleStatus = "active" | "maintenance" | "retired";
export type RouteStatus = "active" | "inactive" | "seasonal";
export type TransportAssignmentStatus = "active" | "suspended" | "ended";
export type TransportFeeStatus = "pending" | "paid" | "overdue" | "waived";

export interface TransportStats {
  totalVehicles: number;
  totalRoutes: number;
  totalDrivers: number;
  totalConductors: number;
  enrolledStudents: number;
  activeRoutes: number;
  totalCapacity: number;
  utilizationPct: number;
}

export interface TransportVehicle {
  id: string;
  registrationNo: string;
  make: string;
  model: string;
  year: number;
  capacity: number;
  routeId?: string;
  routeName?: string;
  driverId?: string;
  driverName?: string;
  status: VehicleStatus;
  lastService: string;
}

export interface TransportRoute {
  id: string;
  code: string;
  name: string;
  startPoint: string;
  endPoint: string;
  stops: number;
  distanceKm: number;
  vehicleId?: string;
  vehicleReg?: string;
  students: number;
  capacity: number;
  status: RouteStatus;
  departureTime: string;
  arrivalTime: string;
}

export interface TransportStop {
  id: string;
  routeId: string;
  routeName: string;
  name: string;
  area: string;
  pickupTime: string;
  dropTime: string;
  sequence: number;
  students: number;
}

export interface TransportDriver {
  id: string;
  employeeId: string;
  name: string;
  phone: string;
  licenseNo: string;
  licenseExpiry: string;
  routeId?: string;
  routeName?: string;
  status: "active" | "on_leave" | "inactive";
  experienceYears: number;
}

export interface TransportConductor {
  id: string;
  employeeId: string;
  name: string;
  phone: string;
  routeId?: string;
  routeName?: string;
  status: "active" | "on_leave" | "inactive";
}

export interface TransportStudent {
  id: string;
  studentId: string;
  name: string;
  program: string;
  routeId: string;
  routeName: string;
  stopName: string;
  pickupTime: string;
  status: TransportAssignmentStatus;
}

export interface TransportAssignment {
  id: string;
  studentId: string;
  studentName: string;
  routeId: string;
  routeName: string;
  stopId: string;
  stopName: string;
  vehicleReg: string;
  assignedAt: string;
  status: TransportAssignmentStatus;
}

export interface TransportFee {
  id: string;
  studentId: string;
  studentName: string;
  routeName: string;
  term: string;
  amount: number;
  paid: number;
  dueDate: string;
  status: TransportFeeStatus;
}

export interface TransportMaintenance {
  id: string;
  ticketId: string;
  vehicleReg: string;
  issue: string;
  priority: "low" | "medium" | "high" | "urgent";
  reportedAt: string;
  status: "scheduled" | "in_progress" | "completed";
  cost?: number;
}

export interface LiveTrackingMock {
  routeId: string;
  routeName: string;
  vehicleReg: string;
  driverName: string;
  conductorName: string;
  currentStop: string;
  nextStop: string;
  progressPct: number;
  lastUpdated: string;
  speedKmh: number;
  studentsOnBoard: number;
}

export interface ParentTransportSummary {
  childName: string;
  childId: string;
  routeName: string;
  vehicleReg: string;
  driverName: string;
  driverPhone: string;
  pickupStop: string;
  pickupTime: string;
  dropStop: string;
  dropTime: string;
  status: "on_route" | "arrived" | "not_started";
}
