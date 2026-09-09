import { useSyncExternalStore } from "react";
import type {
  Database,
  Location,
  OutboundLog,
  InboundLog,
  OfficeLog,
  RentalLog,
  Staff,
  ConsumableItem,
  Asset,
  AssetSubcategory,
} from "./types";
import {
  initialStaff,
  initialItems,
  initialAssetSubcategories,
  initialAssets,
  initialOutboundLogs,
  initialInboundLogs,
  initialOfficeLogs,
  initialRentalLogs,
} from "./mockData";

const STORAGE_KEY = "care-inventory-db-v1";
export const EDIT_WINDOW_MINUTES = 10;

function loadInitial(): Database {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as Database;
  } catch {
    // ignore corrupted storage, fall through to seed data
  }
  return {
    staff: initialStaff,
    items: initialItems,
    assetSubcategories: initialAssetSubcategories,
    assets: initialAssets,
    outboundLogs: initialOutboundLogs,
    inboundLogs: initialInboundLogs,
    officeLogs: initialOfficeLogs,
    rentalLogs: initialRentalLogs,
  };
}

let db: Database = loadInitial();
const listeners = new Set<() => void>();

function emit() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
  } catch {
    // storage may be unavailable (private mode); state still updates in-memory
  }
  listeners.forEach((l) => l());
}

function update(mutator: (draft: Database) => Database) {
  db = mutator(db);
  emit();
}

export function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getSnapshot(): Database {
  return db;
}

export function useDatabase(): Database {
  return useSyncExternalStore(subscribe, getSnapshot);
}

