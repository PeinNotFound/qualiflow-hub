import mongoose from "mongoose";

const axePolitiqueSchema = new mongoose.Schema(
  {
    code_axe: { type: String, required: true, unique: true },
    libelle: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model("Axe_Politique", axePolitiqueSchema);
