
// models/Course.ts
import mongoose, { Document, Types } from "mongoose";

const { Schema, model, models } = mongoose;

export interface ILessonProgress {
  lesson: Types.ObjectId;
  completed: boolean;
  completedAt?: Date;
}

export interface IInstructorInfo {
  name: string;
  title: string;
  bio: string;
  image?: string;
  rating: number;
  students: number;
  courses: number;
  experience: string;
}

export interface IReview {
  user: {
    name: string;
    avatar?: string;
  };
  rating: number;
  comment: string;
  date: Date;
}

export interface ICurriculumSection {
  section: string;
  order: number;
  lessons: {
    lesson: Types.ObjectId;
    order: number;
  }[];
}

export interface ICourse extends Document {
  title: string;
  description: string;
  instructor: string;
  instructorInfo: IInstructorInfo;
  students: { 
    student: Types.ObjectId; 
    progress: ILessonProgress[] 
  }[];
  price: number;
  originalPrice?: number;
  image?: string;
  thumbnail?: string;
  category: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: string;
  rating: number;
  reviews: IReview[];
  studentsCount: number;
  tags: string[];
  learning: string[];
  requirements: string[];
  features: string[];
  curriculum: ICurriculumSection[];
  sections: Types.ObjectId[];
  lessons: Types.ObjectId[];
  isPublished: boolean;
  isFeatured: boolean;
  language: string;
  subtitles: string[];
  certificateIncluded: boolean;
  lifetimeAccess: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const courseSchema = new Schema<ICourse>(
  {
    title: { 
      type: String, 
      required: true, 
      trim: true,
      maxlength: 100
    },
    description: { 
      type: String, 
      required: true, 
      maxlength: 2000 
    },
    instructor: {
      type: String,
      required: true
    },
    instructorInfo: {
      name: { type: String, required: true },
      title: { type: String, required: true },
      bio: { type: String, required: true },
      image: { type: String, default: "/images/instructors/default.jpg" },
      rating: { type: Number, default: 0, min: 0, max: 5 },
      students: { type: Number, default: 0 },
      courses: { type: Number, default: 0 },
      experience: { type: String, required: true }
    },
    students: [
      {
        student: { 
          type: Schema.Types.ObjectId, 
          ref: "User" 
        },
        progress: [
          {
            lesson: { 
              type: Schema.Types.ObjectId, 
              ref: "Lesson" 
            },
            completed: { 
              type: Boolean, 
              default: false 
            },
            completedAt: Date,
          },
        ],
      },
    ],
    price: { 
      type: Number, 
      required: true,
      min: 0
    },
    originalPrice: { 
      type: Number,
      min: 0
    },
    image: { 
      type: String, 
      default: "/images/courses/default-course.jpg" 
    },
    thumbnail: { 
      type: String, 
      default: "/images/courses/default-course-thumb.jpg" 
    },
    category: { 
      type: String, 
      required: true 
    },
    level: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced'],
      default: 'Beginner'
    },
    duration: {
      type: String,
      default: '0 hours'
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    reviews: [
      {
        user: {
          name: { type: String, required: true },
          avatar: { type: String, default: "/images/avatars/default.jpg" }
        },
        rating: { 
          type: Number, 
          required: true,
          min: 1,
          max: 5
        },
        comment: { 
          type: String, 
          required: true,
          maxlength: 1000
        },
        date: { 
          type: Date, 
          default: Date.now 
        }
      }
    ],
    studentsCount: {
      type: Number,
      default: 0
    },
    tags: [{
      type: String,
      trim: true
    }],
    learning: [{
      type: String,
      trim: true,
      maxlength: 200
    }],
    requirements: [{
      type: String,
      trim: true,
      maxlength: 200
    }],
    features: [{
      type: String,
      trim: true,
      maxlength: 100
    }],
    curriculum: [
      {
        section: { type: String, required: true },
        order: { type: Number, required: true },
        lessons: [
          {
            lesson: { 
              type: Schema.Types.ObjectId, 
              ref: "Lesson" 
            },
            order: { 
              type: Number, 
              required: true 
            }
          }
        ]
      }
    ],
   
    lessons: [{
      type: Schema.Types.ObjectId,
      ref: "Lesson"
    }],
    isPublished: { 
      type: Boolean, 
      default: false 
    },
    isFeatured: {
      type: Boolean,
      default: false
    },
    language: {
      type: String,
      default: "English"
    },
    subtitles: [{
      type: String
    }],
    certificateIncluded: {
      type: Boolean,
      default: true
    },
    lifetimeAccess: {
      type: Boolean,
      default: true
    }
  },
  { 
    timestamps: true
  }
);

// Index for better query performance
courseSchema.index({ isPublished: 1, isFeatured: 1 });
courseSchema.index({ category: 1, level: 1 });
courseSchema.index({ rating: -1, studentsCount: -1 });
courseSchema.index({ "instructorInfo.name": "text", title: "text", description: "text" });

// Pre-save middleware to update studentsCount
courseSchema.pre('save', function(next) {
  this.studentsCount = this.students.length;
  next();
});

// Static method to find featured courses
courseSchema.statics.findFeatured = function() {
  return this.find({ isPublished: true, isFeatured: true })
    .sort({ rating: -1, studentsCount: -1 })
    .limit(10);
};

// Static method to find courses by category
courseSchema.statics.findByCategory = function(category: string) {
  return this.find({ isPublished: true, category })
    .sort({ rating: -1, studentsCount: -1 });
};

// Transform to rename _id → id for frontend
courseSchema.set("toJSON", {
  transform: (doc, ret: Partial<any>) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
  },
});

export default models.Course || model<ICourse>("Course", courseSchema);