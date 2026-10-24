// "Open when..." card grid (currently hidden — see Home.tsx). Exports OpenWhen.
import { useState } from "react";
import { SectionShell } from "./ui/SectionShell";
import { ContinueButton } from "./ui/ContinueButton";
import { Modal } from "./ui/Modal";
import { relationshipData, type OpenWhenCard } from "../data/relationship";

const TONE_STYLES: Record<OpenWhenCard["tone"], string> = {
  warm: "border-rose-deep/30 bg-rose/10",
  calm: "border-dusty/40 bg-dusty/10",
  playful: "border-rose-deep/30 bg-ivory-deep",
  reassuring: "border-beige bg-beige/30",
};

export function OpenWhen({ onNext }: { onNext: () => void }) {
  const cards = relationshipData.openWhen;
  const [selected, setSelected] = useState<OpenWhenCard | null>(null);

  return (
    <SectionShell wide>
      <h2 className="font-serif text-3xl italic text-rose-deep">Open when...</h2>
      <p className="mt-2 font-sans text-sm text-ink-soft">pick whichever one you need right now.</p>

      <div className="mt-10 grid w-full grid-cols-1 gap-3 sm:grid-cols-2">
        {cards.map((card, i) => (
          <button
            key={i}
            onClick={() => setSelected(card)}
            className={`rounded-xl border px-5 py-4 text-left font-serif text-base italic text-ink shadow-sm transition-transform hover:-translate-y-0.5 hover:shadow-md ${
              TONE_STYLES[card.tone]
            }`}
            style={{ transform: `rotate(${((i * 7) % 5) - 2}deg)` }}
          >
            {card.label}
          </button>
        ))}
      </div>

      <Modal open={!!selected} onClose={() => setSelected(null)}>
        {selected && (
          <>
            <p className="font-sans text-xs uppercase tracking-wide text-rose-deep/80">
              {selected.label}
            </p>
            <p className="mt-3 font-serif text-lg italic leading-relaxed text-ink">
              {selected.message}
            </p>
          </>
        )}
      </Modal>

      <ContinueButton onClick={onNext}>continue →</ContinueButton>
    </SectionShell>
  );
}
