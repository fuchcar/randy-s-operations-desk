import { motion } from "framer-motion";
import { useDesk } from "./store";
import { Today } from "./rooms/Today";
import { Money } from "./rooms/Money";
import { Clients } from "./rooms/Clients";
import { Deliverables } from "./rooms/Deliverables";
import { Calendar } from "./rooms/Calendar";
import { Ask } from "./rooms/Ask";
import { RandyModal } from "./RandyModal";
import { Tour } from "./Tour";

const ROOMS = [
  { id: "today", label: "Today" },
  { id: "money", label: "Money" },
  { id: "clients", label: "Clients" },
  { id: "deliverables", label: "Deliverables" },
  { id: "calendar", label: "Calendar" },
  { id: "ask", label: "Ask Randy" },
];

export function DeskShell() {
  const mode = useDesk((s) => s.mode);
  const setMode = useDesk((s) => s.setMode);
  const room = useDesk((s) => s.room);
  const setRoom = useDesk((s) => s.setRoom);
  const startTour = useDesk((s) => s.startTour);

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-[color:var(--border)]/70 bg-[color:var(--background)]/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-4">
          <div className="flex items-center gap-3" data-tour="header-randy">
            <motion.div
              initial={{ rotate: -8, scale: 0.9 }}
              animate={{ rotate: 0, scale: 1 }}
              transition={{ type: "spring", stiffness: 220, damping: 14 }}
              className="flex h-11 w-11 items-center justify-center rounded-full bg-[color:var(--surface-2)] text-2xl ring-1 ring-[color:var(--gold-soft)]/40"
            >🦝</motion.div>
            <div className="leading-tight">
              <div className="text-[10px] uppercase tracking-[0.22em] gold-text/80">Meet Randy</div>
              <div className="font-serif text-xl">Randy's Desk</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <ModeToggle mode={mode} onChange={setMode} />
            <button
              onClick={startTour}
              className="rounded-md border border-[color:var(--gold-soft)]/50 px-3 py-1.5 text-xs text-[color:var(--parchment)] transition hover:bg-[color:var(--gold)]/10"
            >
              Take the tour
            </button>
          </div>
        </div>

        {/* Room tabs */}
        <nav className="mx-auto flex max-w-6xl items-center gap-1 overflow-x-auto px-3 pb-2">
          {ROOMS.map((r) => (
            <button
              key={r.id}
              data-tour={`tab-${r.id}`}
              onClick={() => setRoom(r.id)}
              className="relative shrink-0 rounded-md px-3 py-2 text-sm transition hover:text-[color:var(--parchment)]"
            >
              <span className={room === r.id ? "gold-text" : "text-muted-foreground"}>{r.label}</span>
              {room === r.id && (
                <motion.div
                  layoutId="tab-underline"
                  className="absolute inset-x-2 -bottom-0.5 h-0.5 rounded-full bg-[color:var(--gold)]"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
            </button>
          ))}
        </nav>
      </header>

      {/* Main */}
      <main className="mx-auto max-w-6xl px-5 py-8">
        <motion.div
          key={room}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: [0.22, 0.61, 0.36, 1] }}
        >
          {room === "today" && <Today />}
          {room === "money" && <Money />}
          {room === "clients" && <Clients />}
          {room === "deliverables" && <Deliverables />}
          {room === "calendar" && <Calendar />}
          {room === "ask" && <Ask />}
        </motion.div>
      </main>

      <footer className="mx-auto max-w-6xl px-5 pb-10 pt-4 text-center text-xs text-muted-foreground">
        A portfolio demo · all data is fictional · no accounts, no databases, just Randy.
      </footer>

      <RandyModal />
      <Tour />
    </div>
  );
}

function ModeToggle({ mode, onChange }: { mode: "demo" | "explore"; onChange: (m: "demo" | "explore") => void }) {
  return (
    <div className="relative flex rounded-full border border-[color:var(--border)] bg-[color:var(--surface)] p-1 text-xs">
      {(["demo", "explore"] as const).map((m) => (
        <button
          key={m}
          onClick={() => onChange(m)}
          className="relative z-10 rounded-full px-3 py-1.5 capitalize transition"
        >
          <span className={mode === m ? "text-[color:var(--ink)]" : "text-muted-foreground"}>{m}</span>
        </button>
      ))}
      <motion.div
        layout
        transition={{ type: "spring", stiffness: 380, damping: 30 }}
        className="absolute inset-y-1 w-[calc(50%-2px)] rounded-full bg-[color:var(--gold)]"
        style={{ left: mode === "demo" ? 4 : "calc(50% + 0px)" }}
      />
    </div>
  );
}
