// Extended mock data for Actions, Métrologie, Indicateurs, Risques, Fournisseurs, Clients, NC, Réunions
import { employees } from "./mock-data";

// === ACTIONS (Module IV) ===
export const typesAction = ["Action corrective", "Action préventive", "Action d'amélioration", "Action curative"];
export const sourcesAction = ["Audit interne", "Audit externe", "Non-Conformité Produit", "Réclamation Client", "Réclamation Fournisseur", "Réunion", "Indicateur", "Risque AMDEC", "Veille réglementaire", "Suggestion"];
export const typesCause = ["Méthode", "Main d'œuvre", "Matériel", "Milieu", "Matière", "Mesure"];
export const gravitesAction = ["Faible", "Modérée", "Forte", "Critique"];
export const prioritesAction = ["Basse", "Moyenne", "Haute", "Urgente"];
export const themesAction = [
  { name: "Amélioration continue", ordre: 1 },
  { name: "Conformité réglementaire", ordre: 2 },
  { name: "Sécurité au travail", ordre: 3 },
  { name: "Satisfaction client", ordre: 4 },
];

export type ActionStatut = "demande" | "validation" | "refusee" | "en_cours" | "realisee" | "evaluee" | "cloturee";
export interface SousAction {
  id: string; libelle: string; respRealisation: string; respSuivi: string;
  delai: string; tauxRealisation: number; tauxEfficacite: number;
  gravite: string; priorite: string; depenses?: number;
}
export interface ActionRecord {
  id: string; reference: string; titre: string; type: string; source: string;
  description: string; causes: string[]; directionPilote: string; metier: string; theme: string;
  statut: ActionStatut; site: string; demandeur: string; dateCreation: string;
  validateurs: { name: string; ordre: number; valide?: boolean | "refus"; commentaire?: string }[];
  cloture?: { responsable: string; date: string };
  sousActions: SousAction[];
  rapportEfficacite?: string;
}

export const modelesAction = [
  { id: "mod-1", titre: "Modèle — Suite à audit interne (écart majeur)", sousActions: 4 },
  { id: "mod-2", titre: "Modèle — Réclamation client avec retour", sousActions: 5 },
  { id: "mod-3", titre: "Modèle — Habilitation expirée", sousActions: 3 },
];

