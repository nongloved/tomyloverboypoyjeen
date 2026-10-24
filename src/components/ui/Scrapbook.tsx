// Scrapbook decoration stickers: PaperGrain, FlowerSticker, PaperTag,
// PhotoboothFrame, PolaroidFrame, PolaroidVariantCard, BlankFrameSticker,
// PolaroidCard, WashiTape, BowSticker, Pushpin, PaperclipSticker,
// PushpinPhoto, SafetyPinPhoto, TornPaperCorner, IconSticker,
// LetterNoteButton, PatchNoteButton, PenguinSticker, GymAnimalSticker,
// NotePaperSticker, HeartPatchSticker. Also exports VIDEO_EXT.

import type { CSSProperties } from "react";
import flowerBlue from "../../assets/decorations/flower-blue.png";
import framePhotobooth from "../../assets/decorations/frame-photobooth.png";
import framePolaroid from "../../assets/decorations/frame-polaroid.png";
import frameBlankPolaroid from "../../assets/decorations/frame-blank-polaroid.png";
import tapeNavy from "../../assets/decorations/tape-navy.png";
import tapeDenim from "../../assets/decorations/tape-denim.png";
import tapeGingham from "../../assets/decorations/tape-gingham.png";
import tapePlaid from "../../assets/decorations/tape-plaid.png";
import bowImg from "../../assets/decorations/bow.png";
import heartPatchImg from "../../assets/decorations/heart-patch.png";
import letterNoteImg from "../../assets/decorations/letter-note.png";
import paperclipImg from "../../assets/decorations/paperclip.png";
import tornNavyA from "../../assets/decorations/torn-navy-a.png";
import tornNavyB from "../../assets/decorations/torn-navy-b.png";
import tornGingham from "../../assets/decorations/torn-gingham.png";
import tornStripe from "../../assets/decorations/torn-stripe.png";
import evilEyeImg from "../../assets/decorations/evil-eye.png";
import shellImg from "../../assets/decorations/shell.png";
import starfishImg from "../../assets/decorations/starfish.png";
import buttonNavyImg from "../../assets/decorations/button-navy.png";
import teddyBearImg from "../../assets/decorations/teddy-bear.png";
import glossyHeartImg from "../../assets/decorations/glossy-heart.png";
import framePolaroidHeart from "../../assets/decorations/frame-polaroid-heart.png";
import framePolaroidSea from "../../assets/decorations/frame-polaroid-sea.png";
import framePolaroidDouble from "../../assets/decorations/frame-polaroid-double.png";
import framePolaroidLoveU from "../../assets/decorations/frame-loveu-polaroid.png";
import framePolaroidKiss from "../../assets/decorations/frame-kiss-polaroid.png";
import patchExclaimImg from "../../assets/decorations/patch-exclaim.png";
import patchQuestionImg from "../../assets/decorations/patch-question.png";
import patchOmgImg from "../../assets/decorations/patch-omg.png";
import patchStarGinghamImg from "../../assets/decorations/patch-star-gingham.png";
import patchStarGoldImg from "../../assets/decorations/patch-star-gold.png";
import patchButtonImg from "../../assets/decorations/patch-button.png";
import pinguSnowballImg from "../../assets/decorations/pingu-snowball.png";
import pinguWaveImg from "../../assets/decorations/pingu-wave.png";
import pinguReadbookImg from "../../assets/decorations/pingu-readbook.png";
import pinguHugImg from "../../assets/decorations/pingu-hug.png";
import noteDenimImg from "../../assets/decorations/note-denim.png";
import noteGinghamImg from "../../assets/decorations/note-gingham.png";
import clipMintImg from "../../assets/decorations/clip-mint.png";
import clipSilverImg from "../../assets/decorations/clip-silver.png";
import pushpinBlueImg from "../../assets/decorations/pushpin-blue.png";
import pushpinPaleblueImg from "../../assets/decorations/pushpin-paleblue.png";
import pushpinMintImg from "../../assets/decorations/pushpin-mint.png";
import safetypinPearlImg from "../../assets/decorations/safetypin-pearl.png";
import gymKittenImg from "../../assets/decorations/gym-kitten.png";
import gymCatflexImg from "../../assets/decorations/gym-catflex.png";
import gymDogImg from "../../assets/decorations/gym-dog.png";

