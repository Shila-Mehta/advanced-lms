import mongoose, { Schema, Types } from "mongoose";
import bcrypt from "bcrypt";



export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: string;
  googleId: string,
  githubId: string,
  enrolledCourses: Types.ObjectId[],
  comparePassword(candidatePassword: string): Promise<boolean>;
}




const userSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: {
    type: String,
    required: function () {
      // Only require password if the user is NOT OAuth-based
      return !this.googleId && !this.githubId;
    },
  },
  role: {
    type: String,
    enum: ["student", "instructor", "admin"],
    default: "student",
  },
  googleId: { type: String, unique: true, sparse: true },
  githubId: { type: String, unique: true, sparse: true },
  enrolledCourses: [{ type: Schema.Types.ObjectId, ref: "Course" }],

});

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Compare password
userSchema.methods.comparePassword = function (candidatePassword: string) {
  return bcrypt.compare(candidatePassword, this.password);
};

export const User = mongoose.model<IUser>("User", userSchema);