export const actions: ActionRecord[] = [
  {
    id: "a-001", reference: "ACT-2026-014", titre: "Mise à jour PRO-LOG-01 sur tous les sites",
    type: "Action corrective", source: "Audit interne",
    description: "Suite à l'audit AUD-2026-001, PRO-LOG-01 v3.1 utilisée alors que v3.2 en vigueur.",
    causes: ["Méthode", "Main d'œuvre"], directionPilote: "Direction Logistique", metier: "Logistique", theme: "Conformité réglementaire",
    statut: "en_cours", site: "Tanger Med", demandeur: "Anas Benali", dateCreation: "2026-03-13",
    validateurs: [{ name: "Direction Qualité", ordre: 1, valide: true }, { name: "Direction Logistique", ordre: 2, valide: true }],
    sousActions: [
      { id: "sa-1", libelle: "Communiquer la nouvelle version aux équipes", respRealisation: "Mehdi Cherkaoui", respSuivi: "Anas Benali", delai: "2026-04-01", tauxRealisation: 100, tauxEfficacite: 90, gravite: "Modérée", priorite: "Haute" },
      { id: "sa-2", libelle: "Former les chefs d'équipe sur les changements", respRealisation: "Anas Benali", respSuivi: "Anas Benali", delai: "2026-04-20", tauxRealisation: 70, tauxEfficacite: 0, gravite: "Modérée", priorite: "Haute", depenses: 4500 },
      { id: "sa-3", libelle: "Audit de suivi sur 5 expéditions", respRealisation: "Salma El Idrissi", respSuivi: "Anas Benali", delai: "2026-05-10", tauxRealisation: 0, tauxEfficacite: 0, gravite: "Forte", priorite: "Haute" },
    ],
  },
  {
    id: "a-002", reference: "ACT-2026-019", titre: "Renouvellement étalonnage balance B-204",
    type: "Action préventive", source: "Indicateur",
    description: "Balance B-204 hors période d'étalonnage selon le plan métrologique.",
    causes: ["Matériel"], directionPilote: "Direction Logistique", metier: "Logistique", theme: "Conformité réglementaire",
    statut: "validation", site: "Marrakech", demandeur: "Yassine Benjelloun", dateCreation: "2026-04-22",
    validateurs: [{ name: "Direction Qualité", ordre: 1, valide: true }, { name: "DRH", ordre: 2 }],
    sousActions: [
      { id: "sa-4", libelle: "Contacter prestataire d'étalonnage", respRealisation: "Yassine Benjelloun", respSuivi: "Anas Benali", delai: "2026-05-05", tauxRealisation: 30, tauxEfficacite: 0, gravite: "Forte", priorite: "Urgente" },
    ],
  },
  {
    id: "a-003", reference: "ACT-2026-022", titre: "Réponse réclamation client OCP #2451",
    type: "Action curative", source: "Réclamation Client",
    description: "Retard livraison de 48h sur dossier OCP — pénalités contractuelles.",
    causes: ["Méthode", "Milieu"], directionPilote: "Direction Logistique", metier: "Logistique", theme: "Satisfaction client",
    statut: "realisee", site: "Casablanca HQ", demandeur: "Salma El Idrissi", dateCreation: "2026-04-10",
    validateurs: [{ name: "Direction Qualité", ordre: 1, valide: true }],
    sousActions: [
      { id: "sa-5", libelle: "Lettre d'excuses et geste commercial", respRealisation: "Salma El Idrissi", respSuivi: "Anas Benali", delai: "2026-04-15", tauxRealisation: 100, tauxEfficacite: 85, gravite: "Forte", priorite: "Urgente", depenses: 2500 },
      { id: "sa-6", libelle: "Analyse causes racines (5 pourquoi)", respRealisation: "Anas Benali", respSuivi: "Anas Benali", delai: "2026-04-25", tauxRealisation: 100, tauxEfficacite: 80, gravite: "Forte", priorite: "Haute" },
    ],
  },
  {
    id: "a-004", reference: "ACT-2026-024", titre: "Plan formation ADR — chauffeurs Tanger",
    type: "Action préventive", source: "Risque AMDEC",
    description: "Habilitations ADR de 4 chauffeurs expirent dans <90 jours.",
    causes: ["Main d'œuvre"], directionPilote: "DRH", metier: "Conduite", theme: "Sécurité au travail",
    statut: "demande", site: "Tanger Med", demandeur: "Mehdi Cherkaoui", dateCreation: "2026-04-28",
    validateurs: [{ name: "DRH", ordre: 1 }, { name: "Direction Logistique", ordre: 2 }],
    sousActions: [],
  },
  {
    id: "a-005", reference: "ACT-2026-008", titre: "Refonte fiche d'évaluation fournisseur Achats",
    type: "Action d'amélioration", source: "Audit interne",
    description: "Suite à AUD-2026-003, certains critères non couverts dans grille actuelle.",
    causes: ["Méthode"], directionPilote: "Direction Achats", metier: "Achats", theme: "Amélioration continue",
    statut: "cloturee", site: "Casablanca HQ", demandeur: "Anas Benali", dateCreation: "2026-02-01",
    validateurs: [{ name: "Direction Qualité", ordre: 1, valide: true }],
    cloture: { responsable: "Anas Benali", date: "2026-04-15" },
    sousActions: [
      { id: "sa-7", libelle: "Revoir grille critères", respRealisation: "Salma El Idrissi", respSuivi: "Anas Benali", delai: "2026-03-01", tauxRealisation: 100, tauxEfficacite: 95, gravite: "Modérée", priorite: "Moyenne" },
      { id: "sa-8", libelle: "Diffuser nouvelle grille", respRealisation: "Salma El Idrissi", respSuivi: "Anas Benali", delai: "2026-03-30", tauxRealisation: 100, tauxEfficacite: 90, gravite: "Modérée", priorite: "Moyenne" },
    ],
    rapportEfficacite: "Amélioration mesurée: +18% de couverture des critères critiques. Action efficace.",
  },
];

