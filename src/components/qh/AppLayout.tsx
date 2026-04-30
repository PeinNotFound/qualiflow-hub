import { Outlet, useNavigate } from "react-router-dom";
import { Bell, LogOut, Search, User as UserIcon } from "lucide-react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

export const AppLayout = () => {
  const { user, roles, signOut } = useAuth();
  const navigate = useNavigate();

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-14 border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-30 flex items-center gap-3 px-4">
            <SidebarTrigger />
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Rechercher procédures, audits, actions…" className="pl-9 h-9 bg-muted/40 border-border" />
            </div>
            <div className="ml-auto flex items-center gap-2">
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-4 w-4" />
                <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-destructive" />
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="gap-2">
                    <div className="h-7 w-7 rounded-full bg-gradient-primary flex items-center justify-center text-primary-foreground text-xs font-semibold">
                      {user?.email?.[0]?.toUpperCase() ?? "U"}
                    </div>
                    <span className="hidden md:inline text-sm font-medium max-w-[160px] truncate">{user?.email}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium truncate">{user?.email}</span>
                      <div className="flex flex-wrap gap-1 mt-1.5">
                        {roles.map(r => <Badge key={r} variant="secondary" className="text-[10px] capitalize">{r}</Badge>)}
                      </div>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate("/profil")}>
                    <UserIcon className="h-4 w-4 mr-2" /> Mon profil
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={async () => { await signOut(); navigate("/auth"); }}>
                    <LogOut className="h-4 w-4 mr-2" /> Se déconnecter
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>
          <main className="flex-1 p-6 max-w-[1600px] w-full mx-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};
