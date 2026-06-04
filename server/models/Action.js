import mongoose from "mongoose";

const ACTION_TYPES = ["corrective", "preventive", "amelioration"];
const ACTION_CAUSES = ["humaine", "materielle", "methode", "milieu", "management"];
const ACTION_STATUS = ["enAttente", "validee", "refusee", "enCours", "cloturee"];
const CAUSE_METHODS = ["5pourquoi", "ishikawa"];

const validationStepSchema = new mongoose.Schema(
  {
    ordre: { type: Number, required: true },
    validateur_id: { type: mongoose.Schema.Types.ObjectId, ref: "Employee", required: true },
    statut: { type: String, enum: ["enAttente", "approuve", "rejete"], default: "enAttente" },
    commentaire: String,
    date_decision: Date,
  },
  { _id: false }
);

const actionSchema = new mongoose.Schema(
  {
    reference: {
      type: String,
      unique: true,
      trim: true,
    },
    designation: {
      type: String,
      required: true,
      trim: true,
    },
    description_probleme: String,
    source_module: String,
    source_id: mongoose.Schema.Types.ObjectId,
    processus_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Processus",
      required: true,
    },
    type_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Action_Parametre",
    },
    direction_pilote_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Direction",
    },
    metier_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Metier",
    },
    theme_id: String,
    statut: {
      type: String,
      enum: ACTION_STATUS,
      default: "enAttente",
    },
    cause_racine: String,
    methode_cause: {
      type: String,
      enum: CAUSE_METHODS,
    },
    responsable_cloture_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
    },
    validation_finale: {
      type: Boolean,
      default: false,
    },
    circuit_validation: [validationStepSchema],
    sous_actions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Sous_Action",
      },
    ],
    taux_avancement: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export { ACTION_TYPES, ACTION_CAUSES, ACTION_STATUS, CAUSE_METHODS };
export default mongoose.model("Action", actionSchema);
