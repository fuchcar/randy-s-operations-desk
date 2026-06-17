import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, ArrowDownRight, Scan, ChevronDown, Pencil, Plus, ShieldCheck } from "lucide-react";
import { useMemo, useState } from "react";
import { useDesk } from "../store";
import { Explainable } from "../Explainable";
import { seedRecurring, seedBuckets, seedIncoming, debtGearLoan, type RecurringItem } from "../data";

const AVAILABLE = 28475.12;
const MONTH_IN = 14820;

// Semantic palette by tier
const TIER_COLOR: Record<RecurringItem["tier"], { base: string; soft: string; chip: string }> = {
  Need:     { base: "oklch(0.62 0.13 150)", soft: "oklch(0.72 0.10 155)", chip: "oklch(0.85 0.05 150)" },
  Protect:  { base: "oklch(0.60 0.11 230)", soft: "oklch(0.72 0.08 235)", chip: "oklch(0.85 0.05 230)" },
  Business: { base: "oklch(0.74 0.10 70)",  soft: "oklch(0.80 0.09 80)",  chip: "oklch(0.88 0.06 75)" },
  Giving:   { base: "oklch(0.58 0.11 330)", soft: "oklch(0.70 0.08 330)", chip: "oklch(0.85 0.05 330)" },
};

// Each recurring row gets a color (alternates base/soft within a tier for legibility).
function colorFor(r: RecurringItem, idxInTier: number) {
  const t = TIER_COLOR[r.tier];
  return idxInTier % 2 === 0 ? t.base : t.soft;
}

