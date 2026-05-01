import { useState } from "react";
import { Users, Plus, Bell, AlertCircle, CheckCircle2, Scale, Heart, Wallet } from "lucide-react";
import { PageHeader } from "@/components/qh/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { ParamCard, KPICard } from "@/components/qh/ParamCard";
import { toast } from "sonner";

type Categorie = "Légal" | "Financier" | "Social" | "Environnemental" | "Opérationnel";
type Statut = "À traiter" | "En cours" | "Conforme" | "Écart";

interface PartieInteressee {
  id: string;
  nom: string;
  type: "Interne" | "Externe";
  categorie: string;
  besoins: { id: string; libelle: string; cat: Categorie; responsable: string; statut: Statut; echeance?: string }[];
}

const initial: PartieInteressee[] = [
  {
    id: "p1", nom: "Autorités douanières", type: "Externe", categorie: "Réglementaire",
    besoins: [
      { id: "b1", libelle: "Conformité Code des Douanes 2024", cat: "Légal", responsable: "Direction Juridique", statut: "Conforme", echeance: "2026-12-31" },
      { id: "b2", libelle: "Déclarations électroniques BADR", cat: "Légal", responsable: "Direction Logistique", statut: "En cours", echeance: "2026-06-30" },
    ]
  },
  {
    id: "p2", nom: "Actionnaires", type: "Interne", categorie: "Gouvernance",
    besoins: [
      { id: "b3", libelle: "Reporting financier trimestriel", cat: "Financier", responsable: "Direction Générale", statut: "Conforme" },
      { id: "b4", libelle: "ROI > 12% sur exercice 2026", cat: "Financier", responsable: "Direction Générale", statut: "À traiter" },
    ]
  },
  {
    id: "p3", nom: "Salariés", type: "Interne", categorie: "Social",
    besoins: [
      { id: "b5", libelle: "Formation continue (40h/an/employé)", cat: "Social", responsable: "RH", statut: "En cours" },
      { id: "b6", libelle: "Sécurité au travail — TF < 5", cat: "Social", responsable: "HSE", statut: "Écart", echeance: "2026-05-15" },
    ]
  },
  {
    id: "p4", nom: "Clients stratégiques", type: "Externe", categorie: "Commercial",
    besoins: [
      { id: "b7", libelle: "OTIF ≥ 95%", cat: "Opérationnel", responsable: "Direction Commerciale", statut: "Conforme" },
      { id: "b8", libelle: "Certification ISO 9001 maintenue", cat: "Légal", responsable: "Direction Qualité", statut: "Conforme" },
    ]
  },
  {
    id: "p5", nom: "Communautés locales", type: "Externe", categorie: "Sociétal",
    besoins: [
      { id: "b9", libelle: "Empreinte carbone < seuil 2025", cat: "Environnemental", responsable: "HSE", statut: "À traiter" },
    ]
  },
];

const catIcon: Record<Categorie, any> = {
  "Légal": Scale, "Financier": Wallet, "Social": Heart, "Environnemental": Heart, "Opérationnel": CheckCircle2,
};

const statutVariant = (s: Statut) =>
  s === "Conforme" ? "default" : s === "Écart" ? "destructive" : s === "En cours" ? "secondary" : "outline";

