import type {
  StudentSurveySummary,
  Survey,
  SurveyAnalytics,
  SurveyResponse,
  SurveysStats,
} from "@/types/surveys";

export const SURVEYS_TABS = [
  { id: "dashboard", label: "Dashboard", href: "/surveys" },
  { id: "list", label: "All Surveys", href: "/surveys/list" },
  { id: "create", label: "Create", href: "/surveys/create" },
];

export const surveysStats: SurveysStats = {
  totalSurveys: 48,
  activeSurveys: 6,
  totalResponses: 8420,
  avgResponseRate: 72,
  avgRating: 4.1,
  pendingReviews: 3,
};

export const mockSurveys: Survey[] = [
  {
    id: "svy-001",
    surveyId: "SRV-2026-012",
    title: "Spring 2026 Course Evaluation — CS-401 Machine Learning",
    description: "Evaluate Dr. Farhan Ahmed's Machine Learning course for Spring 2026 semester.",
    audience: "course_evaluation",
    status: "published",
    questions: [
      { id: "q1", text: "Overall course quality", type: "rating", required: true },
      { id: "q2", text: "Instructor clarity and communication", type: "rating", required: true },
      { id: "q3", text: "Course materials and resources", type: "rating", required: true },
      { id: "q4", text: "Would you recommend this course?", type: "yes_no", required: true },
      { id: "q5", text: "Additional comments", type: "text", required: false },
    ],
    createdBy: "QEC Office",
    createdAt: "2026-02-15",
    publishedAt: "2026-02-18",
    closesAt: "2026-03-15",
    targetCount: 45,
    responseCount: 32,
  },
  {
    id: "svy-002",
    surveyId: "SRV-2026-011",
    title: "Student Satisfaction Survey 2026",
    description: "Annual survey covering campus facilities, academics, and student services at NED University.",
    audience: "student",
    status: "published",
    questions: [
      { id: "q1", text: "Overall satisfaction with NED University", type: "scale", required: true, scaleMin: 1, scaleMax: 10 },
      { id: "q2", text: "Which areas need improvement?", type: "checkbox", required: true, options: ["Library", "Hostel", "Cafeteria", "Labs", "WiFi", "Transport", "Sports"] },
      { id: "q3", text: "Rate campus cleanliness", type: "rating", required: true },
      { id: "q4", text: "Rate IT support responsiveness", type: "rating", required: true },
      { id: "q5", text: "Open feedback", type: "text", required: false },
    ],
    createdBy: "QEC Office",
    createdAt: "2026-01-20",
    publishedAt: "2026-02-01",
    closesAt: "2026-03-31",
    targetCount: 8500,
    responseCount: 2140,
  },
  {
    id: "svy-003",
    surveyId: "SRV-2026-010",
    title: "Parent Feedback — Spring Term 2026",
    description: "Gather parent perspectives on academic progress, communication, and school environment.",
    audience: "parent",
    status: "published",
    questions: [
      { id: "q1", text: "Satisfaction with teacher communication", type: "rating", required: true },
      { id: "q2", text: "Child's academic progress this term", type: "multiple_choice", required: true, options: ["Excellent", "Good", "Average", "Needs improvement"] },
      { id: "q3", text: "Would you recommend this school?", type: "yes_no", required: true },
      { id: "q4", text: "Comments or concerns", type: "text", required: false },
    ],
    createdBy: "Principal Office",
    createdAt: "2026-02-10",
    publishedAt: "2026-02-12",
    closesAt: "2026-03-20",
    targetCount: 1200,
    responseCount: 486,
  },
  {
    id: "svy-004",
    surveyId: "SRV-2026-009",
    title: "IEEE Tech Talk Event Feedback",
    description: "Feedback for the AI in Power Systems tech talk held on 2026-02-15.",
    audience: "event_feedback",
    status: "closed",
    questions: [
      { id: "q1", text: "Event organization", type: "rating", required: true },
      { id: "q2", text: "Speaker quality", type: "rating", required: true },
      { id: "q3", text: "Venue and refreshments", type: "rating", required: true },
      { id: "q4", text: "Topics you'd like in future events", type: "text", required: false },
    ],
    createdBy: "IEEE NED Student Branch",
    createdAt: "2026-02-14",
    publishedAt: "2026-02-15",
    closesAt: "2026-02-22",
    targetCount: 200,
    responseCount: 156,
  },
  {
    id: "svy-005",
    surveyId: "SRV-2026-008",
    title: "Faculty Teaching Effectiveness — EE Department",
    description: "Department-wide teaching evaluation for Electrical Engineering faculty.",
    audience: "teacher",
    status: "draft",
    questions: [
      { id: "q1", text: "Teaching methodology effectiveness", type: "rating", required: true },
      { id: "q2", text: "Availability for consultation", type: "rating", required: true },
      { id: "q3", text: "Fairness in assessment", type: "rating", required: true },
    ],
    createdBy: "EE Department HOD",
    createdAt: "2026-02-20",
    targetCount: 0,
    responseCount: 0,
  },
  {
    id: "svy-006",
    surveyId: "SRV-2026-007",
    title: "Staff Workplace Satisfaction 2026",
    description: "Internal HR survey for administrative and support staff.",
    audience: "staff",
    status: "published",
    questions: [
      { id: "q1", text: "Job satisfaction", type: "scale", required: true, scaleMin: 1, scaleMax: 5 },
      { id: "q2", text: "Work-life balance", type: "rating", required: true },
      { id: "q3", text: "Management support", type: "rating", required: true },
      { id: "q4", text: "Suggestions for improvement", type: "text", required: false },
    ],
    createdBy: "HR Department",
    createdAt: "2026-02-01",
    publishedAt: "2026-02-05",
    closesAt: "2026-03-10",
    targetCount: 420,
    responseCount: 198,
  },
];

