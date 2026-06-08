import { useState } from "react";
import { PageHeader } from "@/components/qh/PageHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatusBadge } from "@/components/qh/StatusBadge";
import { FileText, IdCard, GitBranch, BookOpen, Activity, Archive, Sparkles, Search, FileCheck, Plus, Loader2, Send, Workflow, ExternalLink, Settings2, FolderArchive, Users, ArrowRight } from "lucide-react";
import api from "@/lib/api";
import { toast } from "sonner";
import { docsInternes, docsExternes, typesDoc, type DocStatus, docStatusLabel } from "@/lib/mock-data";

const processes = [
  { code: "MNG-01", name: "Management", pilote: "A. Benali", iso: "5", status: "conforme" as const },
  { code: "REA-01", name: "Réalisation Logistique", pilote: "M. Cherkaoui", iso: "8", status: "surveillance" as const },
  { code: "REA-02", name: "Achats & Fournisseurs", pilote: "S. El Idrissi", iso: "8.4", status: "conforme" as const },
  { code: "SUP-01", name: "Ressources Humaines", pilote: "K. Tazi", iso: "7.1", status: "conforme" as const },
  { code: "SUP-02", name: "Maintenance & Métrologie", pilote: "Y. Benjelloun", iso: "7.1.5", status: "critique" as const },
];

const cycleSteps: { id: DocStatus; label: string; actor: string }[] = [
  { id: "redaction", label: "Rédaction", actor: "Rédacteur" },
  { id: "verification", label: "Vérification", actor: "Vérificateur" },
  { id: "approbation", label: "Approbation", actor: "Approbateur" },
  { id: "diffusion", label: "Diffusion", actor: "Superviseur" },
  { id: "vigueur", label: "En vigueur", actor: "—" },
];

const docStatusToBadge = (s: DocStatus) => s === "vigueur" ? "conforme" : s === "perime" ? "critique" : "surveillance";

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { get, post } from "@/lib/api";

