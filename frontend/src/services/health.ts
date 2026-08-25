import {
  healthStats,
  mockAllergies,
  mockClinicVisits,
  mockEmergencyContacts,
  mockMedicalDocuments,
  mockMedicalIncidents,
  mockMedicalProfiles,
  mockVaccinations,
  parentHealthNotifications,
  studentHealthSummary,
} from "@/mock/health";

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function getHealthStats() {
  await delay(90);
  return healthStats;
}

export async function getMedicalProfiles() {
  await delay(100);
  return mockMedicalProfiles;
}

export async function getClinicVisits() {
  await delay(100);
  return mockClinicVisits;
}

export async function getMedicalIncidents() {
  await delay(80);
  return mockMedicalIncidents;
}

export async function getAllergies() {
  await delay(80);
  return mockAllergies;
}

export async function getVaccinations() {
  await delay(80);
  return mockVaccinations;
}

export async function getMedicalDocuments() {
  await delay(80);
  return mockMedicalDocuments;
}

export async function getEmergencyContacts() {
  await delay(60);
  return mockEmergencyContacts;
}

export async function getStudentHealth() {
  await delay(100);
  return studentHealthSummary;
}

export async function getParentHealthNotifications() {
  await delay(80);
  return parentHealthNotifications;
}
