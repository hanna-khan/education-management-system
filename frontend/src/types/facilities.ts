export type RoomType = "classroom" | "lab" | "seminar" | "auditorium" | "office" | "meeting";
export type RoomStatus = "available" | "occupied" | "maintenance" | "reserved";
export type EquipmentStatus = "operational" | "maintenance" | "retired";
export type BookingStatus = "pending" | "approved" | "rejected" | "cancelled" | "completed";

export interface FacilitiesStats {
  totalBuildings: number;
  totalRooms: number;
  totalLabs: number;
  totalClassrooms: number;
  totalEquipment: number;
  activeBookings: number;
  maintenanceLinked: number;
}

export interface Building {
  id: string;
  name: string;
  code: string;
  address: string;
  floors: number;
  rooms: number;
  labs: number;
  classrooms: number;
  department?: string;
  yearBuilt: number;
}

export interface FacilityRoom {
  id: string;
  roomNumber: string;
  buildingId: string;
  buildingName: string;
  floor: number;
  type: RoomType;
  capacity: number;
  department: string;
  equipment: string[];
  status: RoomStatus;
  availability: string;
}

export interface Lab extends FacilityRoom {
  labType: string;
  safetyLevel: string;
  supervisor: string;
}

export interface Classroom extends FacilityRoom {
  hasProjector: boolean;
  hasAc: boolean;
  seatingType: string;
}

export interface Equipment {
  id: string;
  assetId: string;
  name: string;
  category: string;
  buildingName: string;
  roomNumber: string;
  department: string;
  purchaseDate: string;
  value: number;
  status: EquipmentStatus;
  lastMaintenance?: string;
}

export interface RoomBooking {
  id: string;
  bookingId: string;
  roomNumber: string;
  buildingName: string;
  requester: string;
  requesterRole: string;
  purpose: string;
  date: string;
  startTime: string;
  endTime: string;
  attendees: number;
  status: BookingStatus;
}

export interface StudentFacilitiesSummary {
  upcomingBookings: RoomBooking[];
  availableRooms: { roomNumber: string; buildingName: string; capacity: number }[];
}
