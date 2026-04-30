import { useState } from "react";
import { PageHeader } from "@/components/qh/PageHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatusBadge } from "@/components/qh/StatusBadge";
import { ClipboardCheck, Plus, Settings2, Sparkles, FileText, Users, AlertTriangle, CheckCircle2, ShieldAlert, MapPin, Clock, Send } from "lucide-react";
import {
  audits as initialAudits, champsAudit, typesAudit, typesEcart, gravites, auditeursExternes,
  employees, type Audit, type AuditStatut, graviteColor,
} from "@/lib/mock-data";
import { toast } from "sonner";

const statutAudit: Record<AuditStatut, { label: string; status: "info" | "conforme" | "surveillance" | "critique" }> = {
  planifie: { label: "Planifié", status: "info" },
  realise: { label: "Réalisé", status: "surveillance" },
  rapport: { label: "Rapport en validation", status: "surveillance" },
  valide: { label: "Validé", status: "conforme" },
  clos: { label: "Clos", status: "conforme" },
};

export default function Audits() {
  const [audits, setAudits] = useState<Audit[]>(initialAudits);
  const [selected, setSelected] = useState<Audit | null>(null);
  const [openNew, setOpenNew] = useState(false);

  const auditeursInternes = employees.filter(e => e.isAuditor).map(e => e.fullName);
  const totalEcarts = audits.reduce((s, a) => s + a.ecarts.length, 0);
  const ecartsCritiques = audits.flatMap(a => a.ecarts).filter(e => e.gravite === 3).length;

  return (
    <div>
      <PageHeader
        icon={<ClipboardCheck className="h-5 w-5" />}
        title="Audits"
        description="Planification, check-lists IA, rapports automatiques (ISO 9.2)"
        iso="9.2"
        actions={
          <>
            <Badge variant="secondary" className="gap-1.5"><Sparkles className="h-3 w-3" /> Check-list IA</Badge>
            <Dialog open={openNew} onOpenChange={setOpenNew}>
              <DialogTrigger asChild><Button size="sm"><Plus className="h-4 w-4 mr-1.5" />Planifier un audit</Button></DialogTrigger>
              <NewAuditDialog onSubmit={() => { toast.success("Audit planifié — alertes envoyées aux auditeurs et audités"); setOpenNew(false); }} />
            </Dialog>
          </>
        }
      />

      <div className="grid gap-3 md:grid-cols-4 mb-4">
        <KPI title="Audits 2026" value={audits.length} icon={<ClipboardCheck className="h-4 w-4" />} />
        <KPI title="Réalisés" value={audits.filter(a => a.statut === "clos" || a.statut === "valide").length} icon={<CheckCircle2 className="h-4 w-4" />} />
        <KPI title="Écarts détectés" value={totalEcarts} icon={<AlertTriangle className="h-4 w-4 text-warning" />} />
        <KPI title="Écarts critiques" value={ecartsCritiques} icon={<ShieldAlert className="h-4 w-4 text-destructive" />} />
      </div>

      <Tabs defaultValue="audits">
        <TabsList className="grid grid-cols-3 w-full max-w-2xl">
          <TabsTrigger value="audits" className="gap-1.5"><ClipboardCheck className="h-3.5 w-3.5" /> Audits</TabsTrigger>
          <TabsTrigger value="ecarts" className="gap-1.5"><AlertTriangle className="h-3.5 w-3.5" /> Écarts</TabsTrigger>
          <TabsTrigger value="param" className="gap-1.5"><Settings2 className="h-3.5 w-3.5" /> Paramétrage</TabsTrigger>
        </TabsList>

        <TabsContent value="audits" className="mt-4">
          <div className="grid gap-4 lg:grid-cols-[1fr_minmax(0,1.5fr)]">
            <Card>
              <CardHeader className="pb-3"><CardTitle className="text-sm">Liste des audits</CardTitle></CardHeader>
              <CardContent className="space-y-2">
                {audits.map(a => {
                  const s = statutAudit[a.statut];
                  return (
                    <button key={a.id} onClick={() => setSelected(a)} className={`w-full text-left p-3 rounded-lg border transition-base ${selected?.id === a.id ? "bg-primary/8 border-primary/30" : "hover:bg-muted/40"}`}>
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-mono text-[10px] bg-muted px-1.5 py-0.5 rounded">{a.reference}</span>
                        <StatusBadge status={s.status} label={s.label} />
                      </div>
                      <div className="font-medium text-sm mt-1">{a.champ}</div>
                      <div className="text-xs text-muted-foreground mt-0.5">{a.type} · {a.dateDebut} → {a.dateFin}</div>
                      <div className="flex items-center gap-3 mt-2 text-[11px] text-muted-foreground">
                        <span><Users className="h-3 w-3 inline mr-1" />{a.auditeurs.length} auditeur(s)</span>
                        {a.ecarts.length > 0 && <span className="text-warning"><AlertTriangle className="h-3 w-3 inline mr-1" />{a.ecarts.length} écart(s)</span>}
                      </div>
                    </button>
                  );
                })}
              </CardContent>
            </Card>

            <div className="min-w-0">
              {selected ? <AuditDetail audit={selected} /> : (
                <Card><CardContent className="pt-12 pb-12 text-center text-muted-foreground"><ClipboardCheck className="h-8 w-8 mx-auto mb-2 opacity-30" /><p>Sélectionnez un audit pour voir le détail.</p></CardContent></Card>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="ecarts" className="mt-4">
          <Card>
            <CardHeader><CardTitle className="text-base">Tous les écarts détectés</CardTitle><CardDescription>Chaque écart génère automatiquement une action corrective dans le module Plan d'Action.</CardDescription></CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader><TableRow><TableHead>Audit</TableHead><TableHead>Concerné</TableHead><TableHead>Type</TableHead><TableHead>Gravité</TableHead><TableHead>Description</TableHead><TableHead>Action</TableHead></TableRow></TableHeader>
                <TableBody>
                  {audits.flatMap(a => a.ecarts.map(e => (
                    <TableRow key={e.id}>
                      <TableCell className="font-mono text-xs">{a.reference}</TableCell>
                      <TableCell>{e.concerne}</TableCell>
                      <TableCell>{e.type}</TableCell>
                      <TableCell><StatusBadge status={graviteColor(e.gravite) as any} label={gravites.find(g => g.id === e.gravite)?.name} /></TableCell>
                      <TableCell className="text-xs max-w-md">{e.description}</TableCell>
                      <TableCell>{e.actionId ? <Badge variant="outline" className="text-[10px] font-mono">{e.actionId}</Badge> : <Badge variant="secondary" className="text-[10px]">à créer</Badge>}</TableCell>
                    </TableRow>
                  )))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="param" className="mt-4">
          <div className="grid gap-4 md:grid-cols-2">
            <ParamCard title="Champs d'audits" items={champsAudit.map(c => `${c.name} (criticité ${c.criticite})`)} />
            <ParamCard title="Types d'audits" items={typesAudit.map(t => t.name)} />
            <ParamCard title="Types d'écarts" items={typesEcart} />
            <ParamCard title="Niveaux de gravité" items={gravites.map(g => `${g.id}. ${g.name}`)} />
            <ParamCard title="Auditeurs internes (depuis fiches employés)" items={auditeursInternes} note="Cochés 'Auditeur' dans le module RH" />
            <ParamCard title="Auditeurs externes" items={auditeursExternes.map(a => `${a.name} — ${a.organisme}`)} />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function AuditDetail({ audit }: { audit: Audit }) {
  const s = statutAudit[audit.statut];
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs bg-muted px-1.5 py-0.5 rounded">{audit.reference}</span>
                <Badge variant="outline" className="text-[10px]">{audit.type}</Badge>
              </div>
              <CardTitle className="mt-1">{audit.champ}</CardTitle>
              <CardDescription>{audit.dateDebut} → {audit.dateFin}</CardDescription>
            </div>
            <StatusBadge status={s.status} label={s.label} />
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2 text-sm">
            <div><div className="text-[11px] uppercase text-muted-foreground">Auditeurs</div><div className="flex gap-1 flex-wrap mt-1">{audit.auditeurs.map(a => <Badge key={a} variant="secondary" className="text-[10px]">{a}</Badge>)}</div></div>
            <div><div className="text-[11px] uppercase text-muted-foreground">Audités</div><div className="flex gap-1 flex-wrap mt-1">{audit.audites.map(a => <Badge key={a} variant="outline" className="text-[10px]">{a}</Badge>)}</div></div>
            <div className="md:col-span-2"><div className="text-[11px] uppercase text-muted-foreground">Documents de référence</div><div className="flex gap-1 flex-wrap mt-1">{audit.documentsRef.map(d => <Badge key={d} variant="outline" className="text-[10px] font-mono">{d}</Badge>)}</div></div>
          </div>
          {audit.statut === "rapport" && (
            <div className="mt-4 flex gap-2">
              <Button size="sm"><CheckCircle2 className="h-4 w-4 mr-1.5" />Valider rapport</Button>
              <Button size="sm" variant="outline"><Send className="h-4 w-4 mr-1.5" />Diffuser</Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3"><CardTitle className="text-sm flex items-center gap-2"><Clock className="h-4 w-4" />Plan d'audit</CardTitle></CardHeader>
        <CardContent>
          {audit.plan.length === 0 ? <p className="text-sm text-muted-foreground">Plan d'audit non encore élaboré.</p> : (
            <div className="space-y-2">
              {audit.plan.map((p, i) => (
                <div key={i} className="border rounded-lg p-3">
                  <div className="flex items-start justify-between gap-3 flex-wrap">
                    <div>
                      <div className="font-medium text-sm">{p.activite}</div>
                      <div className="text-xs text-muted-foreground mt-0.5"><MapPin className="h-3 w-3 inline mr-1" />{p.lieu}</div>
                    </div>
                    <Badge variant="outline" className="text-[10px]">{p.date} · {p.debut}–{p.fin}</Badge>
                  </div>
                  <div className="mt-2 flex gap-3 text-xs">
                    <span className="text-muted-foreground">Auditeurs: <span className="text-foreground">{p.auditeurs.join(", ")}</span></span>
                    <span className="text-muted-foreground">À rencontrer: <span className="text-foreground">{p.aRencontrer.join(", ")}</span></span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {audit.ecarts.length > 0 && (
        <Card className="border-warning/30 bg-warning/5">
          <CardHeader className="pb-3"><CardTitle className="text-sm flex items-center gap-2"><AlertTriangle className="h-4 w-4 text-warning" />Écarts ({audit.ecarts.length})</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {audit.ecarts.map(e => (
              <div key={e.id} className="border rounded-lg p-3 bg-card">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-[10px]">{e.type}</Badge>
                      <StatusBadge status={graviteColor(e.gravite) as any} label={gravites.find(g => g.id === e.gravite)?.name} />
                    </div>
                    <div className="text-sm mt-1.5">{e.description}</div>
                    <div className="text-xs text-muted-foreground mt-1">Concerné: <span className="text-foreground">{e.concerne}</span></div>
                  </div>
                  {e.actionId && <Badge variant="outline" className="font-mono text-[10px]">{e.actionId}</Badge>}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      <Card className="border-primary/20 bg-primary/5">
        <CardHeader className="pb-3"><CardTitle className="text-sm flex items-center gap-2"><Sparkles className="h-4 w-4 text-primary" />Check-list IA suggérée</CardTitle><CardDescription>Générée à partir des documents de référence et de l'historique d'écarts</CardDescription></CardHeader>
        <CardContent>
          <ul className="space-y-1.5 text-sm">
            <li>✓ Vérifier que la version en vigueur de chaque procédure est utilisée sur le terrain</li>
            <li>✓ Contrôler la traçabilité des bons de livraison sur 10 dossiers échantillonnés</li>
            <li>✓ Évaluer la connaissance des procédures par 3 opérateurs aléatoires</li>
            <li>✓ Vérifier la conformité des habilitations (ADR, CACES) au regard des fiches employés</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}

function NewAuditDialog({ onSubmit }: { onSubmit: () => void }) {
  return (
    <DialogContent className="max-w-2xl">
      <DialogHeader><DialogTitle>Planifier un nouvel audit</DialogTitle><DialogDescription>L'IA suggère automatiquement un plan basé sur le champ et le type choisis.</DialogDescription></DialogHeader>
      <div className="grid gap-3 md:grid-cols-2">
        <div><Label>Référence</Label><Input placeholder="AUD-2026-XXX" /></div>
        <div><Label>Type</Label><Select><SelectTrigger><SelectValue placeholder="Choisir…" /></SelectTrigger><SelectContent>{typesAudit.map(t => <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>)}</SelectContent></Select></div>
        <div className="md:col-span-2"><Label>Champ d'audit</Label><Select><SelectTrigger><SelectValue placeholder="Choisir…" /></SelectTrigger><SelectContent>{champsAudit.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent></Select></div>
        <div><Label>Date début</Label><Input type="date" /></div>
        <div><Label>Date fin</Label><Input type="date" /></div>
        <div className="md:col-span-2"><Label>Objectifs</Label><Textarea rows={3} placeholder="Décrire les objectifs de l'audit…" /></div>
      </div>
      <DialogFooter><Button onClick={onSubmit}>Planifier</Button></DialogFooter>
    </DialogContent>
  );
}

function KPI({ title, value, icon }: { title: string; value: number | string; icon: React.ReactNode }) {
  return (
    <Card><CardContent className="pt-5">
      <div className="flex items-center justify-between"><div className="text-xs uppercase tracking-wider text-muted-foreground">{title}</div>{icon}</div>
      <div className="text-2xl font-bold mt-1">{value}</div>
    </CardContent></Card>
  );
}

function ParamCard({ title, items, note }: { title: string; items: string[]; note?: string }) {
  return (
    <Card><CardHeader className="pb-3"><div className="flex items-center justify-between"><CardTitle className="text-sm">{title}</CardTitle><Button size="sm" variant="ghost" className="h-7 px-2"><Plus className="h-3.5 w-3.5" /></Button></div>{note && <CardDescription className="text-[11px]">{note}</CardDescription>}</CardHeader>
      <CardContent><ul className="space-y-1 text-sm">{items.map(i => <li key={i} className="px-2 py-1 rounded hover:bg-muted/50">• {i}</li>)}</ul></CardContent></Card>
  );
}
