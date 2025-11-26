export type LessonType = "video" | "text" | "quiz";

export interface ILesson {
  _id: string;
  course: string;
  title: string;
  content: string;
  duration?: number; // minutes
  videoUrl?: string;
  resources?: string[];
  order: number;
  type: LessonType;
  createdAt: string;
  updatedAt: string;
}
