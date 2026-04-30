import { ReactNode } from "react";

interface Props {
  title: string;
  description?: string;
  iso?: string;
  icon?: ReactNode;
  actions?: ReactNode;
}

export const PageHeader = ({ title, description, iso, icon, actions }: Props) => (
  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6 pb-5 border-b border-border">
    <div className="flex items-start gap-3">
      {icon && (
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-primary text-primary-foreground shadow-elegant">
          {icon}
        </div>
      )}
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
          {iso && <span className="text-[11px] font-mono text-muted-foreground bg-muted px-1.5 py-0.5 rounded">ISO {iso}</span>}
        </div>
        {description && <p className="text-sm text-muted-foreground mt-1 max-w-2xl">{description}</p>}
      </div>
    </div>
    {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
  </div>
);
