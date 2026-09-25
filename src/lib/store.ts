import { useSyncExternalStore } from "react";
import type { Database, Location, OutboundLog, InboundLog } from "./types";
import { initialStaff, initialItems, initialOutboundLogs, initialInboundLogs } from "./mockData";

const STORAGE_KEY = "care-inventory-db-v2";
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
    outboundLogs: initialOutboundLogs,
    inboundLogs: initialInboundLogs,
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

export function logOutbound(itemId: string, staffName: string, units: number, location: Location) {
  update((d) => {
    const item = d.items.find((i) => i.id === itemId);
    if (!item) return d;
    const availableUnits = item.stockBoxes * item.unitsPerBox + item.stockUnits;
    const nextTotal = Math.max(0, availableUnits - units);
    const newBoxes = Math.floor(nextTotal / item.unitsPerBox);
    const newUnits = nextTotal % item.unitsPerBox;
    const log: OutboundLog = {
      id: uid("o"),
      itemId,
      staffName,
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

export function logInbound(itemId: string, boxes: number, recordedBy: string) {
  update((d) => {
    const item = d.items.find((i) => i.id === itemId);
    if (!item) return d;
    const log: InboundLog = { id: uid("in"), itemId, boxes, recordedBy, timestamp: new Date().toISOString() };
    return {
      ...d,
      items: d.items.map((i) => (i.id === itemId ? { ...i, stockBoxes: i.stockBoxes + boxes } : i)),
      inboundLogs: [log, ...d.inboundLogs],
    };
  });
}

export function editOutboundLog(logId: string, units: number) {
  update((d) => ({
    ...d,
    outboundLogs: d.outboundLogs.map((l) => (l.id === logId ? { ...l, units } : l)),
  }));
}

export function isEditable(timestamp: string, isAdmin: boolean) {
  if (isAdmin) return true;
  const diffMinutes = (Date.now() - new Date(timestamp).getTime()) / 60000;
  return diffMinutes <= EDIT_WINDOW_MINUTES;
}

// ---- admin management ----

export function addStaff(name: string, role: "caregiver" | "admin") {
  update((d) => ({ ...d, staff: [...d.staff, { id: uid("s"), name, role, active: true }] }));
}

export function setStaffActive(staffId: string, active: boolean) {
  update((d) => ({ ...d, staff: d.staff.map((s) => (s.id === staffId ? { ...s, active } : s)) }));
}

export function addItem(name: string, unitsPerBox: number, thresholdBoxes: number) {
  update((d) => ({
    ...d,
    items: [...d.items, { id: uid("i"), name, unitsPerBox, stockBoxes: 0, stockUnits: 0, thresholdBoxes }],
  }));
}

export function updateThreshold(itemId: string, thresholdBoxes: number) {
  update((d) => ({ ...d, items: d.items.map((i) => (i.id === itemId ? { ...i, thresholdBoxes } : i)) }));
}
