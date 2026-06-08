import { useState, useEffect, useCallback } from "react";
import { Bell, Check, CheckCheck, Trash2, AlertTriangle, Info, CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { get, post } from "@/lib/api";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

type NotifType = "info" | "warning" | "error" | "success";

interface Notification {
  _id: string;
  type: NotifType;
  module: string;
  message: string;
  link?: string;
  read: boolean;
  createdAt: string;
}

const icons: Record<NotifType, React.ReactNode> = {
  info: <Info className="h-4 w-4 text-blue-500 shrink-0" />,
  warning: <AlertTriangle className="h-4 w-4 text-warning shrink-0" />,
  error: <XCircle className="h-4 w-4 text-destructive shrink-0" />,
  success: <CheckCircle2 className="h-4 w-4 text-success shrink-0" />,
};

export function NotificationCenter() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const fetchNotifications = useCallback(async () => {
    try {
      const data: any = await get("/api/notifications");
      setNotifications(data.data || []);
    } catch {
      // Silently ignore if user is not logged in or no notifications
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
    // Poll every 60 seconds for new notifications
    const interval = setInterval(fetchNotifications, 60000);
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  const unread = notifications.filter((n) => !n.read).length;

  const markRead = async (id: string) => {
    try {
      await fetch(`/api/notifications/${id}/read`, { method: "PATCH" });
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, read: true } : n))
      );
    } catch {}
  };

  const markAllRead = async () => {
    try {
      await fetch("/api/notifications/read-all", { method: "PATCH" });
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch {}
  };

  const deleteNotif = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await fetch(`/api/notifications/${id}`, { method: "DELETE" });
      setNotifications((prev) => prev.filter((n) => n._id !== id));
    } catch {}
  };

  const handleClick = (notif: Notification) => {
    markRead(notif._id);
    if (notif.link) {
      navigate(notif.link);
      setOpen(false);
    }
  };

  const timeAgo = (date: string) => {
    const diff = Math.floor((Date.now() - new Date(date).getTime()) / 60000);
    if (diff < 1) return "À l'instant";
    if (diff < 60) return `il y a ${diff}min`;
    const h = Math.floor(diff / 60);
    if (h < 24) return `il y a ${h}h`;
    return `il y a ${Math.floor(h / 24)}j`;
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className="relative h-9 w-9 p-0">
          <Bell className="h-4 w-4" />
          {unread > 0 && (
            <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-destructive text-[10px] text-white flex items-center justify-center font-bold">
              {unread > 9 ? "9+" : unread}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 p-0">
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <div className="font-semibold text-sm">Notifications</div>
          {unread > 0 && (
            <Button variant="ghost" size="sm" className="h-7 text-xs gap-1" onClick={markAllRead}>
              <CheckCheck className="h-3 w-3" />
              Tout marquer lu
            </Button>
          )}
        </div>

        <div className="max-h-80 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="py-8 text-center text-sm text-muted-foreground">
              <Bell className="h-8 w-8 mx-auto mb-2 opacity-30" />
              <p>Aucune notification</p>
            </div>
          ) : (
            notifications.map((n) => (
              <div
                key={n._id}
                onClick={() => handleClick(n)}
                className={cn(
                  "flex items-start gap-3 px-4 py-3 border-b cursor-pointer hover:bg-muted/50 transition-colors",
                  !n.read && "bg-primary/5"
                )}
              >
                <div className="mt-0.5">{icons[n.type]}</div>
                <div className="flex-1 min-w-0">
                  <div className={cn("text-xs font-medium", !n.read && "text-foreground")}>
                    <span className="text-[10px] uppercase tracking-wider text-muted-foreground mr-1">
                      {n.module}
                    </span>
                    {n.message}
                  </div>
                  <div className="text-[10px] text-muted-foreground mt-0.5">{timeAgo(n.createdAt)}</div>
                </div>
                <div className="flex gap-1 shrink-0">
                  {!n.read && (
                    <button
                      className="h-5 w-5 flex items-center justify-center rounded hover:bg-muted text-muted-foreground hover:text-primary"
                      onClick={(e) => { e.stopPropagation(); markRead(n._id); }}
                    >
                      <Check className="h-3 w-3" />
                    </button>
                  )}
                  <button
                    className="h-5 w-5 flex items-center justify-center rounded hover:bg-muted text-muted-foreground hover:text-destructive"
                    onClick={(e) => deleteNotif(n._id, e)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {notifications.length > 0 && (
          <div className="px-4 py-2 border-t text-center">
            <span className="text-xs text-muted-foreground">
              {unread} non lue{unread !== 1 ? "s" : ""}
            </span>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
