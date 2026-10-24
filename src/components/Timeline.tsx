// "Our firsts" timeline grid + lightbox. Exports Timeline.
import { useEffect, useState } from "react";
import { SectionShell } from "./ui/SectionShell";
import { ContinueButton } from "./ui/ContinueButton";
import { Modal } from "./ui/Modal";
import { AddModal } from "./ui/AddModal";
import { BowSticker, HeartPatchSticker, PolaroidCard, VIDEO_EXT, WashiTape } from "./ui/Scrapbook";
import type { TimelineEntry } from "../data/relationship";
import { fetchGalleryItems, type GalleryItem } from "../lib/gallery";
import { fetchContentItems, type ContentItem } from "../lib/content";

function toTimelineEntry(item: GalleryItem): TimelineEntry {
  return {
    date: item.date_label ?? "",
    title: item.title_label ?? "",
    caption: item.caption,
    photos: [item.image_url],
  };
}

function fromContentItem(item: ContentItem): TimelineEntry {
  return {
    date: item.date_label ?? "",
    title: item.title_label ?? "",
    caption: item.caption ?? "",
    photos: item.media_urls,
  };
}

type Decor =
  | { kind: "tape"; variant: "navy" | "denim" | "gingham" | "plaid"; corner: "tl" | "tr"; rotate: number }
  | { kind: "bow"; corner: "tl" | "tr"; rotate: number }
  | { kind: "heart"; corner: "tl" | "tr"; rotate: number }
  | { kind: "none" };

const DECOR_PLAN: Decor[] = [
  { kind: "tape", variant: "navy", corner: "tl", rotate: -7 },
  { kind: "bow", corner: "tr", rotate: 6 },
  { kind: "tape", variant: "gingham", corner: "tr", rotate: 9 },
  { kind: "heart", corner: "tl", rotate: -8 },
  { kind: "none" },
  { kind: "tape", variant: "plaid", corner: "tl", rotate: -4 },
  { kind: "bow", corner: "tl", rotate: -9 },
  { kind: "tape", variant: "denim", corner: "tr", rotate: 5 },
  { kind: "heart", corner: "tr", rotate: 7 },
  { kind: "tape", variant: "navy", corner: "tl", rotate: 3 },
];

const CORNER_CLASS = { tl: "-top-3 -left-2", tr: "-top-3 -right-2" };

const TILT_PLAN = [-9, 7, -4, 12, -13, 3, -7, 10, -2, 8];
const LIFT_PLAN = [-8, 14, -16, 4, -4, 10, -12, 2, -10, 6];

function PhotoThumb({ photos, index }: { photos: (string | null)[]; index: number }) {
  const decor = DECOR_PLAN[index % DECOR_PLAN.length];

  return (
    <div className="relative h-40 w-44">
      <PolaroidCard
        photo={photos[0] ?? undefined}
        interactive={false}
        rotate={0}
        className="absolute left-1/2 top-0 w-44 -translate-x-1/2"
      />
      {decor.kind === "tape" && (
        <WashiTape
          className={`z-20 ${CORNER_CLASS[decor.corner]}`}
          rotate={decor.rotate}
          variant={decor.variant}
        />
      )}
      {decor.kind === "bow" && (
        <BowSticker className={`z-20 ${CORNER_CLASS[decor.corner]}`} rotate={decor.rotate} size={52} />
      )}
      {decor.kind === "heart" && (
        <HeartPatchSticker
          className={`z-20 ${CORNER_CLASS[decor.corner]}`}
          rotate={decor.rotate}
          size={44}
        />
      )}
    </div>
  );
}

function LightboxMedia({ src }: { src: string }) {
  if (VIDEO_EXT.test(src)) {
    return (
      <video
        src={src}
        controls
        playsInline
        className="max-h-[55vh] w-full rounded-lg bg-black object-contain"
      />
    );
  }
  return <img src={src} alt="" className="max-h-[55vh] w-full rounded-lg object-contain" />;
}

