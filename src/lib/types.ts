export type ConsumableCategory = "resident" | "office";
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
  category: ConsumableCategory;
  unitsPerBox: number;
  stockBoxes: number;
  stockUnits: number;
  thresholdBoxes: number;
}

export interface AssetSubcategory {
  id: string;
  name: string;
  prefix: string;
  nextSeq: number;
}

export interface Asset {
  id: string;
  code: string;
  name: string;
  subcategoryId: string;
  status: "available" | "rented";
  holder?: string;
  rentedAt?: string;
}

export interface OutboundLog {
  id: string;
  itemId: string;
  staffName: string;
  boxes: number;
  units: number;
  location: Location;
  timestamp: string;
}

export interface InboundLog {
  id: string;
  itemId: string;
  boxes: number;
  units: number;
  recordedBy: string;
  timestamp: string;
}

export interface OfficeLog {
  id: string;
  itemId: string;
  direction: "in" | "out";
  boxes: number;
  units: number;
  recordedBy: string;
  timestamp: string;
}

export interface RentalLog {
  id: string;
  assetId: string;
  action: "rent" | "return";
  holder: string;
  recordedBy: string;
  timestamp: string;
}

export interface Database {
  staff: Staff[];
  items: ConsumableItem[];
  assetSubcategories: AssetSubcategory[];
  assets: Asset[];
  outboundLogs: OutboundLog[];
  inboundLogs: InboundLog[];
  officeLogs: OfficeLog[];
  rentalLogs: RentalLog[];
}
