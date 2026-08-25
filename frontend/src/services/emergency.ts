import {
  emergencyStats,
  mockEmergencyAlerts,
  mockEmergencyAnnouncements,
  mockEmergencyContacts,
  mockEvacuationPlans,
  mockSafetyIncidents,
} from "@/mock/emergency";

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function getEmergencyStats() {
  await delay(90);
  return emergencyStats;
}

export async function getEmergencyAlerts() {
  await delay(85);
  return mockEmergencyAlerts;
}

export async function getEmergencyContacts() {
  await delay(80);
  return mockEmergencyContacts;
}

export async function getSafetyIncidents() {
  await delay(100);
  return mockSafetyIncidents;
}

export async function getEvacuationPlans() {
  await delay(85);
  return mockEvacuationPlans;
}

export async function getEmergencyAnnouncements() {
  await delay(90);
  return mockEmergencyAnnouncements;
}
