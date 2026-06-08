import { useState, useEffect } from "react";
import { Lock, Shield, UserCheck, Activity, AlertTriangle, Eye, Sparkles, Copy, CheckCircle2 } from "lucide-react";
import { PageHeader } from "@/components/qh/PageHeader";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { KPICard } from "@/components/qh/ParamCard";
import { Button } from "@/components/ui/button";
import { get } from "@/lib/api";
import { toast } from "sonner";

// ──────────────────────────── DATA ────────────────────────────

const ALL_ROLES = [
  {
    role: "superadmin",
    label: "Super Administrateur",
    email: "superadmin@msl.ma",
    level: "destructive" as const,
    description: "Accès total à tout le système, y compris la configuration de la plateforme.",
    modules: "Tous les modules + Configuration système",
  },
  {
    role: "admin",
    label: "Administrateur",
    email: "admin@msl.ma",
    level: "destructive" as const,
    description: "Gestion complète des utilisateurs, données et paramétrage de l'application.",
    modules: "Tous les modules",
  },
  {
    role: "director",
    label: "Directeur",
    email: "director@msl.ma",
    level: "secondary" as const,
    description: "Vision globale de tous les processus. Peut valider des rapports et actions.",
    modules: "Dashboard, Doc, Audits, Actions, NC, KPIs, RH, Risques, Clients",
  },
  {
    role: "pilot",
    label: "Pilote de Processus",
    email: "pilot@msl.ma",
    level: "secondary" as const,
    description: "Modification complète des 5 axes de son processus. Lecture globale.",
    modules: "Doc, Actions, NC, KPIs, Risques (écriture) + lecture globale",
  },
  {
    role: "copilot",
    label: "Co-Pilote",
    email: "copilot@msl.ma",
    level: "outline" as const,
    description: "Assiste le pilote dans la gestion documentaire et le suivi des NC.",
    modules: "Doc, Actions, NC (écriture) + KPIs (lecture)",
  },
  {
    role: "supervisor",
    label: "Superviseur",
    email: "supervisor@msl.ma",
    level: "outline" as const,
    description: "Supervise les opérations terrain, rédige des NC et valide des actions.",
    modules: "Doc, Actions, NC (écriture) + RH (lecture)",
  },
  {
    role: "auditor",
    label: "Auditeur",
    email: "auditor@msl.ma",
    level: "outline" as const,
    description: "Droits d'écriture limités au module Audits. Lecture étendue.",
    modules: "Audits (écriture) + Doc, Actions, NC, RH (lecture)",
  },
  {
    role: "quality_assistant",
    label: "Assistant Qualité",
    email: "quality@msl.ma",
    level: "outline" as const,
    description: "Rédige des NC, suit les actions, consulte les KPIs et risques.",
    modules: "NC, Actions (écriture) + Doc, KPIs, Risques (lecture)",
  },
  {
    role: "operator",
    label: "Opérateur",
    email: "operator@msl.ma",
    level: "secondary" as const,
    description: "Accès minimal : saisie de contrôles et consultation de procédures.",
    modules: "Smart-Release (écriture) + Doc (lecture)",
  },
];

const ACCESS_MATRIX = [
  { module: "Documentation (5 axes)", superadmin: "✓✓✓", admin: "✓✓✓", director: "👁", pilot: "✓✓", copilot: "✓", supervisor: "✓", auditor: "👁", quality_assistant: "👁", operator: "👁 (axe 3)" },
  { module: "Audits",                 superadmin: "✓✓✓", admin: "✓✓✓", director: "✓", pilot: "👁", copilot: "👁", supervisor: "—", auditor: "✓✓", quality_assistant: "—", operator: "—" },
  { module: "Plan d'Action",          superadmin: "✓✓✓", admin: "✓✓✓", director: "✓", pilot: "✓", copilot: "✓", supervisor: "✓", auditor: "👁", quality_assistant: "✓", operator: "—" },
  { module: "Non-Conformités",        superadmin: "✓✓✓", admin: "✓✓✓", director: "👁", pilot: "✓", copilot: "✓", supervisor: "✓", auditor: "👁", quality_assistant: "✓", operator: "—" },
  { module: "Indicateurs / KPIs",     superadmin: "✓✓✓", admin: "✓✓✓", director: "👁", pilot: "✓", copilot: "👁", supervisor: "—", auditor: "—", quality_assistant: "👁", operator: "—" },
  { module: "Risques (AMDEC)",        superadmin: "✓✓✓", admin: "✓✓✓", director: "👁", pilot: "✓", copilot: "—", supervisor: "—", auditor: "—", quality_assistant: "👁", operator: "—" },
  { module: "RH",                     superadmin: "✓✓✓", admin: "✓✓✓", director: "👁", pilot: "👁", copilot: "—", supervisor: "👁", auditor: "👁", quality_assistant: "—", operator: "—" },
  { module: "Smart-Release",          superadmin: "✓✓✓", admin: "✓✓✓", director: "👁", pilot: "✓", copilot: "—", supervisor: "✓", auditor: "👁", quality_assistant: "—", operator: "✓ (saisie)" },
  { module: "Clients / Fournisseurs", superadmin: "✓✓✓", admin: "✓✓✓", director: "👁", pilot: "—", copilot: "—", supervisor: "—", auditor: "—", quality_assistant: "—", operator: "—" },
  { module: "Sécurité / RBAC",        superadmin: "✓✓✓", admin: "✓✓✓", director: "—", pilot: "—", copilot: "—", supervisor: "—", auditor: "—", quality_assistant: "—", operator: "—" },
];

