import mongoose from "mongoose";

const NotificationSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    type: { type: String, enum: ["info", "warning", "error", "success"], default: "info" },
    module: { type: String, required: true }, // e.g. "NC", "Audit", "Metrologie"
    message: { type: String, required: true },
    link: { type: String }, // Frontend route to navigate to
    read: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Static helper to create a notification
NotificationSchema.statics.notify = async function (userId, { type, module, message, link }) {
  return this.create({ userId, type, module, message, link });
};

const Notification = mongoose.model("Notification", NotificationSchema);
export default Notification;
