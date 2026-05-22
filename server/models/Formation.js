import mongoose from "mongoose";

const FORMATION_TYPES = ["interne", "externe"];
const FORMATION_STATUS = ["planifie", "realise", "annule"];

const scoreChaudSchema = new mongoose.Schema({
  note_contenu: { type: Number, min: 0, max: 5 },
  note_animateur: { type: Number, min: 0, max: 5 },
  note_organisation: { type: Number, min: 0, max: 5 },
  commentaire: String,
}, { _id: false });

const scoreFroidSchema = new mongoose.Schema({
  evaluateur_id: { type: mongoose.Schema.Types.ObjectId, ref: "Employee" },
  taux_efficacite: { type: Number, min: 0, max: 100 },
  qualifications_validees: { type: Boolean, default: false },
  commentaire: String,
  date_evaluation: Date,
}, { _id: false });

const formationSchema = new mongoose.Schema(
  {
    theme: {
      type: String,
      required: true,
      trim: true,
    },
    organisme: {
      type: String,
      trim: true,
    },
    type: {
      type: String,
      enum: FORMATION_TYPES,
      default: "interne",
    },
    date_prevue: Date,
    date_realisee: Date,
    cout: {
      type: Number,
      default: 0,
    },
    statut: {
      type: String,
      enum: FORMATION_STATUS,
      default: "planifie",
    },
    score_chaud: scoreChaudSchema,
    score_froid: scoreFroidSchema,
    qualifications_validees: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Qualification",
      },
    ],
    employee_ids: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Employee",
      },
    ],
  },
  {
    timestamps: true,
  }
);

export { FORMATION_TYPES, FORMATION_STATUS };
export default mongoose.model("Formation", formationSchema);