const LOGS = [
  { date: "2026-06-08 00:07", user: "superadmin@msl.ma", action: "Seed RBAC — 9 utilisateurs créés", device: "PowerShell / Serveur", risk: "low" },
  { date: "2026-06-08 00:05", user: "admin@msl.ma", action: "Connexion réussie", device: "Chrome / Casablanca", risk: "low" },
  { date: "2026-04-30 13:45", user: "copilot@msl.ma", action: "Tentative accès module Sécurité (refusé)", device: "Mobile / Tanger", risk: "high" },
  { date: "2026-04-30 11:12", user: "pilot@msl.ma", action: "Modification PRO-LOG-01", device: "Chrome / Casablanca", risk: "low" },
  { date: "2026-04-29 18:30", user: "director@msl.ma", action: "Export confidentiel — fiche fournisseur", device: "Chrome / Rabat", risk: "medium" },
];

// ──────────────────────────── COMPONENT ────────────────────────────

function CopyEmail({ email }: { email: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(email);
    setCopied(true);
    toast.success("Email copié");
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button onClick={copy} className="flex items-center gap-1 font-mono text-[10px] text-muted-foreground hover:text-foreground transition-colors">
      {email}
      {copied ? <CheckCircle2 className="h-3 w-3 text-success" /> : <Copy className="h-3 w-3" />}
    </button>
  );
}

function CellAccess({ value }: { value: string }) {
  const color = value === "✓✓✓" || value === "✓✓" || value === "✓"
    ? "text-success"
    : value === "👁"
    ? "text-warning"
    : "text-muted-foreground";
  return <span className={`text-xs font-mono ${color}`}>{value}</span>;
}

