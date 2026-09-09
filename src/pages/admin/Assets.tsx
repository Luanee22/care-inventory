import { useState } from "react";
import clsx from "clsx";
import { Card } from "../../components/Card";
import { useDatabase, registerAsset, addAssetSubcategory, rentAsset, returnAsset } from "../../lib/store";
import { useAdminSession } from "../../lib/auth";
import { formatDateTime } from "../../lib/format";

export function Assets() {
  const db = useDatabase();
  const session = useAdminSession();

  const [newAssetName, setNewAssetName] = useState("");
  const [newAssetSub, setNewAssetSub] = useState(db.assetSubcategories[0]?.id ?? "");
  const [newSubName, setNewSubName] = useState("");
  const [newSubPrefix, setNewSubPrefix] = useState("");
  const [rentingId, setRentingId] = useState<string | null>(null);
  const [holderName, setHolderName] = useState("");

  function submitRegister() {
    if (!newAssetName.trim() || !newAssetSub) return;
    registerAsset(newAssetName.trim(), newAssetSub);
    setNewAssetName("");
  }

  function submitSubcategory() {
    if (!newSubName.trim() || !newSubPrefix.trim()) return;
    addAssetSubcategory(newSubName.trim(), newSubPrefix.trim());
    setNewSubName("");
    setNewSubPrefix("");
  }

  function confirmRent(assetId: string) {
    if (!holderName.trim()) return;
    rentAsset(assetId, holderName.trim(), session?.name ?? "관리자");
    setRentingId(null);
    setHolderName("");
  }

  return (
    <div className="space-y-5">
      <h1 className="text-xl font-extrabold text-ink">비소모성 자산</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card title="자산 등록" eyebrow="코드 자동 발급">
          <div className="space-y-3">
            <label className="block">
              <span className="block text-xs font-mono uppercase tracking-wide text-faint mb-1.5">이름</span>
              <input
                value={newAssetName}
                onChange={(e) => setNewAssetName(e.target.value)}
                placeholder="예: 휠체어"
                className="w-full px-3.5 py-2.5 rounded-xl bg-surface2 border border-border text-ink outline-none focus:border-accent"
              />
            </label>
            <label className="block">
              <span className="block text-xs font-mono uppercase tracking-wide text-faint mb-1.5">소분류</span>
              <select
                value={newAssetSub}
                onChange={(e) => setNewAssetSub(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-surface2 border border-border text-ink outline-none focus:border-accent"
              >
                {db.assetSubcategories.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.prefix})
                  </option>
                ))}
              </select>
            </label>
            <button
              onClick={submitRegister}
              className="w-full py-3 rounded-xl bg-accent text-white font-bold active:scale-[0.98] transition-transform"
            >
              등록
            </button>
          </div>
        </Card>

        <Card title="소분류 관리" eyebrow="코드 접두어">
          <div className="space-y-2 mb-4">
            {db.assetSubcategories.map((s) => (
              <div key={s.id} className="flex items-center justify-between text-sm">
                <span className="text-ink font-medium">{s.name}</span>
                <span className="font-mono text-faint">{s.prefix}-000{s.nextSeq}</span>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              value={newSubName}
              onChange={(e) => setNewSubName(e.target.value)}
              placeholder="소분류명 (예: 조리기구)"
              className="flex-1 px-3.5 py-2.5 rounded-xl bg-surface2 border border-border text-ink outline-none focus:border-accent"
            />
            <input
              value={newSubPrefix}
              onChange={(e) => setNewSubPrefix(e.target.value.toUpperCase().slice(0, 3))}
              placeholder="KT"
              className="w-20 px-3.5 py-2.5 rounded-xl bg-surface2 border border-border text-ink outline-none focus:border-accent font-mono"
            />
            <button onClick={submitSubcategory} className="px-4 rounded-xl bg-surface2 border border-border text-ink font-semibold text-sm">
              추가
            </button>
          </div>
        </Card>
      </div>

      <Card title="자산 목록" eyebrow={`총 ${db.assets.length}건 · 대여 중 ${db.assets.filter((a) => a.status === "rented").length}건`}>
        <div className="overflow-x-auto -mx-5 px-5">
          <table className="w-full text-sm min-w-[560px]">
            <thead>
              <tr className="text-left text-faint font-mono text-[11px] uppercase border-b border-border">
                <th className="py-2 pr-4">코드</th>
                <th className="py-2 pr-4">이름</th>
                <th className="py-2 pr-4">상태</th>
                <th className="py-2 pr-4">대여자</th>
                <th className="py-2">처리</th>
              </tr>
            </thead>
            <tbody>
              {db.assets.map((a) => (
                <tr key={a.id} className="border-b border-border last:border-none">
                  <td className="py-2.5 pr-4 font-mono text-ink">{a.code}</td>
                  <td className="py-2.5 pr-4 text-ink font-medium">{a.name}</td>
                  <td className="py-2.5 pr-4">
                    <span
                      className={clsx(
                        "px-2 py-0.5 rounded-full text-xs font-semibold",
                        a.status === "available" ? "bg-accent-soft text-accent" : "bg-warn-soft text-warn"
                      )}
                    >
                      {a.status === "available" ? "보관 중" : "대여 중"}
                    </span>
                  </td>
                  <td className="py-2.5 pr-4 text-muted">
                    {a.holder ?? "-"}
                    {a.rentedAt && <span className="text-faint text-xs block">{formatDateTime(a.rentedAt)}</span>}
                  </td>
                  <td className="py-2.5">
                    {a.status === "available" ? (
                      rentingId === a.id ? (
                        <span className="flex items-center gap-2">
                          <input
                            autoFocus
                            value={holderName}
                            onChange={(e) => setHolderName(e.target.value)}
                            placeholder="대여자명"
                            className="w-28 px-2.5 py-1.5 rounded-lg bg-surface2 border border-border text-ink text-xs outline-none focus:border-accent"
                          />
                          <button onClick={() => confirmRent(a.id)} className="text-accent text-xs font-bold">
                            확인
                          </button>
                        </span>
                      ) : (
                        <button
                          onClick={() => setRentingId(a.id)}
                          className="text-xs font-semibold text-ink px-3 py-1.5 rounded-lg border border-border"
                        >
                          대여 처리
                        </button>
                      )
                    ) : (
                      <button
                        onClick={() => returnAsset(a.id, session?.name ?? "관리자")}
                        className="text-xs font-semibold text-critical px-3 py-1.5 rounded-lg border border-critical-soft"
                      >
                        반납 처리
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
