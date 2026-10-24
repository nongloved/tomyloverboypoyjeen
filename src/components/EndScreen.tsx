// Final "to be continued..." screen with a restart button. Exports EndScreen.
import { SectionShell } from "./ui/SectionShell";
import { relationshipData } from "../data/relationship";

export function EndScreen({ onRestart }: { onRestart: () => void }) {
  return (
    <SectionShell>
      <p className="font-hand text-2xl text-rose-deep">{relationshipData.theme}</p>
      <p className="mt-8 font-serif text-lg italic text-ink-soft">to be continued...</p>

      <button
        onClick={onRestart}
        className="mt-10 rounded-full border border-rose/25 bg-paper px-5 py-2 font-sans text-xs text-ink-soft transition-colors hover:bg-ivory-deep"
      >
        ↺ read it again
      </button>
    </SectionShell>
  );
}
