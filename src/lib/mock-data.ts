// Shared mock data for cross-module consistency (RH ⇄ Documentation ⇄ Audits ⇄ Actions)

export type EmployeeStatus = "actif" | "conge" | "inactif";
export interface Employee {
  id: string;
  matricule: string;
  fullName: string;
  email: string;
  fonction: string;
  direction: string;
  site: string;
  metier: string;
  groupe: string;
  isAuditor: boolean;
  isSupervisor: boolean;
  diffusion: "electronique" | "papier";
  status: EmployeeStatus;
  qualifications: { name: string; level: number; expiresAt?: string }[];
}

export const fonctions = [
  { code: "F-001", name: "Responsable Qualité", docCode: "FF-RQ-01" },
  { code: "F-002", name: "Chef d'expédition", docCode: "FF-CE-01" },
  { code: "F-003", name: "Chauffeur poids lourd", docCode: "FF-CPL-01" },
  { code: "F-004", name: "Magasinier", docCode: "FF-MAG-01" },
  { code: "F-005", name: "Auditeur interne", docCode: "FF-AI-01" },
  { code: "F-006", name: "Chargé d'achats", docCode: "FF-CA-01" },
];

export const typesQualif = [
  { id: "tq-1", name: "Sécurité", inclureBadge: true },
  { id: "tq-2", name: "Technique métier", inclureBadge: true },
  { id: "tq-3", name: "Informatique", inclureBadge: false },
  { id: "tq-4", name: "Management de la Qualité", inclureBadge: true },
];

export const qualifications = [
  { id: "q-1", name: "CACES R489 cat.3", typeId: "tq-2", periodique: true, periode: "5 ans" },
  { id: "q-2", name: "ADR Marchandises dangereuses", typeId: "tq-1", periodique: true, periode: "5 ans" },
  { id: "q-3", name: "Auditeur ISO 9001:2015", typeId: "tq-4", periodique: true, periode: "3 ans" },
  { id: "q-4", name: "Excel avancé", typeId: "tq-3", periodique: false },
  { id: "q-5", name: "Habilitation douane TIR", typeId: "tq-1", periodique: true, periode: "2 ans" },
];

export const sites = ["Casablanca HQ", "Tanger Med", "Marrakech", "Agadir Port"];
export const directions = ["Direction Générale", "Direction Logistique", "Direction Qualité", "Direction Achats", "DRH"];
export const metiers = ["Logistique", "Qualité", "Achats", "Support", "Conduite"];
export const groupes = ["Comité de direction", "Comité Qualité", "Auditeurs internes", "Chauffeurs flotte", "Magasiniers"];

export const employees: Employee[] = [
  { id: "e-001", matricule: "MSL-0001", fullName: "Anas Benali", email: "a.benali@msl.ma", fonction: "Responsable Qualité", direction: "Direction Qualité", site: "Casablanca HQ", metier: "Qualité", groupe: "Comité Qualité", isAuditor: true, isSupervisor: true, diffusion: "electronique", status: "actif", qualifications: [{ name: "Auditeur ISO 9001:2015", level: 4, expiresAt: "2027-09-12" }, { name: "Excel avancé", level: 3 }] },
  { id: "e-002", matricule: "MSL-0002", fullName: "Mehdi Cherkaoui", email: "m.cherkaoui@msl.ma", fonction: "Chef d'expédition", direction: "Direction Logistique", site: "Tanger Med", metier: "Logistique", groupe: "Comité de direction", isAuditor: false, isSupervisor: true, diffusion: "electronique", status: "actif", qualifications: [{ name: "CACES R489 cat.3", level: 3, expiresAt: "2026-06-30" }] },
  { id: "e-003", matricule: "MSL-0003", fullName: "Salma El Idrissi", email: "s.elidrissi@msl.ma", fonction: "Chargé d'achats", direction: "Direction Achats", site: "Casablanca HQ", metier: "Achats", groupe: "Comité Qualité", isAuditor: true, isSupervisor: false, diffusion: "electronique", status: "actif", qualifications: [{ name: "Auditeur ISO 9001:2015", level: 3, expiresAt: "2026-12-01" }] },
  { id: "e-004", matricule: "MSL-0004", fullName: "Khalid Tazi", email: "k.tazi@msl.ma", fonction: "Chauffeur poids lourd", direction: "Direction Logistique", site: "Tanger Med", metier: "Conduite", groupe: "Chauffeurs flotte", isAuditor: false, isSupervisor: false, diffusion: "papier", status: "actif", qualifications: [{ name: "ADR Marchandises dangereuses", level: 3, expiresAt: "2026-05-20" }, { name: "Habilitation douane TIR", level: 2, expiresAt: "2026-08-15" }] },
  { id: "e-005", matricule: "MSL-0005", fullName: "Yassine Benjelloun", email: "y.benjelloun@msl.ma", fonction: "Magasinier", direction: "Direction Logistique", site: "Marrakech", metier: "Logistique", groupe: "Magasiniers", isAuditor: false, isSupervisor: false, diffusion: "electronique", status: "conge", qualifications: [{ name: "CACES R489 cat.3", level: 2, expiresAt: "2025-11-30" }] },
  { id: "e-006", matricule: "MSL-0006", fullName: "Nadia Lahlou", email: "n.lahlou@msl.ma", fonction: "Responsable Qualité", direction: "Direction Qualité", site: "Agadir Port", metier: "Qualité", groupe: "Comité Qualité", isAuditor: true, isSupervisor: false, diffusion: "electronique", status: "actif", qualifications: [{ name: "Auditeur ISO 9001:2015", level: 4, expiresAt: "2026-04-10" }] },
];

