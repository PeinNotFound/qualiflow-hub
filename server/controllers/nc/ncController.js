import NC from "../../models/NC.js";
import ActionService from "../../services/ActionService.js";
import ReferenceGenerator from "../../utils/ReferenceGenerator.js";
import ApiError from "../../utils/ApiError.js";

export const createNC = async (req, res, next) => {
  try {
    const { titre, description, source_module, source_id, processus_id, severity, type_nc, echeance, auto_create_action } = req.body;

    const reference = await ReferenceGenerator.generate("NC", "NC");

    const nc = await NC.create({
      reference,
      titre,
      description,
      source_module,
      source_id,
      processus_id,
      severity,
      type_nc,
      detecte_par: req.user.id,
      echeance,
    });

    // Auto-create action if requested
    if (auto_create_action) {
      const action = await ActionService.instancierAction({
        designation: `Action corrective pour NC: ${titre}`,
        description_probleme: description,
        source_module: "nc",
        source_id: nc._id,
        processus_id,
      });
      
      nc.actions.push(action._id);
      await nc.save();
    }

    res.status(201).json({
      success: true,
      data: nc,
    });
  } catch (error) {
    next(error);
  }
};

export const getNCs = async (req, res, next) => {
  try {
    const query = {};
    
    // RBAC: Non-admins can only see their own processus
    if (req.user.role !== "admin") {
      query.processus_id = req.user.processus;
    }

    const ncs = await NC.find(query).populate("processus_id", "name code");
    
    res.json({
      success: true,
      data: ncs,
    });
  } catch (error) {
    next(error);
  }
};
