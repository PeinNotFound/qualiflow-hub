import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Models
import User from "../models/User.js";
import Site from "../models/Site.js";
import Direction from "../models/Direction.js";
import Metier from "../models/Metier.js";
import Processus from "../models/Processus.js";
import Employee from "../models/Employee.js";
import Fonction from "../models/Fonction.js";
import Qualification from "../models/Qualification.js";
import Habilitation from "../models/Habilitation.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, "../.env") });

async function seed() {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected.");

    // Clean current data
    console.log("Cleaning old data...");
    await Promise.all([
      User.deleteMany({}),
      Employee.deleteMany({}),
      Site.deleteMany({}),
      Direction.deleteMany({}),
      Metier.deleteMany({}),
      Processus.deleteMany({}),
      Fonction.deleteMany({}),
      Qualification.deleteMany({}),
      Habilitation.deleteMany({}),
    ]);

    console.log("Seeding core identity data...");
    
    // 1. Sites, Directions, Metiers
    const site = await Site.create({
      code: "S01",
      designation: "Siège Casablanca",
      adresse: "Boulevard Zerktouni, Casablanca",
    });

    const direction = await Direction.create({
      code: "DIR_EXP",
      designation: "Direction Exploitation",
    });

    const metier = await Metier.create({
      code: "MET_LOG",
      designation: "Logistique & Transport",
    });

    // 2. Processus
    const processus = await Processus.create({
      code: "PROC_SMA",
      name: "Pilotage SMQ",
      type: "management",
      objectifs: ["Améliorer la satisfaction client", "Réduire les NC"],
    });

    // 3. Qualifications
    const qualif = await Qualification.create({
      designation: "Audit Interne ISO 9001",
      type: "reglementaire",
      is_periodique: true,
      frequence_mois: 24,
    });

    // 4. Fonction
    const fonction = await Fonction.create({
      designation: "Responsable Qualité",
      qualifications_requises: [
        { qualification_id: qualif._id, niveau_requis: 4 }
      ]
    });

    // 5. Employee
    const employee = await Employee.create({
      matricule: "E001",
      nom: "ALAOUI",
      prenom: "Ahmed",
      email: "ahmed.alaoui@msl.ma",
      poste_actuel: "Chef de Processus",
      typeContrat: "CDI",
      processus_id: processus._id,
      site_id: site._id,
      direction_id: direction._id,
      metier_id: metier._id,
      fonction_id: fonction._id,
      is_Superviseur: true,
      is_Auditeur_Interne: true,
    });

    // Update Processus Pilote
    processus.pilote_id = employee._id;
    await processus.save();

    // 6. User (Linked to Employee)
    const user = await User.create({
      name: "Ahmed ALAOUI",
      email: "ahmed.alaoui@msl.ma",
      passwordHash: "dummy_hash", // Register route would use bcrypt
      role: "admin",
      employee_id: employee._id,
      processus_id: processus._id,
      site_id: site._id,
    });

    console.log("Seed successful!");
    console.log(`Created User: ${user.email}`);
    
  } catch (error) {
    console.error("Seed failed:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected.");
    process.exit(0);
  }
}

seed();
