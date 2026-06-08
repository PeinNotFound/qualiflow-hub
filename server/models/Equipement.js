import mongoose from "mongoose";

const equipementSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true },
    designation: { type: String, required: true },
    machine: { type: String },
    responsable: { type: String },
    etat: { type: String, enum: ["operationnel", "etalonnage", "en_reparation", "hors_service"], default: "operationnel" },
    miseEnService: { type: String },
    prochaineEtalonnage: { type: String },
    frequenceEtalonnage: { type: Number, default: 12 }, // en mois
    historique: [
      {
        date: { type: Date, default: Date.now },
        type: { type: String },
        organisme: { type: String },
        resultat: { type: String },
        certificatRef: { type: String },
      }
    ],
    site_id: { type: mongoose.Schema.Types.ObjectId, ref: "Site" },
  },
  { timestamps: true }
);

export default mongoose.model("Equipement", equipementSchema);
