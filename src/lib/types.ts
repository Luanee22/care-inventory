export type Location = "B동" | "C동";

export interface Staff {
  id: string;
  name: string;
  role: "caregiver" | "admin";
  active: boolean;
}

export interface ConsumableItem {
  id: string;
  name: string;
  unitsPerBox: number;
  stockBoxes: number;
  stockUnits: number;
  thresholdBoxes: number;
}

export interface OutboundLog {
  id: string;
  itemId: string;
  staffName: string;
  units: number;
  location: Location;
  timestamp: string;
}

export interface InboundLog {
  id: string;
  itemId: string;
  boxes: number;
  recordedBy: string;
  timestamp: string;
}

export interface Database {
  staff: Staff[];
  items: ConsumableItem[];
  outboundLogs: OutboundLog[];
  inboundLogs: InboundLog[];
}
