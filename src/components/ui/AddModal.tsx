// "+" modal for adding a photo to the timeline or museum. Exports AddModal.
import { useState } from "react";
import { Modal } from "./Modal";
import { addGalleryItem, type GalleryItem, type GallerySection } from "../../lib/gallery";
import { supabase } from "../../lib/supabase";

export function AddModal({
  open,
  onClose,
  section,
  variant,
  onAdded,
}: {
  open: boolean;
  onClose: () => void;
  section: GallerySection;
  // "timeline" asks for a date label + title too; "museum" is just photo + caption
  variant: "timeline" | "museum";
  onAdded: (item: GalleryItem) => void;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [caption, setCaption] = useState("");
  const [dateLabel, setDateLabel] = useState("");
  const [titleLabel, setTitleLabel] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function reset() {
    setFile(null);
    setPreview(null);
    setCaption("");
    setDateLabel("");
    setTitleLabel("");
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
    if (!file) {
      setError("choose a photo first");
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const item = await addGalleryItem({
        section,
        file,
        caption,
        dateLabel: variant === "timeline" ? dateLabel : undefined,
        titleLabel: variant === "timeline" ? titleLabel : undefined,
      });
      onAdded(item);
      reset();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "something went wrong, try again");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Modal open={open} onClose={handleClose}>
      <p className="font-serif text-xl italic text-rose-deep">Add a photo</p>

      {!supabase ? (
        <p className="mt-4 text-sm text-ink-soft">
          this feature isn't connected yet — see SUPABASE_SETUP.md to turn it on.
        </p>
      ) : (
        <div className="mt-4 flex flex-col gap-3">
          <label className="flex h-40 cursor-pointer items-center justify-center overflow-hidden rounded-lg border border-dashed border-rose/30 bg-ivory-deep/40 text-sm text-ink-soft/70">
            {preview ? (
              <img src={preview} alt="" className="h-full w-full object-cover" />
            ) : (
              "+ choose a photo"
            )}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
            />
          </label>

          {variant === "timeline" && (
            <>
              <input
                value={dateLabel}
                onChange={(e) => setDateLabel(e.target.value)}
                placeholder="label, e.g. First road trip. 🚗"
                className="rounded-full border border-rose/25 bg-paper px-4 py-2 font-sans text-sm text-ink outline-none focus:border-rose-deep"
              />
              <input
                value={titleLabel}
                onChange={(e) => setTitleLabel(e.target.value)}
                placeholder="title, e.g. 12 Dec - we went to the beach"
                className="rounded-full border border-rose/25 bg-paper px-4 py-2 font-sans text-sm text-ink outline-none focus:border-rose-deep"
              />
            </>
          )}

          <textarea
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="caption"
            rows={3}
            className="scroll-thin resize-none rounded-lg border border-rose/25 bg-paper px-4 py-2 font-sans text-sm text-ink outline-none focus:border-rose-deep"
          />

          {error && <p className="text-sm text-rose-deep">{error}</p>}

          <button
            type="button"
            onClick={submit}
            disabled={busy}
            className="mt-1 rounded-full border border-rose-deep/30 bg-rose-deep px-6 py-2.5 font-sans text-sm text-paper shadow-sm transition-colors hover:bg-rose-deep/90 disabled:opacity-50"
          >
            {busy ? "uploading..." : "add it"}
          </button>
        </div>
      )}
    </Modal>
  );
}
