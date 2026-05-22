import mongoose from "mongoose";

const QUALIFICATION_TYPES = ["informatique", "technique", "reglementaire", "manageriale"];

const qualificationSchema = new mongoose.Schema(
  {
    designation: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      enum: QUALIFICATION_TYPES,
      required: true,
    },
    is_periodique: {
      type: Boolean,
      default: false,
    },
    frequence_mois: {
      type: Number,
      default: 0,
    },
    responsable_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
    },
    coefficient_ponderation: {
      type: Number,
      default: 1,
    },
  },
  {
    timestamps: true,
  }
);

export { QUALIFICATION_TYPES };
export default mongoose.model("Qualification", qualificationSchema);
