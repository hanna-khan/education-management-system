import {
  assignmentStats,
  getAssignment,
  getSubmission,
  getSubmissionsFor,
  mockAssignments,
  mockSubmissions,
} from "@/mock/assignments";

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function getAssignmentStats() {
  await delay(80);
  return assignmentStats;
}

export async function getAssignments() {
  await delay(100);
  return mockAssignments;
}

export async function getAssignmentById(id: string) {
  await delay(60);
  return getAssignment(id);
}

export async function getAssignmentSubmissions(assignmentId: string) {
  await delay(80);
  return getSubmissionsFor(assignmentId);
}

export async function getSubmissionById(id: string) {
  await delay(60);
  return getSubmission(id);
}

export async function getStudentAssignments(studentId = "CS-2022-0421") {
  await delay(80);
  return mockSubmissions.filter((s) => s.studentId === studentId);
}
