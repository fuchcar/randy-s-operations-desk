import { motion } from "framer-motion";
import { CheckCircle2, Circle, Flame, Camera, Clock, ArrowRight } from "lucide-react";
import { useDesk } from "../store";
import { shootPrepGear } from "../data";
import { Explainable } from "../Explainable";
import { useMemo, useState } from "react";

export function Today() {
  const tasks = useDesk((s) => s.tasks);
  const toggleTask = useDesk((s) => s.toggleTask);
  const showPopup = useDesk((s) => s.showPopup);
  const mode = useDesk((s) => s.mode);

  const open = tasks.filter((t) => !t.done);
  const next = open[0];
  const hard = open.filter((t) => t.hard).slice(0, 4);

  // Board heat
  const heat = useMemo(() => {
    const w = { light: 1, medium: 2, heavy: 3 };
    const score = open.reduce((acc, t) => acc + w[t.weight], 0);
    const pct = Math.min(100, Math.round((score / 14) * 100));
    let label = "Breathing room";
    let color = "oklch(0.68 0.13 150)";
    if (pct > 75) { label = "Pushing it"; color = "oklch(0.62 0.18 25)"; }
    else if (pct > 45) { label = "Focused"; color = "oklch(0.74 0.10 70)"; }
    return { pct, label, color };
  }, [open]);

  const [packed, setPacked] = useState<Record<string, boolean>>({});

  return (
    <div className="space-y-6">
      <Greeting />

      <div className="grid gap-5 md:grid-cols-3">
        {/* Do this next */}
        <Explainable id="do-this-next" className="md:col-span-2">
        <motion.div
          data-tour="do-next"
          whileHover={{ y: -2 }}
          className="paper rounded-2xl p-6 md:col-span-2"
        >
          <div className="flex items-center justify-between">
            <div className="text-[10px] uppercase tracking-[0.22em] gold-text/80">Do this next</div>
            <span className="text-xs text-muted-foreground">picked by Randy</span>
          </div>
          {next ? (
            <>
              <h2 className="mt-3 text-3xl leading-tight">{next.title}</h2>
              {next.client && (
                <div className="mt-2 text-sm text-muted-foreground">{next.client} · {next.due}</div>
              )}
              <p className="mt-4 max-w-xl text-sm leading-relaxed text-[color:var(--parchment)]/75">
                "It's the one with a real deadline and other things waiting behind it. Knock it down,
                everything downstream gets easier."
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                <Explainable id="hand-to-randy">
                <button
                  onClick={() =>
                    showPopup({
                      tag: "What would happen",
                      title: "Consider it handed off.",
                      body:
                        "Wired up for real, I'd pull the raw frames from your card, run the first cull against your style profile, and drop a shortlist in your editor — you'd open Lightroom to a tidy stack instead of a haystack.",
                    })
                  }
                  className="rounded-md bg-[color:var(--gold)] px-4 py-2 text-sm font-medium text-[color:var(--ink)] transition hover:brightness-110"
                >
                  Hand to Randy
                </button>
                </Explainable>
                <button
                  onClick={() => toggleTask(next.id)}
                  className="rounded-md border border-[color:var(--border)] px-4 py-2 text-sm transition hover:bg-[color:var(--surface-2)]"
                >
                  Mark done
                </button>
              </div>
            </>
          ) : (
            <p className="mt-4 text-sm text-muted-foreground">Inbox zero. Go take a walk.</p>
          )}
        </motion.div>
        </Explainable>

        {/* Board heat */}
        <Explainable id="board-heat">
        <motion.div
          data-tour="board-heat"
          whileHover={{ y: -2 }}
          className="paper rounded-2xl p-6"
        >
          <div className="text-[10px] uppercase tracking-[0.22em] gold-text/80">Board heat</div>
          <div className="mt-2 flex items-end justify-between">
            <div className="font-serif text-4xl">{heat.pct}<span className="text-xl text-muted-foreground">%</span></div>
            <Flame className="h-5 w-5" style={{ color: heat.color }} />
          </div>
          <div className="mt-4 h-2 rounded-full bg-[color:var(--surface-2)] overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${heat.pct}%` }}
              transition={{ type: "spring", stiffness: 80, damping: 18 }}
              className="h-full rounded-full"
              style={{ background: heat.color }}
            />
          </div>
          <div className="mt-2 text-sm" style={{ color: heat.color }}>{heat.label}</div>
          <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
            Based on open work, weighted by effort. Above 75% Randy starts politely declining new jobs.
          </p>
        </motion.div>
        </Explainable>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        {/* Hard deadlines */}
        <Explainable id="hard-deadlines">
        <motion.div whileHover={{ y: -2 }} className="paper rounded-2xl p-6">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <div className="text-[10px] uppercase tracking-[0.22em] gold-text/80">Hard deadlines</div>
              <h3 className="mt-1 text-xl">Things that won't move</h3>
            </div>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </div>
          <ul className="space-y-2">
            {hard.map((t, i) => (
              <motion.li
                key={t.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.06 }}
                className="group flex items-start gap-3 rounded-lg p-2 transition hover:bg-[color:var(--surface-2)]"
              >
                <button onClick={() => toggleTask(t.id)} className="mt-0.5">
                  {t.done ? <CheckCircle2 className="h-4 w-4 text-[color:var(--gold)]" /> : <Circle className="h-4 w-4 text-muted-foreground group-hover:text-[color:var(--gold)] transition" />}
                </button>
                <div className="flex-1">
                  <div className={"text-sm " + (t.done ? "line-through text-muted-foreground" : "")}>{t.title}</div>
                  <div className="text-xs text-muted-foreground">{t.client} · {t.due}</div>
                </div>
              </motion.li>
            ))}
          </ul>
        </motion.div>
        </Explainable>

        {/* Coming up — shoot prep */}
        <Explainable id="coming-up">
        <motion.div data-tour="shoot-prep" whileHover={{ y: -2 }} className="paper rounded-2xl p-6">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <div className="text-[10px] uppercase tracking-[0.22em] gold-text/80">Coming up</div>
              <h3 className="mt-1 text-xl">Harlow + Jensen wedding</h3>
              <div className="text-sm text-muted-foreground">Maple & Co · Sat · 1:00 PM</div>
            </div>
            <Camera className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">Gear checklist</div>
          <ul className="mt-2 space-y-1.5">
            {shootPrepGear.map((g, i) => {
              const on = !!packed[g];
              return (
                <li key={g}>
                  <button
                    onClick={() => setPacked((p) => ({ ...p, [g]: !p[g] }))}
                    className="flex w-full items-center gap-3 rounded-lg p-1.5 text-left transition hover:bg-[color:var(--surface-2)]"
                  >
                    {on ? <CheckCircle2 className="h-4 w-4 text-[color:var(--gold)]" /> : <Circle className="h-4 w-4 text-muted-foreground" />}
                    <span className={"text-sm " + (on ? "text-muted-foreground line-through" : "")}>{g}</span>
                  </button>
                </li>
              );
            })}
          </ul>
          <button
            onClick={() =>
              showPopup({
                tag: "What would happen",
                title: "Kit list, sent.",
                body:
                  "Hooked into your calendar and notes, I'd text this checklist to your phone Friday at 8pm, and again Saturday at 5:30am — with weather, drive time, and a gentle reminder that the V1 batteries are still on the charger.",
              })
            }
            className="mt-4 inline-flex items-center gap-1.5 text-xs gold-text hover:underline"
          >
            Send me the prep brief <ArrowRight className="h-3 w-3" />
          </button>
        </motion.div>
        </Explainable>
      </div>

      {mode === "explore" && <QuickAddTask />}
    </div>
  );
}

