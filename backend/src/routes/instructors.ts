import express from "express";
import { User } from "../models/User.js";

const router = express.Router();

// GET all instructors
router.get("/", async (req, res) => {
  try {
    // Fetch all fields of instructors
    const instructors = await User.find({ role: "instructor" });
    res.json(instructors);
  } catch (error) {
    console.error("Error fetching instructors:", error);
    res.status(500).json({ message: "Failed to fetch instructors" });
  }
});

export default router;
