import mongoose from "mongoose";

const pncFicheSchema = new mongoose.Schema(
  {
    reference: { type: String, unique: true },
    date_detection: { type: Date, default: Date.now },
    date_livraison: Date,
    atelier: String,
    lieu_detection: { type: String, enum: ["interne", "client"], default: "interne" },
    processus_id: { type: mongoose.Schema.Types.ObjectId, ref: "Processus" },
    reclamation_fournisseur_id: { type: mongoose.Schema.Types.ObjectId, ref: "Reclamation_Fournisseur" },
    reclamation_client_id: { type: mongoose.Schema.Types.ObjectId, ref: "Reclamation_Client" },
    nc_id: { type: mongoose.Schema.Types.ObjectId, ref: "NC" },
    actions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Action" }],
    // Details embed
    details: [
      {
        produit_id: { type: mongoose.Schema.Types.ObjectId, ref: "Produit" },
        type_nc_id: String,
        num_of: String,
        num_lot: String,
        qte_detectee: Number,
        qte_produite: Number,
      }
    ],
    // Traitement embed
    traitement: {
      type_traitement: { type: String, enum: ["retouche", "rebut", "derogation", "acceptation"] },
      decideur_id: { type: mongoose.Schema.Types.ObjectId, ref: "Employee" },
      responsable_traitement_id: { type: mongoose.Schema.Types.ObjectId, ref: "Employee" },
      responsable_suivi_id: { type: mongoose.Schema.Types.ObjectId, ref: "Employee" },
      delai: Date,
      qte_rejetee: Number,
      valeur_rejet: Number,
      qte_declassee: Number,
      qte_acceptee: Number,
      cout_total: Number,
      status: { type: String, enum: ["enAttente", "enCours", "cloture"] },
      closed_at: Date,
    }
  },
  { timestamps: true }
);

export default mongoose.model("PNC_Fiche", pncFicheSchema);
