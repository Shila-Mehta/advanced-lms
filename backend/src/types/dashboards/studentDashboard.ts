
export interface StudentDashboardCourse {
  _id: string;
  title: string;
  progressPercent: number;
  instructorName?: string;
  courseImage?: string;
}

export interface StudentDashboardDeadline {
  _id: string;
  courseId: string;
  title: string;
  dueDate: string;
  completed: boolean;
}

export interface StudentDashboardCertificate {
  courseId: string;
  issuedAt: string;
  certificateUrl: string;
}

export interface StudentDashboardData {
  courses: StudentDashboardCourse[];
  deadlines: StudentDashboardDeadline[];
  certificates: StudentDashboardCertificate[];
}
