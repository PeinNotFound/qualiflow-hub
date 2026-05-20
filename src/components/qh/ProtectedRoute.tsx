import { Navigate } from "react-router-dom";
import { useAuth, AppRole } from "@/hooks/useAuth";
import { Loader2 } from "lucide-react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: AppRole[];
}

export const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const { user, roles, loading } = useAuth();

  // État de chargement — afficher un spinner pendant la vérification de la session
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 className="h-6 w-6 animate-spin text-primary" />
    </div>
  );

  // Pas connecté → redirection vers la page d'authentification
  if (!user) return <Navigate to="/auth" replace />;

  // Connecté mais rôle insuffisant → redirection vers l'accueil
  if (allowedRoles && allowedRoles.length > 0 && !roles.some(role => allowedRoles.includes(role))) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};
