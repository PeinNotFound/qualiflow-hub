import Audit from "../../models/Audit.js";
import AuditParametre from "../../models/AuditParametre.js";
import ConstatEcart from "../../models/ConstatEcart.js";
import NC from "../../models/NC.js";
import ActionService from "../../services/ActionService.js";
import ReferenceGenerator from "../../utils/ReferenceGenerator.js";
import ApiError from "../../utils/ApiError.js";
import Notification from "../../models/Notification.js";

export const createAudit = async (req, res, next) => {
  try {
    const { processus_id, type, date_debut_prev, date_fin_prev, auditeurs, audites } = req.body;

    const reference = await ReferenceGenerator.generate("Audit", "AUDIT");

    const audit = await Audit.create({
      reference,
      processus_id,
      type,
      date_debut_prev,
      date_fin_prev,
      auditeurs,
      audites,
      etat: "nonRealise",
    });

    // Notify auditors
    if (auditeurs && auditeurs.length > 0) {
      for (const auditorId of auditeurs) {
        await Notification.notify(auditorId, {
          type: "info",
          module: "Audit",
          message: `Vous avez été assigné à l'audit ${reference}`,
          link: "/audits"
        });
      }
    }

    res.status(201).json({
      success: true,
      data: audit,
    });
  } catch (error) {
    next(error);
  }
};

export const addConstatEcart = async (req, res, next) => {
  try {
    const { auditId } = req.params;
    const { description, type_ecart_id, gravite_id, audite_concerne_id, chapitre_iso, trigger_nc } = req.body;

    const audit = await Audit.findById(auditId);
    if (!audit) throw new ApiError(404, "Audit not found");

    const constat = await ConstatEcart.create({
      audit_id: auditId,
      description,
      type_ecart_id,
      gravite_id,
      audite_concerne_id,
      chapitre_iso,
    });

    audit.ecarts.push(constat._id);

    // Automation: Trigger NC and Action if requested
    if (trigger_nc) {
      const ncRef = await ReferenceGenerator.generate("NC", "NC");
      const nc = await NC.create({
        reference: ncRef,
        titre: `Écart constaté - Audit ${audit.reference}`,
        description,
        source_module: "audit",
        source_id: auditId,
        processus_id: audit.processus_id,
        severity: "mineure", // Default, can be refined based on gravite_id
        detecte_par: req.user.id,
      });

      const action = await ActionService.instancierAction({
        designation: `Action corrective - Écart Audit ${audit.reference}`,
        description_probleme: description,
        source_module: "nc",
        source_id: nc._id,
        processus_id: audit.processus_id,
      });

      nc.actions.push(action._id);
      await nc.save();

      constat.action_id = action._id;
      await constat.save();

      audit.nc_ids.push(nc._id);

      // Notify detector
      await Notification.notify(req.user.id, {
        type: "error",
        module: "Audit",
        message: `PNC générée automatiquement pour l'audit ${audit.reference}`,
        link: "/non-conformites"
      });
    }

    await audit.save();

    res.status(201).json({
      success: true,
      data: constat,
    });
  } catch (error) {
    next(error);
  }
};

export const getAudits = async (req, res, next) => {
  try {
    const query = {};
    if (req.user.role !== "admin") {
      query.processus_id = req.user.processus;
    }

    const audits = await Audit.find(query)
      .populate("processus_id", "name code")
      .populate("auditeurs", "nom prenom")
      .populate("ecarts");
    
    res.json({
      success: true,
      data: audits,
    });
  } catch (error) {
    next(error);
  }
};
