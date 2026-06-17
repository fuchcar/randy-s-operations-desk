import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useDesk } from "./store";
import { RandyAvatar } from "./RandyAvatar";

type Step = {
  target: string; // data-tour attribute value
  room: string;
  title: string;
  body: string;
  placement?: "bottom" | "top" | "right" | "left";
};

const steps: Step[] = [
  {
    target: "header-randy", room: "today",
    title: "Welcome to the Desk.",
    body: "I'm Randy. I keep the operation running so you can keep making the work. Toggle between Demo and Explore up top — Explore lets you poke at things yourself.",
    placement: "bottom",
  },
  {
    target: "do-next", room: "today",
    title: "Do this next.",
    body: "Every morning I pick the one thing that actually moves the needle. Not the loudest thing. The right thing.",
    placement: "bottom",
  },
  {
    target: "board-heat", room: "today",
    title: "Board heat.",
    body: "How loaded the week is. Green means breathing room, gold means focused, red means we say no to anything new.",
    placement: "bottom",
  },
  {
    target: "shoot-prep", room: "today",
    title: "Coming up.",
    body: "Your next shoot, with the gear checklist already drafted. Tap an item to mark it packed.",
    placement: "top",
  },
  {
    target: "tab-money", room: "money",
    title: "Money — the true ledger.",
    body: "Available, minus what's already coming (rent, insurance, the standing items), equals Spendable. Definite money, no guesswork. The donut shows where each dollar goes — green for Needs, blue for Protections, gold for Business, plum for Giving — and the bars below put income against outflow so the cushion is honest.",
    placement: "bottom",
  },
  {
    target: "tab-clients", room: "clients",
    title: "Clients.",
    body: "Your little black book — relationships, job history, the works. Click any name for the detail panel.",
    placement: "bottom",
  },
  {
    target: "tab-deliverables", room: "deliverables",
    title: "Deliverables.",
    body: "Every project in flight, with an honest progress slider. Drag it. Move the truth, not the optics.",
    placement: "bottom",
  },
  {
    target: "tab-calendar", room: "calendar",
    title: "Calendar.",
    body: "Day, Week, Month, or List — same data, four lenses. Click any day in Month for a floating detail popover, and use the owner chips to show or hide whose events you're looking at.",
    placement: "bottom",
  },
  {
    target: "tab-ask", room: "ask",
    title: "Ask Randy.",
    body: "Type anything. \"Draft a follow-up for Aspen Ridge.\" \"What did Maple & Co pay last year?\" If it touches your work, I touch it.",
    placement: "bottom",
  },
  {
    target: "header-randy", room: "today",
    title: "One more thing.",
    body: "Anywhere you see a card, right-click it (or long-press on touch) and I'll tell you what it's showing. Same trick works on every box, in every room.",
    placement: "bottom",
  },
];

