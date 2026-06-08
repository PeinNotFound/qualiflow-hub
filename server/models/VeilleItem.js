import mongoose from "mongoose";

const veilleItemSchema = new mongoose.Schema(
  {
    titre: { type: String, required: true },
    source: String,
    date_publication: Date,
    domaine: {
      type: String,
      enum: ["douane", "social", "technique", "environnement", "sante", "securite"],
    },
    description: String,
    processus_ids: [{ type: mongoose.Schema.Types.ObjectId, ref: "Processus" }],
    niveau_risque: { type: String, enum: ["faible", "moyen", "critique"] },
    compliance_status: {
      type: String,
      enum: ["conforme", "nonConforme", "enCours", "nonApplicable"],
      default: "conforme",
    },
    action_id: { type: mongoose.Schema.Types.ObjectId, ref: "Action" },
    created_by: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

export default mongoose.model("Veille_Item", veilleItemSchema);
