// backend/src/routes/dashboard/student.ts
import { Router, Request, Response } from "express";
import { authenticate } from "../../models/middlewares/auth.js";
import Course from "../../models/Course.js";
import Deadline from "../../models/Deadline.js";
import Activity from "../../models/Activity.js"; // <- fixed casing

const router = Router();

router.get("/", authenticate, async (req: Request, res: Response) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Unauthorized: User not found" });
    }
    const userId = req.user.id;

    // Fetch courses enrolled by student
    const courses = await Course.find({ studentsEnrolled: userId }).lean();

    // Fetch deadlines for student's courses
    const deadlines = await Deadline.find({ courseId: { $in: courses.map(c => c._id) } }).lean();

    // Fetch last 10 activities of the student
    const activities = await Activity.find({ userId }).sort({ timestamp: -1 }).limit(10).lean();

    // Sample recommendations
    const recommendations = [
      { id: "1", title: "Machine Learning", action: "Continue Learning" },
      { id: "2", title: "React Basics", action: "Take Quiz" },
    ];

    // Student-specific dashboard data
    const studentData = {
      totalCourses: courses.length,
      completedCourses: courses.filter(c => c.progress === 100).length,
      points: courses.reduce((acc, c) => acc + (c.points || 0), 0), // sum points if you have points field
      averageGrade: courses.length
        ? courses.reduce((acc, c) => acc + (c.averageGrade || 0), 0) / courses.length
        : 0,
      upcomingExams: [], // optional, can fetch from another collection if you track exams
      studyGroups: [],   // optional, can fetch from studyGroups collection
    };

    res.json({ courses, deadlines, activities, recommendations, studentData });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