export function PaperGrain({ opacity = 0.05 }: { opacity?: number }) {
  return (
    <div
      className="pointer-events-none absolute inset-0"
      style={{
        opacity,
        mixBlendMode: "multiply",
        backgroundImage:
          "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='120' height='120'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>\")",
      }}
    />
  );
}

export function FlowerSticker({
  className = "",
  rotate = -12,
  size = 64,
  src = flowerBlue,
}: {
  className?: string;
  rotate?: number;
  size?: number;
  src?: string;
}) {
  return (
    <img
      src={src}
      alt=""
      aria-hidden
      draggable={false}
      className={`pointer-events-none absolute select-none ${className}`}
      style={{
        width: size,
        height: "auto",
        transform: `rotate(${rotate}deg)`,
        filter: "drop-shadow(0 10px 12px rgba(0,0,0,0.35))",
      }}
    />
  );
}

export function PaperTag({
  text,
  className = "",
  rotate = -8,
}: {
  text: string;
  className?: string;
  rotate?: number;
}) {
  return (
    <span
      aria-hidden
      className={`pointer-events-none absolute select-none whitespace-nowrap rounded-[2px] bg-paper px-3 py-1.5 font-serif text-xs italic text-ink-soft shadow-[0_8px_16px_rgba(0,0,0,0.4)] ${className}`}
      style={{ transform: `rotate(${rotate}deg)` }}
    >
      {text}
    </span>
  );
}

type FrameWindow = { left: number; top: number; width: number; height: number };

export const VIDEO_EXT = /\.(mp4|webm|mov|m4v)$/i;

function FrameWindowTile({ win, photoSrc }: { win: FrameWindow; photoSrc?: string }) {
  return (
    <div
      className="absolute flex items-center justify-center overflow-hidden bg-ivory-deep text-[9px] text-ink-soft/50"
      style={{
        left: `${win.left}%`,
        top: `${win.top}%`,
        width: `${win.width}%`,
        height: `${win.height}%`,
      }}
    >
      {photoSrc ? (
        VIDEO_EXT.test(photoSrc) ? (
          <video
            src={photoSrc}
            autoPlay
            muted
            loop
            playsInline
            className="h-full w-full object-cover"
          />
        ) : (
          <img src={photoSrc} alt="" className="h-full w-full object-cover" />
        )
      ) : (
        "+"
      )}
    </div>
  );
}

const PHOTOBOOTH_WINDOWS: FrameWindow[] = [
  { left: 10.86, top: 3.29, width: 79.51, height: 26.81 },
  { left: 10.66, top: 33.4, width: 79.51, height: 26.81 },
  { left: 10.45, top: 64.31, width: 79.51, height: 26.88 },
];

export function PhotoboothFrame({
  className = "",
  rotate = 8,
  width = 92,
  photos = [],
}: {
  className?: string;
  rotate?: number;
  width?: number;
  photos?: (string | undefined)[];
}) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute select-none ${className}`}
      style={{ width, transform: `rotate(${rotate}deg)` }}
    >
      <div className="relative" style={{ filter: "drop-shadow(0 14px 22px rgba(0,0,0,0.3))" }}>
        {PHOTOBOOTH_WINDOWS.map((win, i) => (
          <FrameWindowTile key={i} win={win} photoSrc={photos[i]} />
        ))}
        <img src={framePhotobooth} alt="" draggable={false} className="relative block w-full" />
      </div>
    </div>
  );
}

const POLAROID_WINDOW: FrameWindow = { left: 7, top: 11.81, width: 86.52, height: 67.51 };

export function PolaroidFrame({
  className = "",
  rotate = -6,
  width = 118,
  photo,
}: {
  className?: string;
  rotate?: number;
  width?: number;
  photo?: string;
}) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute select-none ${className}`}
      style={{ width, transform: `rotate(${rotate}deg)` }}
    >
      <div className="relative" style={{ filter: "drop-shadow(0 12px 18px rgba(0,0,0,0.3))" }}>
        <FrameWindowTile win={POLAROID_WINDOW} photoSrc={photo} />
        <img src={framePolaroid} alt="" draggable={false} className="relative block w-full" />
      </div>
    </div>
  );
}