export function Tour() {
  const step = useDesk((s) => s.tourStep);
  const minimized = useDesk((s) => s.tourMinimized);
  const next = useDesk((s) => s.nextTour);
  const prev = useDesk((s) => s.prevTour);
  const end = useDesk((s) => s.endTour);
  const minimize = useDesk((s) => s.minimizeTour);
  const resume = useDesk((s) => s.resumeTour);
  const setRoom = useDesk((s) => s.setRoom);

  const active = step >= 0 && step < steps.length;
  const current = active ? steps[step] : null;
  const showCoachmark = active && !minimized;

  // First-visit auto-start
  const startTour = useDesk((s) => s.startTour);
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!localStorage.getItem("randy-tour-seen")) {
      const t = setTimeout(() => {
        localStorage.setItem("randy-tour-seen", "1");
        startTour();
      }, 600);
      return () => clearTimeout(t);
    }
  }, [startTour]);

  // Switch room when step requires it (but not while minimized — let user roam)
  useEffect(() => {
    if (current && !minimized) setRoom(current.room);
  }, [step, minimized]); // eslint-disable-line

  const [rect, setRect] = useState<DOMRect | null>(null);
  const rafRef = useRef<number | null>(null);

  useLayoutEffect(() => {
    if (!showCoachmark || !current) { setRect(null); return; }
    const measure = () => {
      const el = document.querySelector<HTMLElement>(`[data-tour="${current.target}"]`);
      if (el) {
        el.scrollIntoView({ block: "center", behavior: "smooth" });
        setRect(el.getBoundingClientRect());
      } else {
        setRect(null);
      }
    };
    measure();
    const id = window.setInterval(measure, 250);
    const onResize = () => measure();
    window.addEventListener("resize", onResize);
    window.addEventListener("scroll", onResize, true);
    return () => {
      window.clearInterval(id);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", onResize, true);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [step, current?.target, showCoachmark]);

  // Floating "Resume" chip while minimized
  if (active && minimized) {
    return (
      <motion.button
        initial={{ opacity: 0, y: 12, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 12 }}
        transition={{ type: "spring", stiffness: 280, damping: 22 }}
        onClick={resume}
        className="paper fixed bottom-5 right-5 z-[70] flex items-center gap-3 rounded-full px-4 py-2.5 shadow-2xl ring-1 ring-[color:var(--gold-soft)]/40 hover:brightness-110 transition"
      >
        <RandyAvatar size={28} />
        <span className="text-xs">
          <span className="gold-text">Resume tour</span>
          <span className="text-muted-foreground"> · {step + 1}/{steps.length}</span>
        </span>
      </motion.button>
    );
  }

  if (!showCoachmark || !current) return null;

  const pad = 10;
  const r = rect
    ? { top: rect.top - pad, left: rect.left - pad, width: rect.width + pad * 2, height: rect.height + pad * 2 }
    : null;

  // Coachmark position
  let cm: React.CSSProperties = { top: "50%", left: "50%", transform: "translate(-50%, -50%)" };
  if (r) {
    const place = current.placement ?? "bottom";
    const vw = typeof window !== "undefined" ? window.innerWidth : 1200;
    const cardW = Math.min(360, vw - 24);
    if (place === "bottom") {
      cm = { top: r.top + r.height + 14, left: Math.max(12, Math.min(vw - cardW - 12, r.left + r.width / 2 - cardW / 2)), width: cardW };
    } else if (place === "top") {
      cm = { top: Math.max(12, r.top - 14 - 200), left: Math.max(12, Math.min(vw - cardW - 12, r.left + r.width / 2 - cardW / 2)), width: cardW };
    } else if (place === "right") {
      cm = { top: r.top, left: r.left + r.width + 14, width: cardW };
    } else {
      cm = { top: r.top, left: Math.max(12, r.left - cardW - 14), width: cardW };
    }
  }

  return (
    <div className="fixed inset-0 z-[70] pointer-events-none">
      {/* Dim with cut-out */}
      <svg className="absolute inset-0 h-full w-full pointer-events-auto" onClick={minimize}>
        <defs>
          <mask id="tour-mask">
            <rect width="100%" height="100%" fill="white" />
            {r && (
              <rect
                x={r.left} y={r.top} width={r.width} height={r.height}
                rx={14} ry={14} fill="black"
              />
            )}
          </mask>
        </defs>
        <rect width="100%" height="100%" fill="rgba(0,0,0,0.62)" mask="url(#tour-mask)" />
        {r && (
          <rect
            x={r.left} y={r.top} width={r.width} height={r.height}
            rx={14} ry={14} fill="none"
            stroke="oklch(0.74 0.10 70)" strokeWidth={2}
            style={{ filter: "drop-shadow(0 0 14px oklch(0.74 0.10 70 / 0.5))" }}
          />
        )}
      </svg>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ type: "spring", stiffness: 280, damping: 26 }}
          className="paper pointer-events-auto absolute rounded-2xl p-5"
          style={cm}
        >
          <div className="flex items-start gap-3">
            <RandyAvatar size={36} ring />
            <div className="flex-1">
              <div className="flex items-center justify-between gap-2">
                <div className="text-[10px] uppercase tracking-[0.18em] gold-text/80">
                  Step {step + 1} of {steps.length}
                </div>
                <button
                  onClick={minimize}
                  title="Explore on my own"
                  aria-label="Minimize tour"
                  className="rounded-md p-1 text-muted-foreground transition hover:bg-[color:var(--surface-2)] hover:text-[color:var(--parchment)]"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M5 12h14"/></svg>
                </button>
              </div>
              <h4 className="mt-0.5 text-lg gold-text">{current.title}</h4>
              <p className="mt-2 text-sm leading-relaxed text-[color:var(--parchment)]/85">{current.body}</p>
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <button onClick={end} className="text-xs text-muted-foreground hover:text-foreground transition">Skip tour</button>
              <button onClick={minimize} className="text-xs text-muted-foreground hover:text-[color:var(--gold)] transition">Explore on my own</button>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={prev}
                disabled={step === 0}
                className="rounded-md border border-[color:var(--border)] px-3 py-1.5 text-xs disabled:opacity-40 hover:bg-[color:var(--surface-2)] transition"
              >Back</button>
              <button
                onClick={step === steps.length - 1 ? end : next}
                className="rounded-md bg-[color:var(--gold)] px-3 py-1.5 text-xs font-medium text-[color:var(--ink)] hover:brightness-110 transition"
              >
                {step === steps.length - 1 ? "Finish" : "Next"}
              </button>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
