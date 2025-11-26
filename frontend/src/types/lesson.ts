// types/lesson.ts
export type LessonType = "video" | "text" | "quiz" | "mixed";

export interface ILessonSection {
  id: string;
  _id:string;
  title: string;
  type: string;
  content?: string;
  videoUrl?: string;
  duration?: number;
  order?: number;
  isCompleted:any
}

// export interface ILesson {
//   id: string;
//   course: string;
//   title: string;
//   description: any;
//   duration?: number;
//   videoUrl?: string;
//   resources?: string[];
//   order: number;
//   type: LessonType;
//   createdAt: string;
//   updatedAt: string;
//   completed: boolean;
//   sections?: ILessonSection[];
//   thumbnail:any,
//   isPublished:any
// }


export interface ILesson {
  id: string;
  _id:string;
  title: string;
  description?: string;
  duration?: number;
  completed?: boolean;
  videoUrl?: string;
  order: number;
  type:any;
  resources:any;
  content:any;
  metadata:any;
}
