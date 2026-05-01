import { useState } from "react";
import { PackageCheck, ShieldCheck, FileSignature, FileCheck2, AlertTriangle, Lock, CheckCircle2, XCircle, Sparkles } from "lucide-react";
import { PageHeader } from "@/components/qh/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { KPICard } from "@/components/qh/ParamCard";
import { toast } from "sonner";

type StepStatus = "pending" | "success" | "fail" | "derogation";
interface Control { id: string; libelle: string; valeur?: string; tolerance: string; statut: StepStatus; }
interface ReleaseLot {
  id: string; reference: string; produit: string; client: string; site: string; quantite: number;
  controles: Control[]; signatures: { role: string; signataire: string; signe: boolean }[];
  statut: "En contrôle" | "Bloqué" | "Libéré" | "Avec dérogation";
  critique: boolean;
}

const initial: ReleaseLot[] = [
  {
    id: "L1", reference: "REL-2026-0142", produit: "Containers réfrigérés MSL-REF-40", client: "Cosumar SA",
    site: "Tanger Med", quantite: 12, critique: true, statut: "En contrôle",
    controles: [
      { id: "c1", libelle: "Test étanchéité (≤ 0.2 mbar/min)", valeur: "0.15", tolerance: "≤ 0.2", statut: "success" },
      { id: "c2", libelle: "Température à vide (-25°C ± 1)", valeur: "-24.6", tolerance: "-26 à -24", statut: "success" },
      { id: "c3", libelle: "Inspection visuelle joints", valeur: "Conforme", tolerance: "Sans défaut", statut: "success" },
      { id: "c4", libelle: "Charge utile (kg)", valeur: "29 800", tolerance: "≤ 30 000", statut: "pending" },
    ],
    signatures: [
      { role: "Responsable Qualité", signataire: "Salma El Idrissi", signe: false },
      { role: "Chef d'atelier", signataire: "Mehdi Cherkaoui", signe: false },
    ],
  },
  {
    id: "L2", reference: "REL-2026-0141", produit: "Palettes EUR1 traitées", client: "OCP",
    site: "Casablanca", quantite: 480, critique: false, statut: "Bloqué",
    controles: [
      { id: "c1", libelle: "Marquage IPPC", valeur: "OK", tolerance: "Présent", statut: "success" },
      { id: "c2", libelle: "Humidité < 18%", valeur: "21.4", tolerance: "< 18%", statut: "fail" },
    ],
    signatures: [{ role: "Responsable Qualité", signataire: "Salma El Idrissi", signe: false }],
  },
  {
    id: "L3", reference: "REL-2026-0140", produit: "Service de transport sec",
    client: "Marjane", site: "Casablanca", quantite: 1, critique: false, statut: "Libéré",
    controles: [
      { id: "c1", libelle: "Vérification document transport", valeur: "OK", tolerance: "Complet", statut: "success" },
      { id: "c2", libelle: "Briefing chauffeur", valeur: "OK", tolerance: "Effectué", statut: "success" },
    ],
    signatures: [
      { role: "Responsable Qualité", signataire: "Salma El Idrissi", signe: true },
      { role: "Client", signataire: "Marjane", signe: true },
    ],
  },
];

const statutColor = (s: ReleaseLot["statut"]) =>
  s === "Libéré" ? "default" : s === "Bloqué" ? "destructive" : s === "Avec dérogation" ? "secondary" : "outline";

