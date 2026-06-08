import ApiError from "../utils/ApiError.js";

/**
 * Module-level permission map.
 * Each role lists the modules it can READ and WRITE.
 * superadmin / admin bypass all checks.
 */
export const PERMISSIONS = {
  superadmin: { read: ["*"], write: ["*"] },
  admin:      { read: ["*"], write: ["*"] },

  director: {
    read:  ["dashboard", "documentation", "audits", "actions", "nc", "kpis", "rh", "risques", "clients", "fournisseurs"],
    write: ["actions", "audits"],
  },

  pilot: {
    read:  ["dashboard", "documentation", "audits", "actions", "nc", "kpis", "rh", "risques"],
    write: ["documentation", "actions", "nc", "kpis", "risques"],
  },

  copilot: {
    read:  ["dashboard", "documentation", "audits", "actions", "nc", "kpis"],
    write: ["documentation", "actions", "nc"],
  },

  supervisor: {
    read:  ["dashboard", "documentation", "actions", "nc", "rh"],
    write: ["documentation", "actions", "nc"],
  },

  auditor: {
    read:  ["dashboard", "documentation", "audits", "actions", "nc", "rh"],
    write: ["audits"],
  },

  quality_assistant: {
    read:  ["dashboard", "documentation", "actions", "nc", "kpis", "risques"],
    write: ["nc", "actions"],
  },

  operator: {
    read:  ["dashboard", "documentation", "smart_release"],
    write: ["smart_release"],
  },
};

/**
 * Role-based authorization middleware.
 * Usage: checkRole("admin", "pilot")
 */
const checkRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new ApiError(401, "Unauthorized"));
    }

    // superadmin and admin bypass all role checks
    if (["superadmin", "admin"].includes(req.user.role)) {
      return next();
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(new ApiError(403, "Forbidden: insufficient permissions"));
    }

    next();
  };
};

/**
 * Module access check middleware.
 * Usage: checkModule("audits", "write")
 */
const checkModule = (module, access = "read") => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new ApiError(401, "Unauthorized"));
    }

    const perms = PERMISSIONS[req.user.role];
    if (!perms) {
      return next(new ApiError(403, "Forbidden: unknown role"));
    }

    const allowed = perms[access];
    if (allowed.includes("*") || allowed.includes(module)) {
      return next();
    }

    return next(new ApiError(403, `Forbidden: no ${access} access to ${module}`));
  };
};

/**
 * Processus isolation middleware.
 * Ensures a non-admin user can only access their own processus.
 */
const checkProcessus = (req, res, next) => {
  if (!req.user) {
    return next(new ApiError(401, "Unauthorized"));
  }

  // Admin bypass
  if (["superadmin", "admin", "director"].includes(req.user.role)) {
    return next();
  }

  const userProcessus     = req.user.processus_id?.toString();
  const requestedProcessus = req.params.processus_id;

  if (requestedProcessus && userProcessus !== requestedProcessus) {
    return next(new ApiError(403, "Forbidden: processus mismatch"));
  }

  next();
};

export { checkRole, checkModule, checkProcessus };