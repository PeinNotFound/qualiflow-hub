import PartieInteressee from "../../models/PartieInteressee.js";

export const getPartiesInteressees = async (req, res, next) => {
  try {
    const parties = await PartieInteressee.find();
    res.json({
      success: true,
      data: parties,
    });
  } catch (error) {
    next(error);
  }
};

export const createPartieInteressee = async (req, res, next) => {
  try {
    const partie = await PartieInteressee.create(req.body);
    res.status(201).json({
      success: true,
      data: partie,
    });
  } catch (error) {
    next(error);
  }
};
