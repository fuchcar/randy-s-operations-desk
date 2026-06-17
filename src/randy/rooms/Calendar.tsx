import { motion, AnimatePresence } from "framer-motion";
import { CalendarSync, ChevronLeft, ChevronRight, X } from "lucide-react";
import { useMemo, useState, useEffect } from "react";
import { useDesk } from "../store";
import { Explainable } from "../Explainable";
import type { CalEvent, Owner } from "../data";

type ViewMode = "day" | "week" | "month" | "list";

const KIND: Record<CalEvent["kind"], { bg: string; text: string; dot: string; label: string }> = {
  shoot:    { bg: "color-mix(in oklab, var(--gold) 22%, transparent)",                  text: "oklch(0.88 0.08 75)",  dot: "var(--gold)",              label: "Shoot" },
  meeting:  { bg: "color-mix(in oklab, oklch(0.65 0.08 220) 22%, transparent)",         text: "oklch(0.85 0.06 220)", dot: "oklch(0.65 0.08 220)",     label: "Meeting" },
  edit:     { bg: "color-mix(in oklab, oklch(0.6 0.07 160) 22%, transparent)",          text: "oklch(0.85 0.06 160)", dot: "oklch(0.60 0.07 160)",     label: "Edit" },
  personal: { bg: "color-mix(in oklab, oklch(0.55 0.08 320) 22%, transparent)",         text: "oklch(0.85 0.06 320)", dot: "oklch(0.55 0.08 320)",     label: "Personal" },
};

const OWNERS: Owner[] = ["You", "Partner", "Team"];
const OWNER_COLOR: Record<Owner, string> = {
  You:     "oklch(0.74 0.10 70)",
  Partner: "oklch(0.65 0.08 220)",
  Team:    "oklch(0.60 0.07 160)",
};

const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const DOW_FULL = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
const DOW_MON = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];

function startOfDay(d: Date) { const x = new Date(d); x.setHours(0,0,0,0); return x; }
function addDays(d: Date, n: number) { const x = new Date(d); x.setDate(x.getDate() + n); return x; }
function sameDay(a: Date, b: Date) { return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate(); }
function startOfWeekMon(d: Date) {
  const x = startOfDay(d);
  const day = x.getDay(); // 0=Sun..6=Sat
  const diff = (day + 6) % 7; // back to Monday
  return addDays(x, -diff);
}
function startOfMonth(d: Date) { return new Date(d.getFullYear(), d.getMonth(), 1); }
function eventDate(today: Date, e: CalEvent) { return addDays(today, e.dateOffset); }

