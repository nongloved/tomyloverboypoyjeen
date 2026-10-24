// "+" modal for adding a photo/song/movie/note to the memory board. Exports AddBoardItemModal.
import { useState } from "react";
import { Modal } from "./Modal";
import { addBoardItem, type BoardItem, type BoardItemKind } from "../../lib/board";
import { supabase } from "../../lib/supabase";

const KIND_META: Record<BoardItemKind, { label: string; emoji: string }> = {
  photo: { label: "Photo", emoji: "🖼️" },
  song: { label: "Song", emoji: "🎵" },
  movie: { label: "Movie", emoji: "🎬" },
  text: { label: "Note", emoji: "📝" },
};

export function AddBoardItemModal({
  open,
  onClose,
  onAdded,
}: {
  open: boolean;
  onClose: () => void;
  onAdded: (item: BoardItem) => void;
}) {
  const [kind, setKind] = useState<BoardItemKind>("photo");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [message, setMessage] = useState("");
  const [url, setUrl] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function reset() {
    setKind("photo");
    setFile(null);
    setPreview(null);
    setTitle("");
    setSubtitle("");
    setMessage("");
    setUrl("");
    setError(null);
  }

  function handleClose() {
    if (busy) return;
    reset();
    onClose();
  }

  function handleFile(f: File | null) {
    setFile(f);
    setPreview(f ? URL.createObjectURL(f) : null);
  }

  async function submit() {
    if ((kind === "photo" || kind === "movie") && !file) {
      setError(kind === "photo" ? "choose a photo first" : "choose a poster/screenshot first");
      return;
    }
    if (kind === "song" && !title.trim()) {
      setError("add a song title");
      return;
    }
    if (kind === "text" && !message.trim()) {
      setError("write something first");
      return;
    }

    setBusy(true);
    setError(null);
    try {
      const item = await addBoardItem({ kind, file, title, subtitle, message, url });
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
      <p className="font-serif text-xl italic text-rose-deep">Add to the board</p>

      {!supabase ? (
        <p className="mt-4 text-sm text-ink-soft">
          this feature isn't connected yet — see SUPABASE_SETUP.md to turn it on.
        </p>
      ) : (
        <div className="mt-4 flex flex-col gap-3">
          {/* kind picker */}
          <div className="grid grid-cols-4 gap-2">
            {(Object.keys(KIND_META) as BoardItemKind[]).map((k) => (
              <button
                key={k}
                type="button"
                onClick={() => setKind(k)}
                className={`flex flex-col items-center gap-1 rounded-lg border px-2 py-2 text-xs transition-colors ${
                  kind === k
                    ? "border-rose-deep bg-rose-deep/10 text-rose-deep"
                    : "border-rose/20 text-ink-soft hover:border-rose-deep/40"
                }`}
              >
                <span className="text-base leading-none">{KIND_META[k].emoji}</span>
                {KIND_META[k].label}
              </button>
            ))}
          </div>

          {/* photo + movie both need an image upload */}
          {(kind === "photo" || kind === "movie") && (
            <label className="flex h-40 cursor-pointer items-center justify-center overflow-hidden rounded-lg border border-dashed border-rose/30 bg-ivory-deep/40 text-sm text-ink-soft/70">
              {preview ? (
                <img src={preview} alt="" className="h-full w-full object-cover" />
              ) : kind === "photo" ? (
                "+ choose a photo"
              ) : (
                "+ choose a poster or screenshot"
              )}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
              />
            </label>
          )}

          {/* song has an optional cover + title/artist/link */}
          {kind === "song" && (
            <>
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
                  onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
                />
              </label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="song title"
                className={fieldClass}
              />
              <input
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                placeholder="artist"
                className={fieldClass}
              />
              <input
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="link (optional)"
                className={fieldClass}
              />
            </>
          )}

          {kind === "movie" && (
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="title (optional — skip if it's on the poster)"
              className={fieldClass}
            />
          )}

          {(kind === "photo" || kind === "movie") && (
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="caption (optional)"
              rows={2}
              className="scroll-thin resize-none rounded-lg border border-rose/25 bg-paper px-4 py-2 font-sans text-sm text-ink outline-none focus:border-rose-deep"
            />
          )}

          {kind === "text" && (
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="write a little note..."
              rows={4}
              className="scroll-thin resize-none rounded-lg border border-rose/25 bg-paper px-4 py-2 font-sans text-sm text-ink outline-none focus:border-rose-deep"
            />
          )}

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
