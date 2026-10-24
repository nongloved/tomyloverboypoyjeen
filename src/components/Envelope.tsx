// The opening envelope + letter-card flip. Exports Envelope.
import { useState } from "react";
import { motion } from "framer-motion";
import { relationshipData } from "../data/relationship";
import { ContinueButton } from "./ui/ContinueButton";
import {
  BowSticker,
  FlowerSticker,
  PaperGrain,
  PaperTag,
  PhotoboothFrame,
  PolaroidFrame,
} from "./ui/Scrapbook";
import envelopeClosed from "../assets/decorations/envelope-closed.png";
import envelopeOpen from "../assets/decorations/envelope-open.png";
import cover11 from "../assets/cover/optimized/11.jpg";
import cover12 from "../assets/cover/optimized/12.jpg";
import cover14 from "../assets/cover/optimized/14.jpg";

type Stage = "closed" | "open" | "letter";

const HINTS: Partial<Record<Stage, string>> = {
  closed: "tap the envelope",
  open: "tap the card to read it",
};

const EASE_GLIDE = [0.16, 1, 0.3, 1] as const;

// card position/tilt inside envelope-open.png, hand-measured as % of the image
const CARD_LEFT = 0;
const CARD_TOP = 10.5;
const CARD_WIDTH = 91.6;
const CARD_HEIGHT = 59.5;
const CARD_ROTATE = 9;

const ENVELOPE_OPEN_RATIO = 508 / 420; // height / width of envelope-open.png
const REF_W = 320;
const REF_H = REF_W * ENVELOPE_OPEN_RATIO;
const SMALL_W = REF_W * (CARD_WIDTH / 100);
const SMALL_H = REF_H * (CARD_HEIGHT / 100);
const SMALL_OFFSET_X = REF_W * (CARD_LEFT / 100) + SMALL_W / 2 - REF_W / 2;
const SMALL_OFFSET_Y = REF_H * (CARD_TOP / 100) + SMALL_H / 2 - REF_H / 2;

