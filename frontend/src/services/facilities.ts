import {
  facilitiesStats,
  getBooking,
  getRoom,
  mockBookings,
  mockBuildings,
  mockClassrooms,
  mockEquipment,
  mockLabs,
  mockRooms,
  studentFacilitiesSummary,
} from "@/mock/facilities";

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function getFacilitiesStats() {
  await delay(90);
  return facilitiesStats;
}

export async function getBuildings() {
  await delay(100);
  return mockBuildings;
}

export async function getRooms() {
  await delay(100);
  return mockRooms;
}

export async function getRoomById(id: string) {
  await delay(80);
  return getRoom(id) ?? null;
}

export async function getLabs() {
  await delay(100);
  return mockLabs;
}

export async function getClassrooms() {
  await delay(90);
  return mockClassrooms;
}

export async function getEquipment() {
  await delay(100);
  return mockEquipment;
}

export async function getBookings() {
  await delay(90);
  return mockBookings;
}

export async function getBookingById(id: string) {
  await delay(80);
  return getBooking(id) ?? null;
}

export async function getStudentFacilities() {
  await delay(100);
  return studentFacilitiesSummary;
}