// === Documentation ===
export type DocStatus = "redaction" | "verification" | "approbation" | "diffusion" | "vigueur" | "perime";
export const docStatusLabel: Record<DocStatus, string> = {
  redaction: "En rédaction", verification: "À vérifier", approbation: "À approuver",
  diffusion: "À diffuser", vigueur: "En vigueur", perime: "Périmé",
};

export const typesDoc = [
  { id: "td-1", name: "Procédure", superviseur: "Anas Benali" },
  { id: "td-2", name: "Instruction", superviseur: "Anas Benali" },
  { id: "td-3", name: "Formulaire", superviseur: "Nadia Lahlou" },
  { id: "td-4", name: "Mode opératoire", superviseur: "Anas Benali" },
];

export interface DocInternal {
  code: string; libelle: string; type: string; version: string;
  superviseur: string; redacteur: string; verificateur: string; approbateur: string;
  status: DocStatus; site: string; activite: string; dateMaj: string;
  diffusion: { name: string; type: "electronique" | "papier"; recuLe?: string }[];
}

export const docsInternes: DocInternal[] = [
  { code: "PRO-LOG-01", libelle: "Procédure expédition internationale", type: "Procédure", version: "v3.2", superviseur: "Anas Benali", redacteur: "Mehdi Cherkaoui", verificateur: "Anas Benali", approbateur: "Direction Générale", status: "vigueur", site: "Tanger Med", activite: "Expédition", dateMaj: "2026-03-12", diffusion: [{ name: "Mehdi Cherkaoui", type: "electronique" }, { name: "Khalid Tazi", type: "papier", recuLe: "2026-03-15" }] },
  { code: "INS-RH-04", libelle: "Instruction onboarding chauffeur", type: "Instruction", version: "v2.1", superviseur: "Anas Benali", redacteur: "Salma El Idrissi", verificateur: "Anas Benali", approbateur: "DRH", status: "vigueur", site: "Casablanca HQ", activite: "RH", dateMaj: "2026-01-08", diffusion: [{ name: "Khalid Tazi", type: "papier" }] },
  { code: "PRO-QSE-08", libelle: "Procédure de gestion des audits internes", type: "Procédure", version: "v1.3", superviseur: "Anas Benali", redacteur: "Nadia Lahlou", verificateur: "Anas Benali", approbateur: "Direction Qualité", status: "verification", site: "Casablanca HQ", activite: "Audits", dateMaj: "2026-04-22", diffusion: [] },
  { code: "MOD-QSE-09", libelle: "Mode opératoire contrôle douanier", type: "Mode opératoire", version: "v1.0", superviseur: "Anas Benali", redacteur: "Mehdi Cherkaoui", verificateur: "Salma El Idrissi", approbateur: "Direction Logistique", status: "approbation", site: "Tanger Med", activite: "Douane", dateMaj: "2026-04-01", diffusion: [] },
  { code: "FOR-RH-12", libelle: "Formulaire demande de formation", type: "Formulaire", version: "v2.0", superviseur: "Nadia Lahlou", redacteur: "Salma El Idrissi", verificateur: "Anas Benali", approbateur: "DRH", status: "redaction", site: "Casablanca HQ", activite: "RH", dateMaj: "2026-04-25", diffusion: [] },
];

