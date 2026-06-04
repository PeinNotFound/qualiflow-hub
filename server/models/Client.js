import mongoose from "mongoose";

const clientSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true },
    raison_sociale: { type: String, required: true },
    email_contact: { type: String, lowercase: true },
    telephone: String,
    region_id: { type: mongoose.Schema.Types.ObjectId, ref: "Client_Region" },
    categorie_id: { type: mongoose.Schema.Types.ObjectId, ref: "Client_Categorie" },
    type_id: String,
  },
  { timestamps: true }
);

export default mongoose.model("Client", clientSchema);
