import RevueProcessus from "../../models/RevueProcessus.js";
import RevueDirection from "../../models/RevueDirection.js";
import ActionService from "../../services/ActionService.js";
import ApiError from "../../utils/ApiError.js";

export const createRevueProcessus = async (req, res, next) => {
  try {
    const { processus_id, periode, pilote_id, critere_evaluations } = req.body;

    const revue = await RevueProcessus.create({
      processus_id,
      periode,
      pilote_id,
      critere_evaluations,
      statut: "brouillon",
    });

    res.status(201).json({
      success: true,
      data: revue,
    });
  } catch (error) {
    next(error);
  }
};

export const createRevueDirection = async (req, res, next) => {
  try {
    const { periode_couverte, redacteur_id, swot } = req.body;

    const revue = await RevueDirection.create({
      periode_couverte,
      redacteur_id,
      swot,
      statut: "brouillon",
    });

    res.status(201).json({
      success: true,
      data: revue,
    });
  } catch (error) {
    next(error);
  }
};
