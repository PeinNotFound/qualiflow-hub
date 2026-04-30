import { useParams } from "react-router-dom";
import { moduleBySlug } from "@/lib/modules";
import { PageHeader } from "./PageHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, Construction } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Props { slug?: string; }

export const ModulePlaceholder = ({ slug: propSlug }: Props) => {
  const params = useParams();
  const slug = propSlug ?? params.slug ?? "";
  const m = moduleBySlug(slug);
  if (!m) return null;
  const Icon = m.icon;

  return (
    <div>
      <PageHeader
        icon={<Icon className="h-5 w-5" />}
        title={m.title}
        description={m.description}
        iso={m.iso}
        actions={<Badge variant="secondary" className="gap-1.5"><Sparkles className="h-3 w-3" /> AI-Powered</Badge>}
      />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map(i => (
          <Card key={i} className="hover:shadow-elegant transition-base">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Section {i}</CardTitle>
                <Construction className="h-4 w-4 text-muted-foreground" />
              </div>
              <CardDescription>Maquette en construction — ce module sera enrichi dans les prochaines itérations.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="h-2 rounded bg-muted" />
                <div className="h-2 rounded bg-muted w-4/5" />
                <div className="h-2 rounded bg-muted w-3/5" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