export const actionStatutMap: Record<ActionStatut, { label: string; status: "info" | "conforme" | "surveillance" | "critique" }> = {
  demande: { label: "Demande", status: "info" },
  validation: { label: "En validation", status: "surveillance" },
  refusee: { label: "Refusée", status: "critique" },
  en_cours: { label: "En cours", status: "surveillance" },
  realisee: { label: "Réalisée", status: "conforme" },
  evaluee: { label: "Évaluée", status: "conforme" },
  cloturee: { label: "Clôturée", status: "conforme" },
};

// === MÉTROLOGIE (Module V) ===
export const organismesEtalonnage = ["LPEE Maroc", "Bureau Veritas", "SGS Maroc", "IMANOR"];
export const typesIntervention = ["Étalonnage", "Vérification", "Maintenance préventive", "Réparation", "R&R (Répétabilité & Reproductibilité)"];
export const machines = ["Quai pesage TM-Q4", "Convoyeur CASA-C2", "Chambre froide MAR-1"];

export interface Equipment {
  code: string; designation: string; machine: string; responsable: string;
  miseEnService: string; etat: "operationnel" | "hors_service" | "etalonnage";
  prochaineEtalonnage: string;
  historique: { date: string; type: string; organisme?: string; resultat: string }[];
}

export const equipements: Equipment[] = [
  { code: "BAL-204", designation: "Balance industrielle 5T", machine: "Quai pesage TM-Q4", responsable: "Yassine Benjelloun", miseEnService: "2022-03-15", etat: "operationnel", prochaineEtalonnage: "2026-05-15", historique: [{ date: "2025-05-12", type: "Étalonnage", organisme: "LPEE Maroc", resultat: "Conforme — incertitude ±2g/kg" }] },
  { code: "THM-012", designation: "Thermomètre chambre froide", machine: "Chambre froide MAR-1", responsable: "Yassine Benjelloun", miseEnService: "2023-06-10", etat: "operationnel", prochaineEtalonnage: "2026-06-30", historique: [{ date: "2025-06-25", type: "Vérification", organisme: "SGS Maroc", resultat: "Conforme" }] },
  { code: "PCM-007", designation: "Pied à coulisse atelier", machine: "Convoyeur CASA-C2", responsable: "Mehdi Cherkaoui", miseEnService: "2021-11-02", etat: "etalonnage", prochaineEtalonnage: "2026-04-30", historique: [{ date: "2024-10-15", type: "Étalonnage", organisme: "IMANOR", resultat: "Conforme — usure mineure" }] },
  { code: "DEB-003", designation: "Débitmètre carburant", machine: "Quai pesage TM-Q4", responsable: "Mehdi Cherkaoui", miseEnService: "2024-01-20", etat: "operationnel", prochaineEtalonnage: "2027-01-20", historique: [] },
];

// === INDICATEURS (Module VI) ===
export const typesIndicateur = ["Logistique", "Qualité", "RH", "Achats", "Finance", "Sécurité"];
export const axesPolitique = [
  { code: "AXE-1", name: "Excellence opérationnelle" },
  { code: "AXE-2", name: "Satisfaction client" },
  { code: "AXE-3", name: "Développement durable" },
  { code: "AXE-4", name: "Performance financière" },
];
export const typesResultat = ["Moyenne simple", "Oui / Non", "Valeur cumulée", "Moyenne pondérée", "Dernière valeur"];
export const typesSuivi = ["Manuel", "Formule de calcul", "Importation de données"];

export interface Indicator {
  code: string; libelle: string; type: string; axe: string; responsable: string;
  typeResultat: string; typeSuivi: string; periodicite: string; cible: string;
  historique: { periode: string; valeur: number; status: "ok" | "alerte" | "ko" }[];
  unite: string;
}

