import mongoose from "mongoose";

const DOCUMENT_TYPES = ["procedure", "manuel", "instruction", "formulaire", "enregistrement", "externe"];
const DOCUMENT_STATUS = ["enRedaction", "enVerification", "enVigueur", "perime"];

const modifLogSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  action: String,
  motif: String,
  timestamp: { type: Date, default: Date.now },
}, { _id: false });

const documentFileSchema = new mongoose.Schema(
  {
    code: { type: String, unique: true },
    libelle: { type: String, required: true },
    type: { type: String, enum: DOCUMENT_TYPES, required: true },
    version: { type: String, default: "1.0" },
    statut: { type: String, enum: DOCUMENT_STATUS, default: "enRedaction" },
    fileUrl: String,
    mimeType: String,
    site_id: { type: mongoose.Schema.Types.ObjectId, ref: "Site" },
    activite: String,
    motif_maj: String,
    date_mise_en_vigueur: Date,
    lastReviewedAt: Date,
    reviewDueDate: Date,
    isConfidentiel: { type: Boolean, default: false },
    axe_id: { type: mongoose.Schema.Types.ObjectId, ref: "DocumentationAxe" },
    superviseur_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    redacteurs: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    verificateurs: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    approbateurs: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    documents_renvoi: [{ type: mongoose.Schema.Types.ObjectId, ref: "DocumentFile" }],
    modificationLogs: [modifLogSchema],
  },
  {
    timestamps: true,
  }
);

export { DOCUMENT_TYPES, DOCUMENT_STATUS };
export default mongoose.model("DocumentFile", documentFileSchema);
