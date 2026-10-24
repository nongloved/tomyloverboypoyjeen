// "♡ 03 / 14" top progress bar with prev/next arrows. Exports ProgressIndicator.
export function ProgressIndicator({
  index,
  total,
  onPrev,
  onNext,
  canGoBack,
  canGoForward,
}: {
  index: number;
  total: number;
  onPrev: () => void;
  onNext: () => void;
  canGoBack: boolean;
  canGoForward: boolean;
}) {
  return (
    <div className="fixed top-5 left-1/2 z-40 flex -translate-x-1/2 select-none items-center gap-3 font-sans text-xs tracking-widest text-ink-soft/70">
      <button
        type="button"
        onClick={onPrev}
        disabled={!canGoBack}
        aria-label="previous part"
        className="px-1 text-ink-soft/50 transition-colors hover:text-rose-deep disabled:pointer-events-none disabled:opacity-20"
      >
        ‹
      </button>
      <span>
        ♡ {String(index).padStart(2, "0")} / {String(total).padStart(2, "0")}
      </span>
      <button
        type="button"
        onClick={onNext}
        disabled={!canGoForward}
        aria-label="next part"
        className="px-1 text-ink-soft/50 transition-colors hover:text-rose-deep disabled:pointer-events-none disabled:opacity-20"
      >
        ›
      </button>
    </div>
  );
}
