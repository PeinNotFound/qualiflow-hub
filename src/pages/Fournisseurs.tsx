import { PageHeader } from "@/components/qh/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatusBadge } from "@/components/qh/StatusBadge";
import { ParamCard, KPICard } from "@/components/qh/ParamCard";
import { Truck, Plus, Sparkles, TrendingUp, TrendingDown, Minus, AlertTriangle } from "lucide-react";
import { fournisseurs, reclamationsFournisseur, categoriesFournisseur, typesProduit, criteresFournisseur, gravitesReclFournisseur } from "@/lib/mock-data-extended";

export default function Fournisseurs() {
  const moyenne = Math.round(fournisseurs.reduce((s, f) => s + f.scoreGlobal, 0) / fournisseurs.length);
  const agrees = fournisseurs.filter(f => f.agree).length;

  return (
    <div>
      <PageHeader
        icon={<Truck className="h-5 w-5" />}
        title="Fournisseurs"
        description="Évaluation, sélection prédictive et veille des contrats (ISO 8.4)"
        iso="8.4"
        actions={<><Badge variant="secondary" className="gap-1.5"><Sparkles className="h-3 w-3" /> IA Sélection</Badge><Button size="sm"><Plus className="h-4 w-4 mr-1.5" />Nouveau fournisseur</Button></>}
      />

      <div className="grid gap-3 md:grid-cols-4 mb-4">
        <KPICard title="Total" value={fournisseurs.length} />
        <KPICard title="Agréés" value={agrees} />
        <KPICard title="Score moyen" value={`${moyenne}/100`} />
        <KPICard title="Réclamations" value={reclamationsFournisseur.length} icon={<AlertTriangle className="h-4 w-4 text-warning" />} />
      </div>

      <Tabs defaultValue="liste">
        <TabsList className="grid grid-cols-4 w-full max-w-2xl">
          <TabsTrigger value="liste">Fournisseurs</TabsTrigger>
          <TabsTrigger value="evaluations">Évaluations</TabsTrigger>
          <TabsTrigger value="reclamations">Réclamations</TabsTrigger>
          <TabsTrigger value="param">Paramétrage</TabsTrigger>
        </TabsList>

        <TabsContent value="liste" className="mt-4">
          <Card><CardContent className="p-0"><Table>
            <TableHeader><TableRow><TableHead>Code</TableHead><TableHead>Raison sociale</TableHead><TableHead>Catégorie</TableHead><TableHead>Types produits</TableHead><TableHead>Agréé</TableHead><TableHead>Score</TableHead><TableHead>Tendance</TableHead><TableHead>Réclamations</TableHead></TableRow></TableHeader>
            <TableBody>
              {fournisseurs.map(f => (
                <TableRow key={f.code}>
                  <TableCell className="font-mono text-xs">{f.code}</TableCell>
                  <TableCell><div className="font-medium">{f.raisonSociale}</div><div className="text-xs text-muted-foreground">Éval. {f.derniereEval}</div></TableCell>
                  <TableCell><Badge variant="outline" className="text-[10px]">{f.categorie}</Badge></TableCell>
                  <TableCell className="text-xs">{f.types.join(", ")}</TableCell>
                  <TableCell>{f.agree ? <Badge variant="default" className="text-[10px]">Oui</Badge> : <Badge variant="destructive" className="text-[10px]">Non</Badge>}</TableCell>
                  <TableCell><StatusBadge status={f.scoreGlobal >= 75 ? "conforme" : f.scoreGlobal >= 60 ? "surveillance" : "critique"} label={`${f.scoreGlobal}/100`} /></TableCell>
                  <TableCell>{f.tendance === "up" ? <TrendingUp className="h-4 w-4 text-success" /> : f.tendance === "down" ? <TrendingDown className="h-4 w-4 text-destructive" /> : <Minus className="h-4 w-4 text-muted-foreground" />}</TableCell>
                  <TableCell className="text-sm">{f.reclamations}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table></CardContent></Card>
        </TabsContent>

        <TabsContent value="evaluations" className="mt-4">
          <Card>
            <CardHeader><CardTitle className="text-base">Grille d'évaluation par critères</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {fournisseurs.map(f => (
                <div key={f.code} className="border rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-medium text-sm">{f.raisonSociale} <span className="font-mono text-[10px] text-muted-foreground ml-2">{f.code}</span></div>
                    <StatusBadge status={f.scoreGlobal >= 75 ? "conforme" : f.scoreGlobal >= 60 ? "surveillance" : "critique"} label={`${f.scoreGlobal}/100`} />
                  </div>
                  <div className="grid gap-2 md:grid-cols-5">
                    {criteresFournisseur.map(c => {
                      const note = Math.round((f.scoreGlobal / 100) * 5 + (Math.random() - 0.5));
                      return (
                        <div key={c.name} className="text-xs p-2 rounded bg-muted/40">
                          <div className="text-muted-foreground">{c.name}</div>
                          <div className="font-bold mt-0.5">{Math.max(1, Math.min(5, note))}/5</div>
                          <div className="text-[10px] text-muted-foreground">coef. {c.coef}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reclamations" className="mt-4">
          <Card><CardContent className="p-0"><Table>
            <TableHeader><TableRow><TableHead>Réf.</TableHead><TableHead>Fournisseur</TableHead><TableHead>Date</TableHead><TableHead>Gravité</TableHead><TableHead>Motif</TableHead><TableHead>Action</TableHead></TableRow></TableHeader>
            <TableBody>
              {reclamationsFournisseur.map(r => (
                <TableRow key={r.ref}>
                  <TableCell className="font-mono text-xs">{r.ref}</TableCell>
                  <TableCell className="font-medium">{r.fournisseur}</TableCell>
                  <TableCell className="text-xs">{r.date}</TableCell>
                  <TableCell><StatusBadge status={r.gravite === "Critique" ? "critique" : r.gravite === "Majeure" ? "surveillance" : "info"} label={r.gravite} /></TableCell>
                  <TableCell className="text-sm max-w-md">{r.motif}</TableCell>
                  <TableCell>{r.actionId ? <Badge variant="outline" className="font-mono text-[10px]">{r.actionId}</Badge> : <span className="text-xs text-muted-foreground">—</span>}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table></CardContent></Card>
        </TabsContent>

        <TabsContent value="param" className="mt-4">
          <div className="grid gap-4 md:grid-cols-2">
            <ParamCard title="Catégories de fournisseurs" items={categoriesFournisseur} />
            <ParamCard title="Types de produits" items={typesProduit.map(t => `${t.name} (éval. ${t.periodiciteEval})`)} />
            <ParamCard title="Critères d'évaluation" items={criteresFournisseur.map(c => `${c.name} — coef. ${c.coef}`)} note={`Σ = ${criteresFournisseur.reduce((s, c) => s + c.coef, 0)}/100`} />
            <ParamCard title="Gravités réclamations" items={gravitesReclFournisseur} />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
