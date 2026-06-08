import mongoose from "mongoose";

const planningEventSchema = new mongoose.Schema(
  {
    titre: { type: String, required: true },
    flux: {
      type: String,
      enum: ["audit", "kpi", "reunion", "documentaire"],
      required: true,
    },
    processus_id: { type: mongoose.Schema.Types.ObjectId, ref: "Processus" },
    date_debut: { type: Date, required: true },
    date_fin: { type: Date, required: true },
    recurrence: {
      type: String,
      enum: ["unique", "mensuel", "trimestriel", "semestriel", "annuel"],
      default: "unique",
    },
    responsable_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    status: {
      type: String,
      enum: ["planifie", "realise", "reporte", "annule"],
      default: "planifie",
    },
    linked_id: mongoose.Schema.Types.ObjectId,
    linked_type: String,
    alert_sent: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model("Planning_Event", planningEventSchema);
