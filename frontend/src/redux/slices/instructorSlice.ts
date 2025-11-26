import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import api from "@/lib/api";

// Types
export interface Instructor {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  bio?: string;
  role: "instructor";
}

interface InstructorState {
  list: Instructor[];
  loading: boolean;
  error: string | null;
}

// Async Thunk
export const fetchInstructors = createAsyncThunk<Instructor[], void, { rejectValue: string }>(
  "instructors/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/api/instructors");
      return res.data.map((inst: any) => ({
        id: inst._id,
        name: inst.name,
        email: inst.email,
        avatar: inst.avatar,
        bio: inst.bio,
        role: "instructor"
      }));
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch instructors");
    }
  }
);

// Slice
const instructorSlice = createSlice({
  name: "instructors",
  initialState: {
    list: [],
    loading: false,
    error: null,
  } as InstructorState,
  reducers: {
    clearInstructorError: (state) => {
      state.error = null;
    },
    resetInstructors: (state) => {
      state.list = [];
      state.error = null;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchInstructors.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchInstructors.fulfilled, (state, action: PayloadAction<Instructor[]>) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchInstructors.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Unknown error occurred";
      });
  },
});

export const { clearInstructorError, resetInstructors } = instructorSlice.actions;
export default instructorSlice.reducer;
