// In-memory fictional data — no backend.
export type Mode = "demo" | "explore";

export type Task = {
  id: string;
  title: string;
  client?: string;
  due?: string; // ISO-ish display string
  weight: "light" | "medium" | "heavy";
  hard?: boolean;
  done?: boolean;
};

export type Client = {
  id: string;
  name: string;
  relationship: "Realtor" | "Wedding" | "Builder" | "Brand" | "Family";
  since: string;
  jobs: { id: string; title: string; status: "Booked" | "Delivered" | "Invoiced"; amount: number; date: string }[];
};

export type Bill = { id: string; name: string; amount: number; due: string; paid: boolean };

export type Deliverable = { id: string; title: string; client: string; progress: number; due: string };

export type Owner = "You" | "Partner" | "Team";

export type CalEvent = {
  id: string;
  title: string;
  client?: string;
  /** Days from "today". Negative = past, 0 = today, positive = future. */
  dateOffset: number;
  start: string; // "9:00 AM"
  end: string;
  startHour?: number; // 24h for day-view positioning
  kind: "shoot" | "meeting" | "edit" | "personal";
  owner: Owner;
};

export type RecurringItem = {
  id: string;
  name: string;
  amount: number;
  tier: "Need" | "Protect" | "Business" | "Giving";
  category: string;
};

export type Bucket = { id: string; name: string; goal: number; saved: number };
export type Incoming = { id: string; client: string; title: string; amount: number; expected: string };

export const seedTasks: Task[] = [
  { id: "t1", title: "Cull Aspen Ridge listing photos (172 frames)", client: "Aspen Ridge Realty", due: "Today · 4:00 PM", weight: "heavy", hard: true },
  { id: "t2", title: "Send second-pass gallery to Maple & Co", client: "Maple & Co Weddings", due: "Tomorrow", weight: "medium" },
  { id: "t3", title: "Confirm drone window for Northgate build", client: "Northgate Builders", due: "Thu", weight: "light" },
  { id: "t4", title: "Invoice — Harbor Light Inn (Oct shoot)", client: "Harbor Light Inn", due: "Fri", weight: "light", hard: true },
  { id: "t5", title: "Pack kit for Saturday wedding", client: "Maple & Co Weddings", due: "Sat · 6:00 AM", weight: "medium", hard: true },
];

export const seedClients: Client[] = [
  {
    id: "c1", name: "Aspen Ridge Realty", relationship: "Realtor", since: "2022",
    jobs: [
      { id: "j1", title: "14 Birchwood listing", status: "Delivered", amount: 850, date: "Nov 4" },
      { id: "j2", title: "Mountain View open house", status: "Invoiced", amount: 1200, date: "Oct 18" },
      { id: "j3", title: "Cedar Crest twilight set", status: "Booked", amount: 950, date: "Dec 2" },
    ],
  },
  {
    id: "c2", name: "Maple & Co Weddings", relationship: "Wedding", since: "2021",
    jobs: [
      { id: "j4", title: "Harlow + Jensen ceremony", status: "Booked", amount: 4200, date: "Sat" },
      { id: "j5", title: "Okafor engagement", status: "Delivered", amount: 1100, date: "Oct 12" },
    ],
  },
  {
    id: "c3", name: "Northgate Builders", relationship: "Builder", since: "2023",
    jobs: [
      { id: "j6", title: "Phase 2 drone progress", status: "Booked", amount: 1800, date: "Thu" },
      { id: "j7", title: "Phase 1 wrap gallery", status: "Invoiced", amount: 2400, date: "Sep 30" },
    ],
  },
  {
    id: "c4", name: "Harbor Light Inn", relationship: "Brand", since: "2024",
    jobs: [{ id: "j8", title: "Autumn campaign — exteriors", status: "Delivered", amount: 2100, date: "Oct 9" }],
  },
];

export const seedBills: Bill[] = [
  { id: "b1", name: "Adobe Creative Cloud", amount: 59.99, due: "Nov 21", paid: false },
  { id: "b2", name: "Studio rent", amount: 875, due: "Dec 1", paid: false },
  { id: "b3", name: "Backblaze backup", amount: 14, due: "Nov 18", paid: true },
  { id: "b4", name: "Liability insurance", amount: 122, due: "Nov 28", paid: false },
  { id: "b5", name: "Squarespace", amount: 26, due: "Nov 12", paid: true },
];

export const seedDeliverables: Deliverable[] = [
  { id: "d1", title: "Aspen Ridge — 14 Birchwood", client: "Aspen Ridge Realty", progress: 72, due: "Today" },
  { id: "d2", title: "Okafor engagement gallery", client: "Maple & Co Weddings", progress: 90, due: "Tomorrow" },
  { id: "d3", title: "Northgate Phase 2 — Drone cut", client: "Northgate Builders", progress: 35, due: "Next Tue" },
  { id: "d4", title: "Harbor Light — Autumn social pack", client: "Harbor Light Inn", progress: 100, due: "Done" },
];

export const seedEvents: CalEvent[] = [
  { id: "e1", title: "Aspen Ridge — Birchwood reshoot", client: "Aspen Ridge Realty", day: 0, start: "10:00 AM", end: "12:00 PM", kind: "shoot" },
  { id: "e2", title: "Edit block", day: 0, start: "2:00 PM", end: "5:00 PM", kind: "edit" },
  { id: "e3", title: "Northgate site walk", client: "Northgate Builders", day: 2, start: "9:00 AM", end: "10:30 AM", kind: "meeting" },
  { id: "e4", title: "Drone window — Northgate", client: "Northgate Builders", day: 3, start: "7:30 AM", end: "9:00 AM", kind: "shoot" },
  { id: "e5", title: "Maple & Co final walkthrough", client: "Maple & Co Weddings", day: 4, start: "3:00 PM", end: "4:00 PM", kind: "meeting" },
  { id: "e6", title: "Harlow + Jensen wedding", client: "Maple & Co Weddings", day: 5, start: "1:00 PM", end: "11:00 PM", kind: "shoot" },
  { id: "e7", title: "Family dinner", day: 6, start: "6:00 PM", end: "8:00 PM", kind: "personal" },
];

export const shootPrepGear = [
  "Two R5 bodies — batteries fresh",
  "RF 24-70 / 70-200 / 35 1.4",
  "Backup CFexpress (×4)",
  "Speedlights ×2 + V1 modifier",
  "Mavic 3 — props checked, geofence cleared",
  "Contract + shot list printed",
];
