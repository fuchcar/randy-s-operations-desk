import { useState } from "react";
import { motion } from "framer-motion";
import { useDesk } from "../store";
import { Explainable } from "../Explainable";

export function Ask() {
  const [q, setQ] = useState("");
  const show = useDesk((s) => s.showPopup);
  return (
    <div className="mx-auto max-w-2xl">
      <div className="text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[color:var(--surface-2)] text-2xl ring-1 ring-[color:var(--gold-soft)]/40">🦝</div>
        <h2 className="mt-4 font-serif text-3xl">Ask Randy.</h2>
        <p className="mt-2 text-sm text-muted-foreground">Anything. Drafting an email, chasing an invoice, "what did we earn in October" — try me.</p>
      </div>
      <Explainable id="ask-randy">
      <motion.form
        onSubmit={(e) => {
          e.preventDefault();
          if (!q.trim()) return;
          show({
            tag: "What would happen",
            title: "On it.",
            body: `Wired up for real, I'd take "${q.trim()}" and either answer from your data, draft the message, or quietly schedule the task — then ping you only if I need a decision.`,
          });
          setQ("");
        }}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="paper mt-6 rounded-2xl p-2"
      >
        <textarea
          value={q}
          onChange={(e) => setQ(e.target.value)}
          rows={4}
          placeholder="Draft a warm follow-up to Aspen Ridge about the Cedar Crest shoot…"
          className="w-full resize-none rounded-xl bg-transparent p-4 text-sm outline-none placeholder:text-muted-foreground"
        />
        <div className="flex items-center justify-between p-2">
          <div className="text-xs text-muted-foreground italic">Randy listens, then acts.</div>
          <button className="rounded-md bg-[color:var(--gold)] px-4 py-2 text-sm font-medium text-[color:var(--ink)] transition hover:brightness-110">
            Ask Randy
          </button>
        </div>
      </motion.form>
      </Explainable>
      <div className="mt-6 flex flex-wrap justify-center gap-2 text-xs">
        {["What's our heaviest week this month?", "Draft an invoice for Harbor Light Inn", "Who haven't I followed up with in 30 days?"].map((s) => (
          <button
            key={s}
            onClick={() => setQ(s)}
            className="rounded-full border border-[color:var(--border)] px-3 py-1.5 text-muted-foreground transition hover:border-[color:var(--gold-soft)] hover:text-[color:var(--parchment)]"
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}