export default function PartiesInteressees() {
  const [parties] = useState(initial);
  const allBesoins = parties.flatMap(p => p.besoins.map(b => ({ ...b, partie: p.nom })));
  const tauxConformite = Math.round((allBesoins.filter(b => b.statut === "Conforme").length / allBesoins.length) * 100);

  return (
    <>
      <PageHeader
        title="Parties Intéressées"
        description="Identification des PI, attentes & besoins (légaux, financiers, sociaux) — notification automatique du responsable concerné"
        iso="4.2"
        icon={<Users className="h-5 w-5" />}
        actions={<Button><Plus className="h-4 w-4 mr-2" />Nouvelle partie intéressée</Button>}
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <KPICard title="Parties identifiées" value={parties.length} icon={<Users className='h-4 w-4' />} />
        <KPICard title="Besoins / attentes" value={allBesoins.length} icon={<Bell className='h-4 w-4' />} />
        <KPICard title="Taux de conformité" value={`${tauxConformite}%`} icon={CheckCircle2} />
        <KPICard title="Écarts ouverts" value={allBesoins.filter(b => b.statut === "Écart").length} icon={<AlertCircle className='h-4 w-4' />} />
      </div>

      <Tabs defaultValue="cartographie">
        <TabsList>
          <TabsTrigger value="cartographie">Cartographie</TabsTrigger>
          <TabsTrigger value="besoins">Besoins & Attentes</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="parametrage">Paramétrage</TabsTrigger>
        </TabsList>

        <TabsContent value="cartographie" className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            {parties.map(p => {
              const conformes = p.besoins.filter(b => b.statut === "Conforme").length;
              const taux = Math.round((conformes / p.besoins.length) * 100);
              return (
                <Card key={p.id}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base">{p.nom}</CardTitle>
                      <Badge variant={p.type === "Interne" ? "secondary" : "outline"}>{p.type}</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">{p.categorie}</p>
                  </CardHeader>
                  <CardContent>
                    <div className="text-xs mb-2 flex justify-between">
                      <span>Conformité</span><span className="font-mono">{taux}%</span>
                    </div>
                    <Progress value={taux} className="h-1.5 mb-3" />
                    <div className="space-y-1.5">
                      {p.besoins.map(b => {
                        const Icon = catIcon[b.cat];
                        return (
                          <div key={b.id} className="flex items-center gap-2 text-xs">
                            <Icon className="h-3 w-3 text-muted-foreground shrink-0" />
                            <span className="flex-1 truncate">{b.libelle}</span>
                            <Badge variant={statutVariant(b.statut)} className="text-[9px]">{b.statut}</Badge>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="besoins">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Besoin / Attente</TableHead>
                    <TableHead>Partie</TableHead>
                    <TableHead>Catégorie</TableHead>
                    <TableHead>Responsable</TableHead>
                    <TableHead>Échéance</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {allBesoins.map(b => (
                    <TableRow key={b.id}>
                      <TableCell className="font-medium">{b.libelle}</TableCell>
                      <TableCell className="text-sm">{b.partie}</TableCell>
                      <TableCell><Badge variant="outline" className="text-[10px]">{b.cat}</Badge></TableCell>
                      <TableCell className="text-sm">{b.responsable}</TableCell>
                      <TableCell className="text-xs font-mono">{b.echeance ?? "—"}</TableCell>
                      <TableCell><Badge variant={statutVariant(b.statut)}>{b.statut}</Badge></TableCell>
                      <TableCell className="text-right">
                        <Button size="sm" variant="ghost" onClick={() => toast.success(`Notification envoyée à ${b.responsable}`)}>
                          <Bell className="h-3 w-3 mr-1" />Notifier
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader><CardTitle className="text-base">Notifications automatiques aux responsables</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              {allBesoins.filter(b => b.statut === "Écart" || b.statut === "À traiter").map(b => (
                <div key={b.id} className="flex items-center gap-3 p-3 rounded-lg border border-border">
                  <AlertCircle className="h-4 w-4 text-warning shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">{b.libelle}</div>
                    <div className="text-xs text-muted-foreground">→ {b.responsable} · {b.partie}</div>
                  </div>
                  <Button size="sm" variant="outline">Plan d'action</Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="parametrage" className="grid md:grid-cols-2 gap-4">
          <ParamCard title="Catégories de besoins" items={["Légal", "Financier", "Social", "Environnemental", "Opérationnel", "Sécurité"]} />
          <ParamCard title="Types de PI" items={["Interne", "Externe", "Stratégique", "Opérationnel"]} />
        </TabsContent>
      </Tabs>
    </>
  );
}
