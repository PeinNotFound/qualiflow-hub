import PlanningEvent from "../../models/PlanningEvent.js";
import ApiError from "../../utils/ApiError.js";

export const getPlanning = async (req, res, next) => {
  try {
    const events = await PlanningEvent.find().populate("processus_id", "name code");
    res.json({
      success: true,
      data: events,
    });
  } catch (error) {
    next(error);
  }
};

export const createEvent = async (req, res, next) => {
  try {
    const { titre, flux, date_debut, date_fin, processus_id } = req.body;

    const event = await PlanningEvent.create({
      titre,
      flux,
      date_debut,
      date_fin,
      processus_id,
    });

    res.status(201).json({
      success: true,
      data: event,
    });
  } catch (error) {
    next(error);
  }
};
