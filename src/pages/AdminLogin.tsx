import { FormEvent, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { PawPrint } from "lucide-react";
import { ThemeToggle } from "../components/ThemeToggle";
import { isDemoPassword, loginAdmin, useAdminSession } from "../lib/auth";

export function AdminLogin() {
  const session = useAdminSession();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  if (session) return <Navigate to="/admin" replace />;

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!name.trim()) {
      setError("이름을 입력해주세요.");
      return;
    }
    if (loginAdmin(name.trim(), password)) {
      navigate("/admin");
    } else {
      setError("비밀번호가 올바르지 않습니다.");
    }
  }

  return (
    <div className="min-h-screen bg-bg flex flex-col">
      <div className="flex justify-end p-5">
        <ThemeToggle />
      </div>
      <div className="flex-1 flex items-center justify-center px-4 pb-16">
        <form onSubmit={handleSubmit} className="w-full max-w-sm rounded-2xl bg-surface border border-border shadow-card p-7">
          <div className="flex items-center gap-2 font-extrabold text-lg text-ink mb-1">
            <span className="w-8 h-8 rounded-lg bg-accent-soft text-accent grid place-items-center">
              <PawPrint size={16} />
            </span>
            케어인벤
          </div>
          <p className="text-sm text-muted mb-6">관리자 로그인</p>

          <label className="block text-xs font-mono uppercase tracking-wide text-faint mb-1.5">이름</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="예: 한지원"
            className="w-full mb-4 px-4 py-3 rounded-xl bg-surface2 border border-border text-ink outline-none focus:border-accent"
          />

          <label className="block text-xs font-mono uppercase tracking-wide text-faint mb-1.5">비밀번호</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full mb-2 px-4 py-3 rounded-xl bg-surface2 border border-border text-ink outline-none focus:border-accent"
          />
          {error && <p className="text-critical text-xs mb-3">{error}</p>}

          <button
            type="submit"
            className="w-full mt-4 py-3.5 rounded-xl bg-accent text-white font-bold active:scale-[0.98] transition-transform"
          >
            로그인
          </button>
          {isDemoPassword && (
            <p className="text-[11px] text-warn mt-4 text-center">
              데모 비밀번호(admin1234) 사용 중 · 배포 전 VITE_ADMIN_PASSWORD 환경변수를 설정하세요
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
