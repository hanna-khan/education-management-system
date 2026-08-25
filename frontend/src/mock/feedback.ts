export type FeedbackAudience = "school" | "teacher" | "facility" | "academic" | "other";
export type FeedbackStatus = "submitted" | "reviewed" | "acknowledged";

export interface FeedbackItem {
  id: string;
  from: string;
  role: "parent" | "teacher" | "student";
  audience: FeedbackAudience;
  subject: string;
  message: string;
  rating: number;
  status: FeedbackStatus;
  submitted: string;
  relatedChild?: string;
}

export const mockFeedback: FeedbackItem[] = [
  {
    id: "fb-001",
    from: "Sara Khan",
    role: "parent",
    audience: "school",
    subject: "Communication improvements",
    message: "Please share exam schedules earlier so parents can plan leave.",
    rating: 4,
    status: "reviewed",
    submitted: "2026-08-20",
    relatedChild: "Ahmed Khan",
  },
  {
    id: "fb-002",
    from: "Sana Iqbal",
    role: "teacher",
    audience: "facility",
    subject: "Lab equipment",
    message: "Lab A-204 projectors need maintenance before midterms.",
    rating: 3,
    status: "submitted",
    submitted: "2026-08-21",
  },
  {
    id: "fb-003",
    from: "Sara Khan",
    role: "parent",
    audience: "academic",
    subject: "Homework load",
    message: "Grade 5 homework volume has been heavy this week.",
    rating: 3,
    status: "acknowledged",
    submitted: "2026-08-18",
    relatedChild: "Ayesha Khan",
  },
];

export const feedbackStats = {
  total: 48,
  avgRating: 4.1,
  pendingReview: 6,
  thisMonth: 12,
};
