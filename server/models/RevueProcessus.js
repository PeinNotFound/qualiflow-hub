import mongoose from "mongoose";

const critereEvalEmbedSchema = new mongoose.Schema({
  critere_id: { type: mongoose.Schema.Types.ObjectId, ref: "Critere_Eval_Processus" },
  note: { type: Number, min: 1, max: 5 },
  commentaire: String,
}, { _id: false });

const revueProcessusSchema = new mongoose.Schema(
  {
    processus_id: { type: mongoose.Schema.Types.ObjectId, ref: "Processus", required: true },
    periode: { type: String, required: true },
    pilote_id: { type: mongoose.Schema.Types.ObjectId, ref: "Employee" },
    evaluateur_id: { type: mongoose.Schema.Types.ObjectId, ref: "Employee" },
    date_revue: { type: Date, default: Date.now },
    critere_evaluations: [critereEvalEmbedSchema],
    score_maturite: Number,
    constats_forts: [String],
    constats_faibles: [String],
    opportunites: [String],
    kpi_synthese: [{ type: mongoose.Schema.Types.ObjectId, ref: "Indicateur" }],
    nc_ids: [{ type: mongoose.Schema.Types.ObjectId, ref: "NC" }],
    audit_ids: [{ type: mongoose.Schema.Types.ObjectId, ref: "Audit" }],
    actions_prev_cloturees_pct: Number,
    actions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Action" }],
    statut: { type: String, enum: ["brouillon", "realise", "archive"], default: "brouillon" },
  },
  { timestamps: true }
);

export default mongoose.model("Revue_Processus", revueProcessusSchema);
