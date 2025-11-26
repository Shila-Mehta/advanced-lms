// routes/lessonRoutes.ts
import express from 'express';
import {
  getLessonsByCourse,
  getLessonById,
  createLesson,
  updateLesson,
  deleteLesson,
  markLessonCompleted
} from '../controllers/lessonController.js';
import { authenticate } from '../models/middlewares/auth.js'; // Add authentication middleware

const router = express.Router({ mergeParams: true });

// Public routes
router.get('/course/:courseId', getLessonsByCourse);
router.get('/:lessonId', getLessonById);

// Protected routes (require authentication)
router.post('/course/:courseId', authenticate, createLesson);
router.put('/:lessonId', authenticate, updateLesson);
router.delete('/:lessonId', authenticate, deleteLesson);

// Progress route
router.post('/:lessonId/complete', authenticate, markLessonCompleted);

export default router;