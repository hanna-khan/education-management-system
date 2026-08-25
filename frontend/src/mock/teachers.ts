export interface TeacherProfile {
  id: string;
  name: string;
  subject: string;
  department: string;
  designation: string;
  status: "active" | "on_leave" | "critical";
  email: string;
  phone: string;
  age: number;
  gender: string;
  dateOfBirth: string;
  address: string;
  about: string;
  joinDate: string;
  avatarInitials: string;
  avatarColor: string;
  rating: number;
  classesCount: number;
  studentsCount: number;
}

export interface TeacherEducation {
  degree: string;
  field: string;
  institution: string;
  year: string;
  grade?: string;
}

export interface TeacherQualification {
  title: string;
  issuer: string;
  year: string;
  type: "certificate" | "license" | "award";
}

export interface TeacherExperience {
  role: string;
  organization: string;
  from: string;
  to: string;
  description: string;
}

export interface TeacherDocument {
  id: string;
  name: string;
  category: "resume" | "degree" | "certificate" | "id" | "other";
  size: string;
  uploadedAt: string;
  status: "verified" | "pending" | "rejected";
}

export interface TeacherFullProfile extends TeacherProfile {
  employeeId: string;
  nationality: string;
  bloodGroup: string;
  emergencyContact: string;
  education: TeacherEducation[];
  qualifications: TeacherQualification[];
  experience: TeacherExperience[];
  documents: TeacherDocument[];
  skills: string[];
  languages: string[];
}

