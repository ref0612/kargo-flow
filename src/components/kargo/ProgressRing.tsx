export function ProgressRing({
  value,
  size = 96,
  stroke = 10,
  label,
}: {
  value: number;
  size?: number;
  stroke?: number;
  label?: string;
}) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const v = Math.max(0, Math.min(100, value));
  const dash = (v / 100) * c;
  return (
    <div className="relative inline-flex flex-col items-center justify-center">
      <svg width={size} height={size}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--muted)" strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="var(--primary)"
          strokeWidth={stroke}
          strokeDasharray={`${dash} ${c - dash}`}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
        <text
          x="50%"
          y="50%"
          dominantBaseline="middle"
          textAnchor="middle"
          className="fill-foreground"
          style={{ fontSize: size * 0.22, fontWeight: 700 }}
        >
          {v}%
        </text>
      </svg>
      {label && <div className="mt-1 text-xs text-muted-foreground">{label}</div>}
    </div>
  );
}
