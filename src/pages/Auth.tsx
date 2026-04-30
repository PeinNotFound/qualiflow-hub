import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ShieldCheck, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

export default function AuthPage() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [busy, setBusy] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");

  useEffect(() => { if (!loading && user) navigate("/", { replace: true }); }, [user, loading, navigate]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault(); setBusy(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (error) toast.error(error.message); else { toast.success("Connecté"); navigate("/"); }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault(); setBusy(true);
    const { error } = await supabase.auth.signUp({
      email, password,
      options: { emailRedirectTo: window.location.origin, data: { full_name: fullName } }
    });
    setBusy(false);
    if (error) toast.error(error.message);
    else toast.success("Compte créé. Vérifiez votre email pour confirmer.");
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <div className="hidden lg:flex flex-col justify-between p-12 bg-gradient-hero text-primary-foreground relative overflow-hidden">
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: "radial-gradient(circle at 20% 30%, hsl(var(--primary-glow)) 0%, transparent 40%), radial-gradient(circle at 80% 70%, hsl(var(--accent)) 0%, transparent 40%)"
        }} />
        <div className="relative flex items-center gap-3">
          <div className="h-11 w-11 rounded-xl bg-white/15 backdrop-blur flex items-center justify-center">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <div>
            <div className="font-bold text-xl tracking-tight">Qualibot-Hub</div>
            <div className="text-xs uppercase tracking-wider opacity-75">eQMS · ISO 9001:2015</div>
          </div>
        </div>
        <div className="relative space-y-6 max-w-md">
          <h1 className="text-4xl font-bold leading-tight">L'OS de votre Système de Management de la Qualité.</h1>
          <p className="text-lg opacity-90">13 modules interconnectés, propulsés par l'IA, pour piloter audits, risques, indicateurs et amélioration continue.</p>
          <div className="grid grid-cols-3 gap-4 pt-4">
            {[
              { v: "13", l: "Modules" },
              { v: "5", l: "Axes / processus" },
              { v: "100%", l: "ISO 9001 HLS" },
            ].map(s => (
              <div key={s.l}>
                <div className="text-3xl font-bold">{s.v}</div>
                <div className="text-xs opacity-75 uppercase tracking-wider">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="relative text-xs opacity-60">© Maghreb Solutions Logistics — Plateforme eQMS</div>
      </div>

      <div className="flex items-center justify-center p-6 lg:p-12">
        <Card className="w-full max-w-md p-8 shadow-elegant">
          <div className="lg:hidden flex items-center gap-2 mb-6">
            <div className="h-9 w-9 rounded-lg bg-gradient-primary flex items-center justify-center">
              <ShieldCheck className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-bold tracking-tight">Qualibot-Hub</span>
          </div>
          <h2 className="text-2xl font-bold mb-1">Bienvenue</h2>
          <p className="text-sm text-muted-foreground mb-6">Connectez-vous pour accéder à votre SMQ.</p>

          <Tabs defaultValue="signin">
            <TabsList className="grid grid-cols-2 mb-6">
              <TabsTrigger value="signin">Connexion</TabsTrigger>
              <TabsTrigger value="signup">Créer un compte</TabsTrigger>
            </TabsList>

            <TabsContent value="signin">
              <form onSubmit={handleSignIn} className="space-y-4">
                <div className="space-y-2"><Label htmlFor="ei">Email</Label>
                  <Input id="ei" type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="vous@msl.ma" /></div>
                <div className="space-y-2"><Label htmlFor="pi">Mot de passe</Label>
                  <Input id="pi" type="password" required value={password} onChange={e => setPassword(e.target.value)} /></div>
                <Button type="submit" disabled={busy} className="w-full bg-gradient-primary hover:opacity-90">
                  {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : "Se connecter"}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="signup">
              <form onSubmit={handleSignUp} className="space-y-4">
                <div className="space-y-2"><Label htmlFor="n">Nom complet</Label>
                  <Input id="n" required value={fullName} onChange={e => setFullName(e.target.value)} placeholder="Jean Dupont" /></div>
                <div className="space-y-2"><Label htmlFor="es">Email</Label>
                  <Input id="es" type="email" required value={email} onChange={e => setEmail(e.target.value)} /></div>
                <div className="space-y-2"><Label htmlFor="ps">Mot de passe</Label>
                  <Input id="ps" type="password" required minLength={6} value={password} onChange={e => setPassword(e.target.value)} /></div>
                <Button type="submit" disabled={busy} className="w-full bg-gradient-primary hover:opacity-90">
                  {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : "Créer mon compte"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
}
