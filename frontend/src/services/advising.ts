import {
  advisingStats,
  getAdvisee,
  mockAdvisees,
  mockAdvisingNotes,
  mockAdvisingRequests,
  mockAppointments,
  mockAdvisors,
  mockRecommendations,
} from "@/mock/advising";

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function getAdvisingStats() {
  await delay(80);
  return advisingStats;
}

export async function getAdvisors() {
  await delay(60);
  return mockAdvisors;
}

export async function getAdvisees() {
  await delay(80);
  return mockAdvisees;
}

export async function getAdviseeById(id: string) {
  await delay(60);
  return getAdvisee(id);
}

export async function getAdviseeProfile(studentId: string) {
  await delay(100);
  return {
    advisee: getAdvisee(studentId),
    notes: mockAdvisingNotes.filter((n) => n.studentId === studentId),
    appointments: mockAppointments.filter((a) => a.studentId === studentId),
    recommendations: mockRecommendations.filter((r) => r.studentId === studentId),
    requests: mockAdvisingRequests.filter((r) => r.studentId === studentId),
  };
}

export async function getAppointments() {
  await delay(80);
  return mockAppointments;
}

export async function getAdvisingRequests() {
  await delay(80);
  return mockAdvisingRequests;
}
