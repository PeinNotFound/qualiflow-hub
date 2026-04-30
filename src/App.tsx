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
              <Route path="/non-conformites" element={<ModulePlaceholder slug="non-conformites" />} />
              <Route path="/risques" element={<ModulePlaceholder slug="risques" />} />
              <Route path="/indicateurs" element={<ModulePlaceholder slug="indicateurs" />} />
              <Route path="/clients" element={<ModulePlaceholder slug="clients" />} />
              <Route path="/fournisseurs" element={<ModulePlaceholder slug="fournisseurs" />} />
              <Route path="/rh" element={<RH />} />
              <Route path="/smart-release" element={<ModulePlaceholder slug="smart-release" />} />
              <Route path="/metrologie" element={<ModulePlaceholder slug="metrologie" />} />
              <Route path="/veille" element={<ModulePlaceholder slug="veille" />} />
              <Route path="/planning" element={<ModulePlaceholder slug="planning" />} />
              <Route path="/ia-assistant" element={<ModulePlaceholder slug="ia-assistant" />} />
              <Route path="/securite" element={<ModulePlaceholder slug="securite" />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
