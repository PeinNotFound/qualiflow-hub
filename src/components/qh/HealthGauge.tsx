interface Props { value: number; size?: number; }

export const HealthGauge = ({ value, size = 200 }: Props) => {
  const v = Math.max(0, Math.min(100, value));
  const radius = (size - 24) / 2;
  const circ = 2 * Math.PI * radius;
  const offset = circ - (v / 100) * circ;
  const color = v >= 85 ? "hsl(var(--success))" : v >= 65 ? "hsl(var(--warning))" : "hsl(var(--destructive))";

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} stroke="hsl(var(--muted))" strokeWidth="12" fill="none" />
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          stroke={color} strokeWidth="12" fill="none" strokeLinecap="round"
          strokeDasharray={circ} strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 1s cubic-bezier(0.4,0,0.2,1)" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-4xl font-bold tracking-tight" style={{ color }}>{v}%</span>
        <span className="text-xs uppercase tracking-wider text-muted-foreground mt-1">Santé SMQ</span>
      </div>
    </div>
  );
};
