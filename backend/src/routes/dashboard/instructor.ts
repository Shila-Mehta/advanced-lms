// backend/src/routes/dashboard/instructor.ts
import { Router, Request, Response } from "express";
import { authenticate, authorize } from "../../models/middlewares/auth.js";
import Course from "../../models/Course.js";
import Activity from "../../models/Activity.js";

const router = Router();

router.get("/", authenticate, authorize("instructor"), async (req: Request, res: Response) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Unauthorized: user not found" });
    }
    const userId = req.user.id;

    // Fetch courses taught by instructor
    const courses = await Course.find({ instructorId: userId }).lean();

    // Total students across all courses
    const totalStudents = courses.reduce((acc, c) => acc + (c.studentsEnrolled?.length || 0), 0);

    // Example: fetch last 10 activities of all students in instructor's courses
    const activities = await Activity.find({ courseId: { $in: courses.map(c => c._id) } })
      .sort({ timestamp: -1 })
      .limit(10)
      .lean();

    const instructorData = {
      totalCourses: courses.length,
      activeStudents: totalStudents,
      pendingAssignments: 0, // optional: calculate from Assignment model
      rating:5,
      courseAnalytics: courses.map(c => ({
        courseId: c._id,
        courseName: c.title,
        enrollment: c.studentsEnrolled?.length || 0,
        completionRate: 0, // optional
        averageGrade: 0,   // optional
      })),
      studentEngagement: [
        { metric: "Course Completion", value: 0, trend: "up" }, // placeholder
        { metric: "Assignment Submission", value: 0, trend: "stable" },
      ],
    };

    res.json({ courses, activities, instructorData });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
