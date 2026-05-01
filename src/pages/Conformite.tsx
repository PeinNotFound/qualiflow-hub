import { useState } from "react";
import { PageHeader } from "@/components/qh/PageHeader";
import { Newspaper, Plus, Sparkles, Scale, FileCheck, AlertTriangle, CheckCircle2, Copy, Building2, Users, FileText, Bell } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { ParamCard, KPICard } from "@/components/qh/ParamCard";
import { StatusBadge } from "@/components/qh/StatusBadge";
import { employees } from "@/lib/mock-data";
import { toast } from "sonner";

// ============== Données factices =================
const TYPES = ["Réglementaire", "Légale", "Normative", "Autre exigence applicable"];
const SOURCES = ["Journal Officiel", "ISO", "Ministère du Transport", "Code du Travail", "Client (contrat)", "Interne"];
const CATEGORIES = ["HSE", "Transport routier", "Douane & Import/Export", "Données personnelles", "Qualité produit", "Fiscal"];
const SITES = ["Casablanca - Siège", "Tanger Med - Plateforme", "Rabat - Agence", "Marrakech - Dépôt"];

interface Exigence {
  id: string;
  libelle: string;
  article?: string;
  conformite?: "conforme" | "non-conforme" | "partiel" | "na" | null;
  commentaire?: string;
  actionId?: string;
}

interface FicheConformite {
  id: string;
  reference: string;
  titre: string;
  type: string;
  source: string;
  categorie: string;
  docExterne: string;
  datePublication: string;
  sites: string[];
  responsables: string[]; // employee ids
  exigences: Exigence[];
  statut: "brouillon" | "active" | "archivee";
}

const initialFiches: FicheConformite[] = [
  {
    id: "FC-001",
    reference: "Loi 52-05",
    titre: "Code de la route - Transport de marchandises",
    type: "Légale",
    source: "Ministère du Transport",
    categorie: "Transport routier",
    docExterne: "BO n°5630 - 2010",
    datePublication: "2010-10-11",
    sites: ["Casablanca - Siège", "Tanger Med - Plateforme"],
    responsables: [employees[0]?.id ?? "E-001"],
    statut: "active",
    exigences: [
      { id: "X1", libelle: "Limitation tonnage PTAC", article: "Art. 12", conformite: "conforme" },
      { id: "X2", libelle: "Carnet de bord conducteur", article: "Art. 23", conformite: "conforme" },
      { id: "X3", libelle: "Visite technique semestrielle", article: "Art. 31", conformite: "non-conforme", commentaire: "2 véhicules en retard", actionId: "ACT-014" },
      { id: "X4", libelle: "Formation continue chauffeurs", article: "Art. 45", conformite: "partiel" },
    ],
  },
  {
    id: "FC-002",
    reference: "Loi 09-08",
    titre: "Protection des données personnelles",
    type: "Légale",
    source: "Journal Officiel",
    categorie: "Données personnelles",
    docExterne: "BO n°5714 - 2009",
    datePublication: "2009-02-18",
    sites: SITES,
    responsables: [employees[1]?.id ?? "E-002"],
    statut: "active",
    exigences: [
      { id: "X1", libelle: "Déclaration CNDP", conformite: "conforme" },
      { id: "X2", libelle: "Consentement client", conformite: "conforme" },
      { id: "X3", libelle: "Registre des traitements", conformite: "partiel" },
    ],
  },
  {
    id: "FC-003",
    reference: "ISO 9001:2015",
    titre: "Système de Management de la Qualité",
    type: "Normative",
    source: "ISO",
    categorie: "Qualité produit",
    docExterne: "ISO 9001:2015",
    datePublication: "2015-09-15",
    sites: SITES,
    responsables: [employees[2]?.id ?? "E-003"],
    statut: "active",
    exigences: [
      { id: "X1", libelle: "§4 Contexte de l'organisme", conformite: "conforme" },
      { id: "X2", libelle: "§6.1 Risques et opportunités", conformite: "conforme" },
      { id: "X3", libelle: "§9.2 Audit interne", conformite: "conforme" },
      { id: "X4", libelle: "§10.2 Non-conformité et action corrective", conformite: "conforme" },
    ],
  },
];

const tauxConformite = (f: FicheConformite) => {
  const evals = f.exigences.filter(e => e.conformite && e.conformite !== "na");
  if (!evals.length) return 0;
  const score = evals.reduce((s, e) => s + (e.conformite === "conforme" ? 1 : e.conformite === "partiel" ? 0.5 : 0), 0);
  return Math.round((score / evals.length) * 100);
};

