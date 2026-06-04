import mongoose from "mongoose";

const evaluationFournisseurSchema = new mongoose.Schema(
  {
    fournisseur_id: { type: mongoose.Schema.Types.ObjectId, ref: "Fournisseur", required: true },
    type_produit_id: { type: mongoose.Schema.Types.ObjectId, ref: "Type_Produit" },
    date_eval: { type: Date, default: Date.now },
    notes_criteres: [
      {
        critere_id: { type: mongoose.Schema.Types.ObjectId, ref: "Critere_Eval_Fournisseur" },
        note_saisie: { type: Number, min: 0, max: 5 },
      }
    ],
    score_final: Number,
    commentaire: String,
    preuves: [{ type: mongoose.Schema.Types.ObjectId, ref: "DocumentFile" }],
    action_id: { type: mongoose.Schema.Types.ObjectId, ref: "Action" },
  },
  { timestamps: true }
);

export default mongoose.model("Evaluation_Fournisseur", evaluationFournisseurSchema);
