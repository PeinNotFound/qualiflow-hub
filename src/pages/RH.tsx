import { useState, useMemo } from "react";
import { PageHeader } from "@/components/qh/PageHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { StatusBadge } from "@/components/qh/StatusBadge";
import { UserCog, Plus, Search, Sparkles, GraduationCap, Users, Building2, Settings2, Award, BookOpen, CheckCircle2, Clock, AlertTriangle, Calendar as CalIcon, Star } from "lucide-react";
import {
  employees as initialEmployees, fonctions, typesQualif, qualifications, sites, directions, metiers, groupes,
  formations as initialFormations, organismesFormation, typesFormation, typesTheme, themes, criteresEval,
  type Employee, type FormationStatut,
} from "@/lib/mock-data";
import { toast } from "sonner";

const statutFormationLabel: Record<FormationStatut, { label: string; status: "info" | "conforme" | "surveillance" | "critique" }> = {
  demande: { label: "Demande", status: "info" },
  validation: { label: "En validation", status: "surveillance" },
  planifiee: { label: "Planifiée", status: "info" },
  realisee: { label: "Réalisée", status: "conforme" },
  evaluee: { label: "Évaluée", status: "conforme" },
  refusee: { label: "Refusée", status: "critique" },
};

export default function RH() {
  const [employees, setEmployees] = useState<Employee[]>(initialEmployees);
  const [search, setSearch] = useState("");
  const [siteFilter, setSiteFilter] = useState<string>("all");
  const [openEmp, setOpenEmp] = useState(false);
  const [formations, setFormations] = useState(initialFormations);
  const [openFrm, setOpenFrm] = useState(false);

  const filtered = useMemo(() => employees.filter(e =>
    (siteFilter === "all" || e.site === siteFilter) &&
    (e.fullName.toLowerCase().includes(search.toLowerCase()) || e.matricule.toLowerCase().includes(search.toLowerCase()))
  ), [employees, search, siteFilter]);

  const expirations = useMemo(() => {
    const today = new Date();
    return employees.flatMap(e => e.qualifications.filter(q => q.expiresAt).map(q => {
      const days = Math.round((new Date(q.expiresAt!).getTime() - today.getTime()) / 86400000);
      return { emp: e.fullName, qual: q.name, days, expiresAt: q.expiresAt! };
    })).filter(x => x.days < 365).sort((a, b) => a.days - b.days);
  }, [employees]);

  const addEmployee = (data: Partial<Employee>) => {
    const id = `e-${String(employees.length + 1).padStart(3, "0")}`;
    setEmployees([...employees, {
      id, matricule: data.matricule || `MSL-${String(1000 + employees.length + 1)}`,
      fullName: data.fullName || "", email: data.email || "",
      fonction: data.fonction || fonctions[0].name, direction: data.direction || directions[0],
      site: data.site || sites[0], metier: data.metier || metiers[0], groupe: data.groupe || groupes[0],
      isAuditor: !!data.isAuditor, isSupervisor: !!data.isSupervisor,
      diffusion: data.diffusion || "electronique", status: "actif", qualifications: [],
    }]);
    toast.success("Employé ajouté — fiche disponible en mode brouillon");
    setOpenEmp(false);
  };

  return (
    <div>
      <PageHeader
        icon={<UserCog className="h-5 w-5" />}
        title="Ressources Humaines"
        description="Compétences, formation, habilitations dynamiques (ISO 7.1.2)"
        iso="7.1.2"
        actions={<Button size="sm" onClick={() => {}}><Plus className="h-4 w-4 mr-1.5" />Nouvel employé</Button>}
      />

      <Tabs defaultValue="employes">
        <TabsList className="grid grid-cols-4 w-full max-w-3xl">
          <TabsTrigger value="employes" className="gap-1.5"><Users className="h-3.5 w-3.5" /> Employés</TabsTrigger>
          <TabsTrigger value="formation" className="gap-1.5"><GraduationCap className="h-3.5 w-3.5" /> Formation</TabsTrigger>
          <TabsTrigger value="habilitations" className="gap-1.5"><Award className="h-3.5 w-3.5" /> Habilitations</TabsTrigger>
          <TabsTrigger value="parametrage" className="gap-1.5"><Settings2 className="h-3.5 w-3.5" /> Paramétrage</TabsTrigger>
        </TabsList>

        {/* === EMPLOYÉS === */}
        <TabsContent value="employes" className="mt-4 space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex flex-wrap items-center gap-3 justify-between">
                <CardTitle className="text-base">Annuaire des employés ({filtered.length})</CardTitle>
                <div className="flex gap-2">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                    <Input className="h-9 pl-8 w-56" placeholder="Nom, matricule…" value={search} onChange={e => setSearch(e.target.value)} />
                  </div>
                  <Select value={siteFilter} onValueChange={setSiteFilter}>
                    <SelectTrigger className="h-9 w-44"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous les sites</SelectItem>
                      {sites.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <Dialog open={openEmp} onOpenChange={setOpenEmp}>
                    <DialogTrigger asChild><Button size="sm"><Plus className="h-4 w-4 mr-1.5" />Nouvel employé</Button></DialogTrigger>
                    <EmployeeDialog onSubmit={addEmployee} />
                  </Dialog>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Matricule</TableHead>
                    <TableHead>Nom</TableHead>
                    <TableHead>Fonction</TableHead>
                    <TableHead>Site</TableHead>
                    <TableHead>Habilitations</TableHead>
                    <TableHead>Rôles</TableHead>
                    <TableHead>Statut</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map(e => {
                    const expiring = e.qualifications.find(q => q.expiresAt && (new Date(q.expiresAt).getTime() - Date.now()) / 86400000 < 90);
                    return (
                      <TableRow key={e.id}>
                        <TableCell className="font-mono text-xs">{e.matricule}</TableCell>
                        <TableCell><div className="font-medium">{e.fullName}</div><div className="text-xs text-muted-foreground">{e.email}</div></TableCell>
                        <TableCell>{e.fonction}</TableCell>
                        <TableCell>{e.site}</TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {e.qualifications.map(q => <Badge key={q.name} variant="outline" className="text-[10px]">{q.name} L{q.level}</Badge>)}
                            {expiring && <Badge className="bg-warning/15 text-warning-foreground border-warning/30 text-[10px]">⚠ expire bientôt</Badge>}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            {e.isSupervisor && <Badge variant="secondary" className="text-[10px]">Superviseur</Badge>}
                            {e.isAuditor && <Badge variant="secondary" className="text-[10px]">Auditeur</Badge>}
                          </div>
                        </TableCell>
                        <TableCell><StatusBadge status={e.status === "actif" ? "conforme" : "info"} label={e.status} /></TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* === FORMATION === */}
        <TabsContent value="formation" className="mt-4 space-y-4">
          <div className="grid gap-3 md:grid-cols-4">
            <KPI title="Demandes en cours" value={formations.filter(f => f.statut === "demande" || f.statut === "validation").length} icon={<Clock className="h-4 w-4" />} />
            <KPI title="Planifiées" value={formations.filter(f => f.statut === "planifiee").length} icon={<CalIcon className="h-4 w-4" />} />
            <KPI title="Réalisées (2026)" value={formations.filter(f => f.statut === "realisee" || f.statut === "evaluee").length} icon={<CheckCircle2 className="h-4 w-4" />} />
            <KPI title="Budget consommé" value={`${formations.reduce((s, f) => s + (f.statut !== "demande" && f.statut !== "refusee" ? f.cout : 0), 0).toLocaleString()} MAD`} icon={<Award className="h-4 w-4" />} />
          </div>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base">Cycle complet — demande → validation → planning → réalisation → évaluation</CardTitle>
                  <CardDescription>Workflow conforme au guide Qualipro (chaud + froid)</CardDescription>
                </div>
                <Dialog open={openFrm} onOpenChange={setOpenFrm}>
                  <DialogTrigger asChild><Button size="sm"><Plus className="h-4 w-4 mr-1.5" />Nouvelle demande</Button></DialogTrigger>
                  <FormationDialog onSubmit={() => { toast.success("Demande envoyée — alerte adressée aux validateurs"); setOpenFrm(false); }} />
                </Dialog>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {formations.map(f => {
                const s = statutFormationLabel[f.statut];
                return (
                  <div key={f.id} className="border rounded-lg p-4 hover:border-primary/40 transition-base">
                    <div className="flex items-start justify-between gap-3 flex-wrap">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-mono text-[10px] bg-muted px-1.5 py-0.5 rounded">{f.reference}</span>
                          <StatusBadge status={s.status} label={s.label} />
                          <Badge variant="outline" className="text-[10px]">{f.type}</Badge>
                        </div>
                        <div className="font-semibold mt-1">{f.theme}</div>
                        <div className="text-xs text-muted-foreground mt-0.5">
                          {f.organisme} · {f.dateDebut} → {f.dateFin} · {f.cout.toLocaleString()} MAD · {f.participants.length} participant(s)
                        </div>
                      </div>
                      <div className="text-right text-xs">
                        <div className="text-muted-foreground">Demandeur</div>
                        <div className="font-medium">{f.demandeur}</div>
                      </div>
                    </div>

                    {/* Workflow */}
                    <div className="mt-3 flex items-center gap-1.5 overflow-x-auto pb-1">
                      {["demande", "validation", "planifiee", "realisee", "evaluee"].map((step, i, arr) => {
                        const order = ["demande", "validation", "planifiee", "realisee", "evaluee"].indexOf(f.statut);
                        const active = i <= order;
                        return (
                          <div key={step} className="flex items-center gap-1.5 shrink-0">
                            <div className={`px-2.5 py-1 rounded text-[11px] font-medium ${active ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                              {statutFormationLabel[step as FormationStatut].label}
                            </div>
                            {i < arr.length - 1 && <span className="text-muted-foreground text-xs">→</span>}
                          </div>
                        );
                      })}
                    </div>

                    {/* Validateurs */}
                    {f.validateurs.length > 0 && (
                      <div className="mt-3 text-xs">
                        <div className="text-muted-foreground mb-1">Circuit de validation</div>
                        <div className="flex gap-2 flex-wrap">
                          {f.validateurs.map(v => (
                            <Badge key={v.name} variant={v.valide ? "default" : "outline"} className="text-[10px]">
                              {v.ordre}. {v.name} {v.valide ? "✓" : "…"}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Évaluations */}
                    {f.statut === "realisee" || f.statut === "evaluee" ? (
                      <div className="mt-3 grid gap-2 md:grid-cols-2">
                        {f.participants.map(p => (
                          <div key={p.name} className="text-xs p-2 rounded bg-muted/40 border border-border">
                            <div className="font-medium">{p.name}</div>
                            <div className="flex items-center gap-3 mt-1">
                              <span className="flex items-center gap-1"><Star className="h-3 w-3 text-warning" /> Chaud: {p.noteChaud ?? "—"}/5</span>
                              <span>Froid: {p.efficaciteFroid != null ? `${p.efficaciteFroid}%` : "à évaluer"}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </TabsContent>

        {/* === HABILITATIONS === */}
        <TabsContent value="habilitations" className="mt-4 space-y-4">
          <Card className="border-warning/30 bg-warning/5">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2"><AlertTriangle className="h-4 w-4 text-warning" /> Alertes d'expiration ({expirations.length})</CardTitle>
              <CardDescription>Alertes de renouvellement des habilitations périodiques</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {expirations.map(x => (
                <div key={`${x.emp}-${x.qual}`} className="flex items-center justify-between p-2.5 rounded border bg-card">
                  <div>
                    <div className="font-medium text-sm">{x.emp}</div>
                    <div className="text-xs text-muted-foreground">{x.qual}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-muted-foreground">{x.expiresAt}</div>
                    <StatusBadge status={x.days < 30 ? "critique" : x.days < 180 ? "surveillance" : "info"} label={x.days < 0 ? "Expiré" : `${x.days} j restants`} />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-base">Matrice de polyvalence — Site Tanger Med</CardTitle></CardHeader>
            <CardContent className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employé</TableHead>
                    {qualifications.slice(0, 5).map(q => <TableHead key={q.id} className="text-xs">{q.name}</TableHead>)}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {employees.filter(e => e.site === "Tanger Med" || e.site === "Casablanca HQ").slice(0, 5).map(e => (
                    <TableRow key={e.id}>
                      <TableCell className="font-medium">{e.fullName}</TableCell>
                      {qualifications.slice(0, 5).map(q => {
                        const found = e.qualifications.find(eq => eq.name === q.name);
                        return (
                          <TableCell key={q.id}>
                            {found ? (
                              <div className="flex items-center gap-1">
                                <div className="h-1.5 w-12 bg-muted rounded-full overflow-hidden"><div className="h-full bg-primary" style={{ width: `${(found.level / 5) * 100}%` }} /></div>
                                <span className="text-[10px]">L{found.level}</span>
                              </div>
                            ) : <span className="text-muted-foreground text-xs">—</span>}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* === PARAMÉTRAGE === */}
        <TabsContent value="parametrage" className="mt-4">
          <div className="grid gap-4 md:grid-cols-2">
            <ParamCard title="Fonctions" icon={<Building2 className="h-4 w-4" />} items={fonctions.map(f => `${f.code} — ${f.name}`)} />
            <ParamCard title="Types de qualifications" icon={<Award className="h-4 w-4" />} items={typesQualif.map(t => t.name)} />
            <ParamCard title="Qualifications" icon={<BookOpen className="h-4 w-4" />} items={qualifications.map(q => `${q.name}${q.periodique ? ` (périodique ${q.periode})` : ""}`)} />
            <ParamCard title="Sites" icon={<Building2 className="h-4 w-4" />} items={sites} />
            <ParamCard title="Directions" icon={<Building2 className="h-4 w-4" />} items={directions} />
            <ParamCard title="Métiers" icon={<UserCog className="h-4 w-4" />} items={metiers} />
            <ParamCard title="Groupes de travail" icon={<Users className="h-4 w-4" />} items={groupes} />
            <ParamCard title="Profils des fonctions" icon={<Settings2 className="h-4 w-4" />} items={fonctions.slice(0, 4).map(f => `${f.name} → ${qualifications.slice(0, 2).map(q => q.name).join(" + ")}`)} />
            <ParamCard title="Organismes de formation" icon={<GraduationCap className="h-4 w-4" />} items={organismesFormation} />
            <ParamCard title="Types de formation" icon={<BookOpen className="h-4 w-4" />} items={typesFormation} />
            <ParamCard title="Types de thèmes" icon={<BookOpen className="h-4 w-4" />} items={typesTheme} />
            <ParamCard title="Thèmes" icon={<BookOpen className="h-4 w-4" />} items={themes.map(t => `${t.name} (${t.typeTheme})`)} />
            <ParamCard title="Critères d'évaluation à chaud" icon={<Star className="h-4 w-4" />} items={criteresEval.map(c => `${c.name} — coef. ${c.coef}`)} extra={<div className="text-xs text-muted-foreground mt-2">Σ coefficients = {criteresEval.reduce((s, c) => s + c.coef, 0)}/100</div>} />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function KPI({ title, value, icon }: { title: string; value: string | number; icon: React.ReactNode }) {
  return (
    <Card>
      <CardContent className="pt-5">
        <div className="flex items-center justify-between">
          <div className="text-xs uppercase tracking-wider text-muted-foreground">{title}</div>
          <div className="text-muted-foreground">{icon}</div>
        </div>
        <div className="text-2xl font-bold mt-1">{value}</div>
      </CardContent>
    </Card>
  );
}

function ParamCard({ title, icon, items, extra }: { title: string; icon: React.ReactNode; items: string[]; extra?: React.ReactNode }) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2">{icon}{title}</CardTitle>
          <Button size="sm" variant="ghost" className="h-7 px-2"><Plus className="h-3.5 w-3.5" /></Button>
        </div>
      </CardHeader>
      <CardContent>
        <ul className="space-y-1 text-sm">
          {items.map(i => <li key={i} className="px-2 py-1 rounded hover:bg-muted/50">• {i}</li>)}
        </ul>
        {extra}
      </CardContent>
    </Card>
  );
}

function EmployeeDialog({ onSubmit }: { onSubmit: (d: Partial<Employee>) => void }) {
  const [data, setData] = useState<Partial<Employee>>({});
  return (
    <DialogContent className="max-w-2xl">
      <DialogHeader>
        <DialogTitle>Nouvelle fiche employé</DialogTitle>
        <DialogDescription>Remplissez les informations de la fiche employé.</DialogDescription>
      </DialogHeader>
      <div className="grid gap-3 md:grid-cols-2">
        <div><Label>Matricule</Label><Input onChange={e => setData({ ...data, matricule: e.target.value })} placeholder="MSL-XXXX" /></div>
        <div><Label>Nom complet</Label><Input onChange={e => setData({ ...data, fullName: e.target.value })} /></div>
        <div className="md:col-span-2"><Label>Email</Label><Input onChange={e => setData({ ...data, email: e.target.value })} /></div>
        <div><Label>Fonction</Label>
          <Select onValueChange={v => setData({ ...data, fonction: v })}><SelectTrigger><SelectValue placeholder="Choisir…" /></SelectTrigger>
            <SelectContent>{fonctions.map(f => <SelectItem key={f.code} value={f.name}>{f.name}</SelectItem>)}</SelectContent>
          </Select>
        </div>
        <div><Label>Site</Label>
          <Select onValueChange={v => setData({ ...data, site: v })}><SelectTrigger><SelectValue placeholder="Choisir…" /></SelectTrigger>
            <SelectContent>{sites.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
          </Select>
        </div>
        <div><Label>Direction</Label>
          <Select onValueChange={v => setData({ ...data, direction: v })}><SelectTrigger><SelectValue placeholder="Choisir…" /></SelectTrigger>
            <SelectContent>{directions.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent>
          </Select>
        </div>
        <div><Label>Diffusion docs</Label>
          <Select onValueChange={v => setData({ ...data, diffusion: v as any })}><SelectTrigger><SelectValue placeholder="Électronique" /></SelectTrigger>
            <SelectContent><SelectItem value="electronique">Électronique</SelectItem><SelectItem value="papier">Papier</SelectItem></SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-4 md:col-span-2 mt-2">
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" onChange={e => setData({ ...data, isSupervisor: e.target.checked })} /> Superviseur de documents</label>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" onChange={e => setData({ ...data, isAuditor: e.target.checked })} /> Auditeur interne</label>
        </div>
      </div>
      <DialogFooter><Button onClick={() => onSubmit(data)}>Valider la fiche</Button></DialogFooter>
    </DialogContent>
  );
}

function FormationDialog({ onSubmit }: { onSubmit: () => void }) {
  return (
    <DialogContent className="max-w-2xl">
      <DialogHeader>
        <DialogTitle>Nouvelle demande de formation</DialogTitle>
        <DialogDescription>La demande sera envoyée aux responsables de validation du site.</DialogDescription>
      </DialogHeader>
      <div className="grid gap-3 md:grid-cols-2">
        <div className="md:col-span-2"><Label>Thème</Label>
          <Select><SelectTrigger><SelectValue placeholder="Choisir un thème…" /></SelectTrigger>
            <SelectContent>{themes.map(t => <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>)}</SelectContent>
          </Select>
        </div>
        <div><Label>Type</Label>
          <Select><SelectTrigger><SelectValue placeholder="Inter / Intra…" /></SelectTrigger>
            <SelectContent>{typesFormation.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
          </Select>
        </div>
        <div><Label>Organisme</Label>
          <Select><SelectTrigger><SelectValue placeholder="Choisir…" /></SelectTrigger>
            <SelectContent>{organismesFormation.map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent>
          </Select>
        </div>
        <div><Label>Date début</Label><Input type="date" /></div>
        <div><Label>Date fin</Label><Input type="date" /></div>
        <div className="md:col-span-2"><Label>Justification</Label><Textarea rows={3} placeholder="Pourquoi cette formation est-elle nécessaire ?" /></div>
      </div>
      <DialogFooter><Button onClick={onSubmit}>Envoyer la demande</Button></DialogFooter>
    </DialogContent>
  );
}
