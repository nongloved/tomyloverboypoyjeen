// "Songs that sound like us" list. Exports SongSection.
import { useEffect, useState } from "react";
import { SectionShell } from "./ui/SectionShell";
import { ContinueButton } from "./ui/ContinueButton";
import { AddSongModal } from "./ui/AddSongModal";
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
  const [addOpen, setAddOpen] = useState(false);

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

        <button
          type="button"
          onClick={() => setAddOpen(true)}
          className="flex items-center justify-center gap-1.5 rounded-xl border-2 border-dashed border-rose/30 px-4 py-4 font-sans text-sm text-ink-soft/60 transition-colors hover:border-rose-deep/40 hover:text-rose-deep"
        >
          <span className="text-lg leading-none">+</span>
          add a song
        </button>
      </div>

      <AddSongModal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onAdded={(item) => setSongs((prev) => [...prev, toSong(item)])}
      />

      <ContinueButton onClick={onNext}>continue →</ContinueButton>
    </SectionShell>
  );
}