export function Calendar() {
  const events = useDesk((s) => s.events);
  const show = useDesk((s) => s.showPopup);

  const today = useMemo(() => startOfDay(new Date()), []);
  const [anchor, setAnchor] = useState<Date>(today);
  const [view, setView] = useState<ViewMode>("week");
  const [density, setDensity] = useState<"comfortable" | "compact">("comfortable");
  const [ownerFilter, setOwnerFilter] = useState<Set<Owner>>(new Set(OWNERS));
  const [openDay, setOpenDay] = useState<Date | null>(null);

  // Filtered events with date attached
  const dated = useMemo(
    () => events.map((e) => ({ ...e, date: eventDate(today, e) })).filter((e) => ownerFilter.has(e.owner)),
    [events, today, ownerFilter]
  );

  // Navigation
  const goPrev = () => setAnchor((a) => view === "month" ? new Date(a.getFullYear(), a.getMonth() - 1, 1) : addDays(a, view === "day" ? -1 : -7));
  const goNext = () => setAnchor((a) => view === "month" ? new Date(a.getFullYear(), a.getMonth() + 1, 1) : addDays(a, view === "day" ? 1 : 7));
  const goToday = () => setAnchor(today);

  const headerLabel = useMemo(() => {
    if (view === "day") return `${DOW_FULL[anchor.getDay()]}, ${MONTHS[anchor.getMonth()]} ${anchor.getDate()}`;
    if (view === "week") {
      const s = startOfWeekMon(anchor), e = addDays(s, 6);
      const sameMonth = s.getMonth() === e.getMonth();
      return sameMonth
        ? `${MONTHS[s.getMonth()]} ${s.getDate()}–${e.getDate()}`
        : `${MONTHS[s.getMonth()]} ${s.getDate()} – ${MONTHS[e.getMonth()]} ${e.getDate()}`;
    }
    if (view === "month") return `${MONTHS[anchor.getMonth()]} ${anchor.getFullYear()}`;
    return "Upcoming";
  }, [view, anchor]);

  return (
    <div className="space-y-5">
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
              body: "Connected to Google/iCal, I'd pull in every shoot, meeting, and edit block, deduplicate the noise, and quietly hold a line around your dinners.",
            })
          }
          className="inline-flex items-center gap-1.5 rounded-md border border-[color:var(--gold-soft)]/50 px-3 py-1.5 text-xs hover:bg-[color:var(--gold)]/10 transition"
        >
          <CalendarSync className="h-3.5 w-3.5" /> Sync calendar
        </button>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="inline-flex rounded-md border border-[color:var(--border)] overflow-hidden">
            <button onClick={goPrev} className="px-2 py-1.5 hover:bg-[color:var(--surface-2)] transition" aria-label="Previous"><ChevronLeft className="h-4 w-4" /></button>
            <button onClick={goToday} className="px-3 py-1.5 text-xs uppercase tracking-wider border-x border-[color:var(--border)] hover:bg-[color:var(--surface-2)] transition">Today</button>
            <button onClick={goNext} className="px-2 py-1.5 hover:bg-[color:var(--surface-2)] transition" aria-label="Next"><ChevronRight className="h-4 w-4" /></button>
          </div>
          <div className="font-serif text-lg">{headerLabel}</div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Explainable id="calendar-views">
            <div className="inline-flex rounded-md border border-[color:var(--border)] overflow-hidden text-xs">
              {(["day","week","month","list"] as ViewMode[]).map((v) => (
                <button key={v} onClick={() => setView(v)}
                  className={"px-3 py-1.5 capitalize transition " + (view === v ? "bg-[color:var(--gold)] text-[color:var(--ink)]" : "hover:bg-[color:var(--surface-2)]")}>
                  {v}
                </button>
              ))}
            </div>
          </Explainable>
          {view === "week" && (
            <Explainable id="calendar-density">
              <div className="inline-flex rounded-md border border-[color:var(--border)] overflow-hidden text-xs">
                {(["comfortable","compact"] as const).map((d) => (
                  <button key={d} onClick={() => setDensity(d)}
                    className={"px-3 py-1.5 capitalize transition " + (density === d ? "bg-[color:var(--surface-2)] gold-text" : "hover:bg-[color:var(--surface-2)]/60")}>
                    {d}
                  </button>
                ))}
              </div>
            </Explainable>
          )}
        </div>
      </div>

      {/* Owner chips */}
      <Explainable id="calendar-owners">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground mr-1">Owner</span>
          {OWNERS.map((o) => {
            const on = ownerFilter.has(o);
            return (
              <button
                key={o}
                onClick={() => setOwnerFilter((s) => {
                  const next = new Set(s);
                  if (next.has(o)) next.delete(o); else next.add(o);
                  if (next.size === 0) next.add(o); // never empty
                  return next;
                })}
                className={"inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs transition " + (on ? "border-[color:var(--gold-soft)]/60 bg-[color:var(--gold)]/10" : "border-[color:var(--border)] text-muted-foreground hover:bg-[color:var(--surface-2)]")}
              >
                <span className="h-1.5 w-1.5 rounded-full" style={{ background: OWNER_COLOR[o] }} />
                {o}
              </button>
            );
          })}
        </div>
      </Explainable>

      <Explainable id="calendar">
        <div className="paper overflow-hidden rounded-2xl">
          {view === "week"  && <WeekView anchor={anchor} today={today} events={dated} density={density} onEventClick={(e) => openBrief(show, e)} />}
          {view === "day"   && <DayView anchor={anchor} today={today} events={dated} onEventClick={(e) => openBrief(show, e)} />}
          {view === "month" && <MonthView anchor={anchor} today={today} events={dated} onPickDay={setOpenDay} />}
          {view === "list"  && <ListView today={today} events={dated} onEventClick={(e) => openBrief(show, e)} />}
        </div>
      </Explainable>

      <AnimatePresence>
        {openDay && (
          <DayPopover
            date={openDay}
            events={dated.filter((e) => sameDay(e.date, openDay))}
            today={today}
            onClose={() => setOpenDay(null)}
            onEventClick={(e) => { setOpenDay(null); openBrief(show, e); }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function openBrief(show: (p: { tag?: string; title: string; body: string }) => void, e: CalEvent) {
  show({
    tag: "What would happen",
    title: `Brief for ${e.title}.`,
    body: `I'd pull the location, contact, call sheet, gear list, and travel time — and text it to you the night before.${e.client ? " Plus the last three emails with " + e.client + " for context." : ""}`,
  });
}

/* ---------- Views ---------- */

function WeekView({
  anchor, today, events, density, onEventClick,
}: { anchor: Date; today: Date; events: (CalEvent & { date: Date })[]; density: "comfortable" | "compact"; onEventClick: (e: CalEvent) => void }) {
  const start = startOfWeekMon(anchor);
  const days = Array.from({ length: 7 }, (_, i) => addDays(start, i));
  const compact = density === "compact";
  return (
    <>
      <div className="grid grid-cols-7 border-b border-[color:var(--border)] text-center text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
        {days.map((d, i) => {
          const isToday = sameDay(d, today);
          return (
            <div key={i} className={"py-3 " + (isToday ? "gold-text" : "")}>
              <div>{DOW_MON[i]}</div>
              <div className={"mt-0.5 font-serif text-base " + (isToday ? "" : "text-[color:var(--parchment)]")}>{d.getDate()}</div>
            </div>
          );
        })}
      </div>
      <div className={"grid grid-cols-7 divide-x divide-[color:var(--border)]/70 " + (compact ? "min-h-[280px]" : "min-h-[440px]")}>
        {days.map((d, i) => {
          const dayEvents = events.filter((e) => sameDay(e.date, d));
          return (
            <div key={i} className={"space-y-1.5 " + (compact ? "p-1.5" : "p-2")}>
              {dayEvents.map((e, idx) => <EventChip key={e.id} e={e} idx={idx} compact={compact} onClick={() => onEventClick(e)} />)}
            </div>
          );
        })}
      </div>
    </>
  );
}

function DayView({
  anchor, today, events, onEventClick,
}: { anchor: Date; today: Date; events: (CalEvent & { date: Date })[]; onEventClick: (e: CalEvent) => void }) {
  const dayEvents = events.filter((e) => sameDay(e.date, anchor)).sort((a, b) => (a.startHour ?? 0) - (b.startHour ?? 0));
  const hours = Array.from({ length: 13 }, (_, i) => i + 7); // 7..19
  const isToday = sameDay(anchor, today);
  return (
    <div className="p-4">
      <div className="mb-3 text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
        {DOW_FULL[anchor.getDay()]} · {MONTHS[anchor.getMonth()]} {anchor.getDate()} {isToday && <span className="gold-text">· today</span>}
      </div>
      <div className="grid grid-cols-[60px_1fr] gap-2">
        <div className="space-y-2 text-right text-[10px] uppercase tracking-wider text-muted-foreground">
          {hours.map((h) => (
            <div key={h} className="h-10 leading-10">{((h + 11) % 12) + 1}{h < 12 ? "a" : "p"}</div>
          ))}
        </div>
        <div className="relative space-y-2">
          {hours.map((h) => (
            <div key={h} className="h-10 rounded-md border border-dashed border-[color:var(--border)]/50">
              {dayEvents.filter((e) => (e.startHour ?? 0) === h).map((e, i) => (
                <button key={e.id} onClick={() => onEventClick(e)} className="m-1 inline-flex items-center gap-2 rounded-md px-2 py-1 text-left text-xs transition hover:brightness-110"
                  style={{ background: KIND[e.kind].bg }}>
                  <span style={{ color: KIND[e.kind].text }} className="text-[10px] uppercase tracking-wider">{e.start}</span>
                  <span className="text-[color:var(--parchment)]">{e.title}</span>
                  <OwnerTag owner={e.owner} />
                  {i > 0 && null}
                </button>
              ))}
            </div>
          ))}
          {dayEvents.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center text-sm text-muted-foreground">Empty. Take the morning back.</div>
          )}
        </div>
      </div>
    </div>
  );
}

function MonthView({
  anchor, today, events, onPickDay,
}: { anchor: Date; today: Date; events: (CalEvent & { date: Date })[]; onPickDay: (d: Date) => void }) {
  const first = startOfMonth(anchor);
  const gridStart = startOfWeekMon(first);
  const cells = Array.from({ length: 42 }, (_, i) => addDays(gridStart, i));
  return (
    <>
      <div className="grid grid-cols-7 border-b border-[color:var(--border)] text-center text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
        {DOW_MON.map((d) => <div key={d} className="py-2">{d}</div>)}
      </div>
      <div className="grid grid-cols-7 grid-rows-6 divide-x divide-y divide-[color:var(--border)]/70 min-h-[480px]">
        {cells.map((d, i) => {
          const inMonth = d.getMonth() === anchor.getMonth();
          const isToday = sameDay(d, today);
          const evs = events.filter((e) => sameDay(e.date, d));
          return (
            <button
              key={i}
              onClick={() => onPickDay(d)}
              className={"relative flex flex-col items-start gap-1 p-1.5 text-left transition hover:bg-[color:var(--surface-2)]/50 " + (inMonth ? "" : "opacity-40")}
            >
              <span className={"text-xs font-serif " + (isToday ? "gold-text font-medium" : "")}>{d.getDate()}</span>
              <div className="flex w-full flex-col gap-0.5">
                {evs.slice(0, 3).map((e) => (
                  <span key={e.id} className="truncate rounded px-1 py-0.5 text-[10px]" style={{ background: KIND[e.kind].bg, color: KIND[e.kind].text }}>
                    {e.title}
                  </span>
                ))}
                {evs.length > 3 && <span className="text-[10px] text-muted-foreground">+{evs.length - 3} more</span>}
              </div>
            </button>
          );
        })}
      </div>
    </>
  );
}

function ListView({ today, events, onEventClick }: { today: Date; events: (CalEvent & { date: Date })[]; onEventClick: (e: CalEvent) => void }) {
  const upcoming = events
    .filter((e) => e.date.getTime() >= today.getTime())
    .sort((a, b) => a.date.getTime() - b.date.getTime() || (a.startHour ?? 0) - (b.startHour ?? 0));
  return (
    <ul className="divide-y divide-[color:var(--border)]/60">
      {upcoming.map((e) => (
        <li key={e.id}>
          <button onClick={() => onEventClick(e)} className="flex w-full items-center gap-4 px-5 py-3 text-left transition hover:bg-[color:var(--surface-2)]/50">
            <div className="w-20 shrink-0">
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{DOW_MON[(e.date.getDay()+6)%7]}</div>
              <div className="font-serif text-xl">{e.date.getDate()}</div>
            </div>
            <span className="h-2 w-2 rounded-full" style={{ background: KIND[e.kind].dot }} />
            <div className="min-w-0 flex-1">
              <div className="text-sm text-[color:var(--parchment)] truncate">{e.title}</div>
              <div className="text-xs text-muted-foreground">{e.start} – {e.end}{e.client ? " · " + e.client : ""}</div>
            </div>
            <OwnerTag owner={e.owner} />
          </button>
        </li>
      ))}
      {upcoming.length === 0 && <li className="px-5 py-8 text-center text-sm text-muted-foreground">Nothing on the books.</li>}
    </ul>
  );
}

/* ---------- Bits ---------- */

function EventChip({ e, idx, compact, onClick }: { e: CalEvent; idx: number; compact: boolean; onClick: () => void }) {
  const k = KIND[e.kind];
  return (
    <motion.button
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.03 * idx }}
      whileHover={{ y: -1 }}
      onClick={onClick}
      className={"w-full rounded-lg text-left transition " + (compact ? "p-1.5" : "p-2")}
      style={{ background: k.bg }}
    >
      <div className="flex items-center justify-between gap-1.5">
        <div className="text-[10px] uppercase tracking-wider truncate" style={{ color: k.text }}>{e.start} · {k.label}</div>
        <OwnerDot owner={e.owner} />
      </div>
      <div className={"mt-0.5 font-medium text-[color:var(--parchment)] leading-snug " + (compact ? "text-[11px]" : "text-xs")}>
        {e.title}
      </div>
      {!compact && e.client && <div className="mt-0.5 text-[10px] text-muted-foreground truncate">{e.client}</div>}
    </motion.button>
  );
}

