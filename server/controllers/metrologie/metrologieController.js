import Equipement from "../../models/Equipement.js";
import Notification from "../../models/Notification.js";

export const getEquipements = async (req, res, next) => {
  try {
    const equipements = await Equipement.find();
    res.json({
      success: true,
      data: equipements,
    });
  } catch (error) {
    next(error);
  }
};

export const createEquipement = async (req, res, next) => {
  try {
    const equipement = await Equipement.create(req.body);
    res.status(201).json({
      success: true,
      data: equipement,
    });

    await Notification.notify(req.user.id, {
      type: "success",
      module: "Métrologie",
      message: `Nouvel équipement enregistré : ${equipement.designation}`,
      link: "/metrologie"
    });
  } catch (error) {
    next(error);
  }
};
