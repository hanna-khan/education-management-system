import type { Institution } from "@/types";

export const DEMO_INSTITUTIONS: Institution[] = [
  {
    id: "inst-ned-demo",
    name: "NED Demo University",
    shortName: "NED Demo",
    type: "university",
    status: "trial",
    logoInitials: "ND",
    primaryColor: "#6B58F6",
    secondaryColor: "#8C4AF2",
    city: "Karachi",
    studentCount: 8426,
    staffCount: 386,
  },
  {
    id: "inst-kec",
    name: "Karachi Education College",
    shortName: "KEC",
    type: "university",
    status: "active",
    logoInitials: "KE",
    primaryColor: "#3B82F6",
    secondaryColor: "#1BD0B4",
    city: "Karachi",
    studentCount: 4210,
    staffCount: 198,
  },
  {
    id: "inst-crescent",
    name: "Crescent Demo School",
    shortName: "Crescent",
    type: "school",
    status: "active",
    logoInitials: "CS",
    primaryColor: "#1BD0B4",
    secondaryColor: "#10B981",
    city: "Lahore",
    studentCount: 1840,
    staffCount: 112,
  },
];

export const DEFAULT_INSTITUTION_ID = "inst-ned-demo";
