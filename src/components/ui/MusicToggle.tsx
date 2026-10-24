// Floating music mute/play button. Exports MusicToggle.
import { useBackgroundMusic } from "../../hooks/useBackgroundMusic";

export function MusicToggle() {
  const { enabled, toggle } = useBackgroundMusic();

  return (
    <button
      onClick={toggle}
      aria-label={enabled ? "Mute background music" : "Play background music"}
      title={enabled ? "Mute music" : "Play music"}
      className="fixed bottom-5 right-5 z-50 flex h-11 w-11 items-center justify-center rounded-full border border-rose/25 bg-paper/90 text-rose-deep shadow-md backdrop-blur transition-transform hover:scale-105 active:scale-95"
    >
      <span className="text-base">{enabled ? "♫" : "♪"}</span>
    </button>
  );
}
