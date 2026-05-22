import mongoose from "mongoose";

const EMPLOYEE_CONTRATS = ["CDI", "CDD", "stagiaire"];

const employeeSchema = new mongoose.Schema(
  {
    matricule: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    nom: {
      type: String,
      required: true,
      trim: true,
    },
    prenom: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      lowercase: true,
      trim: true,
    },
    poste_actuel: {
      type: String,
      trim: true,
    },
    date_entree: {
      type: Date,
      default: Date.now,
    },
    typeContrat: {
      type: String,
      enum: EMPLOYEE_CONTRATS,
      default: "CDI",
    },
    processus_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Processus",
    },
    site_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Site",
    },
    direction_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Direction",
    },
    metier_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Metier",
    },
    fonction_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Fonction",
    },
    is_Superviseur: {
      type: Boolean,
      default: false,
    },
    is_Auditeur_Interne: {
      type: Boolean,
      default: false,
    },
    is_Actif: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export { EMPLOYEE_CONTRATS };
export default mongoose.model("Employee", employeeSchema);
