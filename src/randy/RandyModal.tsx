import { AnimatePresence, motion } from "framer-motion";
import { useDesk } from "./store";
import { RandyAvatar } from "./RandyAvatar";

export function RandyModal() {
  const popup = useDesk((s) => s.popup);
  const hide = useDesk((s) => s.hidePopup);

  return (
    <AnimatePresence>
      {popup && (
        <motion.div
          className="fixed inset-0 z-[80] flex items-end justify-center bg-black/60 backdrop-blur-sm sm:items-center"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={hide}
        >
          <motion.div
            onClick={(e) => e.stopPropagation()}
            initial={{ y: 30, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 30, opacity: 0, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 280, damping: 26 }}
            className="paper relative m-4 w-full max-w-lg rounded-2xl p-6 sm:p-8"
          >
            <div className="flex items-start gap-4">
              <RandyAvatar size={48} ring />

              <div className="flex-1">
                {popup?.tag && (
                  <div className="mb-1 text-[10px] uppercase tracking-[0.18em] gold-text/80">
                    {popup.tag}
                  </div>
                )}
                <h3 className="text-2xl gold-text">{popup?.title}</h3>
                <p className="mt-3 text-[15px] leading-relaxed text-[color:var(--parchment)]/85">
                  {popup?.body}
                </p>
                <div className="mt-6 flex items-center justify-between text-xs text-muted-foreground">
                  <span className="italic">— Randy</span>
                  <button
                    onClick={hide}
                    className="rounded-md border border-[color:var(--gold-soft)]/40 px-3 py-1.5 text-[color:var(--parchment)] transition hover:bg-[color:var(--gold)]/10"
                  >
                    Got it
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
