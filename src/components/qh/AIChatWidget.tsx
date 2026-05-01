import { useState, useRef, useEffect } from "react";
import { MessageSquare, X, Send, Sparkles, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from "@/integrations/supabase/client";
import { useLocation } from "react-router-dom";
import { moduleBySlug } from "@/lib/modules";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface Msg { role: "user" | "assistant"; content: string }

export function AIChatWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([
    { role: "assistant", content: "👋 Bonjour, je suis **Qualibot**, votre assistant IA qualité. Je peux vous aider sur les procédures, audits, actions, KPI, conformité ISO 9001…" }
  ]);
  const { pathname } = useLocation();
  const endRef = useRef<HTMLDivElement>(null);

  const slug = pathname === "/" ? "dashboard" : pathname.slice(1).split("/")[0];
  const mod = moduleBySlug(slug);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  const send = async () => {
    if (!input.trim() || loading) return;
    const q = input.trim();
    setInput("");
    setMessages(m => [...m, { role: "user", content: q }]);
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("chat-with-doc", {
        body: { question: q, processName: mod?.title ?? "général" }
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      setMessages(m => [...m, { role: "assistant", content: data?.answer ?? "Pas de réponse." }]);
    } catch (e: any) {
      toast.error(e.message || "Erreur Qualibot");
      setMessages(m => [...m, { role: "assistant", content: "❌ " + (e.message || "Erreur") }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full bg-gradient-primary shadow-glow hover:scale-110 transition-transform flex items-center justify-center group"
          aria-label="Ouvrir Qualibot AI"
        >
          <Sparkles className="h-6 w-6 text-primary-foreground" />
          <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-success animate-pulse" />
          <span className="absolute right-full mr-3 px-2.5 py-1 rounded-md bg-foreground text-background text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
            Qualibot AI
          </span>
        </button>
      )}

      {open && (
        <div className="fixed bottom-6 right-6 z-50 w-[380px] max-w-[calc(100vw-2rem)] h-[560px] max-h-[calc(100vh-3rem)] rounded-xl bg-card border border-border shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-4">
          <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-gradient-primary text-primary-foreground">
            <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center">
              <Sparkles className="h-4 w-4" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-sm">Qualibot AI</div>
              <div className="text-[11px] opacity-80 truncate">
                Contexte : {mod?.title ?? "Plateforme"}
              </div>
            </div>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-primary-foreground hover:bg-white/20" onClick={() => setOpen(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          <ScrollArea className="flex-1 p-4">
            <div className="space-y-3">
              {messages.map((m, i) => (
                <div key={i} className={cn("flex", m.role === "user" ? "justify-end" : "justify-start")}>
                  <div className={cn(
                    "max-w-[85%] rounded-lg px-3 py-2 text-sm whitespace-pre-wrap",
                    m.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-foreground"
                  )}>
                    {m.content}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-muted rounded-lg px-3 py-2 text-sm flex items-center gap-2">
                    <Loader2 className="h-3 w-3 animate-spin" /> Qualibot réfléchit…
                  </div>
                </div>
              )}
              <div ref={endRef} />
            </div>
          </ScrollArea>

          <div className="border-t border-border p-3 flex gap-2">
            <Input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && send()}
              placeholder="Posez votre question…"
              disabled={loading}
              className="h-9"
            />
            <Button size="icon" onClick={send} disabled={loading || !input.trim()} className="h-9 w-9 shrink-0">
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