export const docsExternes = [
  { code: "EXT-001", libelle: "Norme ISO 9001:2015", origine: "ISO", lieu: "Bureau RMQ", type: "numerique", date: "2015-09-15" },
  { code: "EXT-002", libelle: "Décret transport TMD Maroc", origine: "État", lieu: "Bureau Direction", type: "numerique", date: "2023-06-01" },
  { code: "EXT-003", libelle: "Fiche technique Gasoil B7 — TotalEnergies", origine: "Fournisseur", lieu: "Bureau technique", type: "papier", date: "2024-11-20" },
  { code: "EXT-004", libelle: "Cahier des charges Client OCP", origine: "Client", lieu: "Bureau Commercial", type: "numerique", date: "2026-02-10" },
];

// === Formation ===
export const organismesFormation = ["BV Maroc", "AFNOR Compétences", "OFPPT", "ISM Casablanca"];
export const typesFormation = ["Inter-entreprise", "Intra-entreprise", "À l'étranger", "E-learning"];
export const typesTheme = ["Management de la Qualité", "Sécurité", "Technique métier", "Soft skills"];
export const themes = [
  { id: "th-1", name: "ISO 9001:2015 — fondamentaux", typeTheme: "Management de la Qualité", qualifications: ["Auditeur ISO 9001:2015"] },
  { id: "th-2", name: "Conduite défensive PL", typeTheme: "Technique métier", qualifications: ["CACES R489 cat.3"] },
  { id: "th-3", name: "ADR — recyclage", typeTheme: "Sécurité", qualifications: ["ADR Marchandises dangereuses"] },
];
export const criteresEval = [
  { name: "Compétence du formateur", coef: 30 },
  { name: "Pédagogie & animation", coef: 25 },
  { name: "Cas pratiques", coef: 25 },
  { name: "Logistique du stage", coef: 20 },
];

export type FormationStatut = "demande" | "validation" | "planifiee" | "realisee" | "evaluee" | "refusee";
export interface Formation {
  id: string; reference: string; theme: string; type: string; organisme: string;
  demandeur: string; site: string; statut: FormationStatut;
  dateDebut: string; dateFin: string; cout: number;
  participants: { name: string; participe?: boolean; noteChaud?: number; efficaciteFroid?: number }[];
  validateurs: { name: string; ordre: number; valide?: boolean }[];
}

export const formations: Formation[] = [
  { id: "frm-001", reference: "FRM-2026-001", theme: "ISO 9001:2015 — fondamentaux", type: "Inter-entreprise", organisme: "BV Maroc", demandeur: "Anas Benali", site: "Casablanca HQ", statut: "realisee", dateDebut: "2026-02-15", dateFin: "2026-02-17", cout: 18000, participants: [{ name: "Salma El Idrissi", participe: true, noteChaud: 4.5, efficaciteFroid: 85 }, { name: "Nadia Lahlou", participe: true, noteChaud: 4.2 }], validateurs: [{ name: "DRH", ordre: 1, valide: true }, { name: "Direction Qualité", ordre: 2, valide: true }] },
  { id: "frm-002", reference: "FRM-2026-002", theme: "Conduite défensive PL", type: "Intra-entreprise", organisme: "OFPPT", demandeur: "Mehdi Cherkaoui", site: "Tanger Med", statut: "planifiee", dateDebut: "2026-05-20", dateFin: "2026-05-22", cout: 12500, participants: [{ name: "Khalid Tazi" }], validateurs: [{ name: "DRH", ordre: 1, valide: true }, { name: "Direction Logistique", ordre: 2, valide: true }] },
  { id: "frm-003", reference: "FRM-2026-003", theme: "ADR — recyclage", type: "Inter-entreprise", organisme: "BV Maroc", demandeur: "Khalid Tazi", site: "Tanger Med", statut: "validation", dateDebut: "2026-06-10", dateFin: "2026-06-12", cout: 9500, participants: [{ name: "Khalid Tazi" }], validateurs: [{ name: "DRH", ordre: 1, valide: true }, { name: "Direction Logistique", ordre: 2 }] },
  { id: "frm-004", reference: "FRM-2026-004", theme: "ISO 9001:2015 — fondamentaux", type: "E-learning", organisme: "AFNOR Compétences", demandeur: "Yassine Benjelloun", site: "Marrakech", statut: "demande", dateDebut: "2026-07-01", dateFin: "2026-07-15", cout: 4500, participants: [{ name: "Yassine Benjelloun" }], validateurs: [{ name: "DRH", ordre: 1 }] },
];