// window percentages are hand-measured per source photo, not interchangeable
const POLAROID_VARIANTS = {
  heart: { src: framePolaroidHeart, windows: [{ left: 6.7, top: 6.1, width: 84.2, height: 72 }] },
  sea: { src: framePolaroidSea, windows: [{ left: 16.9, top: 19.3, width: 66.6, height: 60 }] },
  double: {
    src: framePolaroidDouble,
    windows: [
      { left: 7.6, top: 0, width: 83.3, height: 49.9 },
      { left: 7.6, top: 50, width: 84.1, height: 37.7 },
    ],
  },
  loveU: { src: framePolaroidLoveU, windows: [{ left: 7.77, top: 6.9, width: 84.2, height: 73.08 }] },
  kiss: { src: framePolaroidKiss, windows: [{ left: 6.93, top: 5.9, width: 84.09, height: 72.31 }] },
} satisfies Record<string, { src: string; windows: FrameWindow[] }>;

export function PolaroidVariantCard({
  className = "",
  rotate = 0,
  width = 118,
  variant,
  photos = [],
}: {
  className?: string;
  rotate?: number;
  width?: number;
  variant: keyof typeof POLAROID_VARIANTS;
  photos?: (string | undefined)[];
}) {
  const { src, windows } = POLAROID_VARIANTS[variant];
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute select-none ${className}`}
      style={{ width, transform: `rotate(${rotate}deg)` }}
    >
      <div className="relative" style={{ filter: "drop-shadow(0 12px 18px rgba(0,0,0,0.3))" }}>
        {windows.map((win, i) => (
          <FrameWindowTile key={i} win={win} photoSrc={photos[i]} />
        ))}
        <img src={src} alt="" draggable={false} className="relative block w-full" />
      </div>
    </div>
  );
}

const BLANK_FRAME_WINDOW: FrameWindow = { left: 10.09, top: 9.92, width: 78.76, height: 68.35 };

export function BlankFrameSticker({
  className = "",
  rotate = 0,
  width = 120,
  flipV = false,
  flipH = false,
  photo,
}: {
  className?: string;
  rotate?: number;
  width?: number;
  flipV?: boolean;
  flipH?: boolean;
  photo?: string;
}) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute select-none ${className}`}
      style={{
        width,
        transform: `rotate(${rotate}deg)${flipV ? " scaleY(-1)" : ""}${flipH ? " scaleX(-1)" : ""}`,
      }}
    >
      <div className="relative" style={{ filter: "drop-shadow(0 10px 16px rgba(0,0,0,0.28))" }}>
        <FrameWindowTile win={BLANK_FRAME_WINDOW} photoSrc={photo} />
        <img src={frameBlankPolaroid} alt="" draggable={false} className="relative block w-full" />
      </div>
    </div>
  );
}

