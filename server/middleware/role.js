import ApiError from "../utils/ApiError.js";

/**
 * Role-based authorization
 */
const checkRole = (...allowedRoles) => {

  return (req, res, next) => {

    if (!req.user) {
      return next(
        new ApiError(
          401,
          "Unauthorized"
        )
      );
    }

    if (
      !allowedRoles.includes(req.user.role)
    ) {
      return next(
        new ApiError(
          403,
          "Forbidden: insufficient permissions"
        )
      );
    }

    next();
  };
};

/**
 * Processus isolation
 */
const checkProcessus = (
  req,
  res,
  next
) => {

  if (!req.user) {
    return next(
      new ApiError(
        401,
        "Unauthorized"
      )
    );
  }

  /**
   * Admin bypass
   */
  if (req.user.role === "admin") {
    return next();
  }

  const userProcessus =
    req.user.processus_id?.toString();

  const requestedProcessus =
    req.params.processus_id;

  if (
    userProcessus !== requestedProcessus
  ) {
    return next(
      new ApiError(
        403,
        "Forbidden: processus mismatch"
      )
    );
  }

  next();
};

export {
  checkRole,
  checkProcessus
};