export const indicateurs: Indicator[] = [
  { code: "KPI-001", libelle: "Taux de livraison à l'heure", type: "Logistique", axe: "Excellence opérationnelle", responsable: "Mehdi Cherkaoui", typeResultat: "Moyenne simple", typeSuivi: "Importation de données", periodicite: "Mensuel", cible: "≥ 95%", unite: "%", historique: [{ periode: "2026-01", valeur: 96.2, status: "ok" }, { periode: "2026-02", valeur: 94.1, status: "alerte" }, { periode: "2026-03", valeur: 95.8, status: "ok" }, { periode: "2026-04", valeur: 92.3, status: "ko" }] },
  { code: "KPI-002", libelle: "Nombre de réclamations clients", type: "Qualité", axe: "Satisfaction client", responsable: "Anas Benali", typeResultat: "Valeur cumulée", typeSuivi: "Manuel", periodicite: "Mensuel", cible: "≤ 5/mois", unite: "rec.", historique: [{ periode: "2026-01", valeur: 3, status: "ok" }, { periode: "2026-02", valeur: 7, status: "ko" }, { periode: "2026-03", valeur: 4, status: "ok" }, { periode: "2026-04", valeur: 6, status: "alerte" }] },
  { code: "KPI-003", libelle: "Taux d'efficacité actions correctives", type: "Qualité", axe: "Excellence opérationnelle", responsable: "Anas Benali", typeResultat: "Moyenne pondérée", typeSuivi: "Formule de calcul", periodicite: "Trimestriel", cible: "≥ 80%", unite: "%", historique: [{ periode: "2025-T4", valeur: 82, status: "ok" }, { periode: "2026-T1", valeur: 78, status: "alerte" }] },
  { code: "KPI-004", libelle: "Certification ISO maintenue", type: "Qualité", axe: "Performance financière", responsable: "Anas Benali", typeResultat: "Oui / Non", typeSuivi: "Manuel", periodicite: "Annuel", cible: "Oui", unite: "", historique: [{ periode: "2025", valeur: 1, status: "ok" }] },
  { code: "KPI-005", libelle: "Taux d'absentéisme", type: "RH", axe: "Excellence opérationnelle", responsable: "DRH", typeResultat: "Dernière valeur", typeSuivi: "Importation de données", periodicite: "Mensuel", cible: "≤ 4%", unite: "%", historique: [{ periode: "2026-04", valeur: 3.2, status: "ok" }] },
];

// === RISQUES & AMDEC (Module VII) ===
export const domainesRisque = [
  { code: "DOM-LOG", name: "Logistique & Transport", typeRisque: "menace", seuil: 12 },
  { code: "DOM-RH", name: "Ressources Humaines", typeRisque: "menace", seuil: 9 },
  { code: "DOM-CYB", name: "Cybersécurité", typeRisque: "menace", seuil: 16 },
  { code: "DOM-OPP", name: "Opportunités marché", typeRisque: "opportunite", seuil: 8 },
];
export const criteresRisque = [
  { name: "Gravité (G)", echelle: [1, 2, 3, 4] },
  { name: "Occurrence (O)", echelle: [1, 2, 3, 4] },
  { name: "Détection (D)", echelle: [1, 2, 3, 4] },
];

export interface Risque {
  code: string; titre: string; type: "menace" | "opportunite"; domaine: string;
  cause: string; evenement: string; enjeu: string;
  G: number; O: number; D: number; criticite: number; seuil: number;
  planAction?: string; resG?: number; resO?: number; resD?: number; resCriticite?: number;
  significatif: boolean;
}

export const risques: Risque[] = [
  { code: "R-001", titre: "Vol de marchandise en transit", type: "menace", domaine: "Logistique & Transport", cause: "Manque de surveillance", evenement: "Effraction de remorque", enjeu: "Perte financière + image", G: 4, O: 2, D: 3, criticite: 24, seuil: 12, planAction: "ACT-2026-014", resG: 4, resO: 1, resD: 2, resCriticite: 8, significatif: false },
  { code: "R-002", titre: "Cyberattaque sur ERP", type: "menace", domaine: "Cybersécurité", cause: "Phishing / 0-day", evenement: "Indisponibilité ERP 24h+", enjeu: "Arrêt opérationnel", G: 4, O: 3, D: 4, criticite: 48, seuil: 16, significatif: true },
  { code: "R-003", titre: "Départ de pilote de processus clé", type: "menace", domaine: "Ressources Humaines", cause: "Démission / mobilité", evenement: "Perte de compétence", enjeu: "Continuité processus", G: 3, O: 2, D: 2, criticite: 12, seuil: 9, significatif: true },
  { code: "R-004", titre: "Nouveau marché export Afrique de l'Ouest", type: "opportunite", domaine: "Opportunités marché", cause: "Accord ZLECAF", evenement: "Croissance CA", enjeu: "+15% CA potentiel", G: 4, O: 3, D: 1, criticite: 12, seuil: 8, significatif: true },
];

