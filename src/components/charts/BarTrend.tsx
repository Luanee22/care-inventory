import { Bar, BarChart, Cell, ResponsiveContainer, Tooltip, XAxis } from "recharts";

export function BarTrend({
  data,
  dataKey,
  labelKey,
  highlightLast = true,
  suffix = "",
}: {
  data: Record<string, string | number>[];
  dataKey: string;
  labelKey: string;
  highlightLast?: boolean;
  suffix?: string;
}) {
  return (
    <div className="h-40 -mx-2">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: 8 }}>
          <XAxis
            dataKey={labelKey}
            axisLine={false}
            tickLine={false}
            tick={{ fill: "var(--ink-faint)", fontSize: 11, fontFamily: "IBM Plex Mono" }}
          />
          <Tooltip
            cursor={{ fill: "var(--chart-track)" }}
            contentStyle={{
              background: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: 10,
              fontSize: 12,
              color: "var(--ink)",
            }}
            formatter={(v: number) => [`${v.toLocaleString()}${suffix}`, ""]}
            labelFormatter={() => ""}
          />
          <Bar dataKey={dataKey} radius={[6, 6, 6, 6]} maxBarSize={26}>
            {data.map((_, idx) => (
              <Cell
                key={idx}
                fill={highlightLast && idx === data.length - 1 ? "var(--accent)" : "var(--chart-track)"}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
