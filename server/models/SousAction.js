import mongoose from "mongoose";

const SOUS_ACTION_STATUS = ["enAttente", "enCours", "realise", "enRetard"];

const sousActionSchema = new mongoose.Schema(
  {
    action_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Action",
      required: true,
    },
    designation: {
      type: String,
      required: true,
      trim: true,
    },
    date_echeance: Date,
    taux_realisation: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },
    taux_efficacite: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },
    commentaires: String,
    depenses: {
      type: Number,
      default: 0,
    },
    responsable_realisation_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
    },
    responsable_suivi_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
    },
    preuves: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "DocumentFile",
      },
    ],
    statut: {
      type: String,
      enum: SOUS_ACTION_STATUS,
      default: "enAttente",
    },
  },
  {
    timestamps: true,
  }
);

export { SOUS_ACTION_STATUS };
export default mongoose.model("Sous_Action", sousActionSchema);
