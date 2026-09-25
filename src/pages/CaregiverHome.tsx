import { useMemo, useState } from "react";
import { Check, ChevronLeft, User } from "lucide-react";
import clsx from "clsx";
import { ThemeToggle } from "../components/ThemeToggle";
import { useDatabase, logOutbound, editOutboundLog, isEditable } from "../lib/store";
import type { Location } from "../lib/types";
import { timeAgo } from "../lib/format";

type Step = "name" | "item" | "qty" | "location" | "done";

export function CaregiverHome() {
  const db = useDatabase();
  const caregivers = db.staff.filter((s) => s.role === "caregiver" && s.active);

  const [step, setStep] = useState<Step>("name");
  const [staffName, setStaffName] = useState("");
  const [itemId, setItemId] = useState("");
  const [units, setUnits] = useState(0);
  const [location, setLocation] = useState<Location | "">("");
  const [editingLogId, setEditingLogId] = useState<string | null>(null);

  const item = db.items.find((i) => i.id === itemId);

  const myRecentLogs = useMemo(
    () => db.outboundLogs.filter((l) => l.staffName === staffName).slice(0, 5),
    [db.outboundLogs, staffName]
  );

  function reset() {
    setStep("name");
    setStaffName("");
    setItemId("");
    setUnits(0);
    setLocation("");
    setEditingLogId(null);
  }

  function confirm() {
    if (!item || !location) return;
    if (editingLogId) {
      editOutboundLog(editingLogId, units);
    } else {
      logOutbound(item.id, staffName, units, location);
    }
    setStep("done");
  }

  function startEdit(logId: string) {
    const log = db.outboundLogs.find((l) => l.id === logId);
    if (!log) return;
    setItemId(log.itemId);
    setUnits(log.units);
    setLocation(log.location);
    setEditingLogId(log.id);
    setStep("item");
  }

  return (
    <div className="min-h-screen bg-bg flex flex-col">
      <header className="flex items-center justify-between px-6 py-4">
        <div className="font-extrabold text-lg text-ink">기저귀 반출</div>
        <ThemeToggle />
      </header>

      <div className="flex-1 flex items-center justify-center px-4 pb-10">
        <div className="w-full max-w-xl">
          {step === "name" && (
            <div>
              <p className="text-center text-muted mb-6 text-[15px]">본인 이름을 눌러주세요</p>
              <div className="grid grid-cols-2 gap-4">
                {caregivers.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => {
                      setStaffName(c.name);
                      setStep("item");
                    }}
                    className="flex flex-col items-center gap-2 py-7 rounded-2xl bg-surface border border-border shadow-card active:scale-[0.97] transition-transform"
                  >
                    <span className="w-12 h-12 rounded-full bg-accent-soft text-accent grid place-items-center">
                      <User size={22} />
                    </span>
                    <span className="text-lg font-bold text-ink">{c.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === "item" && (
            <div>
              <StepHeader label={`${staffName}님 · 품목 선택`} onBack={() => setStep("name")} />
              <div className="grid grid-cols-2 gap-4 mt-5">
                {db.items.map((i) => (
                  <button
                    key={i.id}
                    onClick={() => {
                      setItemId(i.id);
                      setUnits(0);
                      setStep("qty");
                    }}
                    className="py-8 rounded-2xl bg-surface border border-border shadow-card active:scale-[0.97] transition-transform"
                  >
                    <span className="text-lg font-bold text-ink">{i.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === "qty" && item && (
            <div>
              <StepHeader label={item.name} onBack={() => setStep("item")} />
              <div className="mt-8 rounded-2xl bg-surface border border-border shadow-card p-8 text-center">
                <p className="text-6xl font-extrabold text-ink tabular mb-1">{units}</p>
                <p className="text-sm text-muted mb-7">개</p>
                <div className="grid grid-cols-4 gap-3">
                  <button
                    onClick={() => setUnits((u) => Math.max(0, u - 1))}
                    disabled={units === 0}
                    className="py-4 rounded-xl bg-surface2 text-ink text-lg font-bold disabled:opacity-40 active:scale-95 transition-transform"
                  >
                    −1
                  </button>
                  <button
                    onClick={() => setUnits((u) => u + 1)}
                    className="py-4 rounded-xl bg-accent-soft text-accent text-lg font-bold active:scale-95 transition-transform"
                  >
                    +1
                  </button>
                  <button
                    onClick={() => setUnits((u) => u + 5)}
                    className="py-4 rounded-xl bg-accent-soft text-accent text-lg font-bold active:scale-95 transition-transform"
                  >
                    +5
                  </button>
                  <button
                    onClick={() => setUnits((u) => u + 10)}
                    className="py-4 rounded-xl bg-accent-soft text-accent text-lg font-bold active:scale-95 transition-transform"
                  >
                    +10
                  </button>
                </div>
                {units > 0 && (
                  <button onClick={() => setUnits(0)} className="mt-5 text-xs font-semibold text-faint">
                    초기화
                  </button>
                )}
              </div>
              <button
                disabled={units === 0}
                onClick={() => setStep("location")}
                className="mt-6 w-full py-5 rounded-2xl bg-accent text-white text-lg font-bold disabled:opacity-40 active:scale-[0.98] transition-transform"
              >
                다음
              </button>
            </div>
          )}

          {step === "location" && (
            <div>
              <StepHeader label="반출 장소" onBack={() => setStep("qty")} />
              <div className="grid grid-cols-2 gap-4 mt-5">
                {(["B동", "C동"] as Location[]).map((loc) => (
                  <button
                    key={loc}
                    onClick={() => setLocation(loc)}
                    className={clsx(
                      "py-10 rounded-2xl border shadow-card text-2xl font-extrabold transition-colors",
                      location === loc
                        ? "bg-accent text-white border-accent"
                        : "bg-surface text-ink border-border"
                    )}
                  >
                    {loc}
                  </button>
                ))}
              </div>
              <button
                disabled={!location}
                onClick={confirm}
                className="mt-8 w-full py-5 rounded-2xl bg-accent text-white text-lg font-bold disabled:opacity-40 active:scale-[0.98] transition-transform flex items-center justify-center gap-2"
              >
                <Check size={20} /> 반출 완료
              </button>
            </div>
          )}

          {step === "done" && (
            <div className="text-center">
              <div className="w-16 h-16 mx-auto rounded-full bg-accent-soft text-accent grid place-items-center mb-4">
                <Check size={30} />
              </div>
              <p className="text-xl font-bold text-ink mb-1">기록되었습니다</p>
              <p className="text-muted mb-8">
                {item?.name} · {units}개 · {location}
              </p>
              <button
                onClick={reset}
                className="w-full py-5 rounded-2xl bg-ink text-bg text-lg font-bold active:scale-[0.98] transition-transform"
              >
                처음으로
              </button>
            </div>
          )}

          {(step === "name" || step === "item") && myRecentLogs.length > 0 && (
            <div className="mt-8">
              <p className="text-xs font-mono uppercase tracking-wide text-faint mb-2">
                {staffName ? `${staffName}님 최근 기록` : "최근 반출 기록"}
              </p>
              <div className="space-y-2">
                {myRecentLogs.map((l) => {
                  const it = db.items.find((i) => i.id === l.itemId);
                  const editable = isEditable(l.timestamp, false);
                  return (
                    <div
                      key={l.id}
                      className="flex items-center justify-between px-4 py-3 rounded-xl bg-surface border border-border text-sm"
                    >
                      <div className="text-ink">
                        <span className="font-semibold">{it?.name}</span>{" "}
                        <span className="text-muted">
                          {l.units}개 · {l.location}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-faint text-xs">{timeAgo(l.timestamp)}</span>
                        {editable && staffName && (
                          <button onClick={() => startEdit(l.id)} className="text-accent text-xs font-semibold">
                            수정
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StepHeader({ label, onBack }: { label: string; onBack: () => void }) {
  return (
    <div className="flex items-center gap-3">
      <button onClick={onBack} className="w-9 h-9 grid place-items-center rounded-full border border-border text-muted">
        <ChevronLeft size={18} />
      </button>
      <p className="text-lg font-bold text-ink">{label}</p>
    </div>
  );
}
