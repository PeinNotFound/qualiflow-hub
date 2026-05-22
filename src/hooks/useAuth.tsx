import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import api from "@/lib/api";

export type AppRole = "admin" | "pilote" | "auditeur" | "operateur";

export interface User {
  id: string;
  email: string;
  full_name?: string;
  job_title?: string | null;
  department?: string | null;
  site?: string | null;
}

interface AuthContextType {
  user: User | null;
  roles: AppRole[];
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, fullName: string) => Promise<void>;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [roles, setRoles] = useState<AppRole[]>([]);
  const [loading, setLoading] = useState(true);

  // Au chargement de l'application, vérifier si un token existe et valider la session via GET /auth/me
  // C'est la source de vérité — pas le localStorage
  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const response = await api.get("/auth/me");
          const { user: currentUser, roles: currentRoles } = response.data;
          setUser(currentUser);
          setRoles(currentRoles || []);
          // Mettre à jour le cache local avec les données fraîches du serveur
          localStorage.setItem("user", JSON.stringify(currentUser));
        } catch {
          // Token invalide ou expiré — nettoyer le stockage local
          localStorage.removeItem("token");
          localStorage.removeItem("user");
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const signIn = async (email: string, password: string) => {
    const response = await api.post("/auth/login", { email, password });
    const { token, user: loggedUser, roles: userRoles } = response.data;

    // Stocker le token et l'utilisateur de manière cohérente
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(loggedUser));

    setUser(loggedUser);
    setRoles(userRoles || []);
  };

  // Option A : après inscription, l'utilisateur doit se connecter manuellement
  const signUp = async (email: string, password: string, fullName: string) => {
    await api.post("/auth/register", { email, password, full_name: fullName });
  };

  const signOut = () => {
    // Nettoyage complet et simultané du stockage local
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setRoles([]);
    window.location.href = "/auth";
  };

  return (
    <AuthContext.Provider value={{ user, roles, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
