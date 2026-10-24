// Anniversary gift flip-card. Exports GiftReveal.
import { useState } from "react";
import { motion } from "framer-motion";
import { SectionShell } from "./ui/SectionShell";
import { ContinueButton } from "./ui/ContinueButton";
import { BowSticker, PaperTag } from "./ui/Scrapbook";
import { relationshipData } from "../data/relationship";

const EASE_GLIDE = [0.16, 1, 0.3, 1] as const;

// renders `**word**` in the data as bold
function renderWithBold(text: string) {
  return text.split("**").map((chunk, i) =>
    i % 2 === 1 ? (
      <strong key={i} className="font-semibold text-rose-deep">
        {chunk}
      </strong>
    ) : (
      chunk
    )
  );
}

export function GiftReveal({ onNext }: { onNext: () => void }) {
  const { paragraphs, closeEyesPrompt, backParagraphs, cta } = relationshipData.giftReveal;
  const [flipped, setFlipped] = useState(false);

  return (
    <SectionShell>
      <div className="relative w-full max-w-sm">
        <BowSticker
          className="-top-7 left-1/2 z-20 -translate-x-1/2"
          rotate={0}
          size={56}
        />
        <PaperTag text="to Poyjeen, from me" className="-right-6 -top-4 z-20" rotate={9} />

        <button
          type="button"
          onClick={() => setFlipped((f) => !f)}
          aria-label={flipped ? "flip card back" : "flip card over"}
          className="block w-full border-none bg-transparent p-0 text-left"
          style={{ perspective: 1400 }}
        >
          <motion.div
            className="relative min-h-[18rem]"
            style={{ transformStyle: "preserve-3d", willChange: "transform" }}
            animate={{ rotateY: flipped ? 180 : 0 }}
            transition={{ duration: 0.6, ease: EASE_GLIDE }}
          >
            <div
              className="absolute inset-0 overflow-hidden rounded-[1.75rem] border-2 border-rose-deep/20 bg-paper px-6 py-10 shadow-[0_18px_34px_rgba(8,32,82,0.18)]"
              style={{ backfaceVisibility: "hidden" }}
            >
              <div className="pointer-events-none absolute inset-y-0 left-1/2 z-0 w-7 -translate-x-1/2 bg-rose-deep/10" />
              <div className="pointer-events-none absolute inset-x-0 top-1/2 z-0 h-7 -translate-y-1/2 bg-rose-deep/10" />

              <div className="relative z-10 flex h-full flex-col items-center justify-center gap-6 text-center">
                <div className="space-y-4 text-left font-serif text-lg leading-relaxed text-ink">
                  {paragraphs.map((p, i) => (
                    <p key={i}>{p}</p>
                  ))}
                </div>
                <p className="font-hand text-2xl text-rose-deep">{closeEyesPrompt}</p>
              </div>
            </div>

            <div
              className="absolute inset-0 overflow-hidden rounded-[1.75rem] border-2 border-rose-deep/20 bg-paper px-6 py-10 shadow-[0_18px_34px_rgba(8,32,82,0.18)]"
              style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
            >
              <div className="pointer-events-none absolute inset-y-0 left-1/2 z-0 w-7 -translate-x-1/2 bg-rose-deep/10" />
              <div className="pointer-events-none absolute inset-x-0 top-1/2 z-0 h-7 -translate-y-1/2 bg-rose-deep/10" />

              <div className="relative z-10 flex h-full flex-col items-center justify-center gap-4 text-center">
                <div className="space-y-3 text-left font-serif text-lg leading-relaxed text-ink">
                  {backParagraphs.map((p, i) => (
                    <p key={i}>{renderWithBold(p)}</p>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </button>
      </div>

      <ContinueButton onClick={onNext}>{cta}</ContinueButton>
    </SectionShell>
  );
}