export const mockTeachers: TeacherProfile[] = [
  {
    id: "tch-001",
    name: "Angela Moss",
    subject: "Science",
    department: "Natural Sciences",
    designation: "Senior Teacher",
    status: "active",
    email: "angela.moss@school.edu",
    phone: "+92 300 1234567",
    age: 31,
    gender: "Female",
    dateOfBirth: "2 June 1992",
    address: "35 Boulevard de Bastille, 75011 Paris",
    about: "Passionate science educator with 8 years of experience fostering curiosity and hands-on learning in biology and chemistry.",
    joinDate: "2018-08-15",
    avatarInitials: "AM",
    avatarColor: "#6B58F6",
    rating: 4.9,
    classesCount: 5,
    studentsCount: 142,
  },
  {
    id: "tch-002",
    name: "Dr. Kamran Hussain",
    subject: "Mathematics",
    department: "Computer Science",
    designation: "Professor",
    status: "active",
    email: "kamran.hussain@school.edu",
    phone: "+92 321 9876543",
    age: 42,
    gender: "Male",
    dateOfBirth: "14 March 1984",
    address: "Block 7, Clifton, Karachi",
    about: "Expert in applied mathematics and data structures with a focus on bridging theory and real-world problem solving.",
    joinDate: "2019-03-01",
    avatarInitials: "KH",
    avatarColor: "#1BD0B4",
    rating: 4.8,
    classesCount: 4,
    studentsCount: 118,
  },
  {
    id: "tch-003",
    name: "Sana Iqbal",
    subject: "English",
    department: "Humanities",
    designation: "Assistant Professor",
    status: "active",
    email: "sana.iqbal@school.edu",
    phone: "+92 333 5551234",
    age: 29,
    gender: "Female",
    dateOfBirth: "18 November 1996",
    address: "Gulberg III, Lahore",
    about: "Literature specialist helping students develop critical reading and expressive writing skills.",
    joinDate: "2020-08-15",
    avatarInitials: "SI",
    avatarColor: "#F4901F",
    rating: 4.7,
    classesCount: 6,
    studentsCount: 156,
  },
  {
    id: "tch-004",
    name: "Dr. Farah Naz",
    subject: "Chemistry",
    department: "Natural Sciences",
    designation: "Associate Professor",
    status: "critical",
    email: "farah.naz@school.edu",
    phone: "+92 345 7778899",
    age: 38,
    gender: "Female",
    dateOfBirth: "5 July 1988",
    address: "F-7 Markaz, Islamabad",
    about: "Research-oriented chemist with emphasis on lab safety and experimental design for senior students.",
    joinDate: "2018-01-10",
    avatarInitials: "FN",
    avatarColor: "#FF394B",
    rating: 4.6,
    classesCount: 3,
    studentsCount: 89,
  },
  {
    id: "tch-005",
    name: "Ahmed Raza",
    subject: "Physics",
    department: "Natural Sciences",
    designation: "Teacher",
    status: "active",
    email: "ahmed.raza@school.edu",
    phone: "+92 312 4445566",
    age: 35,
    gender: "Male",
    dateOfBirth: "22 January 1991",
    address: "DHA Phase 5, Karachi",
    about: "Physics instructor specializing in mechanics and optics with interactive demonstration methods.",
    joinDate: "2021-02-01",
    avatarInitials: "AR",
    avatarColor: "#3B82F6",
    rating: 4.5,
    classesCount: 4,
    studentsCount: 112,
  },
  {
    id: "tch-006",
    name: "Maria Santos",
    subject: "Biology",
    department: "Natural Sciences",
    designation: "Teacher",
    status: "on_leave",
    email: "maria.santos@school.edu",
    phone: "+92 300 8889900",
    age: 33,
    gender: "Female",
    dateOfBirth: "9 September 1992",
    address: "Bahria Town, Rawalpindi",
    about: "Biology teacher with expertise in ecology and human anatomy, currently on medical leave.",
    joinDate: "2019-09-01",
    avatarInitials: "MS",
    avatarColor: "#8C4AF2",
    rating: 4.4,
    classesCount: 5,
    studentsCount: 134,
  },
  {
    id: "tch-007",
    name: "James Cooper",
    subject: "Computer Science",
    department: "Computer Science",
    designation: "Programmer",
    status: "active",
    email: "james.cooper@school.edu",
    phone: "+92 321 2223344",
    age: 28,
    gender: "Male",
    dateOfBirth: "30 April 1998",
    address: "Model Town, Lahore",
    about: "Full-stack developer turned educator teaching programming fundamentals and web development.",
    joinDate: "2022-01-15",
    avatarInitials: "JC",
    avatarColor: "#1BD0B4",
    rating: 4.9,
    classesCount: 3,
    studentsCount: 96,
  },
  {
    id: "tch-008",
    name: "Fatima Khan",
    subject: "Urdu",
    department: "Humanities",
    designation: "Teacher",
    status: "active",
    email: "fatima.khan@school.edu",
    phone: "+92 333 1112233",
    age: 36,
    gender: "Female",
    dateOfBirth: "12 August 1990",
    address: "Saddar, Karachi",
    about: "Urdu language and literature teacher promoting classical and contemporary Pakistani poetry.",
    joinDate: "2017-06-01",
    avatarInitials: "FK",
    avatarColor: "#F4901F",
    rating: 4.3,
    classesCount: 5,
    studentsCount: 148,
  },
  {
    id: "tch-009",
    name: "Dr. Imran Malik",
    subject: "Economics",
    department: "Business Administration",
    designation: "Professor",
    status: "critical",
    email: "imran.malik@school.edu",
    phone: "+92 345 6667788",
    age: 45,
    gender: "Male",
    dateOfBirth: "3 December 1980",
    address: "Blue Area, Islamabad",
    about: "Economics professor covering micro and macroeconomics; flagged for pending performance review.",
    joinDate: "2021-02-01",
    avatarInitials: "IM",
    avatarColor: "#FF394B",
    rating: 3.8,
    classesCount: 2,
    studentsCount: 67,
  },
  {
    id: "tch-010",
    name: "Lisa Chen",
    subject: "Art & Design",
    department: "Fine Arts",
    designation: "Teacher",
    status: "active",
    email: "lisa.chen@school.edu",
    phone: "+92 300 5556677",
    age: 27,
    gender: "Female",
    dateOfBirth: "25 May 1999",
    address: "Defence, Karachi",
    about: "Creative arts instructor specializing in digital illustration and visual communication.",
    joinDate: "2023-03-01",
    avatarInitials: "LC",
    avatarColor: "#6B58F6",
    rating: 4.8,
    classesCount: 4,
    studentsCount: 88,
  },
  {
    id: "tch-011",
    name: "Omar Siddiqui",
    subject: "Islamiat",
    department: "Humanities",
    designation: "Teacher",
    status: "active",
    email: "omar.siddiqui@school.edu",
    phone: "+92 321 9990011",
    age: 40,
    gender: "Male",
    dateOfBirth: "17 February 1986",
    address: "Johar Town, Lahore",
    about: "Islamic studies teacher with a focus on ethics, history, and comparative religion.",
    joinDate: "2016-04-01",
    avatarInitials: "OS",
    avatarColor: "#3B82F6",
    rating: 4.2,
    classesCount: 6,
    studentsCount: 172,
  },
  {
    id: "tch-012",
    name: "Priya Sharma",
    subject: "Geography",
    department: "Social Sciences",
    designation: "Teacher",
    status: "active",
    email: "priya.sharma@school.edu",
    phone: "+92 333 4445566",
    age: 32,
    gender: "Female",
    dateOfBirth: "8 October 1993",
    address: "Satellite Town, Rawalpindi",
    about: "Geography educator integrating GIS tools and environmental awareness into the curriculum.",
    joinDate: "2020-01-20",
    avatarInitials: "PS",
    avatarColor: "#1BD0B4",
    rating: 4.6,
    classesCount: 4,
    studentsCount: 105,
  },
];

