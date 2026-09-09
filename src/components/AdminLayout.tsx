import { NavLink, Navigate, Outlet } from "react-router-dom";
import clsx from "clsx";
import { LogOut, PawPrint } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { logoutAdmin, useAdminSession } from "../lib/auth";

const TABS = [
  { to: "/admin", label: "대시보드", end: true },
  { to: "/admin/inbound", label: "반입 · 사무소모품" },
  { to: "/admin/assets", label: "자산" },
  { to: "/admin/history", label: "이력 · 통계" },
  { to: "/admin/settings", label: "관리" },
];

export function AdminLayout() {
  const session = useAdminSession();
  if (!session) return <Navigate to="/admin/login" replace />;

  return (
    <div className="min-h-screen bg-bg">
      <header className="sticky top-0 z-10 bg-bg/90 backdrop-blur border-b border-border">
        <div className="max-w-6xl mx-auto px-5 py-3 flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2 font-extrabold text-ink shrink-0">
            <span className="w-8 h-8 rounded-lg bg-accent-soft text-accent grid place-items-center">
              <PawPrint size={16} />
            </span>
            케어인벤
          </div>
          <nav className="flex items-center gap-1 flex-1 flex-wrap">
            {TABS.map((tab) => (
              <NavLink
                key={tab.to}
                to={tab.to}
                end={tab.end}
                className={({ isActive }) =>
                  clsx(
                    "px-3.5 py-1.5 rounded-full text-[13px] font-medium border transition-colors",
                    isActive
                      ? "bg-ink text-bg border-ink"
                      : "border-border text-muted hover:text-ink hover:border-ink/30"
                  )
                }
              >
                {tab.label}
              </NavLink>
            ))}
          </nav>
          <div className="flex items-center gap-3 shrink-0">
            <span className="text-xs text-faint font-mono hidden sm:inline">{session.name}</span>
            <ThemeToggle />
            <button
              onClick={logoutAdmin}
              className="w-9 h-9 grid place-items-center rounded-full border border-border text-muted hover:text-critical transition-colors"
              aria-label="로그아웃"
            >
              <LogOut size={15} />
            </button>
          </div>
        </div>
      </header>
      <main className="max-w-6xl mx-auto px-5 py-6">
        <Outlet />
      </main>
    </div>
  );
}
