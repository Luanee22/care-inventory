import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis } from "recharts";

export function AreaCompare({ data }: { data: { month: string; B동: number; C동: number }[] }) {
  return (
    <div className="h-36 -mx-2">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: 8 }}>
          <defs>
            <linearGradient id="bdong" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--accent)" stopOpacity={0.35} />
              <stop offset="100%" stopColor="var(--accent)" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="cdong" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--accent-2)" stopOpacity={0.3} />
              <stop offset="100%" stopColor="var(--accent-2)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="month"
            axisLine={false}
            tickLine={false}
            tick={{ fill: "var(--ink-faint)", fontSize: 11, fontFamily: "IBM Plex Mono" }}
          />
          <Tooltip
            contentStyle={{
              background: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: 10,
              fontSize: 12,
              color: "var(--ink)",
            }}
          />
          <Area type="monotone" dataKey="B동" stroke="var(--accent)" strokeWidth={2} fill="url(#bdong)" />
          <Area type="monotone" dataKey="C동" stroke="var(--accent-2)" strokeWidth={2} fill="url(#cdong)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
