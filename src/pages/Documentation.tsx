import { useState } from "react";
import { PageHeader } from "@/components/qh/PageHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { StatusBadge } from "@/components/qh/StatusBadge";
import { FileText, IdCard, GitBranch, BookOpen, Activity, Archive, Sparkles, Search, FileCheck, Plus, Loader2, Send } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const processes = [
  { code: "MNG-01", name: "Management", pilote: "A. Benali", iso: "5", status: "conforme" as const },
  { code: "REA-01", name: "Réalisation Logistique", pilote: "M. Cherkaoui", iso: "8", status: "surveillance" as const },
  { code: "REA-02", name: "Achats & Fournisseurs", pilote: "S. El Idrissi", iso: "8.4", status: "conforme" as const },
  { code: "SUP-01", name: "Ressources Humaines", pilote: "K. Tazi", iso: "7.1", status: "conforme" as const },
  { code: "SUP-02", name: "Maintenance & Métrologie", pilote: "Y. Benjelloun", iso: "7.1.5", status: "critique" as const },
];

const docs = [
  { code: "PRO-LOG-01", name: "Procédure expédition internationale", v: "v3.2", date: "12/03/2026", raci: "RA: Cherkaoui", status: "conforme" as const },
  { code: "INS-RH-04", name: "Instruction onboarding chauffeur", v: "v2.1", date: "08/01/2026", raci: "R: Tazi", status: "conforme" as const },
  { code: "FT-ACH-12", name: "Fiche technique gasoil B7", v: "v1.4", date: "20/11/2024", raci: "A: Benali", status: "surveillance" as const },
  { code: "MOD-QSE-09", name: "Mode opératoire contrôle douanier", v: "v1.0", date: "01/04/2026", raci: "R: Cherkaoui", status: "conforme" as const },
];

