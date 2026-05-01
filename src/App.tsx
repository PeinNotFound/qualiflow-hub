import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { ProtectedRoute } from "@/components/qh/ProtectedRoute";
import { AppLayout } from "@/components/qh/AppLayout";
import { ModulePlaceholder } from "@/components/qh/ModulePlaceholder";

import AuthPage from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Documentation from "./pages/Documentation";
import Actions from "./pages/Actions";
import RH from "./pages/RH";
import Audits from "./pages/Audits";
import NonConformites from "./pages/NonConformites";
import Risques from "./pages/Risques";
import Indicateurs from "./pages/Indicateurs";
import Clients from "./pages/Clients";
import Fournisseurs from "./pages/Fournisseurs";
import Metrologie from "./pages/Metrologie";
import Reunions from "./pages/Reunions";
import Conformite from "./pages/Conformite";
import PartiesInteressees from "./pages/PartiesInteressees";
import SmartRelease from "./pages/SmartRelease";
import Planning from "./pages/Planning";
import Securite from "./pages/Securite";
import Profil from "./pages/Profil";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/auth" element={<AuthPage />} />
            <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/documentation" element={<Documentation />} />
              <Route path="/actions" element={<Actions />} />
              <Route path="/profil" element={<Profil />} />
              <Route path="/audits" element={<Audits />} />
              <Route path="/non-conformites" element={<NonConformites />} />
              <Route path="/risques" element={<Risques />} />
              <Route path="/indicateurs" element={<Indicateurs />} />
              <Route path="/clients" element={<Clients />} />
              <Route path="/fournisseurs" element={<Fournisseurs />} />
              <Route path="/rh" element={<RH />} />
              <Route path="/reunions" element={<Reunions />} />
              <Route path="/smart-release" element={<SmartRelease />} />
              <Route path="/metrologie" element={<Metrologie />} />
              <Route path="/veille" element={<Conformite />} />
              <Route path="/conformite" element={<Conformite />} />
              <Route path="/parties-interessees" element={<PartiesInteressees />} />
              <Route path="/planning" element={<Planning />} />
              <Route path="/ia-assistant" element={<ModulePlaceholder slug="ia-assistant" />} />
              <Route path="/securite" element={<Securite />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
