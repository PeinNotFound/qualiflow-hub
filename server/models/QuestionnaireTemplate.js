import mongoose from "mongoose";

const questionnaireTemplateSchema = new mongoose.Schema(
  {
    titre: { type: String, required: true },
    texte_intro: String,
    texte_fin: String,
    questions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Question" }],
  },
  { timestamps: true }
);

export default mongoose.model("Questionnaire_Template", questionnaireTemplateSchema);
