import { PageHeader } from "@/components/qh/PageHeader";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/qh/StatusBadge";
import { ParamCard, KPICard } from "@/components/qh/ParamCard";
import { Calendar as CalIcon, Plus, MapPin, Users, FileText, Sparkles } from "lucide-react";
import { reunions, typesReunion } from "@/lib/mock-data-extended";

export default function Reunions() {
  const planifiees = reunions.filter(r => r.statut === "planifiee").length;
  const realisees = reunions.filter(r => r.statut === "realisee").length;

  return (
    <div>
      <PageHeader
        icon={<CalIcon className="h-5 w-5" />}
        title="Réunions"
        description="Planification, ordre du jour, décisions et actions associées"
        actions={<><Badge variant="secondary" className="gap-1.5"><Sparkles className="h-3 w-3" /> PV auto IA</Badge><Button size="sm"><Plus className="h-4 w-4 mr-1.5" />Nouvelle réunion</Button></>}
      />

      <div className="grid gap-3 md:grid-cols-3 mb-4">
        <KPICard title="Total" value={reunions.length} />
        <KPICard title="Planifiées" value={planifiees} />
        <KPICard title="Réalisées" value={realisees} />
      </div>

      <Tabs defaultValue="liste">
        <TabsList className="grid grid-cols-2 w-full max-w-md">
          <TabsTrigger value="liste">Réunions</TabsTrigger>
          <TabsTrigger value="param">Paramétrage</TabsTrigger>
        </TabsList>

        <TabsContent value="liste" className="mt-4 space-y-3">
          {reunions.map(r => (
            <Card key={r.ref}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-3 flex-wrap">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-[10px] bg-muted px-1.5 py-0.5 rounded">{r.ref}</span>
                      <Badge variant="outline" className="text-[10px]">{r.type}</Badge>
                      <StatusBadge status={r.statut === "realisee" ? "conforme" : "info"} label={r.statut === "realisee" ? "Réalisée" : "Planifiée"} />
                    </div>
                    <CardTitle className="text-base mt-1">{r.titre}</CardTitle>
                    <CardDescription className="flex flex-wrap gap-3 mt-1 text-xs">
                      <span><CalIcon className="h-3 w-3 inline mr-1" />{r.date} · {r.duree}</span>
                      <span><MapPin className="h-3 w-3 inline mr-1" />{r.lieu}</span>
                      <span><Users className="h-3 w-3 inline mr-1" />{r.invites.length} invités</span>
                    </CardDescription>
                  </div>
                  {r.statut === "realisee" && <Button size="sm" variant="outline"><FileText className="h-4 w-4 mr-1.5" />PV</Button>}
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3 md:grid-cols-2">
                  <div>
                    <div className="text-[11px] uppercase tracking-wider text-muted-foreground mb-1">Ordre du jour</div>
                    <ul className="text-sm space-y-1">{r.ordreJour.map(o => <li key={o} className="px-2 py-1 rounded hover:bg-muted/50">• {o}</li>)}</ul>
                  </div>
                  <div>
                    <div className="text-[11px] uppercase tracking-wider text-muted-foreground mb-1">Invités</div>
                    <div className="flex flex-wrap gap-1">{r.invites.map(i => <Badge key={i} variant="secondary" className="text-[10px]">{i}</Badge>)}</div>
                  </div>
                </div>
                {r.decisions && r.decisions.length > 0 && (
                  <div className="mt-3 p-3 rounded-lg border bg-primary/5 border-primary/20">
                    <div className="text-[11px] uppercase tracking-wider text-muted-foreground mb-2">Décisions & actions</div>
                    <div className="space-y-2">
                      {r.decisions.map((d, i) => (
                        <div key={i} className="flex items-center justify-between gap-2 text-sm">
                          <span>• {d.decision}</span>
                          {d.actionId && <Badge variant="outline" className="font-mono text-[10px]">{d.actionId}</Badge>}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {r.commentaires && <p className="text-xs text-muted-foreground mt-2 italic">{r.commentaires}</p>}
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="param" className="mt-4">
          <div className="grid gap-4 md:grid-cols-2">
            <ParamCard title="Types de réunions" items={typesReunion.map(t => `${t.name} (${t.periodicite})`)} />
            <ParamCard title="Responsables PV" items={["Anas Benali — Comité Qualité", "DRH — Revue de direction", "Pilotes processus — Revue processus"]} />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
