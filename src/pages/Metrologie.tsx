import { PageHeader } from "@/components/qh/PageHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatusBadge } from "@/components/qh/StatusBadge";
import { ParamCard, KPICard } from "@/components/qh/ParamCard";
import { Gauge, Plus, Settings2, AlertTriangle, Sparkles, Wrench, Calendar as CalIcon, CheckCircle2, Loader2 } from "lucide-react";
import { equipements, organismesEtalonnage, typesIntervention, machines } from "@/lib/mock-data-extended";
import { useMemo, useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input as InputField } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { get, post } from "@/lib/api";

export default function Metrologie() {
  const [items, setItems] = useState<any[]>(equipements);
  const [loading, setLoading] = useState(true);
  const [openNew, setOpenNew] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchEquipements();
  }, []);

  const fetchEquipements = async () => {
    try {
      const data: any = await get("/api/metrologie");
      setItems(data.data.length > 0 ? data.data : equipements);
    } catch (error) {
      console.error("Failed to fetch equipements", error);
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
      await post("/api/metrologie", payload);
      toast.success("Équipement créé avec succès");
      setOpenNew(false);
      fetchEquipements();
    } catch (error) {
      toast.error("Erreur lors de la création de l'équipement");
    } finally {
      setSubmitting(false);
    }
  };

  const today = new Date();
  const alerts = useMemo(() => items.map(e => {
    const nextDate = e.prochaineEtalonnage ? new Date(e.prochaineEtalonnage) : today;
    const days = Math.round((nextDate.getTime() - today.getTime()) / 86400000);
    return { ...e, days };
  }).sort((a, b) => a.days - b.days), [items]);

  const aRenouveler = alerts.filter(e => e.days < 60).length;
  const enService = items.filter(e => e.etat === "operationnel").length;

  return (
    <div>
      <PageHeader
        icon={<Gauge className="h-5 w-5" />}
        title="Métrologie & Étalonnage"
        description="Inventaire des équipements de mesure et alertes d'expiration (ISO 7.1.5)"
        iso="7.1.5"
        actions={<>
          <Dialog open={openNew} onOpenChange={setOpenNew}>
            <DialogTrigger asChild>
              <Button size="sm"><Plus className="h-4 w-4 mr-1.5" />Nouvel équipement</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Ajouter un équipement</DialogTitle>
                <DialogDescription>Renseignez les détails métrologiques de l'instrument.</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleCreate}>
                <div className="grid gap-3 py-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <Label>Code</Label>
                      <InputField name="code" placeholder="Ex: BAL-204" required />
                    </div>
                    <div className="space-y-1">
                      <Label>État</Label>
                      <Select name="etat" defaultValue="operationnel">
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="operationnel">Opérationnel</SelectItem>
                          <SelectItem value="etalonnage">En étalonnage</SelectItem>
                          <SelectItem value="en_reparation">En réparation</SelectItem>
                          <SelectItem value="hors_service">Hors service</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <Label>Désignation</Label>
                    <InputField name="designation" placeholder="Ex: Balance de précision 0.01g" required />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <Label>Machine / Affectation</Label>
                      <InputField name="machine" placeholder="Ex: Machine A" />
                    </div>
                    <div className="space-y-1">
                      <Label>Responsable</Label>
                      <InputField name="responsable" placeholder="Nom du responsable..." />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <Label>Prochaine étalonnage (Date)</Label>
                    <InputField name="prochaineEtalonnage" type="date" required />
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
        <KPICard title="Équipements" value={items.length} icon={<Gauge className="h-4 w-4" />} />
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
            <CardHeader className="pb-3"><CardTitle className="text-base">Inventaire ({items.length})</CardTitle></CardHeader>
            <CardContent className="p-0">
              {loading ? (
                <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>
              ) : (
                <Table>
                  <TableHeader><TableRow><TableHead>Code</TableHead><TableHead>Désignation</TableHead><TableHead>Machine</TableHead><TableHead>Responsable</TableHead><TableHead>État</TableHead><TableHead>Prochaine étalonnage</TableHead><TableHead>Historique</TableHead></TableRow></TableHeader>
                  <TableBody>
                    {alerts.map(e => (
                      <TableRow key={e.code}>
                        <TableCell className="font-mono text-xs">{e.code}</TableCell>
                        <TableCell>
                          <div className="font-medium text-sm">{e.designation}</div>
                          <div className="text-xs text-muted-foreground">MES: {e.miseEnService || "N/A"}</div>
                        </TableCell>
                        <TableCell className="text-xs">{e.machine}</TableCell>
                        <TableCell className="text-xs">{e.responsable}</TableCell>
                        <TableCell><StatusBadge status={e.etat === "operationnel" ? "conforme" : e.etat === "etalonnage" ? "surveillance" : "critique"} label={e.etat} /></TableCell>
                        <TableCell>
                          <div className="text-xs">{e.prochaineEtalonnage ? new Date(e.prochaineEtalonnage).toLocaleDateString() : "-"}</div>
                          <div className="text-[10px] text-muted-foreground">
                            {e.days != null ? (e.days < 0 ? `Retard ${Math.abs(e.days)}j` : `Dans ${e.days}j`) : "-"}
                          </div>
                        </TableCell>
                        <TableCell className="text-xs">{e.historique?.length || 0} intervention(s)</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
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
