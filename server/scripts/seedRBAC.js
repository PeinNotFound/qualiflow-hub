import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import bcrypt from "bcryptjs";

// Models
import User from "../models/User.js";
import Site from "../models/Site.js";
import Direction from "../models/Direction.js";
import Metier from "../models/Metier.js";
import Processus from "../models/Processus.js";
import Employee from "../models/Employee.js";
import Fonction from "../models/Fonction.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, "../.env") });

const DEFAULT_PASSWORD = "Password123";

const ROLES_DATA = [
  { role: "superadmin", nom: "ADMIN", prenom: "Super", email: "superadmin@msl.ma" },
  { role: "admin", nom: "ADMIN", prenom: "Standard", email: "admin@msl.ma" },
  { role: "pilot", nom: "BENALI", prenom: "Ahmed", email: "pilot@msl.ma" },
  { role: "copilot", nom: "CHERKAOUI", prenom: "Mehdi", email: "copilot@msl.ma" },
  { role: "supervisor", nom: "EL IDRISSI", prenom: "Smail", email: "supervisor@msl.ma" },
  { role: "auditor", nom: "TAZI", prenom: "Karim", email: "auditor@msl.ma" },
  { role: "quality_assistant", nom: "BENJELLOUN", prenom: "Youssef", email: "quality@msl.ma" },
  { role: "director", nom: "ALAMI", prenom: "Laila", email: "director@msl.ma" },
  { role: "operator", nom: "ZAHID", prenom: "Omar", email: "operator@msl.ma" },
];

async function seed() {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected.");

    // Ensure core data exists (Site, Direction, etc.)
    let site = await Site.findOne();
    if (!site) {
      site = await Site.create({ code: "S01", designation: "Siège Casablanca", adresse: "Casablanca" });
    }

    let direction = await Direction.findOne();
    if (!direction) {
      direction = await Direction.create({ code: "DIR_EXP", designation: "Direction Exploitation" });
    }

    let metier = await Metier.create({ code: `MET_${Date.now()}`, designation: "Qualité & Processus" });

    let processus = await Processus.findOne();
    if (!processus) {
      processus = await Processus.create({ code: "PROC_GEN", name: "Processus Général", type: "management" });
    }

    const passwordHash = await bcrypt.hash(DEFAULT_PASSWORD, 10);

    console.log("Seeding RBAC users and employees...");

    for (const data of ROLES_DATA) {
      // 1. Create or Update Employee
      let employee = await Employee.findOne({ email: data.email });
      if (!employee) {
        employee = await Employee.create({
          matricule: `EMP_${data.role.toUpperCase()}`,
          nom: data.nom,
          prenom: data.prenom,
          email: data.email,
          poste_actuel: data.role,
          typeContrat: "CDI",
          site_id: site._id,
          direction_id: direction._id,
          metier_id: metier._id,
          is_Superviseur: ["pilot", "supervisor", "director"].includes(data.role),
          is_Auditeur_Interne: data.role === "auditor",
        });
        console.log(`- Created Employee: ${data.prenom} ${data.nom}`);
      }

      // 2. Create or Update User
      let user = await User.findOne({ email: data.email });
      if (!user) {
        user = await User.create({
          name: `${data.prenom} ${data.nom}`,
          email: data.email,
          passwordHash,
          role: data.role,
          employee_id: employee._id,
          site_id: site._id,
          processus_id: processus._id,
        });
        console.log(`- Created User: ${data.email} (Role: ${data.role})`);
      }
    }

    console.log("\nRBAC Seed successful!");
    console.log("Default Password for all users:", DEFAULT_PASSWORD);
    
  } catch (error) {
    console.error("RBAC Seed failed:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected.");
    process.exit(0);
  }
}

seed();
