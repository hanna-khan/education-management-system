import {
  getLmsCourse,
  lmsStats,
  mockAnnouncements,
  mockDiscussions,
  mockLessons,
  mockLmsAssignments,
  mockLmsAttendance,
  mockLmsCourses,
  mockLmsGrades,
  mockMaterials,
  mockQuizzes,
} from "@/mock/lms";

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function getLmsStats() {
  await delay(80);
  return lmsStats;
}

export async function getLmsCourses() {
  await delay(100);
  return mockLmsCourses;
}

export async function getLmsCourseById(id: string) {
  await delay(80);
  return getLmsCourse(id);
}

export async function getCourseContent(courseId: string) {
  await delay(100);
  return {
    announcements: mockAnnouncements.filter((a) => a.courseId === courseId),
    materials: mockMaterials.filter((m) => m.courseId === courseId),
    lessons: mockLessons.filter((l) => l.courseId === courseId),
    assignments: mockLmsAssignments.filter((a) => a.courseId === courseId),
    quizzes: mockQuizzes.filter((q) => q.courseId === courseId),
    discussions: mockDiscussions.filter((d) => d.courseId === courseId),
    attendance: mockLmsAttendance.filter((a) => a.courseId === courseId),
    grades: mockLmsGrades,
  };
}