function Greeting() {
  const hour = new Date().getHours();
  const part = hour < 12 ? "Morning" : hour < 18 ? "Afternoon" : "Evening";
  return (
    <div className="flex items-start gap-4">
      <div className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[color:var(--surface-2)] text-2xl ring-1 ring-[color:var(--gold-soft)]/40 sm:flex">🦝</div>
      <div>
        <div className="text-[10px] uppercase tracking-[0.22em] gold-text/80">{part}, friend</div>
        <h1 className="mt-1 font-serif text-3xl sm:text-4xl">Here's where we are.</h1>
        <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
          Five open jobs, three real deadlines, one wedding looming. Nothing on fire — yet.
        </p>
      </div>
    </div>
  );
}

function QuickAddTask() {
  const addTask = useDesk((s) => s.addTask);
  const showPopup = useDesk((s) => s.showPopup);
  const [v, setV] = useState("");
  return (
    <motion.div whileHover={{ y: -2 }} className="paper rounded-2xl p-5">
      <div className="text-[10px] uppercase tracking-[0.22em] gold-text/80">Explore · add a task</div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!v.trim()) return;
          addTask({ title: v.trim(), weight: "medium", due: "Soon" });
          setV("");
          showPopup({
            tag: "What would happen",
            title: "Logged. And then some.",
            body:
              "Plugged into your tools, I'd guess the client from the wording, file it under the right job, set a realistic deadline, and quietly nudge you when it's the next-best thing to do.",
          });
        }}
        className="mt-3 flex gap-2"
      >
        <input
          value={v}
          onChange={(e) => setV(e.target.value)}
          placeholder="e.g. Pull selects from Friday's shoot"
          className="flex-1 rounded-md border border-[color:var(--border)] bg-[color:var(--surface-2)] px-3 py-2 text-sm outline-none focus:border-[color:var(--gold-soft)]"
        />
        <button className="rounded-md bg-[color:var(--gold)] px-4 py-2 text-sm font-medium text-[color:var(--ink)] transition hover:brightness-110">
          Add
        </button>
      </form>
    </motion.div>
  );
}