export const teacherSubjects = [...new Set(mockTeachers.map((t) => t.subject))];

export function getTeachersBySubject(subject: string) {
  return mockTeachers.filter((t) => t.subject === subject);
}

export function getTeacherById(id: string) {
  return mockTeachers.find((t) => t.id === id);
}

export function getTeacherFullProfile(id: string): TeacherFullProfile | undefined {
  const teacher = getTeacherById(id);
  if (!teacher) return undefined;

  const yearsExp = Math.max(2, new Date().getFullYear() - new Date(teacher.joinDate).getFullYear());

  return {
    ...teacher,
    employeeId: `EMP-${teacher.id.replace("tch-", "").toUpperCase()}`,
    nationality: "Pakistani",
    bloodGroup: teacher.gender === "Female" ? "B+" : "O+",
    emergencyContact: teacher.phone.replace(/\d{4}$/, "8899"),
    education: [
      {
        degree: teacher.designation.includes("Professor") || teacher.name.startsWith("Dr.")
          ? "PhD"
          : "M.Ed / Masters",
        field: teacher.subject,
        institution: "University of Karachi",
        year: String(2010 + (yearsExp % 8)),
        grade: "Distinction",
      },
      {
        degree: "Bachelor of Education (B.Ed)",
        field: teacher.subject,
        institution: "Institute of Education & Research",
        year: String(2006 + (yearsExp % 6)),
        grade: "A",
      },
      {
        degree: "Higher Secondary Certificate",
        field: "Science / Arts",
        institution: "Government College",
        year: String(2002 + (yearsExp % 5)),
      },
    ],
    qualifications: [
      {
        title: `${teacher.subject} Teaching Certificate`,
        issuer: "Provincial Education Board",
        year: String(2015 + (yearsExp % 5)),
        type: "certificate",
      },
      {
        title: "Classroom Management Workshop",
        issuer: "Edu-Center Academy",
        year: "2024",
        type: "certificate",
      },
      {
        title: "Professional Teaching License",
        issuer: "Ministry of Education",
        year: String(2016 + (yearsExp % 4)),
        type: "license",
      },
      {
        title: "Excellence in Teaching Award",
        issuer: "School Board",
        year: "2025",
        type: "award",
      },
    ],
    experience: [
      {
        role: teacher.designation,
        organization: "Edu-Center School",
        from: teacher.joinDate.slice(0, 4),
        to: "Present",
        description: `Leading ${teacher.subject} curriculum and mentoring ${teacher.studentsCount}+ students across ${teacher.classesCount} classes.`,
      },
      {
        role: "Subject Teacher",
        organization: "City Model School",
        from: String(Number(teacher.joinDate.slice(0, 4)) - 3),
        to: teacher.joinDate.slice(0, 4),
        description: `Taught ${teacher.subject} with focus on assessment design and parent engagement.`,
      },
      {
        role: "Teaching Assistant",
        organization: "University Department of Education",
        from: String(Number(teacher.joinDate.slice(0, 4)) - 5),
        to: String(Number(teacher.joinDate.slice(0, 4)) - 3),
        description: "Assisted faculty with labs, tutorials, and student counseling.",
      },
    ],
    documents: [
      {
        id: `${teacher.id}-resume`,
        name: `${teacher.name.replace(/\s+/g, "_")}_Resume.pdf`,
        category: "resume",
        size: "1.2 MB",
        uploadedAt: "2026-07-15",
        status: "verified",
      },
      {
        id: `${teacher.id}-degree`,
        name: "Highest_Degree_Certificate.pdf",
        category: "degree",
        size: "860 KB",
        uploadedAt: "2026-06-02",
        status: "verified",
      },
      {
        id: `${teacher.id}-cert`,
        name: "Teaching_Certificate.pdf",
        category: "certificate",
        size: "540 KB",
        uploadedAt: "2026-06-02",
        status: "verified",
      },
      {
        id: `${teacher.id}-cnic`,
        name: "National_ID_CNIC.pdf",
        category: "id",
        size: "320 KB",
        uploadedAt: "2026-05-20",
        status: "verified",
      },
      {
        id: `${teacher.id}-exp`,
        name: "Experience_Letter.pdf",
        category: "other",
        size: "410 KB",
        uploadedAt: "2026-08-01",
        status: teacher.status === "critical" ? "pending" : "verified",
      },
    ],
    skills: [
      teacher.subject,
      "Curriculum Design",
      "Student Assessment",
      "Classroom Management",
      "Parent Communication",
      "Digital Learning Tools",
    ],
    languages: ["English", "Urdu", teacher.subject === "Urdu" ? "Arabic" : "Regional"],
  };
}

