// "+" modal for adding a song to the "Songs that sound like us" list. Exports AddSongModal.
import { useState } from "react";
import { Modal } from "./Modal";
import { addSongItem } from "../../lib/content";
import { supabase } from "../../lib/supabase";
import type { ContentItem } from "../../lib/content";

export function AddSongModal({
  open,
  onClose,
  onAdded,
}: {
  open: boolean;
  onClose: () => void;
  onAdded: (item: ContentItem) => void;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [note, setNote] = useState("");
  const [url, setUrl] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function reset() {
    setFile(null);
    setPreview(null);
    setTitle("");
    setArtist("");
    setNote("");
    setUrl("");
    setError(null);
  }

  function handleClose() {
    if (busy) return;
    reset();
    onClose();
  }

  async function submit() {
    if (!title.trim()) {
      setError("add a song title");
      return;
    }

    setBusy(true);
    setError(null);
    try {
      const item = await addSongItem({ file, title, artist, note, url });
      onAdded(item);
      reset();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "something went wrong, try again");
    } finally {
      setBusy(false);
    }
  }

  const fieldClass =
    "rounded-full border border-rose/25 bg-paper px-4 py-2 font-sans text-sm text-ink outline-none focus:border-rose-deep";

  return (
    <Modal open={open} onClose={handleClose}>
      <p className="font-serif text-xl italic text-rose-deep">Add a song</p>

      {!supabase ? (
        <p className="mt-4 text-sm text-ink-soft">
          this feature isn't connected yet — see SUPABASE_SETUP.md to turn it on.
        </p>
      ) : (
        <div className="mt-4 flex flex-col gap-3">
          <label className="flex h-24 cursor-pointer items-center justify-center overflow-hidden rounded-lg border border-dashed border-rose/30 bg-ivory-deep/40 text-sm text-ink-soft/70">
            {preview ? (
              <img src={preview} alt="" className="h-full w-full object-cover" />
            ) : (
              "+ cover art (optional)"
            )}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0] ?? null;
                setFile(f);
                setPreview(f ? URL.createObjectURL(f) : null);
              }}
            />
          </label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="song title"
            className={fieldClass}
          />
          <input
            value={artist}
            onChange={(e) => setArtist(e.target.value)}
            placeholder="artist"
            className={fieldClass}
          />
          <input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="spotify link (optional)"
            className={fieldClass}
          />
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="why this song (optional)"
            rows={2}
            className="scroll-thin resize-none rounded-lg border border-rose/25 bg-paper px-4 py-2 font-sans text-sm text-ink outline-none focus:border-rose-deep"
          />

          {error && <p className="text-sm text-rose-deep">{error}</p>}

          <button
            type="button"
            onClick={submit}
            disabled={busy}
            className="mt-1 rounded-full border border-rose-deep/30 bg-rose-deep px-6 py-2.5 font-sans text-sm text-paper shadow-sm transition-colors hover:bg-rose-deep/90 disabled:opacity-50"
          >
            {busy ? "adding..." : "add it"}
          </button>
        </div>
      )}
    </Modal>
  );
}
