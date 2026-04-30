import { cn } from "@/lib/utils";

export type Status = "conforme" | "surveillance" | "critique" | "info";

const map: Record<Status, { label: string; cls: string }> = {
  conforme: { label: "Conforme", cls: "status-conform" },
  surveillance: { label: "À surveiller", cls: "status-watch" },
  critique: { label: "Critique", cls: "status-critical" },
  info: { label: "Info", cls: "bg-secondary text-secondary-foreground border-border" },
};

export const StatusBadge = ({ status, label, className }: { status: Status; label?: string; className?: string }) => {
  const m = map[status];
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium", m.cls, className)}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {label ?? m.label}
    </span>
  );
};
