import { motion } from "framer-motion";

export function RoomStub({ title, blurb }: { title: string; blurb: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="paper rounded-2xl p-10 text-center"
    >
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[color:var(--surface-2)] text-2xl ring-1 ring-[color:var(--gold-soft)]/40">🦝</div>
      <h2 className="mt-5 font-serif text-3xl gold-text">{title}</h2>
      <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-[color:var(--parchment)]/80">{blurb}</p>
      <p className="mt-4 text-xs italic text-muted-foreground">— Randy is sketching this room next.</p>
    </motion.div>
  );
}
