import mongoose,{ Schema, model, Document, Types } from "mongoose";

export interface ICertificate extends Document {
  course: Types.ObjectId;
  student: Types.ObjectId;
  issuedAt: Date;
  certificateUrl: string;
}

const certificateSchema = new Schema<ICertificate>({
  course: { type: Schema.Types.ObjectId, ref: "Course" },
  student: { type: Schema.Types.ObjectId, ref: "User" },
  issuedAt: { type: Date, default: Date.now },
  certificateUrl: { type: String, required: true },
});

export default mongoose.models.Certificate || model<ICertificate>("Certificate", certificateSchema);
