import { motion } from "framer-motion";
import { useDesk } from "../store";
import { Explainable } from "../Explainable";

export function Deliverables() {
  const items = useDesk((s) => s.deliverables);
  const setProgress = useDesk((s) => s.setProgress);
  const show = useDesk((s) => s.showPopup);

  return (
    <div className="space-y-6">
      <div>
        <div className="text-[10px] uppercase tracking-[0.22em] gold-text/80">Deliverables</div>
        <h1 className="mt-1 font-serif text-3xl sm:text-4xl">Everything in flight.</h1>
        <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
          Drag a slider to update progress — honest numbers, no "almost done" theater.
        </p>
      </div>

      <div className="grid gap-4">
        {items.map((d, i) => {
          const done = d.progress >= 100;
          return (
            <Explainable id="deliverables" key={d.id}>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ y: -2 }}
              className="paper rounded-2xl p-6"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="text-xs text-muted-foreground">{d.client}</div>
                  <div className="font-serif text-xl">{d.title}</div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={"text-xs " + (done ? "gold-text" : "text-muted-foreground")}>
                    {done ? "Delivered" : `Due ${d.due}`}
                  </span>
                  <span className="font-serif text-2xl tabular-nums">
                    {d.progress}<span className="text-sm text-muted-foreground">%</span>
                  </span>
                </div>
              </div>

              <div className="mt-4">
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={d.progress}
                  onChange={(e) => setProgress(d.id, parseInt(e.target.value))}
                  className="randy-slider w-full"
                  style={{
                    background: `linear-gradient(to right, var(--gold) 0%, var(--gold) ${d.progress}%, var(--surface-2) ${d.progress}%, var(--surface-2) 100%)`,
                  }}
                />
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  onClick={() =>
                    show({
                      tag: "What would happen",
                      title: "Status nudge sent.",
                      body: `Wired up, I'd ping ${d.client} with a short, on-brand status note ("we're at ${d.progress}% — first gallery Tuesday"), attach a preview, and ask only the questions that actually need answering.`,
                    })
                  }
                  className="inline-flex items-center gap-1.5 rounded-md bg-[color:var(--gold)] px-3 py-1.5 text-xs font-medium text-[color:var(--ink)] hover:brightness-110 transition"
                >
                  Send status note
                </button>
                <Explainable id="hand-to-randy">
                <button
                  onClick={() =>
                    show({
                      tag: "What would happen",
                      title: "Handed off.",
                      body: `I'd pick up the next subtask on ${d.title} — culling, sequencing, draft captions, or export presets — and leave it ready for your final pass.`,
                    })
                  }
                  className="rounded-md border border-[color:var(--border)] px-3 py-1.5 text-xs hover:bg-[color:var(--surface-2)] transition"
                >
                  Hand to Randy
                </button>
                </Explainable>
              </div>
            </motion.div>
            </Explainable>
          );
        })}
      </div>

      <style>{`
        .randy-slider { -webkit-appearance: none; appearance: none; height: 6px; border-radius: 999px; outline: none; }
        .randy-slider::-webkit-slider-thumb {
          -webkit-appearance: none; appearance: none;
          width: 18px; height: 18px; border-radius: 9999px;
          background: var(--gold);
          border: 2px solid var(--ink);
          box-shadow: 0 0 0 1px var(--gold-soft), 0 4px 12px rgb(0 0 0 / 0.4);
          cursor: grab;
        }
        .randy-slider::-moz-range-thumb {
          width: 18px; height: 18px; border-radius: 9999px;
          background: var(--gold); border: 2px solid var(--ink);
          box-shadow: 0 0 0 1px var(--gold-soft), 0 4px 12px rgb(0 0 0 / 0.4);
          cursor: grab;
        }
      `}</style>
    </div>
  );
}
