import { useState, useEffect } from "react";
import { PageHeader } from "@/components/qh/PageHeader";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { StatusBadge } from "@/components/qh/StatusBadge";
import { ParamCard, KPICard } from "@/components/qh/ParamCard";
import { AlertTriangle, Plus, Sparkles, ArrowRight, Loader2 } from "lucide-react";
import { get, post } from "@/lib/api";
import { toast } from "sonner";
import { produitsNC, typesNC, sourcesNC, gravitesNC, typesTraitementNC, ateliers, type NCStatut, nonConformites as mockNC } from "@/lib/mock-data-extended";
import { sites } from "@/lib/mock-data";

const ncSteps: { id: NCStatut; label: string }[] = [
  { id: "enregistree", label: "Enregistrée" },
  { id: "decision", label: "Décision" },
  { id: "validation", label: "Validation" },
  { id: "traitement", label: "Traitement" },
  { id: "suivi", label: "Suivi" },
  { id: "cloturee", label: "Clôturée" },
];

const statusColor = (s: NCStatut): "info" | "conforme" | "surveillance" | "critique" => 
  s === "cloturee" ? "conforme" : s === "traitement" || s === "suivi" ? "surveillance" : s === "enregistree" ? "info" : "surveillance";

export default function NonConformites() {
  const [ncs, setNcs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [openNew, setOpenNew] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchNCs();
  }, []);

  const fetchNCs = async () => {
    try {
      const data: any = await get("/api/nc");
      setNcs(data.data);
    } catch (error) {
      console.error("Failed to fetch NCs", error);
      toast.error("Erreur lors du chargement des NC");
      // Fallback to mock for dev
      setNcs(mockNC);
    } finally {
      setLoading(false);
    }
  };

  const enCours = ncs.filter(n => n.statut !== "cloturee").length;
  const critiques = ncs.filter(n => n.gravite === "Critique" || n.gravite === "critique").length;

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    const formData = new FormData(e.currentTarget);
    const payload = Object.fromEntries(formData.entries());

    try {
      await post("/api/nc", payload);
      toast.success("NC enregistrée avec succès");
      setOpenNew(false);
      fetchNCs();
    } catch (error) {
      toast.error("Erreur lors de la création de la NC");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <PageHeader
        icon={<AlertTriangle className="h-5 w-5" />}
        title="Non-Conformités (PNC)"
        description="Détection, traitement et traçabilité des produits/services non conformes (ISO 8.7)"
        iso="8.7"
        actions={
          <>
            <Dialog open={openNew} onOpenChange={setOpenNew}>
              <DialogTrigger asChild>
                <Button size="sm"><Plus className="h-4 w-4 mr-1.5" />Nouvelle PNC</Button>
              </DialogTrigger>
              <DialogContent className="max-w-xl">
                <DialogHeader>
                  <DialogTitle>Déclarer une Non-Conformité</DialogTitle>
                  <DialogDescription>Remplissez les informations pour initialiser le circuit de traitement.</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleCreate}>
                  <div className="grid gap-3 py-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <Label>Type NC</Label>
                        <Select name="type_nc">
                          <SelectTrigger><SelectValue placeholder="Choisir..." /></SelectTrigger>
                          <SelectContent>{typesNC.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-1">
                        <Label>Gravité</Label>
                        <Select name="gravite">
                          <SelectTrigger><SelectValue placeholder="Choisir..." /></SelectTrigger>
                          <SelectContent>{gravitesNC.map(g => <SelectItem key={g} value={g}>{g}</SelectItem>)}</SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <Label>Produit / Service concerné</Label>
                      <Input name="produit" placeholder="Ex: Lot palette OCP-2451" required />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <Label>Atelier / Lieu</Label>
                        <Select name="atelier">
                          <SelectTrigger><SelectValue placeholder="Choisir..." /></SelectTrigger>
                          <SelectContent>{ateliers.map(a => <SelectItem key={a} value={a}>{a}</SelectItem>)}</SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-1">
                        <Label>Lot / Réf.</Label>
                        <Input name="lot" placeholder="Ex: L-2026-001" />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <Label>Description de l'écart</Label>
                      <Textarea name="description" placeholder="Détails de la non-conformité constatée..." />
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

      <div className="grid gap-3 md:grid-cols-4 mb-4">
        <KPICard title="Total" value={ncs.length} />
        <KPICard title="En cours" value={enCours} />
        <KPICard title="Critiques" value={critiques} icon={<AlertTriangle className="h-4 w-4 text-destructive" />} />
        <KPICard title="Clôturées" value={ncs.length - enCours} />
      </div>

      <Tabs defaultValue="liste">
        <TabsList className="grid grid-cols-3 w-full max-w-xl">
          <TabsTrigger value="liste">Liste PNC</TabsTrigger>
          <TabsTrigger value="workflow">Workflow</TabsTrigger>
          <TabsTrigger value="param">Paramétrage</TabsTrigger>
        </TabsList>

        <TabsContent value="liste" className="mt-4 space-y-2">
          {loading ? (
            <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>
          ) : ncs.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">Aucune non-conformité enregistrée.</div>
          ) : (
            ncs.map(n => (
              <Card key={n.ref || n._id}><CardContent className="pt-4">
                <div className="flex items-start justify-between gap-3 flex-wrap">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-[10px] bg-muted px-1.5 py-0.5 rounded">{n.ref || "NEW"}</span>
                      <StatusBadge status={n.gravite === "Critique" || n.gravite === "critique" ? "critique" : n.gravite === "Majeure" || n.gravite === "majeure" ? "surveillance" : "info"} label={n.gravite} />
                      <Badge variant="outline" className="text-[10px]">{n.typeNC || n.type_nc}</Badge>
                      <Badge variant="secondary" className="text-[10px]">{n.detection === "client" ? "Détectée client" : "Détectée interne"}</Badge>
                      <StatusBadge status={statusColor(n.statut)} label={ncSteps.find(s => s.id === n.statut)?.label || n.statut} />
                    </div>
                    <div className="font-medium mt-1">{n.produit}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">{n.date || new Date(n.createdAt).toLocaleDateString()} · {n.atelier} · {n.lot && `Lot ${n.lot}`} {n.qteDetectee && `· Qté ${n.qteDetectee}`}</div>
                    <div className="grid gap-2 md:grid-cols-3 text-xs mt-2">
                      <div><span className="text-muted-foreground">Décideur:</span> {n.decideur || "À définir"}</div>
                      {n.respTraitement && <div><span className="text-muted-foreground">Resp. traitement:</span> {n.respTraitement}</div>}
                      {n.respSuivi && <div><span className="text-muted-foreground">Resp. suivi:</span> {n.respSuivi}</div>}
                    </div>
                    {n.typeTraitement && <div className="mt-2 text-xs">Traitement : <Badge variant="outline" className="text-[10px] ml-1">{n.typeTraitement}</Badge></div>}
                    {n.description && <div className="mt-2 p-2 rounded bg-muted/40 text-xs">{n.description}</div>}
                  </div>
                  {n.actionAssociee && <Badge variant="outline" className="font-mono text-[10px]">{n.actionAssociee}</Badge>}
                </div>

                <div className="mt-3 flex items-center gap-1.5 overflow-x-auto pb-1">
                  {ncSteps.map((s, i, arr) => {
                    const order = ncSteps.findIndex(x => x.id === n.statut);
                    const active = i <= order;
                    return (
                      <div key={s.id} className="flex items-center gap-1.5 shrink-0">
                        <div className={`px-2.5 py-1 rounded text-[11px] font-medium ${active ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>{s.label}</div>
                        {i < arr.length - 1 && <span className="text-muted-foreground text-xs">→</span>}
                      </div>
                    );
                  })}
                </div>
              </CardContent></Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="workflow" className="mt-4">
          <Card>
            <CardHeader><CardTitle className="text-base">Workflow PNC complet</CardTitle><CardDescription>Enregistrement → Décision → Validation (si type avec validation) → Traitement → Suivi → Clôture</CardDescription></CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 overflow-x-auto pb-2">
                {[
                  { l: "Enregistrement", a: "Déclencheur" },
                  { l: "Décision", a: "Décideur (par site)" },
                  { l: "Validation", a: "Resp. validation" },
                  { l: "Traitement", a: "Resp. traitement" },
                  { l: "Suivi", a: "Resp. suivi" },
                  { l: "Clôture", a: "Resp. suivi" },
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
        </TabsContent>

        <TabsContent value="param" className="mt-4">
          <div className="grid gap-4 md:grid-cols-2">
            <ParamCard title="Produits" items={produitsNC.map(p => `${p.code} — ${p.designation} (${p.prix.toLocaleString()} MAD)`)} />
            <ParamCard title="Types de non-conformité" items={typesNC} />
            <ParamCard title="Sources" items={sourcesNC} />
            <ParamCard title="Niveaux de gravité" items={gravitesNC} />
            <ParamCard title="Types de traitement" items={typesTraitementNC} />
            <ParamCard title="Décideurs (par site)" items={sites.map(s => `${s} → Anas Benali`)} />
            <ParamCard title="Ateliers" items={ateliers} />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

