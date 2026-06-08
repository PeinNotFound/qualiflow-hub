import mongoose from "mongoose";

const ecartTypeSchema = new mongoose.Schema({ libelle: String }, { _id: false });
const graviteSchema = new mongoose.Schema({ libelle: String, index_ordre: Number }, { _id: false });

const auditParametreSchema = new mongoose.Schema(
  {
    champ_nom: String,
    champ_criticite: {
      type: String,
      enum: ["faible", "moyen", "critique"],
    },
    champ_acces: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    type_audit: {
      type: String,
      enum: ["interne", "externe", "flash"],
    },
    auditeurs_qualifies: [{ type: mongoose.Schema.Types.ObjectId, ref: "Employee" }],
    circuit_validation_ids: [{ type: mongoose.Schema.Types.ObjectId, ref: "Employee" }],
    ecart_types: [ecartTypeSchema],
    gravites: [graviteSchema],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Audit_Parametre", auditParametreSchema);
