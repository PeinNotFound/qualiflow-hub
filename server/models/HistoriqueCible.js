import mongoose from "mongoose";

const historiqueCibleSchema = new mongoose.Schema(
  {
    indicateur_id: { type: mongoose.Schema.Types.ObjectId, ref: "Indicateur", required: true },
    valeur_cible: { type: Number, required: true },
    seuil_nc: Number,
    date_application: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model("Historique_Cible", historiqueCibleSchema);
