// "This isn't the end of our story" closing letter. Exports FinalSection.
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { SectionShell } from "./ui/SectionShell";
import { ContinueButton } from "./ui/ContinueButton";
import { relationshipData } from "../data/relationship";

function daysSince(dateStr: string) {
  const start = new Date(dateStr);
  const now = new Date();
  return Math.max(0, Math.floor((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)));
}

export function FinalSection({ onNext }: { onNext: () => void }) {
  const { heading, paragraphs, question, cta, officialDateDisplay } = relationshipData.finalLetter;
  const [confirmed, setConfirmed] = useState(false);
  const days = useMemo(() => daysSince(relationshipData.officialDate), []);

  return (
    <SectionShell>
      {!confirmed ? (
        <>
          <h2 className="font-serif text-2xl italic leading-snug text-rose-deep">{heading}</h2>
          <div className="mt-6 space-y-4 text-left font-serif text-lg leading-relaxed text-ink">
            {paragraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
          <p className="mt-6 font-hand text-2xl text-rose-deep">{question}</p>
          <button
            onClick={() => setConfirmed(true)}
            className="mt-8 rounded-full border border-rose-deep/30 bg-paper px-8 py-3 font-sans text-sm text-rose-deep shadow-sm transition-colors hover:bg-rose-deep hover:text-paper"
          >
            {cta}
          </button>
        </>
      ) : (
        <div className="relative flex flex-col items-center">
          {Array.from({ length: 6 }).map((_, i) => (
            <motion.span
              key={i}
              className="pointer-events-none absolute text-rose/50"
              style={{ left: `${10 + i * 14}%`, bottom: 0 }}
              initial={{ opacity: 0, y: 0 }}
              animate={{ opacity: [0, 1, 0], y: -160 }}
              transition={{ duration: 2.4, delay: i * 0.15, ease: "easeOut" }}
            >
              ♡
            </motion.span>
          ))}

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p className="font-serif text-2xl italic text-ink">{officialDateDisplay}</p>
            <p className="mt-2 font-hand text-xl text-rose-deep">
              and counting... ({days} {days === 1 ? "day" : "days"})
            </p>
          </motion.div>

          <ContinueButton onClick={onNext}>keep going →</ContinueButton>
        </div>
      )}
    </SectionShell>
  );
}
