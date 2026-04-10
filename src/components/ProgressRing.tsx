interface ProgressRingProps {
  progress: number;
  size?: number;
  strokeWidth?: number;
  label?: string;
}

export default function ProgressRing({ progress, size = 80, strokeWidth = 6, label }: ProgressRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - progress * circumference;

  return (
    <div className="flex flex-col items-center gap-1">
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="hsl(var(--muted))"
          strokeWidth={strokeWidth}
        />
        <defs>
          <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="hsl(260, 60%, 60%)" />
            <stop offset="100%" stopColor="hsl(210, 80%, 60%)" />
          </linearGradient>
        </defs>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="url(#progressGradient)"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-700 ease-out"
          style={{ filter: 'drop-shadow(0 0 4px hsla(260, 60%, 60%, 0.4))' }}
        />
      </svg>
      {label && <span className="text-xs text-muted-foreground font-medium">{label}</span>}
    </div>
  );
}
