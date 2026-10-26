// "Little reminders of you" pin board: hand-placed cork-board cards plus a
// viewer-addable strip. Exports MemoryJar.
import { useEffect, useMemo, useState, type CSSProperties } from "react";
import { SectionShell } from "./ui/SectionShell";
import { ContinueButton } from "./ui/ContinueButton";
import { Modal } from "./ui/Modal";
import { AddBoardItemModal } from "./ui/AddBoardItemModal";
import { fetchBoardItems, type BoardItem } from "../lib/board";
import {
  BlankFrameSticker,
  BowSticker,
  GymAnimalSticker,
  HeartPatchSticker,
  IconSticker,
  PaperclipSticker,
  PatchNoteButton,
  PenguinSticker,
  PolaroidCard,
  PolaroidVariantCard,
  PushpinPhoto,
  SafetyPinPhoto,
  TornPaperCorner,
  WashiTape,
} from "./ui/Scrapbook";
import { relationshipData, type Song, type WatchedItem } from "../data/relationship";
import { fetchContentItems, type ContentItem } from "../lib/content";
import reminder02 from "../assets/reminder/optimized/02.jpg";
import reminder04 from "../assets/reminder/optimized/04.jpg";
import reminder05 from "../assets/reminder/optimized/05.jpg";
import reminder07 from "../assets/reminder/optimized/07.mp4";
import reminder08 from "../assets/reminder/optimized/08.jpg";

const WEEKDAY_LABELS = ["S", "M", "T", "W", "T", "F", "S"];

