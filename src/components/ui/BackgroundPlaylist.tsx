// Always-on Spotify playlist bar docked to the bottom of the page. Exports BackgroundPlaylist.
import { relationshipData } from "../../data/relationship";

function playlistEmbedSrc(url: string): string | null {
  const match = url.match(/open\.spotify\.com\/playlist\/([a-zA-Z0-9]+)/);
  if (!match) return null;
  return `https://open.spotify.com/embed/playlist/${match[1]}?utm_source=generator&theme=0`;
}

export function BackgroundPlaylist() {
  const src = playlistEmbedSrc(relationshipData.backgroundPlaylistUrl);
  if (!src) return null;

  return (
    <div className="fixed bottom-3 right-3 z-50" style={{ width: "min(360px, calc(100vw - 24px))" }}>
      <iframe
        title="background playlist"
        src={src}
        height={80}
        width="100%"
        style={{ borderRadius: 12, border: "none", display: "block" }}
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        loading="lazy"
      />
    </div>
  );
}
