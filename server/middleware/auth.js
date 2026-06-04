import jwt from "jsonwebtoken";
import ApiError from "../utils/ApiError.js";



/**
 * Extract Bearer token from Authorization header
 */
const extractToken = (req) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return null;
  }

  /**
   * Expected format:
   * Authorization: Bearer TOKEN
   */
  const parts = authHeader.split(" ");

  if (
    parts.length !== 2 ||
    parts[0] !== "Bearer"
  ) {
    return null;
  }

  return parts[1];
};

/**
 * Main authentication middleware
 */
const verifyToken = (req, res, next) => {
  try {

    const token = extractToken(req);

    if (!token) {
      return next(
        new ApiError(
          401,
          "Authentication token missing or malformed"
        )
      );
    }

    /**
     * Verify JWT
     */
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    /**
     * Attach user payload to request
     */
    req.user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
      processus: decoded.processus_id
    };

    next();

  } catch (error) {

    /**
     * Token expired
     */
    if (error.name === "TokenExpiredError") {
      return next(
        new ApiError(
          401,
          "Token expired"
        )
      );
    }

    /**
     * Invalid token
     */
    if (error.name === "JsonWebTokenError") {
      return next(
        new ApiError(
          401,
          "Invalid token"
        )
      );
    }

    /**
     * Unknown auth error
     */
    return next(
      new ApiError(
        500,
        "Authentication failed"
      )
    );
  }
};

/**
 * Optional authentication middleware
 */
const optionalAuth = (req, res, next) => {
  try {

    const token = extractToken(req);

    if (!token) {
      return next();
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    req.user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
      processus: decoded.processus_id,
      site: decoded.site_id
    };

    next();

  } catch (error) {
    next();
  }
};

export {
  verifyToken,
  optionalAuth
};