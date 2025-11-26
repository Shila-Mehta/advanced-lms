import { Router } from "express";
import { User } from "../models/User.js";
import jwt from "jsonwebtoken";
import passport from "../config/passport.js";


const router = Router();

// Register
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    const user = new User({ name, email, password, role });
    await user.save();

    res.status(201).json({ message: "User registered ✅" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password)))
      return res.status(400).json({ message: "Invalid credentials" });

    // ✅ Non-null assertion
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET!,
      { expiresIn: "15m" }
    );

    const refreshToken = jwt.sign(
      { id: user._id,role: user.role },
      process.env.JWT_REFRESH_SECRET!,
      { expiresIn: "7d" }
    );

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.json({ message: "Login successful ✅", token });
    
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});



// logout
router.post("/logout", (req, res) => {
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });
  res.json({ message: "Logged out successfully 🚪" });
});


// Refresh token
router.post("/refresh", (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken)
    return res.status(401).json({ message: "Refresh token required" });

  try {
    const decoded = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET!
    ) as {
      role: any; id: string 
};

    const newToken = jwt.sign(
      { id: decoded.id ,role:decoded.role},
      process.env.JWT_SECRET!,
      { expiresIn: "15m" }
    );

    res.json({ token: newToken });
  } catch {
    res.status(403).json({ message: "Invalid refresh token" });
  }
});





// Start Google login
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"]}));

// Google callback
router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  (req, res) => {
    const user = req.user as any;

    // Issue JWT tokens
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET!, { expiresIn: "15m" });
    const refreshToken = jwt.sign({ id: user._id ,role: user.role}, process.env.JWT_REFRESH_SECRET!, { expiresIn: "7d" });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

// Return JSON 
    // res.json({ 
    //   token,
    //   user: {
    //     id: user._id,
    //     name: user.name,
    //     email: user.email,
    //     role: user.role
    //   }
    // });  

    res.redirect(`${process.env.CLIENT_URL}/auth/callback`);

  
  }
);




// Step 1: redirect to GitHub login
router.get("/github", passport.authenticate("github", { scope: ["user:email"] }));

/// Step 2: callback after login - MAKE CONSISTENT
router.get(
  "/github/callback",
  passport.authenticate("github", { session: false }),
  (req: any, res) => {
    const user = req.user;

    // Issue consistent JWT tokens (same as Google/email login)
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET!,
      { expiresIn: "15m" }
    );

    const refreshToken = jwt.sign(
      { id: user._id ,role: user.role},
      process.env.JWT_REFRESH_SECRET!,
      { expiresIn: "7d" }
    );

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

// Return JSON
    // res.json({ 
    //   token,
    //   user: {
    //     id: user._id,
    //     name: user.name,
    //     email: user.email,
    //     role: user.role
    //   }
    // });  


    res.redirect(`${process.env.CLIENT_URL}/auth/callback`);

    }
);




export default router;
