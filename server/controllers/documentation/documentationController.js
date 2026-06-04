import DocumentationAxe, { AXE_LABELS } from "../../models/DocumentationAxe.js";
import DocumentFile from "../../models/DocumentFile.js";
import ReferenceGenerator from "../../utils/ReferenceGenerator.js";
import ApiError from "../../utils/ApiError.js";

export const getProcessusAxes = async (req, res, next) => {
  try {
    const { processusId } = req.params;

    let axes = await DocumentationAxe.find({ processus_id: processusId }).sort("axe_number");

    // If no axes found, initialize them
    if (axes.length === 0) {
      const initialAxes = [1, 2, 3, 4, 5].map((n) => ({
        processus_id: processusId,
        axe_number: n,
        axe_label: AXE_LABELS[n],
      }));
      axes = await DocumentationAxe.insertMany(initialAxes);
    }

    res.json({
      success: true,
      data: axes,
    });
  } catch (error) {
    next(error);
  }
};

export const uploadDocument = async (req, res, next) => {
  try {
    const { libelle, type, axe_id, fileUrl, mimeType } = req.body;

    const code = await ReferenceGenerator.generate("DocumentFile", "DOC");

    const document = await DocumentFile.create({
      code,
      libelle,
      type,
      axe_id,
      fileUrl,
      mimeType,
      statut: "enVigueur", // Defaulting to enVigueur for now
    });

    res.status(201).json({
      success: true,
      data: document,
    });
  } catch (error) {
    next(error);
  }
};

export const getDocumentsByAxe = async (req, res, next) => {
  try {
    const { axeId } = req.params;
    const documents = await DocumentFile.find({ axe_id: axeId });
    res.json({
      success: true,
      data: documents,
    });
  } catch (error) {
    next(error);
  }
};
