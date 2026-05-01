import { useState } from "react";
import { Calendar as CalendarIcon, ClipboardCheck, Activity, Users, FileText, Bell, Plus } from "lucide-react";
import { PageHeader } from "@/components/qh/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { KPICard } from "@/components/qh/ParamCard";
import { cn } from "@/lib/utils";

type Flux = "audits" | "kpi" | "reunions" | "doc";

interface Event {
  id: string; titre: string; flux: Flux; date: string; responsable: string;
  type: string; statut: "À venir" | "En cours" | "Terminé" | "En retard";
}

const events: Event[] = [
  { id: "e1", titre: "Audit interne — Processus Logistique", flux: "audits", date: "2026-05-12", responsable: "Salma El Idrissi", type: "Audit interne", statut: "À venir" },
  { id: "e2", titre: "Audit de suivi — Ecart AUD-2026-001", flux: "audits", date: "2026-05-20", responsable: "Anas Benali", type: "Audit de suivi", statut: "À venir" },
  { id: "e3", titre: "Saisie KPI mensuels — Direction Logistique", flux: "kpi", date: "2026-05-05", responsable: "Mehdi Cherkaoui", type: "Saisie KPI", statut: "En cours" },
  { id: "e4", titre: "Analyse trimestrielle KPI Q2", flux: "kpi", date: "2026-07-05", responsable: "Direction Qualité", type: "Analyse KPI", statut: "À venir" },
  { id: "e5", titre: "Revue de Direction Q2-2026", flux: "reunions", date: "2026-06-15", responsable: "Direction Générale", type: "Revue de direction", statut: "À venir" },
  { id: "e6", titre: "Briefing qualité hebdomadaire", flux: "reunions", date: "2026-05-03", responsable: "Salma El Idrissi", type: "Briefing", statut: "À venir" },
  { id: "e7", titre: "Révision PRO-LOG-01 (>12 mois)", flux: "doc", date: "2026-05-08", responsable: "Anas Benali", type: "Révision documentaire", statut: "En retard" },
  { id: "e8", titre: "Validité fiche technique FT-CONT-40", flux: "doc", date: "2026-06-01", responsable: "Direction Technique", type: "Alerte validité", statut: "À venir" },
];

const fluxConfig: Record<Flux, { label: string; icon: any; color: string }> = {
  audits: { label: "Audits", icon: ClipboardCheck, color: "bg-primary/10 text-primary border-primary/30" },
  kpi: { label: "Indicateurs (KPI)", icon: Activity, color: "bg-success/10 text-success border-success/30" },
  reunions: { label: "Réunions", icon: Users, color: "bg-accent/10 text-accent-foreground border-accent/30" },
  doc: { label: "Maintenance documentaire", icon: FileText, color: "bg-warning/10 text-warning border-warning/30" },
};

export default function Planning() {
  const [filter, setFilter] = useState<Flux | "all">("all");
  const filtered = filter === "all" ? events : events.filter(e => e.flux === filter);

  return (
    <>
      <PageHeader
        title="Planning & Calendrier"
        description="4 flux segmentés — Audits, Indicateurs, Réunions, Maintenance documentaire"
        icon={<CalendarIcon className="h-5 w-5" />}
        actions={<Button><Plus className="h-4 w-4 mr-2" />Nouvel événement</Button>}
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {(Object.keys(fluxConfig) as Flux[]).map(f => {
          const cfg = fluxConfig[f];
          const count = events.filter(e => e.flux === f).length;
          const Icon = cfg.icon;
          return (
            <Card key={f} className={cn("cursor-pointer transition-all hover:shadow-elegant", filter === f && "ring-2 ring-primary")} onClick={() => setFilter(filter === f ? "all" : f)}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className={cn("h-8 w-8 rounded-md border flex items-center justify-center", cfg.color)}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <span className="text-2xl font-bold">{count}</span>
                </div>
                <div className="text-sm font-medium">{cfg.label}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Tabs defaultValue="liste">
        <TabsList>
          <TabsTrigger value="liste">Liste</TabsTrigger>
          <TabsTrigger value="alertes">Alertes</TabsTrigger>
          <TabsTrigger value="calendrier">Vue calendrier</TabsTrigger>
        </TabsList>

        <TabsContent value="liste">
          <Card>
            <CardContent className="p-0">
              <div className="divide-y divide-border">
                {filtered.map(e => {
                  const cfg = fluxConfig[e.flux];
                  const Icon = cfg.icon;
                  return (
                    <div key={e.id} className="flex items-center gap-3 p-3 hover:bg-muted/30">
                      <div className={cn("h-9 w-9 rounded-md border flex items-center justify-center shrink-0", cfg.color)}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm">{e.titre}</div>
                        <div className="text-xs text-muted-foreground">{e.type} · {e.responsable}</div>
                      </div>
                      <div className="text-xs font-mono text-muted-foreground">{e.date}</div>
                      <Badge variant={e.statut === "En retard" ? "destructive" : e.statut === "Terminé" ? "default" : "outline"}>{e.statut}</Badge>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="alertes">
          <Card>
            <CardHeader><CardTitle className="text-base flex items-center gap-2"><Bell className="h-4 w-4" />Alertes automatiques</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              <div className="p-3 rounded-md bg-warning/10 border border-warning/30 flex items-center gap-3">
                <FileText className="h-4 w-4 text-warning" />
                <div className="text-xs flex-1"><strong>1 document non révisé depuis &gt;12 mois :</strong> PRO-LOG-01</div>
                <Button size="sm" variant="outline">Réviser</Button>
              </div>
              <div className="p-3 rounded-md bg-primary/10 border border-primary/30 flex items-center gap-3">
                <Activity className="h-4 w-4 text-primary" />
                <div className="text-xs flex-1"><strong>Saisie KPI à effectuer :</strong> Direction Logistique (mensuels) — échéance 5 mai</div>
                <Button size="sm" variant="outline">Saisir</Button>
              </div>
              <div className="p-3 rounded-md bg-accent/10 border border-accent/30 flex items-center gap-3">
                <Users className="h-4 w-4" />
                <div className="text-xs flex-1"><strong>Revue de direction Q2 dans 45 jours</strong> — convocations à envoyer</div>
                <Button size="sm" variant="outline">Préparer</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="calendrier">
          <Card>
            <CardContent className="p-6">
              <div className="grid grid-cols-7 gap-2 text-center">
                {["L", "M", "M", "J", "V", "S", "D"].map((d, i) => (
                  <div key={i} className="text-xs font-medium text-muted-foreground py-2">{d}</div>
                ))}
                {Array.from({ length: 35 }).map((_, i) => {
                  const day = i - 3;
                  const hasEvent = [3, 5, 12, 15, 20].includes(day);
                  return (
                    <div key={i} className={cn(
                      "aspect-square rounded-md border border-border p-1.5 text-xs",
                      day < 1 || day > 31 ? "opacity-30" : "",
                      hasEvent && "bg-primary/10 border-primary/30 font-semibold"
                    )}>
                      {day > 0 && day <= 31 ? day : ""}
                      {hasEvent && <div className="h-1 w-1 bg-primary rounded-full mx-auto mt-1" />}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </>
  );
}
