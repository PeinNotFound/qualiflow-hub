import mongoose from "mongoose";

const USER_ROLES = [
  "superadmin",
  "admin",
  "pilot",
  "copilot",
  "supervisor",
  "auditor",
  "quality_assistant",
  "director",
  "operator"
];

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: USER_ROLES,
      default: "operator",
    },
    employee_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
    },
    processus_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Processus",
    },
    site_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Site",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    lastLogin: {
      type: Date,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: true },
  }
);

userSchema.methods.toSafeObject = function toSafeObject() {
  return {
    _id: this._id,
    name: this.name,
    email: this.email,
    role: this.role,
    employee_id: this.employee_id,
    processus_id: this.processus_id,
    site_id: this.site_id,
    isActive: this.isActive,
    lastLogin: this.lastLogin,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
  };
};

export { USER_ROLES };
export default mongoose.model("User", userSchema);
