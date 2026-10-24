// "Future memories" list (currently hidden — see Home.tsx). Exports FutureMemories.
import { SectionShell } from "./ui/SectionShell";
import { ContinueButton } from "./ui/ContinueButton";
import { relationshipData } from "../data/relationship";

export function FutureMemories({ onNext }: { onNext: () => void }) {
  const items = relationshipData.futureMemories;

  return (
    <SectionShell wide>
      <h2 className="font-serif text-3xl italic text-rose-deep">Things we haven't done yet</h2>
      <p className="mt-2 font-sans text-sm text-ink-soft">our story is still being written.</p>

      <div className="mt-10 grid w-full grid-cols-1 gap-3 sm:grid-cols-2">
        {items.map((item, i) => (
          <div
            key={i}
            className="rounded-xl border border-dashed border-rose/30 bg-ivory-deep/30 px-5 py-6 text-left font-serif italic text-ink-soft opacity-80"
          >
            {item}
          </div>
        ))}
      </div>

      <ContinueButton onClick={onNext}>continue →</ContinueButton>
    </SectionShell>
  );
}
