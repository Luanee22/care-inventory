import { useState } from "react";
import { Card } from "../../components/Card";
import { useDatabase, logInbound } from "../../lib/store";
import { useAdminSession } from "../../lib/auth";
import { formatDateTime, formatStock } from "../../lib/format";

export function Inbound() {
  const db = useDatabase();
  const session = useAdminSession();

  const [itemId, setItemId] = useState(db.items[0]?.id ?? "");
  const [boxes, setBoxes] = useState(0);

  const recent = [...db.inboundLogs].sort((a, b) => +new Date(b.timestamp) - +new Date(a.timestamp)).slice(0, 10);

  function submitInbound() {
    if (!itemId || boxes === 0) return;
    logInbound(itemId, boxes, session?.name ?? "관리자");
    setBoxes(0);
  }

  return (
    <div className="space-y-5">
      <h1 className="text-xl font-extrabold text-ink">기저귀 반입</h1>

      <Card title="반입 등록" eyebrow="박스 단위">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-end max-w-2xl">
          <label className="block md:col-span-2">
            <span className="block text-xs font-mono uppercase tracking-wide text-faint mb-1.5">품목</span>
            <select
              value={itemId}
              onChange={(e) => setItemId(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-surface2 border border-border text-ink outline-none focus:border-accent"
            >
              {db.items.map((i) => (
                <option key={i.id} value={i.id}>
                  {i.name} · 현재 {formatStock(i)}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="block text-xs font-mono uppercase tracking-wide text-faint mb-1.5">박스 수</span>
            <input
              type="number"
              min={0}
              value={boxes}
              onChange={(e) => setBoxes(Math.max(0, Number(e.target.value)))}
              className="w-full px-3.5 py-2.5 rounded-xl bg-surface2 border border-border text-ink outline-none focus:border-accent tabular"
            />
          </label>
        </div>
        <button
          onClick={submitInbound}
          className="mt-4 px-6 py-3 rounded-xl bg-accent text-white font-bold active:scale-[0.98] transition-transform"
        >
          반입 등록
        </button>
      </Card>

      <Card title="최근 반입 내역" eyebrow="최신순">
        <div className="overflow-x-auto -mx-5 px-5">
          <table className="w-full text-sm min-w-[420px]">
            <thead>
              <tr className="text-left text-faint font-mono text-[11px] uppercase border-b border-border">
                <th className="py-2 pr-4">시각</th>
                <th className="py-2 pr-4">품목</th>
                <th className="py-2 pr-4">박스 수</th>
                <th className="py-2">처리자</th>
              </tr>
            </thead>
            <tbody>
              {recent.map((l) => {
                const it = db.items.find((i) => i.id === l.itemId);
                return (
                  <tr key={l.id} className="border-b border-border last:border-none">
                    <td className="py-2.5 pr-4 font-mono text-faint">{formatDateTime(l.timestamp)}</td>
                    <td className="py-2.5 pr-4 text-ink font-medium">{it?.name}</td>
                    <td className="py-2.5 pr-4 tabular text-muted">{l.boxes}박스</td>
                    <td className="py-2.5 text-muted">{l.recordedBy}</td>
                  </tr>
                );
              })}
              {recent.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-faint">
                    반입 기록이 없습니다.
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
