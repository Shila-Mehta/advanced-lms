// redux/dashboardSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { DashboardState } from "@/types/dashboard";
import api from "@/lib/api";

// ✅ Initial state
const initialState: DashboardState = {
  userData: null,
  courses: [],
  deadlines: [],
  activities: [],
  recommendations: [],
  studentData: undefined,
  instructorData: undefined,
  adminData: undefined,
  status: "idle",
  error: null,
};

// ----------------------------
// Async Thunks
// ----------------------------
export const fetchDashboardData = createAsyncThunk<DashboardState>(
  "dashboard/fetchData",
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState() as any;
      const userRole = state.auth.user?.role ;

      // Determine backend endpoint
      let endpoint = "/dashboard/student";
      if (userRole === "instructor") endpoint = "/dashboard/instructor";
      if (userRole === "admin") endpoint = "/dashboard/admin";

      // Fetch data from backend
      const response = await api.get(endpoint);

      // Backend should return DashboardState shape
      return response.data as DashboardState;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch dashboard data"
      );
    }
  }
);

// ----------------------------
// Slice
// ----------------------------
const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    updateCourseProgress: (
      state,
      action: PayloadAction<{ courseId: string; progress: number }>
    ) => {
      const course = state.courses.find((c) => c.id === action.payload.courseId);
      if (course) {
        course.progress = action.payload.progress;
        course.completed = action.payload.progress === 100;
      }
    },
    markActivityAsRead: (state, action: PayloadAction<string>) => {
      const activity = state.activities.find((a) => a.id === action.payload);
      if (activity) {
        // Optional: add `read` flag if backend supports it
        // activity.read = true;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardData.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchDashboardData.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.userData = action.payload.userData;
        state.courses = action.payload.courses;
        state.deadlines = action.payload.deadlines;
        state.activities = action.payload.activities;
        state.recommendations = action.payload.recommendations;
        state.studentData = action.payload.studentData;
        state.instructorData = action.payload.instructorData;
        state.adminData = action.payload.adminData;
      })
      .addCase(fetchDashboardData.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      });
  },
});

export const { clearError, updateCourseProgress, markActivityAsRead } =
  dashboardSlice.actions;

export default dashboardSlice.reducer;
