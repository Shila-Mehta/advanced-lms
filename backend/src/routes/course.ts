import express from "express";
// Inside courseRoutes.ts
import lessonRoutes from "../routes/lesson.js";

import {
  getAllCourses,
  getCourseById,
  enrollInCourse,
  getEnrolledCourses,
  updateCourseProgress,
  createCourse,
  updateCourse,
  deleteCourse
} from "../controllers/courseController.js";
import { authenticate, authorize } from "../models/middlewares/auth.js";

const router = express.Router();

// Public routes
router.get("/", authenticate,getAllCourses);
router.get("/:courseId", getCourseById);

// Protected routes (user must be logged in)
router.post("/:courseId/enroll", authenticate, enrollInCourse);
router.get("/enrolled", authenticate, getEnrolledCourses);
router.patch("/:courseId/progress", authenticate, updateCourseProgress);

// Admin routes (only accessible by admin)
router.post("/", authenticate, authorize("instructor", "admin"), createCourse);
router.patch("/:courseId", authenticate, authorize("instructor", "admin"), updateCourse);
router.delete("/:courseId", authenticate, authorize("instructor", "admin"), deleteCourse);

router.use("/:courseId/lessons", lessonRoutes);


export default router;
