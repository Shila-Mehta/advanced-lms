// backend/src/routes/dashboard/admin.ts
import { Router, Request, Response } from "express";
import { authenticate, authorize } from "../../models/middlewares/auth.js";
import {User} from "../../models/User.js";
import Course from "../../models/Course.js";

const router = Router();

router.get("/", authenticate,authorize("admin") ,async (req: Request, res: Response) => {
  try {
    // Count total users
    const totalUsers = await User.countDocuments();
    // Count total active courses
    const activeCourses = await Course.countDocuments();
    // Recent signups (last 5)
    const recentSignups = await User.find().sort({ createdAt: -1 }).limit(5).lean();

    const platformMetrics = [
      { name: "Monthly Users", value: totalUsers, change: 10 }, // placeholder
      { name: "Course Completions", value: 0, change: 5 },      // placeholder
    ];

    const adminData = {
      totalUsers,
      activeCourses,
      systemHealth: {
        status: "healthy",
        uptime: process.uptime(),
        activeUsers: totalUsers,
      },
      recentSignups,
      platformMetrics,
    };

    res.json({ adminData });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
