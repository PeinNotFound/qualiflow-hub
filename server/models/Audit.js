import mongoose from "mongoose";

const planActiviteSchema = new mongoose.Schema({
  heure_debut: String,
  heure_fin: String,
  lieu: String,
  objectif: String,
  personnes_a_rencontrer: [{ type: mongoose.Schema.Types.ObjectId, ref: "Employee" }],
}, { _id: false });

const checklistItemSchema = new mongoose.Schema({
  chapitre_iso: String,
  exigence: String,
  reponse: { type: String, enum: ["conforme", "nonConforme", "nonApplicable"] },
  commentaire: String,
}, { _id: false });

const auditSchema = new mongoose.Schema(
  {
    reference: { type: String, unique: true },
    parametre_id: { type: mongoose.Schema.Types.ObjectId, ref: "Audit_Parametre" },
    processus_id: { type: mongoose.Schema.Types.ObjectId, ref: "Processus", required: true },
    type: { type: String, enum: ["interne", "externe", "flash"] },
    date_debut_prev: Date,
    date_fin_prev: Date,
    date_realisation: Date,
    etat: { type: String, enum: ["nonRealise", "realise", "valide"], default: "nonRealise" },
    auditeurs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Employee" }],
    audites: [{ type: mongoose.Schema.Types.ObjectId, ref: "Employee" }],
    documents_associes: [{ type: mongoose.Schema.Types.ObjectId, ref: "DocumentFile" }],
    plan_activites: [planActiviteSchema],
    checklist: [checklistItemSchema],
    points_forts: [String],
    ecarts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Constat_Ecart" }],
    nc_ids: [{ type: mongoose.Schema.Types.ObjectId, ref: "NC" }],
    rapport_url: String,
    validateur_id: { type: mongoose.Schema.Types.ObjectId, ref: "Employee" },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Audit", auditSchema);