export default function Securite() {
  const [userCount, setUserCount] = useState(ALL_ROLES.length);

  useEffect(() => {
    get("/api/auth/users").then((d: any) => setUserCount(d?.data?.length ?? ALL_ROLES.length)).catch(() => {});
  }, []);

  return (
    <>
      <PageHeader
        title="Sécurité & Accès"
        description="Couche RBAC transversale — 9 rôles, périmètres par processus, logs infalsifiables"
        iso="7.5.3"
        icon={<Lock className="h-5 w-5" />}
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <KPICard title="Utilisateurs actifs" value={userCount} icon={<UserCheck className="h-4 w-4" />} />
        <KPICard title="Rôles configurés" value={ALL_ROLES.length} icon={<Shield className="h-4 w-4" />} />
        <KPICard title="Anomalies IA (7j)" value={3} icon={<AlertTriangle className="h-4 w-4" />} />
        <KPICard title="Logs (jour)" value="1 247" icon={<Activity className="h-4 w-4" />} />
      </div>

      <Tabs defaultValue="profils">
        <TabsList className="grid grid-cols-4 w-full max-w-2xl">
          <TabsTrigger value="profils">Profils & Rôles</TabsTrigger>
          <TabsTrigger value="matrice">Matrice d'accès</TabsTrigger>
          <TabsTrigger value="logs">Journal</TabsTrigger>
          <TabsTrigger value="ia">Surveillance IA</TabsTrigger>
        </TabsList>

        {/* ── PROFILS ── */}
        <TabsContent value="profils" className="mt-4">
          <div className="mb-3 p-3 rounded-lg border border-primary/20 bg-primary/5 text-sm flex items-start gap-2">
            <Shield className="h-4 w-4 text-primary mt-0.5 shrink-0" />
            <div>
              <span className="font-medium">Utilisateurs par défaut seedés au démarrage</span>
              <span className="text-muted-foreground ml-1">— Mot de passe par défaut : <code className="bg-muted px-1 rounded">Password123</code></span>
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {ALL_ROLES.map(p => (
              <Card key={p.role}>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between gap-2">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Shield className="h-4 w-4 text-primary" />
                      {p.label}
                    </CardTitle>
                    <Badge variant={p.level} className="text-[9px] uppercase font-mono">{p.role}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="text-xs text-muted-foreground">{p.description}</p>
                  <CopyEmail email={p.email} />
                  <div className="text-[11px] text-muted-foreground">
                    <span className="font-medium text-foreground">Accès :</span> {p.modules}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="mt-3 bg-muted/30">
            <CardHeader className="pb-3"><CardTitle className="text-sm">Périmètres & Confidentialité</CardTitle></CardHeader>
            <CardContent className="text-xs text-muted-foreground space-y-1">
              <div>• <strong>Périmètre géographique :</strong> restriction par site (Casablanca, Tanger Med, Rabat…)</div>
              <div>• <strong>Périmètre processus :</strong> Pilote/Co-pilote ne voient que leur processus assigné</div>
              <div>• <strong>Documents privés :</strong> contrats fournisseurs, fiches de paie — invisibles hors rôle autorisé</div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── MATRICE ── */}
        <TabsContent value="matrice" className="mt-4">
          <Card>
            <CardContent className="p-0 overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-[160px]">Module</TableHead>
                    <TableHead>SuperAdmin</TableHead>
                    <TableHead>Admin</TableHead>
                    <TableHead>Directeur</TableHead>
                    <TableHead>Pilote</TableHead>
                    <TableHead>Co-Pilote</TableHead>
                    <TableHead>Superviseur</TableHead>
                    <TableHead>Auditeur</TableHead>
                    <TableHead>Asst. Qualité</TableHead>
                    <TableHead>Opérateur</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {ACCESS_MATRIX.map(r => (
                    <TableRow key={r.module}>
                      <TableCell className="font-medium text-sm">{r.module}</TableCell>
                      <TableCell><CellAccess value={r.superadmin} /></TableCell>
                      <TableCell><CellAccess value={r.admin} /></TableCell>
                      <TableCell><CellAccess value={r.director} /></TableCell>
                      <TableCell><CellAccess value={r.pilot} /></TableCell>
                      <TableCell><CellAccess value={r.copilot} /></TableCell>
                      <TableCell><CellAccess value={r.supervisor} /></TableCell>
                      <TableCell><CellAccess value={r.auditor} /></TableCell>
                      <TableCell><CellAccess value={r.quality_assistant} /></TableCell>
                      <TableCell><CellAccess value={r.operator} /></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className="text-[10px] text-muted-foreground p-3 border-t flex gap-4">
                <span className="text-success">✓✓✓ / ✓✓ / ✓ écriture</span>
                <span className="text-warning">👁 lecture seule</span>
                <span className="text-muted-foreground">— aucun accès</span>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── LOGS ── */}
        <TabsContent value="logs" className="mt-4">
          <Card>
            <CardHeader><CardTitle className="text-base flex items-center gap-2"><Activity className="h-4 w-4" />Journal de connexion & modifications</CardTitle></CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow><TableHead>Horodatage</TableHead><TableHead>Utilisateur</TableHead><TableHead>Action</TableHead><TableHead>Appareil / Site</TableHead><TableHead>Risque</TableHead></TableRow>
                </TableHeader>
                <TableBody>
                  {LOGS.map((l, i) => (
                    <TableRow key={i}>
                      <TableCell className="font-mono text-xs">{l.date}</TableCell>
                      <TableCell className="text-sm font-mono">{l.user}</TableCell>
                      <TableCell className="text-sm">{l.action}</TableCell>
                      <TableCell className="text-xs text-muted-foreground">{l.device}</TableCell>
                      <TableCell>
                        <Badge variant={l.risk === "high" ? "destructive" : l.risk === "medium" ? "secondary" : "outline"} className="text-[9px]">
                          {l.risk}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className="text-[10px] text-muted-foreground p-3 border-t">Logs archivés Axe 5 du processus Management — preuve infalsifiable</div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── Журнал événements ── */}
        <TabsContent value="ia" className="mt-4 space-y-3">
          <Card>
            <CardHeader className="pb-3"><CardTitle className="text-sm">Journal des événements de sécurité</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              <div className="p-3 rounded-md bg-destructive/10 border border-destructive/30">
                <div className="text-sm font-medium text-destructive">🚨 Tentatives répétées hors périmètre</div>
                <div className="text-xs text-muted-foreground mt-1">copilot@msl.ma — 4 tentatives sur module Sécurité en 10 min · Accès bloqué · Admin notifié</div>
              </div>
              <div className="p-3 rounded-md bg-warning/10 border border-warning/30">
                <div className="text-sm font-medium">⚠️ Export inhabituel</div>
                <div className="text-xs text-muted-foreground mt-1">director@msl.ma — Export fiche fournisseur en dehors des heures usuelles (18h30)</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3"><CardTitle className="text-sm">Attribution des droits d’accès</CardTitle></CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground mb-2">Lors de la création d’un employé dans le module RH, les droits sont assignés par le superviseur selon le poste.</p>
              <div className="p-3 rounded-md bg-muted/40 text-xs">
                <strong>Exemple :</strong> "Chef d'atelier Tanger" → profil <Badge variant="secondary" className="ml-1">Pilote · Périmètre Tanger</Badge>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </>
  );
}