// === Audits ===
export const champsAudit = [
  { id: "ca-1", name: "Système (SMQ global)", criticite: "haute" },
  { id: "ca-2", name: "Processus Logistique", criticite: "haute" },
  { id: "ca-3", name: "Processus Achats", criticite: "moyenne" },
  { id: "ca-4", name: "Sécurité & HSE", criticite: "haute" },
];
export const typesAudit = [
  { id: "ta-1", name: "Audit interne", actionParConstat: false },
  { id: "ta-2", name: "Audit fournisseur", actionParConstat: true },
  { id: "ta-3", name: "Audit de certification (blanc)", actionParConstat: false },
];
export const typesEcart = ["Documentation", "Pratique terrain", "Compétence", "Traçabilité", "Sécurité"];
export const gravites = [
  { id: 1, name: "Mineur" },
  { id: 2, name: "Majeur" },
  { id: 3, name: "Critique" },
];
export const auditeursExternes = [
  { name: "François Martin", organisme: "Bureau Veritas" },
  { name: "Aïcha Berrada", organisme: "AFNOR" },
];

export type AuditStatut = "planifie" | "realise" | "rapport" | "valide" | "clos";
export interface Ecart {
  id: string; concerne: string; type: string; gravite: number; description: string; actionId?: string;
}
export interface AuditPlan { date: string; debut: string; fin: string; lieu: string; activite: string; auditeurs: string[]; aRencontrer: string[]; }

export interface Audit {
  id: string; reference: string; champ: string; type: string;
  dateDebut: string; dateFin: string; statut: AuditStatut;
  auditeurs: string[]; audites: string[];
  plan: AuditPlan[]; ecarts: Ecart[];
  documentsRef: string[];
}

export const audits: Audit[] = [
  { id: "aud-001", reference: "AUD-2026-001", champ: "Processus Logistique", type: "Audit interne", dateDebut: "2026-03-10", dateFin: "2026-03-12", statut: "clos", auditeurs: ["Anas Benali", "Salma El Idrissi"], audites: ["Mehdi Cherkaoui", "Khalid Tazi"], plan: [{ date: "2026-03-10", debut: "09:00", fin: "12:00", lieu: "Tanger Med — Quai 4", activite: "Réunion d'ouverture & visite quai", auditeurs: ["Anas Benali"], aRencontrer: ["Mehdi Cherkaoui"] }, { date: "2026-03-10", debut: "14:00", fin: "17:00", lieu: "Tanger Med — Bureau expédition", activite: "Revue documentaire", auditeurs: ["Salma El Idrissi"], aRencontrer: ["Mehdi Cherkaoui", "Khalid Tazi"] }], ecarts: [{ id: "ec-1", concerne: "Mehdi Cherkaoui", type: "Documentation", gravite: 2, description: "Procédure PRO-LOG-01 v3.1 utilisée alors que v3.2 en vigueur", actionId: "ACT-2026-014" }, { id: "ec-2", concerne: "Khalid Tazi", type: "Traçabilité", gravite: 1, description: "Bon de livraison non signé sur 3 dossiers échantillonnés" }], documentsRef: ["PRO-LOG-01", "MOD-QSE-09"] },
  { id: "aud-002", reference: "AUD-2026-002", champ: "Sécurité & HSE", type: "Audit interne", dateDebut: "2026-05-05", dateFin: "2026-05-06", statut: "planifie", auditeurs: ["Nadia Lahlou"], audites: ["Yassine Benjelloun"], plan: [], ecarts: [], documentsRef: ["EXT-002"] },
  { id: "aud-003", reference: "AUD-2026-003", champ: "Processus Achats", type: "Audit fournisseur", dateDebut: "2026-04-20", dateFin: "2026-04-21", statut: "rapport", auditeurs: ["Anas Benali"], audites: ["Salma El Idrissi"], plan: [{ date: "2026-04-20", debut: "10:00", fin: "16:00", lieu: "Site fournisseur TotalEnergies", activite: "Audit pratiques fournisseur", auditeurs: ["Anas Benali"], aRencontrer: ["Salma El Idrissi"] }], ecarts: [{ id: "ec-3", concerne: "Salma El Idrissi", type: "Compétence", gravite: 2, description: "Évaluation fournisseur incomplète sur 2 critères critiques" }], documentsRef: ["EXT-003"] },
];

export const graviteColor = (g: number) => g === 1 ? "surveillance" : g === 2 ? "surveillance" : "critique";