// in-flow (not absolute) tappable polaroid; pass interactive={false} when
// nesting several inside one outer <button>
export function PolaroidCard({
  photo,
  rotate = 0,
  onClick,
  className = "",
  interactive = true,
}: {
  photo?: string;
  rotate?: number;
  onClick?: () => void;
  className?: string;
  interactive?: boolean;
}) {
  const inner = (
    <div className="relative" style={{ filter: "drop-shadow(0 10px 16px rgba(0,0,0,0.28))" }}>
      <FrameWindowTile win={POLAROID_WINDOW} photoSrc={photo} />
      <img src={framePolaroid} alt="" draggable={false} className="relative block w-full" />
    </div>
  );

  if (!interactive) {
    return (
      <div className={`block select-none ${className}`} style={{ transform: `rotate(${rotate}deg)` }}>
        {inner}
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="open photo"
      className={`relative block select-none ${className}`}
      style={{ transform: `rotate(${rotate}deg)` }}
    >
      {inner}
    </button>
  );
}

const TAPE_VARIANTS = {
  navy: tapeNavy,
  denim: tapeDenim,
  gingham: tapeGingham,
  plaid: tapePlaid,
};

export function WashiTape({
  className = "",
  variant = "navy",
  rotate = -6,
  width = 72,
}: {
  className?: string;
  variant?: keyof typeof TAPE_VARIANTS;
  rotate?: number;
  width?: number;
}) {
  return (
    <img
      src={TAPE_VARIANTS[variant]}
      alt=""
      aria-hidden
      draggable={false}
      className={`pointer-events-none absolute select-none ${className}`}
      style={{
        width,
        height: "auto",
        transform: `rotate(${rotate}deg)`,
        filter: "drop-shadow(0 2px 3px rgba(0,0,0,0.2))",
      }}
    />
  );
}

export function BowSticker({
  className = "",
  rotate = 0,
  size = 72,
}: {
  className?: string;
  rotate?: number;
  size?: number;
}) {
  return (
    <img
      src={bowImg}
      alt=""
      aria-hidden
      draggable={false}
      className={`pointer-events-none absolute select-none ${className}`}
      style={{
        width: size,
        height: "auto",
        transform: `rotate(${rotate}deg)`,
        filter: "drop-shadow(0 6px 8px rgba(0,0,0,0.25))",
      }}
    />
  );
}

// anchors to the parent's top-center; parent needs `relative`
export function Pushpin({
  className = "",
  color = "var(--color-rose-deep)",
}: {
  className?: string;
  color?: string;
}) {
  return (
    <span
      aria-hidden
      className={`pointer-events-none absolute left-1/2 top-0 z-30 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full shadow-[0_2px_3px_rgba(0,0,0,0.35)] ${className}`}
      style={{
        background: `radial-gradient(circle at 35% 30%, rgba(255,255,255,0.85), transparent 45%), ${color}`,
      }}
    />
  );
}

const CLIP_VARIANTS = {
  navy: { src: paperclipImg, flatAspect: 346 / 182, rotated: true },
  mint: { src: clipMintImg, flatAspect: 343 / 408, rotated: false },
  silver: { src: clipSilverImg, flatAspect: 689 / 576, rotated: false },
};

export function PaperclipSticker({
  className = "",
  variant = "navy",
  width = 64,
  bite = 0.3,
  left = "50%",
}: {
  className?: string;
  variant?: keyof typeof CLIP_VARIANTS;
  width?: number;
  bite?: number;
  left?: number | string;
}) {
  const { src, flatAspect, rotated } = CLIP_VARIANTS[variant];
  const height = width / flatAspect;
  // rotated variants: pre-rotation width becomes post-rotation height
  const imgWidth = rotated ? height : width;

  return (
    <span
      aria-hidden
      className={`pointer-events-none absolute select-none ${className}`}
      style={{
        left,
        top: 0,
        width,
        height,
        transform: `translate(-50%, ${-(1 - bite) * 100}%)`,
      }}
    >
      <img
        src={src}
        alt=""
        draggable={false}
        className="absolute left-1/2 top-1/2"
        style={{
          width: imgWidth,
          height: "auto",
          transform: `translate(-50%, -50%)${rotated ? " rotate(-90deg)" : ""}`,
          filter: "drop-shadow(0 4px 5px rgba(0,0,0,0.3))",
        }}
      />
    </span>
  );
}

const PUSHPIN_PHOTO_VARIANTS = {
  blue: pushpinBlueImg,
  paleblue: pushpinPaleblueImg,
  mint: pushpinMintImg,
};

export function PushpinPhoto({
  className = "",
  variant,
  rotate = 0,
  size = 30,
  left = "50%",
  top = 0,
  flipV = false,
}: {
  className?: string;
  variant: keyof typeof PUSHPIN_PHOTO_VARIANTS;
  rotate?: number;
  size?: number;
  left?: number | string;
  top?: number | string;
  flipV?: boolean;
}) {
  return (
    <img
      src={PUSHPIN_PHOTO_VARIANTS[variant]}
      alt=""
      aria-hidden
      draggable={false}
      className={`pointer-events-none absolute z-30 select-none ${className}`}
      style={{
        left,
        top,
        width: size,
        height: "auto",
        transform: `translate(-50%, -50%) rotate(${rotate}deg)${flipV ? " scaleY(-1)" : ""}`,
        filter: "drop-shadow(0 3px 4px rgba(0,0,0,0.3))",
      }}
    />
  );
}

export function SafetyPinPhoto({
  className = "",
  rotate = 0,
  size = 36,
  left = "50%",
  top = 0,
}: {
  className?: string;
  rotate?: number;
  size?: number;
  left?: number | string;
  top?: number | string;
}) {
  return (
    <img
      src={safetypinPearlImg}
      alt=""
      aria-hidden
      draggable={false}
      className={`pointer-events-none absolute z-30 select-none ${className}`}
      style={{
        left,
        top,
        width: size,
        height: "auto",
        transform: `translate(-50%, -50%) rotate(${rotate}deg)`,
        filter: "drop-shadow(0 3px 4px rgba(0,0,0,0.3))",
      }}
    />
  );
}

const TORN_PAPER_VARIANTS = {
  navyA: tornNavyA,
  navyB: tornNavyB,
  gingham: tornGingham,
  stripe: tornStripe,
};

export function TornPaperCorner({
  className = "",
  variant = "navyA",
  rotate = 0,
  width = 90,
}: {
  className?: string;
  variant?: keyof typeof TORN_PAPER_VARIANTS;
  rotate?: number;
  width?: number;
}) {
  return (
    <img
      src={TORN_PAPER_VARIANTS[variant]}
      alt=""
      aria-hidden
      draggable={false}
      className={`pointer-events-none absolute select-none ${className}`}
      style={{
        width,
        height: "auto",
        transform: `rotate(${rotate}deg)`,
        filter: "drop-shadow(0 6px 8px rgba(0,0,0,0.25))",
      }}
    />
  );
}

const ICON_VARIANTS = {
  evilEye: evilEyeImg,
  shell: shellImg,
  starfish: starfishImg,
  buttonNavy: buttonNavyImg,
  teddyBear: teddyBearImg,
  glossyHeart: glossyHeartImg,
};

export function IconSticker({
  className = "",
  variant,
  rotate = 0,
  size = 48,
}: {
  className?: string;
  variant: keyof typeof ICON_VARIANTS;
  rotate?: number;
  size?: number;
}) {
  return (
    <img
      src={ICON_VARIANTS[variant]}
      alt=""
      aria-hidden
      draggable={false}
      className={`pointer-events-none absolute select-none ${className}`}
      style={{
        width: size,
        height: "auto",
        transform: `rotate(${rotate}deg)`,
        filter: "drop-shadow(0 4px 6px rgba(0,0,0,0.25))",
      }}
    />
  );
}

const NOTE_MATERIALS = {
  letter: letterNoteImg,
  navyA: tornNavyA,
  navyB: tornNavyB,
  gingham: tornGingham,
  stripe: tornStripe,
};

export function LetterNoteButton({
  className = "",
  rotate = 0,
  onClick,
  style = {},
  objectPosition = "50% 50%",
  material = "letter",
}: {
  className?: string;
  rotate?: number;
  onClick?: () => void;
  style?: CSSProperties;
  objectPosition?: string;
  material?: keyof typeof NOTE_MATERIALS;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="open note"
      className={`block overflow-hidden rounded-[3px] select-none ${className}`}
      style={{
        ...style,
        transform: `${style.transform ?? ""} rotate(${rotate}deg)`,
        filter: "drop-shadow(0 3px 5px rgba(0,0,0,0.3))",
      }}
    >
      <img
        src={NOTE_MATERIALS[material]}
        alt=""
        draggable={false}
        className="h-full w-full object-cover"
        style={{ objectPosition }}
      />
    </button>
  );
}

const PATCH_MATERIALS = {
  exclaim: patchExclaimImg,
  question: patchQuestionImg,
  omg: patchOmgImg,
  starGingham: patchStarGinghamImg,
  starGold: patchStarGoldImg,
  button: patchButtonImg,
};

export function PatchNoteButton({
  className = "",
  rotate = 0,
  onClick,
  style = {},
  material,
}: {
  className?: string;
  rotate?: number;
  onClick?: () => void;
  style?: CSSProperties;
  material: keyof typeof PATCH_MATERIALS;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="open note"
      className={`block select-none ${className}`}
      style={{
        ...style,
        transform: `${style.transform ?? ""} rotate(${rotate}deg)`,
        filter: "drop-shadow(0 3px 5px rgba(0,0,0,0.3))",
      }}
    >
      <img
        src={PATCH_MATERIALS[material]}
        alt=""
        draggable={false}
        className="h-full w-full object-contain"
      />
    </button>
  );
}

const PENGUIN_VARIANTS = {
  snowball: pinguSnowballImg,
  wave: pinguWaveImg,
  readbook: pinguReadbookImg,
  hug: pinguHugImg,
};

export function PenguinSticker({
  className = "",
  variant,
  rotate = 0,
  size = 56,
}: {
  className?: string;
  variant: keyof typeof PENGUIN_VARIANTS;
  rotate?: number;
  size?: number;
}) {
  return (
    <img
      src={PENGUIN_VARIANTS[variant]}
      alt=""
      aria-hidden
      draggable={false}
      className={`pointer-events-none absolute select-none ${className}`}
      style={{
        width: size,
        height: "auto",
        transform: `rotate(${rotate}deg)`,
        filter: "drop-shadow(0 6px 8px rgba(0,0,0,0.25))",
      }}
    />
  );
}

const GYM_ANIMAL_VARIANTS = {
  kitten: gymKittenImg,
  catflex: gymCatflexImg,
  dog: gymDogImg,
};

export function GymAnimalSticker({
  className = "",
  variant,
  rotate = 0,
  size = 56,
}: {
  className?: string;
  variant: keyof typeof GYM_ANIMAL_VARIANTS;
  rotate?: number;
  size?: number;
}) {
  return (
    <img
      src={GYM_ANIMAL_VARIANTS[variant]}
      alt=""
      aria-hidden
      draggable={false}
      className={`pointer-events-none absolute select-none ${className}`}
      style={{
        width: size,
        height: "auto",
        transform: `rotate(${rotate}deg)`,
        filter: "drop-shadow(0 6px 8px rgba(0,0,0,0.25))",
      }}
    />
  );
}

const NOTEPAPER_VARIANTS = {
  denim: noteDenimImg,
  gingham: noteGinghamImg,
};

export function NotePaperSticker({
  className = "",
  variant,
  rotate = 0,
  size = 72,
}: {
  className?: string;
  variant: keyof typeof NOTEPAPER_VARIANTS;
  rotate?: number;
  size?: number;
}) {
  return (
    <img
      src={NOTEPAPER_VARIANTS[variant]}
      alt=""
      aria-hidden
      draggable={false}
      className={`pointer-events-none absolute select-none ${className}`}
      style={{
        width: size,
        height: "auto",
        transform: `rotate(${rotate}deg)`,
        filter: "drop-shadow(0 6px 10px rgba(0,0,0,0.3))",
      }}
    />
  );
}

export function HeartPatchSticker({
  className = "",
  rotate = 0,
  size = 64,
}: {
  className?: string;
  rotate?: number;
  size?: number;
}) {
  return (
    <img
      src={heartPatchImg}
      alt=""
      aria-hidden
      draggable={false}
      className={`pointer-events-none absolute select-none ${className}`}
      style={{
        width: size,
        height: "auto",
        transform: `rotate(${rotate}deg)`,
        filter: "drop-shadow(0 6px 8px rgba(0,0,0,0.25))",
      }}
    />
  );
}
