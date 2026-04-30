import { NavLink, useLocation } from "react-router-dom";
import { ShieldCheck } from "lucide-react";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel,
  SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarHeader, useSidebar,
} from "@/components/ui/sidebar";
import { modules, ModuleGroup } from "@/lib/modules";
import { cn } from "@/lib/utils";

const groupLabels: Record<ModuleGroup, string> = {
  direction: "Direction",
  processus: "Processus",
  transversal: "Modules transversaux",
  system: "Système",
};

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const { pathname } = useLocation();

  const groups: ModuleGroup[] = ["direction", "processus", "transversal", "system"];

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border">
      <SidebarHeader className="border-b border-sidebar-border">
        <div className="flex items-center gap-2.5 px-2 py-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-primary shadow-glow">
            <ShieldCheck className="h-5 w-5 text-primary-foreground" />
          </div>
          {!collapsed && (
            <div className="flex flex-col">
              <span className="font-bold text-sidebar-foreground tracking-tight">Qualibot-Hub</span>
              <span className="text-[10px] uppercase tracking-wider text-sidebar-foreground/60">eQMS · ISO 9001</span>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        {groups.map(g => (
          <SidebarGroup key={g}>
            {!collapsed && <SidebarGroupLabel className="text-sidebar-foreground/50 text-[10px] uppercase tracking-wider">{groupLabels[g]}</SidebarGroupLabel>}
            <SidebarGroupContent>
              <SidebarMenu>
                {modules.filter(m => m.group === g).map(m => {
                  const to = m.slug === "dashboard" ? "/" : `/${m.slug}`;
                  const active = pathname === to;
                  return (
                    <SidebarMenuItem key={m.slug}>
                      <SidebarMenuButton asChild isActive={active} tooltip={m.title}>
                        <NavLink to={to} className={cn(
                          "flex items-center gap-2.5 rounded-md transition-base",
                          active && "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                        )}>
                          <m.icon className="h-4 w-4 shrink-0" />
                          {!collapsed && <span className="truncate">{m.short}</span>}
                          {!collapsed && m.iso && (
                            <span className="ml-auto text-[9px] text-sidebar-foreground/40 font-mono">{m.iso}</span>
                          )}
                        </NavLink>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
    </Sidebar>
  );
}
