import { PageHeader } from "@/components/qh/PageHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatusBadge } from "@/components/qh/StatusBadge";
import { ParamCard, KPICard } from "@/components/qh/ParamCard";
import { ShieldAlert, Plus, Settings2, Sparkles, TrendingDown, TrendingUp, ArrowRight, Loader2 } from "lucide-react";
import { risques, domainesRisque, criteresRisque, type Risque } from "@/lib/mock-data-extended"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input as InputField } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { get, post } from "@/lib/api";
import { useState, useEffect } from "react";

export default function Risques() {
  const [items, setItems] = useState<any[]>(risques);
  const [loading, setLoading] = useState(true);
  const [openNew, setOpenNew] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchRisques();
  }, []);

  const fetchRisques = async () => {
    try {
      const data: any = await get("/api/risques");
      setItems(data.data.length > 0 ? data.data : risques);
    } catch (error) {
      console.error("Failed to fetch risques", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    const formData = new FormData(e.currentTarget);
    const payload = Object.fromEntries(formData.entries());

    try {
      await post("/api/risques", payload);
      toast.success("Risque créé avec succès");
      setOpenNew(false);
      fetchRisques();
    } catch (error) {
      toast.error("Erreur lors de la création du risque");
    } finally {
      setSubmitting(false);
    }
  };

  const menaces = items.filter(r => r.type === "menace");
  const opportunites = items.filter(r => r.type === "opportunite");
  const significatifs = items.filter(r => r.significatif).length;

  const matrix = (r: Risque) => {
    const x = r.G;
    const y = r.O;
    return { x, y };
  };

  return (
    <div>
      <PageHeader
        icon={<ShieldAlert className="h-5 w-5" />}
        title="Risques & AMDEC"
        description="Menaces, opportunités, criticité et plans préventifs (ISO 6.1)"
        iso="6.1"
        actions={<>
          <Dialog open={openNew} onOpenChange={setOpenNew}>
            <DialogTrigger asChild>
              <Button size="sm"><Plus className="h-4 w-4 mr-1.5" />Nouveau risque</Button>
            </DialogTrigger>
            <DialogContent className="max-w-xl">
              <DialogHeader>
                <DialogTitle>Identifier un nouveau risque</DialogTitle>
                <DialogDescription>Description et cotation initiale de la criticité.</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleCreate}>
                <div className="grid gap-3 py-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <Label>Code</Label>
                      <InputField name="code" placeholder="Ex: R-LOG-01" required />
                    </div>
                    <div className="space-y-1">
                      <Label>Type</Label>
                      <Select name="type" defaultValue="menace">
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="menace">Menace</SelectItem>
                          <SelectItem value="opportunite">Opportunité</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <Label>Titre / Libellé</Label>
                    <InputField name="titre" placeholder="Description courte du risque..." required />
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="space-y-1">
                      <Label>Gravité (G)</Label>
                      <InputField name="G" type="number" min={1} max={4} defaultValue={1} />
                    </div>
                    <div className="space-y-1">
                      <Label>Occurrence (O)</Label>
                      <InputField name="O" type="number" min={1} max={4} defaultValue={1} />
                    </div>
                    <div className="space-y-1">
                      <Label>Détection (D)</Label>
                      <InputField name="D" type="number" min={1} max={4} defaultValue={1} />
                    </div>
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
        </>}
      />

      <div className="grid gap-3 md:grid-cols-4 mb-4">
        <KPICard title="Total risques" value={risques.length} />
        <KPICard title="Menaces" value={menaces.length} icon={<TrendingDown className="h-4 w-4 text-destructive" />} />
        <KPICard title="Opportunités" value={opportunites.length} icon={<TrendingUp className="h-4 w-4 text-success" />} />
        <KPICard title="Significatifs" value={significatifs} hint="> seuil de criticité" />
      </div>

      <Tabs defaultValue="liste">
        <TabsList className="grid grid-cols-3 w-full max-w-xl">
          <TabsTrigger value="liste">Liste AMDEC</TabsTrigger>
          <TabsTrigger value="matrice">Matrice</TabsTrigger>
          <TabsTrigger value="param">Paramétrage</TabsTrigger>
        </TabsList>

        <TabsContent value="liste" className="mt-4 space-y-3">
          {loading ? (
            <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>
          ) : (
            items.map(r => (
              <Card key={r.code} className={r.significatif ? "border-destructive/30" : ""}>
                <CardContent className="pt-4">
                  <div className="flex items-start justify-between gap-3 flex-wrap">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-[10px] bg-muted px-1.5 py-0.5 rounded">{r.code}</span>
                        <Badge variant={r.type === "menace" ? "destructive" : "default"} className="text-[10px]">{r.type === "menace" ? "🔻 Menace" : "🔺 Opportunité"}</Badge>
                        <Badge variant="outline" className="text-[10px]">{r.domaine}</Badge>
                        {r.significatif && <Badge className="bg-destructive/10 text-destructive border-destructive/30 text-[10px]">Significatif</Badge>}
                      </div>
                      <div className="font-semibold mt-1">{r.titre}</div>
                      <div className="grid gap-2 md:grid-cols-3 text-xs mt-2">
                        <div><span className="text-muted-foreground">Cause:</span> {r.cause || "-"}</div>
                        <div><span className="text-muted-foreground">Événement:</span> {r.evenement || "-"}</div>
                        <div><span className="text-muted-foreground">Enjeu:</span> {r.enjeu || "-"}</div>
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-[10px] uppercase text-muted-foreground">Criticité</div>
                      <div className="text-2xl font-bold">{r.criticite}</div>
                      <div className="text-[10px] text-muted-foreground">seuil {r.seuil}</div>
                    </div>
                  </div>

                  <div className="mt-3 grid gap-2 md:grid-cols-4 text-xs">
                    <Score label="Gravité (G)" v={r.G} />
                    <Score label="Occurrence (O)" v={r.O} />
                    <Score label="Détection (D)" v={r.D} />
                    <Score label="C = G × O × D" v={r.criticite} highlight />
                  </div>

                  {r.planAction && (
                    <div className="mt-3 p-3 rounded bg-muted/40 border">
                      <div className="text-xs flex items-center justify-between flex-wrap gap-2">
                        <div>Plan d'action : <Badge variant="outline" className="font-mono text-[10px] ml-1">{r.planAction}</Badge></div>
                        {r.resCriticite != null && (
                          <div className="flex items-center gap-2">
                            <span>Résiduel:</span>
                            <Score label="" v={r.resCriticite} highlight />
                            <ArrowRight className="h-3 w-3 text-success" />
                            <span className="text-success font-medium">{Math.round((1 - r.resCriticite / r.criticite) * 100)}% de réduction</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="matrice" className="mt-4">
          <Card>
            <CardHeader><CardTitle className="text-base">Matrice Gravité × Occurrence</CardTitle><CardDescription>Visualisation des risques selon leur position</CardDescription></CardHeader>
            <CardContent>
              <div className="relative aspect-square max-w-md mx-auto">
                <div className="absolute inset-0 grid grid-cols-4 grid-rows-4 gap-0.5">
                  {Array.from({ length: 16 }).map((_, i) => {
                    const col = i % 4 + 1;
                    const row = 4 - Math.floor(i / 4);
                    const score = col * row;
                    const color = score >= 12 ? "bg-destructive/20" : score >= 6 ? "bg-warning/20" : "bg-success/20";
                    return <div key={i} className={`${color} rounded`} />;
                  })}
                </div>
                {items.map(r => {
                  const { x, y } = matrix(r);
                  return (
                    <div key={r.code} className="absolute group" style={{ left: `${(x - 0.5) / 4 * 100}%`, top: `${(4 - y + 0.5) / 4 * 100}%`, transform: "translate(-50%, -50%)" }}>
                      <div className={`h-7 w-7 rounded-full flex items-center justify-center text-[10px] font-bold text-white shadow-elegant ${r.type === "menace" ? "bg-destructive" : "bg-success"}`}>{r.code.split("-")[1] || r.code}</div>
                      <div className="absolute left-1/2 -translate-x-1/2 mt-1 px-2 py-1 rounded bg-popover border text-[10px] whitespace-nowrap opacity-0 group-hover:opacity-100 transition pointer-events-none z-10">{r.titre}</div>
                    </div>
                  );
                })}
                <div className="absolute -bottom-6 left-0 right-0 text-center text-xs text-muted-foreground">Gravité (G) →</div>
                <div className="absolute -left-6 top-0 bottom-0 flex items-center"><span className="text-xs text-muted-foreground -rotate-90 whitespace-nowrap">Occurrence (O) →</span></div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="param" className="mt-4">
          <div className="grid gap-4 md:grid-cols-2">
            <ParamCard title="Domaines de risque" items={domainesRisque.map(d => `${d.code} — ${d.name} (${d.typeRisque}, seuil ${d.seuil})`)} />
            <ParamCard title="Critères d'évaluation" items={criteresRisque.map(c => `${c.name} — échelle ${c.echelle.join("/")}`)} />
            <ParamCard title="Méthode de calcul" items={["Criticité = G × O × D", "Criticité = G × O (FMEA simple)", "Criticité = (G + O + D) / 3"]} note="Configurable selon politique" />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function Score({ label, v, highlight }: { label: string; v: number; highlight?: boolean }) {
  return (
    <div className={`p-2 rounded border text-center ${highlight ? "bg-primary/10 border-primary/30" : "bg-muted/40"}`}>
      {label && <div className="text-[10px] uppercase text-muted-foreground">{label}</div>}
      <div className={`font-bold ${highlight ? "text-primary text-lg" : ""}`}>{v}</div>
    </div>
  );
}
