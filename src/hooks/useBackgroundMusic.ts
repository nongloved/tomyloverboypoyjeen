// Ambient background music toggle. Exports useBackgroundMusic.
import { useCallback, useEffect, useRef, useState } from "react";

const STORAGE_KEY = "love-site-music-enabled";
// EDIT: drop an ambient track at public/audio/ambient.mp3 — until then this
// fails silently and the toggle just does nothing audible.
const MUSIC_SRC = "/audio/ambient.mp3";

export function useBackgroundMusic() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const audio = new Audio(MUSIC_SRC);
    audio.loop = true;
    audio.volume = 0.35;
    audioRef.current = audio;

    if (localStorage.getItem(STORAGE_KEY) === "true") setEnabled(true);

    return () => {
      audio.pause();
      audio.src = "";
    };
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (enabled) {
      // may reject if this ran without a user gesture (autoplay policy) —
      // that's fine, we fail quietly rather than throwing.
      audio.play().catch(() => {});
    } else {
      audio.pause();
    }
    localStorage.setItem(STORAGE_KEY, String(enabled));
  }, [enabled]);

  const toggle = useCallback(() => setEnabled((e) => !e), []);

  return { enabled, toggle };
}
