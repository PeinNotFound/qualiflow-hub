import Risque from "../../models/Risque.js";
import Notification from "../../models/Notification.js";

export const getRisques = async (req, res, next) => {
  try {
    const risques = await Risque.find().populate("processus_id", "name");
    res.json({
      success: true,
      data: risques,
    });
  } catch (error) {
    next(error);
  }
};

export const createRisque = async (req, res, next) => {
  try {
    const risque = await Risque.create(req.body);
    res.status(201).json({
      success: true,
      data: risque,
    });

    // Notify if high criticality
    if (risque.criticite >= 15) {
      await Notification.notify(req.user.id, {
        type: "error",
        module: "Risque",
        message: `Risque critique détecté : ${risque.identifiant} (Score: ${risque.criticite})`,
        link: "/risques"
      });
    }
  } catch (error) {
    next(error);
  }
};
