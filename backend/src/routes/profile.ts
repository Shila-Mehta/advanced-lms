import { Router } from "express";
import { authenticate, authorize } from "../models/middlewares/auth.js";
import {User} from "../models/User.js";
 
const router = Router();


// Get profile
router.get(
  "/me",
  authenticate,
  async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const user = await User.findById(req.user.id).select("-password");
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json(user);
    } catch (err) {
      next(err);
    }
  }
);

// Update profile
router.put(
  "/me",
  authenticate,
  async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const { name, bio, avatar } = req.body;
      const user = await User.findByIdAndUpdate(
        req.user.id,
        { name, bio, avatar },
        { new: true }
      ).select("-password");

      res.json(user);
    } catch (err) {
      next(err);
    }
  }
);

router.get(
  "/admin",
  authenticate,
  authorize("admin"),
  (req, res) => {
    res.json({ message: "Welcome Admin 👑" });
  }
);

export default router;
