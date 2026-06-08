import { useState, useEffect } from "react";
import { PageHeader } from "@/components/qh/PageHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatusBadge } from "@/components/qh/StatusBadge";
import { ParamCard, KPICard } from "@/components/qh/ParamCard";
import { Activity, Plus, Settings2, TrendingUp, TrendingDown, Sparkles, Calculator, FileDown, Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { indicateurs as initialIndicateurs, typesIndicateur, axesPolitique, typesResultat, typesSuivi, type Indicator } from "@/lib/mock-data-extended";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid } from "recharts";
import { get, post } from "@/lib/api";
import { toast } from "sonner";

export default function Indicateurs() {
  const [indicateurs, setIndicateurs] = useState<Indicator[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Indicator | null>(null);
  const [openNew, setOpenNew] = useState(false);

  useEffect(() => {
    fetchKPIs();
  }, []);

  const fetchKPIs = async () => {
    try {
      const data: any = await get("/api/kpis");
      setIndicateurs(data.data);
      if (data.data.length > 0 && !selected) {
        setSelected(data.data[0]);
      }
    } catch (error) {
      console.error("Failed to fetch KPIs", error);
      toast.error("Erreur lors du chargement des indicateurs");
      setIndicateurs(initialIndicateurs);
      if (!selected) setSelected(initialIndicateurs[0]);
    } finally {
      setLoading(false);
    }
  };

  const stats = {
    total: indicateurs.length,
    ok: indicateurs.filter(i => i.historique?.[i.historique.length - 1]?.status === "ok").length,
    alerte: indicateurs.filter(i => i.historique?.[i.historique.length - 1]?.status === "alerte").length,
    ko: indicateurs.filter(i => i.historique?.[i.historique.length - 1]?.status === "ko").length,
  };

  return (
    <div>
      <PageHeader
        icon={<Activity className="h-5 w-5" />}
        title="Indicateurs (KPI)"
        description="Tableaux de bord temps réel et analyse prédictive (ISO 9.1)"
        iso="9.1"
        actions={<>
          <Dialog open={openNew} onOpenChange={setOpenNew}>
            <DialogTrigger asChild>
              <Button size="sm"><Plus className="h-4 w-4 mr-1.5" />Nouvel indicateur</Button>
            </DialogTrigger>
            <NewIndicatorDialog onSuccess={() => { setOpenNew(false); fetchKPIs(); }} />
          </Dialog>
        </>}
      />

      <div className="grid gap-3 md:grid-cols-4 mb-4">
        <KPICard title="Total KPI" value={stats.total} />
        <KPICard title="Conformes" value={stats.ok} icon={<TrendingUp className="h-4 w-4 text-success" />} />
        <KPICard title="En alerte" value={stats.alerte} hint="Sous surveillance" />
        <KPICard title="Hors cible" value={stats.ko} icon={<TrendingDown className="h-4 w-4 text-destructive" />} />
      </div>

      <Tabs defaultValue="dashboard">
        <TabsList className="grid grid-cols-3 w-full max-w-xl">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="liste">Liste</TabsTrigger>
          <TabsTrigger value="param">Paramétrage</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="mt-4">
          {loading ? (
            <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin" /></div>
          ) : (
            <div className="grid gap-4 lg:grid-cols-[280px_1fr]">
              <Card>
                <CardHeader className="pb-3"><CardTitle className="text-sm">Indicateurs</CardTitle></CardHeader>
                <CardContent className="space-y-1.5 px-2 pb-3">
                  {indicateurs.map(i => {
                    const last = i.historique?.[i.historique.length - 1];
                    return (
                      <button key={i.code} onClick={() => setSelected(i)} className={`w-full text-left px-2.5 py-2 rounded-md border transition-base ${selected?.code === i.code ? "bg-primary/8 border-primary/30" : "border-transparent hover:bg-muted/60"}`}>
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-mono text-[10px] text-muted-foreground">{i.code}</span>
                          {last && <StatusBadge status={last.status === "ok" ? "conforme" : last.status === "alerte" ? "surveillance" : "critique"} label={`${last.valeur}${i.unite}`} />}
                        </div>
                        <div className="text-sm font-medium mt-0.5">{i.libelle}</div>
                        <div className="text-[11px] text-muted-foreground">{i.type} · {i.periodicite}</div>
                      </button>
                    );
                  })}
                </CardContent>
              </Card>

              <div className="min-w-0 space-y-4">
                {selected ? (
                  <>
                    <Card>
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-xs bg-muted px-1.5 py-0.5 rounded">{selected.code}</span>
                              <Badge variant="outline" className="text-[10px]">{selected.type}</Badge>
                            </div>
                            <CardTitle className="mt-1">{selected.libelle}</CardTitle>
                            <CardDescription>{selected.axe} · {selected.responsable} · Cible: {selected.cible}</CardDescription>
                          </div>
                          <div className="flex gap-2">
                            <Badge variant="secondary" className="text-[10px]">{selected.typeResultat}</Badge>
                            <Badge variant="outline" className="text-[10px]"><Calculator className="h-3 w-3 mr-1" />{selected.typeSuivi}</Badge>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="h-64">
                          <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={selected.historique || []}>
                              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                              <XAxis dataKey="periode" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                              <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                              <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 6 }} />
                              <Line type="monotone" dataKey="valeur" stroke="hsl(var(--primary))" strokeWidth={2.5} dot={{ r: 4 }} />
                            </LineChart>
                          </ResponsiveContainer>
                        </div>
                      </CardContent>
                    </Card>

                  </>
                ) : (
                  <Card><CardContent className="pt-12 pb-12 text-center text-muted-foreground"><Activity className="h-8 w-8 mx-auto mb-2 opacity-30" /><p>Sélectionnez un indicateur pour voir le détail.</p></CardContent></Card>
                )}
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="liste" className="mt-4">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader><TableRow><TableHead>Code</TableHead><TableHead>Libellé</TableHead><TableHead>Type</TableHead><TableHead>Axe</TableHead><TableHead>Cible</TableHead><TableHead>Dernière valeur</TableHead><TableHead>Périodicité</TableHead></TableRow></TableHeader>
                <TableBody>
                  {indicateurs.map(i => {
                    const last = i.historique?.[i.historique.length - 1];
                    return (
                      <TableRow key={i.code}>
                        <TableCell className="font-mono text-xs">{i.code}</TableCell>
                        <TableCell className="font-medium">{i.libelle}</TableCell>
                        <TableCell><Badge variant="outline" className="text-[10px]">{i.type}</Badge></TableCell>
                        <TableCell className="text-xs">{i.axe}</TableCell>
                        <TableCell className="text-xs">{i.cible}</TableCell>
                        <TableCell>{last && <StatusBadge status={last.status === "ok" ? "conforme" : last.status === "alerte" ? "surveillance" : "critique"} label={`${last.valeur}${i.unite}`} />}</TableCell>
                        <TableCell className="text-xs">{i.periodicite}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="param" className="mt-4">
          <div className="grid gap-4 md:grid-cols-2">
            <ParamCard title="Types d'indicateurs" items={typesIndicateur} note="Correspondent aux processus" />
            <ParamCard title="Axes de la politique qualité" items={axesPolitique.map(a => `${a.code} — ${a.name}`)} />
            <ParamCard title="Types de résultats" items={typesResultat} note="Moyenne / Cumul / Pondéré / Oui-Non / Dernière" />
            <ParamCard title="Types de suivi" items={typesSuivi} note="Manuel, formule, importation" />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function NewIndicatorDialog({ onSuccess }: { onSuccess: () => void }) {
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    const formData = new FormData(e.currentTarget);
    const payload = Object.fromEntries(formData.entries());

    try {
      await post("/api/kpis", {
        ...payload,
        historique: [] // Start with empty history
      });
      toast.success("Indicateur créé avec succès");
      onSuccess();
    } catch (error) {
      toast.error("Erreur lors de la création de l'indicateur");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <DialogContent className="max-w-xl">
      <DialogHeader><DialogTitle>Créer un nouvel indicateur</DialogTitle><DialogDescription>Définissez les paramètres de suivi pour cet indicateur de performance.</DialogDescription></DialogHeader>
      <form onSubmit={handleSubmit}>
        <div className="grid gap-3 md:grid-cols-2">
          <div><Label>Code</Label><Input name="code" placeholder="QUAL-001" required /></div>
          <div><Label>Libellé</Label><Input name="libelle" placeholder="Taux de conformité..." required /></div>
          <div><Label>Type</Label><Select name="type"><SelectTrigger><SelectValue placeholder="Choisir…" /></SelectTrigger><SelectContent>{typesIndicateur.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent></Select></div>
          <div><Label>Axe Politique</Label><Select name="axe"><SelectTrigger><SelectValue placeholder="Choisir…" /></SelectTrigger><SelectContent>{axesPolitique.map(a => <SelectItem key={a.code} value={a.name}>{a.name}</SelectItem>)}</SelectContent></Select></div>
          <div><Label>Cible</Label><Input name="cible" placeholder="> 95%" required /></div>
          <div><Label>Unité</Label><Input name="unite" placeholder="%" required /></div>
          <div><Label>Périodicité</Label><Select name="periodicite"><SelectTrigger><SelectValue placeholder="Choisir…" /></SelectTrigger><SelectContent><SelectItem value="Mensuelle">Mensuelle</SelectItem><SelectItem value="Trimestrielle">Trimestrielle</SelectItem><SelectItem value="Annuelle">Annuelle</SelectItem></SelectContent></Select></div>
          <div><Label>Responsable</Label><Input name="responsable" placeholder="Nom du responsable" required /></div>
        </div>
        <DialogFooter className="mt-4">
          <Button type="submit" disabled={submitting}>
            {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Créer l'indicateur
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
}

