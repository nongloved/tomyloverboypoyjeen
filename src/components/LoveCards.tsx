// "Things I love about you" category cards (currently hidden — see Home.tsx). Exports LoveCards.
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { SectionShell } from "./ui/SectionShell";
import { ContinueButton } from "./ui/ContinueButton";
import { relationshipData } from "../data/relationship";

export function LoveCards({ onNext }: { onNext: () => void }) {
  const categories = relationshipData.thingsILove;
  const [index, setIndex] = useState(0);
  const isLast = index === categories.length - 1;
  const current = categories[index];

  return (
    <SectionShell>
      <h2 className="font-serif text-3xl italic text-rose-deep">Things I love about you</h2>

      <div className="relative mt-10 flex min-h-[18rem] w-full max-w-sm items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -14 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="flex w-full flex-col items-center gap-4 rounded-2xl border border-rose/15 bg-paper px-6 py-8 text-center shadow-sm"
          >
            <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.2em] text-rose-deep/70">
              {current.category}
            </p>
            <ul className="flex flex-col gap-2 text-left">
              {current.items.map((item, i) => (
                <li key={i} className="flex items-start gap-2 font-serif text-base italic leading-snug text-ink">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-rose-deep/60" />
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>
        </AnimatePresence>
      </div>

      {!isLast ? (
        <button
          onClick={() => setIndex((i) => Math.min(i + 1, categories.length - 1))}
          className="mt-6 rounded-full border border-rose/25 bg-ivory px-5 py-2 font-sans text-xs text-rose-deep transition-colors hover:bg-rose/20"
        >
          another one →
        </button>
      ) : (
        <p className="mt-6 font-hand text-lg text-ink-soft">
          And yes, there are more than these.
        </p>
      )}

      <ContinueButton onClick={onNext}>continue →</ContinueButton>
    </SectionShell>
  );
}
