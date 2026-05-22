import mongoose from "mongoose";

const fonctionSchema = new mongoose.Schema(
  {
    designation: {
      type: String,
      required: true,
      trim: true,
    },
    code_doc_fiche_poste: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DocumentFile",
    },
    qualifications_requises: [
      {
        qualification_id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Qualification",
        },
        niveau_requis: {
          type: Number,
          min: 1,
          max: 5,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Fonction", fonctionSchema);
