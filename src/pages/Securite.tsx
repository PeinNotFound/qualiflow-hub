import { Lock, Shield, UserCheck, Activity, AlertTriangle, Eye, Sparkles } from "lucide-react";
import { PageHeader } from "@/components/qh/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { KPICard } from "@/components/qh/ParamCard";

interface Profile { name: string; description: string; modules: string; level: "full" | "process" | "audit" | "operator"; }
const profiles: Profile[] = [
  { name: "Administrateur", description: "Accès total — paramétrage, suppression, configuration IA", modules: "Tous les modules", level: "full" },
  { name: "Pilote de Processus", description: "Modification des 5 axes de son propre processus, lecture seule sur les autres", modules: "Processus assigné", level: "process" },
  { name: "Auditeur", description: "Lecture étendue, modification limitée au module Audit", modules: "Audit + lecture globale", level: "audit" },
  { name: "Opérateur", description: "Saisie contrôles (Smart-Release), consultation procédures, ses propres actions", modules: "Smart-Release · Doc · Actions", level: "operator" },
];

const logs = [
  { date: "2026-04-30 14:23", user: "salma.idrissi@msl.ma", action: "Validation rapport audit AUD-2026-002", device: "Chrome / Casablanca", risk: "low" },
  { date: "2026-04-30 13:45", user: "mehdi.cherkaoui@msl.ma", action: "Tentative accès module Sécurité", device: "Mobile / Tanger", risk: "high" },
  { date: "2026-04-30 11:12", user: "anas.benali@msl.ma", action: "Modification PRO-LOG-01", device: "Chrome / Casablanca", risk: "low" },
  { date: "2026-04-30 09:55", user: "admin@msl.ma", action: "Création utilisateur · Profil Opérateur", device: "Edge / Casablanca", risk: "low" },
  { date: "2026-04-29 18:30", user: "yasmine.alaoui@msl.ma", action: "Export confidentiel — fiche fournisseur", device: "Chrome / Rabat", risk: "medium" },
];

const matrix = [
  { module: "Documentation (5 axes)", admin: "✓✓✓", pilote: "✓ (son proc.)", auditeur: "👁", operateur: "👁 (axe 3)" },
  { module: "Audits", admin: "✓✓✓", pilote: "👁", auditeur: "✓✓", operateur: "—" },
  { module: "Plan d'Action", admin: "✓✓✓", pilote: "✓", auditeur: "👁", operateur: "✓ (siennes)" },
  { module: "Smart-Release", admin: "✓✓✓", pilote: "✓", auditeur: "👁", operateur: "✓ (saisie)" },
  { module: "RH", admin: "✓✓✓", pilote: "👁", auditeur: "👁", operateur: "—" },
  { module: "Risques", admin: "✓✓✓", pilote: "✓", auditeur: "👁", operateur: "—" },
  { module: "Sécurité", admin: "✓✓✓", pilote: "—", auditeur: "—", operateur: "—" },
];

