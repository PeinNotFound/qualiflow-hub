import { useState, useMemo, useEffect } from "react";
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
import { StatusBadge } from "@/components/qh/StatusBadge";
import { ParamCard, KPICard } from "@/components/qh/ParamCard";
import {
  Target, Plus, Sparkles, Filter, ArrowRight, Clock, User, Link2, Settings2, FileStack,
  CheckCircle2, XCircle, Copy, Send, Workflow, Tag, AlertTriangle, ChevronRight, Loader2
} from "lucide-react";
import {
  actions as initialActions, type ActionRecord, type SousAction, actionStatutMap,
  typesAction, sourcesAction, typesCause, gravitesAction, prioritesAction, themesAction, modelesAction,
} from "@/lib/mock-data-extended";
import { directions, metiers, sites, employees } from "@/lib/mock-data";
import { get, post } from "@/lib/api";
import { toast } from "sonner";

export default function Actions() {
  const [actions, setActions] = useState<ActionRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<ActionRecord | null>(null);
  const [filter, setFilter] = useState<"all" | "urgent" | "encours" | "validation">("all");
  const [openNew, setOpenNew] = useState(false);

  useEffect(() => {
    fetchActions();
  }, []);

  const fetchActions = async () => {
    try {
      const data: any = await get("/api/actions");
      setActions(data.data);
      if (data.data.length > 0 && !selected) {
        setSelected(data.data[0]);
      }
    } catch (error) {
      console.error("Failed to fetch actions", error);
      toast.error("Erreur lors du chargement des actions");
      setActions(initialActions);
    } finally {
      setLoading(false);
    }
  };

  const filtered = useMemo(() => {
    if (filter === "encours") return actions.filter(a => a.statut === "enCours" || a.statut === "validee");
    if (filter === "validation") return actions.filter(a => a.statut === "enAttente");
    return actions;
  }, [actions, filter]);

  const stats = useMemo(() => ({
    total: actions.length,
    encours: actions.filter(a => a.statut === "enCours").length,
    validation: actions.filter(a => a.statut === "enAttente").length,
    cloturees: actions.filter(a => a.statut === "cloturee").length,
    efficaciteMoy: Math.round(actions.flatMap(a => a.sousActions || []).filter(s => s.tauxEfficacite > 0).reduce((s, x) => s + x.tauxEfficacite, 0) / Math.max(1, actions.flatMap(a => a.sousActions || []).filter(s => s.tauxEfficacite > 0).length)),
  }), [actions]);

  return (
    <div>
      <PageHeader
        icon={<Target className="h-5 w-5" />}
        title="Plan d'Action"
        description="Hub central — système nerveux du SMQ. Centralise toutes les actions correctives, préventives et d'amélioration."
        iso="10.2"
        actions={<>
          <Dialog open={openNew} onOpenChange={setOpenNew}>
            <DialogTrigger asChild><Button size="sm"><Plus className="h-4 w-4 mr-1.5" />Nouvelle action</Button></DialogTrigger>
            <NewActionDialog onSuccess={() => { setOpenNew(false); fetchActions(); }} />
          </Dialog>
        </>}
      />

      <div className="grid gap-3 md:grid-cols-5 mb-4">
        <KPICard title="Total actions" value={stats.total} />
        <KPICard title="En cours" value={stats.encours} hint="Réalisation en cours" />
        <KPICard title="En validation" value={stats.validation} hint="Demandes à valider" />
        <KPICard title="Clôturées" value={stats.cloturees} />
        <KPICard title="Efficacité moy." value={`${stats.efficaciteMoy}%`} hint="Sur sous-actions évaluées" />
      </div>

      <Tabs defaultValue="actions">
        <TabsList className="grid grid-cols-4 w-full max-w-2xl">
          <TabsTrigger value="actions" className="gap-1.5"><Target className="h-3.5 w-3.5" />Actions</TabsTrigger>
          <TabsTrigger value="demandes" className="gap-1.5"><Workflow className="h-3.5 w-3.5" />Demandes</TabsTrigger>
          <TabsTrigger value="modeles" className="gap-1.5"><FileStack className="h-3.5 w-3.5" />Modèles</TabsTrigger>
          <TabsTrigger value="param" className="gap-1.5"><Settings2 className="h-3.5 w-3.5" />Paramétrage</TabsTrigger>
        </TabsList>

        <TabsContent value="actions" className="mt-4">
          {loading ? (
            <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin" /></div>
          ) : (
            <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)]">
              <div>
                <Tabs value={filter} onValueChange={v => setFilter(v as any)}>
                  <div className="flex items-center justify-between mb-2">
                    <TabsList>
                      <TabsTrigger value="all">Toutes</TabsTrigger>
                      <TabsTrigger value="encours">En cours</TabsTrigger>
                      <TabsTrigger value="urgent">Urgent</TabsTrigger>
                      <TabsTrigger value="validation">Validation</TabsTrigger>
                    </TabsList>
                  </div>
                </Tabs>
                <div className="space-y-2 max-h-[700px] overflow-y-auto pr-1">
                  {filtered.map(a => {
                    const s = actionStatutMap[a.statut as any] || { label: a.statut, status: "info" };
                    const avancement = a.sousActions?.length ? Math.round(a.sousActions.reduce((x, sa) => x + sa.tauxRealisation, 0) / a.sousActions.length) : 0;
                    return (
                      <button key={a.id || a.reference} onClick={() => setSelected(a)} className={`w-full text-left p-3 rounded-lg border transition-base ${selected?.id === a.id || selected?.reference === a.reference ? "bg-primary/8 border-primary/30" : "hover:bg-muted/40"}`}>
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-mono text-[10px] bg-muted px-1.5 py-0.5 rounded">{a.reference}</span>
                          <StatusBadge status={s.status} label={s.label} />
                        </div>
                        <div className="font-medium text-sm mt-1">{a.titre}</div>
                        <div className="text-xs text-muted-foreground mt-0.5 flex items-center gap-2 flex-wrap">
                          <span><Tag className="h-3 w-3 inline mr-0.5" />{a.type}</span>
                          <span>·</span>
                          <span><Link2 className="h-3 w-3 inline mr-0.5" />{a.source}</span>
                        </div>
                        {a.sousActions && a.sousActions.length > 0 && (
                          <div className="mt-2 flex items-center gap-2">
                            <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden"><div className="h-full bg-gradient-primary" style={{ width: `${avancement}%` }} /></div>
                            <span className="text-[10px] font-medium w-9 text-right">{avancement}%</span>
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="min-w-0">
                {selected ? <ActionDetail action={selected} /> : (
                  <Card><CardContent className="pt-12 pb-12 text-center text-muted-foreground"><Target className="h-8 w-8 mx-auto mb-2 opacity-30" /><p>Sélectionnez une action.</p></CardContent></Card>
                )}
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="demandes" className="mt-4 space-y-3">
          <Card>
            <CardHeader><CardTitle className="text-base">Workflow demande → validation → action</CardTitle><CardDescription>Une demande devient une action après validation successive selon le circuit paramétré par site et source.</CardDescription></CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 overflow-x-auto pb-2">
                {[
                  { l: "Demande", a: "Demandeur" }, { l: "Validation 1", a: "Resp. ordre 1" },
                  { l: "Validation 2", a: "Resp. ordre 2" }, { l: "Action active", a: "—" },
                  { l: "Réalisation", a: "Resp. réalisation" }, { l: "Suivi efficacité", a: "Resp. suivi" },
                  { l: "Clôture", a: "Resp. clôture" },
                ].map((s, i, arr) => (
                  <div key={s.l} className="flex items-center gap-2 shrink-0">
                    <div className="px-3 py-2 rounded-lg border bg-card text-center min-w-[110px]">
                      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{s.a}</div>
                      <div className="font-semibold text-sm">{s.l}</div>
                    </div>
                    {i < arr.length - 1 && <ArrowRight className="h-4 w-4 text-muted-foreground" />}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3"><CardTitle className="text-base">Demandes d'actions à valider</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              {actions.filter(a => a.statut === "demande" || a.statut === "validation" || a.statut === "refusee").map(a => (
                <div key={a.id || a.reference} className="border rounded-lg p-3">
                  <div className="flex items-start justify-between gap-3 flex-wrap">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-[10px] bg-muted px-1.5 py-0.5 rounded">{a.reference}</span>
                        <StatusBadge status={(actionStatutMap[a.statut as any] || { status: 'info' }).status} label={(actionStatutMap[a.statut as any] || { label: a.statut }).label} />
                        <Badge variant="outline" className="text-[10px]">{a.type}</Badge>
                      </div>
                      <div className="font-medium mt-1">{a.titre}</div>
                      <div className="text-xs text-muted-foreground mt-0.5">Demandeur: {a.demandeur} · {a.dateCreation}</div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => toast.success("Action validée — alerte au validateur suivant")}><CheckCircle2 className="h-4 w-4 mr-1.5" />Valider</Button>
                      <Button size="sm" variant="ghost" className="text-destructive hover:text-destructive" onClick={() => toast.error("Demande refusée")}><XCircle className="h-4 w-4 mr-1.5" />Refuser</Button>
                    </div>
                  </div>
                  {a.validateurs && (
                    <div className="mt-2 flex gap-1 flex-wrap">
                      {a.validateurs.map(v => <Badge key={v.name} variant={v.valide === true ? "default" : v.valide === "refus" ? "destructive" : "outline"} className="text-[10px]">{v.ordre}. {v.name} {v.valide === true ? "✓" : v.valide === "refus" ? "✕" : "…"}</Badge>)}
                    </div>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="modeles" className="mt-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Modèles d'action réutilisables</CardTitle>
                <Button size="sm"><Plus className="h-4 w-4 mr-1.5" />Nouveau modèle</Button>
              </div>
              <CardDescription>Permet de réutiliser des plans d'action types — remplacer en-tête + sous-actions, ou ajouter uniquement les sous-actions.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              {modelesAction.map(m => (
                <Card key={m.id} className="hover:border-primary/40 transition-base">
                  <CardContent className="pt-4">
                    <FileStack className="h-5 w-5 text-primary mb-2" />
                    <div className="font-medium text-sm">{m.titre}</div>
                    <div className="text-xs text-muted-foreground mt-1">{m.sousActions} sous-actions types</div>
                    <div className="flex gap-2 mt-3">
                      <Button size="sm" variant="outline" className="flex-1"><Copy className="h-3.5 w-3.5 mr-1" />Utiliser</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="param" className="mt-4">
          <div className="grid gap-4 md:grid-cols-2">
            <ParamCard title="Types d'actions" items={typesAction} />
            <ParamCard title="Sources d'actions" items={sourcesAction} note="Détermine le module d'origine" />
            <ParamCard title="Types de causes" items={typesCause} note="Méthode 5M" />
            <ParamCard title="Niveaux de gravité" items={gravitesAction} />
            <ParamCard title="Niveaux de priorité" items={prioritesAction} />
            <ParamCard title="Thèmes" items={themesAction.map(t => `${t.ordre}. ${t.name}`)} />
            <ParamCard title="Responsables de validation (par site × source)" items={[`Casablanca HQ × Audit interne → Direction Qualité (1), Direction Générale (2)`, `Tanger Med × NC Produit → Anas Benali (1), Direction Logistique (2)`, `Marrakech × Réclamation Client → Anas Benali (1)`]} note="Validation successive selon ordre" />
            <ParamCard title="Responsables de clôture (par site)" items={sites.map(s => `${s} → Anas Benali`)} note="Un seul suffit pour clôturer" />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function ActionDetail({ action }: { action: ActionRecord }) {
  const s = actionStatutMap[action.statut as any] || { label: action.statut, status: "info" };
  const avancement = action.sousActions?.length ? Math.round(action.sousActions.reduce((x, sa) => x + sa.tauxRealisation, 0) / action.sousActions.length) : 0;
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-mono text-xs bg-muted px-1.5 py-0.5 rounded">{action.reference}</span>
                <Badge variant="outline" className="text-[10px]">{action.type}</Badge>
                <Badge variant="secondary" className="text-[10px]">{action.source}</Badge>
              </div>
              <CardTitle className="mt-1">{action.titre}</CardTitle>
              <CardDescription>{action.description}</CardDescription>
            </div>
            <StatusBadge status={s.status} label={s.label} />
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2 text-sm">
            <Field label="Direction pilote" value={action.directionPilote} />
            <Field label="Métier" value={action.metier} />
            <Field label="Thème" value={action.theme} />
            <Field label="Site" value={action.site} />
            <Field label="Demandeur" value={action.demandeur} />
            <Field label="Date création" value={action.dateCreation || new Date(action.createdAt as any).toLocaleDateString()} />
            <Field label="Causes (5M)" value={action.causes?.join(", ") || "—"} />
            <div>
              <div className="text-[11px] uppercase tracking-wider text-muted-foreground">Avancement global</div>
              <div className="mt-1 flex items-center gap-2">
                <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden"><div className="h-full bg-gradient-primary" style={{ width: `${avancement}%` }} /></div>
                <span className="text-xs font-medium">{avancement}%</span>
              </div>
            </div>
          </div>
          {action.cloture && (
            <div className="mt-3 p-2 rounded bg-success/10 border border-success/30 text-sm flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-success" />Clôturée par {action.cloture.responsable} le {action.cloture.date}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm">Sous-actions ({action.sousActions?.length || 0})</CardTitle>
            <div className="flex gap-2">
              <Button size="sm" variant="outline"><Copy className="h-3.5 w-3.5 mr-1" />Dupliquer</Button>
              <Button size="sm"><Plus className="h-3.5 w-3.5 mr-1" />Ajouter</Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {!action.sousActions || action.sousActions.length === 0 ? (
            <p className="text-sm text-muted-foreground p-4">Aucune sous-action.</p>
          ) : (
            <Table>
              <TableHeader><TableRow><TableHead>Libellé</TableHead><TableHead>Resp. réalisation</TableHead><TableHead>Resp. suivi</TableHead><TableHead>Délai</TableHead><TableHead>Réal.</TableHead><TableHead>Eff.</TableHead><TableHead>Priorité</TableHead></TableRow></TableHeader>
              <TableBody>
                {action.sousActions.map(sa => (
                  <TableRow key={sa.id}>
                    <TableCell className="text-sm max-w-xs">{sa.libelle}</TableCell>
                    <TableCell className="text-xs">{sa.respRealisation}</TableCell>
                    <TableCell className="text-xs">{sa.respSuivi}</TableCell>
                    <TableCell className="text-xs">{sa.delai}</TableCell>
                    <TableCell><div className="flex items-center gap-1.5"><div className="h-1.5 w-12 bg-muted rounded-full overflow-hidden"><div className="h-full bg-primary" style={{ width: `${sa.tauxRealisation}%` }} /></div><span className="text-[10px]">{sa.tauxRealisation}%</span></div></TableCell>
                    <TableCell><div className="flex items-center gap-1.5"><div className="h-1.5 w-12 bg-muted rounded-full overflow-hidden"><div className="h-full bg-success" style={{ width: `${sa.tauxEfficacite}%` }} /></div><span className="text-[10px]">{sa.tauxEfficacite}%</span></div></TableCell>
                    <TableCell><Badge variant={sa.priorite === "Urgente" ? "destructive" : "outline"} className="text-[10px]">{sa.priorite}</Badge></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {action.rapportEfficacite && (
        <Card className="border-success/30 bg-success/5">
          <CardHeader className="pb-3"><CardTitle className="text-sm flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-success" />Rapport d'efficacité</CardTitle></CardHeader>
          <CardContent className="text-sm">{action.rapportEfficacite}</CardContent>
        </Card>
      )}

    </div>
  );
}

function Field({ label, value }: { label: string; value: any }) {
  return (
    <div className="border-b border-border pb-2">
      <div className="text-[11px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="font-medium mt-0.5">{value || "—"}</div>
    </div>
  );
}

function NewActionDialog({ onSuccess }: { onSuccess: () => void }) {
  const [submitting, setSubmitting] = useState(false);
  const [selectedCauses, setSelectedCauses] = useState<string[]>([]);

  const toggleCause = (c: string) => {
    setSelectedCauses(prev => prev.includes(c) ? prev.filter(x => x !== c) : [...prev, c]);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    const formData = new FormData(e.currentTarget);
    const payload = {
      ...Object.fromEntries(formData.entries()),
      causes: selectedCauses,
    };

    try {
      await post("/api/actions", payload);
      toast.success("Action enregistrée — circuit de validation déclenché");
      onSuccess();
    } catch (error) {
      toast.error("Erreur lors de l'enregistrement de l'action");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <DialogContent className="max-w-2xl">
      <DialogHeader><DialogTitle>Nouvelle action</DialogTitle><DialogDescription>L'IA suggère un modèle adapté selon le type et la source.</DialogDescription></DialogHeader>
      <form onSubmit={handleSubmit}>
        <div className="grid gap-3 md:grid-cols-2">
          <div className="md:col-span-2"><Label>Désignation</Label><Input name="titre" placeholder="Titre de l'action…" required /></div>
          <div><Label>Type</Label><Select name="type"><SelectTrigger><SelectValue placeholder="Choisir…" /></SelectTrigger><SelectContent>{typesAction.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent></Select></div>
          <div><Label>Source</Label><Select name="source"><SelectTrigger><SelectValue placeholder="Choisir…" /></SelectTrigger><SelectContent>{sourcesAction.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent></Select></div>
          <div><Label>Direction pilote</Label><Select name="directionPilote"><SelectTrigger><SelectValue placeholder="Choisir…" /></SelectTrigger><SelectContent>{directions.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent></Select></div>
          <div><Label>Métier</Label><Select name="metier"><SelectTrigger><SelectValue placeholder="Choisir…" /></SelectTrigger><SelectContent>{metiers.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}</SelectContent></Select></div>
          <div><Label>Thème</Label><Select name="theme"><SelectTrigger><SelectValue placeholder="Choisir…" /></SelectTrigger><SelectContent>{themesAction.map(t => <SelectItem key={t.name} value={t.name}>{t.name}</SelectItem>)}</SelectContent></Select></div>
          <div><Label>Site</Label><Select name="site"><SelectTrigger><SelectValue placeholder="Choisir…" /></SelectTrigger><SelectContent>{sites.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent></Select></div>
          <div className="md:col-span-2"><Label>Description / Problème</Label><Textarea name="description" rows={3} placeholder="Décrire le problème ou l'objet de l'action…" /></div>
          <div className="md:col-span-2"><Label>Causes (5M)</Label>
            <div className="flex gap-2 flex-wrap mt-1">{typesCause.map(c => (
              <Badge 
                key={c} 
                variant={selectedCauses.includes(c) ? "default" : "outline"} 
                className="cursor-pointer hover:bg-muted"
                onClick={() => toggleCause(c)}
              >
                {c}
              </Badge>
            ))}</div>
          </div>
        </div>
        <DialogFooter className="mt-4">
          <Button type="submit" disabled={submitting}>
            {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Enregistrer la demande
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
}

