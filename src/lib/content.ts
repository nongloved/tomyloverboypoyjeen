// DB-backed curated content (photos/videos/songs/poster), separate from
// gallery_items/board_items (which back the other "+" add buttons).
// Exports: ContentSection, ContentItem, fetchContentItems, prefetchAllContent, addSongItem.
import { supabase } from "./supabase";
import { resizeImageToBlob } from "./resizeImage";

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

const BUCKET = "gallery";

export async function addSongItem(params: {
  file?: File | null;
  title: string;
  artist?: string;
  note?: string;
  url?: string;
}): Promise<ContentItem> {
  if (!supabase) {
    throw new Error("Supabase isn't configured yet — see SUPABASE_SETUP.md");
  }

  let media_urls: string[] = [];
  if (params.file) {
    const blob = await resizeImageToBlob(params.file);
    const path = `content/songs/${crypto.randomUUID()}.jpg`;
    const { error: uploadError } = await supabase.storage
      .from(BUCKET)
      .upload(path, blob, { contentType: "image/jpeg" });
    if (uploadError) throw uploadError;
    const { data: pub } = supabase.storage.from(BUCKET).getPublicUrl(path);
    media_urls = [pub.publicUrl];
  }

  const { data, error } = await supabase
    .from(TABLE)
    .insert({
      section: "songs",
      media_urls,
      media_type: "image",
      role: "a song, from you",
      title_label: params.title.trim(),
      artist: params.artist?.trim() || null,
      note: params.note?.trim() || null,
      link_url: params.url?.trim() || null,
      sort_order: 1000 + (Date.now() % 100000),
    })
    .select()
    .single();

  if (error) throw error;

  cache.delete("songs"); // next fetch picks up the new row instead of serving the stale cache
  return data as ContentItem;
}
