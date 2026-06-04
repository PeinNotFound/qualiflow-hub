import mongoose from "mongoose";

const indicateurTypeSchema = new mongoose.Schema(
  {
    designation: { type: String, required: true },
    processus_id: { type: mongoose.Schema.Types.ObjectId, ref: "Processus", required: true },
    liste_acces: [{ type: mongoose.Schema.Types.ObjectId, ref: "Employee" }],
  },
  { timestamps: true }
);

export default mongoose.model("Indicateur_Type", indicateurTypeSchema);
