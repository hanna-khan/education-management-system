import type { User } from "@/types";

export const DEMO_USERS: Record<string, User> = {
  admin: {
    id: "user-admin",
    name: "Ayesha Malik",
    email: "ayesha.malik@neddemo.edu.pk",
    role: "institution_admin",
    institutionId: "inst-ned-demo",
    department: "Administration",
    title: "Institution Administrator",
  },
  principal: {
    id: "user-principal",
    name: "Dr. Hassan Raza",
    email: "hassan.raza@neddemo.edu.pk",
    role: "principal",
    institutionId: "inst-ned-demo",
    department: "Administration",
    title: "Principal",
  },
  teacher: {
    id: "user-teacher",
    name: "Sana Iqbal",
    email: "sana.iqbal@neddemo.edu.pk",
    role: "teacher",
    institutionId: "inst-ned-demo",
    department: "Computer Science",
    title: "Assistant Professor",
  },
  student: {
    id: "user-student",
    name: "Ahmed Khan",
    email: "ahmed.khan@student.neddemo.edu.pk",
    role: "student",
    institutionId: "inst-ned-demo",
    department: "Computer Science",
    title: "BS Computer Science — Semester 6",
  },
  parent: {
    id: "user-parent",
    name: "Sara Ahmed",
    email: "sara.ahmed@gmail.com",
    role: "parent",
    institutionId: "inst-crescent",
    title: "Parent",
  },
  platform: {
    id: "user-platform",
    name: "Usman Ali",
    email: "usman@zendrock.io",
    role: "platform_admin",
    institutionId: "inst-ned-demo",
    title: "Platform Administrator",
  },
};

export const DEFAULT_DEMO_USER_KEY = "admin";
