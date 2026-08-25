import type { AiContext, AiConversation, AiMockResponse, AiSuggestedPrompt } from "@/types/ai";

export const AI_SUGGESTED_PROMPTS: AiSuggestedPrompt[] = [
  { id: "sp-admin-1", context: "admin", label: "Departments below 75% attendance", prompt: "Which departments have attendance below 75%?" },
  { id: "sp-admin-2", context: "admin", label: "Pending fee collections", prompt: "Show total pending fee collections by department for this semester." },
  { id: "sp-admin-3", context: "admin", label: "Open maintenance tickets", prompt: "How many open maintenance tickets are there by category?" },
  { id: "sp-admin-4", context: "admin", label: "Accreditation status", prompt: "Which programs have accreditation reviews due in the next 6 months?" },
  { id: "sp-student-1", context: "student", label: "Credits to graduate", prompt: "How many credits do I need to graduate?" },
  { id: "sp-student-2", context: "student", label: "My attendance", prompt: "What is my attendance percentage this semester?" },
  { id: "sp-student-3", context: "student", label: "Upcoming exams", prompt: "When are my upcoming exams?" },
  { id: "sp-student-4", context: "student", label: "Library fines", prompt: "Do I have any overdue library books or fines?" },
  { id: "sp-parent-1", context: "parent", label: "Child attendance", prompt: "Show my child's attendance this month." },
  { id: "sp-parent-2", context: "parent", label: "Fee status", prompt: "What is my child's current fee status?" },
  { id: "sp-parent-3", context: "parent", label: "Recent results", prompt: "Show my child's recent exam results." },
  { id: "sp-teacher-1", context: "teacher", label: "Missing assignments", prompt: "Show students with missing assignments in my CS-301 class." },
  { id: "sp-teacher-2", context: "teacher", label: "Class attendance", prompt: "What is the attendance summary for EE-402 this week?" },
  { id: "sp-teacher-3", context: "teacher", label: "Advising queue", prompt: "How many advising requests are pending for me?" },
];

export const AI_MOCK_RESPONSES: AiMockResponse[] = [
  {
    promptPattern: "attendance below 75",
    context: "admin",
    response: "Based on Spring 2026 data for NED University:\n\n• **Mechanical Engineering** — 72.4% (below threshold)\n• **Basic Sciences (Mathematics)** — 74.1% (below threshold)\n• **Management Sciences** — 76.8% (at risk)\n\nElectrical Engineering (81.2%), Civil Engineering (79.5%), and Computer & Info Systems (83.6%) are above the 75% target.\n\nRecommendation: Review large-section attendance policies in ME and MTH departments.",
  },
  {
    promptPattern: "credits do I need",
    context: "student",
    response: "For your **BS Computer Science** program at NED:\n\n• Total required credits: **136**\n• Completed: **98 credits**\n• In progress (Spring 2026): **18 credits**\n• Remaining after this semester: **20 credits**\n\nYou need approximately **2 more semesters** at current pace to meet graduation requirements. Your degree audit shows all core CS courses through CS-401 are complete.",
  },
  {
    promptPattern: "child's attendance",
    context: "parent",
    response: "Attendance for **Ahmed Hassan Siddiqui** (CS-2022-0421) — February 2026:\n\n• Overall this month: **88%** (22 of 25 days present)\n• Absences: Feb 5 (sick leave), Feb 12 (unexcused), Feb 19 (approved leave)\n• Course-wise lowest: EE-301 at 80%\n\nThis is above the 75% minimum requirement. No action needed.",
  },
  {
    promptPattern: "missing assignments",
    context: "teacher",
    response: "Students with missing assignments in **CS-301 Data Structures** (Spring 2026):\n\n1. Syed Ali Raza (CS-2024-0088) — 3 missing (Assignments 4, 6, 7)\n2. Zainab Sheikh (CS-2024-0199) — 2 missing (Assignments 6, 7)\n3. Bilal Ahmed Qureshi (EE-2024-0156) — 1 missing (Assignment 7 — cross-registered)\n\nTotal: **3 students** with outstanding submissions. Assignment 7 deadline was Feb 20.",
  },
  {
    promptPattern: "pending fee",
    context: "admin",
    response: "Pending fee collections — Spring 2026:\n\n| Department | Pending (PKR) | Students |\n|---|---|---|\n| Electrical Engineering | 4,250,000 | 42 |\n| Civil Engineering | 3,180,000 | 38 |\n| Computer & Info Systems | 2,890,000 | 31 |\n| Mechanical Engineering | 2,450,000 | 28 |\n\n**Total outstanding: PKR 12.87 million** across 139 student accounts.",
  },
  {
    promptPattern: "upcoming exams",
    context: "student",
    response: "Your upcoming exams — Spring 2026:\n\n• **CS-301** Data Structures — Mar 15, 2026 (09:00 AM, Block 3 Room 204)\n• **MTH-201** Linear Algebra — Mar 18, 2026 (02:00 PM, Block 2 Room 105)\n• **EE-301** Signals & Systems — Mar 22, 2026 (09:00 AM, Block 7 Room 501)\n\nMidterm week begins March 15. Check /student/exams for seat numbers.",
  },
  {
    promptPattern: "accreditation",
    context: "admin",
    response: "Accreditation reviews due in next 6 months:\n\n• **BS Mechanical Engineering** (PEC) — Visit scheduled Apr 2026, stage: Preparation\n• **BS Electrical Engineering** (PEC) — Visit scheduled Apr 15, 2026, stage: Review\n• **MBA Executive** (NBA) — Submission due Jun 2026, stage: Submission\n\n3 open findings require corrective action before visits.",
  },
  {
    promptPattern: "default",
    context: "admin",
    response: "I'm **Zendrock AI**, your institutional assistant for NED University. I can help with attendance, fees, academics, accreditation, and operations data.\n\nTry asking about department metrics, student records, or procurement status. This is a demo — responses are based on mock data.",
  },
];

export const mockAiConversations: AiConversation[] = [
  {
    id: "conv-001",
    title: "Department attendance review",
    context: "admin",
    createdAt: "2026-02-22 10:00",
    updatedAt: "2026-02-22 10:02",
    messages: [
      { id: "msg-001", role: "user", content: "Which departments have attendance below 75%?", timestamp: "2026-02-22 10:00", status: "sent" },
      { id: "msg-002", role: "assistant", content: AI_MOCK_RESPONSES[0].response, timestamp: "2026-02-22 10:02", status: "sent" },
    ],
  },
];

export function getMockAiResponse(prompt: string, context: AiContext): string {
  const lower = prompt.toLowerCase();
  for (const mock of AI_MOCK_RESPONSES) {
    if (mock.context === context && mock.promptPattern !== "default" && lower.includes(mock.promptPattern.toLowerCase())) {
      return mock.response;
    }
  }
  const fallback = AI_MOCK_RESPONSES.find((m) => m.promptPattern === "default" && m.context === context)
    ?? AI_MOCK_RESPONSES.find((m) => m.promptPattern === "default");
  return fallback?.response ?? "I'm Zendrock AI. This is a demo response — connect the backend for live data.";
}

export function getPromptsForContext(context: AiContext) {
  return AI_SUGGESTED_PROMPTS.filter((p) => p.context === context);
}