// === FOURNISSEURS (Module VIII) ===
export const categoriesFournisseur = ["Local", "Étranger", "Stratégique", "Standard"];
export const typesProduit = [
  { name: "Carburant", periodiciteEval: "Trimestrielle" },
  { name: "Pièces détachées", periodiciteEval: "Annuelle" },
  { name: "Prestations transport", periodiciteEval: "Trimestrielle" },
  { name: "Services informatiques", periodiciteEval: "Semestrielle" },
];
export const criteresFournisseur = [
  { name: "Qualité produit/service", coef: 30 },
  { name: "Respect délais", coef: 25 },
  { name: "Compétitivité prix", coef: 20 },
  { name: "Réactivité SAV", coef: 15 },
  { name: "Conformité documentaire", coef: 10 },
];
export const gravitesReclFournisseur = ["Mineure", "Majeure", "Critique"];

export interface Fournisseur {
  code: string; raisonSociale: string; categorie: string; types: string[];
  agree: boolean; scoreGlobal: number; tendance: "up" | "down" | "stable";
  derniereEval: string; reclamations: number;
}

export const fournisseurs: Fournisseur[] = [
  { code: "F-001", raisonSociale: "TotalEnergies Maroc", categorie: "Stratégique", types: ["Carburant"], agree: true, scoreGlobal: 87, tendance: "up", derniereEval: "2026-03-15", reclamations: 0 },
  { code: "F-002", raisonSociale: "Renault Trucks Casa", categorie: "Stratégique", types: ["Pièces détachées"], agree: true, scoreGlobal: 78, tendance: "stable", derniereEval: "2025-12-10", reclamations: 1 },
  { code: "F-003", raisonSociale: "Logistik Express SARL", categorie: "Standard", types: ["Prestations transport"], agree: true, scoreGlobal: 62, tendance: "down", derniereEval: "2026-04-01", reclamations: 3 },
  { code: "F-004", raisonSociale: "DataSec Morocco", categorie: "Standard", types: ["Services informatiques"], agree: false, scoreGlobal: 45, tendance: "down", derniereEval: "2026-01-20", reclamations: 4 },
];

export const reclamationsFournisseur = [
  { ref: "RF-2026-001", fournisseur: "Logistik Express SARL", date: "2026-03-22", gravite: "Majeure", motif: "Retard chronique > 24h sur 5 livraisons consécutives", actionId: "ACT-2026-019" },
  { ref: "RF-2026-002", fournisseur: "DataSec Morocco", date: "2026-04-05", gravite: "Critique", motif: "Indisponibilité service 6h sans notification" },
];

// === CLIENTS (Module IX) ===
export const typesClient = ["Grand compte", "PME", "Particulier", "Public"];
export const categoriesClient = ["A — Stratégique", "B — Important", "C — Standard"];
export const regionsClient = ["Casablanca-Settat", "Tanger-Tétouan", "Rabat-Salé-Kénitra", "Marrakech-Safi", "Souss-Massa", "Export"];
export const typesReclamation = ["Retard livraison", "Marchandise endommagée", "Erreur de quantité", "Documentation incomplète", "Comportement personnel"];
export const gravitesReclamation = ["Mineure", "Majeure", "Critique"];
export const typesDecision = ["Geste commercial", "Avoir financier", "Reprise produit", "Aucune action", "Demande complémentaire"];
export const typesSuggestion = ["Amélioration service", "Nouveau produit", "Tarification", "Communication", "Autre"];

