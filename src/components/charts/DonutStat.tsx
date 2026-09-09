import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";

const PALETTE = [
  "var(--accent)",
  "var(--accent-2)",
  "#8FA3D9",
  "#C9CEEA",
  "var(--chart-track)",
];

export function DonutStat({
  data,
  centerLabel,
  centerValue,
}: {
  data: { name: string; value: number }[];
  centerLabel?: string;
  centerValue?: string;
}) {
  return (
    <div className="flex items-center gap-4">
      <div className="relative w-[104px] h-[104px] shrink-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} dataKey="value" nameKey="name" innerRadius={32} outerRadius={48} paddingAngle={2} stroke="none">
              {data.map((_, idx) => (
                <Cell key={idx} fill={PALETTE[idx % PALETTE.length]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        {(centerLabel || centerValue) && (
          <div className="absolute inset-0 grid place-items-center pointer-events-none">
            <div className="text-center">
              {centerValue && <div className="text-sm font-bold text-ink tabular">{centerValue}</div>}
              {centerLabel && <div className="text-[10px] text-faint">{centerLabel}</div>}
            </div>
          </div>
        )}
      </div>
      <ul className="flex-1 min-w-0 space-y-1.5">
        {data.map((d, idx) => (
          <li key={d.name} className="flex items-center justify-between gap-2 text-xs">
            <span className="flex items-center gap-1.5 min-w-0 text-muted">
              <span className="w-2 h-2 rounded-full shrink-0" style={{ background: PALETTE[idx % PALETTE.length] }} />
              <span className="truncate">{d.name}</span>
            </span>
            <span className="font-mono tabular text-ink shrink-0">{d.value}%</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
