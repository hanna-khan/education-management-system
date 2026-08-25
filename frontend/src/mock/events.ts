export type EventTone = "purple" | "teal" | "orange" | "coral" | "blue" | "green";

export type SchoolEventType =
  | "Competition"
  | "Meeting"
  | "Tour"
  | "Sports"
  | "Cultural"
  | "Exam"
  | "Holiday"
  | "Concert"
  | "Reception";

export interface SchoolEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  endDate?: string;
  time: string;
  location: string;
  type: SchoolEventType;
  tone: EventTone;
  capacity: number;
  sold: number;
  price?: number;
  campus: string;
  participants: string[];
}

export const EVENT_TONE_STYLES: Record<
  EventTone,
  { bg: string; text: string; border: string; fill: string; bar: string }
> = {
  purple: { bg: "bg-[#efeaff]", text: "text-[#6B58F6]", border: "border-[#6B58F6]", fill: "bg-[#6B58F6]/15", bar: "bg-[#6B58F6]" },
  teal: { bg: "bg-[#e6fbf7]", text: "text-[#1BD0B4]", border: "border-[#1BD0B4]", fill: "bg-[#1BD0B4]/15", bar: "bg-[#1BD0B4]" },
  orange: { bg: "bg-[#fff6eb]", text: "text-[#F4901F]", border: "border-[#F4901F]", fill: "bg-[#F4901F]/15", bar: "bg-[#F4901F]" },
  coral: { bg: "bg-[#fff0f1]", text: "text-[#FF394B]", border: "border-[#FF394B]", fill: "bg-[#FF394B]/15", bar: "bg-[#FF394B]" },
  blue: { bg: "bg-[#eff6ff]", text: "text-[#3b82f6]", border: "border-[#3b82f6]", fill: "bg-[#3b82f6]/15", bar: "bg-[#3b82f6]" },
  green: { bg: "bg-[#ecfdf5]", text: "text-[#10b981]", border: "border-[#10b981]", fill: "bg-[#10b981]/15", bar: "bg-[#10b981]" },
};

export const initialSchoolEvents: SchoolEvent[] = [
  {
    id: "evt-001",
    title: "School Live Concert",
    description: "Annual music and arts showcase featuring student bands, choir, and dance performances.",
    date: "2026-08-03",
    time: "07:00 PM - 10:00 PM",
    location: "Main Auditorium",
    type: "Concert",
    tone: "purple",
    capacity: 960,
    sold: 650,
    price: 5,
    campus: "Main Campus",
    participants: ["AM", "HA", "ZM", "BA", "SI"],
  },
  {
    id: "evt-002",
    title: "Science Fair 2026",
    description: "Students present innovative science projects across biology, chemistry, and physics.",
    date: "2026-08-28",
    time: "09:00 AM - 04:00 PM",
    location: "Block C Hall",
    type: "Competition",
    tone: "teal",
    capacity: 500,
    sold: 225,
    campus: "Main Campus",
    participants: ["OF", "DT", "RQ", "NF"],
  },
  {
    id: "evt-003",
    title: "Parent-Teacher Meeting",
    description: "Quarterly meeting for parents to discuss student progress with class teachers.",
    date: "2026-08-12",
    time: "02:00 PM - 05:00 PM",
    location: "Conference Room",
    type: "Meeting",
    tone: "orange",
    capacity: 200,
    sold: 176,
    campus: "All Campuses",
    participants: ["AR", "FK", "OS", "PS"],
  },
  {
    id: "evt-004",
    title: "School Competition",
    description: "Inter-class quiz and debate competition for grades 8 through 12.",
    date: "2026-08-07",
    time: "10:00 AM - 01:00 PM",
    location: "Activity Hall",
    type: "Competition",
    tone: "green",
    capacity: 300,
    sold: 280,
    price: 2,
    campus: "Main Campus",
    participants: ["LH", "AS", "UK", "MS"],
  },
  {
    id: "evt-005",
    title: "Annual Debating Championship",
    description: "Final round of the school debating league with guest judges from local universities.",
    date: "2026-08-14",
    time: "03:00 PM - 06:00 PM",
    location: "Auditorium B",
    type: "Competition",
    tone: "purple",
    capacity: 400,
    sold: 320,
    campus: "Main Campus",
    participants: ["ZM", "BA", "SI", "DT"],
  },
  {
    id: "evt-006",
    title: "Cultural Competition",
    description: "Celebrating diversity through poetry, drama, and traditional performances.",
    date: "2026-08-21",
    time: "04:00 PM - 08:00 PM",
    location: "Open Air Theatre",
    type: "Cultural",
    tone: "blue",
    capacity: 600,
    sold: 410,
    price: 3,
    campus: "City Campus",
    participants: ["FN", "LC", "NF", "HA"],
  },
  {
    id: "evt-007",
    title: "Educational Tour",
    description: "Field trip to the science museum and historical sites for grade 10 students.",
    date: "2026-09-05",
    time: "08:00 AM - 05:00 PM",
    location: "Off Campus",
    type: "Tour",
    tone: "orange",
    capacity: 120,
    sold: 98,
    price: 15,
    campus: "Main Campus",
    participants: ["AR", "HA", "TB", "AS"],
  },
  {
    id: "evt-008",
    title: "Sports Competition",
    description: "Annual athletics meet with track, field, and team sports events.",
    date: "2026-09-12",
    time: "07:00 AM - 03:00 PM",
    location: "Sports Ground",
    type: "Sports",
    tone: "teal",
    capacity: 800,
    sold: 520,
    campus: "Main Campus",
    participants: ["OF", "RQ", "UK", "DT", "LH"],
  },
  {
    id: "evt-009",
    title: "Farewell Reception",
    description: "Graduating class farewell dinner and awards ceremony.",
    date: "2026-09-18",
    time: "06:00 PM - 10:00 PM",
    location: "Grand Hall",
    type: "Reception",
    tone: "coral",
    capacity: 350,
    sold: 290,
    price: 10,
    campus: "Main Campus",
    participants: ["OF", "TB", "SI", "ZM"],
  },
  {
    id: "evt-010",
    title: "Midterm Orientation",
    description: "Orientation session for midterm exam guidelines and study resources.",
    date: "2026-08-25",
    time: "11:00 AM - 12:30 PM",
    location: "Lecture Hall 1",
    type: "Meeting",
    tone: "blue",
    capacity: 500,
    sold: 360,
    campus: "All Campuses",
    participants: ["AM", "KH", "SI", "AR"],
  },
];

