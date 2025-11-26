
// redux/slices/courseSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import api from "@/lib/api";
import { CourseState} from "@/types/course";

const initialState: CourseState = {
  courses: [],
  enrolledCourses: [],
  currentCourse: null,
  lessons: [],
  loading: false,
  error: null,
  filter: {
    category: 'all',
    level: 'all',
    search: '',
  },
};

// Async thunks
export const fetchCourseById = createAsyncThunk(
  "courses/fetchCourseById",
  async (courseId: string, { rejectWithValue }) => {
    try {
      console.log('Fetching course with ID:', courseId);
      
      const res = await api.get(`/api/courses/${courseId}`);
      console.log('Course API response:', res.data);
      
      if (!res.data) {
        throw new Error('No course data received');
      }

      const courseData = res.data.course || res.data;
      console.log("courseData lessons",courseData.lessons);
      
      return {
        course: courseData,
        lessons: courseData.lessons || []
      };

    } catch (err: any) {
      console.error('Error fetching course:', err);
      return rejectWithValue(err.response?.data?.message || "Failed to fetch course");
    }
  }
);

export const createCourse = createAsyncThunk(
  "courses/createCourse",
  async (data: any, { rejectWithValue }) => {
    try {
      const res = await api.post("/api/courses", data);
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Failed to create course");
    }
  }
);

export const updateCourse = createAsyncThunk(
  "courses/updateCourse",
  async ({ courseId, data }: { courseId: string; data: any }, { rejectWithValue }) => {
    try {
      const res = await api.patch(`/api/courses/${courseId}`, data);
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Failed to update course");
    }
  }
);

export const deleteCourse = createAsyncThunk(
  "courses/deleteCourse",
  async (courseId: string, { rejectWithValue }) => {
    try {
      await api.delete(`/api/courses/${courseId}`);
      return courseId;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Failed to delete course");
    }
  }
);

export const fetchCourses = createAsyncThunk(
  "courses/fetchCourses",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/api/courses");
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch courses");
    }
  }
);

export const enrollInCourse = createAsyncThunk(
  "courses/enrollInCourse",
  async (courseId: string, { rejectWithValue }) => {
    try {
      const res = await api.post(`/api/courses/${courseId}/enroll`);
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Failed to enroll in course");
    }
  }
);

export const fetchEnrolledCourses = createAsyncThunk(
  "courses/fetchEnrolledCourses",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/api/courses/enrolled");
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch enrolled courses");
    }
  }
);

export const updateCourseProgress = createAsyncThunk(
  "courses/updateProgress",
  async ({ courseId, progress }: { courseId: string; progress: number }, { rejectWithValue }) => {
    try {
      const res = await api.patch(`/api/courses/${courseId}/progress`, { progress });
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Failed to update progress");
    }
  }
);

export const markLessonCompleted = createAsyncThunk(
  "courses/markLessonCompleted",
  async ({ courseId, lessonId }: { courseId: any; lessonId: any }, { rejectWithValue }) => {
    try {
      console.log('markLessonCompleted thunk called with:', { courseId, lessonId });
      
      // Validate parameters
      if (!courseId || !lessonId) {
        throw new Error(`Missing parameters: courseId=${courseId}, lessonId=${lessonId}`);
      }

      const url = `/api/courses/${courseId}/lessons/${lessonId}/complete`;
      console.log('Making request to:', url);
      
      const res = await api.post(url);
      console.log('Response received:', res.data);
      
      return {courseId, lessonId, data: res.data };
    } catch (err: any) {
      console.error('Error in markLessonCompleted thunk:', err);
      return rejectWithValue(err.response?.data?.message || err.message || "Failed to mark lesson completed");
    }
  }
);

const courseSlice = createSlice({
  name: "courses",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setFilter: (state, action: PayloadAction<Partial<CourseState['filter']>>) => {
      state.filter = { ...state.filter, ...action.payload };
    },
    clearFilter: (state) => {
      state.filter = {
        category: 'all',
        level: 'all',
        search: '',
      };
    },
    markLessonComplete: (state, action: PayloadAction<{ courseId: string; lessonId: string }>) => {
      const lesson = state.lessons.find(l => l.id === action.payload.lessonId);
      if (lesson) {
        lesson.completed = true;
      }
    },
    clearCurrentCourse: (state) => {
      state.currentCourse = null;
      state.lessons = [];
    }
  },
  extraReducers: (builder) => {
    builder
      // Create course
      .addCase(createCourse.pending, (state) => {
        state.loading = true;
      })
      .addCase(createCourse.fulfilled, (state, action) => {
        state.loading = false;
        state.courses.push(action.payload);
      })
      .addCase(createCourse.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Update course
      .addCase(updateCourse.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateCourse.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.courses.findIndex(c => c.id === action.payload.id);
        if (index !== -1) {
          state.courses[index] = action.payload;
        }
        if (state.currentCourse?.id === action.payload.id) {
          state.currentCourse = action.payload;
        }
      })
      .addCase(updateCourse.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Delete course
      .addCase(deleteCourse.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteCourse.fulfilled, (state, action) => {
        state.loading = false;
        state.courses = state.courses.filter(c => c.id !== action.payload);
        if (state.currentCourse?.id === action.payload) {
          state.currentCourse = null;
          state.lessons = [];
        }
      })
      .addCase(deleteCourse.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Fetch courses
      .addCase(fetchCourses.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCourses.fulfilled, (state, action) => {
        state.loading = false;
        state.courses = action.payload;
      })
      .addCase(fetchCourses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Fetch course by ID
      .addCase(fetchCourseById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCourseById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentCourse = action.payload.course;
        state.lessons = action.payload.lessons;
        state.error = null;
      })
      .addCase(fetchCourseById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.currentCourse = null;
        state.lessons = [];
      })

      // Enroll in course
      .addCase(enrollInCourse.pending, (state) => {
        state.loading = true;
      })
      .addCase(enrollInCourse.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.course) {
          state.enrolledCourses.push(action.payload.course);
        }
      })
      .addCase(enrollInCourse.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Fetch enrolled courses
      .addCase(fetchEnrolledCourses.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchEnrolledCourses.fulfilled, (state, action) => {
        state.loading = false;
        state.enrolledCourses = action.payload;
      })
      .addCase(fetchEnrolledCourses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Update progress
      .addCase(updateCourseProgress.fulfilled, (state, action) => {
        const { courseId, progress } = action.payload;
        const course = state.enrolledCourses.find(c => c.id === courseId);
        if (course) {
          course.progress = progress;
          course.completed = progress === 100;
        }
      })

      // Mark lesson completed
      .addCase(markLessonCompleted.fulfilled, (state, action) => {
        const { lessonId } = action.payload;
        const lesson = state.lessons.find(l => l.id === lessonId);
        if (lesson) {
          lesson.completed = true;
        }
      });
  },
});

export const { 
  clearError, 
  setFilter, 
  clearFilter, 
  markLessonComplete,
  clearCurrentCourse 
} = courseSlice.actions;

export default courseSlice.reducer;