function buildCalendar(officialDateStr: string) {
  const official = new Date(`${officialDateStr}T00:00:00`);
  const now = new Date();
  const anniversaryDay = official.getDate();

  let months = (now.getFullYear() - official.getFullYear()) * 12 + (now.getMonth() - official.getMonth());
  if (now.getDate() < anniversaryDay) months -= 1;
  months = Math.max(months, 0);

  const year = now.getFullYear();
  const month = now.getMonth();
  const startWeekday = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const monthLabel = now.toLocaleDateString("en-US", { month: "long", year: "numeric" });

  const cells: (number | null)[] = [
    ...Array(startWeekday).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  return { months, monthLabel, anniversaryDay, cells };
}

// hand-picked scatter positions for the note cards, kept in the lower band
const NOTE_PLAN = [
  { left: 58, top: 48, rotate: 9 },
  { left: 68, top: 72, rotate: -8 },
  { left: 60, top: 80, rotate: 6 },
  { left: 34, top: 78, rotate: -10 },
  { left: 45, top: 82, rotate: 7 },
  { left: 72, top: 85, rotate: -6 },
];

const NOTE_MATERIALS = ["exclaim", "starGold", "omg", "question", "starGingham", "button"] as const;

const CORK_STYLE: CSSProperties = {
  backgroundColor: "var(--color-beige)",
  backgroundImage:
    "radial-gradient(circle, rgba(74,40,10,0.14) 1px, transparent 1.4px), radial-gradient(circle, rgba(74,40,10,0.09) 1px, transparent 1.4px)",
  backgroundSize: "9px 9px, 13px 13px",
  backgroundPosition: "0 0, 4px 6px",
};

// deterministic pseudo-random hash, so added-item styling stays stable
// across re-renders instead of jittering on every paint
function hashString(s: string) {
  let hash = 0;
  for (let i = 0; i < s.length; i++) hash = (hash * 31 + s.charCodeAt(i)) % 100000;
  return hash;
}

const BOARD_ITEM_DECOR: ((className: string) => import("react").ReactNode)[] = [
  (cn) => <WashiTape className={cn} variant="navy" rotate={-8} width={32} />,
  (cn) => <WashiTape className={cn} variant="gingham" rotate={10} width={32} />,
  (cn) => <WashiTape className={cn} variant="denim" rotate={-6} width={32} />,
  (cn) => <WashiTape className={cn} variant="plaid" rotate={7} width={32} />,
  (cn) => <BowSticker className={cn} rotate={-6} size={28} />,
  (cn) => <HeartPatchSticker className={cn} rotate={8} size={24} />,
  (cn) => <IconSticker variant="glossyHeart" className={cn} rotate={-6} size={20} />,
  (cn) => <IconSticker variant="starfish" className={cn} rotate={10} size={22} />,
  (cn) => <IconSticker variant="buttonNavy" className={cn} rotate={6} size={18} />,
  (cn) => <PenguinSticker variant="snowball" className={cn} rotate={-6} size={24} />,
  (cn) => <GymAnimalSticker variant="catflex" className={cn} rotate={8} size={26} />,
];

const BOARD_ITEM_CORNERS = ["-top-2 -left-2 z-20", "-top-2 -right-2 z-20"];

// random-looking jitter + sticker per card, seeded off its id so a given
// item always lands the same way — kept small (±5deg, ±4px) so it can never
// overlap a neighbor in the flex-wrap flow it still lives in
function boardItemStyle(id: string) {
  const rotate = (hashString(id) % 11) - 5;
  const offsetY = (hashString(`${id}y`) % 9) - 4;
  const decor = BOARD_ITEM_DECOR[hashString(`${id}d`) % BOARD_ITEM_DECOR.length];
  const corner = BOARD_ITEM_CORNERS[hashString(`${id}c`) % BOARD_ITEM_CORNERS.length];
  return { rotate, offsetY, decor, corner };
}

function toSong(item: ContentItem): Song {
  return {
    role: item.role ?? "",
    title: item.title_label ?? "",
    artist: item.artist ?? "",
    cover: item.media_urls[0] ?? null,
    note: item.note ?? "",
    url: item.link_url ?? undefined,
  };
}

// extracts the track id from an open.spotify.com link for the embed player
function spotifyEmbedSrc(url?: string): string | null {
  if (!url) return null;
  const match = url.match(/open\.spotify\.com\/track\/([a-zA-Z0-9]+)/);
  if (!match) return null;
  return `https://open.spotify.com/embed/track/${match[1]}?utm_source=generator&theme=0`;
}

export function MemoryJar({ onNext }: { onNext: () => void }) {
  const notes = relationshipData.memoryJar;
  const [openNote, setOpenNote] = useState<number | null>(null);
  const [playingSong, setPlayingSong] = useState<Song | null>(null);
  const [boardItems, setBoardItems] = useState<BoardItem[]>([]);
  const [addOpen, setAddOpen] = useState(false);
  const [songs, setSongs] = useState<Song[]>([]);
  const [watched, setWatched] = useState<WatchedItem | null>(null);

  useEffect(() => {
    fetchBoardItems().then(setBoardItems);
    fetchContentItems("songs").then((items) => setSongs(items.map(toSong)));
    fetchContentItems("watched").then((items) => {
      const item = items[0];
      if (item) {
        setWatched({
          platform: "netflix",
          title: item.title_label ?? "",
          poster: item.media_urls[0] ?? null,
          url: item.link_url ?? "",
        });
      }
    });
  }, []);

  const song = songs[0];
  const song2 = songs[2];
  const photo1 = reminder05;
  const photo2 = reminder07;
  const photo4 = reminder02;
  const photo5 = reminder08;

  const cal = useMemo(() => buildCalendar(relationshipData.officialDate), []);
  const noteLayout = useMemo(() => NOTE_PLAN.slice(0, notes.length), [notes.length]);

  function renderBoardCard(item: BoardItem, rotate: number) {
    if (item.kind === "photo") {
      return <PolaroidCard photo={item.image_url ?? undefined} interactive={false} rotate={rotate} className="w-20" />;
    }
    if (item.kind === "song") {
      return (
        <div
          className="w-28 rounded-lg bg-paper p-1.5 shadow-md"
          style={{ transform: `rotate(${rotate}deg)` }}
        >
          <div className="flex items-center gap-1.5">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center overflow-hidden rounded bg-[#1DB954] text-xs text-paper">
              {item.image_url ? (
                <img src={item.image_url} alt="" className="h-full w-full object-cover" />
              ) : (
                "♪"
              )}
            </div>
            <div className="min-w-0">
              <p className="truncate font-sans text-[9px] font-semibold text-ink">{item.title}</p>
              <p className="truncate font-sans text-[8px] text-ink-soft">{item.subtitle}</p>
            </div>
          </div>
        </div>
      );
    }
    if (item.kind === "movie") {
      return (
        <div
          className="w-20 rounded-lg bg-paper p-1.5 shadow-md"
          style={{ transform: `rotate(${rotate}deg)` }}
        >
          {item.image_url && (
            <img src={item.image_url} alt="" className="w-full rounded object-contain" />
          )}
          {(item.title || item.message) && (
            <p className="mt-0.5 text-center font-serif text-[8px] italic leading-tight text-ink-soft">
              {item.title || item.message}
            </p>
          )}
        </div>
      );
    }
    // text
    return (
      <div
        className="w-24 rounded-md bg-paper px-2 py-1.5 text-center shadow-md"
        style={{ transform: `rotate(${rotate}deg)` }}
      >
        <p className="font-hand text-xs leading-snug text-rose-deep">{item.message}</p>
      </div>
    );
  }

  return (
    <SectionShell wide>
      <h2 className="font-serif text-3xl italic text-rose-deep">Little reminders of you</h2>
      <p className="mt-2 max-w-sm font-sans text-sm text-ink-soft">
        a little memory board of us — pin anything that reminds you of me.
      </p>

      <div
        className="relative mt-10 w-full max-w-[820px] rounded-[2rem] border-[10px] p-3 shadow-[0_18px_30px_rgba(8,32,82,0.18)]"
        style={{ borderColor: "#8b5e34b3", backgroundColor: "#6f4a2a" }}
      >
        <div className="relative aspect-[8/5] w-full overflow-visible rounded-t-[1.1rem]" style={CORK_STYLE}>
          <TornPaperCorner variant="stripe" className="-left-3 top-[40%] z-0" width={56} rotate={-6} />
          <TornPaperCorner variant="gingham" className="-right-3 -top-3 z-0" width={64} rotate={14} />
          <WashiTape className="-left-3 -top-3 z-20" variant="gingham" rotate={-10} width={68} />
          <WashiTape className="-right-3 top-[22%] z-20" variant="navy" rotate={92} width={62} />
          <BowSticker className="left-[48%] -top-5 z-20" rotate={-6} size={48} />
          <HeartPatchSticker className="left-[83%] top-[51%] z-20" rotate={10} size={40} />
          <IconSticker variant="evilEye" className="left-[97%] top-[12%] z-20" rotate={-8} size={30} />
          <IconSticker variant="teddyBear" className="left-[93%] top-[75%] z-20" rotate={-6} size={38} />
          <IconSticker variant="glossyHeart" className="left-[93%] top-[45%] z-20" rotate={8} size={26} />
          <PenguinSticker variant="wave" className="left-[96%] top-[58%] z-20" rotate={-8} size={36} />
          <PenguinSticker variant="hug" className="left-[48%] top-[44%] z-20" rotate={6} size={48} />
          <PenguinSticker variant="readbook" className="left-[97%] top-[30%] z-20" rotate={-6} size={32} />
          <PenguinSticker variant="snowball" className="left-[10%] top-[38%] z-20" rotate={10} size={34} />
          <GymAnimalSticker variant="kitten" className="left-[6%] top-[46%] z-20" rotate={6} size={50} />
          <GymAnimalSticker variant="catflex" className="left-[56%] top-[6%] z-20" rotate={-8} size={56} />
          <BlankFrameSticker
            photo={reminder04}
            className="left-[24%] top-[1%] z-10"
            rotate={-18}
            width={125}
          />
          <div
            className="absolute left-[37%] top-[8%] z-10 w-[17%] rounded-md bg-paper px-3 py-1.5 text-center shadow-md"
            style={{ transform: "rotate(-6deg)" }}
          >
            <PaperclipSticker variant="silver" width={44} className="z-30" />
            <p className="font-hand text-xs text-rose-deep">Lorem ipsum dolor sit amet, consectetur adipiscing elitsed do eiusmod tempor</p>
          </div>

          <div
            className="absolute left-[3%] top-[5%] w-[22%] rounded-md bg-paper p-2 shadow-md"
            style={{ transform: "rotate(-3deg)" }}
          >
            <PaperclipSticker className="z-30" />
            <p className="text-center font-sans text-[11px] font-semibold text-rose-deep">
              {cal.monthLabel}
            </p>
            <div className="mt-1 grid grid-cols-7 gap-y-[2px] text-center font-sans text-[7px] text-ink-soft/60">
              {WEEKDAY_LABELS.map((w, i) => (
                <span key={i}>{w}</span>
              ))}
              {cal.cells.map((d, i) => (
                <span
                  key={i}
                  className={`mx-auto flex h-3.5 w-3.5 items-center justify-center rounded-full text-[7px] ${
                    d === cal.anniversaryDay ? "bg-rose-deep text-paper" : "text-ink-soft"
                  }`}
                >
                  {d ?? ""}
                </span>
              ))}
            </div>
            <p className="mt-1 text-center font-hand text-xs text-rose-deep">
              {cal.months}-month anniversary 🎉
            </p>
          </div>

          <PolaroidVariantCard
            variant="kiss"
            photos={[photo1]}
            rotate={7}
            className="absolute left-[76%] top-[2%] w-[18%]"
          />
          <PolaroidVariantCard
            variant="loveU"
            photos={[photo2]}
            rotate={-6}
            className="absolute left-[70%] top-[37%] w-[19%]"
          />
          <PolaroidCard
            photo={photo4}
            interactive={false}
            rotate={6}
            className="absolute left-[82%] top-[79%] w-[12%]"
          />

          <PolaroidCard
            photo={photo5}
            interactive={false}
            rotate={-3}
            className="absolute left-[32%] top-[56%] w-[14%]"
          />
          <PushpinPhoto variant="blue" rotate={-6} size={28} left="39%" top="56%" />

          {song && (
            <div
              className="absolute left-[28%] top-[38%] w-[18%] rounded-lg bg-paper p-2 shadow-md"
              style={{ transform: "rotate(4deg)" }}
            >
              <PushpinPhoto variant="paleblue" rotate={5} size={30} top={0} />
              <button
                type="button"
                onClick={() => song.url && setPlayingSong(song)}
                disabled={!song.url}
                className="flex w-full items-center gap-2 text-left disabled:cursor-default"
              >
                <div className="relative flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded bg-[#1DB954] text-sm text-paper">
                  {song.cover ? (
                    <img src={song.cover} alt="" className="h-full w-full object-cover" />
                  ) : (
                    "♪"
                  )}
                  {song.url && (
                    <span className="absolute inset-0 flex items-center justify-center bg-ink/30 text-[10px] opacity-0 transition-opacity hover:opacity-100">
                      ▶
                    </span>
                  )}
                </div>
                <div className="min-w-0">
                  <p className="truncate font-sans text-[11px] font-semibold text-ink">{song.title}</p>
                  <p className="truncate font-sans text-[10px] text-ink-soft">{song.artist}</p>
                </div>
              </button>
            </div>
          )}

          {song2 && (
            <div
              className="absolute left-[58%] top-[24%] w-[16%] rounded-lg bg-paper p-2 shadow-md"
              style={{ transform: "rotate(-3deg)" }}
            >
              <PaperclipSticker variant="mint" width={30} bite={0.22} left="18%" className="z-30" />
              <button
                type="button"
                onClick={() => song2.url && setPlayingSong(song2)}
                disabled={!song2.url}
                className="flex w-full items-center gap-2 text-left disabled:cursor-default"
              >
                <div className="relative flex h-7 w-7 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#E8577E] text-xs text-paper">
                  {song2.cover ? (
                    <img src={song2.cover} alt="" className="h-full w-full object-cover" />
                  ) : (
                    "♫"
                  )}
                  {song2.url && (
                    <span className="absolute inset-0 flex items-center justify-center bg-ink/30 text-[9px] opacity-0 transition-opacity hover:opacity-100">
                      ▶
                    </span>
                  )}
                </div>
                <div className="min-w-0">
                  <p className="truncate font-sans text-[10px] font-semibold text-ink">{song2.title}</p>
                  <p className="truncate font-sans text-[9px] text-ink-soft">{song2.artist}</p>
                </div>
              </button>
            </div>
          )}

          <div
            className="absolute left-[3%] top-[56%] w-[24%] rounded-lg bg-paper p-2 shadow-md"
            style={{ transform: "rotate(-4deg)" }}
          >
            <PushpinPhoto variant="mint" rotate={-4} size={28} left="85%" top={-8} flipV />
            {watched?.poster && (
              <img
                src={watched.poster}
                alt=""
                className="w-full rounded object-contain"
              />
            )}
            <p className="mt-1 text-center font-serif text-[9px] italic leading-tight text-ink-soft">
              we gonna watch this together when we have time
            </p>
          </div>

          <div
            className="absolute left-[30%] top-[88%] w-[38%] rounded-md bg-paper px-3 py-1.5 text-center shadow-md"
            style={{ transform: "rotate(2deg)" }}
          >
            <SafetyPinPhoto rotate={80} size={40} left="14%" />
            <p className="font-hand text-[12px] leading-snug text-rose-deep">“{relationshipData.theme}”</p>
          </div>

          {notes.map((_, i) => (
            <PatchNoteButton
              key={i}
              onClick={() => setOpenNote(i)}
              rotate={noteLayout[i].rotate}
              material={NOTE_MATERIALS[i % NOTE_MATERIALS.length]}
              className="absolute h-12 w-12 z-20 transition-transform hover:scale-110"
              style={{
                left: `${noteLayout[i].left}%`,
                top: `${noteLayout[i].top}%`,
                transform: "translate(-50%, -50%)",
              }}
            />
          ))}
        </div>

        {/* viewer-added items: a second cork strip, in normal flow so it
            grows downward independent of the hand-placed layout above */}
        <div className="relative w-full rounded-b-[1.1rem] px-4 pb-8 pt-4" style={CORK_STYLE}>
          <TornPaperCorner variant="navyB" className="-right-2 -bottom-2 z-0" width={130} rotate={0} />
          <IconSticker variant="buttonNavy" className="right-14 bottom-1 z-20" rotate={12} size={22} />
          <IconSticker variant="shell" className="left-1 bottom-1 z-20" rotate={10} size={32} />
          <IconSticker variant="starfish" className="left-10 bottom-4 z-20" rotate={-14} size={22} />

          <div className="relative flex flex-wrap items-start justify-center gap-3">
            {boardItems.map((item) => {
              const { rotate, offsetY, decor, corner } = boardItemStyle(item.id);
              return (
                <div
                  key={item.id}
                  className="relative"
                  style={{ transform: `translateY(${offsetY}px)` }}
                >
                  {decor(corner)}
                  {renderBoardCard(item, rotate)}
                </div>
              );
            })}
            <button
              type="button"
              onClick={() => setAddOpen(true)}
              className="flex h-20 w-20 flex-col items-center justify-center gap-1 rounded-sm border-2 border-dashed border-rose/30 text-[10px] leading-tight text-ink-soft/60 transition-colors hover:border-rose-deep/40 hover:text-rose-deep"
            >
              <span className="text-xl leading-none">+</span>
              photo, song,
              <br />
              movie, or note
            </button>
          </div>
        </div>
      </div>

      <AddBoardItemModal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onAdded={(item) => setBoardItems((prev) => [...prev, item])}
      />

      <Modal open={openNote !== null} onClose={() => setOpenNote(null)}>
        {openNote !== null && (
          <p className="font-serif text-lg italic leading-relaxed text-ink">{notes[openNote]}</p>
        )}
      </Modal>

      <Modal open={playingSong !== null} onClose={() => setPlayingSong(null)}>
        {playingSong &&
          (spotifyEmbedSrc(playingSong.url) ? (
            <iframe
              title={playingSong.title}
              src={spotifyEmbedSrc(playingSong.url) ?? undefined}
              width="100%"
              height="152"
              style={{ borderRadius: 12, border: "none" }}
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="lazy"
            />
          ) : (
            <p className="font-serif text-base italic text-ink-soft">
              {playingSong.title} — {playingSong.artist}
            </p>
          ))}
      </Modal>

      <ContinueButton onClick={onNext}>continue →</ContinueButton>
    </SectionShell>
  );
}