export function Timeline({ onNext }: { onNext: () => void }) {
  const [selected, setSelected] = useState<TimelineEntry | null>(null);
  const [mediaIndex, setMediaIndex] = useState(0);
  const [addOpen, setAddOpen] = useState(false);
  const [added, setAdded] = useState<GalleryItem[]>([]);
  const [curated, setCurated] = useState<ContentItem[]>([]);

  useEffect(() => {
    fetchGalleryItems("timeline").then(setAdded);
    fetchContentItems("timeline").then(setCurated);
  }, []);

  const items = [...curated.map(fromContentItem), ...added.map(toTimelineEntry)];

  function openItem(item: TimelineEntry) {
    setSelected(item);
    setMediaIndex(0);
  }

  const photos = selected?.photos.filter((p): p is string => !!p) ?? [];
  const hasMultiple = photos.length > 1;

  return (
    <SectionShell full>
      <h2 className="font-hand text-5xl text-rose-deep">Our firsts ...</h2>

      <div className="mt-10 grid w-full grid-cols-2 place-items-center gap-x-4 gap-y-14 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {items.map((item, i) => {
          const rotate = TILT_PLAN[i % TILT_PLAN.length];
          const offsetY = LIFT_PLAN[i % LIFT_PLAN.length];
          return (
            <button
              key={i}
              type="button"
              onClick={() => openItem(item)}
              className="flex flex-col items-center gap-2"
              style={{ transform: `rotate(${rotate}deg) translateY(${offsetY}px)` }}
            >
              <PhotoThumb photos={item.photos} index={i} />
              <span className="font-hand text-base text-ink-soft">{item.date}</span>
            </button>
          );
        })}
        <button
          type="button"
          onClick={() => setAddOpen(true)}
          className="flex h-40 w-44 flex-col items-center justify-center gap-2 rounded-sm border-2 border-dashed border-rose/30 text-sm text-ink-soft/60 transition-colors hover:border-rose-deep/40 hover:text-rose-deep"
        >
          <span className="text-2xl leading-none">+</span>
          add a memory
        </button>
      </div>

      <AddModal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        section="timeline"
        variant="timeline"
        onAdded={(item) => setAdded((prev) => [...prev, item])}
      />

      <Modal open={!!selected} onClose={() => setSelected(null)}>
        {selected && (
          <>
            {photos.length > 0 ? (
              <div className="relative">
                <LightboxMedia src={photos[mediaIndex]} />
                {hasMultiple && (
                  <>
                    <button
                      type="button"
                      aria-label="previous photo"
                      onClick={() =>
                        setMediaIndex((n) => (n - 1 + photos.length) % photos.length)
                      }
                      className="absolute left-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-paper/90 text-rose-deep shadow-sm"
                    >
                      ‹
                    </button>
                    <button
                      type="button"
                      aria-label="next photo"
                      onClick={() => setMediaIndex((n) => (n + 1) % photos.length)}
                      className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-paper/90 text-rose-deep shadow-sm"
                    >
                      ›
                    </button>
                    <div className="mt-2 flex justify-center gap-1.5">
                      {photos.map((_, i) => (
                        <span
                          key={i}
                          className={`h-1.5 w-1.5 rounded-full ${
                            i === mediaIndex ? "bg-rose-deep" : "bg-rose/25"
                          }`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="flex h-40 items-center justify-center rounded-lg border border-dashed border-rose/25 text-sm text-ink-soft/60">
                + add a photo
              </div>
            )}

            <p className="mt-4 font-sans text-xs uppercase tracking-wide text-rose-deep/80">
              {selected.date}
            </p>
            <p className="mt-1 font-serif text-xl text-ink">{selected.title}</p>
            <p className="mt-3 font-serif text-base italic leading-relaxed text-ink-soft">
              {selected.caption}
            </p>
          </>
        )}
      </Modal>

      <ContinueButton onClick={onNext}>continue →</ContinueButton>
    </SectionShell>
  );
}
