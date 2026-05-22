import mongoose from "mongoose";

const PROCESSUS_TYPES = ["management", "realisation", "support"];

const processusSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      enum: PROCESSUS_TYPES,
      required: true,
    },
    pilote_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
    },
    objectifs: [String],
    entrees: [String],
    sorties: [String],
    periodicite_revue: {
      type: Number,
      default: 12, // Default to 12 months
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export { PROCESSUS_TYPES };
export default mongoose.model("Processus", processusSchema);
