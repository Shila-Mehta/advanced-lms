export type UserRole = 'student' | 'instructor' | 'admin';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
  joinDate?: Date;
  bio?: string;
}

export interface Student extends User {
  role: 'student';
  points: number;
  enrolledCourses: CourseID[];
  completedCourses: CourseID[];
}

export interface Instructor extends User {
  role: 'instructor';
  coursesTeaching: CourseID[];
  totalStudents: number;
  rating?: number;
}

export interface Admin extends User {
  role: 'admin';
  permissions: Permission[];
}

// Reusable types
export type CourseID = string;
export type Permission = 'manageUsers' | 'editCourses' | 'viewReports' | string;
