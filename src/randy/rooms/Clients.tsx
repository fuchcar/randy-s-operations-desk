import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Phone, MapPin, Plus, Send } from "lucide-react";
import { useDesk } from "../store";
import type { Client } from "../data";

const contactBook: Record<string, { contact: string; email: string; phone: string; city: string; note: string }> = {
  "Aspen Ridge Realty": { contact: "Dana Pell", email: "dana@aspenridge.co", phone: "(303) 555-0119", city: "Boulder, CO", note: "Prefers twilight exteriors. Hates flash inside listings." },
  "Maple & Co Weddings": { contact: "Imani Maple", email: "imani@mapleandco.com", phone: "(415) 555-0142", city: "Sausalito, CA", note: "Two-shooter for anything over 80 guests. Send sneak peek within 48h — non-negotiable." },
  "Northgate Builders": { contact: "Theo Vance", email: "tvance@northgate.build", phone: "(206) 555-0177", city: "Seattle, WA", note: "Drone work bills at 1.5×. Site walks at 7:30am sharp or not at all." },
  "Harbor Light Inn": { contact: "Rosalind Quay", email: "rosalind@harborlightinn.com", phone: "(207) 555-0163", city: "Camden, ME", note: "Quarterly campaigns. Pays in 7 days, always." },
  "Sunset Studios": { contact: "Marco Reyes", email: "marco@sunsetstudios.tv", phone: "(323) 555-0188", city: "Los Angeles, CA", note: "Lead — wants to talk about a recurring monthly content retainer." },
};

const relColor: Record<string, string> = {
  Retainer: "oklch(0.74 0.10 70)",
  "One-off": "oklch(0.70 0.06 200)",
  Lead: "oklch(0.65 0.12 30)",
};

type RelTag = "Retainer" | "One-off" | "Lead";
function relFor(c: Client): RelTag {
  if (c.name === "Aspen Ridge Realty" || c.name === "Harbor Light Inn") return "Retainer";
  if (c.name === "Sunset Studios") return "Lead";
  return "One-off";
}

