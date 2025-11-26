import { Request, Response } from "express";
import Course from "../models/Course.js";
import { User } from "../models/User.js";



// In your createCourse controller
export const createCourse = async (req: Request, res: Response) => {
  try {
    const { instructors, ...courseData } = req.body;

    // Simple validation - check if instructors exist
    const instructorUsers = await User.find({
      _id: { $in: instructors },
      role: "instructor"
    });

    if (instructorUsers.length === 0) {
      return res.status(400).json({
        message: "At least one valid instructor is required"
      });
    }

    // Create course with instructor IDs
    const course = await Course.create({
      ...courseData,
      instructors
    });

    res.status(201).json({ success: true, data: course });
  } catch (error) {
    res.status(500).json({ message: "Failed to create course" });
  }
};

// ✅ Update an existing course (Instructor/Admin only)
export const updateCourse = async (req: Request, res: Response) => {
  try {
    const userRole = req.user?.role;
    const { courseId } = req.params;

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: "Course not found" });

    // Only admin or instructor who owns the course can update
    if (
      userRole !== "admin" &&
      (!req.user || !course.instructors.includes(req.user.id))
    ) {
      return res.status(403).json({ message: "Not authorized to update this course" });
    }
    console.log(req.body);
    Object.assign(course, req.body);
    await course.save();

    res.json({ message: "Course updated successfully", course });
  } catch (error) {
    res.status(500).json({ message: "Failed to update course" });
  }
};

// ✅ Delete a course (Instructor/Admin only)
export const deleteCourse = async (req: Request, res: Response) => {
  try {
    const userRole = req.user?.role;
    const { courseId } = req.params;

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: "Course not found" });

    if (
      userRole !== "admin" &&
      (!req.user || !course.instructors.includes(req.user.id))
    ) {
      return res.status(403).json({ message: "Not authorized to delete this course" });
    }

    await course.deleteOne();
    res.json({ message: "Course deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete course" });
  }
};



