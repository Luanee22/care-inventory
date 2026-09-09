import { useMemo, useState } from "react";
import clsx from "clsx";
import { Card } from "../../components/Card";
import { useDatabase } from "../../lib/store";
import { formatDateTime } from "../../lib/format";

type Row = {
  id: string;
  timestamp: string;
  type: "resident-out" | "resident-in" | "office-out" | "office-in" | "asset-rent" | "asset-return";
  label: string;
  detail: string;
  actor: string;
};

const TYPE_LABEL: Record<Row["type"], string> = {
  "resident-out": "어르신 반출",
  "resident-in": "어르신 반입",
  "office-out": "사무 반출",
  "office-in": "사무 반입",
  "asset-rent": "자산 대여",
  "asset-return": "자산 반납",
};

const FILTERS: { key: "all" | Row["type"]; label: string }[] = [
  { key: "all", label: "전체" },
  { key: "resident-out", label: "어르신 반출" },
  { key: "resident-in", label: "어르신 반입" },
  { key: "office-out", label: "사무 반출" },
  { key: "office-in", label: "사무 반입" },
  { key: "asset-rent", label: "자산 대여" },
  { key: "asset-return", label: "자산 반납" },
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
        type: "resident-out",
        label: it?.name ?? "",
        detail: `${l.boxes > 0 ? `${l.boxes}박스 ` : ""}${l.units}개 · ${l.location}`,
        actor: l.staffName,
      });
    }
    for (const l of db.inboundLogs) {
      const it = db.items.find((i) => i.id === l.itemId);
      out.push({
        id: l.id,
        timestamp: l.timestamp,
        type: "resident-in",
        label: it?.name ?? "",
        detail: `${l.boxes > 0 ? `${l.boxes}박스 ` : ""}${l.units}개`,
        actor: l.recordedBy,
      });
    }
    for (const l of db.officeLogs) {
      const it = db.items.find((i) => i.id === l.itemId);
      out.push({
        id: l.id,
        timestamp: l.timestamp,
        type: l.direction === "in" ? "office-in" : "office-out",
        label: it?.name ?? "",
        detail: `${l.boxes > 0 ? `${l.boxes}박스 ` : ""}${l.units}개`,
        actor: l.recordedBy,
      });
    }
    for (const l of db.rentalLogs) {
      const asset = db.assets.find((a) => a.id === l.assetId);
      out.push({
        id: l.id,
        timestamp: l.timestamp,
        type: l.action === "rent" ? "asset-rent" : "asset-return",
        label: asset ? `${asset.code} ${asset.name}` : "",
        detail: l.holder,
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
          <table className="w-full text-sm min-w-[560px]">
            <thead>
              <tr className="text-left text-faint font-mono text-[11px] uppercase border-b border-border">
                <th className="py-2 pr-4">시각</th>
                <th className="py-2 pr-4">구분</th>
                <th className="py-2 pr-4">품목 · 자산</th>
                <th className="py-2 pr-4">내용</th>
                <th className="py-2">처리자</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => (
                <tr key={r.id} className="border-b border-border last:border-none">
                  <td className="py-2.5 pr-4 font-mono text-faint whitespace-nowrap">{formatDateTime(r.timestamp)}</td>
                  <td className="py-2.5 pr-4">
                    <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-surface2 text-muted whitespace-nowrap">
                      {TYPE_LABEL[r.type]}
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
