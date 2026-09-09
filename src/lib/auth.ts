import { useSyncExternalStore } from "react";

const SESSION_KEY = "care-inventory-admin-session";
// 배포 시 Vercel 환경변수 VITE_ADMIN_PASSWORD를 반드시 설정할 것.
// 설정하지 않으면 로컬 개발 편의를 위한 데모 비밀번호로 동작한다 (운영 배포 금지).
const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD ?? "admin1234";
export const isDemoPassword = !import.meta.env.VITE_ADMIN_PASSWORD;

const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((l) => l());
}

export function subscribeAuth(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

let cachedRaw: string | null = null;
let cachedSession: { name: string } | null = null;

export function getAuthSnapshot(): { name: string } | null {
  const raw = sessionStorage.getItem(SESSION_KEY);
  if (raw !== cachedRaw) {
    cachedRaw = raw;
    cachedSession = raw ? JSON.parse(raw) : null;
  }
  return cachedSession;
}

export function useAdminSession() {
  return useSyncExternalStore(subscribeAuth, getAuthSnapshot);
}

export function loginAdmin(name: string, password: string): boolean {
  if (password !== ADMIN_PASSWORD) return false;
  sessionStorage.setItem(SESSION_KEY, JSON.stringify({ name }));
  emit();
  return true;
}

export function logoutAdmin() {
  sessionStorage.removeItem(SESSION_KEY);
  emit();
}
