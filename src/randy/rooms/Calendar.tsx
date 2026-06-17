import { motion } from "framer-motion";
import { CalendarSync } from "lucide-react";
import { useDesk } from "../store";
import { Explainable } from "../Explainable";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const kindStyle: Record<string, { bg: string; text: string; label: string }> = {
  shoot:    { bg: "color-mix(in oklab, var(--gold) 22%, transparent)", text: "oklch(0.86 0.08 75)", label: "Shoot" },
  meeting:  { bg: "color-mix(in oklab, oklch(0.65 0.08 220) 22%, transparent)", text: "oklch(0.85 0.06 220)", label: "Meeting" },
  edit:     { bg: "color-mix(in oklab, oklch(0.6 0.07 160) 22%, transparent)", text: "oklch(0.85 0.06 160)", label: "Edit" },
  personal: { bg: "color-mix(in oklab, oklch(0.55 0.08 320) 22%, transparent)", text: "oklch(0.85 0.06 320)", label: "Personal" },
};

export function Calendar() {
  const events = useDesk((s) => s.events);
  const show = useDesk((s) => s.showPopup);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <div className="text-[10px] uppercase tracking-[0.22em] gold-text/80">Calendar</div>
          <h1 className="mt-1 font-serif text-3xl sm:text-4xl">The week, at a glance.</h1>
        </div>
        <button
          onClick={() =>
            show({
              tag: "What would happen",
              title: "Two calendars, one source of truth.",
              body:
                "Connected to Google/iCal, I'd pull in every shoot, meeting, and edit block, deduplicate the noise, and quietly hold a line around your dinners.",
            })
          }
          className="inline-flex items-center gap-1.5 rounded-md border border-[color:var(--gold-soft)]/50 px-3 py-1.5 text-xs hover:bg-[color:var(--gold)]/10 transition"
        >
          <CalendarSync className="h-3.5 w-3.5" /> Sync calendar
        </button>
      </div>

      <Explainable id="calendar">
      <div className="paper overflow-hidden rounded-2xl">
        <div className="grid grid-cols-7 border-b border-[color:var(--border)] text-center text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
          {DAYS.map((d) => (
            <div key={d} className="py-3">{d}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 divide-x divide-[color:var(--border)]/70 min-h-[420px]">
          {DAYS.map((_, day) => {
            const dayEvents = events.filter((e) => e.day === day);
            return (
              <div key={day} className="space-y-2 p-2">
                {dayEvents.map((e, i) => {
                  const k = kindStyle[e.kind];
                  return (
                    <motion.button
                      key={e.id}
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.04 * (day + i) }}
                      whileHover={{ y: -1 }}
                      onClick={() =>
                        show({
                          tag: "What would happen",
                          title: `Brief for ${e.title}.`,
                          body: `I'd pull the location, contact, call sheet, gear list, and travel time — and text it to you the night before. ${e.client ? "Plus the last three emails with " + e.client + " for context." : ""}`,
                        })
                      }
                      className="w-full rounded-lg p-2 text-left transition"
                      style={{ background: k.bg }}
                    >
                      <div className="text-[10px] uppercase tracking-wider" style={{ color: k.text }}>
                        {e.start} · {k.label}
                      </div>
                      <div className="mt-0.5 text-xs font-medium text-[color:var(--parchment)] leading-snug">
                        {e.title}
                      </div>
                      {e.client && <div className="mt-0.5 text-[10px] text-muted-foreground">{e.client}</div>}
                    </motion.button>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
      </Explainable>
    </div>
  );
}