function uid(prefix: string) {
  return `${prefix}${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
}

// ---- consumable movements ----

export function logOutbound(itemId: string, staffName: string, boxes: number, units: number, location: Location) {
  update((d) => {
    const item = d.items.find((i) => i.id === itemId);
    if (!item) return d;
    const totalUnitsRequested = boxes * item.unitsPerBox + units;
    const availableUnits = item.stockBoxes * item.unitsPerBox + item.stockUnits;
    const nextTotal = Math.max(0, availableUnits - totalUnitsRequested);
    const newBoxes = Math.floor(nextTotal / item.unitsPerBox);
    const newUnits = nextTotal % item.unitsPerBox;
    const log: OutboundLog = {
      id: uid("o"),
      itemId,
      staffName,
      boxes,
      units,
      location,
      timestamp: new Date().toISOString(),
    };
    return {
      ...d,
      items: d.items.map((i) => (i.id === itemId ? { ...i, stockBoxes: newBoxes, stockUnits: newUnits } : i)),
      outboundLogs: [log, ...d.outboundLogs],
    };
  });
}

export function logInbound(itemId: string, boxes: number, units: number, recordedBy: string) {
  update((d) => {
    const item = d.items.find((i) => i.id === itemId);
    if (!item) return d;
    const log: InboundLog = { id: uid("in"), itemId, boxes, units, recordedBy, timestamp: new Date().toISOString() };
    return {
      ...d,
      items: d.items.map((i) =>
        i.id === itemId ? { ...i, stockBoxes: i.stockBoxes + boxes, stockUnits: i.stockUnits + units } : i
      ),
      inboundLogs: [log, ...d.inboundLogs],
    };
  });
}

export function logOfficeMovement(
  itemId: string,
  direction: "in" | "out",
  boxes: number,
  units: number,
  recordedBy: string
) {
  update((d) => {
    const item = d.items.find((i) => i.id === itemId);
    if (!item) return d;
    const sign = direction === "in" ? 1 : -1;
    const availableUnits = item.stockBoxes * item.unitsPerBox + item.stockUnits;
    const delta = boxes * item.unitsPerBox + units;
    const nextTotal = Math.max(0, availableUnits + sign * delta);
    const newBoxes = Math.floor(nextTotal / item.unitsPerBox);
    const newUnits = nextTotal % item.unitsPerBox;
    const log: OfficeLog = {
      id: uid("of"),
      itemId,
      direction,
      boxes,
      units,
      recordedBy,
      timestamp: new Date().toISOString(),
    };
    return {
      ...d,
      items: d.items.map((i) => (i.id === itemId ? { ...i, stockBoxes: newBoxes, stockUnits: newUnits } : i)),
      officeLogs: [log, ...d.officeLogs],
    };
  });
}

export function editOutboundLog(logId: string, boxes: number, units: number) {
  update((d) => ({
    ...d,
    outboundLogs: d.outboundLogs.map((l) => (l.id === logId ? { ...l, boxes, units } : l)),
  }));
}

export function isEditable(timestamp: string, isAdmin: boolean) {
  if (isAdmin) return true;
  const diffMinutes = (Date.now() - new Date(timestamp).getTime()) / 60000;
  return diffMinutes <= EDIT_WINDOW_MINUTES;
}

// ---- assets ----

export function registerAsset(name: string, subcategoryId: string) {
  update((d) => {
    const sub = d.assetSubcategories.find((s) => s.id === subcategoryId);
    if (!sub) return d;
    const code = `${sub.prefix}-${String(sub.nextSeq).padStart(4, "0")}`;
    const asset: Asset = { id: uid("as"), code, name, subcategoryId, status: "available" };
    return {
      ...d,
      assetSubcategories: d.assetSubcategories.map((s) =>
        s.id === subcategoryId ? { ...s, nextSeq: s.nextSeq + 1 } : s
      ),
      assets: [asset, ...d.assets],
    };
  });
}

export function addAssetSubcategory(name: string, prefix: string) {
  update((d) => ({
    ...d,
    assetSubcategories: [...d.assetSubcategories, { id: uid("c"), name, prefix: prefix.toUpperCase(), nextSeq: 1 }],
  }));
}

export function rentAsset(assetId: string, holder: string, recordedBy: string) {
  update((d) => {
    const log: RentalLog = { id: uid("r"), assetId, action: "rent", holder, recordedBy, timestamp: new Date().toISOString() };
    return {
      ...d,
      assets: d.assets.map((a) =>
        a.id === assetId ? { ...a, status: "rented", holder, rentedAt: log.timestamp } : a
      ),
      rentalLogs: [log, ...d.rentalLogs],
    };
  });
}

export function returnAsset(assetId: string, recordedBy: string) {
  update((d) => {
    const asset = d.assets.find((a) => a.id === assetId);
    const log: RentalLog = {
      id: uid("r"),
      assetId,
      action: "return",
      holder: asset?.holder ?? "",
      recordedBy,
      timestamp: new Date().toISOString(),
    };
    return {
      ...d,
      assets: d.assets.map((a) => (a.id === assetId ? { ...a, status: "available", holder: undefined, rentedAt: undefined } : a)),
      rentalLogs: [log, ...d.rentalLogs],
    };
  });
}

// ---- admin management ----

export function addStaff(name: string, role: Staff["role"]) {
  update((d) => ({ ...d, staff: [...d.staff, { id: uid("s"), name, role, active: true }] }));
}

export function setStaffActive(staffId: string, active: boolean) {
  update((d) => ({ ...d, staff: d.staff.map((s) => (s.id === staffId ? { ...s, active } : s)) }));
}

export function addItem(name: string, category: ConsumableItem["category"], unitsPerBox: number, thresholdBoxes: number) {
  update((d) => ({
    ...d,
    items: [
      ...d.items,
      { id: uid("i"), name, category, unitsPerBox, stockBoxes: 0, stockUnits: 0, thresholdBoxes },
    ],
  }));
}

export function updateThreshold(itemId: string, thresholdBoxes: number) {
  update((d) => ({ ...d, items: d.items.map((i) => (i.id === itemId ? { ...i, thresholdBoxes } : i)) }));
}