export default function SmartRelease() {
  const [lots, setLots] = useState(initial);
  const [selected, setSelected] = useState<ReleaseLot | null>(initial[0]);

  const canRelease = (l: ReleaseLot) => {
    const allDone = l.controles.every(c => c.statut === "success" || c.statut === "derogation");
    const allSigned = l.signatures.every(s => s.signe);
    return allDone && allSigned;
  };

  const tryRelease = (l: ReleaseLot) => {
    if (l.controles.some(c => c.statut === "fail")) {
      toast.error("🛑 Libération bloquée — Échec détecté. Fiche d'action ouverte automatiquement.");
      return;
    }
    if (!canRelease(l)) {
      toast.error("Contrôles ou signatures incomplets.");
      return;
    }
    setLots(ls => ls.map(x => x.id === l.id ? { ...x, statut: "Libéré" } : x));
    toast.success(`✅ ${l.reference} libéré · CoC généré et archivé (Axe 5)`);
  };

  return (
    <>
      <PageHeader
        title="Smart-Release"
        description="Gatekeeper numérique — Vérification, autorisation, traçabilité. Rien ne sort sans validation infalsifiable."
        iso="8.6"
        icon={<PackageCheck className="h-5 w-5" />}
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <KPICard title="Lots en contrôle" value={lots.filter(l => l.statut === "En contrôle").length} icon={<ShieldCheck className='h-4 w-4' />} />
        <KPICard title="Bloqués" value={lots.filter(l => l.statut === "Bloqué").length} icon={<Lock className='h-4 w-4' />} />
        <KPICard title="Libérés (mois)" value={lots.filter(l => l.statut === "Libéré").length} icon={<CheckCircle2 className='h-4 w-4' />} />
        <KPICard title="Taux de libération 1er passage" value="92%" icon={<Sparkles className='h-4 w-4' />} />
      </div>

      <Tabs defaultValue="dashboard">
        <TabsList>
          <TabsTrigger value="dashboard">Lots à libérer</TabsTrigger>
          <TabsTrigger value="detail">Fiche de libération</TabsTrigger>
          <TabsTrigger value="recurrence">Analyse récurrence (IA)</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Référence</TableHead>
                    <TableHead>Produit / Service</TableHead>
                    <TableHead>Client</TableHead>
                    <TableHead>Avancement</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {lots.map(l => {
                    const ok = l.controles.filter(c => c.statut === "success").length;
                    const pct = Math.round((ok / l.controles.length) * 100);
                    return (
                      <TableRow key={l.id}>
                        <TableCell className="font-mono text-xs">{l.reference}{l.critique && <Badge variant="destructive" className="ml-2 text-[9px]">CRITIQUE</Badge>}</TableCell>
                        <TableCell className="font-medium">{l.produit}</TableCell>
                        <TableCell className="text-sm">{l.client}</TableCell>
                        <TableCell className="w-40">
                          <div className="flex items-center gap-2">
                            <Progress value={pct} className="h-1.5" />
                            <span className="text-xs font-mono">{pct}%</span>
                          </div>
                        </TableCell>
                        <TableCell><Badge variant={statutColor(l.statut)}>{l.statut}</Badge></TableCell>
                        <TableCell className="text-right">
                          <Button size="sm" variant="ghost" onClick={() => setSelected(l)}>Ouvrir</Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="detail" className="space-y-4">
          {!selected ? <p className="text-muted-foreground text-sm">Sélectionnez un lot dans l'onglet précédent.</p> : (
            <>
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-base">{selected.reference} — {selected.produit}</CardTitle>
                      <p className="text-xs text-muted-foreground mt-1">Client : {selected.client} · Site : {selected.site} · Quantité : {selected.quantite}</p>
                    </div>
                    <Badge variant={statutColor(selected.statut)}>{selected.statut}</Badge>
                  </div>
                </CardHeader>
              </Card>

              <Card>
                <CardHeader className="pb-3"><CardTitle className="text-sm flex items-center gap-2"><ShieldCheck className="h-4 w-4" />1. Vérification de conformité</CardTitle></CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow><TableHead>Contrôle</TableHead><TableHead>Tolérance</TableHead><TableHead>Valeur</TableHead><TableHead>Statut</TableHead></TableRow>
                    </TableHeader>
                    <TableBody>
                      {selected.controles.map(c => (
                        <TableRow key={c.id}>
                          <TableCell className="text-sm">{c.libelle}</TableCell>
                          <TableCell className="text-xs font-mono">{c.tolerance}</TableCell>
                          <TableCell><Input defaultValue={c.valeur} className="h-7 text-xs w-28" /></TableCell>
                          <TableCell>
                            {c.statut === "success" && <Badge className="bg-success text-success-foreground"><CheckCircle2 className="h-3 w-3 mr-1" />Succès</Badge>}
                            {c.statut === "fail" && <Badge variant="destructive"><XCircle className="h-3 w-3 mr-1" />Échec</Badge>}
                            {c.statut === "pending" && <Badge variant="outline">En attente</Badge>}
                            {c.statut === "derogation" && <Badge variant="secondary">Dérogation</Badge>}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  {selected.controles.some(c => c.statut === "fail") && (
                    <div className="mt-3 p-3 rounded-md bg-destructive/10 border border-destructive/30 flex items-start gap-2">
                      <AlertTriangle className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
                      <div className="text-xs">
                        <strong className="text-destructive">IA — Blocage automatique :</strong> Valeur hors tolérance détectée. Une fiche "Non-conformité détectée avant libération" a été ouverte dans le Plan d'Action.
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3"><CardTitle className="text-sm flex items-center gap-2"><FileSignature className="h-4 w-4" />2. Autorisation formelle{selected.critique && <Badge variant="destructive" className="text-[9px]">DOUBLE SIGNATURE IA</Badge>}</CardTitle></CardHeader>
                <CardContent className="space-y-2">
                  {selected.signatures.map((s, i) => (
                    <div key={i} className="flex items-center justify-between p-2 rounded border border-border">
                      <div>
                        <div className="text-sm font-medium">{s.role}</div>
                        <div className="text-xs text-muted-foreground">{s.signataire}</div>
                      </div>
                      {s.signe ? <Badge className="bg-success text-success-foreground">Signé</Badge> : <Button size="sm" variant="outline">Signer</Button>}
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3"><CardTitle className="text-sm flex items-center gap-2"><FileCheck2 className="h-4 w-4" />3. Preuve documentaire</CardTitle></CardHeader>
                <CardContent>
                  <p className="text-xs text-muted-foreground mb-3">Le Certificat de Conformité (CoC) sera généré automatiquement avec l'historique complet des contrôles et archivé dans l'Axe 5 (Enregistrements).</p>
                  <div className="flex gap-2">
                    <Button onClick={() => tryRelease(selected)} disabled={selected.statut === "Libéré"}>
                      <PackageCheck className="h-4 w-4 mr-2" />Libérer & générer CoC
                    </Button>
                    <Button variant="outline">Demander dérogation</Button>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>

        <TabsContent value="recurrence">
          <Card>
            <CardHeader><CardTitle className="text-sm flex items-center gap-2"><Sparkles className="h-4 w-4 text-primary" />Détection IA — Analyse de récurrence</CardTitle></CardHeader>
            <CardContent>
              <div className="p-4 rounded-lg bg-warning/10 border border-warning/30">
                <div className="font-medium text-sm mb-2">⚠️ Pattern détecté : "Humidité palettes" — 3 lots consécutifs en échec</div>
                <p className="text-xs text-muted-foreground mb-3">L'IA suggère l'ouverture d'une <strong>Action de Fond (AMDEC)</strong> pour réviser le processus de séchage palettes.</p>
                <Button size="sm" onClick={() => toast.success("Action AMDEC créée et liée au processus Réalisation")}>Générer action AMDEC</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </>
  );
}
