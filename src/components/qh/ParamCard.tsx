import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { ReactNode } from "react";

export function ParamCard({ title, items, icon, note }: { title: string; items: string[]; icon?: ReactNode; note?: string }) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2">{icon}{title}</CardTitle>
          <Button size="sm" variant="ghost" className="h-7 px-2"><Plus className="h-3.5 w-3.5" /></Button>
        </div>
        {note && <CardDescription className="text-[11px]">{note}</CardDescription>}
      </CardHeader>
      <CardContent>
        <ul className="space-y-1 text-sm">
          {items.map(i => <li key={i} className="px-2 py-1 rounded hover:bg-muted/50">• {i}</li>)}
        </ul>
      </CardContent>
    </Card>
  );
}

export function KPICard({ title, value, icon, hint }: { title: string; value: string | number; icon?: ReactNode; hint?: string }) {
  return (
    <Card>
      <CardContent className="pt-5">
        <div className="flex items-center justify-between">
          <div className="text-xs uppercase tracking-wider text-muted-foreground">{title}</div>
          {icon && <div className="text-muted-foreground">{icon}</div>}
        </div>
        <div className="text-2xl font-bold mt-1">{value}</div>
        {hint && <div className="text-[11px] text-muted-foreground mt-0.5">{hint}</div>}
      </CardContent>
    </Card>
  );
}
