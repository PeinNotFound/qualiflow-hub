import { useState } from "react";
import { PageHeader } from "@/components/qh/PageHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatusBadge } from "@/components/qh/StatusBadge";
import { ParamCard, KPICard } from "@/components/qh/ParamCard";
import { Activity, Plus, Settings2, TrendingUp, TrendingDown, Sparkles, Calculator, FileDown } from "lucide-react";
import { indicateurs, typesIndicateur, axesPolitique, typesResultat, typesSuivi, type Indicator } from "@/lib/mock-data-extended";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid } from "recharts";

export default function Indicateurs() {
  const [selected, setSelected] = useState<Indicator>(indicateurs[0]);
  const stats = {
    total: indicateurs.length,
    ok: indicateurs.filter(i => i.historique[i.historique.length - 1]?.status === "ok").length,
    alerte: indicateurs.filter(i => i.historique[i.historique.length - 1]?.status === "alerte").length,
    ko: indicateurs.filter(i => i.historique[i.historique.length - 1]?.status === "ko").length,
  };

  return (
    <div>
      <PageHeader
        icon={<Activity className="h-5 w-5" />}
        title="Indicateurs (KPI)"
        description="Tableaux de bord temps réel et analyse prédictive (ISO 9.1)"
        iso="9.1"
        actions={<>
          <Badge variant="secondary" className="gap-1.5"><Sparkles className="h-3 w-3" /> Prédictions IA</Badge>
          <Button size="sm"><Plus className="h-4 w-4 mr-1.5" />Nouvel indicateur</Button>
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
          <div className="grid gap-4 lg:grid-cols-[280px_1fr]">
            <Card>
              <CardHeader className="pb-3"><CardTitle className="text-sm">Indicateurs</CardTitle></CardHeader>
              <CardContent className="space-y-1.5 px-2 pb-3">
                {indicateurs.map(i => {
                  const last = i.historique[i.historique.length - 1];
                  return (
                    <button key={i.code} onClick={() => setSelected(i)} className={`w-full text-left px-2.5 py-2 rounded-md border transition-base ${selected.code === i.code ? "bg-primary/8 border-primary/30" : "border-transparent hover:bg-muted/60"}`}>
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
                      <LineChart data={selected.historique}>
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

              <Card className="border-primary/20 bg-primary/5">
                <CardHeader className="pb-3"><CardTitle className="text-sm flex items-center gap-2"><Sparkles className="h-4 w-4 text-primary" />Prédiction IA</CardTitle></CardHeader>
                <CardContent className="text-sm space-y-2">
                  <p>Tendance prévisionnelle pour la période suivante : <span className="font-semibold">{(selected.historique[selected.historique.length - 1]?.valeur ?? 0).toFixed(1)}{selected.unite}</span> (intervalle ±5%).</p>
                  <p className="text-muted-foreground italic">Recommandation : déclencher une action préventive si la cible n'est pas atteinte 2 périodes consécutives.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="liste" className="mt-4">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader><TableRow><TableHead>Code</TableHead><TableHead>Libellé</TableHead><TableHead>Type</TableHead><TableHead>Axe</TableHead><TableHead>Cible</TableHead><TableHead>Dernière valeur</TableHead><TableHead>Périodicité</TableHead></TableRow></TableHeader>
                <TableBody>
                  {indicateurs.map(i => {
                    const last = i.historique[i.historique.length - 1];
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
