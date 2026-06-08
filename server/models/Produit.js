import mongoose from "mongoose";

const produitSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true },
    designation: { type: String, required: true },
    prix_unitaire: { type: Number, default: 0 },
    personnes_a_informer: [{ type: mongoose.Schema.Types.ObjectId, ref: "Employee" }],
    processus_id: { type: mongoose.Schema.Types.ObjectId, ref: "Processus" },
  },
  { timestamps: true }
);

export default mongoose.model("Produit", produitSchema);
