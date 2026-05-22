import mongoose from "mongoose";

const HABILITATION_STATUS = ["valide", "expire", "enCours"];

const habilitationSchema = new mongoose.Schema(
  {
    employee_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },
    qualification_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Qualification",
      required: true,
    },
    dateObtention: {
      type: Date,
    },
    dateExpiration: {
      type: Date,
    },
    status: {
      type: String,
      enum: HABILITATION_STATUS,
      default: "enCours",
    },
    alertSent: {
      type: Boolean,
      default: false,
    },
    certificat_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DocumentFile",
    },
  },
  {
    timestamps: true,
  }
);

export { HABILITATION_STATUS };
export default mongoose.model("Habilitation", habilitationSchema);
