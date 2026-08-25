import {
  alumniStats,
  mockAlumniEvents,
  mockAlumniProfiles,
  mockDirectory,
  mockDonations,
  mockMentorshipRequests,
  studentAlumniMentorshipSummary,
} from "@/mock/alumni";

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function getAlumniStats() {
  await delay(90);
  return alumniStats;
}

export async function getAlumniProfiles() {
  await delay(100);
  return mockAlumniProfiles;
}

export async function getAlumniDirectory() {
  await delay(100);
  return mockDirectory;
}

export async function getAlumniEvents() {
  await delay(80);
  return mockAlumniEvents;
}

export async function getMentorshipRequests() {
  await delay(80);
  return mockMentorshipRequests;
}

export async function getAlumniDonations() {
  await delay(80);
  return mockDonations;
}

export async function getStudentAlumniMentorship() {
  await delay(100);
  return studentAlumniMentorshipSummary;
}
