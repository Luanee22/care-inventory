import type { Staff, ConsumableItem, OutboundLog, InboundLog } from "./types";

export const initialStaff: Staff[] = [
  { id: "s1", name: "김민지", role: "caregiver", active: true },
  { id: "s2", name: "박수현", role: "caregiver", active: true },
  { id: "s3", name: "이영호", role: "caregiver", active: true },
  { id: "s4", name: "최은주", role: "caregiver", active: true },
  { id: "s5", name: "정다은", role: "caregiver", active: true },
  { id: "a1", name: "한지원", role: "admin", active: true },
  { id: "a2", name: "오세훈", role: "admin", active: true },
];

export const initialItems: ConsumableItem[] = [
  { id: "i1", name: "속기저귀", unitsPerBox: 80, stockBoxes: 6, stockUnits: 24, thresholdBoxes: 2 },
  { id: "i2", name: "대기저귀", unitsPerBox: 60, stockBoxes: 3, stockUnits: 10, thresholdBoxes: 2 },
  { id: "i3", name: "팬티형 기저귀", unitsPerBox: 44, stockBoxes: 1, stockUnits: 5, thresholdBoxes: 2 },
  { id: "i4", name: "물티슈", unitsPerBox: 72, stockBoxes: 8, stockUnits: 40, thresholdBoxes: 3 },
];

export const initialOutboundLogs: OutboundLog[] = [
  { id: "o1", itemId: "i1", staffName: "김민지", units: 6, location: "B동", timestamp: "2026-09-25T08:10:00" },
  { id: "o2", itemId: "i4", staffName: "박수현", units: 4, location: "C동", timestamp: "2026-09-25T08:22:00" },
  { id: "o3", itemId: "i3", staffName: "이영호", units: 10, location: "B동", timestamp: "2026-09-25T09:05:00" },
  { id: "o4", itemId: "i2", staffName: "최은주", units: 8, location: "C동", timestamp: "2026-09-24T16:40:00" },
  { id: "o5", itemId: "i1", staffName: "정다은", units: 5, location: "C동", timestamp: "2026-09-24T13:15:00" },
  { id: "o6", itemId: "i4", staffName: "김민지", units: 6, location: "B동", timestamp: "2026-09-23T10:02:00" },
  { id: "o7", itemId: "i1", staffName: "박수현", units: 7, location: "B동", timestamp: "2026-09-22T09:47:00" },
  { id: "o8", itemId: "i2", staffName: "이영호", units: 6, location: "B동", timestamp: "2026-09-21T15:20:00" },
];

export const initialInboundLogs: InboundLog[] = [
  { id: "in1", itemId: "i1", boxes: 10, recordedBy: "한지원", timestamp: "2026-09-17T10:00:00" },
  { id: "in2", itemId: "i3", boxes: 5, recordedBy: "한지원", timestamp: "2026-09-17T10:05:00" },
  { id: "in3", itemId: "i4", boxes: 8, recordedBy: "오세훈", timestamp: "2026-09-10T11:00:00" },
];

// ---- precomputed report datasets for the dashboard charts ----

export const monthlyOutboundTrend = [
  { month: "4월", value: 612 },
  { month: "5월", value: 684 },
  { month: "6월", value: 598 },
  { month: "7월", value: 731 },
  { month: "8월", value: 812 },
  { month: "9월", value: 344 },
];

export const yearlyTrend = [
  { year: "2024", value: 7420 },
  { year: "2025", value: 8380 },
  { year: "2026", value: 8990 },
];

export const locationComparison = [
  { month: "4월", B동: 320, C동: 292 },
  { month: "5월", B동: 350, C동: 334 },
  { month: "6월", B동: 305, C동: 293 },
  { month: "7월", B동: 388, C동: 343 },
  { month: "8월", B동: 420, C동: 392 },
  { month: "9월", B동: 178, C동: 166 },
];

export const consumptionShare = [
  { name: "속기저귀", value: 29 },
  { name: "물티슈", value: 24 },
  { name: "대기저귀", value: 21 },
  { name: "팬티형 기저귀", value: 16 },
  { name: "기타", value: 10 },
];
