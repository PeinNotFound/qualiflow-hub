import Indicateur from "../../models/Indicateur.js";
import IndicateurValeur from "../../models/IndicateurValeur.js";
import HistoriqueCible from "../../models/HistoriqueCible.js";
import ApiError from "../../utils/ApiError.js";

export const createIndicateur = async (req, res, next) => {
  try {
    const { libelle, processus_id, periodicite, unite, responsable_id } = req.body;

    const indicateur = await Indicateur.create({
      libelle,
      processus_id,
      periodicite,
      unite,
      responsable_id,
    });

    res.status(201).json({
      success: true,
      data: indicateur,
    });
  } catch (error) {
    next(error);
  }
};

export const addValeur = async (req, res, next) => {
  try {
    const { indicateurId } = req.params;
    const { date_periode, valeur_saisie, commentaire } = req.body;

    const valeur = await IndicateurValeur.create({
      indicateur_id: indicateurId,
      date_periode,
      valeur_saisie,
      commentaire,
      saisi_par: req.user.id,
    });

    // Potential optimization: Check against target and trigger NC if below threshold

    res.status(201).json({
      success: true,
      data: valeur,
    });
  } catch (error) {
    next(error);
  }
};

export const getDashboardKPIs = async (req, res, next) => {
  try {
    const query = {};
    if (req.user.role !== "admin") {
      query.processus_id = req.user.processus;
    }

    const indicateurs = await Indicateur.find(query).populate("processus_id", "name code");
    
    // In a real scenario, we would use an aggregation pipeline to fetch values and current targets
    
    res.json({
      success: true,
      data: indicateurs,
    });
  } catch (error) {
    next(error);
  }
};
