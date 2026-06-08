import mongoose from "mongoose";

const constatEcartSchema = new mongoose.Schema(
  {
    audit_id: { type: mongoose.Schema.Types.ObjectId, ref: "Audit", required: true },
    type_ecart_id: String,
    gravite_id: String,
    description: { type: String, required: true },
    audite_concerne_id: { type: mongoose.Schema.Types.ObjectId, ref: "Employee" },
    chapitre_iso: String,
    action_id: { type: mongoose.Schema.Types.ObjectId, ref: "Action" },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Constat_Ecart", constatEcartSchema);
