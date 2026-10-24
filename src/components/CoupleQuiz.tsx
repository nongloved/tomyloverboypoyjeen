// Relationship-trivia quiz (currently unused — see Home.tsx). Exports CoupleQuiz.
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { SectionShell } from "./ui/SectionShell";
import { ContinueButton } from "./ui/ContinueButton";
import { relationshipData } from "../data/relationship";

export function CoupleQuiz({ onNext }: { onNext: () => void }) {
  const questions = relationshipData.quiz;
  const [step, setStep] = useState(0);
  const [score, setScore] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const finished = step >= questions.length;

  function pick(optionIndex: number) {
    if (picked !== null) return;
    setPicked(optionIndex);
    if (optionIndex === questions[step].correctIndex) setScore((s) => s + 1);
  }

  function next() {
    setPicked(null);
    setStep((s) => s + 1);
  }

  return (
    <SectionShell>
      <h2 className="font-serif text-3xl italic text-rose-deep">How well do you know us?</h2>

      <div className="mt-10 w-full max-w-sm">
        <AnimatePresence mode="wait">
          {!finished ? (
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -16 }}
              transition={{ duration: 0.35 }}
            >
              <p className="font-sans text-xs text-ink-soft">
                question {step + 1} / {questions.length}
              </p>
              <p className="mt-2 font-serif text-xl text-ink">{questions[step].question}</p>

              <div className="mt-5 flex flex-col gap-2">
                {questions[step].options.map((opt, i) => {
                  const isPicked = picked === i;
                  const isCorrect = i === questions[step].correctIndex;
                  const showState = picked !== null;
                  return (
                    <button
                      key={i}
                      onClick={() => pick(i)}
                      className={`rounded-lg border px-4 py-2 text-left font-sans text-sm transition-colors ${
                        showState && isCorrect
                          ? "border-rose-deep bg-rose-deep/10 text-rose-deep"
                          : showState && isPicked
                          ? "border-ink-soft/40 bg-ink-soft/5 text-ink-soft"
                          : "border-rose/20 bg-paper text-ink hover:bg-ivory-deep"
                      }`}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>

              {picked !== null && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-4 font-hand text-lg text-rose-deep"
                >
                  {questions[step].response}
                </motion.p>
              )}

              {picked !== null && (
                <button
                  onClick={next}
                  className="mt-6 rounded-full border border-rose/25 bg-ivory px-5 py-2 font-sans text-xs text-rose-deep transition-colors hover:bg-rose/20"
                >
                  next →
                </button>
              )}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <p className="font-serif text-xl text-ink">
                Score: {score} / {questions.length}
              </p>
              <p className="mt-3 font-hand text-lg text-rose-deep">
                {score === questions.length
                  ? "Show off. But okay, cute."
                  : "Doesn't matter — you still know the important part: us."}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {finished && <ContinueButton onClick={onNext}>continue →</ContinueButton>}
    </SectionShell>
  );
}
