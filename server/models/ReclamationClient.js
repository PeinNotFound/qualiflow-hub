import mongoose from "mongoose";

const reclamationClientSchema = new mongoose.Schema(
  {
    reference: { type: String, unique: true },
    date_rec: { type: Date, default: Date.now },
    client_id: { type: mongoose.Schema.Types.ObjectId, ref: "Client", required: true },
    type_rec_id: String,
    gravite_id: String,
    site_id: { type: mongoose.Schema.Types.ObjectId, ref: "Site" },
    description: { type: String, required: true },
    with_return: { type: Boolean, default: false }, // triggers PNC alert
    pnc_id: { type: mongoose.Schema.Types.ObjectId, ref: "PNC_Fiche" },
    decideur_id: { type: mongoose.Schema.Types.ObjectId, ref: "Employee" },
    responsable_traitement_id: { type: mongoose.Schema.Types.ObjectId, ref: "Employee" },
    responsable_suivi_id: { type: mongoose.Schema.Types.ObjectId, ref: "Employee" },
    statut: {
      type: String,
      enum: ["saisie", "decision", "traitement", "cloture"],
      default: "saisie",
    },
    cout_penalite: { type: Number, default: 0 },
    autres_frais: { type: Number, default: 0 },
    rapport_traitement: String,
    action_id: { type: mongoose.Schema.Types.ObjectId, ref: "Action" },
    closed_at: Date,
  },
  { timestamps: true }
);

export default mongoose.model("Reclamation_Client", reclamationClientSchema);
