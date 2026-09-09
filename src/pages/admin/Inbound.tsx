import { useState } from "react";
import clsx from "clsx";
import { Card } from "../../components/Card";
import { useDatabase, logInbound, logOfficeMovement } from "../../lib/store";
import { useAdminSession } from "../../lib/auth";
import { formatDateTime, formatStock } from "../../lib/format";

export function Inbound() {
  const db = useDatabase();
  const session = useAdminSession();
  const residentItems = db.items.filter((i) => i.category === "resident");
  const officeItems = db.items.filter((i) => i.category === "office");

  const [residentItemId, setResidentItemId] = useState(residentItems[0]?.id ?? "");
  const [residentBoxes, setResidentBoxes] = useState(0);
  const [residentUnits, setResidentUnits] = useState(0);

  const [officeItemId, setOfficeItemId] = useState(officeItems[0]?.id ?? "");
  const [officeDirection, setOfficeDirection] = useState<"in" | "out">("out");
  const [officeBoxes, setOfficeBoxes] = useState(0);
  const [officeUnits, setOfficeUnits] = useState(0);

  const recent = [
    ...db.inboundLogs.map((l) => ({ ...l, kind: "resident-in" as const })),
    ...db.officeLogs.map((l) => ({ ...l, kind: `office-${l.direction}` as const })),
  ]
    .sort((a, b) => +new Date(b.timestamp) - +new Date(a.timestamp))
    .slice(0, 10);

  function submitInbound() {
    if (!residentItemId || (residentBoxes === 0 && residentUnits === 0)) return;
    logInbound(residentItemId, residentBoxes, residentUnits, session?.name ?? "관리자");
    setResidentBoxes(0);
    setResidentUnits(0);
  }

  function submitOffice() {
    if (!officeItemId || (officeBoxes === 0 && officeUnits === 0)) return;
    logOfficeMovement(officeItemId, officeDirection, officeBoxes, officeUnits, session?.name ?? "관리자");
    setOfficeBoxes(0);
    setOfficeUnits(0);
  }

  return (
    <div className="space-y-5">
      <h1 className="text-xl font-extrabold text-ink">반입 · 사무 소모품</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card title="어르신 소모품 반입" eyebrow="입고 처리">
          <div className="space-y-3">
            <Select label="품목" value={residentItemId} onChange={setResidentItemId}>
              {residentItems.map((i) => (
                <option key={i.id} value={i.id}>
                  {i.name} · 현재 {formatStock(i)}
                </option>
              ))}
            </Select>
            <div className="grid grid-cols-2 gap-3">
              <NumberField label="박스" value={residentBoxes} onChange={setResidentBoxes} />
              <NumberField label="낱개" value={residentUnits} onChange={setResidentUnits} />
            </div>
            <button
              onClick={submitInbound}
              className="w-full py-3 rounded-xl bg-accent text-white font-bold active:scale-[0.98] transition-transform"
            >
              반입 등록
            </button>
          </div>
        </Card>

        <Card title="사무 소모품" eyebrow="반출 · 반입">
          <div className="space-y-3">
            <Select label="품목" value={officeItemId} onChange={setOfficeItemId}>
              {officeItems.map((i) => (
                <option key={i.id} value={i.id}>
                  {i.name} · 현재 {formatStock(i)}
                </option>
              ))}
            </Select>
            <div className="flex gap-2">
              {(["out", "in"] as const).map((d) => (
                <button
                  key={d}
                  onClick={() => setOfficeDirection(d)}
                  className={clsx(
                    "flex-1 py-2.5 rounded-xl border text-sm font-semibold transition-colors",
                    officeDirection === d ? "bg-ink text-bg border-ink" : "border-border text-muted"
                  )}
                >
                  {d === "out" ? "반출" : "반입"}
                </button>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <NumberField label="박스" value={officeBoxes} onChange={setOfficeBoxes} />
              <NumberField label="낱개" value={officeUnits} onChange={setOfficeUnits} />
            </div>
            <button
              onClick={submitOffice}
              className="w-full py-3 rounded-xl bg-accent text-white font-bold active:scale-[0.98] transition-transform"
            >
              등록
            </button>
          </div>
        </Card>
      </div>

      <Card title="최근 처리 내역" eyebrow="반입 · 사무소모품">
        <div className="overflow-x-auto -mx-5 px-5">
          <table className="w-full text-sm min-w-[520px]">
            <thead>
              <tr className="text-left text-faint font-mono text-[11px] uppercase border-b border-border">
                <th className="py-2 pr-4">시각</th>
                <th className="py-2 pr-4">구분</th>
                <th className="py-2 pr-4">품목</th>
                <th className="py-2 pr-4">수량</th>
                <th className="py-2">처리자</th>
              </tr>
            </thead>
            <tbody>
              {recent.map((l) => {
                const it = db.items.find((i) => i.id === l.itemId);
                const isIn = l.kind === "resident-in" || l.kind === "office-in";
                return (
                  <tr key={l.id} className="border-b border-border last:border-none">
                    <td className="py-2.5 pr-4 font-mono text-faint">{formatDateTime(l.timestamp)}</td>
                    <td className="py-2.5 pr-4">
                      <span className={clsx("px-2 py-0.5 rounded-full text-xs font-semibold", isIn ? "bg-accent-soft text-accent" : "bg-accent2-soft text-accent2")}>
                        {isIn ? "반입" : "반출"}
                      </span>
                    </td>
                    <td className="py-2.5 pr-4 text-ink font-medium">{it?.name}</td>
                    <td className="py-2.5 pr-4 tabular text-muted">
                      {l.boxes > 0 ? `${l.boxes}박스 ` : ""}
                      {l.units}개
                    </td>
                    <td className="py-2.5 text-muted">{l.recordedBy}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

function Select({
  label,
  value,
  onChange,
  children,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="block text-xs font-mono uppercase tracking-wide text-faint mb-1.5">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3.5 py-2.5 rounded-xl bg-surface2 border border-border text-ink outline-none focus:border-accent"
      >
        {children}
      </select>
    </label>
  );
}

function NumberField({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  return (
    <label className="block">
      <span className="block text-xs font-mono uppercase tracking-wide text-faint mb-1.5">{label}</span>
      <input
        type="number"
        min={0}
        value={value}
        onChange={(e) => onChange(Math.max(0, Number(e.target.value)))}
        className="w-full px-3.5 py-2.5 rounded-xl bg-surface2 border border-border text-ink outline-none focus:border-accent tabular"
      />
    </label>
  );
}
