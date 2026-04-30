import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { PageHeader } from "@/components/qh/PageHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { User as UserIcon, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function Profil() {
  const { user, roles } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ full_name: "", job_title: "", department: "", site: "" });

  useEffect(() => {
    if (!user) return;
    supabase.from("profiles").select("*").eq("id", user.id).maybeSingle().then(({ data }) => {
      if (data) setForm({
        full_name: data.full_name ?? "", job_title: data.job_title ?? "",
        department: data.department ?? "", site: data.site ?? "",
      });
      setLoading(false);
    });
  }, [user]);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    const { error } = await supabase.from("profiles").update(form).eq("id", user.id);
    setSaving(false);
    if (error) toast.error(error.message); else toast.success("Profil mis à jour");
  };

  if (loading) return <div className="flex justify-center p-8"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>;

  return (
    <div className="max-w-2xl">
      <PageHeader icon={<UserIcon className="h-5 w-5" />} title="Mon profil" description="Vos informations alimentent la matrice GRH du SMQ" />
      <Card>
        <CardHeader>
          <CardTitle>Informations personnelles</CardTitle>
          <CardDescription>{user?.email}</CardDescription>
          <div className="flex flex-wrap gap-1.5 pt-1">
            {roles.map(r => <Badge key={r} variant="secondary" className="capitalize">{r}</Badge>)}
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={save} className="space-y-4">
            <div className="space-y-2"><Label>Nom complet</Label><Input value={form.full_name} onChange={e => setForm({ ...form, full_name: e.target.value })} /></div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Poste</Label><Input value={form.job_title} onChange={e => setForm({ ...form, job_title: e.target.value })} placeholder="Pilote Achats" /></div>
              <div className="space-y-2"><Label>Département</Label><Input value={form.department} onChange={e => setForm({ ...form, department: e.target.value })} placeholder="Qualité" /></div>
            </div>
            <div className="space-y-2"><Label>Site</Label><Input value={form.site} onChange={e => setForm({ ...form, site: e.target.value })} placeholder="Casablanca" /></div>
            <div className="flex gap-2 pt-2">
              <Button type="submit" disabled={saving}>{saving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Enregistrer"}</Button>
              <Button type="button" variant="outline" onClick={() => navigate(-1)}>Retour</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
