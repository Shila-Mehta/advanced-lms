import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import session from "express-session";
import cookieParser from "cookie-parser";

import { connectDB } from "./config/db.js";


import passport from "./config/passport.js";
import authRoutes from "./routes/auth.js";
import profileRoutes from "./routes/profile.js";

import studentDashboardRoutes from "./routes/dashboard/student.js";
import instructorDashboardRoutes from "./routes/dashboard/instructor.js";
import adminDashboardRoutes from "./routes/dashboard/admin.js";

import courseRoutes from "./routes/course.js";
import instructorRoutes from "./routes/instructors.js";


const isDocker = process.env.NODE_ENV === "production";

const mongoUri = isDocker
  ? process.env.MONGO_URI_DOCKER
  : process.env.MONGO_URI_LOCAL;

if (!mongoUri) {
  throw new Error("Mongo URI is not defined in environment variables!");
}

const app = express();

// Session
app.use(
  session({
    secret: process.env.SESSION_SECRET || "secret",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(
  cors({
    origin: process.env.CLIENT_URL, // frontend URL e.g. http://localhost:3000
    credentials: true,              // allow cookies/Authorization headers
  })
);


app.use(express.json());
app.use(cookieParser());
app.use(passport.initialize());

app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);

app.use("/dashboard/student", studentDashboardRoutes);
app.use("/dashboard/instructor", instructorDashboardRoutes);
app.use("/dashboard/admin", adminDashboardRoutes);


// Routes
app.use("/api/courses", courseRoutes);
app.use("/api/instructors", instructorRoutes);



app.get("/api/health", (_req, res) => {
  res.json({ message: "LMS backend running ✅" });
});

// Connect DB and start server
const PORT = process.env.PORT || 5001;

connectDB(mongoUri).then(() => {
  app.listen(PORT, () =>
    console.log(`🚀 Backend running on http://localhost:${PORT}`)
  );
});
