import {
  LayoutDashboard, FileText, ClipboardCheck, AlertTriangle, ShieldAlert,
  Target, Activity, Users, Truck, UserCog, PackageCheck, Gauge,
  Newspaper, Calendar, Lock, Sparkles, HeartHandshake
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type ModuleGroup = "direction" | "processus" | "transversal" | "system";

export interface ModuleDef {
  slug: string;
  title: string;
  short: string;
  description: string;
  icon: LucideIcon;
  group: ModuleGroup;
  iso?: string;
}

export const modules: ModuleDef[] = [
  { slug: "dashboard", title: "Tableau de bord", short: "Vue Direction", description: "Indice de santé globale du SMQ", icon: LayoutDashboard, group: "direction" },

  { slug: "documentation", title: "Documentation (GED)", short: "5 Axes", description: "Database centrale — Fiche d'identité, cartographie, procédures, KPI, enregistrements", icon: FileText, group: "processus", iso: "7.5" },
  { slug: "audits", title: "Audits", short: "Audits internes", description: "Planification, check-lists IA, rapports automatiques", icon: ClipboardCheck, group: "processus", iso: "9.2" },
  { slug: "non-conformites", title: "Non-Conformités", short: "PNC", description: "Détection, traitement et traçabilité des produits/services non conformes", icon: AlertTriangle, group: "processus", iso: "8.7" },
  { slug: "risques", title: "Risques & AMDEC", short: "Risques", description: "Menaces, opportunités, criticité et plans préventifs", icon: ShieldAlert, group: "processus", iso: "6.1" },
  { slug: "actions", title: "Plan d'Action", short: "Actions", description: "Hub central — actions correctives, préventives et d'amélioration", icon: Target, group: "processus", iso: "10.2" },
  { slug: "indicateurs", title: "Indicateurs (KPI)", short: "Pilotage", description: "Tableaux de bord temps réel et analyse prédictive", icon: Activity, group: "processus", iso: "9.1" },

  { slug: "clients", title: "Clients", short: "Clients", description: "Réclamations, satisfaction, enquêtes NPS", icon: Users, group: "processus", iso: "9.1.2" },
  { slug: "parties-interessees", title: "Parties Intéressées", short: "Parties Int.", description: "Attentes & besoins (légaux, financiers, sociaux) — notification responsables", icon: HeartHandshake, group: "processus", iso: "4.2" },
  { slug: "fournisseurs", title: "Fournisseurs", short: "Achats", description: "Évaluation, sélection prédictive et veille des contrats", icon: Truck, group: "processus", iso: "8.4" },
  { slug: "rh", title: "Ressources Humaines", short: "GRH", description: "Compétences, formation, habilitations dynamiques", icon: UserCog, group: "processus", iso: "7.1.2" },

  { slug: "smart-release", title: "Smart-Release", short: "Libération", description: "Gatekeeper — vérification, autorisation, traçabilité avant livraison", icon: PackageCheck, group: "processus", iso: "8.6" },
  { slug: "metrologie", title: "Métrologie & Étalonnage", short: "Métrologie", description: "Inventaire des équipements de mesure et alertes d'expiration", icon: Gauge, group: "processus", iso: "7.1.5" },

  { slug: "veille", title: "Veille Réglementaire", short: "Veille", description: "Mur de veille, tableau d'impact et mise en conformité", icon: Newspaper, group: "transversal" },
  { slug: "planning", title: "Planning & Calendrier", short: "Planning", description: "Audits, KPI, réunions, maintenance documentaire", icon: Calendar, group: "transversal" },
  { slug: "ia-assistant", title: "Assistant IA", short: "Qualibot AI", description: "Chat-with-Doc, analyses prédictives et suggestions", icon: Sparkles, group: "transversal" },

  { slug: "securite", title: "Sécurité & Accès", short: "RBAC", description: "Profils, droits, journal de connexion et logs", icon: Lock, group: "system", iso: "7.5.3" },
];

export const moduleBySlug = (slug: string) => modules.find(m => m.slug === slug);
