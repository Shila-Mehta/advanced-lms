import { ILesson } from "@/types/lesson";
import { Review } from "@/types/review";


export interface Course {
  id:string;
  _id:string;
  title: string;
  description: string;
  instructor: string;
  rating: number;
  reviews: Review [];
  students: number;
  duration: string;
  level: string;
  category: string;
  price: number;
  image: string;
  learning?: string[];
  requirements: string[];
  tags: string[];
  isPublished: boolean;
  progress?: number;
  completed?: boolean;
  createdAt?: string;
  updatedAt?: string;
  instructorInfo: {
    name: string;
    title: string;
    bio: string;
    image: string;
    rating: number;
    students: number;
    courses: number;
    experience: string;
  };
  originalPrice?: number;
  thumbnail?: string;
  features: string[];
  curriculum: any[];
  isFeatured: boolean;
  language: string;
  certificateIncluded: boolean;
  lifetimeAccess: boolean;
  studentsCount: number;
}


// Filter type
export interface CourseFilter {
  category: string;
  level: CourseLevel | 'all';
  search: string;
}

export type CourseLevel = 'beginner' | 'intermediate' | 'advanced';


export interface CourseState {
  courses: Course[];
  enrolledCourses: Course[];
  currentCourse: Course | null;
  lessons: ILesson[];
  loading: boolean;
  error: string | null;
  filter: CourseFilter;
}




export interface CourseForm {
  title: string;
  description: string;
  price: number;
  category: string;
  instructors: string[];
  courseImage: string;
  isPublished: boolean;
  tags: string[];
}


// export interface CourseState {
//   courses: Course[];
//   enrolledCourses: Course[];
//   currentCourse: Course | null;
//   lessons: ILesson[];
//   loading: boolean;
//   error: string | null;
//   filter: CourseFilter;
// }



export interface Enrollment {
  id: string;
  courseId: string;
  userId: string;
  enrolledAt: string; // API returns ISO string
  progress: number;
  completed: boolean;
  currentLesson:any

}



