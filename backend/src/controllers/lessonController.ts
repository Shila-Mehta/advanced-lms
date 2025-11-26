import { Request, Response } from "express";
import Lesson, { ILesson } from "../models/Lesson.js";
import Course from "../models/Course.js";

// Get all lessons for a course
export const getLessonsByCourse = async (req: Request, res: Response) => {
  const { courseId } = req.params;
  try {
    const lessons: ILesson[] = await Lesson.find({ course: courseId }).sort({ order: 1 });
    res.status(200).json({ 
      success: true, 
      data: lessons 
    });
  } catch (err: any) {
    res.status(500).json({ 
      success: false, 
      message: err.message 
    });
  }
};

// Get lesson by ID
export const getLessonById = async (req: Request, res: Response) => {
  const { lessonId } = req.params;
  try {
    const lesson = await Lesson.findById(lessonId);
    if (!lesson) return res.status(404).json({ message: "Lesson not found" });
    res.status(200).json(lesson);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

// Create lesson
export const createLesson = async (req: Request, res: Response) => {
  const { courseId } = req.params;
  try {
    const newLesson = new Lesson({ ...req.body, course:courseId });
    await newLesson.save();
    res.status(201).json({ 
      success: true, 
      data: newLesson 
    });
  } catch (err: any) {
    res.status(400).json({ 
      success: false, 
      message: err.message 
    });
  }
};

// Update lesson
export const updateLesson = async (req: Request, res: Response) => {
  const {lessonId } = req.params;
  try {
    const updatedLesson = await Lesson.findByIdAndUpdate(lessonId, req.body, { new: true });
    if (!updatedLesson) return res.status(404).json({ message: "Lesson not found" });
    res.status(200).json({ 
      success: true, 
      data:updatedLesson 
    });
  } catch (err: any) {
    res.status(400).json({ 
      success: false, 
      message: err.message 
    });
  }
};

// Delete lesson
export const deleteLesson = async (req: Request, res: Response) => {
  const { lessonId } = req.params;
  try {
    await Lesson.findByIdAndDelete(lessonId);
    res.status(200).json({ success: true, message: "Lesson deleted successfully" });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};


// Mark lesson as completed
export const markLessonCompleted = async (req: Request, res: Response) => {
  
  const {courseId,lessonId } = req.params;
  

  
  try {
    // Find the course and lesson
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found"
      });
    }

    const lesson = await Lesson.findById(lessonId);
    if (!lesson) {
      return res.status(404).json({
        success: false,
        message: "Lesson not found"
      });
    }

    // // Verify the lesson belongs to the course
    // if (lesson.id !== courseId) {
    //   return res.status(400).json({
    //     success: false,
    //     message: "Lesson does not belong to this course"
    //   });
    // }

    // // Check if user is enrolled in the course
    // // You might want to add authentication middleware to get the user ID
    // const userId = req.user?.id; // Assuming you have authentication middleware
    
    // if (!userId) {
    //   return res.status(401).json({
    //     success: false,
    //     message: "User not authenticated"
    //   });
    // }

    // // // Find student progress in the course
    // const studentProgress = course.students.find(
    //   (student: any) => student.toString() === userId.toString()
    // );

    // if (!studentProgress) {
    //   return res.status(403).json({
    //     success: false,
    //     message: "User is not enrolled in this course"
    //   });
    // }

    // // // Find the lesson progress entry
    // const lessonProgress = studentProgress.progress.find(
    //   (progress: any) => progress.lesson.toString() === lessonId
    // );

    // if (lessonProgress) {
    //   // Update existing progress
    //   lessonProgress.completed = true;
    //   lessonProgress.completedAt = new Date();
    // } else {
    //   // Create new progress entry
    //   studentProgress.progress.push({
    //     lesson: lessonId, 
    //     completed: true,
    //     completedAt: new Date()
    //   });
    // }

    // Save the course with updated progress
    await course.save();

    res.status(200).json({
      success: true,
      message: "Lesson marked as completed",
      data: {
        lessonId,
        completed: true,
        completedAt: new Date()
      }
    });

  } catch (err: any) {
    console.error("Error marking lesson as completed:", err);
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};