export function Money() {
  const bills = useDesk((s) => s.bills);
  const togglePaid = useDesk((s) => s.togglePaid);
  const show = useDesk((s) => s.showPopup);
  const mode = useDesk((s) => s.mode);

  const owedBills = bills.filter((b) => !b.paid).reduce((a, b) => a + b.amount, 0);
  const paidBills = bills.filter((b) => b.paid).reduce((a, b) => a + b.amount, 0);

  // Coming (certain) = unpaid bills + remaining recurring this month (estimate)
  const recurringTotal = seedRecurring.reduce((a, r) => a + r.amount, 0);
  const recurringRemaining = Math.round(recurringTotal * 0.55); // half-month estimate
  const COMING = owedBills + recurringRemaining;
  const SPENDABLE = AVAILABLE - COMING;

  // Donut data, grouped with colors
  const donut = useMemo(() => {
    const tierIdx: Record<string, number> = {};
    return seedRecurring.map((r) => {
      tierIdx[r.tier] = (tierIdx[r.tier] ?? -1) + 1;
      return { ...r, color: colorFor(r, tierIdx[r.tier]) };
    });
  }, []);
  const outTotal = donut.reduce((a, d) => a + d.amount, 0);

  const monthProgressPct = Math.round((paidBills / Math.max(1, paidBills + owedBills)) * 100);
  const cushion = MONTH_IN - outTotal;

  return (
    <div className="space-y-6">
      <div>
        <div className="text-[10px] uppercase tracking-[0.22em] gold-text/80">Money</div>
        <h1 className="mt-1 font-serif text-3xl sm:text-4xl">The books, quiet and current.</h1>
      </div>

      {/* HERO LEDGER */}
      <div className="grid gap-4 md:grid-cols-3">
        <Explainable id="money-available">
          <LedgerCard
            label="Available"
            value={AVAILABLE}
            sub="Across two accounts · operating"
            icon={<Wallet />}
          />
        </Explainable>
        <Explainable id="money-coming">
          <LedgerCard
            label="Coming (certain)"
            value={COMING}
            sub="Fixed costs still due this month"
            tone="warn"
            icon={<ArrowDownRight className="h-4 w-4" />}
            chip="definite"
          />
        </Explainable>
        <Explainable id="money-spendable">
          <LedgerCard
            label="Spendable"
            value={SPENDABLE}
            sub="Before any new purchases"
            tone="good"
            icon={<ShieldCheck className="h-4 w-4" />}
          />
        </Explainable>
      </div>

      {/* Math line */}
      <div className="paper rounded-xl px-5 py-3 text-sm text-[color:var(--parchment)]/85 flex flex-wrap items-center gap-2 justify-center">
        <span className="font-serif text-base">${fmt(AVAILABLE)}</span>
        <span className="text-muted-foreground">available</span>
        <span className="text-muted-foreground">−</span>
        <span className="font-serif text-base">${fmt(COMING)}</span>
        <span className="text-muted-foreground">coming</span>
        <span className="text-muted-foreground">=</span>
        <span className="font-serif text-base gold-text">${fmt(SPENDABLE)}</span>
        <span className="text-muted-foreground">spendable</span>
      </div>

      {/* DONUT + INCOME/OUTFLOW + PROGRESS */}
      <div className="grid gap-5 lg:grid-cols-3">
        <Explainable id="money-donut">
          <motion.div whileHover={{ y: -2 }} className="paper rounded-2xl p-6 lg:col-span-2">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-[10px] uppercase tracking-[0.22em] gold-text/80">Where it goes</div>
                <h3 className="mt-1 font-serif text-2xl">Monthly outflow, by tier</h3>
              </div>
              <Legend />
            </div>
            <div className="mt-4 grid gap-6 sm:grid-cols-[220px_1fr] items-center">
              <Donut data={donut} total={outTotal} />
              <ul className="space-y-2">
                {donut.map((d) => (
                  <li key={d.id} className="flex items-center justify-between gap-3 text-sm">
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ background: d.color }} />
                      <span className="truncate">{d.category}</span>
                      <TierTag tier={d.tier} />
                    </div>
                    <span className="font-serif text-base">${fmt(d.amount)}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        </Explainable>

        <div className="space-y-5">
          <Explainable id="money-progress">
            <motion.div whileHover={{ y: -2 }} className="paper rounded-2xl p-5">
              <div className="text-[10px] uppercase tracking-[0.22em] gold-text/80">This month</div>
              <div className="mt-2 flex items-end justify-between text-sm">
                <div><span className="font-serif text-2xl">${fmt(paidBills)}</span> <span className="text-muted-foreground">paid</span></div>
                <div className="text-right"><span className="font-serif text-2xl">${fmt(owedBills)}</span> <span className="text-muted-foreground">to go</span></div>
              </div>
              <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-[color:var(--surface-2)]">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${monthProgressPct}%` }}
                  transition={{ type: "spring", stiffness: 70, damping: 18 }}
                  className="h-full rounded-full"
                  style={{ background: "oklch(0.65 0.12 150)" }}
                />
              </div>
              <div className="mt-2 text-xs text-muted-foreground">{monthProgressPct}% of bills handled</div>
            </motion.div>
          </Explainable>

          <Explainable id="money-inout">
            <motion.div whileHover={{ y: -2 }} className="paper rounded-2xl p-5">
              <div className="text-[10px] uppercase tracking-[0.22em] gold-text/80">Income vs outflow</div>
              <BarRow label="In" amount={MONTH_IN} max={Math.max(MONTH_IN, outTotal)} color="oklch(0.66 0.13 150)" icon={<ArrowUpRight className="h-3 w-3" />} />
              <BarRow label="Out" amount={outTotal} max={Math.max(MONTH_IN, outTotal)} color="oklch(0.62 0.18 25)" icon={<ArrowDownRight className="h-3 w-3" />} />
              <div className={"mt-3 text-xs " + (cushion >= 0 ? "text-[color:oklch(0.78_0.10_150)]" : "text-[color:oklch(0.72_0.16_25)]")}>
                {cushion >= 0 ? `Cushion: $${fmt(cushion)} this month` : `Shortfall: $${fmt(-cushion)} this month`}
              </div>
            </motion.div>
          </Explainable>
        </div>
      </div>

      {/* DEBT */}
      <Explainable id="money-debt">
        <motion.div whileHover={{ y: -2 }} className="paper rounded-2xl p-6">
          <div className="flex items-end justify-between gap-4">
            <div>
              <div className="text-[10px] uppercase tracking-[0.22em] gold-text/80">Debt payoff</div>
              <h3 className="mt-1 font-serif text-2xl">{debtGearLoan.name}</h3>
              <div className="text-xs text-muted-foreground">
                ${fmt(debtGearLoan.paid)} paid of ${fmt(debtGearLoan.original)} · ${debtGearLoan.monthly}/mo
              </div>
            </div>
            <div className="font-serif text-3xl gold-text">
              {Math.round((debtGearLoan.paid / debtGearLoan.original) * 100)}%
            </div>
          </div>
          <div className="mt-4 h-3 overflow-hidden rounded-full bg-[color:var(--surface-2)]">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(debtGearLoan.paid / debtGearLoan.original) * 100}%` }}
              transition={{ type: "spring", stiffness: 70, damping: 18 }}
              className="h-full rounded-full"
              style={{ background: "linear-gradient(90deg, var(--gold-soft), var(--gold))" }}
            />
          </div>
        </motion.div>
      </Explainable>

      {/* ACCORDIONS */}
      <div className="paper rounded-2xl divide-y divide-[color:var(--border)]/70">
        <Section id="money-recurring" title="Recurring" subtitle={`${seedRecurring.length} items · $${fmt(recurringTotal)}/mo`}>
          <ul className="divide-y divide-[color:var(--border)]/60">
            {donut.map((r) => (
              <li key={r.id} className="flex items-center justify-between gap-3 py-2.5">
                <div className="flex items-center gap-3 min-w-0">
                  <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ background: r.color }} />
                  <span className="text-sm truncate">{r.name}</span>
                  <TierTag tier={r.tier} />
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-serif text-base">${fmt(r.amount)}</span>
                  <PencilBtn onClick={() => show({ tag: "What would happen", title: "Edit recurring.", body: "Wired up, I'd let you adjust the amount or pause it, and warn you if it'd push next month's spendable below your floor." })} />
                </div>
              </li>
            ))}
          </ul>
        </Section>

        <Section id="bills" title="Bills" subtitle={<><span className="gold-text">${fmt(owedBills)}</span> owed · <span className="text-muted-foreground">${fmt(paidBills)} paid</span></>} action={
          <button
            onClick={(e) => { e.stopPropagation(); show({ tag: "What would happen", title: "I'd read the message and file the bill.", body: "Forward me the bank text or PDF and I'd parse the amount, vendor, and due date, slot it into your bills list, and queue an approval — you'd just tap yes." }); }}
            className="inline-flex items-center gap-1.5 rounded-md border border-[color:var(--gold-soft)]/50 px-2.5 py-1 text-xs hover:bg-[color:var(--gold)]/10 transition"
          >
            <Scan className="h-3 w-3" /> Parse bank text
          </button>
        }>
          <ul className="divide-y divide-[color:var(--border)]/60">
            {bills.map((b) => (
              <li key={b.id} className="flex items-center justify-between gap-3 py-2.5">
                <div className="min-w-0">
                  <div className={"text-sm " + (b.paid ? "text-muted-foreground line-through" : "")}>{b.name}</div>
                  <div className="text-xs text-muted-foreground">Due {b.due}</div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="font-serif text-base">${b.amount.toFixed(2)}</div>
                  <button
                    onClick={() => {
                      togglePaid(b.id);
                      if (!b.paid) show({ tag: "What would happen", title: "Marked paid — and reconciled.", body: "Connected to your bank, I'd match this against the actual transaction, file the receipt, and never bother you about it again." });
                    }}
                    className={"rounded-full border px-2.5 py-0.5 text-[10px] uppercase tracking-wider transition " + (b.paid ? "border-[color:var(--border)] text-muted-foreground" : "border-[color:var(--gold-soft)]/60 gold-text hover:bg-[color:var(--gold)]/10")}
                  >
                    {b.paid ? "Paid" : "Mark paid"}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </Section>

        <Section id="money-buckets" title="Buckets" subtitle={`${seedBuckets.length} goals`}>
          <ul className="space-y-3">
            {seedBuckets.map((bk) => {
              const pct = Math.min(100, Math.round((bk.saved / bk.goal) * 100));
              return (
                <li key={bk.id}>
                  <div className="flex items-center justify-between text-sm">
                    <span>{bk.name}</span>
                    <span className="text-muted-foreground">${fmt(bk.saved)} <span className="opacity-60">/ ${fmt(bk.goal)}</span></span>
                  </div>
                  <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-[color:var(--surface-2)]">
                    <div className="h-full rounded-full" style={{ width: `${pct}%`, background: "var(--gold-soft)" }} />
                  </div>
                </li>
              );
            })}
          </ul>
        </Section>

        <Section id="money-incoming" title="Incoming" subtitle={`$${fmt(seedIncoming.reduce((a, i) => a + i.amount, 0))} expected`}>
          <ul className="divide-y divide-[color:var(--border)]/60">
            {seedIncoming.map((i) => (
              <li key={i.id} className="flex items-center justify-between gap-3 py-2.5">
                <div className="min-w-0">
                  <div className="text-sm">{i.title}</div>
                  <div className="text-xs text-muted-foreground">{i.client} · {i.expected}</div>
                </div>
                <div className="font-serif text-base gold-text">${fmt(i.amount)}</div>
              </li>
            ))}
          </ul>
        </Section>
      </div>

      {mode === "explore" && <QuickAddBill />}
    </div>
  );
}

function Wallet() { return <span className="text-base">●</span>; }

function fmt(n: number) {
  return n.toLocaleString(undefined, { maximumFractionDigits: 0 });
}

function LedgerCard({
  label, value, sub, tone, icon, chip,
}: { label: string; value: number; sub: string; tone?: "good" | "warn"; icon?: React.ReactNode; chip?: string }) {
  const color = tone === "good" ? "oklch(0.78 0.10 150)" : tone === "warn" ? "oklch(0.72 0.16 25)" : "var(--parchment)";
  return (
    <motion.div whileHover={{ y: -2 }} className="paper rounded-2xl p-6">
      <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.22em] gold-text/80">
        <span className="flex items-center gap-2">
          {label}
          {chip && (
            <span className="rounded-full border border-[color:var(--gold-soft)]/50 px-1.5 py-0.5 text-[9px] uppercase tracking-wider gold-text/90 normal-case">
              {chip}
            </span>
          )}
        </span>
        <span className="text-muted-foreground">{icon}</span>
      </div>
      <div className="mt-3 font-serif text-4xl" style={{ color }}>
        ${fmt(value)}
      </div>
      <div className="mt-1 text-xs text-muted-foreground">{sub}</div>
    </motion.div>
  );
}

function TierTag({ tier }: { tier: RecurringItem["tier"] }) {
  const c = TIER_COLOR[tier].chip;
  return (
    <span className="rounded-full px-1.5 py-0.5 text-[9px] uppercase tracking-wider border" style={{ color: c, borderColor: `color-mix(in oklab, ${c} 40%, transparent)` }}>
      {tier}
    </span>
  );
}

function Legend() {
  return (
    <div className="hidden sm:flex flex-wrap gap-2 text-[10px] uppercase tracking-wider">
      {(["Need", "Protect", "Business", "Giving"] as const).map((t) => (
        <span key={t} className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full" style={{ background: TIER_COLOR[t].base }} />
          <span className="text-muted-foreground">{t}</span>
        </span>
      ))}
    </div>
  );
}

function Donut({ data, total }: { data: (RecurringItem & { color: string })[]; total: number }) {
  const R = 70;
  const C = 2 * Math.PI * R;
  let acc = 0;
  return (
    <div className="relative mx-auto h-[200px] w-[200px]">
      <svg viewBox="0 0 200 200" className="h-full w-full -rotate-90">
        <circle cx="100" cy="100" r={R} fill="none" stroke="var(--surface-2)" strokeWidth="22" />
        {data.map((d) => {
          const frac = d.amount / total;
          const len = frac * C;
          const dash = `${len} ${C - len}`;
          const offset = -acc;
          acc += len;
          return (
            <circle
              key={d.id}
              cx="100" cy="100" r={R}
              fill="none"
              stroke={d.color}
              strokeWidth="22"
              strokeDasharray={dash}
              strokeDashoffset={offset}
            />
          );
        })}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">Out / mo</div>
        <div className="font-serif text-3xl">${fmt(total)}</div>
      </div>
    </div>
  );
}

function BarRow({ label, amount, max, color, icon }: { label: string; amount: number; max: number; color: string; icon: React.ReactNode }) {
  const pct = Math.round((amount / max) * 100);
  return (
    <div className="mt-3">
      <div className="flex items-center justify-between text-xs">
        <span className="flex items-center gap-1.5" style={{ color }}>{icon}{label}</span>
        <span className="font-serif text-base text-[color:var(--parchment)]">${fmt(amount)}</span>
      </div>
      <div className="mt-1 h-2 overflow-hidden rounded-full bg-[color:var(--surface-2)]">
        <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ type: "spring", stiffness: 70, damping: 18 }} className="h-full rounded-full" style={{ background: color }} />
      </div>
    </div>
  );
}

function PencilBtn({ onClick }: { onClick: () => void }) {
  return (
    <button onClick={onClick} className="rounded-md border border-[color:var(--border)] p-1 text-muted-foreground transition hover:text-[color:var(--gold)] hover:border-[color:var(--gold-soft)]/60">
      <Pencil className="h-3 w-3" />
    </button>
  );
}

function Section({
  id, title, subtitle, action, children,
}: { id: string; title: string; subtitle?: React.ReactNode; action?: React.ReactNode; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <Explainable id={id as any}>
      <div>
        <div className="flex w-full items-center justify-between gap-4 px-6 py-4 transition hover:bg-[color:var(--surface-2)]/40">
          <button onClick={() => setOpen((o) => !o)} className="flex flex-1 flex-col text-left">
            <div className="text-[10px] uppercase tracking-[0.22em] gold-text/80">{title}</div>
            {subtitle && <div className="mt-0.5 text-sm">{subtitle}</div>}
          </button>
          <div className="flex items-center gap-3">
            {action}
            <button onClick={() => setOpen((o) => !o)} aria-label="Toggle section" className="text-muted-foreground">
              <motion.span animate={{ rotate: open ? 180 : 0 }} className="inline-block"><ChevronDown className="h-4 w-4" /></motion.span>
            </button>
          </div>
        </div>

        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              className="overflow-hidden"
            >
              <div className="px-6 pb-5">{children}</div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Explainable>
  );
}

function QuickAddBill() {
  const addBill = useDesk((s) => s.addBill);
  const show = useDesk((s) => s.showPopup);
  const [name, setName] = useState("");
  const [amt, setAmt] = useState("");
  return (
    <motion.div whileHover={{ y: -2 }} className="paper rounded-2xl p-5">
      <div className="text-[10px] uppercase tracking-[0.22em] gold-text/80">Explore · add a bill</div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const a = parseFloat(amt);
          if (!name.trim() || !a) return;
          addBill({ name: name.trim(), amount: a, due: "Soon", paid: false });
          setName(""); setAmt("");
          show({ tag: "What would happen", title: "Filed.", body: "Wired up, I'd cross-check this against your vendors, set a real due date from the invoice, and remind you the day before — never the day of." });
        }}
        className="mt-3 flex flex-wrap gap-2"
      >
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Vendor"
          className="flex-1 min-w-[180px] rounded-md border border-[color:var(--border)] bg-[color:var(--surface-2)] px-3 py-2 text-sm outline-none focus:border-[color:var(--gold-soft)]" />
        <input value={amt} onChange={(e) => setAmt(e.target.value)} placeholder="$0.00" inputMode="decimal"
          className="w-28 rounded-md border border-[color:var(--border)] bg-[color:var(--surface-2)] px-3 py-2 text-sm outline-none focus:border-[color:var(--gold-soft)]" />
        <button className="inline-flex items-center gap-1.5 rounded-md bg-[color:var(--gold)] px-4 py-2 text-sm font-medium text-[color:var(--ink)] hover:brightness-110 transition">
          <Plus className="h-3.5 w-3.5" /> Add
        </button>
      </form>
    </motion.div>
  );
}
