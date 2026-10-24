// "Songs that sound like us" list. Exports SongSection.
import { useEffect, useState } from "react";
import { SectionShell } from "./ui/SectionShell";
import { ContinueButton } from "./ui/ContinueButton";
import { fetchContentItems, type ContentItem } from "../lib/content";

function toSong(item: ContentItem) {
  return {
    role: item.role ?? "",
    title: item.title_label ?? "",
    artist: item.artist ?? "",
    cover: item.media_urls[0] ?? null,
    note: item.note ?? "",
    url: item.link_url ?? undefined,
  };
}

export function SongSection({ onNext }: { onNext: () => void }) {
  const [songs, setSongs] = useState<ReturnType<typeof toSong>[]>([]);

  useEffect(() => {
    fetchContentItems("songs").then((items) => setSongs(items.map(toSong)));
  }, []);

  return (
    <SectionShell wide>
      <h2 className="font-serif text-3xl italic text-rose-deep">Songs that sound like us</h2>

      <div className="mt-10 flex w-full max-w-md flex-col gap-4">
        {songs.map((song, i) => (
          <div
            key={i}
            className="flex items-center gap-4 rounded-xl border border-rose/15 bg-paper p-4 text-left shadow-sm"
          >
            <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-lg bg-ivory-deep text-xs text-ink-soft/60">
              {song.cover ? (
                <img src={song.cover} alt="" className="h-full w-full rounded-lg object-cover" />
              ) : (
                "♪"
              )}
            </div>
            <div className="min-w-0">
              <p className="font-sans text-[11px] uppercase tracking-wide text-rose-deep/80">
                {song.role}
              </p>
              <p className="truncate font-serif text-base text-ink">
                {song.title} {song.artist && `— ${song.artist}`}
              </p>
              <p className="mt-1 font-serif text-sm italic text-ink-soft">{song.note}</p>
              {song.url && (
                <a
                  href={song.url}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-1 inline-block font-sans text-xs text-rose-deep underline"
                >
                  listen →
                </a>
              )}
            </div>
          </div>
        ))}
      </div>

      <ContinueButton onClick={onNext}>continue →</ContinueButton>
    </SectionShell>
  );
}
