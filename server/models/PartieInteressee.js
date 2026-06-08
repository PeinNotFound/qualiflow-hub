import mongoose from "mongoose";

const partieInteresseeSchema = new mongoose.Schema(
  {
    nom: { type: String, required: true },
    type: { type: String, enum: ["interne", "externe"], default: "externe" },
    categorie: { type: String }, // Ex: État, Clients, Fournisseurs, Employés
    attentes: { type: String },
    enjeux: { type: String },
    frequence_suivi: { type: String },
    responsable_suivi: { type: String },
    site_id: { type: mongoose.Schema.Types.ObjectId, ref: "Site" },
  },
  { timestamps: true }
);

export default mongoose.model("PartieInteressee", partieInteresseeSchema);
