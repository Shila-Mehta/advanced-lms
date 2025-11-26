// redux/slices/lessonSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import api from "@/lib/api";
import { ILesson } from "@/types/lesson";

interface LessonState {
  lessons: ILesson[];
  loading: boolean;
  error: string | null;
}

const initialState: LessonState = {
  lessons: [],
  loading: false,
  error: null,
};

// Fetch all lessons for a course
export const fetchLessons = createAsyncThunk<ILesson[], string>(
  "lessons/fetchLessons",
  async (courseId, { rejectWithValue }) => {
    try {
      const res = await api.get(`api/courses/${courseId}/lessons`);
      if (!res.data.success) throw new Error(res.data.message || "Failed to fetch lessons");
      return res.data.data;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

// Create lesson
export const createLesson = createAsyncThunk<ILesson, { courseId: string; lesson:Partial<ILesson>  }>(
  "lessons/createLesson",
  async ({courseId, lesson }, { rejectWithValue }) => {
    try {
      const res = await api.post(`api/courses/${courseId}/lessons`, lesson);
      if (!res.data.success) throw new Error(res.data.message || "Failed to create lesson");
      return res.data.data;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

// Update lesson
export const updateLesson = createAsyncThunk<ILesson, { courseId: string; lessonId: string; lesson: Partial<ILesson> }>(
  "lessons/updateLesson",
  async ({ courseId, lessonId, lesson }, { rejectWithValue }) => {
    try {
      const res = await api.patch(`/courses/${courseId}/lessons/${lessonId}`, lesson);
      if (!res.data.success) throw new Error(res.data.message || "Failed to update lesson");
      return res.data.data;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

// Delete lesson
export const deleteLesson = createAsyncThunk<string, { courseId: string; lessonId: string }>(
  "lessons/deleteLesson",
  async ({ courseId, lessonId }, { rejectWithValue }) => {
    try {
      const res = await api.delete(`api/courses/${courseId}/lessons/${lessonId}`);
      if (!res.data.success) throw new Error(res.data.message || "Failed to delete lesson");
      return lessonId;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

const lessonSlice = createSlice({
  name: "lessons",
  initialState,
  reducers: {
    clearLessons(state) {
      state.lessons = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLessons.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchLessons.fulfilled, (state, action: PayloadAction<ILesson[]>) => { state.loading = false; state.lessons = action.payload; })
      .addCase(fetchLessons.rejected, (state, action: PayloadAction<any>) => { state.loading = false; state.error = action.payload; })
      
      .addCase(createLesson.fulfilled, (state, action: PayloadAction<ILesson>) => { state.lessons.push(action.payload); })
      
      .addCase(updateLesson.fulfilled, (state, action: PayloadAction<ILesson>) => {
        const index = state.lessons.findIndex(l => l.id === action.payload.id);
        if (index !== -1) state.lessons[index] = action.payload;
      })
      
      .addCase(deleteLesson.fulfilled, (state, action: PayloadAction<string>) => {
        state.lessons = state.lessons.filter(l => l.id !== action.payload);
      });
  },
});

export const { clearLessons } = lessonSlice.actions;
export default lessonSlice.reducer;


// Partial<ILesson>