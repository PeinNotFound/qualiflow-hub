import Action from "../../models/Action.js";
import SousAction from "../../models/SousAction.js";
import ActionLog from "../../models/ActionLog.js";
import ActionService from "../../services/ActionService.js";
import ReferenceGenerator from "../../utils/ReferenceGenerator.js";
import ApiError from "../../utils/ApiError.js";

export const createAction = async (req, res, next) => {
  try {
    const { designation, description_probleme, source_module, source_id, processus_id } = req.body;

    const reference = await ReferenceGenerator.generate("Action", "ACT");

    const action = await Action.create({
      reference,
      designation,
      description_probleme,
      source_module,
      source_id,
      processus_id,
      statut: "enAttente",
    });

    res.status(201).json({
      success: true,
      data: action,
    });
  } catch (error) {
    next(error);
  }
};

export const getActions = async (req, res, next) => {
  try {
    const query = {};
    if (req.user.role !== "admin") {
      query.processus_id = req.user.processus;
    }

    const actions = await Action.find(query)
      .populate("processus_id", "name code")
      .populate("sous_actions");
    
    res.json({
      success: true,
      data: actions,
    });
  } catch (error) {
    next(error);
  }
};

export const addSousAction = async (req, res, next) => {
  try {
    const { actionId } = req.params;
    const { designation, date_echeance, responsable_realisation_id } = req.body;

    const action = await Action.findById(actionId);
    if (!action) throw new ApiError(404, "Action not found");

    const sousAction = await SousAction.create({
      action_id: actionId,
      designation,
      date_echeance,
      responsable_realisation_id,
    });

    action.sous_actions.push(sousAction._id);
    await action.save();

    res.status(201).json({
      success: true,
      data: sousAction,
    });
  } catch (error) {
    next(error);
  }
};

export const updateSousAction = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { taux_realisation, statut, motif } = req.body;

    if (!motif) throw new ApiError(400, "Un motif est obligatoire pour toute modification");

    const sousAction = await SousAction.findByIdAndUpdate(
      id,
      { taux_realisation, statut },
      { new: true }
    );

    if (!sousAction) throw new ApiError(404, "Sous-action non trouvée");

    // Recompute global advancement
    await ActionService.recomputeAdvancement(sousAction.action_id);

    // TODO: Create ActionLog

    res.json({
      success: true,
      data: sousAction,
    });
  } catch (error) {
    next(error);
  }
};
