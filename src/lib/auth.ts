import { useSyncExternalStore } from "react";

const SESSION_KEY = "care-inventory-admin-session";
// 데모 기본 비밀번호. 운영 전 반드시 변경하고, 이후 실제 인증 방식(구글시트 연동)으로 교체할 것.
const ADMIN_PASSWORD = "admin1234";

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
