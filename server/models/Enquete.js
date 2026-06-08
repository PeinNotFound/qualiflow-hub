import mongoose from "mongoose";

const reponseEmbedSchema = new mongoose.Schema({
  client_id: { type: mongoose.Schema.Types.ObjectId, ref: "Client" },
  date_reponse: { type: Date, default: Date.now },
  answers: [
    {
      question_id: { type: mongoose.Schema.Types.ObjectId, ref: "Question" },
      valeur: mongoose.Schema.Types.Mixed,
    }
  ],
}, { _id: false });

const enqueteSchema = new mongoose.Schema(
  {
    reference: { type: String, unique: true },
    questionnaire_id: { type: mongoose.Schema.Types.ObjectId, ref: "Questionnaire_Template" },
    date_debut: Date,
    date_fin: Date,
    mode: { type: String, enum: ["client", "anonyme"], default: "client" },
    clients: [{ type: mongoose.Schema.Types.ObjectId, ref: "Client" }],
    lien_public: String,
    reponses: [reponseEmbedSchema],
    action_id: { type: mongoose.Schema.Types.ObjectId, ref: "Action" },
  },
  { timestamps: true }
);

export default mongoose.model("Enquete", enqueteSchema);
