import mongoose from "mongoose";

class ReferenceGenerator {
  /**
   * Generates a unique reference for a model
   * Format: PREFIX-YYYY-XXX
   */
  async generate(modelName, prefix) {
    const model = mongoose.model(modelName);
    const count = await model.countDocuments();
    const year = new Date().getFullYear();
    const sequence = (count + 1).toString().padStart(3, "0");
    
    return `${prefix}-${year}-${sequence}`;
  }
}

export default new ReferenceGenerator();