export const getAllCourses = async (req: Request, res: Response) => {
  try {
    // Fetch all courses from the database
    const courses = await Course.find();

    // Send them as JSON response
    res.json(courses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch courses" });
  }
};



// ✅ Get course by ID (with populated data - including resources)
export const getCourseById = async (req: Request, res: Response) => {
  try {
    const { courseId } = req.params;

    const course = await Course.findById(courseId)
      .populate({
        path: "lessons",
        select: "title description duration order type videoUrl thumbnail content code quiz resources metadata isPublished" // Added resources here
      })
      .populate({
        path: "curriculum.lessons.lesson",
        model: "Lesson",
        select: "title description duration order type videoUrl thumbnail content code quiz resources metadata isPublished" // Added resources here
      })
      .populate({
        path: "students.student",
        select: "name email"
      })
      .populate({
        path: "students.progress.lesson",
        model: "Lesson",
        select: "title"
      });

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Transform the response to match frontend expectations
    const transformedCourse = {
      ...course.toObject(),
      // Ensure all necessary fields are present
      instructor: course.instructor,
      instructorInfo: course.instructorInfo || {
        name: course.instructor,
        title: "Instructor",
        bio: "",
        image: "/images/instructors/default.jpg",
        rating: 0,
        students: 0,
        courses: 0,
        experience: ""
      },
      studentsCount: course.studentsCount || course.students?.length || 0,
      rating: course.rating || 0,
      reviews: course.reviews || [],
      learning: course.learning || [],
      requirements: course.requirements || [],
      features: course.features || [],
      tags: course.tags || [],
      curriculum: course.curriculum || [],
      isPublished: course.isPublished !== false,
      isFeatured: course.isFeatured || false,
      certificateIncluded: course.certificateIncluded !== false,
      lifetimeAccess: course.lifetimeAccess !== false,
    };

    // Extract and transform lessons
    let lessons = [];

    if (course.lessons && course.lessons.length > 0) {
      // Use direct lessons array
      lessons = course.lessons.map((lesson: any) => {
        // Check if user has completed this lesson
        const userProgress = course.students?.find((student: any) =>
          student.student?._id?.toString() === req.user?.id
        )?.progress;

        const lessonProgress = userProgress?.find((progress: any) =>
          progress.lesson?._id?.toString() === lesson._id.toString()
        );

        return {
          id: lesson._id || lesson.id,
          _id: lesson._id,
          title: lesson.title,
          description: lesson.description,
          duration: lesson.duration,
          order: lesson.order,
          type: lesson.type || 'video',
          videoUrl: lesson.videoUrl,
          thumbnail: lesson.thumbnail,
          content: lesson.content,
          code: lesson.code || [],
          quiz: lesson.quiz || [],
          resources: lesson.resources || [], // This should now work with populated data
          metadata: lesson.metadata || {},
          isPublished: lesson.isPublished !== false,
          completed: lessonProgress?.completed || false,
        };
      });
    } else if (course.curriculum && course.curriculum.length > 0) {
      // Extract lessons from curriculum sections
      lessons = course.curriculum.flatMap((section: any) =>
        section.lessons.map((lessonItem: any) => {
          const lesson = lessonItem.lesson;

          // Check if user has completed this lesson
          const userProgress = course.students?.find((student: any) =>
            student.student?._id?.toString() === req.user?.id
          )?.progress;

          const lessonProgress = userProgress?.find((progress: any) =>
            progress.lesson?._id?.toString() === lesson._id.toString()
          );

          return {
            id: lesson._id || lesson.id,
            _id: lesson._id,
            title: lesson.title,
            description: lesson.description,
            duration: lesson.duration,
            order: lessonItem.order || lesson.order,
            type: lesson.type || 'video',
            videoUrl: lesson.videoUrl,
            thumbnail: lesson.thumbnail,
            content: lesson.content,
            code: lesson.code || [],
            quiz: lesson.quiz || [],
            resources: lesson.resources || [], // This should now work with populated data
            metadata: lesson.metadata || {},
            isPublished: lesson.isPublished !== false,
            completed: lessonProgress?.completed || false,
          };
        })
      );
    }

    // Sort lessons by order
    lessons.sort((a: any, b: any) => a.order - b.order);

    res.json({
      success: true,
      course: transformedCourse,
      lessons: lessons
    });

  } catch (error) {
    console.error('Error fetching course:', error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch course"
    });
  }
};


// ✅ Enroll in course
export const enrollInCourse = async (req: Request, res: Response) => {
  try {
    const { courseId } = req.params;
    const userId = req.user?.id;

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: "Course not found" });

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }
    // const alreadyEnrolled = course.students.some(
    //   (s: any) => s.student.toString() === userId.toString()
    // );
    // if (alreadyEnrolled)
    //   return res.status(400).json({ message: "Already enrolled in this course" });

    const lessonProgress = course.lessons.map((l: any) => ({
      lesson: l.lesson,
      completed: false,
    }));

    course.students.push({
      student: userId,
      progress: lessonProgress,
    });

    await course.save();

    res.json({ message: "Enrolled successfully", course });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to enroll in course" });
  }
};

// ✅ Get enrolled courses
export const getEnrolledCourses = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const courses = await Course.find({ "students.student": userId }).populate(
      "instructors",
      "name"
    );
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch enrolled courses" });
  }
};

// ✅ Update course progress
export const updateCourseProgress = async (req: Request, res: Response) => {
  try {
    const { courseId } = req.params;
    const { progress } = req.body;
    const userId = req.user?.id;
    if (!userId) return res.status(400).json({ message: "User ID is required" });

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: "Course not found" });

    const student = course.students.find(
      (s: any) => s.student.toString() === userId.toString()
    );
    if (!student) return res.status(400).json({ message: "Not enrolled in this course" });

    // You can store progress percentage or mark individual lessons
    (student as any).progressPercent = progress;
    await course.save();

    res.json({ courseId, progress });
  } catch (error) {
    res.status(500).json({ message: "Failed to update progress" });
  }
};
