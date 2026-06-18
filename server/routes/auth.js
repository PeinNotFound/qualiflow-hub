import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import User, { USER_ROLES } from "../models/User.js";

import { verifyToken } from "../middleware/auth.js";

import {
  checkRole,
  checkProcessus
} from "../middleware/role.js";

const router = express.Router();

/**
 * JWT signer
 */
function signToken(user) {
  return jwt.sign(
    {
      id: user._id,         // Fix #3 : utiliser "id" (cohérent avec middleware verifyToken)
      email: user.email,
      role: user.role,
      processus_id: user.processus_id,
      site_id: user.site_id,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d"
    }
  );
}

/**
 * Current authenticated user
 */
router.get(
  "/me",
  verifyToken,
  (req, res) => {

    res.json({
      success: true,
      user: req.user
    });
  }
);

/**
 * Register user
 *
 * Public route — auto-inscription
 * Les admins peuvent aussi créer des comptes via cette route
 */
router.post(
  "/register",

  async (req, res) => {

    try {

      const {
        name,
        full_name,   // Fix #2 : accepter full_name (envoyé par le frontend)
        email,
        password,
        role,
        employee_id,
        processus_id,
        site_id
      } = req.body;

      // Normaliser : accepter "name" ou "full_name"
      const resolvedName = name || full_name;

      if (!resolvedName || !email || !password) {
        return res.status(400).json({
          message:
            "name (ou full_name), email, et password sont requis."
        });
      }

      if (
        role &&
        !USER_ROLES.includes(role)
      ) {
        return res.status(400).json({
          message:
            `role must be one of: ${USER_ROLES.join(", ")}`
        });
      }

      const existingUser =
        await User.findOne({
          email: email.toLowerCase()
        });

      if (existingUser) {
        return res.status(409).json({
          message:
            "Email already registered."
        });
      }

      const passwordHash =
        await bcrypt.hash(password, 12);

      const user = await User.create({
        name: resolvedName,  // Fix #2 : utiliser le nom normalisé
        email,
        passwordHash,
        role: role ?? "operator",
        employee_id:
          employee_id || undefined,
        processus_id:
          processus_id || undefined,
        site_id:
          site_id || undefined,
      });

      const token = signToken(user);

      res.status(201).json({
        token,
        user: user.toSafeObject(),
      });

    } catch (error) {

      console.error(
        "Register error:",
        error
      );

      res.status(500).json({
        message:
          "Server error during registration."
      });
    }
  }
);

/**
 * Login
 *
 * Public route
 */
router.post(
  "/login",

  async (req, res) => {

    try {

      const {
        email,
        password
      } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          message:
            "email and password are required."
        });
      }

      const user =
        await User.findOne({
          email: email.toLowerCase()
        });

      if (!user || !user.isActive) {
        return res.status(401).json({
          message:
            "Invalid credentials."
        });
      }

      const isMatch =
        await bcrypt.compare(
          password,
          user.passwordHash
        );

      if (!isMatch) {
        return res.status(401).json({
          message:
            "Invalid credentials."
        });
      }

      user.lastLogin = new Date();

      await user.save();

      const token = signToken(user);

      res.json({
        token,
        user: user.toSafeObject(),
      });

    } catch (error) {

      console.error(
        "Login error:",
        error
      );

      res.status(500).json({
        message:
          "Server error during login."
      });
    }
  }
);

/**
 * Example processus-protected route
 */
router.get(
  "/processus/:processus_id",

  verifyToken,

  checkProcessus,

  (req, res) => {

    res.json({
      success: true,
      message:
        "Processus access granted"
    });
  }
);

export default router;