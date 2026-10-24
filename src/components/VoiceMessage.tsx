// Play-a-recording section (currently removed — see Home.tsx). Exports VoiceMessage.
import { useRef, useState } from "react";
import { SectionShell } from "./ui/SectionShell";
import { ContinueButton } from "./ui/ContinueButton";
import { relationshipData } from "../data/relationship";

export function VoiceMessage({ onNext }: { onNext: () => void }) {
  const { src, before, after } = relationshipData.voiceMessage;
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [played, setPlayed] = useState(false);
  const [error, setError] = useState(false);

  function handlePlay() {
    const audio = audioRef.current;
    if (!audio) return;
    audio.play().catch(() => setError(true));
  }

  return (
    <SectionShell>
      <h2 className="font-serif text-3xl italic text-rose-deep">A little message from me</h2>

      <div className="mt-10 flex flex-col items-center gap-4 rounded-2xl border border-rose/15 bg-paper px-8 py-10 shadow-sm">
        <button
          onClick={handlePlay}
          className="flex h-16 w-16 items-center justify-center rounded-full border border-rose-deep/30 bg-ivory text-2xl text-rose-deep transition-transform hover:scale-105 active:scale-95"
          aria-label="Play voice message"
        >
          ▶
        </button>

        <audio
          ref={audioRef}
          src={src}
          onPlay={() => setPlayed(true)}
          onError={() => setError(true)}
        />

        <p className="font-hand text-lg text-ink-soft">
          {error
            ? "[ADD AN AUDIO FILE AT public/audio/voice-message.mp3]"
            : played
            ? after
            : before}
        </p>
      </div>

      <ContinueButton onClick={onNext}>continue →</ContinueButton>
    </SectionShell>
  );
}
