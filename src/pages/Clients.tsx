import { PageHeader } from "@/components/qh/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatusBadge } from "@/components/qh/StatusBadge";
import { ParamCard, KPICard } from "@/components/qh/ParamCard";
import { Users, Plus, Sparkles, MessageSquare, ClipboardList, Lightbulb, Star, Loader2 } from "lucide-react";
import { clients, reclamationsClient, enquetesSatisfaction, suggestionsClient, typesClient, categoriesClient, regionsClient, typesReclamation, gravitesReclamation, typesDecision, typesSuggestion } from "@/lib/mock-data-extended";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input as InputField } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { get, post } from "@/lib/api";
import { useState, useEffect } from "react";

export default function Clients() {
  const [items, setItems] = useState<any[]>(clients);
  const [loading, setLoading] = useState(true);
  const [openNew, setOpenNew] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      const data: any = await get("/api/clients");
      setItems(data.data.length > 0 ? data.data : clients);
    } catch (error) {
      console.error("Failed to fetch clients", error);
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
      await post("/api/clients", payload);
      toast.success("Client créé avec succès");
      setOpenNew(false);
      fetchClients();
    } catch (error) {
      toast.error("Erreur lors de la création du client");
    } finally {
      setSubmitting(false);
    }
  };

  const satMoy = (items.reduce((s, c) => s + (c.satisfaction || 0), 0) / (items.length || 1)).toFixed(1);
  
  return (
    <div>
      <PageHeader
        icon={<Users className="h-5 w-5" />}
        title="Clients & Parties Intéressées"
        description="Réclamations, satisfaction, suggestions clients (ISO 9.1.2)"
        iso="9.1.2"
        actions={
          <>
            <Dialog open={openNew} onOpenChange={setOpenNew}>
              <DialogTrigger asChild>
                <Button size="sm"><Plus className="h-4 w-4 mr-1.5" />Nouveau client</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Ajouter un nouveau client</DialogTitle>
                  <DialogDescription>Renseignez les informations de base du client.</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleCreate}>
                  <div className="grid gap-4 py-4">
                    <div className="space-y-1">
                      <Label>Raison sociale</Label>
                      <InputField name="raisonSociale" placeholder="Ex: OCP Group" required />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <Label>Code</Label>
                        <InputField name="code" placeholder="Ex: CLT-052" required />
                      </div>
                      <div className="space-y-1">
                        <Label>Type</Label>
                        <Select name="type">
                          <SelectTrigger><SelectValue placeholder="Choisir..." /></SelectTrigger>
                          <SelectContent>{typesClient.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <Label>Région</Label>
                        <Select name="region">
                          <SelectTrigger><SelectValue placeholder="Choisir..." /></SelectTrigger>
                          <SelectContent>{regionsClient.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}</SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-1">
                        <Label>Catégorie</Label>
                        <Select name="categorie">
                          <SelectTrigger><SelectValue placeholder="Choisir..." /></SelectTrigger>
                          <SelectContent>{categoriesClient.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                        </Select>
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
          </>
        }
      />

      <div className="grid gap-3 md:grid-cols-4 mb-4">
        <KPICard title="Clients" value={items.length} />
        <KPICard title="Satisfaction moy." value={`${satMoy}/5`} icon={<Star className="h-4 w-4 text-warning" />} />
        <KPICard title="Réclamations" value={reclamationsClient.length} icon={<MessageSquare className="h-4 w-4" />} />
        <KPICard title="Enquêtes actives" value={enquetesSatisfaction.length} icon={<ClipboardList className="h-4 w-4" />} />
      </div>

      <Tabs defaultValue="clients">
        <TabsList className="grid grid-cols-5 w-full max-w-3xl">
          <TabsTrigger value="clients">Clients</TabsTrigger>
          <TabsTrigger value="reclamations">Réclamations</TabsTrigger>
          <TabsTrigger value="satisfaction">Satisfaction</TabsTrigger>
          <TabsTrigger value="suggestions">Suggestions</TabsTrigger>
          <TabsTrigger value="param">Paramétrage</TabsTrigger>
        </TabsList>

        <TabsContent value="clients" className="mt-4">
          <Card><CardContent className="p-0">
            {loading ? (
              <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>
            ) : (
              <Table>
                <TableHeader><TableRow><TableHead>Code</TableHead><TableHead>Raison sociale</TableHead><TableHead>Type</TableHead><TableHead>Catégorie</TableHead><TableHead>Région</TableHead><TableHead>CA</TableHead><TableHead>Satisfaction</TableHead></TableRow></TableHeader>
                <TableBody>
                  {items.map(c => (
                    <TableRow key={c.code}>
                      <TableCell className="font-mono text-xs">{c.code}</TableCell>
                      <TableCell><div className="font-medium">{c.raisonSociale}</div><div className="text-xs text-muted-foreground">{c.email}</div></TableCell>
                      <TableCell><Badge variant="outline" className="text-[10px]">{c.type}</Badge></TableCell>
                      <TableCell className="text-xs">{c.categorie}</TableCell>
                      <TableCell className="text-xs">{c.region}</TableCell>
                      <TableCell className="text-xs">{c.ca?.toLocaleString()} MAD</TableCell>
                      <TableCell><StatusBadge status={(c.satisfaction || 0) >= 4 ? "conforme" : (c.satisfaction || 0) >= 3 ? "surveillance" : "critique"} label={`${c.satisfaction || 0}/5`} /></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent></Card>
        </TabsContent>

        <TabsContent value="reclamations" className="mt-4 space-y-2">
          {reclamationsClient.map(r => (
            <Card key={r.ref}><CardContent className="pt-4">
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-[10px] bg-muted px-1.5 py-0.5 rounded">{r.ref}</span>
                    <StatusBadge status={r.gravite === "Critique" ? "critique" : r.gravite === "Majeure" ? "surveillance" : "info"} label={r.gravite} />
                    <Badge variant="outline" className="text-[10px]">{r.type}</Badge>
                    {r.avecRetour && <Badge variant="destructive" className="text-[10px]">Avec retour</Badge>}
                    <Badge variant="secondary" className="text-[10px]">{r.statut === "traitee" ? "Traitée" : "Décision en cours"}</Badge>
                  </div>
                  <div className="font-medium mt-1">{r.client}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{r.date} · {r.site} · Décideur: {r.decideur}</div>
                  {r.traitement && <div className="text-sm mt-2 p-2 rounded bg-muted/40">Traitement : {r.traitement}</div>}
                </div>
                {r.actionId && <Badge variant="outline" className="font-mono text-[10px]">{r.actionId}</Badge>}
              </div>
            </CardContent></Card>
          ))}
        </TabsContent>

        <TabsContent value="satisfaction" className="mt-4 space-y-3">
          {enquetesSatisfaction.map(e => (
            <Card key={e.ref}><CardContent className="pt-4">
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-[10px] bg-muted px-1.5 py-0.5 rounded">{e.ref}</span>
                    <Badge variant={e.mode === "client" ? "default" : "secondary"} className="text-[10px]">{e.mode === "client" ? "Mode client" : "Mode anonyme"}</Badge>
                  </div>
                  <div className="font-semibold mt-1">{e.titre}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{e.debut} → {e.fin}</div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold">{e.scoreMoyen}{e.mode === "anonyme" ? "/10" : "/5"}</div>
                  <div className="text-xs text-muted-foreground">{e.repondants}/{e.total} répondants</div>
                </div>
              </div>
              <div className="mt-2 h-1.5 rounded-full bg-muted overflow-hidden"><div className="h-full bg-gradient-primary" style={{ width: `${(e.repondants / e.total) * 100}%` }} /></div>
            </CardContent></Card>
          ))}
        </TabsContent>

        <TabsContent value="suggestions" className="mt-4 space-y-2">
          {suggestionsClient.map(s => (
            <Card key={s.ref}><CardContent className="pt-4">
              <div className="flex items-start gap-3">
                <Lightbulb className="h-5 w-5 text-warning shrink-0 mt-0.5" />
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-[10px] bg-muted px-1.5 py-0.5 rounded">{s.ref}</span>
                    <Badge variant="outline" className="text-[10px]">{s.type}</Badge>
                    <span className="text-xs text-muted-foreground">{s.date} · {s.client}</span>
                  </div>
                  <div className="text-sm mt-1.5">{s.contenu}</div>
                </div>
              </div>
            </CardContent></Card>
          ))}
        </TabsContent>

        <TabsContent value="param" className="mt-4">
          <div className="grid gap-4 md:grid-cols-2">
            <ParamCard title="Types de clients" items={typesClient} />
            <ParamCard title="Catégories" items={categoriesClient} />
            <ParamCard title="Régions" items={regionsClient} />
            <ParamCard title="Types de réclamations" items={typesReclamation} />
            <ParamCard title="Gravités réclamations" items={gravitesReclamation} />
            <ParamCard title="Types de décisions" items={typesDecision} />
            <ParamCard title="Types de suggestions" items={typesSuggestion} />
            <ParamCard title="Questionnaires satisfaction" items={["NPS standard", "Enquête trimestrielle complète", "Mini-enquête post-livraison"]} note="Questions: choix multiple, matrice, numérique, ouverte" />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
