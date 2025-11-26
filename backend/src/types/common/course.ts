export interface CourseType {
  _id: string;
  title: string;
  description: string;
  instructorId: string;
  lessonsCount?: number;
  courseImage?: string;
}
