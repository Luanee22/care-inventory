import type { ConsumableItem } from "./types";

export function formatStock(item: Pick<ConsumableItem, "stockBoxes" | "stockUnits">) {
  const parts: string[] = [];
  if (item.stockBoxes > 0) parts.push(`${item.stockBoxes}박스`);
  parts.push(`${item.stockUnits}개`);
  return parts.join(" ");
}

export function isBelowThreshold(item: ConsumableItem) {
  return item.stockBoxes <= item.thresholdBoxes;
}

export function formatDateTime(iso: string) {
  const d = new Date(iso);
  return d.toLocaleString("ko-KR", {
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

export function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("ko-KR", { year: "numeric", month: "2-digit", day: "2-digit" });
}

export function timeAgo(iso: string) {
  const diffMs = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "방금 전";
  if (mins < 60) return `${mins}분 전`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}시간 전`;
  return `${Math.floor(hours / 24)}일 전`;
}
