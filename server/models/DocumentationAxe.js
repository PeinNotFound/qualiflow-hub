import mongoose from "mongoose";

const AXE_LABELS = {
  1: "Fiche d'Identité et Gouvernance",
  2: "Cartographie du Processus",
  3: "Procédures et Instructions",
  4: "KPIs",
  5: "Enregistrements et Preuves",
};

const documentationAxeSchema = new mongoose.Schema(
  {
    processus_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Processus",
      required: true,
    },
    axe_number: {
      type: Number,
      enum: [1, 2, 3, 4, 5],
      required: true,
    },
    axe_label: String,
    content: mongoose.Schema.Types.Mixed,
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

documentationAxeSchema.pre("save", function (next) {
  if (!this.axe_label) {
    this.axe_label = AXE_LABELS[this.axe_number];
  }
  next();
});

export { AXE_LABELS };
export default mongoose.model("DocumentationAxe", documentationAxeSchema);