export function Envelope({ onOpened }: { onOpened: () => void }) {
  const [stage, setStage] = useState<Stage>("closed");
  const { addressee, subheading } = relationshipData.opening;
  const { greeting, paragraphs, cta } = relationshipData.firstLetter;

  const closed = stage === "closed";
  const big = stage === "letter";

  return (
    <section className="flex min-h-screen w-full flex-col items-center justify-center gap-6 px-6 py-16 text-center">
      {closed ? (
        <p className="min-h-[1.4em] font-hand text-lg text-ink-soft">{subheading}</p>
      ) : (
        <p className="min-h-[1.4em] font-sans text-sm text-ink-soft">{HINTS[stage] ?? ""}</p>
      )}

      <div
        className="relative flex w-[min(86vw,320px)] items-center justify-center"
        style={{ minHeight: "min(52vh, 320px)" }}
      >
        <FlowerSticker className="-bottom-6 -left-16 z-0" rotate={-18} size={185} />
        <PaperTag text="lucky to have you" className="-left-4 top-[74%] z-10" rotate={-9} />
        <BowSticker
          className="left-[-32px] top-[calc(17%-17px)] z-10"
          rotate={-10}
          size={64}
        />
        <PhotoboothFrame
          className="-right-9 top-[2%] z-10"
          rotate={8}
          width={92}
          photos={[cover11, cover12]}
        />
        <PolaroidFrame className="-right-10 bottom-8 z-10" rotate={-7} width={148} photo={cover14} />

        <div className="absolute -bottom-6 left-1/2 h-6 w-2/3 -translate-x-1/2 rounded-full bg-ink/15 blur-md" />

        <motion.button
          type="button"
          onClick={() => closed && setStage("open")}
          aria-label="เปิดซองจดหมาย"
          disabled={!closed}
          className="absolute inset-0 flex items-center justify-center border-none bg-transparent p-0 disabled:cursor-default"
          style={{
            cursor: closed ? "pointer" : "default",
            pointerEvents: closed ? "auto" : "none",
            zIndex: closed ? 2 : 1,
          }}
          animate={{ opacity: closed ? 1 : 0, scale: closed ? 1 : 0.92 }}
          transition={{ duration: 0.45, ease: EASE_GLIDE }}
        >
          <img
            src={envelopeClosed}
            alt=""
            draggable={false}
            className="w-full select-none"
            style={{ filter: "drop-shadow(0 18px 30px rgba(8,32,82,0.25))" }}
          />
        </motion.button>

        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          style={{ pointerEvents: closed ? "none" : "auto", zIndex: closed ? 1 : 16 }}
          animate={{ opacity: closed ? 0 : 1 }}
          transition={{ duration: 0.45, ease: EASE_GLIDE }}
        >
          <div className="relative w-full">
            <img
              src={envelopeOpen}
              alt=""
              draggable={false}
              className="w-full select-none"
              style={{ filter: "drop-shadow(0 18px 30px rgba(8,32,82,0.25))" }}
            />

            <motion.div
              className="absolute left-1/2 top-1/2"
              style={{
                perspective: 1200,
                zIndex: big ? 20 : 15,
                pointerEvents: closed ? "none" : "auto",
                willChange: "transform, opacity, width, height",
              }}
              animate={{
                x: big ? "-50%" : `calc(-50% + ${SMALL_OFFSET_X}px)`,
                y: big ? "-50%" : `calc(-50% + ${SMALL_OFFSET_Y}px)`,
                width: big ? "min(85vw, 380px)" : SMALL_W,
                height: big ? "min(52vh, 320px)" : SMALL_H,
                rotate: big ? 0 : CARD_ROTATE,
              }}
              transition={{
                x: { duration: 0.55, ease: EASE_GLIDE },
                y: { duration: 0.55, ease: EASE_GLIDE },
                width: { duration: 0.6, ease: EASE_GLIDE, delay: big ? 0.08 : 0 },
                height: { duration: 0.6, ease: EASE_GLIDE, delay: big ? 0.08 : 0 },
                rotate: { duration: 0.6, ease: EASE_GLIDE, delay: big ? 0.08 : 0 },
              }}
            >
              <motion.div
                onClick={() => stage === "open" && setStage("letter")}
                className="relative h-full w-full rounded-[1.5rem] shadow-[0_10px_20px_rgba(8,32,82,0.25)]"
                style={{
                  transformStyle: "preserve-3d",
                  cursor: stage === "open" ? "pointer" : "default",
                  willChange: "transform",
                }}
                animate={{ rotateY: big ? 180 : 0 }}
                transition={{ duration: 0.6, ease: EASE_GLIDE, delay: big ? 0.08 : 0 }}
              >
                <div
                  className="absolute inset-0 flex flex-col items-center justify-center rounded-[1.5rem] border border-rose/15 bg-paper p-3 text-center"
                  style={{ backfaceVisibility: "hidden" }}
                >
                  <PaperGrain />
                  <p className="font-serif text-base leading-snug text-ink">
                    to my
                    <br />
                    <span className="font-hand text-4xl text-rose-deep">
                      {addressee}
                    </span>
                  </p>
                </div>

                <div
                  className="absolute inset-0 flex flex-col overflow-hidden rounded-[1.5rem] border border-rose/15 bg-paper p-5 text-left"
                  style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
                >
                  <PaperGrain />
                  <div className="scroll-thin relative flex flex-1 flex-col justify-center overflow-y-auto pr-1">
                    <p className="font-hand text-2xl text-rose-deep">{greeting}</p>
                    <div className="mt-3 space-y-3 font-serif text-base leading-relaxed text-ink">
                      {paragraphs.map((p, i) => (
                        <p key={i}>{p}</p>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {closed && <p className="font-sans text-sm text-ink-soft">{HINTS.closed}</p>}

      {big && (
        <ContinueButton onClick={onOpened} aria-label={cta}>
          →
        </ContinueButton>
      )}
    </section>
  );
}
