// models/Lesson.ts
import mongoose, { Document, Types } from "mongoose";

const { Schema, model, models } = mongoose;

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

export interface ILesson extends Document {
  course: Types.ObjectId;
  title: string;
  description?: string;
  duration?: number;
  order: number;
  type: "video" | "text" | "quiz" | "assignment" | "mixed" | "code" | "exercise" | "resources";
  videoUrl?: string;
  thumbnail?: string;
  
  // Content fields (moved from sections)
  content?: string; // For text-based lessons
  code?: ICodeBlock[]; // For code exercises
  quiz?: IQuizQuestion[]; // For quizzes
  resources?: {
    name: string;
    url: string;
    type: string;
  }[];
  
  // Metadata (moved from sections)
  metadata?: {
    difficulty?: "beginner" | "intermediate" | "advanced";
    required?: boolean;
    points?: number;
  };
  
  isPublished: boolean;
  isCompleted?: boolean; // Progress tracking
  createdAt: Date;
  updatedAt: Date;
}

const lessonSchema = new Schema<ILesson>(
  {
    course: { 
      type: Schema.Types.ObjectId, 
      ref: "Course", 
      required: true 
    },
    title: { 
      type: String, 
      required: true,
      trim: true
    },
    description: { 
      type: String,
      maxlength: 1000
    },
    duration: { 
      type: Number,
      min: 0
    },
    order: { 
      type: Number, 
      required: true,
      min: 1
    },
    type: {
      type: String,
      enum: ["video", "text", "quiz", "assignment", "mixed", "code", "exercise", "resources"],
      default: "video",
    },
    videoUrl: {
      type: String
    },
    thumbnail: {
      type: String,
      default: "/images/lessons/default-thumb.jpg"
    },
    
    // Content fields from sections
    content: { 
      type: String,
      maxlength: 10000 // For text content
    },
    code: [{
      language: String,
      code: String,
      description: String
    }],
    quiz: [{
      question: { type: String, required: true },
      options: [{ type: String, required: true }],
      correctAnswer: { type: Number, required: true, min: 0 },
      explanation: String
    }],
    
    resources: [{
      name: String,
      url: String,
      type: String
    }],
    
    // Metadata from sections
    metadata: {
      difficulty: {
        type: String,
        enum: ["beginner", "intermediate", "advanced"]
      },
      required: {
        type: Boolean,
        default: true
      },
      points: { 
        type: Number, 
        min: 0 
      }
    },
    
    isPublished: { 
      type: Boolean, 
      default: false 
    },
    isCompleted: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

// Index for better query performance
lessonSchema.index({ course: 1, order: 1 });
lessonSchema.index({ course: 1, isPublished: 1 });
lessonSchema.index({ course: 1, type: 1 });

// Transform to rename _id → id for frontend
lessonSchema.set("toJSON", {
  transform: (doc, ret: Partial<any>) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
  },
});

export default models.Lesson || model<ILesson>("Lesson", lessonSchema);