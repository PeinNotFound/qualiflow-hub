import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
// On récupère le hook useAuth pour accéder à l'utilisateur connecté et ses rôles
import { useAuth } from "@/hooks/useAuth";
// On importe notre client Axios centralisé (qui injecte automatiquement le token JWT)
// SUPPRIMÉ : import { supabase } from "@/integrations/supabase/client";
import api from "@/lib/api";
import { PageHeader } from "@/components/qh/PageHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { User as UserIcon, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function Profil() {
  // On récupère l'utilisateur connecté et ses rôles depuis le contexte d'authentification
  const { user, roles } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // État local du formulaire initialisé avec des chaînes vides
  const [form, setForm] = useState({
    full_name: "",
    job_title: "",
    department: "",
    site: "",
  });

  // Chargement initial des données de profil depuis le backend (GET /auth/me)
  // AVANT : supabase.from("profiles").select("*").eq("id", user.id)
  // APRÈS  : api.get("/auth/me") — la réponse contient user + roles via JWT
  useEffect(() => {
    if (!user) return;

    const fetchProfile = async () => {
      try {
        // Appel au backend pour récupérer les données fraîches du profil connecté
        // Le token JWT est injecté automatiquement par l'intercepteur de api.ts
        const response = await api.get("/auth/me");
        const profileData = response.data.user;

        // On hydrate le formulaire avec les données retournées par le serveur
        setForm({
          full_name:  profileData.full_name  ?? "",
          job_title:  profileData.job_title  ?? "",
          department: profileData.department ?? "",
          site:       profileData.site       ?? "",
        });
      } catch (err: any) {
        // En cas d'erreur réseau ou de token expiré, on informe l'utilisateur
        const message = err.response?.data?.message || "Impossible de charger le profil";
        toast.error(message);
      } finally {
        // Désactivation du spinner de chargement dans tous les cas
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  // Sauvegarde des modifications du profil (PUT /profiles/me)
  // AVANT : supabase.from("profiles").update(form).eq("id", user.id)
  // APRÈS  : api.put("/profiles/me", form) — le backend identifie l'utilisateur via le JWT
  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    try {
      // On envoie les données du formulaire au backend
      // Pas besoin de passer l'ID utilisateur : le backend le déduit du token JWT
      await api.put("/profiles/me", form);
      toast.success("Profil mis à jour");
    } catch (err: any) {
      const message = err.response?.data?.message || "Erreur lors de la sauvegarde";
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  // Affichage d'un spinner pendant que les données de profil se chargent
  if (loading) return (
    <div className="flex justify-center p-8">
      <Loader2 className="h-6 w-6 animate-spin text-primary" />
    </div>
  );

  return (
    <div className="max-w-2xl">
      <PageHeader icon={<UserIcon className="h-5 w-5" />} title="Mon profil" description="Vos informations alimentent la matrice GRH du SMQ" />
      <Card>
        <CardHeader>
          <CardTitle>Informations personnelles</CardTitle>
          {/* Affichage de l'email de l'utilisateur connecté (non modifiable) */}
          <CardDescription>{user?.email}</CardDescription>
          {/* Affichage des rôles de l'utilisateur sous forme de badges */}
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