export interface Client {
  code: string; raisonSociale: string; type: string; categorie: string; region: string;
  email: string; ca: number; satisfaction: number;
}

export const clients: Client[] = [
  { code: "C-001", raisonSociale: "OCP Group", type: "Grand compte", categorie: "A — Stratégique", region: "Casablanca-Settat", email: "logistique@ocp.ma", ca: 4800000, satisfaction: 4.2 },
  { code: "C-002", raisonSociale: "Renault Maroc", type: "Grand compte", categorie: "A — Stratégique", region: "Tanger-Tétouan", email: "supply@renault.ma", ca: 3200000, satisfaction: 4.5 },
  { code: "C-003", raisonSociale: "Marjane Holding", type: "Grand compte", categorie: "B — Important", region: "Rabat-Salé-Kénitra", email: "logistique@marjane.ma", ca: 1900000, satisfaction: 3.8 },
  { code: "C-004", raisonSociale: "Cooper Pharma", type: "PME", categorie: "B — Important", region: "Casablanca-Settat", email: "achats@cooperpharma.ma", ca: 850000, satisfaction: 4.1 },
];

export const reclamationsClient = [
  { ref: "RC-2026-2451", client: "OCP Group", date: "2026-04-08", type: "Retard livraison", gravite: "Majeure", site: "Casablanca HQ", avecRetour: false, statut: "traitee", decideur: "Anas Benali", traitement: "Lettre + geste commercial 5%", actionId: "ACT-2026-022" },
  { ref: "RC-2026-2473", client: "Marjane Holding", date: "2026-04-18", type: "Marchandise endommagée", gravite: "Majeure", site: "Casablanca HQ", avecRetour: true, statut: "decision", decideur: "Anas Benali" },
  { ref: "RC-2026-2489", client: "Cooper Pharma", date: "2026-04-25", type: "Erreur de quantité", gravite: "Mineure", site: "Casablanca HQ", avecRetour: false, statut: "decision", decideur: "Anas Benali" },
];

export const enquetesSatisfaction = [
  { ref: "ENQ-2026-Q1", titre: "Satisfaction client Q1 2026", debut: "2026-03-01", fin: "2026-03-31", mode: "client" as const, repondants: 28, total: 45, scoreMoyen: 4.1 },
  { ref: "ENQ-2026-NPS", titre: "NPS — Net Promoter Score 2026", debut: "2026-04-15", fin: "2026-05-15", mode: "anonyme" as const, repondants: 67, total: 200, scoreMoyen: 7.8 },
];

export const suggestionsClient = [
  { ref: "SUG-001", date: "2026-04-12", client: "Cooper Pharma", type: "Amélioration service", contenu: "Tracking GPS temps réel des expéditions" },
  { ref: "SUG-002", date: "2026-04-20", client: "OCP Group", type: "Communication", contenu: "Notification SMS au déchargement" },
];

// === NON-CONFORMITÉS (Module X) ===
export const produitsNC = [
  { code: "P-001", designation: "Lot palette OCP-2451", prix: 12500 },
  { code: "P-002", designation: "Conteneur frigorifique CFR-Q4", prix: 45000 },
  { code: "P-003", designation: "Cargaison gasoil B7 — TM-203", prix: 28500 },
];
export const typesNC = ["Erreur de chargement", "Rupture chaîne du froid", "Marchandise endommagée", "Documentation manquante", "Non-respect protocole"];
export const sourcesNC = ["Contrôle interne", "Détection client", "Audit", "Auto-déclaration"];
export const gravitesNC = ["Mineure", "Majeure", "Critique"];
export const typesTraitementNC = ["Tri", "Reprise", "Rebut", "Dérogation client", "Reclassement"];
export const ateliers = ["Quai expédition TM", "Entrepôt Casa-A", "Entrepôt Marrakech", "Quai Agadir Port"];