function OwnerTag({ owner }: { owner: Owner }) {
  const c = OWNER_COLOR[owner];
  return (
    <span className="inline-flex items-center gap-1 rounded-full border px-1.5 py-0.5 text-[9px] uppercase tracking-wider"
      style={{ color: c, borderColor: `color-mix(in oklab, ${c} 40%, transparent)` }}>
      <span className="h-1 w-1 rounded-full" style={{ background: c }} />
      {owner}
    </span>
  );
}
function OwnerDot({ owner }: { owner: Owner }) {
  return <span className="h-1.5 w-1.5 rounded-full shrink-0" style={{ background: OWNER_COLOR[owner] }} title={owner} />;
}

function DayPopover({
  date, events, today, onClose, onEventClick,
}: { date: Date; events: (CalEvent & { date: Date })[]; today: Date; onClose: () => void; onEventClick: (e: CalEvent) => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);
  const isToday = sameDay(date, today);
  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[80] flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.94 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.94 }}
        transition={{ type: "spring", stiffness: 240, damping: 22 }}
        onClick={(e) => e.stopPropagation()}
        className="paper relative w-full max-w-md rounded-2xl p-6"
      >
        <button onClick={onClose} className="absolute right-3 top-3 text-muted-foreground hover:text-[color:var(--parchment)] transition" aria-label="Close"><X className="h-4 w-4" /></button>
        <div className="text-[10px] uppercase tracking-[0.22em] gold-text/80">
          {DOW_FULL[date.getDay()]} {isToday && <span>· today</span>}
        </div>
        <h3 className="mt-1 font-serif text-2xl">{MONTHS[date.getMonth()]} {date.getDate()}</h3>
        <div className="mt-4 space-y-2">
          {events.length === 0 && <div className="text-sm text-muted-foreground">Wide open.</div>}
          {events.sort((a, b) => (a.startHour ?? 0) - (b.startHour ?? 0)).map((e) => (
            <button key={e.id} onClick={() => onEventClick(e)} className="flex w-full items-center gap-3 rounded-lg p-2 text-left transition hover:brightness-110" style={{ background: KIND[e.kind].bg }}>
              <span className="text-[10px] uppercase tracking-wider w-16 shrink-0" style={{ color: KIND[e.kind].text }}>{e.start}</span>
              <div className="min-w-0 flex-1">
                <div className="text-sm text-[color:var(--parchment)] truncate">{e.title}</div>
                {e.client && <div className="text-[10px] text-muted-foreground truncate">{e.client}</div>}
              </div>
              <OwnerTag owner={e.owner} />
            </button>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
