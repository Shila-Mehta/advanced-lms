import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import dashboardReducer from "./slices/dashboardSlice";
import courseReducer from "./slices/courseSlice";
import userReducer from "./slices/userSlice";
import uiReducer from "./slices/uiSlice";
import instructorReducer from "./slices/instructorSlice";
import lessonReducer from "./slices/lessonSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    dashboard: dashboardReducer,
    courses: courseReducer,
    user: userReducer,
    ui: uiReducer,
    instructors:instructorReducer,
    lessons:lessonReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
        ignoredPaths: ['ui.notifications'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;