export type NCStatut = "enregistree" | "decision" | "validation" | "traitement" | "suivi" | "cloturee";
export interface NonConformite {
  ref: string; date: string; atelier: string; produit: string; typeNC: string;
  gravite: string; source: string; lot: string; qteDetectee: number;
  detection: "interne" | "client";
  statut: NCStatut; decideur: string; respTraitement?: string; respSuivi?: string;
  typeTraitement?: string; rapportTraitement?: string;
  actionAssociee?: string;
}

export const nonConformites: NonConformite[] = [
  { ref: "NC-2026-067", date: "2026-04-08", atelier: "Quai expédition TM", produit: "Lot palette OCP-2451", typeNC: "Erreur de chargement", gravite: "Majeure", source: "Détection client", lot: "L-OCP-451", qteDetectee: 12, detection: "client", statut: "cloturee", decideur: "Anas Benali", respTraitement: "Mehdi Cherkaoui", respSuivi: "Anas Benali", typeTraitement: "Reprise", rapportTraitement: "Reprise effectuée le 2026-04-09. Geste commercial proposé.", actionAssociee: "ACT-2026-022" },
  { ref: "NC-2026-074", date: "2026-04-18", atelier: "Entrepôt Marrakech", produit: "Conteneur frigorifique CFR-Q4", typeNC: "Rupture chaîne du froid", gravite: "Critique", source: "Contrôle interne", lot: "L-FROID-188", qteDetectee: 1, detection: "interne", statut: "traitement", decideur: "Nadia Lahlou", respTraitement: "Yassine Benjelloun", respSuivi: "Anas Benali", typeTraitement: "Rebut" },
  { ref: "NC-2026-079", date: "2026-04-25", atelier: "Entrepôt Casa-A", produit: "Cargaison gasoil B7 — TM-203", typeNC: "Documentation manquante", gravite: "Mineure", source: "Audit", lot: "L-GAS-203", qteDetectee: 1, detection: "interne", statut: "decision", decideur: "Anas Benali" },
];

// === RÉUNIONS (Module XI) ===
export const typesReunion = [
  { name: "Revue de direction", periodicite: "Annuelle" },
  { name: "Revue de processus", periodicite: "Trimestrielle" },
  { name: "Comité Qualité", periodicite: "Mensuelle" },
  { name: "Réunion d'audit (ouverture/clôture)", periodicite: "Ad hoc" },
];

export interface Reunion {
  ref: string; type: string; titre: string; date: string; lieu: string;
  duree: string; statut: "planifiee" | "realisee";
  invites: string[]; ordreJour: string[]; decisions?: { decision: string; actionId?: string }[];
  commentaires?: string;
}

export const reunions: Reunion[] = [
  { ref: "REU-2026-014", type: "Revue de direction", titre: "Revue de direction Q1 2026", date: "2026-04-15", lieu: "Salle Atlas — Casablanca HQ", duree: "3h", statut: "realisee", invites: ["Direction Générale", "Anas Benali", "Mehdi Cherkaoui", "DRH"], ordreJour: ["Bilan KPI Q1", "Suivi plan d'action", "Risques émergents", "Décisions stratégiques"], decisions: [{ decision: "Lancer audit complet processus Achats", actionId: "ACT-2026-008" }, { decision: "Renforcer formation ADR — chauffeurs Tanger", actionId: "ACT-2026-024" }], commentaires: "Bon Q1, vigilance sur taux de livraison à l'heure." },
  { ref: "REU-2026-018", type: "Comité Qualité", titre: "Comité Qualité — Mai 2026", date: "2026-05-08", lieu: "Salle Atlas — Casablanca HQ", duree: "2h", statut: "planifiee", invites: ["Anas Benali", "Salma El Idrissi", "Nadia Lahlou", "Mehdi Cherkaoui"], ordreJour: ["Suivi NC ouvertes", "Audits programmés Q2", "Veille réglementaire"] },
  { ref: "REU-2026-019", type: "Revue de processus", titre: "Revue processus Logistique", date: "2026-05-20", lieu: "Tanger Med — Bureau expédition", duree: "2h30", statut: "planifiee", invites: ["Mehdi Cherkaoui", "Anas Benali", "Khalid Tazi"], ordreJour: ["KPI processus", "Cartographie revisitée", "Optimisations identifiées"] },
];
