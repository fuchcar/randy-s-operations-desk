import { create } from "zustand";
import {
  seedTasks, seedClients, seedBills, seedDeliverables, seedEvents,
  type Mode, type Task, type Client, type Bill, type Deliverable, type CalEvent,
} from "./data";

type RandyPopup = { title: string; body: string; tag?: string } | null;

type State = {
  mode: Mode;
  setMode: (m: Mode) => void;

  room: string;
  setRoom: (r: string) => void;

  tasks: Task[];
  toggleTask: (id: string) => void;
  addTask: (t: Omit<Task, "id">) => void;

  clients: Client[];
  addClient: (c: Omit<Client, "id" | "jobs">) => void;

  bills: Bill[];
  togglePaid: (id: string) => void;
  addBill: (b: Omit<Bill, "id">) => void;

  deliverables: Deliverable[];
  setProgress: (id: string, p: number) => void;

  events: CalEvent[];

  // Randy modal
  popup: RandyPopup;
  showPopup: (p: NonNullable<RandyPopup>) => void;
  hidePopup: () => void;

  // Tour
  tourStep: number;       // -1 = inactive
  tourMinimized: boolean;
  startTour: () => void;
  nextTour: () => void;
  prevTour: () => void;
  endTour: () => void;
  minimizeTour: () => void;
  resumeTour: () => void;
  tourTotal: number;
};

const uid = () => Math.random().toString(36).slice(2, 9);

export const useDesk = create<State>((set, get) => ({
  mode: "demo",
  setMode: (m) => set({ mode: m }),

  room: "today",
  setRoom: (r) => set({ room: r }),

  tasks: seedTasks,
  toggleTask: (id) => set({ tasks: get().tasks.map(t => t.id === id ? { ...t, done: !t.done } : t) }),
  addTask: (t) => set({ tasks: [{ id: uid(), ...t }, ...get().tasks] }),

  clients: seedClients,
  addClient: (c) => set({ clients: [{ id: uid(), jobs: [], ...c }, ...get().clients] }),

  bills: seedBills,
  togglePaid: (id) => set({ bills: get().bills.map(b => b.id === id ? { ...b, paid: !b.paid } : b) }),
  addBill: (b) => set({ bills: [{ id: uid(), ...b }, ...get().bills] }),

  deliverables: seedDeliverables,
  setProgress: (id, p) => set({ deliverables: get().deliverables.map(d => d.id === id ? { ...d, progress: p } : d) }),

  events: seedEvents,

  popup: null,
  showPopup: (p) => set({ popup: p }),
  hidePopup: () => set({ popup: null }),

  tourStep: -1,
  tourMinimized: false,
  tourTotal: 9,
  startTour: () => set({ tourStep: 0, room: "today", tourMinimized: false }),
  nextTour: () => set({ tourStep: get().tourStep + 1 }),
  prevTour: () => set({ tourStep: Math.max(0, get().tourStep - 1) }),
  endTour: () => set({ tourStep: -1, tourMinimized: false }),
  minimizeTour: () => set({ tourMinimized: true }),
  resumeTour: () => set({ tourMinimized: false }),
}));
