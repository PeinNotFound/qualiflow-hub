import mongoose from "mongoose";

const indicateurValeurSchema = new mongoose.Schema(
  {
    indicateur_id: { type: mongoose.Schema.Types.ObjectId, ref: "Indicateur", required: true },
    date_periode: { type: String, required: true }, // YYYY-MM
    valeur_saisie: { type: Number, required: true },
    valeur_ponderee: Number,
    commentaire: String,
    saisi_par: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

export default mongoose.model("Indicateur_Valeur", indicateurValeurSchema);
