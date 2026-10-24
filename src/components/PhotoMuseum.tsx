// "A tiny museum of us" category-tabbed photo grid. Exports PhotoMuseum.
import { useEffect, useState } from "react";
import { SectionShell } from "./ui/SectionShell";
import { ContinueButton } from "./ui/ContinueButton";
import { Modal } from "./ui/Modal";
import { AddModal } from "./ui/AddModal";
import { relationshipData, type MuseumItem } from "../data/relationship";
import { VIDEO_EXT } from "./ui/Scrapbook";
import { fetchGalleryItems, type GalleryItem, type GallerySection } from "../lib/gallery";
import { fetchContentItems, type ContentItem } from "../lib/content";

const CATEGORY_LABELS: Record<string, string> = {
  sillyUs: "Silly Us",
  favoritePhotosOfYou: "My Favorite Photos of You",
};

function toMuseumItem(item: GalleryItem): MuseumItem {
  return { photo: item.image_url, caption: item.caption };
}

function fromContentItem(item: ContentItem): MuseumItem {
  return { photo: item.media_urls[0] ?? null, caption: item.caption ?? "" };
}

const MUSEUM_KEYS = ["sillyUs", "favoritePhotosOfYou"] as const;

export function PhotoMuseum({ onNext }: { onNext: () => void }) {
  const [active, setActive] = useState<(typeof MUSEUM_KEYS)[number]>(MUSEUM_KEYS[0]);
  const [selected, setSelected] = useState<MuseumItem | null>(null);
  const [addOpen, setAddOpen] = useState(false);
  const [added, setAdded] = useState<Record<string, GalleryItem[]>>({});
  const [curated, setCurated] = useState<Record<string, ContentItem[]>>({});

  useEffect(() => {
    MUSEUM_KEYS.forEach((key) => {
      fetchGalleryItems(key as GallerySection).then((items) =>
        setAdded((prev) => ({ ...prev, [key]: items }))
      );
      fetchContentItems(key).then((items) =>
        setCurated((prev) => ({ ...prev, [key]: items }))
      );
    });
  }, []);

  const activeItems = [
    ...(curated[active] ?? []).map(fromContentItem),
    ...(added[active] ?? []).map(toMuseumItem),
  ];

  return (
    <SectionShell wide>
      <h2 className="font-serif text-3xl italic text-rose-deep">
        {relationshipData.museum.intro}
      </h2>

      <div className="mt-8 flex flex-wrap justify-center gap-2">
        {MUSEUM_KEYS.map((key) => (
          <button
            key={key}
            onClick={() => setActive(key)}
            className={`rounded-full border px-4 py-2 font-sans text-xs transition-colors ${
              active === key
                ? "border-rose-deep bg-rose-deep text-paper"
                : "border-rose/25 bg-paper text-ink-soft hover:bg-ivory-deep"
            }`}
          >
            {CATEGORY_LABELS[key] ?? key}
          </button>
        ))}
      </div>

      <div className="mt-8 grid w-full grid-cols-2 gap-4 sm:grid-cols-4">
        {activeItems.map((item, i) => (
          <button
            key={i}
            onClick={() => setSelected(item)}
            className="group aspect-square overflow-hidden rounded-xl border border-rose/15 bg-ivory-deep/50 shadow-sm transition-transform hover:-translate-y-0.5 hover:shadow-md"
          >
            {item.photo ? (
              VIDEO_EXT.test(item.photo) ? (
                <video
                  src={item.photo}
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              ) : (
                <img
                  src={item.photo}
                  alt=""
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              )
            ) : (
              <span className="flex h-full w-full items-center justify-center text-xs text-ink-soft/60">
                + add photo
              </span>
            )}
          </button>
        ))}
        <button
          type="button"
          onClick={() => setAddOpen(true)}
          className="flex aspect-square items-center justify-center gap-1 rounded-xl border-2 border-dashed border-rose/30 text-xs text-ink-soft/60 transition-colors hover:border-rose-deep/40 hover:text-rose-deep"
        >
          + add photo
        </button>
      </div>

      <AddModal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        section={active as GallerySection}
        variant="museum"
        onAdded={(item) =>
          setAdded((prev) => ({ ...prev, [active]: [...(prev[active] ?? []), item] }))
        }
      />

      <Modal open={!!selected} onClose={() => setSelected(null)}>
        {selected && (
          <>
            {selected.photo ? (
              VIDEO_EXT.test(selected.photo) ? (
                <video
                  src={selected.photo}
                  controls
                  playsInline
                  className="mb-4 w-full rounded-lg bg-black object-contain"
                />
              ) : (
                <img
                  src={selected.photo}
                  alt=""
                  className="mb-4 w-full rounded-lg object-cover"
                />
              )
            ) : (
              <div className="mb-4 flex h-48 items-center justify-center rounded-lg border border-dashed border-rose/25 text-sm text-ink-soft/60">
                + add photo
              </div>
            )}
            <p className="font-serif text-base italic leading-relaxed text-ink">
              {selected.caption}
            </p>
          </>
        )}
      </Modal>

      <ContinueButton onClick={onNext}>continue →</ContinueButton>
    </SectionShell>
  );
}
