import { PageHeader } from "@/components/qh/PageHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatusBadge } from "@/components/qh/StatusBadge";
import { ParamCard, KPICard } from "@/components/qh/ParamCard";
import { Gauge, Plus, Settings2, AlertTriangle, Sparkles, Wrench, Calendar as CalIcon, CheckCircle2 } from "lucide-react";
import { equipements, organismesEtalonnage, typesIntervention, machines } from "@/lib/mock-data-extended";
import { useMemo } from "react";

export default function Metrologie() {
  const today = new Date();
  const alerts = useMemo(() => equipements.map(e => {
    const days = Math.round((new Date(e.prochaineEtalonnage).getTime() - today.getTime()) / 86400000);
    return { ...e, days };
  }).sort((a, b) => a.days - b.days), []);

  const aRenouveler = alerts.filter(e => e.days < 60).length;
  const enService = equipements.filter(e => e.etat === "operationnel").length;

  return (
    <div>
      <PageHeader
        icon={<Gauge className="h-5 w-5" />}
        title="Métrologie & Étalonnage"
        description="Inventaire des équipements de mesure et alertes d'expiration (ISO 7.1.5)"
        iso="7.1.5"
        actions={<>
          <Badge variant="secondary" className="gap-1.5"><Sparkles className="h-3 w-3" /> Plan IA</Badge>
          <Button size="sm"><Plus className="h-4 w-4 mr-1.5" />Nouvel équipement</Button>
        </>}
      />

      <div className="grid gap-3 md:grid-cols-4 mb-4">
        <KPICard title="Équipements" value={equipements.length} icon={<Gauge className="h-4 w-4" />} />
        <KPICard title="En service" value={enService} icon={<CheckCircle2 className="h-4 w-4 text-success" />} />
        <KPICard title="À renouveler < 60j" value={aRenouveler} icon={<AlertTriangle className="h-4 w-4 text-warning" />} />
        <KPICard title="Organismes" value={organismesEtalonnage.length} icon={<Wrench className="h-4 w-4" />} />
      </div>

      <Tabs defaultValue="equipements">
        <TabsList className="grid grid-cols-3 w-full max-w-xl">
          <TabsTrigger value="equipements">Équipements</TabsTrigger>
          <TabsTrigger value="alertes">Alertes</TabsTrigger>
          <TabsTrigger value="param">Paramétrage</TabsTrigger>
        </TabsList>

        <TabsContent value="equipements" className="mt-4">
          <Card>
            <CardHeader className="pb-3"><CardTitle className="text-base">Inventaire ({equipements.length})</CardTitle></CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader><TableRow><TableHead>Code</TableHead><TableHead>Désignation</TableHead><TableHead>Machine</TableHead><TableHead>Responsable</TableHead><TableHead>État</TableHead><TableHead>Prochaine étalonnage</TableHead><TableHead>Historique</TableHead></TableRow></TableHeader>
                <TableBody>
                  {alerts.map(e => (
                    <TableRow key={e.code}>
                      <TableCell className="font-mono text-xs">{e.code}</TableCell>
                      <TableCell><div className="font-medium text-sm">{e.designation}</div><div className="text-xs text-muted-foreground">MES: {e.miseEnService}</div></TableCell>
                      <TableCell className="text-xs">{e.machine}</TableCell>
                      <TableCell className="text-xs">{e.responsable}</TableCell>
                      <TableCell><StatusBadge status={e.etat === "operationnel" ? "conforme" : e.etat === "etalonnage" ? "surveillance" : "critique"} label={e.etat} /></TableCell>
                      <TableCell><div className="text-xs">{e.prochaineEtalonnage}</div><div className="text-[10px] text-muted-foreground">{e.days < 0 ? `Retard ${Math.abs(e.days)}j` : `Dans ${e.days}j`}</div></TableCell>
                      <TableCell className="text-xs">{e.historique.length} intervention(s)</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="alertes" className="mt-4 space-y-3">
          <Card className="border-warning/30 bg-warning/5">
            <CardHeader><CardTitle className="text-sm flex items-center gap-2"><AlertTriangle className="h-4 w-4 text-warning" />Équipements à étalonner sous 60j</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              {alerts.filter(e => e.days < 60).map(e => (
                <div key={e.code} className="flex items-center justify-between p-3 rounded border bg-card">
                  <div>
                    <div className="font-medium text-sm">{e.designation} <span className="font-mono text-[10px] text-muted-foreground ml-1">{e.code}</span></div>
                    <div className="text-xs text-muted-foreground">Responsable: {e.responsable}</div>
                  </div>
                  <div className="text-right">
                    <StatusBadge status={e.days < 0 ? "critique" : e.days < 30 ? "critique" : "surveillance"} label={e.days < 0 ? `Retard ${Math.abs(e.days)}j` : `${e.days}j`} />
                    <div className="text-[11px] text-muted-foreground mt-1">{e.prochaineEtalonnage}</div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="border-primary/20 bg-primary/5">
            <CardHeader className="pb-3"><CardTitle className="text-sm flex items-center gap-2"><Sparkles className="h-4 w-4 text-primary" />Plan d'étalonnage IA — prochains 90j</CardTitle></CardHeader>
            <CardContent className="text-sm space-y-1.5">
              <p>L'IA propose de regrouper les étalonnages BAL-204 et PCM-007 chez LPEE Maroc — économie estimée: <span className="font-semibold">3 200 MAD</span>.</p>
              <Button size="sm" variant="outline">Générer les bons de commande</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="param" className="mt-4">
          <div className="grid gap-4 md:grid-cols-2">
            <ParamCard title="Organismes de Vérification / Étalonnage" items={organismesEtalonnage} />
            <ParamCard title="Types d'intervention" items={typesIntervention} />
            <ParamCard title="Machines" items={machines} />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
