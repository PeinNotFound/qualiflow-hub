import Fournisseur from "../../models/Fournisseur.js";
import EvaluationFournisseur from "../../models/EvaluationFournisseur.js";
import ActionService from "../../services/ActionService.js";
import ApiError from "../../utils/ApiError.js";

export const getFournisseurs = async (req, res, next) => {
  try {
    const fournisseurs = await Fournisseur.find().populate("categorie_id", "designation");
    res.json({
      success: true,
      data: fournisseurs,
    });
  } catch (error) {
    next(error);
  }
};

export const createEvaluation = async (req, res, next) => {
  try {
    const { fournisseur_id, notes_criteres, score_final, trigger_action } = req.body;

    const evaluation = await EvaluationFournisseur.create({
      fournisseur_id,
      notes_criteres,
      score_final,
      createdAt: new Date(),
    });

    // Automation: If score is low, trigger action
    if (trigger_action || (score_final < 60)) { // 60 is a dummy threshold
      const action = await ActionService.instancierAction({
        designation: `Action corrective - Évaluation Fournisseur`,
        description_probleme: `Score d'évaluation insuffisant: ${score_final}%`,
        source_module: "fournisseur",
        source_id: fournisseur_id,
        processus_id: null, // Should ideally be related to Achats processus
      });
      evaluation.action_id = action._id;
      await evaluation.save();
    }

    res.status(201).json({
      success: true,
      data: evaluation,
    });
  } catch (error) {
    next(error);
  }
};
