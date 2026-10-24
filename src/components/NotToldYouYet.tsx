// "Things I haven't told you yet" card list (currently hidden — see Home.tsx). Exports NotToldYouYet.
import { useState } from "react";
import { SectionShell } from "./ui/SectionShell";
import { ContinueButton } from "./ui/ContinueButton";
import { Modal } from "./ui/Modal";
import { relationshipData, type ReflectiveCard } from "../data/relationship";

export function NotToldYouYet({ onNext }: { onNext: () => void }) {
  const cards = relationshipData.notToldYouYet;
  const [selected, setSelected] = useState<ReflectiveCard | null>(null);

  return (
    <SectionShell>
      <h2 className="font-serif text-3xl italic text-rose-deep">Things I haven't told you yet</h2>

      <div className="mt-10 flex w-full max-w-sm flex-col gap-3">
        {cards.map((card, i) => (
          <button
            key={i}
            onClick={() => setSelected(card)}
            className="rounded-xl border border-rose/15 bg-paper px-5 py-4 text-left font-serif italic text-ink shadow-sm transition-transform hover:-translate-y-0.5 hover:shadow-md"
          >
            {card.title}
          </button>
        ))}
      </div>

      <Modal open={!!selected} onClose={() => setSelected(null)}>
        {selected && (
          <>
            <p className="font-sans text-xs uppercase tracking-wide text-rose-deep/80">
              {selected.title}
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