export default function Securite() {
  return (
    <>
      <PageHeader
        title="Sécurité & Accès"
        description="Couche RBAC transversale — profils par fonction, périmètres, logs infalsifiables"
        iso="7.5.3"
        icon={<Lock className="h-5 w-5" />}
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <KPICard title="Utilisateurs actifs" value={42} icon={<UserCheck className='h-4 w-4' />} />
        <KPICard title="Profils configurés" value={4} icon={<Shield className='h-4 w-4' />} />
        <KPICard title="Anomalies IA (7j)" value={3} icon={<AlertTriangle className='h-4 w-4' />} />
        <KPICard title="Logs (jour)" value="1 247" icon={<Activity className='h-4 w-4' />} />
      </div>

      <Tabs defaultValue="profils">
        <TabsList>
          <TabsTrigger value="profils">Profils & Rôles</TabsTrigger>
          <TabsTrigger value="matrice">Matrice d'accès</TabsTrigger>
          <TabsTrigger value="logs">Journal & Logs</TabsTrigger>
          <TabsTrigger value="ia">Surveillance IA</TabsTrigger>
        </TabsList>

        <TabsContent value="profils" className="grid md:grid-cols-2 gap-4">
          {profiles.map(p => (
            <Card key={p.name}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Shield className="h-4 w-4 text-primary" />{p.name}
                  </CardTitle>
                  <Badge variant={p.level === "full" ? "destructive" : "secondary"} className="text-[9px] uppercase">{p.level}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">{p.description}</p>
                <div className="text-xs"><span className="text-muted-foreground">Modules : </span><span className="font-medium">{p.modules}</span></div>
              </CardContent>
            </Card>
          ))}
          <Card className="md:col-span-2 bg-muted/30">
            <CardHeader className="pb-3"><CardTitle className="text-sm">Périmètres & Confidentialité</CardTitle></CardHeader>
            <CardContent className="text-xs text-muted-foreground space-y-1">
              <div>• <strong>Périmètre géographique :</strong> restriction par site (Casablanca, Tanger Med, Rabat…)</div>
              <div>• <strong>Périmètre département :</strong> restriction par direction métier</div>
              <div>• <strong>Documents privés :</strong> contrats fournisseurs, fiches de paie — invisibles même au sein du même processus</div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="matrice">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Module</TableHead>
                    <TableHead>Administrateur</TableHead>
                    <TableHead>Pilote</TableHead>
                    <TableHead>Auditeur</TableHead>
                    <TableHead>Opérateur</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {matrix.map(r => (
                    <TableRow key={r.module}>
                      <TableCell className="font-medium text-sm">{r.module}</TableCell>
                      <TableCell className="text-xs font-mono">{r.admin}</TableCell>
                      <TableCell className="text-xs font-mono">{r.pilote}</TableCell>
                      <TableCell className="text-xs font-mono">{r.auditeur}</TableCell>
                      <TableCell className="text-xs font-mono">{r.operateur}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className="text-[10px] text-muted-foreground p-3 border-t">✓✓✓ accès total · ✓ modification · 👁 lecture seule · — aucun accès</div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="logs">
          <Card>
            <CardHeader><CardTitle className="text-base flex items-center gap-2"><Activity className="h-4 w-4" />Journal de connexion & modifications</CardTitle></CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow><TableHead>Horodatage</TableHead><TableHead>Utilisateur</TableHead><TableHead>Action</TableHead><TableHead>Appareil / Site</TableHead><TableHead>Risque</TableHead></TableRow>
                </TableHeader>
                <TableBody>
                  {logs.map((l, i) => (
                    <TableRow key={i}>
                      <TableCell className="font-mono text-xs">{l.date}</TableCell>
                      <TableCell className="text-sm">{l.user}</TableCell>
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

        <TabsContent value="ia" className="space-y-3">
          <Card>
            <CardHeader className="pb-3"><CardTitle className="text-sm flex items-center gap-2"><Sparkles className="h-4 w-4 text-primary" />Détection d'anomalies IA</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              <div className="p-3 rounded-md bg-destructive/10 border border-destructive/30">
                <div className="text-sm font-medium text-destructive">🚨 Tentatives répétées hors périmètre</div>
                <div className="text-xs text-muted-foreground mt-1">mehdi.cherkaoui@msl.ma — 4 tentatives sur module Sécurité en 10 min · Accès bloqué temporairement · Admin notifié</div>
              </div>
              <div className="p-3 rounded-md bg-warning/10 border border-warning/30">
                <div className="text-sm font-medium">⚠️ Export inhabituel</div>
                <div className="text-xs text-muted-foreground mt-1">yasmine.alaoui@msl.ma — Export fiche fournisseur en dehors des heures usuelles</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3"><CardTitle className="text-sm flex items-center gap-2"><Eye className="h-4 w-4" />Attribution suggérée IA</CardTitle></CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground mb-2">Lors de la création d'un employé dans le module RH, l'IA propose automatiquement un profil de droits selon l'intitulé du poste.</p>
              <div className="p-3 rounded-md bg-muted/40 text-xs">
                <strong>Exemple :</strong> "Chef d'atelier Tanger" → profil suggéré <Badge variant="secondary" className="ml-1">Pilote · Périmètre Tanger</Badge>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </>
  );
}
