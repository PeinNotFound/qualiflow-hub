import mongoose from "mongoose";

const directionSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    designation: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: false }
);

export default mongoose.model("Direction", directionSchema);
