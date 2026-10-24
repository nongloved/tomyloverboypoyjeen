// Password-gated secret letter (currently hidden — see Home.tsx). Exports SecretSection.
import { useState, type SubmitEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { SectionShell } from "./ui/SectionShell";
import { ContinueButton } from "./ui/ContinueButton";
import { relationshipData } from "../data/relationship";

export function SecretSection({ onNext }: { onNext: () => void }) {
  const { teaser, cta, password, passwordHint, unlockedIntro, letter } = relationshipData.secret;
  const [stage, setStage] = useState<"teaser" | "gate" | "unlocked">("teaser");
  const [input, setInput] = useState("");
  const [wrong, setWrong] = useState(false);

  function submit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    if (input.trim().toLowerCase() === password.trim().toLowerCase()) {
      setWrong(false);
      setStage("unlocked");
    } else {
      setWrong(true);
    }
  }

  return (
    <SectionShell>
      <AnimatePresence mode="wait">
        {stage === "teaser" && (
          <motion.div
            key="teaser"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <p className="font-serif text-2xl italic text-ink">{teaser}</p>
            <button
              onClick={() => setStage("gate")}
              className="mt-8 rounded-full border border-rose-deep/30 bg-paper px-6 py-3 font-sans text-sm text-rose-deep shadow-sm transition-colors hover:bg-rose-deep hover:text-paper"
            >
              {cta}
            </button>
          </motion.div>
        )}

        {stage === "gate" && (
          <motion.form
            key="gate"
            onSubmit={submit}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex w-full max-w-xs flex-col items-center gap-3"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="password"
              className="w-full rounded-full border border-rose/25 bg-paper px-4 py-2 text-center font-sans text-sm text-ink outline-none focus:border-rose-deep"
              autoFocus
            />
            {passwordHint && (
              <p className="font-sans text-xs text-ink-soft">hint: {passwordHint}</p>
            )}
            {wrong && (
              <p className="font-sans text-xs text-rose-deep">not quite — try again 🤍</p>
            )}
            <button
              type="submit"
              className="mt-2 rounded-full border border-rose-deep/30 bg-ivory px-5 py-2 font-sans text-xs text-rose-deep transition-colors hover:bg-rose/20"
            >
              unlock
            </button>
          </motion.form>
        )}

        {stage === "unlocked" && (
          <motion.div
            key="unlocked"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center"
          >
            <p className="whitespace-pre-line font-hand text-2xl text-rose-deep">
              {unlockedIntro}
            </p>
            <div className="mt-6 rounded-2xl border border-rose/15 bg-paper px-8 py-8 shadow-sm">
              <p className="font-serif text-lg italic leading-relaxed text-ink">{letter}</p>
            </div>
            <ContinueButton onClick={onNext}>continue →</ContinueButton>
          </motion.div>
        )}
      </AnimatePresence>
    </SectionShell>
  );
}
