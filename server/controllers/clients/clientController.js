import ReclamationClient from "../../models/ReclamationClient.js";
import PNCFiche from "../../models/PNCFiche.js";
import ActionService from "../../services/ActionService.js";
import ReferenceGenerator from "../../utils/ReferenceGenerator.js";
import ApiError from "../../utils/ApiError.js";

export const createReclamation = async (req, res, next) => {
  try {
    const { client_id, description, with_return, site_id } = req.body;

    const reference = await ReferenceGenerator.generate("Reclamation_Client", "REC_CLT");

    const reclamation = await ReclamationClient.create({
      reference,
      client_id,
      description,
      with_return,
      site_id,
      statut: "saisie",
    });

    // Automation: If with_return, trigger PNC alert
    if (with_return) {
      const pncRef = await ReferenceGenerator.generate("PNC_Fiche", "PNC");
      const pnc = await PNCFiche.create({
        reference: pncRef,
        date_detection: new Date(),
        lieu_detection: "client",
        reclamation_client_id: reclamation._id,
        description: `Triggered by Reclamation ${reference}`,
      });
      reclamation.pnc_id = pnc._id;
      await reclamation.save();
    }

    res.status(201).json({
      success: true,
      data: reclamation,
    });
  } catch (error) {
    next(error);
  }
};

export const getReclamations = async (req, res, next) => {
  try {
    const reclamations = await ReclamationClient.find().populate("client_id", "raison_sociale");
    res.json({
      success: true,
      data: reclamations,
    });
  } catch (error) {
    next(error);
  }
};
