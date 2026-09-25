import { useMemo, useState } from "react";
import clsx from "clsx";
import { Card } from "../../components/Card";
import { useDatabase } from "../../lib/store";
import { formatDateTime } from "../../lib/format";

type Row = {
  id: string;
  timestamp: string;
  type: "out" | "in";
  label: string;
  detail: string;
  actor: string;
};

const FILTERS: { key: "all" | Row["type"]; label: string }[] = [
  { key: "all", label: "전체" },
  { key: "out", label: "반출" },
  { key: "in", label: "반입" },
];

export function History() {
  const db = useDatabase();
  const [filter, setFilter] = useState<"all" | Row["type"]>("all");

  const rows: Row[] = useMemo(() => {
    const out: Row[] = [];
    for (const l of db.outboundLogs) {
      const it = db.items.find((i) => i.id === l.itemId);
      out.push({
        id: l.id,
        timestamp: l.timestamp,
        type: "out",
        label: it?.name ?? "",
        detail: `${l.units}개 · ${l.location}`,
        actor: l.staffName,
      });
    }
    for (const l of db.inboundLogs) {
      const it = db.items.find((i) => i.id === l.itemId);
      out.push({
        id: l.id,
        timestamp: l.timestamp,
        type: "in",
        label: it?.name ?? "",
        detail: `${l.boxes}박스`,
        actor: l.recordedBy,
      });
    }
    return out.sort((a, b) => +new Date(b.timestamp) - +new Date(a.timestamp));
  }, [db]);

  const filtered = filter === "all" ? rows : rows.filter((r) => r.type === filter);

  return (
    <div className="space-y-5">
      <h1 className="text-xl font-extrabold text-ink">이력 · 통계</h1>

      <div className="flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={clsx(
              "px-3.5 py-1.5 rounded-full text-[13px] font-medium border transition-colors",
              filter === f.key ? "bg-ink text-bg border-ink" : "border-border text-muted"
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      <Card title={`전체 이력 · ${filtered.length}건`} eyebrow="최신순">
        <div className="overflow-x-auto -mx-5 px-5">
          <table className="w-full text-sm min-w-[520px]">
            <thead>
              <tr className="text-left text-faint font-mono text-[11px] uppercase border-b border-border">
                <th className="py-2 pr-4">시각</th>
                <th className="py-2 pr-4">구분</th>
                <th className="py-2 pr-4">품목</th>
                <th className="py-2 pr-4">내용</th>
                <th className="py-2">처리자</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => (
                <tr key={r.id} className="border-b border-border last:border-none">
                  <td className="py-2.5 pr-4 font-mono text-faint whitespace-nowrap">{formatDateTime(r.timestamp)}</td>
                  <td className="py-2.5 pr-4">
                    <span
                      className={clsx(
                        "px-2 py-0.5 rounded-full text-xs font-semibold whitespace-nowrap",
                        r.type === "in" ? "bg-accent-soft text-accent" : "bg-accent2-soft text-accent2"
                      )}
                    >
                      {r.type === "in" ? "반입" : "반출"}
                    </span>
                  </td>
                  <td className="py-2.5 pr-4 text-ink font-medium whitespace-nowrap">{r.label}</td>
                  <td className="py-2.5 pr-4 text-muted tabular">{r.detail}</td>
                  <td className="py-2.5 text-muted whitespace-nowrap">{r.actor}</td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-faint">
                    해당하는 기록이 없습니다.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
