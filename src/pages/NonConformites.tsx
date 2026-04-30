import { PageHeader } from "@/components/qh/PageHeader";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatusBadge } from "@/components/qh/StatusBadge";
import { ParamCard, KPICard } from "@/components/qh/ParamCard";
import { AlertTriangle, Plus, Sparkles, ArrowRight } from "lucide-react";
import { nonConformites, produitsNC, typesNC, sourcesNC, gravitesNC, typesTraitementNC, ateliers, type NCStatut } from "@/lib/mock-data-extended";
import { sites } from "@/lib/mock-data";

const ncSteps: { id: NCStatut; label: string }[] = [
  { id: "enregistree", label: "Enregistrée" },
  { id: "decision", label: "Décision" },
  { id: "validation", label: "Validation" },
  { id: "traitement", label: "Traitement" },
  { id: "suivi", label: "Suivi" },
  { id: "cloturee", label: "Clôturée" },
];

const statusColor = (s: NCStatut): "info" | "conforme" | "surveillance" | "critique" => s === "cloturee" ? "conforme" : s === "traitement" || s === "suivi" ? "surveillance" : s === "enregistree" ? "info" : "surveillance";

export default function NonConformites() {
  const enCours = nonConformites.filter(n => n.statut !== "cloturee").length;
  const critiques = nonConformites.filter(n => n.gravite === "Critique").length;

  return (
    <div>
      <PageHeader
        icon={<AlertTriangle className="h-5 w-5" />}
        title="Non-Conformités (PNC)"
        description="Détection, traitement et traçabilité des produits/services non conformes (ISO 8.7)"
        iso="8.7"
        actions={<><Badge variant="secondary" className="gap-1.5"><Sparkles className="h-3 w-3" /> Causes IA</Badge><Button size="sm"><Plus className="h-4 w-4 mr-1.5" />Nouvelle PNC</Button></>}
      />

      <div className="grid gap-3 md:grid-cols-4 mb-4">
        <KPICard title="Total" value={nonConformites.length} />
        <KPICard title="En cours" value={enCours} />
        <KPICard title="Critiques" value={critiques} icon={<AlertTriangle className="h-4 w-4 text-destructive" />} />
        <KPICard title="Clôturées" value={nonConformites.length - enCours} />
      </div>

      <Tabs defaultValue="liste">
        <TabsList className="grid grid-cols-3 w-full max-w-xl">
          <TabsTrigger value="liste">Liste PNC</TabsTrigger>
          <TabsTrigger value="workflow">Workflow</TabsTrigger>
          <TabsTrigger value="param">Paramétrage</TabsTrigger>
        </TabsList>

        <TabsContent value="liste" className="mt-4 space-y-2">
          {nonConformites.map(n => (
            <Card key={n.ref}><CardContent className="pt-4">
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-[10px] bg-muted px-1.5 py-0.5 rounded">{n.ref}</span>
                    <StatusBadge status={n.gravite === "Critique" ? "critique" : n.gravite === "Majeure" ? "surveillance" : "info"} label={n.gravite} />
                    <Badge variant="outline" className="text-[10px]">{n.typeNC}</Badge>
                    <Badge variant="secondary" className="text-[10px]">{n.detection === "client" ? "Détectée client" : "Détectée interne"}</Badge>
                    <StatusBadge status={statusColor(n.statut)} label={ncSteps.find(s => s.id === n.statut)?.label} />
                  </div>
                  <div className="font-medium mt-1">{n.produit}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{n.date} · {n.atelier} · Lot {n.lot} · Qté {n.qteDetectee}</div>
                  <div className="grid gap-2 md:grid-cols-3 text-xs mt-2">
                    <div><span className="text-muted-foreground">Décideur:</span> {n.decideur}</div>
                    {n.respTraitement && <div><span className="text-muted-foreground">Resp. traitement:</span> {n.respTraitement}</div>}
                    {n.respSuivi && <div><span className="text-muted-foreground">Resp. suivi:</span> {n.respSuivi}</div>}
                  </div>
                  {n.typeTraitement && <div className="mt-2 text-xs">Traitement : <Badge variant="outline" className="text-[10px] ml-1">{n.typeTraitement}</Badge></div>}
                  {n.rapportTraitement && <div className="mt-2 p-2 rounded bg-muted/40 text-xs">{n.rapportTraitement}</div>}
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
          ))}
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
