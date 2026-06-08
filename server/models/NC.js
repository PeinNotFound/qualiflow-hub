import mongoose from "mongoose";

const NC_SOURCES = ["audit", "client", "fournisseur", "smartrelease", "metrologie", "veille", "pnc"];
const NC_SEVERITIES = ["mineure", "majeure", "critique"];
const NC_TYPES = ["documentaire", "operationnelle", "systemique"];
const NC_STATUS = ["ouverte", "enCours", "cloturee"];

const ncSchema = new mongoose.Schema(
  {
    reference: {
      type: String,
      unique: true,
      trim: true,
    },
    titre: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    source_module: {
      type: String,
      enum: NC_SOURCES,
      required: true,
    },
    source_id: {
      type: mongoose.Schema.Types.ObjectId,
    },
    processus_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Processus",
      required: true,
    },
    severity: {
      type: String,
      enum: NC_SEVERITIES,
      default: "mineure",
    },
    type_nc: {
      type: String,
      enum: NC_TYPES,
      default: "operationnelle",
    },
    status: {
      type: String,
      enum: NC_STATUS,
      default: "ouverte",
    },
    detecte_par: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    constat_at: {
      type: Date,
      default: Date.now,
    },
    echeance: Date,
    actions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Action",
      },
    ],
    audit_flash_declenche: {
      type: Boolean,
      default: false,
    },
    closed_at: Date,
  },
  {
    timestamps: true,
  }
);

// Auto-generate reference logic can be added in pre-save or controller
export { NC_SOURCES, NC_SEVERITIES, NC_TYPES, NC_STATUS };
export default mongoose.model("NC", ncSchema);
