import PNCFiche from "../../models/PNCFiche.js";
import ActionService from "../../services/ActionService.js";
import ReferenceGenerator from "../../utils/ReferenceGenerator.js";
import ApiError from "../../utils/ApiError.js";

export const createPNC = async (req, res, next) => {
  try {
    const { date_detection, date_livraison, atelier, lieu_detection, processus_id, details } = req.body;

    const reference = await ReferenceGenerator.generate("PNC_Fiche", "PNC");

    const pnc = await PNCFiche.create({
      reference,
      date_detection,
      date_livraison,
      atelier,
      lieu_detection,
      processus_id,
      details,
      status: "enAttente",
    });

    res.status(201).json({
      success: true,
      data: pnc,
    });
  } catch (error) {
    next(error);
  }
};

export const updateTraitement = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { type_traitement, decideur_id, delai, trigger_action } = req.body;

    const pnc = await PNCFiche.findById(id);
    if (!pnc) throw new ApiError(404, "PNC non trouvée");

    pnc.traitement = {
      ...pnc.traitement,
      type_traitement,
      decideur_id,
      delai,
      status: "enCours",
    };

    if (trigger_action) {
      const action = await ActionService.instancierAction({
        designation: `Action corrective pour PNC: ${pnc.reference}`,
        description_probleme: `Traitement PNC: ${type_traitement}`,
        source_module: "pnc",
        source_id: pnc._id,
        processus_id: pnc.processus_id,
      });
      pnc.actions.push(action._id);
    }

    await pnc.save();

    res.json({
      success: true,
      data: pnc,
    });
  } catch (error) {
    next(error);
  }
};