export default function Documentation() {
  const [selected, setSelected] = useState(processes[1]);
  const [chatQ, setChatQ] = useState("");
  const [chatA, setChatA] = useState("");
  const [busy, setBusy] = useState(false);

  const askAI = async () => {
    if (!chatQ.trim()) return;
    setBusy(true); setChatA("");
    try {
      const { data, error } = await supabase.functions.invoke("chat-with-doc", {
        body: { question: chatQ, processName: selected.name }
      });
      if (error) throw error;
      setChatA(data?.answer ?? "Aucune réponse.");
    } catch (e: any) {
      toast.error(e.message ?? "Erreur IA");
    } finally { setBusy(false); }
  };

  return (
    <div>
      <PageHeader
        icon={<FileText className="h-5 w-5" />}
        title="Documentation (GED)"
        description="Database centrale du SMQ — Modèle des 5 Axes propulsé par l'IA"
        iso="7.5"
        actions={
          <>
            <Badge variant="secondary" className="gap-1.5"><Sparkles className="h-3 w-3" /> IA Bibliothécaire</Badge>
            <Button size="sm"><Plus className="h-4 w-4 mr-1.5" /> Nouveau document</Button>
          </>
        }
      />

      <div className="grid gap-4 lg:grid-cols-[280px_1fr]">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Processus</CardTitle>
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input className="h-8 pl-8 text-sm" placeholder="Rechercher…" />
            </div>
          </CardHeader>
          <CardContent className="space-y-1.5 px-2 pb-3">
            {processes.map(p => (
              <button key={p.code} onClick={() => setSelected(p)}
                className={`w-full text-left px-2.5 py-2 rounded-md transition-base border ${selected.code === p.code ? "bg-primary/8 border-primary/30" : "border-transparent hover:bg-muted/60"}`}>
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-[10px] text-muted-foreground">{p.code}</span>
                  <StatusBadge status={p.status} label={p.status === "conforme" ? "OK" : p.status === "surveillance" ? "!" : "✕"} />
                </div>
                <div className="text-sm font-medium mt-0.5">{p.name}</div>
                <div className="text-[11px] text-muted-foreground">{p.pilote}</div>
              </button>
            ))}
          </CardContent>
        </Card>

        <div className="min-w-0">
          <Card className="mb-4">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs bg-muted px-1.5 py-0.5 rounded">{selected.code}</span>
                    <span className="text-[11px] font-mono text-muted-foreground">ISO {selected.iso}</span>
                  </div>
                  <CardTitle className="mt-1">{selected.name}</CardTitle>
                  <CardDescription>Pilote · {selected.pilote}</CardDescription>
                </div>
                <StatusBadge status={selected.status} />
              </div>
            </CardHeader>
          </Card>

          <Tabs defaultValue="axe1">
            <TabsList className="grid grid-cols-5 w-full">
              <TabsTrigger value="axe1" className="gap-1.5"><IdCard className="h-3.5 w-3.5" /><span className="hidden sm:inline">Identité</span></TabsTrigger>
              <TabsTrigger value="axe2" className="gap-1.5"><GitBranch className="h-3.5 w-3.5" /><span className="hidden sm:inline">Cartographie</span></TabsTrigger>
              <TabsTrigger value="axe3" className="gap-1.5"><BookOpen className="h-3.5 w-3.5" /><span className="hidden sm:inline">Procédures</span></TabsTrigger>
              <TabsTrigger value="axe4" className="gap-1.5"><Activity className="h-3.5 w-3.5" /><span className="hidden sm:inline">KPI</span></TabsTrigger>
              <TabsTrigger value="axe5" className="gap-1.5"><Archive className="h-3.5 w-3.5" /><span className="hidden sm:inline">Preuves</span></TabsTrigger>
            </TabsList>

            <TabsContent value="axe1" className="mt-4 space-y-4">
              <Card>
                <CardHeader><CardTitle className="text-base">Axe 1 — Fiche d'Identité & Gouvernance</CardTitle></CardHeader>
                <CardContent className="grid gap-4 md:grid-cols-2 text-sm">
                  {[
                    ["Code", selected.code], ["Nom", selected.name], ["Pilote (RACI: A)", selected.pilote],
                    ["Domaine d'application", "Sites Casablanca, Tanger Med, Marrakech"],
                    ["Éléments d'entrée", "Commandes clients, planning flotte, contrats fournisseurs"],
                    ["Éléments de sortie", "Bons de livraison, certificats, indicateurs"],
                    ["Ressources", "12 ETP · 47 véhicules · 3 entrepôts"],
                    ["Documents rattachés", "8 procédures · 14 instructions · 23 enregistrements"],
                  ].map(([k, v]) => (
                    <div key={k} className="border-b border-border pb-2">
                      <div className="text-[11px] uppercase tracking-wider text-muted-foreground">{k}</div>
                      <div className="font-medium mt-0.5">{v}</div>
                    </div>
                  ))}
                </CardContent>
              </Card>
              <Card className="border-primary/20 bg-primary/5">
                <CardHeader className="pb-3"><CardTitle className="text-sm flex items-center gap-2"><Sparkles className="h-4 w-4 text-primary" /> Glossaire généré par l'IA</CardTitle></CardHeader>
                <CardContent className="text-sm space-y-1.5">
                  <p><span className="font-mono text-xs bg-background px-1.5 py-0.5 rounded">SMQ</span> Système de Management de la Qualité</p>
                  <p><span className="font-mono text-xs bg-background px-1.5 py-0.5 rounded">PNC</span> Produit / Service Non Conforme</p>
                  <p><span className="font-mono text-xs bg-background px-1.5 py-0.5 rounded">RACI</span> Responsable, Approbateur, Consulté, Informé</p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="axe2" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Axe 2 — Cartographie du Processus</CardTitle>
                  <CardDescription>Workflow interactif — chaque étape est cliquable</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 overflow-x-auto pb-3">
                    {["Réception commande", "Préparation", "Contrôle Qualité", "Expédition", "Livraison"].map((s, i, arr) => (
                      <div key={s} className="flex items-center gap-2 shrink-0">
                        <div className={`px-4 py-3 rounded-lg border-2 text-sm font-medium ${i === 2 ? "bg-warning/10 border-warning text-warning-foreground" : "bg-card border-primary/30"}`}>
                          <div className="font-semibold">{s}</div>
                          <div className="text-[11px] text-muted-foreground mt-0.5">Étape {i + 1}</div>
                        </div>
                        {i < arr.length - 1 && <div className="text-muted-foreground">→</div>}
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 text-xs text-warning flex items-center gap-1.5">
                    <Sparkles className="h-3.5 w-3.5" /> L'IA détecte un goulot d'étranglement à l'étape "Contrôle Qualité".
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="axe3" className="mt-4 space-y-3">
              <Card className="border-primary/20 bg-primary/5">
                <CardHeader className="pb-3"><CardTitle className="text-sm flex items-center gap-2"><Sparkles className="h-4 w-4 text-primary" /> Chat-with-Doc</CardTitle>
                  <CardDescription>Posez une question — l'IA répond en citant la bonne procédure.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex gap-2">
                    <Input value={chatQ} onChange={e => setChatQ(e.target.value)} placeholder="Ex : Quelle est la procédure d'expédition internationale ?" onKeyDown={e => e.key === "Enter" && askAI()} />
                    <Button onClick={askAI} disabled={busy}>{busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}</Button>
                  </div>
                  {chatA && <div className="p-3 rounded-md bg-card border text-sm whitespace-pre-wrap">{chatA}</div>}
                </CardContent>
              </Card>
              <Card>
                <CardHeader><CardTitle className="text-base">Procédures & Instructions</CardTitle></CardHeader>
                <CardContent className="space-y-2">
                  {docs.map(d => (
                    <div key={d.code} className="flex items-center gap-3 p-3 rounded-lg border hover:border-primary/40 hover:bg-muted/40 transition-base">
                      <FileCheck className="h-5 w-5 text-primary shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-mono text-[10px] bg-muted px-1.5 py-0.5 rounded">{d.code}</span>
                          <span className="text-[11px] text-muted-foreground">{d.v} · {d.date}</span>
                          <span className="text-[11px] text-muted-foreground">{d.raci}</span>
                        </div>
                        <div className="font-medium text-sm mt-0.5">{d.name}</div>
                      </div>
                      <StatusBadge status={d.status} />
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="axe4" className="mt-4">
              <Card>
                <CardHeader><CardTitle className="text-base">Axe 4 — Pilotage & KPI</CardTitle></CardHeader>
                <CardContent className="grid gap-3 md:grid-cols-3">
                  {[
                    { n: "Délai moyen", v: "2.4 j", cible: "≤ 3 j", s: "conforme" as const },
                    { n: "Taux d'erreur", v: "1.8%", cible: "≤ 2%", s: "surveillance" as const },
                    { n: "Satisfaction", v: "4.3/5", cible: "≥ 4", s: "conforme" as const },
                  ].map(k => (
                    <div key={k.n} className="p-4 rounded-lg border">
                      <div className="text-xs uppercase tracking-wider text-muted-foreground">{k.n}</div>
                      <div className="text-2xl font-bold mt-1">{k.v}</div>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-muted-foreground">Cible: {k.cible}</span>
                        <StatusBadge status={k.s} />
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="axe5" className="mt-4">
              <Card>
                <CardHeader><CardTitle className="text-base">Axe 5 — Enregistrements & Preuves</CardTitle>
                  <CardDescription>Archivage intelligent par OCR et reconnaissance de mots-clés</CardDescription>
                </CardHeader>
                <CardContent>
                  <Textarea placeholder="Décrivez ou collez le contenu d'un enregistrement — l'IA classera automatiquement…" rows={4} />
                  <Button className="mt-3" size="sm"><Sparkles className="h-3.5 w-3.5 mr-1.5" /> Classer avec l'IA</Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
