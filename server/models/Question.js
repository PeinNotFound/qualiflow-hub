import mongoose from "mongoose";

const questionSchema = new mongoose.Schema(
  {
    questionnaire_id: { type: mongoose.Schema.Types.ObjectId, ref: "Questionnaire_Template", required: true },
    libelle: { type: String, required: true },
    variable_id: String,
    type_question: {
      type: String,
      enum: ["choixMultiple", "matriceSimple", "matriceDouble", "numerique", "ouverte"],
      default: "choixMultiple",
    },
    est_obligatoire: { type: Boolean, default: false },
    est_unique: { type: Boolean, default: false },
    limite_min: Number,
    limite_max: Number,
    options: [String],
  },
  { timestamps: true }
);

export default mongoose.model("Question", questionSchema);
