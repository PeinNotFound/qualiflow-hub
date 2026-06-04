import mongoose from "mongoose";

const billanActionEmbedSchema = new mongoose.Schema({
  action_id: { type: mongoose.Schema.Types.ObjectId, ref: "Action" },
  pilote: String,
  besoins_ressources: String,
  etat_avancement: { type: String, enum: ["enCours", "realise", "annule"] },
}, { _id: false });

const swotEmbedSchema = new mongoose.Schema({
  opportunites: [String],
  menaces: [String],
  forces: [String],
  faiblesses: [String],
}, { _id: false });

const revueDirectionSchema = new mongoose.Schema(
  {
    periode_couverte: { type: String, required: true },
    date_revue: { type: Date, default: Date.now },
    redacteur_id: { type: mongoose.Schema.Types.ObjectId, ref: "Employee" },
    reunion_id: { type: mongoose.Schema.Types.ObjectId, ref: "Reunion" },
    statut: { type: String, enum: ["brouillon", "realise", "cloture"], default: "brouillon" },
    swot: swotEmbedSchema,
    actions_precedentes_bilan: [billanActionEmbedSchema],
    decisions: [
      {
        type: { type: String, enum: ["actionCorrective", "opportuniteAmelioration", "allocationRessources"] },
        description: String,
        priorite_strategique: { type: String, enum: ["haute", "moyenne", "basse"] },
        action_id: { type: mongoose.Schema.Types.ObjectId, ref: "Action" },
      }
    ],
    audits_bilan: mongoose.Schema.Types.Mixed,
    kpis_bilan: mongoose.Schema.Types.Mixed,
    clients_bilan: mongoose.Schema.Types.Mixed,
    fournisseurs_bilan: mongoose.Schema.Types.Mixed,
  },
  { timestamps: true }
);

export default mongoose.model("Revue_Direction", revueDirectionSchema);
