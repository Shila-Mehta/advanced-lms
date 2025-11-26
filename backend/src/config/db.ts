// config/db.ts
import mongoose from "mongoose";


import "../models/index.js";


export const connectDB = async (mongoUri: string) => {
  try {
    await mongoose.connect(mongoUri!);
    console.log("✅ MongoDB connected");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  }
};
