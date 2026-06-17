import { motion } from "framer-motion";
import { RandyAvatar } from "../RandyAvatar";

export function RoomStub({ title, blurb }: { title: string; blurb: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="paper rounded-2xl p-10 text-center"
    >
      <div className="mx-auto inline-block"><RandyAvatar size={56} ring /></div>
      <h2 className="mt-5 font-serif text-3xl gold-text">{title}</h2>
      <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-[color:var(--parchment)]/80">{blurb}</p>
      <p className="mt-4 text-xs italic text-muted-foreground">— Randy is sketching this room next.</p>
    </motion.div>
  );
}
