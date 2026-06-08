import mongoose from "mongoose";

const fournisseurSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true },
    raison_sociale: { type: String, required: true },
    contact: String,
    email: { type: String, lowercase: true },
    telephone: String,
    categorie_id: { type: mongoose.Schema.Types.ObjectId, ref: "Fournisseur_Categorie" },
    produits_agrees: [
      {
        type_produit_id: { type: mongoose.Schema.Types.ObjectId, ref: "Type_Produit" },
        is_agree: { type: Boolean, default: true },
      }
    ],
    contrat_expiry: Date,
    status: {
      type: String,
      enum: ["actif", "asSurveiller", "suspendu", "inactif"],
      default: "actif",
    },
    certifications: [{ type: mongoose.Schema.Types.ObjectId, ref: "DocumentFile" }],
  },
  { timestamps: true }
);

export default mongoose.model("Fournisseur", fournisseurSchema);
