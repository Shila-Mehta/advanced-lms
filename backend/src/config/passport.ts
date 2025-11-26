import dotenv from "dotenv";
dotenv.config();

import passport from "passport";
import { Strategy as GoogleStrategy, Profile as GoogleProfile } from "passport-google-oauth20";
import { Strategy as GitHubStrategy,Profile as GitHubProfile } from "passport-github2";
import { User } from "../models/User.js";

// --- Env vars ---
const googleClientID = process.env.GOOGLE_CLIENT_ID!;
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET!;
const googleCallback = process.env.GOOGLE_CALLBACK_URL!;

const githubClientID = process.env.GITHUB_CLIENT_ID!;
const githubClientSecret = process.env.GITHUB_CLIENT_SECRET!;
const githubCallback = process.env.GITHUB_CALLBACK_URL!;

// --- Google Strategy ---
passport.use(
  new GoogleStrategy(
    {
      clientID: googleClientID,
      clientSecret: googleClientSecret,
      callbackURL: googleCallback,
    },
    async (_accessToken, _refreshToken, profile: GoogleProfile, done) => {
      try {
        const email = profile.emails?.[0].value;
        if (!email) return done(new Error("No email returned from Google"));

        // 1️⃣ Check Google ID
        let user = await User.findOne({ googleId: profile.id });
        if (user) return done(null, user);

        // 2️⃣ Check by email
        user = await User.findOne({ email });
        if (user) {
          user.googleId = profile.id;
          await user.save();
          return done(null, user);
        }

        // 3️⃣ Create new
        user = new User({
          name: profile.displayName,
          email,
          googleId: profile.id,
          role: "student",
        });
        await user.save();
        done(null, user);
      } catch (err) {
        done(err);
      }
    }
  )
);




// --- GitHub Strategy ---
passport.use(
  new GitHubStrategy(
    {
      clientID: githubClientID,
      clientSecret: githubClientSecret,
      callbackURL: githubCallback,
    },
    async (_accessToken:string, _refreshToken:string, profile:GitHubProfile, done:(err:any,User?:any)=>void) => {
      try {
        // Try to get a verified email
        const email = profile.emails?.find((e: any) => e.verified)?.value || profile.emails?.[0]?.value;

        // 1️⃣ Check GitHub ID
        let user = await User.findOne({ githubId: profile.id });
        if (user) return done(null, user);

        // 2️⃣ Check by email (account linking)
        if (email) {
          user = await User.findOne({ email });
          if (user) {
            user.githubId = profile.id;
            await user.save();
            return done(null, user);
          }
        }

        // 3️⃣ Create new user
        user = new User({
          name: profile.username || "GitHub User",
          email: email || `${profile.username}@github.temp`,
          githubId: profile.id,
          role: "student",
        });
        await user.save();
        done(null, user);
      } catch (err) {
        done(err);
      }
    }
  )
);

// --- Serialize / Deserialize ---
passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

export default passport;
