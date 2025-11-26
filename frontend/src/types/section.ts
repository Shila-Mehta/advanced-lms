// Define types based on your Section model
export interface ICodeBlock {
  language: string;
  code: string;
  description?: string;
}

 export interface IQuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
}

export interface Section {
  id: string;
  lesson: string;
  title: string;
  type: "video" | "text" | "quiz" | "code" | "exercise" | "resources";
  content?: string;
  videoUrl?: string;
  code?: ICodeBlock[];
  quiz?: IQuizQuestion[];
  resources?: string[];
  order: number;
  duration?: number;
  metadata?: {
    points?: number;
    difficulty?: "beginner" | "intermediate" | "advanced";
    required?: boolean;
  };
  createdAt: string;
  updatedAt: string;
}

export interface SectionState {
  sections: Section[];
  currentSection: Section | null;
  loading: boolean;
  error: string | null;
  operationLoading: boolean;
  operationError: string | null;
  isReordering: boolean;
}
