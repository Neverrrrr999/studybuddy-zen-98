import noteCalculus from "@/assets/note-calculus.jpg";
import noteBiology from "@/assets/note-biology.jpg";
import notePhysics from "@/assets/note-physics.jpg";

/**
 * Mock data for the UI stage. Replace these arrays with LocalStorage /
 * IndexedDB reads later — the shapes are intentionally simple and flat.
 */

export type Priority = "high" | "medium" | "low";

export type Subject = {
  id: string;
  name: string;
  description: string;
  progress: number;
  studyMinutes: number;
};

export type Note = {
  id: string;
  title: string;
  content: string;
  subjectId: string;
  updatedAt: string;
  images: string[];
};

export type Task = {
  id: string;
  title: string;
  subjectId: string;
  dueDate: string;
  priority: Priority;
  completed: boolean;
};

export type Exam = {
  id: string;
  name: string;
  subjectId: string;
  date: string;
  daysLeft: number;
};

export type StudySession = {
  id: string;
  subjectId: string;
  minutes: number;
  startedAt: string;
};

export const student = { name: "Maya", streakDays: 12 };

export const subjects: Subject[] = [
  {
    id: "calculus",
    name: "Calculus II",
    description: "Integrals, series and differential equations.",
    progress: 68,
    studyMinutes: 940,
  },
  {
    id: "biology",
    name: "Cell Biology",
    description: "Membranes, transport and the cell cycle.",
    progress: 74,
    studyMinutes: 720,
  },
  {
    id: "physics",
    name: "Physics — Waves",
    description: "Oscillations, wave mechanics and optics lab.",
    progress: 52,
    studyMinutes: 610,
  },
  {
    id: "history",
    name: "Modern History",
    description: "Revolutions, empires and the 20th century.",
    progress: 41,
    studyMinutes: 380,
  },
  {
    id: "spanish",
    name: "Spanish B2",
    description: "Vocabulary sets, oral practice and grammar drills.",
    progress: 33,
    studyMinutes: 260,
  },
];

export const notes: Note[] = [
  {
    id: "n1",
    title: "Integration techniques",
    content:
      "LIATE rule for integration by parts, plus three worked examples from the chapter 7 problem set. Remember to check for u-substitution first.",
    subjectId: "calculus",
    updatedAt: "2 hours ago",
    images: [noteCalculus, notePhysics, noteBiology],
  },
  {
    id: "n2",
    title: "Cell transport summary",
    content:
      "Passive vs. active transport, tonicity examples and the sodium-potassium pump cycle sketched from the lecture slides.",
    subjectId: "biology",
    updatedAt: "Yesterday",
    images: [noteBiology],
  },
  {
    id: "n3",
    title: "Wave mechanics — lab 4",
    content:
      "Standing waves on a string: node spacing measurements, tension vs. frequency table and the error analysis notes.",
    subjectId: "physics",
    updatedAt: "2 days ago",
    images: [notePhysics, noteCalculus],
  },
  {
    id: "n4",
    title: "Tang trade routes outline",
    content:
      "Essay outline: silk road logistics, tributary system, cultural exchange. Three sources still to cite.",
    subjectId: "history",
    updatedAt: "4 days ago",
    images: [],
  },
  {
    id: "n5",
    title: "Vocab list 12",
    content:
      "Twenty words with example sentences, plus the irregular preterite verbs I keep mixing up.",
    subjectId: "spanish",
    updatedAt: "5 days ago",
    images: [],
  },
];

export const tasks: Task[] = [
  {
    id: "t1",
    title: "Review integration formulas",
    subjectId: "calculus",
    dueDate: "Today · 13:30",
    priority: "high",
    completed: true,
  },
  {
    id: "t2",
    title: "Finish lab report §3",
    subjectId: "physics",
    dueDate: "Today · 16:00",
    priority: "high",
    completed: false,
  },
  {
    id: "t3",
    title: "Flashcards: cell membrane",
    subjectId: "biology",
    dueDate: "Today · 18:15",
    priority: "medium",
    completed: false,
  },
  {
    id: "t4",
    title: "Summarize lecture 9 notes",
    subjectId: "biology",
    dueDate: "Tomorrow",
    priority: "medium",
    completed: false,
  },
  {
    id: "t5",
    title: "Solve problems 12–18",
    subjectId: "calculus",
    dueDate: "Thu · 09:00",
    priority: "high",
    completed: false,
  },
  {
    id: "t6",
    title: "Outline Tang trade essay",
    subjectId: "history",
    dueDate: "Fri · 12:00",
    priority: "low",
    completed: false,
  },
  {
    id: "t7",
    title: "Spanish oral practice",
    subjectId: "spanish",
    dueDate: "Yesterday",
    priority: "medium",
    completed: true,
  },
  {
    id: "t8",
    title: "Read chapter 4 — photosynthesis",
    subjectId: "biology",
    dueDate: "2 days ago",
    priority: "low",
    completed: true,
  },
];

export const exams: Exam[] = [
  {
    id: "e1",
    name: "Calculus II Midterm",
    subjectId: "calculus",
    date: "Fri, 20 March · 09:00",
    daysLeft: 3,
  },
  {
    id: "e2",
    name: "Modern History Essay Exam",
    subjectId: "history",
    date: "Thu, 26 March · 11:00",
    daysLeft: 9,
  },
  {
    id: "e3",
    name: "Organic Chemistry Quiz 4",
    subjectId: "biology",
    date: "Tue, 31 March · 14:30",
    daysLeft: 14,
  },
];

export const todaySessions: StudySession[] = [
  { id: "s1", subjectId: "calculus", minutes: 50, startedAt: "08:40" },
  { id: "s2", subjectId: "biology", minutes: 25, startedAt: "10:15" },
  { id: "s3", subjectId: "physics", minutes: 45, startedAt: "13:05" },
];

export const weeklyStudy = [
  { day: "Mon", minutes: 120 },
  { day: "Tue", minutes: 165 },
  { day: "Wed", minutes: 90 },
  { day: "Thu", minutes: 180 },
  { day: "Fri", minutes: 135 },
  { day: "Sat", minutes: 60 },
  { day: "Sun", minutes: 145 },
];

export const subjectName = (id: string) =>
  subjects.find((s) => s.id === id)?.name ?? "General";

export const formatMinutes = (minutes: number) => {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return h ? `${h}h ${m ? `${m}m` : ""}`.trim() : `${m}m`;
};
