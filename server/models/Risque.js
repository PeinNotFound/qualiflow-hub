import mongoose from "mongoose";

const risqueSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true },
    type: { type: String, enum: ["menace", "opportunite"], default: "menace" },
    titre: { type: String, required: true },
    domaine: { type: String },
    cause: { type: String },
    evenement: { type: String },
    enjeu: { type: String },
    G: { type: Number, default: 0 },
    O: { type: Number, default: 0 },
    D: { type: Number, default: 0 },
    criticite: { type: Number, default: 0 },
    seuil: { type: Number, default: 12 },
    significatif: { type: Boolean, default: false },
    planAction: { type: String },
    resCriticite: { type: Number },
    processus_id: { type: mongoose.Schema.Types.ObjectId, ref: "Processus" },
    site_id: { type: mongoose.Schema.Types.ObjectId, ref: "Site" },
  },
  { timestamps: true }
);

risqueSchema.pre("save", function(next) {
  this.criticite = this.G * this.O * this.D;
  this.significatif = this.criticite >= this.seuil;
  next();
});

export default mongoose.model("Risque", risqueSchema);
