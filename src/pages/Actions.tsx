import { useState } from "react";
import { PageHeader } from "@/components/qh/PageHeader";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/qh/StatusBadge";
import { Target, Plus, Sparkles, Filter, ArrowRight, Clock, User, Link2 } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

const actions = [
  { id: "ACT-001", titre: "Améliorer le contrôle douanier import", source: "Audit interne", pilote: "M. Cherkaoui", echeance: "15/05/2026", priorite: "Urgent", avancement: 65, statut: "surveillance" as const },
  { id: "ACT-002", titre: "Formation chauffeurs ADR", source: "Plan formation", pilote: "K. Tazi", echeance: "30/06/2026", priorite: "Moyen", avancement: 30, statut: "conforme" as const },
  { id: "ACT-003", titre: "Renouvellement étalonnage balance B-204", source: "Métrologie", pilote: "Y. Benjelloun", echeance: "05/05/2026", priorite: "Urgent", avancement: 10, statut: "critique" as const },
  { id: "ACT-004", titre: "Réponse réclamation client #2451", source: "Clients", pilote: "S. El Idrissi", echeance: "10/05/2026", priorite: "Urgent", avancement: 80, statut: "conforme" as const },
  { id: "ACT-005", titre: "Mise à jour fiche technique gasoil B7", source: "Veille réglementaire", pilote: "A. Benali", echeance: "20/05/2026", priorite: "Moyen", avancement: 45, statut: "surveillance" as const },
];

const sources = [
  { name: "Audits", count: 8, color: "hsl(var(--primary))" },
  { name: "Non-conformités", count: 12, color: "hsl(var(--destructive))" },
  { name: "Risques (AMDEC)", count: 5, color: "hsl(var(--warning))" },
  { name: "Clients", count: 4, color: "hsl(var(--accent))" },
  { name: "Fournisseurs", count: 3, color: "hsl(var(--success))" },
  { name: "Veille", count: 2, color: "hsl(var(--muted-foreground))" },
];

export default function Actions() {
  const [filter, setFilter] = useState<"all" | "urgent" | "encours">("all");
  const filtered = filter === "urgent" ? actions.filter(a => a.priorite === "Urgent") : filter === "encours" ? actions.filter(a => a.avancement < 100) : actions;

  return (
    <div>
      <PageHeader
        icon={<Target className="h-5 w-5" />}
        title="Plan d'Action"
        description="Hub central — système nerveux du SMQ. Centralise toutes les actions correctives, préventives et d'amélioration."
        iso="10.2"
        actions={
          <>
            <Badge variant="secondary" className="gap-1.5"><Sparkles className="h-3 w-3" /> IA Coach</Badge>
            <Button size="sm"><Plus className="h-4 w-4 mr-1.5" /> Nouvelle action</Button>
          </>
        }
      />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
        {[
          { l: "Total actions", v: 34, s: "info" as const },
          { l: "En cours", v: 22, s: "conforme" as const },
          { l: "Urgentes", v: 7, s: "critique" as const },
          { l: "Taux d'efficacité", v: "82%", s: "conforme" as const },
        ].map(k => (
          <Card key={k.l}><CardContent className="p-4">
            <div className="text-xs uppercase tracking-wider text-muted-foreground">{k.l}</div>
            <div className="flex items-baseline justify-between mt-1">
              <span className="text-2xl font-bold">{k.v}</span>
              <StatusBadge status={k.s} />
            </div>
          </CardContent></Card>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_280px]">
        <div>
          <Tabs value={filter} onValueChange={(v) => setFilter(v as any)}>
            <div className="flex items-center justify-between mb-3">
              <TabsList>
                <TabsTrigger value="all">Toutes ({actions.length})</TabsTrigger>
                <TabsTrigger value="urgent">Urgentes</TabsTrigger>
                <TabsTrigger value="encours">En cours</TabsTrigger>
              </TabsList>
              <Button variant="outline" size="sm"><Filter className="h-3.5 w-3.5 mr-1.5" /> Filtrer</Button>
            </div>
            <TabsContent value={filter} className="space-y-2">
              {filtered.map(a => (
                <Card key={a.id} className="hover:shadow-elegant hover:border-primary/30 transition-base">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="flex flex-col items-center gap-1 shrink-0">
                        <span className="font-mono text-[10px] text-muted-foreground">{a.id}</span>
                        <StatusBadge status={a.statut} label={a.priorite} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium">{a.titre}</div>
                        <div className="flex flex-wrap items-center gap-3 mt-1.5 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1"><Link2 className="h-3 w-3" /> {a.source}</span>
                          <span className="flex items-center gap-1"><User className="h-3 w-3" /> {a.pilote}</span>
                          <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {a.echeance}</span>
                        </div>
                        <div className="mt-3 flex items-center gap-3">
                          <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
                            <div className="h-full bg-gradient-primary" style={{ width: `${a.avancement}%` }} />
                          </div>
                          <span className="text-xs font-medium w-10 text-right">{a.avancement}%</span>
                        </div>
                      </div>
                      <Button variant="ghost" size="icon" className="shrink-0"><ArrowRight className="h-4 w-4" /></Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-3"><CardTitle className="text-sm">Sources d'actions</CardTitle><CardDescription className="text-xs">Flux centralisés</CardDescription></CardHeader>
            <CardContent className="space-y-2">
              {sources.map(s => (
                <div key={s.name} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2"><span className="h-2 w-2 rounded-full" style={{ background: s.color }} /><span>{s.name}</span></div>
                  <Badge variant="secondary">{s.count}</Badge>
                </div>
              ))}
            </CardContent>
          </Card>
          <Card className="border-primary/20 bg-primary/5">
            <CardHeader className="pb-3"><CardTitle className="text-sm flex items-center gap-2"><Sparkles className="h-4 w-4 text-primary" /> Suggestion IA</CardTitle></CardHeader>
            <CardContent className="text-sm space-y-2">
              <p>L'action <span className="font-mono text-xs">ACT-003</span> risque un retard. Cause probable suggérée :</p>
              <p className="italic text-muted-foreground">« Délai prestataire d'étalonnage non bloqué dans le calendrier maintenance »</p>
              <Button size="sm" variant="outline" className="w-full">Appliquer la suggestion</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
