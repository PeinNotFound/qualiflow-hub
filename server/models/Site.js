import mongoose from "mongoose";

const siteSchema = new mongoose.Schema(
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
    adresse: {
      type: String,
      trim: true,
    },
    responsables_validation: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Employee",
      },
    ],
  },
  { timestamps: false }
);

export default mongoose.model("Site", siteSchema);
