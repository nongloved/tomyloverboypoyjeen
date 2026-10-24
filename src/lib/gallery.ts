// Viewer-added photos from the "+" tiles on Timeline/PhotoMuseum.
// Exports: GallerySection, GalleryItem, fetchGalleryItems, addGalleryItem.
import { supabase } from "./supabase";
import { resizeImageToBlob } from "./resizeImage";

export type GallerySection = "timeline" | "sillyUs" | "favoritePhotosOfYou";

export type GalleryItem = {
  id: string;
  section: GallerySection;
  image_url: string;
  caption: string;
  date_label: string | null;
  title_label: string | null;
  created_at: string;
};

const BUCKET = "gallery";
const TABLE = "gallery_items";

export async function fetchGalleryItems(section: GallerySection): Promise<GalleryItem[]> {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .eq("section", section)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("fetchGalleryItems failed", error);
    return [];
  }
  return data ?? [];
}

export async function addGalleryItem(params: {
  section: GallerySection;
  file: File;
  caption: string;
  dateLabel?: string;
  titleLabel?: string;
}): Promise<GalleryItem> {
  if (!supabase) {
    throw new Error("Supabase isn't configured yet — see .env.example / SUPABASE_SETUP.md");
  }

  const blob = await resizeImageToBlob(params.file);
  const path = `${params.section}/${crypto.randomUUID()}.jpg`;

  const { error: uploadError } = await supabase.storage
    .from(BUCKET)
    .upload(path, blob, { contentType: "image/jpeg" });
  if (uploadError) throw uploadError;

  const { data: pub } = supabase.storage.from(BUCKET).getPublicUrl(path);

  const { data, error } = await supabase
    .from(TABLE)
    .insert({
      section: params.section,
      image_url: pub.publicUrl,
      caption: params.caption,
      date_label: params.dateLabel ?? null,
      title_label: params.titleLabel ?? null,
    })
    .select()
    .single();

  if (error) throw error;
  return data as GalleryItem;
}