export function Clients() {
  const clients = useDesk((s) => s.clients);
  const addClient = useDesk((s) => s.addClient);
  const show = useDesk((s) => s.showPopup);
  const mode = useDesk((s) => s.mode);

  // Ensure Sunset Studios + Harbor Light Inn appear in the grid
  const list: Client[] = [
    ...clients,
    ...(clients.find((c) => c.name === "Sunset Studios")
      ? []
      : [{
          id: "c5", name: "Sunset Studios", relationship: "Brand" as const, since: "2024",
          jobs: [{ id: "j9", title: "Discovery call — monthly retainer", status: "Booked" as const, amount: 0, date: "Next week" }],
        }]),
  ];

  const [selectedId, setSelectedId] = useState<string | null>(list[0]?.id ?? null);
  const selected = list.find((c) => c.id === selectedId) ?? null;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <div className="text-[10px] uppercase tracking-[0.22em] gold-text/80">Clients</div>
          <h1 className="mt-1 font-serif text-3xl sm:text-4xl">The little black book.</h1>
        </div>
        {mode === "explore" && <QuickAddClient onAdd={(name) => addClient({ name, relationship: "Brand", since: "2025" })} />}
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        <div className="lg:col-span-3 grid gap-3 sm:grid-cols-2">
          {list.map((c, i) => {
            const r = relFor(c);
            const total = c.jobs.reduce((a, j) => a + j.amount, 0);
            return (
              <motion.button
                key={c.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                whileHover={{ y: -2 }}
                onClick={() => setSelectedId(c.id)}
                className={
                  "paper rounded-2xl p-5 text-left transition " +
                  (selectedId === c.id ? "ring-1 ring-[color:var(--gold-soft)]/70" : "")
                }
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="font-serif text-xl">{c.name}</div>
                    <div className="text-xs text-muted-foreground">Since {c.since}</div>
                  </div>
                  <span
                    className="rounded-full border px-2 py-0.5 text-[10px] uppercase tracking-wider"
                    style={{ borderColor: `color-mix(in oklab, ${relColor[r]} 50%, transparent)`, color: relColor[r] }}
                  >
                    {r}
                  </span>
                </div>
                <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
                  <span>{c.jobs.length} job{c.jobs.length === 1 ? "" : "s"}</span>
                  <span className="font-serif text-base text-[color:var(--parchment)]">${total.toLocaleString()}</span>
                </div>
              </motion.button>
            );
          })}
        </div>

        <div className="lg:col-span-2">
          <AnimatePresence mode="wait">
            {selected && (
              <motion.div
                key={selected.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="paper sticky top-32 rounded-2xl p-6"
              >
                <div className="text-[10px] uppercase tracking-[0.22em] gold-text/80">
                  {relFor(selected)} · since {selected.since}
                </div>
                <h3 className="mt-1 font-serif text-2xl">{selected.name}</h3>
                {(() => {
                  const cb = contactBook[selected.name];
                  if (!cb) return null;
                  return (
                    <div className="mt-4 space-y-1.5 text-sm">
                      <div className="text-[color:var(--parchment)]">{cb.contact}</div>
                      <div className="flex items-center gap-2 text-muted-foreground"><Mail className="h-3.5 w-3.5" />{cb.email}</div>
                      <div className="flex items-center gap-2 text-muted-foreground"><Phone className="h-3.5 w-3.5" />{cb.phone}</div>
                      <div className="flex items-center gap-2 text-muted-foreground"><MapPin className="h-3.5 w-3.5" />{cb.city}</div>
                      <p className="mt-3 rounded-lg bg-[color:var(--surface-2)] p-3 text-xs italic text-[color:var(--parchment)]/80">
                        “{cb.note}”
                      </p>
                    </div>
                  );
                })()}

                <div className="mt-5">
                  <div className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">Job history</div>
                  <ul className="mt-2 divide-y divide-[color:var(--border)]/60">
                    {selected.jobs.map((j) => (
                      <li key={j.id} className="flex items-center justify-between gap-3 py-2.5">
                        <div className="min-w-0">
                          <div className="truncate text-sm">{j.title}</div>
                          <div className="text-xs text-muted-foreground">{j.date} · {j.status}</div>
                        </div>
                        <div className="font-serif text-sm">{j.amount ? `$${j.amount.toLocaleString()}` : "—"}</div>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-5 flex flex-wrap gap-2">
                  <button
                    onClick={() =>
                      show({
                        tag: "What would happen",
                        title: "Draft is on your desk.",
                        body: `Connected to your inbox, I'd open ${selected.name}'s last three threads, mirror your tone, and leave a ready-to-send draft for ${contactBook[selected.name]?.contact ?? "the contact"} in your approvals queue.`,
                      })
                    }
                    className="inline-flex items-center gap-1.5 rounded-md bg-[color:var(--gold)] px-3 py-1.5 text-xs font-medium text-[color:var(--ink)] hover:brightness-110 transition"
                  >
                    <Send className="h-3.5 w-3.5" /> Email the client
                  </button>
                  <button
                    onClick={() =>
                      show({
                        tag: "What would happen",
                        title: "Invoice queued.",
                        body: `I'd pull the last booked job for ${selected.name}, apply their usual terms, attach the gallery delivery note, and drop it into Stripe/QBO for one-tap send.`,
                      })
                    }
                    className="rounded-md border border-[color:var(--border)] px-3 py-1.5 text-xs hover:bg-[color:var(--surface-2)] transition"
                  >
                    Send invoice
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

function QuickAddClient({ onAdd }: { onAdd: (name: string) => void }) {
  const [v, setV] = useState("");
  const show = useDesk((s) => s.showPopup);
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (!v.trim()) return;
        onAdd(v.trim());
        setV("");
        show({
          tag: "What would happen",
          title: "Added — and enriched.",
          body:
            "Wired up, I'd auto-pull their website, socials, and any past emails, summarize the relationship, and quietly suggest the next move (intro call, sample reel, gentle follow-up).",
        });
      }}
      className="flex gap-2"
    >
      <input value={v} onChange={(e) => setV(e.target.value)} placeholder="Add a client…"
        className="rounded-md border border-[color:var(--border)] bg-[color:var(--surface)] px-3 py-2 text-sm outline-none focus:border-[color:var(--gold-soft)]" />
      <button className="inline-flex items-center gap-1.5 rounded-md bg-[color:var(--gold)] px-3 py-2 text-sm font-medium text-[color:var(--ink)] hover:brightness-110 transition">
        <Plus className="h-3.5 w-3.5" /> Add
      </button>
    </form>
  );
}