export const mockSurveyResponses: SurveyResponse[] = [
  { id: "rsp-001", respondentId: "CS-2022-0421", respondentName: "Ahmed Hassan Siddiqui", submittedAt: "2026-02-20 14:30", answers: { q1: 5, q2: 4, q3: 5, q4: "yes", q5: "Excellent course — practical ML projects were very helpful" }, comment: "Would appreciate more lab sessions" },
  { id: "rsp-002", respondentId: "EE-2022-0188", respondentName: "Muhammad Usman Khan", submittedAt: "2026-02-19 11:15", answers: { q1: 4, q2: 4, q3: 4, q4: "yes" } },
  { id: "rsp-003", respondentId: "CS-2023-0112", respondentName: "Fatima Zahra Ali", submittedAt: "2026-02-18 16:45", answers: { q1: 5, q2: 5, q3: 4, q4: "yes", q5: "Dr. Farhan is one of the best instructors at NED" } },
  { id: "rsp-004", respondentId: "ME-2021-0094", respondentName: "Hassan Raza Jaffery", submittedAt: "2026-02-17 09:20", answers: { q1: 3, q2: 3, q3: 3, q4: "no", q5: "Pace was too fast for beginners in ML" } },
];

export const surveyAnalyticsMap: Record<string, SurveyAnalytics> = {
  "svy-001": {
    surveyId: "svy-001",
    responseCount: 32,
    responseRate: 71,
    avgRating: 4.3,
    questionBreakdown: [
      { questionId: "q1", questionText: "Overall course quality", type: "rating", avgRating: 4.4, distribution: { "5": 18, "4": 10, "3": 3, "2": 1, "1": 0 } },
      { questionId: "q2", questionText: "Instructor clarity and communication", type: "rating", avgRating: 4.5, distribution: { "5": 20, "4": 8, "3": 3, "2": 1, "1": 0 } },
      { questionId: "q3", questionText: "Course materials and resources", type: "rating", avgRating: 4.1, distribution: { "5": 14, "4": 12, "3": 4, "2": 2, "1": 0 } },
      { questionId: "q4", questionText: "Would you recommend this course?", type: "yes_no", distribution: { yes: 28, no: 4 } },
      { questionId: "q5", questionText: "Additional comments", type: "text", sampleComments: ["Excellent course — practical ML projects were very helpful", "Dr. Farhan is one of the best instructors at NED", "Pace was too fast for beginners in ML"] },
    ],
  },
  "svy-002": {
    surveyId: "svy-002",
    responseCount: 2140,
    responseRate: 25,
    avgRating: 3.8,
    questionBreakdown: [
      { questionId: "q1", questionText: "Overall satisfaction with NED University", type: "scale", avgRating: 7.2 },
      { questionId: "q2", questionText: "Which areas need improvement?", type: "checkbox", distribution: { Library: 890, Hostel: 620, Cafeteria: 1100, Labs: 780, WiFi: 1450, Transport: 540, Sports: 320 } },
      { questionId: "q3", questionText: "Rate campus cleanliness", type: "rating", avgRating: 3.5 },
      { questionId: "q4", questionText: "Rate IT support responsiveness", type: "rating", avgRating: 3.2 },
    ],
  },
};

export const studentSurveySummary: StudentSurveySummary = {
  pending: mockSurveys.filter((s) => s.status === "published" && (s.audience === "student" || s.audience === "course_evaluation")),
  completed: ["SRV-2026-009"],
};

export function getSurvey(id: string) {
  return mockSurveys.find((s) => s.id === id);
}

export function getSurveyAnalytics(id: string) {
  return surveyAnalyticsMap[id] ?? {
    surveyId: id,
    responseCount: 0,
    responseRate: 0,
    avgRating: 0,
    questionBreakdown: [],
  };
}

export function getSurveyResponses(surveyId: string) {
  const survey = getSurvey(surveyId);
  if (!survey) return [];
  if (survey.id === "svy-001") return mockSurveyResponses;
  return mockSurveyResponses.slice(0, 2);
}
