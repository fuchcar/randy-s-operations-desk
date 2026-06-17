import { useEffect, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useDesk } from "./store";

export type ExplainId =
  | "do-this-next"
  | "board-heat"
  | "hard-deadlines"
  | "coming-up"
  | "mode-toggle"
  | "money-balance"
  | "money-in"
  | "money-out"
  | "bills"
  | "clients"
  | "client-detail"
  | "deliverables"
  | "calendar"
  | "ask-randy"
  | "hand-to-randy";

const EXPLAIN: Record<ExplainId, { title: string; body: string }> = {
  "do-this-next": {
    title: "Do this next",
    body: "The one thing worth doing now. I weigh deadlines, dependencies, and effort and point at the single task that unblocks the most.",
  },
  "board-heat": {
    title: "Board heat",
    body: "How loaded your plate is, as one honest number — open work weighted by effort, not a task count. Past 75% I start politely declining new jobs.",
  },
  "hard-deadlines": {
    title: "Hard deadlines",
    body: "The dates that don't negotiate, sorted by when they bite.",
  },
  "coming-up": {
    title: "Coming up",
    body: "Your next shoot with the prep already done — gear list the night before, leave-by time and directions on the day.",
  },
  "mode-toggle": {
    title: "Demo vs Explore",
    body: "Two ways in. Demo is a fully-stocked fictional business; Explore lets you type your own and see what I'd automate.",
  },
  "money-balance": {
    title: "Balance",
    body: "Your real number, across accounts, in one place.",
  },
  "money-in": {
    title: "Money in",
    body: "What cleared this month. I tag each deposit to the job it came from, so the number always ties back to real work.",
  },
  "money-out": {
    title: "Money out",
    body: "Where it went — gear, rent, software, fuel. Categorized as it lands, never reconciled in a Sunday-night panic.",
  },
  bills: {
    title: "Bills",
    body: "What's owed versus what's handled — I'd flag a bill the day before, never the day of.",
  },
  clients: {
    title: "Clients",
    body: "Your little black book: relationship, history, contact, and the one note that matters about each.",
  },
  "client-detail": {
    title: "Client detail",
    body: "Everything I know about this one — the contact, the history, the quirks. The note in italics is the thing you'd forget if I didn't keep it here.",
  },
  deliverables: {
    title: "Deliverables",
    body: "Honest progress, not 'almost done.' Drag it to where the work actually is and I keep the client gently informed.",
  },
  calendar: {
    title: "Calendar",
    body: "Your week on one screen — shoots, meetings, edits — color-coded to read from across the room.",
  },
  "ask-randy": {
    title: "Ask Randy",
    body: "The catch-all. Type anything that doesn't fit a room and I take it from there.",
  },
  "hand-to-randy": {
    title: "Hand to Randy",
    body: "The handoff. Wired up, I'd actually do the next step — cull, draft, schedule — and leave it for your sign-off.",
  },
};

type MenuState = { x: number; y: number; id: ExplainId } | null;

// Module-level menu controller so a single overlay handles all Explainables.
let openMenu: ((m: MenuState) => void) | null = null;

export function Explainable({
  id,
  children,
  className,
  asChild = false,
}: {
  id: ExplainId;
  children: ReactNode;
  className?: string;
  asChild?: boolean;
}) {
  const longPressTimer = useRef<number | null>(null);

  const onContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    openMenu?.({ x: e.clientX, y: e.clientY, id });
  };

  const onTouchStart = (e: React.TouchEvent) => {
    const t = e.touches[0];
    if (!t) return;
    const x = t.clientX, y = t.clientY;
    longPressTimer.current = window.setTimeout(() => {
      openMenu?.({ x, y, id });
    }, 500);
  };
  const cancelTouch = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  };

  const handlers = {
    onContextMenu,
    onTouchStart,
    onTouchEnd: cancelTouch,
    onTouchMove: cancelTouch,
    onTouchCancel: cancelTouch,
  };

  if (asChild) {
    // Caller is responsible for spreading handlers; fall back to wrapper.
  }

  return (
    <div className={className} {...handlers} style={{ display: "contents" }}>
      {children}
    </div>
  );
}

/** Mount once near the app root. */
export function ExplainMenu() {
  const [menu, setMenu] = useState<MenuState>(null);
  const showPopup = useDesk((s) => s.showPopup);

  useEffect(() => {
    openMenu = setMenu;
    return () => { openMenu = null; };
  }, []);

  useEffect(() => {
    if (!menu) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setMenu(null); };
    const onClick = () => setMenu(null);
    const onScroll = () => setMenu(null);
    window.addEventListener("keydown", onKey);
    window.addEventListener("mousedown", onClick);
    window.addEventListener("scroll", onScroll, true);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("mousedown", onClick);
      window.removeEventListener("scroll", onScroll, true);
    };
  }, [menu]);

  return (
    <AnimatePresence>
      {menu && (
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: -4 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96 }}
          transition={{ duration: 0.12 }}
          className="paper fixed z-[90] overflow-hidden rounded-xl p-1 shadow-2xl ring-1 ring-[color:var(--gold-soft)]/40"
          style={{
            top: Math.min(menu.y, (typeof window !== "undefined" ? window.innerHeight : 800) - 60),
            left: Math.min(menu.x, (typeof window !== "undefined" ? window.innerWidth : 1200) - 240),
            minWidth: 220,
          }}
          onMouseDown={(e) => e.stopPropagation()}
        >
          <button
            onClick={() => {
              const e = EXPLAIN[menu.id];
              if (e) showPopup({ tag: "What's this?", title: e.title, body: e.body });
              setMenu(null);
            }}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm transition hover:bg-[color:var(--surface-2)]"
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[color:var(--surface-2)] text-base">🦝</span>
            <span>
              <span className="block text-[10px] uppercase tracking-[0.18em] gold-text/80">Ask Randy</span>
              <span className="block text-[color:var(--parchment)]">What's this?</span>
            </span>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
