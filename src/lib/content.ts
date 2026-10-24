// DB-backed curated content (photos/videos/songs/poster), separate from
// gallery_items/board_items (which back the "+" add buttons).
// Exports: ContentSection, ContentItem, fetchContentItems, prefetchAllContent.
import { supabase } from "./supabase";

export type ContentSection = "timeline" | "sillyUs" | "favoritePhotosOfYou" | "songs" | "watched";

export type ContentItem = {
  id: string;
  section: ContentSection;
  media_urls: string[];
  media_type: "image" | "video";
  caption: string | null;
  date_label: string | null;
  title_label: string | null;
  role: string | null;
  artist: string | null;
  note: string | null;
  link_url: string | null;
  sort_order: number;
  created_at: string;
};

const TABLE = "content_items";
const ALL_SECTIONS: ContentSection[] = ["timeline", "sillyUs", "favoritePhotosOfYou", "songs", "watched"];

// keyed by section so repeated calls share one in-flight/resolved request
const cache = new Map<ContentSection, Promise<ContentItem[]>>();

export function fetchContentItems(section: ContentSection): Promise<ContentItem[]> {
  if (!supabase) return Promise.resolve([]);
  const cached = cache.get(section);
  if (cached) return cached;

  const promise = Promise.resolve(
    supabase
      .from(TABLE)
      .select("*")
      .eq("section", section)
      .order("sort_order", { ascending: true })
  ).then(({ data, error }) => {
    if (error) {
      console.error("fetchContentItems failed", error);
      cache.delete(section); // let a later call retry instead of caching the failure
      return [];
    }
    return data ?? [];
  });

  cache.set(section, promise);
  return promise;
}

// warms the browser's image cache ahead of time
function prefetchMedia(items: ContentItem[]) {
  for (const item of items) {
    if (item.media_type !== "image") continue;
    for (const url of item.media_urls) {
      const img = new Image();
      img.src = url;
    }
  }
}

export function prefetchAllContent() {
  for (const section of ALL_SECTIONS) {
    fetchContentItems(section).then(prefetchMedia);
  }
}
