import {
  mockAccreditationAudits,
  mockAccreditationBodies,
  mockAccreditationCycles,
  mockAccreditationDocuments,
  mockAccreditationEvidence,
  mockAccreditationFindings,
  mockAccreditationRequirements,
  mockAccreditationStandards,
  mockAccreditedPrograms,
  mockCorrectiveActions,
  accreditationStats,
} from "@/mock/accreditation";

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function getAccreditationStats() {
  await delay(90);
  return accreditationStats;
}

export async function getAccreditationBodies() {
  await delay(85);
  return mockAccreditationBodies;
}

export async function getAccreditedPrograms() {
  await delay(100);
  return mockAccreditedPrograms;
}

export async function getAccreditationRequirements() {
  await delay(80);
  return mockAccreditationRequirements;
}

export async function getAccreditationStandards() {
  await delay(85);
  return mockAccreditationStandards;
}

export async function getAccreditationEvidence() {
  await delay(90);
  return mockAccreditationEvidence;
}

export async function getAccreditationDocuments() {
  await delay(100);
  return mockAccreditationDocuments;
}

export async function getAccreditationCycles() {
  await delay(85);
  return mockAccreditationCycles;
}

export async function getAccreditationAudits() {
  await delay(80);
  return mockAccreditationAudits;
}

export async function getAccreditationFindings() {
  await delay(90);
  return mockAccreditationFindings;
}

export async function getCorrectiveActions() {
  await delay(85);
  return mockCorrectiveActions;
}
