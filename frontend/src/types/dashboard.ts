import { User } from "./user";
import { Course } from "./course";

export interface DashboardState {
  userData: User | null;
  courses: Course[];
  deadlines: Deadline[];
  activities: Activity[];
  recommendations: Recommendation[];
  studentData?: StudentData;
  instructorData?: InstructorData;
  adminData?: AdminData;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

// Role-specific data
export interface StudentData {
  totalCourses: number; // total enrolled courses
  completedCourses: number;
  points: number;       // points earned
  averageGrade?: number;
  upcomingExams: Exam[];
  studyGroups: StudyGroup[];
}


export interface InstructorData {
  rating: any;
  totalCourses: number;
  activeStudents: number;
  pendingAssignments: number;
  courseAnalytics: CourseAnalytic[];
  studentEngagement: EngagementMetric[];
}

export interface AdminData {
  totalUsers: number;
  activeCourses: number;
  systemHealth: SystemHealth;
  recentSignups: User[];
  platformMetrics: PlatformMetric[];
}

// Other dashboard entities
export interface Deadline {
  id: string;
  title: string;
  date: string; // ISO string from API
  course: string;
}

export interface Activity {
  id: string;
  type: 'access' | 'message' | 'notification';
  title: string;
  description: string;
  timestamp: string; // ISO string
  course?: string;
}

export interface Recommendation {
  id: string;
  title: string;
  action: string;
}

export interface Exam {
  id: string;
  title: string;
  course: string;
  date: string; // ISO string
  duration: number;
}

export interface StudyGroup {
  id: string;
  name: string;
  course: string;
  members: number;
  nextMeeting: string; // ISO string
}

export interface CourseAnalytic {
  courseId: string;
  courseName: string;
  enrollment: number;
  completionRate: number;
  averageGrade: number;
}

export interface EngagementMetric {
  metric: string;
  value: number;
  trend: 'up' | 'down' | 'stable';
}

export interface SystemHealth {
  status: 'healthy' | 'degraded' | 'down';
  uptime: number;
  activeUsers: number;
}

export interface PlatformMetric {
  name: string;
  value: number;
  change: number;
}
