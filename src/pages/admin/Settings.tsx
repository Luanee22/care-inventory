import { useState } from "react";
import clsx from "clsx";
import { Card } from "../../components/Card";
import { useDatabase, addStaff, setStaffActive, addItem, updateThreshold } from "../../lib/store";

export function Settings() {
  const db = useDatabase();
  const [staffName, setStaffName] = useState("");
  const [staffRole, setStaffRole] = useState<"caregiver" | "admin">("caregiver");

  const [itemName, setItemName] = useState("");
  const [unitsPerBox, setUnitsPerBox] = useState(50);
  const [threshold, setThreshold] = useState(2);

  function submitStaff() {
    if (!staffName.trim()) return;
    addStaff(staffName.trim(), staffRole);
    setStaffName("");
  }

  function submitItem() {
    if (!itemName.trim()) return;
    addItem(itemName.trim(), unitsPerBox, threshold);
    setItemName("");
  }

  return (
    <div className="space-y-5">
      <h1 className="text-xl font-extrabold text-ink">직원 · 품목 관리</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card title="직원 명단" eyebrow={`${db.staff.filter((s) => s.active).length}명 근무 중`}>
          <ul className="space-y-2 mb-4">
            {db.staff.map((s) => (
              <li key={s.id} className="flex items-center justify-between text-sm">
                <span className={clsx("text-ink font-medium", !s.active && "line-through text-faint")}>
                  {s.name}
                  <span className="ml-2 text-xs font-mono text-faint">{s.role === "admin" ? "관리자" : "요양보호사"}</span>
                </span>
                <button
                  onClick={() => setStaffActive(s.id, !s.active)}
                  className={clsx("text-xs font-semibold px-3 py-1 rounded-lg border", s.active ? "border-critical-soft text-critical" : "border-accent-soft text-accent")}
                >
                  {s.active ? "퇴사 처리" : "복귀"}
                </button>
              </li>
            ))}
          </ul>
          <div className="flex gap-2">
            <input
              value={staffName}
              onChange={(e) => setStaffName(e.target.value)}
              placeholder="이름"
              className="flex-1 px-3.5 py-2.5 rounded-xl bg-surface2 border border-border text-ink outline-none focus:border-accent"
            />
            <select
              value={staffRole}
              onChange={(e) => setStaffRole(e.target.value as "caregiver" | "admin")}
              className="px-3 py-2.5 rounded-xl bg-surface2 border border-border text-ink outline-none focus:border-accent"
            >
              <option value="caregiver">요양보호사</option>
              <option value="admin">관리자</option>
            </select>
            <button onClick={submitStaff} className="px-4 rounded-xl bg-accent text-white font-bold text-sm">
              추가
            </button>
          </div>
        </Card>

        <Card title="재고 경고 기준" eyebrow="박스 단위">
          <ul className="space-y-3">
            {db.items.map((i) => (
              <li key={i.id} className="flex items-center justify-between text-sm">
                <span className="text-ink font-medium">{i.name}</span>
                <input
                  type="number"
                  min={0}
                  value={i.thresholdBoxes}
                  onChange={(e) => updateThreshold(i.id, Math.max(0, Number(e.target.value)))}
                  className="w-16 px-2.5 py-1.5 rounded-lg bg-surface2 border border-border text-ink text-sm outline-none focus:border-accent tabular"
                />
              </li>
            ))}
          </ul>
        </Card>

        <Card title="새 품목 추가" eyebrow="기저귀 · 물티슈" className="md:col-span-2">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <input
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              placeholder="품목명"
              className="col-span-2 md:col-span-1 px-3.5 py-2.5 rounded-xl bg-surface2 border border-border text-ink outline-none focus:border-accent"
            />
            <input
              type="number"
              min={1}
              value={unitsPerBox}
              onChange={(e) => setUnitsPerBox(Math.max(1, Number(e.target.value)))}
              placeholder="박스당 개수"
              className="px-3.5 py-2.5 rounded-xl bg-surface2 border border-border text-ink outline-none focus:border-accent tabular"
            />
            <input
              type="number"
              min={0}
              value={threshold}
              onChange={(e) => setThreshold(Math.max(0, Number(e.target.value)))}
              placeholder="경고 기준(박스)"
              className="px-3.5 py-2.5 rounded-xl bg-surface2 border border-border text-ink outline-none focus:border-accent tabular"
            />
          </div>
          <button onClick={submitItem} className="mt-3 px-5 py-2.5 rounded-xl bg-accent text-white font-bold text-sm">
            품목 추가
          </button>
        </Card>
      </div>
    </div>
  );
}