export default function Documentation() {
  const [selected, setSelected] = useState(processes[1]);
  const [chatQ, setChatQ] = useState("");
  const [chatA, setChatA] = useState("");
  const [busy, setBusy] = useState(false);
  const [openNew, setOpenNew] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    const formData = new FormData(e.currentTarget);
    const payload = Object.fromEntries(formData.entries());

    try {
      await post("/api/documentation", payload);
      toast.success("Document créé avec succès");
      setOpenNew(false);
      // fetch documents would go here if we were listing real ones
    } catch (error) {
      toast.error("Erreur lors de la création du document");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <PageHeader
        icon={<FileText className="h-5 w-5" />}
        title="Documentation (GED)"
        description="Database centrale du SMQ — Modèle des 5 Axes propulsé par l'IA"
        iso="7.5"
        actions={
          <>
            <Dialog open={openNew} onOpenChange={setOpenNew}>
              <DialogTrigger asChild>
                <Button size="sm"><Plus className="h-4 w-4 mr-1.5" /> Nouveau document</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Ajouter un document</DialogTitle>
                  <DialogDescription>Enregistrez un nouveau document dans la GED.</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleCreate}>
                  <div className="grid gap-3 py-4">
                    <div className="space-y-1">
                      <Label>Libellé du document</Label>
                      <Input name="libelle" placeholder="Ex: Procédure d'audit interne" required />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <Label>Type</Label>
                        <Select name="type" defaultValue="procedure">
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="manuel">Manuel</SelectItem>
                            <SelectItem value="procedure">Procédure</SelectItem>
                            <SelectItem value="instruction">Instruction</SelectItem>
                            <SelectItem value="enregistrement">Enregistrement</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-1">
                        <Label>Axe (1-5)</Label>
                        <Select name="axe_number" defaultValue="3">
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">Axe 1 - Identité</SelectItem>
                            <SelectItem value="2">Axe 2 - Cartographie</SelectItem>
                            <SelectItem value="3">Axe 3 - Procédures</SelectItem>
                            <SelectItem value="4">Axe 4 - KPI</SelectItem>
                            <SelectItem value="5">Axe 5 - Preuves</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <Label>Lien du fichier (Cloud/Local)</Label>
                      <Input name="fileUrl" placeholder="https://..." />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit" disabled={submitting}>
                      {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Enregistrer
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </>
        }
      />

      <Tabs defaultValue="5axes">
        <TabsList className="grid grid-cols-5 w-full max-w-3xl">
          <TabsTrigger value="5axes" className="gap-1.5"><BookOpen className="h-3.5 w-3.5" /> 5 Axes</TabsTrigger>
          <TabsTrigger value="internes" className="gap-1.5"><Workflow className="h-3.5 w-3.5" /> Internes</TabsTrigger>
          <TabsTrigger value="externes" className="gap-1.5"><ExternalLink className="h-3.5 w-3.5" /> Externes</TabsTrigger>
          <TabsTrigger value="enreg" className="gap-1.5"><FolderArchive className="h-3.5 w-3.5" /> Enregistrements</TabsTrigger>
          <TabsTrigger value="param" className="gap-1.5"><Settings2 className="h-3.5 w-3.5" /> Paramétrage</TabsTrigger>
        </TabsList>

        {/* === 5 AXES === */}
        <TabsContent value="5axes" className="mt-4">
          <div className="grid gap-4 lg:grid-cols-[280px_1fr]">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Processus</CardTitle>
                <div className="relative">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                  <Input className="h-8 pl-8 text-sm" placeholder="Rechercher…" />
                </div>
              </CardHeader>
              <CardContent className="space-y-1.5 px-2 pb-3">
                {processes.map(p => (
                  <button key={p.code} onClick={() => setSelected(p)}
                    className={`w-full text-left px-2.5 py-2 rounded-md transition-base border ${selected.code === p.code ? "bg-primary/8 border-primary/30" : "border-transparent hover:bg-muted/60"}`}>
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-mono text-[10px] text-muted-foreground">{p.code}</span>
                      <StatusBadge status={p.status} label={p.status === "conforme" ? "OK" : p.status === "surveillance" ? "!" : "✕"} />
                    </div>
                    <div className="text-sm font-medium mt-0.5">{p.name}</div>
                    <div className="text-[11px] text-muted-foreground">{p.pilote}</div>
                  </button>
                ))}
              </CardContent>
            </Card>

            <div className="min-w-0">
              <Card className="mb-4">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs bg-muted px-1.5 py-0.5 rounded">{selected.code}</span>
                        <span className="text-[11px] font-mono text-muted-foreground">ISO {selected.iso}</span>
                      </div>
                      <CardTitle className="mt-1">{selected.name}</CardTitle>
                      <CardDescription>Pilote · {selected.pilote}</CardDescription>
                    </div>
                    <StatusBadge status={selected.status} />
                  </div>
                </CardHeader>
              </Card>

              <Tabs defaultValue="axe1">
                <TabsList className="grid grid-cols-5 w-full">
                  <TabsTrigger value="axe1" className="gap-1.5"><IdCard className="h-3.5 w-3.5" /><span className="hidden sm:inline">Identité</span></TabsTrigger>
                  <TabsTrigger value="axe2" className="gap-1.5"><GitBranch className="h-3.5 w-3.5" /><span className="hidden sm:inline">Cartographie</span></TabsTrigger>
                  <TabsTrigger value="axe3" className="gap-1.5"><BookOpen className="h-3.5 w-3.5" /><span className="hidden sm:inline">Procédures</span></TabsTrigger>
                  <TabsTrigger value="axe4" className="gap-1.5"><Activity className="h-3.5 w-3.5" /><span className="hidden sm:inline">KPI</span></TabsTrigger>
                  <TabsTrigger value="axe5" className="gap-1.5"><Archive className="h-3.5 w-3.5" /><span className="hidden sm:inline">Preuves</span></TabsTrigger>
                </TabsList>

                <TabsContent value="axe1" className="mt-4 space-y-4">
                  <Card><CardHeader><CardTitle className="text-base">Axe 1 — Fiche d'Identité & Gouvernance</CardTitle></CardHeader>
                    <CardContent className="grid gap-4 md:grid-cols-2 text-sm">
                      {[["Code", selected.code], ["Nom", selected.name], ["Pilote (RACI: A)", selected.pilote], ["Domaine d'application", "Sites Casablanca, Tanger Med, Marrakech"], ["Éléments d'entrée", "Commandes clients, planning flotte, contrats fournisseurs"], ["Éléments de sortie", "Bons de livraison, certificats, indicateurs"], ["Ressources", "12 ETP · 47 véhicules · 3 entrepôts"], ["Documents rattachés", "8 procédures · 14 instructions · 23 enregistrements"]].map(([k, v]) => (
                        <div key={k} className="border-b border-border pb-2"><div className="text-[11px] uppercase tracking-wider text-muted-foreground">{k}</div><div className="font-medium mt-0.5">{v}</div></div>
                      ))}
                    </CardContent></Card>
                </TabsContent>

                <TabsContent value="axe2" className="mt-4">
                  <Card><CardHeader><CardTitle className="text-base">Axe 2 — Cartographie du Processus</CardTitle><CardDescription>Workflow interactif — chaque étape est cliquable</CardDescription></CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-2 overflow-x-auto pb-3">
                        {["Réception commande", "Préparation", "Contrôle Qualité", "Expédition", "Livraison"].map((s, i, arr) => (
                          <div key={s} className="flex items-center gap-2 shrink-0">
                            <div className={`px-4 py-3 rounded-lg border-2 text-sm font-medium ${i === 2 ? "bg-warning/10 border-warning text-warning-foreground" : "bg-card border-primary/30"}`}>
                              <div className="font-semibold">{s}</div><div className="text-[11px] text-muted-foreground mt-0.5">Étape {i + 1}</div>
                            </div>
                            {i < arr.length - 1 && <div className="text-muted-foreground">→</div>}
                          </div>
                        ))}
                      </div>
                    </CardContent></Card>
                </TabsContent>

                <TabsContent value="axe3" className="mt-4 space-y-3">
                  <Card><CardHeader><CardTitle className="text-base">Procédures & Instructions</CardTitle></CardHeader>
                    <CardContent className="space-y-2">
                      {docsInternes.filter(d => d.status === "vigueur").map(d => (
                        <div key={d.code} className="flex items-center gap-3 p-3 rounded-lg border hover:border-primary/40 hover:bg-muted/40 transition-base">
                          <FileCheck className="h-5 w-5 text-primary shrink-0" />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-mono text-[10px] bg-muted px-1.5 py-0.5 rounded">{d.code}</span>
                              <span className="text-[11px] text-muted-foreground">{d.version} · {d.dateMaj}</span>
                              <span className="text-[11px] text-muted-foreground">Sup: {d.superviseur}</span>
                            </div>
                            <div className="font-medium text-sm mt-0.5">{d.libelle}</div>
                          </div>
                          <StatusBadge status="conforme" />
                        </div>
                      ))}
                    </CardContent></Card>
                </TabsContent>

                <TabsContent value="axe4" className="mt-4">
                  <Card><CardHeader><CardTitle className="text-base">Axe 4 — Pilotage & KPI</CardTitle></CardHeader>
                    <CardContent className="grid gap-3 md:grid-cols-3">
                      {[{ n: "Délai moyen", v: "2.4 j", cible: "≤ 3 j", s: "conforme" as const }, { n: "Taux d'erreur", v: "1.8%", cible: "≤ 2%", s: "surveillance" as const }, { n: "Satisfaction", v: "4.3/5", cible: "≥ 4", s: "conforme" as const }].map(k => (
                        <div key={k.n} className="p-4 rounded-lg border">
                          <div className="text-xs uppercase tracking-wider text-muted-foreground">{k.n}</div>
                          <div className="text-2xl font-bold mt-1">{k.v}</div>
                          <div className="flex items-center justify-between mt-2"><span className="text-xs text-muted-foreground">Cible: {k.cible}</span><StatusBadge status={k.s} /></div>
                        </div>
                      ))}
                    </CardContent></Card>
                </TabsContent>

                <TabsContent value="axe5" className="mt-4">
                  <Card><CardHeader><CardTitle className="text-base">Axe 5 — Enregistrements & Preuves</CardTitle><CardDescription>Archivage des preuves de conformité</CardDescription></CardHeader>
                    <CardContent>
                      <Textarea placeholder="Décrivez le contenu d'un enregistrement…" rows={4} />
                      <Button className="mt-3" size="sm">Classer l'enregistrement</Button>
                    </CardContent></Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </TabsContent>

        {/* === DOCUMENTS INTERNES — Cycle de vie === */}
        <TabsContent value="internes" className="mt-4 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Cycle de vie : superviseur → rédacteur → vérificateur → approbateur → diffusion</CardTitle>
              <CardDescription>Chaque étape génère une alerte dans l'agenda du destinataire (boîte de dialogue intégrée).</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 overflow-x-auto pb-2">
                {cycleSteps.map((s, i, arr) => (
                  <div key={s.id} className="flex items-center gap-2 shrink-0">
                    <div className="px-3 py-2 rounded-lg border bg-card text-center min-w-[110px]">
                      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{s.actor}</div>
                      <div className="font-semibold text-sm">{s.label}</div>
                    </div>
                    {i < arr.length - 1 && <ArrowRight className="h-4 w-4 text-muted-foreground" />}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3"><CardTitle className="text-base">Documents internes ({docsInternes.length})</CardTitle></CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader><TableRow><TableHead>Code</TableHead><TableHead>Libellé</TableHead><TableHead>Type</TableHead><TableHead>V.</TableHead><TableHead>Étape</TableHead><TableHead>Acteur en attente</TableHead><TableHead>MAJ</TableHead></TableRow></TableHeader>
                <TableBody>
                  {docsInternes.map(d => {
                    const acteur = d.status === "redaction" ? d.redacteur : d.status === "verification" ? d.verificateur : d.status === "approbation" ? d.approbateur : d.status === "diffusion" ? d.superviseur : "—";
                    return (
                      <TableRow key={d.code}>
                        <TableCell className="font-mono text-xs">{d.code}</TableCell>
                        <TableCell><div className="font-medium">{d.libelle}</div><div className="text-xs text-muted-foreground">{d.site} · {d.activite}</div></TableCell>
                        <TableCell>{d.type}</TableCell>
                        <TableCell className="font-mono text-xs">{d.version}</TableCell>
                        <TableCell><StatusBadge status={docStatusToBadge(d.status) as any} label={docStatusLabel[d.status]} /></TableCell>
                        <TableCell className="text-sm">{acteur}</TableCell>
                        <TableCell className="text-xs text-muted-foreground">{d.dateMaj}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card className="border-primary/20 bg-primary/5">
            <CardHeader className="pb-3"><CardTitle className="text-sm flex items-center gap-2"><Sparkles className="h-4 w-4 text-primary" />Boîte de dialogue Rédacteur ↔ Superviseur</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="p-2 rounded bg-card border"><Badge variant="outline" className="text-[10px] mr-2">Rédacteur</Badge> Je vous transmets la mise à jour de PRO-LOG-01 — section douane revue.</div>
                <div className="p-2 rounded bg-card border"><Badge variant="secondary" className="text-[10px] mr-2">Superviseur</Badge> OK, je crée le document et je lance le circuit de validation.</div>
              </div>
              <Button size="sm" className="mt-3"><Send className="h-3.5 w-3.5 mr-1.5" />Nouveau message</Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* === DOCUMENTS EXTERNES === */}
        <TabsContent value="externes" className="mt-4 space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Documents externes</CardTitle>
                <DialogTrigger asChild>
                  <Button size="sm"><Plus className="h-4 w-4 mr-1.5" />Ajouter</Button>
                </DialogTrigger>
              </div>
              <CardDescription>Origine, lieu de classement, exigences applicables, déclinaison dans le SMQ</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader><TableRow><TableHead>Code</TableHead><TableHead>Libellé</TableHead><TableHead>Origine</TableHead><TableHead>Lieu</TableHead><TableHead>Format</TableHead><TableHead>Date</TableHead></TableRow></TableHeader>
                <TableBody>
                  {docsExternes.map(d => (
                    <TableRow key={d.code}>
                      <TableCell className="font-mono text-xs">{d.code}</TableCell>
                      <TableCell className="font-medium">{d.libelle}</TableCell>
                      <TableCell><Badge variant="outline" className="text-[10px]">{d.origine}</Badge></TableCell>
                      <TableCell className="text-sm">{d.lieu}</TableCell>
                      <TableCell><Badge variant="secondary" className="text-[10px]">{d.type}</Badge></TableCell>
                      <TableCell className="text-xs text-muted-foreground">{d.date}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* === ENREGISTREMENTS === */}
        <TabsContent value="enreg" className="mt-4 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Enregistrements & dossiers</CardTitle>
              <CardDescription>Classement, archivage, durée de conservation — recherche full-text par mots-clés</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex gap-2">
                <Input placeholder="Recherche full-text (réf., mots-clés, type…)" />
                <Button><Search className="h-4 w-4 mr-1.5" />Rechercher</Button>
              </div>
              <div className="grid gap-2 md:grid-cols-2">
                {[
                  { ref: "ENR-2026-0142", type: "Devis fournisseur", dossier: "Achats 2026", date: "2026-04-03" },
                  { ref: "ENR-2026-0188", type: "Contrat client", dossier: "Commercial OCP", date: "2026-04-15" },
                  { ref: "ENR-2026-0211", type: "Bon de livraison signé", dossier: "Logistique TM", date: "2026-04-22" },
                  { ref: "ENR-2026-0234", type: "PV de réunion qualité", dossier: "Direction Qualité", date: "2026-04-28" },
                ].map(e => (
                  <div key={e.ref} className="border rounded-lg p-3 hover:border-primary/40 transition-base">
                    <div className="flex items-center justify-between"><span className="font-mono text-[10px] bg-muted px-1.5 py-0.5 rounded">{e.ref}</span><span className="text-[11px] text-muted-foreground">{e.date}</span></div>
                    <div className="font-medium text-sm mt-1">{e.type}</div>
                    <div className="text-xs text-muted-foreground">Dossier: {e.dossier}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* === PARAMÉTRAGE === */}
        <TabsContent value="param" className="mt-4">
          <div className="grid gap-4 md:grid-cols-2">
            <ParamCard title="Types de documents internes" items={typesDoc.map(t => `${t.name} (Sup: ${t.superviseur})`)} />
            <ParamCard title="Origines documents externes" items={["État", "Clients", "Fournisseurs", "ISO", "Cabinets de formation"]} />
            <ParamCard title="Lieux de classement" items={["Bureau RMQ", "Bureau Direction", "Bureau technique", "Bureau Commercial", "Archives centrales"]} />
            <ParamCard title="Types d'enregistrements" items={["Devis fournisseur (3 ans)", "Contrat client (10 ans)", "Bon de livraison (5 ans)", "PV de réunion (5 ans)"]} />
            <ParamCard title="Dossiers" items={["Achats 2026", "Commercial OCP", "Logistique TM", "Direction Qualité"]} />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function ParamCard({ title, items }: { title: string; items: string[] }) {
  return (
    <Card><CardHeader className="pb-3"><div className="flex items-center justify-between"><CardTitle className="text-sm">{title}</CardTitle><Button size="sm" variant="ghost" className="h-7 px-2"><Plus className="h-3.5 w-3.5" /></Button></div></CardHeader>
      <CardContent><ul className="space-y-1 text-sm">{items.map(i => <li key={i} className="px-2 py-1 rounded hover:bg-muted/50">• {i}</li>)}</ul></CardContent></Card>
  );
}
