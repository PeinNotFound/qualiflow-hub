import mongoose from "mongoose";

const DEMANDE_FORMATION_STATUS = ["enAttente", "approuve", "rejete"];

const validationStepSchema = new mongoose.Schema(
  {
    ordre: {
      type: Number,
      required: true,
    },
    validateur_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },
    statut: {
      type: String,
      enum: DEMANDE_FORMATION_STATUS,
      default: "enAttente",
    },
    commentaire: String,
    date_decision: Date,
  },
  { _id: false }
);

const formationDemandeSchema = new mongoose.Schema(
  {
    demandeur_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },
    theme: {
      type: String,
      required: true,
      trim: true,
    },
    justification: {
      type: String,
      trim: true,
    },
    date_souhaitee: Date,
    statut: {
      type: String,
      enum: DEMANDE_FORMATION_STATUS,
      default: "enAttente",
    },
    circuit_validation: [validationStepSchema],
    formation_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Formation",
    },
  },
  {
    timestamps: true,
  }
);

export { DEMANDE_FORMATION_STATUS };
export default mongoose.model("Formation_Demande", formationDemandeSchema);
