import Action from "../models/Action.js";
import ActionLog from "../models/ActionLog.js"; // I'll create this model too

/**
 * Service to handle automated Action logic
 */
class ActionService {
  /**
   * Instantiates an action from a source module (NC, Audit, etc)
   */
  async instancierAction(payload) {
    const {
      designation,
      source_module,
      source_id,
      processus_id,
      description_probleme,
    } = payload;

    // 1. Generate reference (Logic can be refined)
    const count = await Action.countDocuments();
    const reference = `ACT-${new Date().getFullYear()}-${(count + 1).toString().padStart(3, "0")}`;

    // 2. Create the action
    const action = await Action.create({
      reference,
      designation,
      description_probleme,
      source_module,
      source_id,
      processus_id,
      statut: "enAttente",
    });

    return action;
  }

  /**
   * Recalculate global advancement based on sub-actions
   */
  async recomputeAdvancement(actionId) {
    const action = await Action.findById(actionId).populate("sous_actions");
    if (!action || !action.sous_actions.length) return 0;

    const total = action.sous_actions.reduce((acc, sa) => acc + (sa.taux_realisation || 0), 0);
    const average = Math.round(total / action.sous_actions.length);

    action.taux_avancement = average;
    await action.save();

    return average;
  }
}

export default new ActionService();
