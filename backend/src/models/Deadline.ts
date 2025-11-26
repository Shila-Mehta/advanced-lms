import mongoose, { Document,Types } from "mongoose";

const { Schema, model, models} = mongoose;

export interface IDeadline extends Document {
  course: Types.ObjectId;
  student: Types.ObjectId;
  title: string;
  dueDate: Date;
  completed: boolean;
}

const deadlineSchema = new Schema<IDeadline>({
  course: { type: Schema.Types.ObjectId, ref: "Course" },
  student: { type: Schema.Types.ObjectId, ref: "User" },
  title: String,
  dueDate: Date,
  completed: { type: Boolean, default: false },
});

export default models.Deadline || model<IDeadline>("Deadline", deadlineSchema);
