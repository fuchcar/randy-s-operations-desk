import { motion } from "framer-motion";
import { ArrowUpRight, ArrowDownRight, Wallet, Plus, Scan } from "lucide-react";
import { useState } from "react";
import { useDesk } from "../store";

const MONTH_IN = 14820;
const MONTH_OUT = 6240;
const BALANCE = 28475.12;

export function Money() {
  const bills = useDesk((s) => s.bills);
  const togglePaid = useDesk((s) => s.togglePaid);
  const addBill = useDesk((s) => s.addBill);
  const show = useDesk((s) => s.showPopup);
  const mode = useDesk((s) => s.mode);

  const owed = bills.filter((b) => !b.paid).reduce((a, b) => a + b.amount, 0);
  const paid = bills.filter((b) => b.paid).reduce((a, b) => a + b.amount, 0);

  return (
    <div className="space-y-6">
      <div>
        <div className="text-[10px] uppercase tracking-[0.22em] gold-text/80">Money</div>
        <h1 className="mt-1 font-serif text-3xl sm:text-4xl">The books, quiet and current.</h1>
      </div>

      <div className="grid gap-5 md:grid-cols-3">
        <motion.div whileHover={{ y: -2 }} className="paper rounded-2xl p-6 md:col-span-1">
          <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.22em] gold-text/80">
            <span>Balance</span><Wallet className="h-3.5 w-3.5" />
          </div>
          <div className="mt-3 font-serif text-4xl">
            ${BALANCE.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </div>
          <div className="mt-1 text-xs text-muted-foreground">Operating · across two accounts</div>
        </motion.div>

        <motion.div whileHover={{ y: -2 }} className="paper rounded-2xl p-6">
          <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.22em] gold-text/80">
            <span>In · this month</span><ArrowUpRight className="h-3.5 w-3.5" />
          </div>
          <div className="mt-3 font-serif text-4xl">${MONTH_IN.toLocaleString()}</div>
          <div className="mt-1 text-xs text-muted-foreground">5 invoices cleared</div>
        </motion.div>

        <motion.div whileHover={{ y: -2 }} className="paper rounded-2xl p-6">
          <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.22em] gold-text/80">
            <span>Out · this month</span><ArrowDownRight className="h-3.5 w-3.5" />
          </div>
          <div className="mt-3 font-serif text-4xl">${MONTH_OUT.toLocaleString()}</div>
          <div className="mt-1 text-xs text-muted-foreground">Gear, rent, software, fuel</div>
        </motion.div>
      </div>

      <motion.div whileHover={{ y: -2 }} className="paper rounded-2xl p-6">
        <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
          <div>
            <div className="text-[10px] uppercase tracking-[0.22em] gold-text/80">Bills</div>
            <h2 className="mt-1 font-serif text-2xl">
              <span className="gold-text">${owed.toFixed(2)}</span> owed ·{" "}
              <span className="text-muted-foreground">${paid.toFixed(2)} paid</span>
            </h2>
          </div>
          <button
            onClick={() =>
              show({
                tag: "What would happen",
                title: "I'd read the message and file the bill.",
                body:
                  "Forward me the bank text or PDF and I'd parse the amount, vendor, and due date, slot it into your bills list, and queue an approval — you'd just tap yes.",
              })
            }
            className="inline-flex items-center gap-1.5 rounded-md border border-[color:var(--gold-soft)]/50 px-3 py-1.5 text-xs hover:bg-[color:var(--gold)]/10 transition"
          >
            <Scan className="h-3.5 w-3.5" /> Parse bank text
          </button>
        </div>

        <ul className="divide-y divide-[color:var(--border)]/70">
          {bills.map((b, i) => (
            <motion.li
              key={b.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className="flex items-center justify-between gap-3 py-3"
            >
              <div className="min-w-0">
                <div className={"text-sm " + (b.paid ? "text-muted-foreground line-through" : "")}>
                  {b.name}
                </div>
                <div className="text-xs text-muted-foreground">Due {b.due}</div>
              </div>
              <div className="flex shrink-0 items-center gap-3">
                <div className="font-serif text-lg">${b.amount.toFixed(2)}</div>
                <button
                  onClick={() => {
                    togglePaid(b.id);
                    if (!b.paid) {
                      show({
                        tag: "What would happen",
                        title: "Marked paid — and reconciled.",
                        body:
                          "Connected to your bank, I'd match this against the actual transaction, file the receipt to your accountant's folder, and never bother you about it again.",
                      });
                    }
                  }}
                  className={
                    "rounded-full border px-3 py-1 text-[11px] uppercase tracking-wider transition " +
                    (b.paid
                      ? "border-[color:var(--border)] text-muted-foreground hover:bg-[color:var(--surface-2)]"
                      : "border-[color:var(--gold-soft)]/60 gold-text hover:bg-[color:var(--gold)]/10")
                  }
                >
                  {b.paid ? "Paid" : "Mark paid"}
                </button>
              </div>
            </motion.li>
          ))}
        </ul>
      </motion.div>

      {mode === "explore" && <QuickAddBill onAdd={addBill} />}
    </div>
  );
}

function QuickAddBill({ onAdd }: { onAdd: (b: { name: string; amount: number; due: string; paid: boolean }) => void }) {
  const [name, setName] = useState("");
  const [amt, setAmt] = useState("");
  const show = useDesk((s) => s.showPopup);
  return (
    <motion.div whileHover={{ y: -2 }} className="paper rounded-2xl p-5">
      <div className="text-[10px] uppercase tracking-[0.22em] gold-text/80">Explore · add a bill</div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const a = parseFloat(amt);
          if (!name.trim() || !a) return;
          onAdd({ name: name.trim(), amount: a, due: "Soon", paid: false });
          setName(""); setAmt("");
          show({
            tag: "What would happen",
            title: "Filed.",
            body:
              "Wired up, I'd cross-check this against your vendors, set a real due date from the invoice, and remind you the day before — never the day of.",
          });
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
