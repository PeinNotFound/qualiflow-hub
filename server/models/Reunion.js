import mongoose from "mongoose";

const reunionSchema = new mongoose.Schema(
  {
    type_id: { type: mongoose.Schema.Types.ObjectId, ref: "Reunion_Type" },
    objet: { type: String, required: true },
    date_prev: { type: Date, required: true },
    date_real: Date,
    lieu: String,
    ordre_du_jour: [String],
    etat: { type: String, enum: ["planifiee", "realisee"], default: "planifiee" },
    duree_effective: Number, // in minutes
    commentaires_generaux: String,
    pv_url: { type: mongoose.Schema.Types.ObjectId, ref: "DocumentFile" },
    // Decisions embedded
    decisions: [
      {
        libelle_decision: String,
        action_id: { type: mongoose.Schema.Types.ObjectId, ref: "Action" },
        responsable_id: { type: mongoose.Schema.Types.ObjectId, ref: "Employee" },
        echeance: Date,
        statut: { type: String, enum: ["ouverte", "realisee"], default: "ouverte" },
      }
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Reunion", reunionSchema);