export const classRoutine = [
  {
    id: "cr-1",
    subjects: ["Mathematics", "Physics"],
    date: "Sep 3, 2026",
    tone: "green" as EventTone,
    participants: ["AM", "AR", "DT", "HA"],
  },
  {
    id: "cr-2",
    subjects: ["Chemistry", "Biology"],
    date: "Sep 5, 2026",
    tone: "orange" as EventTone,
    participants: ["FN", "MS", "ZM", "NF"],
  },
  {
    id: "cr-3",
    subjects: ["English", "Urdu"],
    date: "Sep 7, 2026",
    tone: "purple" as EventTone,
    participants: ["SI", "FK", "LH", "AS"],
  },
  {
    id: "cr-4",
    subjects: ["Computer Science", "Economics"],
    date: "Sep 10, 2026",
    tone: "teal" as EventTone,
    participants: ["JC", "IM", "UK", "RQ"],
  },
];

export function eventToDashboardFormat(event: SchoolEvent) {
  const d = new Date(event.date);
  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const tone =
    event.tone === "green"
      ? ("teal" as const)
      : event.tone === "coral"
        ? ("coral" as const)
        : event.tone;
  return {
    id: event.id,
    day: String(d.getDate()),
    weekday: weekdays[d.getDay()],
    title: event.title,
    meta: `${event.sold}/${event.capacity} · ${event.location}`,
    progress: Math.round((event.sold / Math.max(event.capacity, 1)) * 100),
    sold: event.sold,
    capacity: event.capacity,
    moreCount: Math.max(0, event.participants.length - 3),
    tone,
  };
}

export function getEventsForDay(events: SchoolEvent[], year: number, month: number, day: number) {
  return events.filter((e) => {
    const d = new Date(e.date);
    return d.getFullYear() === year && d.getMonth() === month && d.getDate() === day;
  });
}

export function getUpcomingEvents(events: SchoolEvent[], limit = 5) {
  const today = new Date("2026-08-22");
  return events
    .filter((e) => new Date(e.date) >= today)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, limit);
}
