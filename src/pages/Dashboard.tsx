import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { HealthGauge } from "@/components/qh/HealthGauge";
import { StatusBadge } from "@/components/qh/StatusBadge";
import { PageHeader } from "@/components/qh/PageHeader";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LayoutDashboard, TrendingUp, TrendingDown, AlertTriangle, ClipboardCheck, Target, Sparkles, ArrowUpRight } from "lucide-react";
import { LineChart, Line, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { Link } from "react-router-dom";

const trend = [
  { m: "Jan", v: 78 }, { m: "Fév", v: 80 }, { m: "Mar", v: 82 },
  { m: "Avr", v: 79 }, { m: "Mai", v: 84 }, { m: "Juin", v: 87 },
];
const kpis = [
  { name: "Satisfaction client", value: "4.3/5", trend: 5.2, status: "conforme" as const },
  { name: "Taux de non-conformité", value: "2.1%", trend: -12.4, status: "conforme" as const },
  { name: "Disponibilité flotte", value: "94.7%", trend: -1.8, status: "surveillance" as const },
  { name: "Délais de livraison", value: "97.2%", trend: 2.1, status: "conforme" as const },
];
const audits = [
  { p: "Achat", v: 8 }, { p: "Logistique", v: 12 }, { p: "RH", v: 4 },
  { p: "Qualité", v: 14 }, { p: "Maintenance", v: 7 },
];
const alerts = [
  { t: "3 procédures arrivent à échéance de révision", s: "surveillance" as const, link: "/documentation" },
  { t: "Étalonnage balance B-204 expire dans 12 jours", s: "critique" as const, link: "/metrologie" },
  { t: "Audit interne Achat planifié 15/05", s: "info" as const, link: "/audits" },
];

export default function Dashboard() {
  return (
    <div>
      <PageHeader
        icon={<LayoutDashboard className="h-5 w-5" />}
        title="Tableau de bord Direction"
        description="Indice de santé globale du SMQ — analyse temps réel de la performance"
        actions={
          <>
            <Button variant="outline" size="sm">Exporter le rapport</Button>
          </>
        }
      />

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-1 shadow-elegant">
          <CardHeader>
            <CardTitle>Indice de santé</CardTitle>
            <CardDescription>Conformité globale ISO 9001:2015</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <HealthGauge value={87} />
            <div className="mt-4 flex gap-2 flex-wrap justify-center">
              <StatusBadge status="conforme" label="8 chapitres OK" />
              <StatusBadge status="surveillance" label="2 à surveiller" />
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2 shadow-elegant">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Tendance de conformité</CardTitle>
                <CardDescription>6 derniers mois</CardDescription>
              </div>
              <Badge variant="outline" className="gap-1 text-success border-success/30 bg-success/10">
                <TrendingUp className="h-3 w-3" /> +9 pts
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trend}>
                  <defs>
                    <linearGradient id="g" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.4} />
                      <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="m" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} domain={[60, 100]} />
                  <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8 }} />
                  <Line type="monotone" dataKey="v" stroke="hsl(var(--primary))" strokeWidth={2.5} dot={{ r: 4, fill: "hsl(var(--primary))" }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mt-4">
        {kpis.map(k => (
          <Card key={k.name} className="hover:shadow-elegant transition-base">
            <CardHeader className="pb-2">
              <CardDescription className="text-xs uppercase tracking-wider">{k.name}</CardDescription>
              <div className="flex items-baseline gap-2 mt-1">
                <CardTitle className="text-2xl">{k.value}</CardTitle>
                <span className={`text-xs font-medium flex items-center gap-0.5 ${k.trend > 0 ? "text-success" : "text-destructive"}`}>
                  {k.trend > 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                  {Math.abs(k.trend)}%
                </span>
              </div>
            </CardHeader>
            <CardContent><StatusBadge status={k.status} /></CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-3 mt-4">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Audits par processus</CardTitle>
            <CardDescription>Constats relevés sur 12 mois</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={audits}>
                  <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="p" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8 }} />
                  <Bar dataKey="v" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2"><AlertTriangle className="h-4 w-4 text-warning" /> Alertes</CardTitle>
              <Badge variant="secondary">{alerts.length}</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {alerts.map((a, i) => (
              <Link key={i} to={a.link} className="block group">
                <div className="flex items-start gap-3 p-3 rounded-lg border border-border hover:border-primary/40 hover:bg-muted/40 transition-base">
                  <StatusBadge status={a.s} label={a.s === "info" ? "À venir" : a.s === "critique" ? "Critique" : "Surveiller"} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm leading-snug">{a.t}</p>
                  </div>
                  <ArrowUpRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-base" />
                </div>
              </Link>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-3 mt-4">
        {[
          { i: ClipboardCheck, t: "Audits ouverts", v: 7, link: "/audits", s: "surveillance" as const },
          { i: AlertTriangle, t: "Non-conformités", v: 12, link: "/non-conformites", s: "critique" as const },
          { i: Target, t: "Actions en cours", v: 34, link: "/actions", s: "conforme" as const },
        ].map(c => (
          <Link key={c.t} to={c.link}>
            <Card className="hover:shadow-elegant hover:border-primary/30 transition-base group">
              <CardContent className="p-5 flex items-center gap-4">
                <div className="h-12 w-12 rounded-lg bg-gradient-primary flex items-center justify-center shadow-glow group-hover:scale-105 transition-base">
                  <c.i className="h-5 w-5 text-primary-foreground" />
                </div>
                <div className="flex-1">
                  <div className="text-xs text-muted-foreground uppercase tracking-wider">{c.t}</div>
                  <div className="text-2xl font-bold mt-0.5">{c.v}</div>
                </div>
                <StatusBadge status={c.s} />
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
