import type {
  Staff,
  ConsumableItem,
  AssetSubcategory,
  Asset,
  OutboundLog,
  InboundLog,
  OfficeLog,
  RentalLog,
} from "./types";

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
  { id: "i1", name: "속기저귀", category: "resident", unitsPerBox: 80, stockBoxes: 6, stockUnits: 24, thresholdBoxes: 2 },
  { id: "i2", name: "대기저귀", category: "resident", unitsPerBox: 60, stockBoxes: 3, stockUnits: 10, thresholdBoxes: 2 },
  { id: "i3", name: "팬티형 기저귀", category: "resident", unitsPerBox: 44, stockBoxes: 1, stockUnits: 5, thresholdBoxes: 2 },
  { id: "i4", name: "물티슈", category: "resident", unitsPerBox: 72, stockBoxes: 8, stockUnits: 40, thresholdBoxes: 3 },
  { id: "i5", name: "A4 용지", category: "office", unitsPerBox: 500, stockBoxes: 2, stockUnits: 120, thresholdBoxes: 1 },
  { id: "i6", name: "복사 토너", category: "office", unitsPerBox: 1, stockBoxes: 4, stockUnits: 0, thresholdBoxes: 1 },
];

export const initialAssetSubcategories: AssetSubcategory[] = [
  { id: "c1", name: "전자제품", prefix: "EL", nextSeq: 3 },
  { id: "c2", name: "가구", prefix: "FN", nextSeq: 3 },
  { id: "c3", name: "의료기기", prefix: "MD", nextSeq: 3 },
];

export const initialAssets: Asset[] = [
  { id: "as1", code: "EL-0001", name: "업무용 노트북", subcategoryId: "c1", status: "available" },
  { id: "as2", code: "EL-0002", name: "케어 태블릿 PC", subcategoryId: "c1", status: "rented", holder: "김민지", rentedAt: "2026-09-05T09:12:00" },
  { id: "as3", code: "FN-0001", name: "전동 침대", subcategoryId: "c2", status: "rented", holder: "박수현", rentedAt: "2026-08-28T14:00:00" },
  { id: "as4", code: "FN-0002", name: "보행 보조기", subcategoryId: "c2", status: "available" },
  { id: "as5", code: "MD-0001", name: "혈압 측정기", subcategoryId: "c3", status: "available" },
  { id: "as6", code: "MD-0002", name: "산소포화도 측정기", subcategoryId: "c3", status: "rented", holder: "이영호", rentedAt: "2026-09-08T11:30:00" },
];

export const initialOutboundLogs: OutboundLog[] = [
  { id: "o1", itemId: "i1", staffName: "김민지", boxes: 0, units: 6, location: "B동", timestamp: "2026-09-09T08:10:00" },
  { id: "o2", itemId: "i4", staffName: "박수현", boxes: 0, units: 4, location: "C동", timestamp: "2026-09-09T08:22:00" },
  { id: "o3", itemId: "i3", staffName: "이영호", boxes: 1, units: 0, location: "B동", timestamp: "2026-09-09T09:05:00" },
  { id: "o4", itemId: "i2", staffName: "최은주", boxes: 0, units: 8, location: "C동", timestamp: "2026-09-08T16:40:00" },
  { id: "o5", itemId: "i1", staffName: "정다은", boxes: 0, units: 5, location: "C동", timestamp: "2026-09-08T13:15:00" },
  { id: "o6", itemId: "i4", staffName: "김민지", boxes: 0, units: 6, location: "B동", timestamp: "2026-09-07T10:02:00" },
  { id: "o7", itemId: "i1", staffName: "박수현", boxes: 0, units: 7, location: "B동", timestamp: "2026-09-06T09:47:00" },
  { id: "o8", itemId: "i2", staffName: "이영호", boxes: 0, units: 6, location: "B동", timestamp: "2026-09-05T15:20:00" },
];

export const initialInboundLogs: InboundLog[] = [
  { id: "in1", itemId: "i1", boxes: 10, units: 0, recordedBy: "한지원", timestamp: "2026-09-01T10:00:00" },
  { id: "in2", itemId: "i3", boxes: 5, units: 0, recordedBy: "한지원", timestamp: "2026-09-01T10:05:00" },
  { id: "in3", itemId: "i4", boxes: 8, units: 0, recordedBy: "오세훈", timestamp: "2026-08-25T11:00:00" },
];

export const initialOfficeLogs: OfficeLog[] = [
  { id: "of1", itemId: "i5", direction: "out", boxes: 0, units: 60, recordedBy: "한지원", timestamp: "2026-09-04T09:30:00" },
  { id: "of2", itemId: "i6", direction: "out", boxes: 1, units: 0, recordedBy: "오세훈", timestamp: "2026-09-06T13:00:00" },
  { id: "of3", itemId: "i5", direction: "in", boxes: 3, units: 0, recordedBy: "한지원", timestamp: "2026-08-20T10:00:00" },
];

export const initialRentalLogs: RentalLog[] = [
  { id: "r1", assetId: "as2", action: "rent", holder: "김민지", recordedBy: "한지원", timestamp: "2026-09-05T09:12:00" },
  { id: "r2", assetId: "as3", action: "rent", holder: "박수현", recordedBy: "한지원", timestamp: "2026-08-28T14:00:00" },
  { id: "r3", assetId: "as6", action: "rent", holder: "이영호", recordedBy: "오세훈", timestamp: "2026-09-08T11:30:00" },
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
