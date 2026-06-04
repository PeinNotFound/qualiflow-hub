import mongoose from "mongoose";

const indicateurSchema = new mongoose.Schema(
  {
    libelle: { type: String, required: true, trim: true },
    processus_id: { type: mongoose.Schema.Types.ObjectId, ref: "Processus", required: true },
    type_id: { type: mongoose.Schema.Types.ObjectId, ref: "Indicateur_Type" },
    axe_id: { type: mongoose.Schema.Types.ObjectId, ref: "Axe_Politique" },
    periodicite: {
      type: String,
      enum: ["mensuel", "trimestriel", "semestriel", "annuel"],
      default: "mensuel",
    },
    type_suivi: {
      type: String,
      enum: ["manuel", "formule", "import"],
      default: "manuel",
    },
    type_resultat: {
      type: String,
      enum: ["moyenne", "cumul", "ponderee", "dernier", "ouiNon"],
      default: "moyenne",
    },
    formule: String,
    unite: String,
    responsable_id: { type: mongoose.Schema.Types.ObjectId, ref: "Employee" },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model("Indicateur", indicateurSchema);