const tauxEvaluation = (f: FicheConformite) => {
  const total = f.exigences.length;
  if (!total) return 0;
  const done = f.exigences.filter(e => e.conformite).length;
  return Math.round((done / total) * 100);
};

export default function Conformite() {
  const [fiches, setFiches] = useState<FicheConformite[]>(initialFiches);
  const [selected, setSelected] = useState<FicheConformite | null>(null);
  const [openNew, setOpenNew] = useState(false);

  const totalExigences = fiches.reduce((s, f) => s + f.exigences.length, 0);
  const nonConformes = fiches.flatMap(f => f.exigences).filter(e => e.conformite === "non-conforme").length;
  const tauxGlobal = Math.round(
    fiches.reduce((s, f) => s + tauxConformite(f), 0) / Math.max(1, fiches.length)
  );

  const evaluerExigence = (ficheId: string, exId: string, value: Exigence["conformite"]) => {
    setFiches(prev => prev.map(f => f.id === ficheId
      ? { ...f, exigences: f.exigences.map(e => e.id === exId ? { ...e, conformite: value } : e) }
      : f
    ));
    if (selected?.id === ficheId) {
      setSelected(s => s ? { ...s, exigences: s.exigences.map(e => e.id === exId ? { ...e, conformite: value } : e) } : s);
    }
    if (value === "non-conforme") toast.warning("Non-conformité détectée — pensez à rattacher une action corrective");
  };

  const dupliquerFiche = (f: FicheConformite) => {
    const copy: FicheConformite = {
      ...f,
      id: `FC-${String(fiches.length + 1).padStart(3, "0")}`,
      reference: `${f.reference} (copie)`,
      statut: "brouillon",
      exigences: f.exigences.map(e => ({ ...e, conformite: null, commentaire: "", actionId: undefined })),
    };
    setFiches([...fiches, copy]);
    toast.success("Fiche dupliquée");
  };

  return (
    <div>
      <PageHeader
        icon={<Scale className="h-5 w-5" />}
        title="Évaluation de la Conformité"
        description="Veille réglementaire, légale et normative — Fiches d'évaluation par site"
        iso="9.1.2"
        actions={
          <>
            <Button variant="outline" size="sm" className="gap-1.5">
              <Sparkles className="h-3.5 w-3.5" /> IA - Suggérer exigences
            </Button>
            <Button size="sm" className="gap-1.5" onClick={() => setOpenNew(true)}>
              <Plus className="h-3.5 w-3.5" /> Nouvelle fiche
            </Button>
          </>
        }
      />

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 mb-6">
        <KPICard title="Fiches actives" value={fiches.filter(f => f.statut === "active").length} icon={<FileCheck className="h-4 w-4" />} hint={`${fiches.length} fiches au total`} />
        <KPICard title="Exigences suivies" value={totalExigences} icon={<FileText className="h-4 w-4" />} />
        <KPICard title="Taux de conformité" value={`${tauxGlobal}%`} icon={<CheckCircle2 className="h-4 w-4" />} hint="Moyenne tous sites" />
        <KPICard title="Non-conformités" value={nonConformes} icon={<AlertTriangle className="h-4 w-4" />} hint="Plans d'action requis" />
      </div>

      <Tabs defaultValue="fiches">
        <TabsList>
          <TabsTrigger value="fiches">Fiches d'évaluation</TabsTrigger>
          <TabsTrigger value="agenda">Agenda / Alertes</TabsTrigger>
          <TabsTrigger value="sites">Synthèse par site</TabsTrigger>
          <TabsTrigger value="param">Paramétrage</TabsTrigger>
        </TabsList>

        {/* ============= FICHES ============= */}
        <TabsContent value="fiches" className="mt-4 space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Liste des fiches de conformité</CardTitle>
              <CardDescription>Cliquer sur une fiche pour évaluer chaque exigence</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Référence</TableHead>
                    <TableHead>Titre</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Source</TableHead>
                    <TableHead>Sites</TableHead>
                    <TableHead className="w-[140px]">Conformité</TableHead>
                    <TableHead className="w-[120px]">Évaluation</TableHead>
                    <TableHead className="w-[120px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {fiches.map(f => {
                    const tc = tauxConformite(f);
                    const te = tauxEvaluation(f);
                    return (
                      <TableRow key={f.id} className="cursor-pointer" onClick={() => setSelected(f)}>
                        <TableCell className="font-mono text-xs">{f.reference}</TableCell>
                        <TableCell className="font-medium">{f.titre}</TableCell>
                        <TableCell><Badge variant="outline">{f.type}</Badge></TableCell>
                        <TableCell className="text-xs text-muted-foreground">{f.source}</TableCell>
                        <TableCell className="text-xs">{f.sites.length} site(s)</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Progress value={tc} className="h-1.5 flex-1" />
                            <span className="text-xs font-mono w-9 text-right">{tc}%</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Progress value={te} className="h-1.5 flex-1" />
                            <span className="text-xs font-mono w-9 text-right">{te}%</span>
                          </div>
                        </TableCell>
                        <TableCell onClick={e => e.stopPropagation()}>
                          <Button size="sm" variant="ghost" className="h-7 px-2 gap-1" onClick={() => dupliquerFiche(f)}>
                            <Copy className="h-3.5 w-3.5" /> Dupl.
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Détail / évaluation */}
          {selected && (
            <Card className="border-primary/40">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <CardTitle className="text-base">{selected.reference} — {selected.titre}</CardTitle>
                    <CardDescription className="mt-1">
                      {selected.type} · {selected.source} · {selected.docExterne}
                    </CardDescription>
                  </div>
                  <Button size="sm" variant="ghost" onClick={() => setSelected(null)}>Fermer</Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                  <div className="space-y-1">
                    <div className="text-muted-foreground uppercase tracking-wider">Catégorie</div>
                    <div className="font-medium">{selected.categorie}</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-muted-foreground uppercase tracking-wider">Publication</div>
                    <div className="font-medium">{selected.datePublication}</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-muted-foreground uppercase tracking-wider">Sites concernés</div>
                    <div className="font-medium">{selected.sites.length}</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-muted-foreground uppercase tracking-wider">Responsables</div>
                    <div className="font-medium">{selected.responsables.length}</div>
                  </div>
                </div>

                <div>
                  <div className="text-sm font-semibold mb-2">Évaluation par exigence</div>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Exigence</TableHead>
                        <TableHead className="w-[100px]">Article</TableHead>
                        <TableHead className="w-[180px]">Statut</TableHead>
                        <TableHead className="w-[140px]">Action liée</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selected.exigences.map(ex => (
                        <TableRow key={ex.id}>
                          <TableCell className="text-sm">{ex.libelle}</TableCell>
                          <TableCell className="font-mono text-xs">{ex.article ?? "—"}</TableCell>
                          <TableCell>
                            <Select
                              value={ex.conformite ?? "na"}
                              onValueChange={(v: any) => evaluerExigence(selected.id, ex.id, v)}
                            >
                              <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                              <SelectContent>
                                <SelectItem value="conforme">✓ Conforme</SelectItem>
                                <SelectItem value="partiel">◐ Partiel</SelectItem>
                                <SelectItem value="non-conforme">✗ Non conforme</SelectItem>
                                <SelectItem value="na">N/A</SelectItem>
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell>
                            {ex.actionId ? (
                              <Badge variant="outline" className="font-mono text-[10px]">{ex.actionId}</Badge>
                            ) : ex.conformite === "non-conforme" ? (
                              <Button size="sm" variant="outline" className="h-7 text-xs gap-1">
                                <Plus className="h-3 w-3" /> Action
                              </Button>
                            ) : <span className="text-xs text-muted-foreground">—</span>}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                <div className="flex justify-between items-center pt-2 border-t">
                  <div className="flex gap-6 text-sm">
                    <div>
                      <span className="text-muted-foreground">Taux conformité : </span>
                      <span className="font-bold text-success">{tauxConformite(selected)}%</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Taux évaluation : </span>
                      <span className="font-bold">{tauxEvaluation(selected)}%</span>
                    </div>
                  </div>
                  <Button size="sm" onClick={() => toast.success("Évaluation validée")}>Valider l'évaluation</Button>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* ============= AGENDA ============= */}
        <TabsContent value="agenda" className="mt-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2"><Bell className="h-4 w-4" /> Mes alertes d'évaluation</CardTitle>
              <CardDescription>Fiches en attente d'évaluation par les responsables désignés</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {fiches.filter(f => tauxEvaluation(f) < 100).map(f => (
                <div key={f.id} className="flex items-center justify-between p-3 rounded-lg border bg-muted/30">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-warning/15 text-warning flex items-center justify-center">
                      <Bell className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="text-sm font-medium">{f.reference} — {f.titre}</div>
                      <div className="text-xs text-muted-foreground">{f.exigences.filter(e => !e.conformite).length} exigence(s) à évaluer · {f.sites.length} site(s)</div>
                    </div>
                  </div>
                  <Button size="sm" variant="outline" onClick={() => setSelected(f)}>Évaluer</Button>
                </div>
              ))}
              {fiches.every(f => tauxEvaluation(f) === 100) && (
                <div className="text-center py-6 text-sm text-muted-foreground">Toutes les évaluations sont à jour ✓</div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ============= SITES ============= */}
        <TabsContent value="sites" className="mt-4">
          <div className="grid gap-3 md:grid-cols-2">
            {SITES.map(site => {
              const fichesSite = fiches.filter(f => f.sites.includes(site));
              const allEx = fichesSite.flatMap(f => f.exigences);
              const eval_done = allEx.filter(e => e.conformite).length;
              const conf = allEx.filter(e => e.conformite === "conforme").length;
              const tx = allEx.length ? Math.round((conf / Math.max(1, eval_done)) * 100) : 0;
              const txe = allEx.length ? Math.round((eval_done / allEx.length) * 100) : 0;
              return (
                <Card key={site}>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center gap-2"><Building2 className="h-4 w-4" /> {site}</CardTitle>
                    <CardDescription>{fichesSite.length} fiche(s) · {allEx.length} exigence(s)</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <div className="flex justify-between text-xs mb-1"><span>Conformité</span><span className="font-mono">{tx}%</span></div>
                      <Progress value={tx} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-xs mb-1"><span>Évaluation</span><span className="font-mono">{txe}%</span></div>
                      <Progress value={txe} className="h-2" />
                    </div>
                    <div className="flex gap-2 pt-1">
                      <StatusBadge status={tx >= 90 ? "conforme" : tx >= 70 ? "surveillance" : "critique"} />
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {/* ============= PARAM ============= */}
        <TabsContent value="param" className="mt-4">
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
            <ParamCard title="Types d'exigences" items={TYPES} icon={<Scale className="h-4 w-4 text-primary" />} />
            <ParamCard title="Sources" items={SOURCES} icon={<Newspaper className="h-4 w-4 text-primary" />} />
            <ParamCard title="Catégories" items={CATEGORIES} icon={<FileText className="h-4 w-4 text-primary" />} />
            <ParamCard title="Sites" items={SITES} icon={<Building2 className="h-4 w-4 text-primary" />} note="Affectations responsables d'évaluation" />
          </div>

          <Card className="mt-4">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2"><Users className="h-4 w-4" /> Responsables d'évaluation par site</CardTitle>
              <CardDescription>Un site peut avoir plusieurs responsables (décideurs)</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Site</TableHead>
                    <TableHead>Responsables</TableHead>
                    <TableHead className="w-[100px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {SITES.map(s => (
                    <TableRow key={s}>
                      <TableCell className="font-medium">{s}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {employees.slice(0, 2).map(e => (
                            <Badge key={e.id} variant="secondary" className="text-xs">{e.nom}</Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button size="sm" variant="ghost" className="h-7 gap-1"><Plus className="h-3 w-3" /> Affecter</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* ========= NOUVELLE FICHE ========= */}
      <Dialog open={openNew} onOpenChange={setOpenNew}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Nouvelle fiche d'évaluation de conformité</DialogTitle>
          </DialogHeader>
          <div className="grid gap-3 py-2">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-muted-foreground">Référence</label>
                <Input placeholder="ex: Loi 28-08" />
              </div>
              <div>
                <label className="text-xs text-muted-foreground">Document externe</label>
                <Input placeholder="ex: BO n°5680" />
              </div>
            </div>
            <div>
              <label className="text-xs text-muted-foreground">Titre</label>
              <Input placeholder="Intitulé de l'exigence" />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-xs text-muted-foreground">Type</label>
                <Select><SelectTrigger><SelectValue placeholder="Type" /></SelectTrigger>
                  <SelectContent>{TYPES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-xs text-muted-foreground">Source</label>
                <Select><SelectTrigger><SelectValue placeholder="Source" /></SelectTrigger>
                  <SelectContent>{SOURCES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-xs text-muted-foreground">Catégorie</label>
                <Select><SelectTrigger><SelectValue placeholder="Catégorie" /></SelectTrigger>
                  <SelectContent>{CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <label className="text-xs text-muted-foreground">Liste des exigences (une par ligne)</label>
              <Textarea rows={4} placeholder="Ex: Visite technique semestrielle&#10;Carnet de bord conducteur" />
            </div>
            <div className="rounded-md bg-primary/5 border border-primary/20 p-3 flex items-start gap-2">
              <Sparkles className="h-4 w-4 text-primary shrink-0 mt-0.5" />
              <div className="text-xs">
                <div className="font-medium text-primary">Suggestion IA</div>
                <div className="text-muted-foreground">L'IA peut extraire automatiquement les exigences depuis le document externe.</div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenNew(false)}>Annuler</Button>
            <Button onClick={() => { setOpenNew(false); toast.success("Fiche créée — alertes envoyées aux responsables"); }}>Créer la fiche</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
