import { Schema, model, Document ,Types} from "mongoose";


export interface IActivity extends Document {
  userId: Types.ObjectId;
  type: "access" | "message" | "notification";
  title: string;
  description: string;
  timestamp: Date;
  read?: boolean;
}

const activitySchema = new Schema<IActivity>({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  type: { type: String, enum: ["access", "message", "notification"], required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  read: { type: Boolean, default: false },
});

export default model<IActivity>("Activity", activitySchema);
