import mongoose from "mongoose";

const actionLogSchema = new mongoose.Schema(
  {
    action_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Action",
      required: true,
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    champ_modifie: {
      type: String,
      required: true,
    },
    ancienne_valeur: String,
    nouvelle_valeur: String,
    motif: {
      type: String,
      required: true, // Motif obligatoire selon le CDC
    },
  },
  {
    timestamps: { createdAt: "timestamp", updatedAt: false },
  }
);

export default mongoose.model("Action_Log", actionLogSchema);
