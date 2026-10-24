// Viewer-added items for the "Little reminders of you" board.
// Exports: BoardItemKind, BoardItem, fetchBoardItems, addBoardItem.
import { supabase } from "./supabase";
import { resizeImageToBlob } from "./resizeImage";

export type BoardItemKind = "photo" | "song" | "movie" | "text";

export type BoardItem = {
  id: string;
  kind: BoardItemKind;
  image_url: string | null;
  title: string | null;
  subtitle: string | null;
  message: string | null;
  url: string | null;
  created_at: string;
};

const BUCKET = "gallery";
const TABLE = "board_items";

export async function fetchBoardItems(): Promise<BoardItem[]> {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .order("created_at", { ascending: true });

  if (error) {
    console.error("fetchBoardItems failed", error);
    return [];
  }
  return data ?? [];
}

export async function addBoardItem(params: {
  kind: BoardItemKind;
  file?: File | null;
  title?: string;
  subtitle?: string;
  message?: string;
  url?: string;
}): Promise<BoardItem> {
  if (!supabase) {
    throw new Error("Supabase isn't configured yet — see SUPABASE_SETUP.md");
  }

  let image_url: string | null = null;
  if (params.file) {
    const blob = await resizeImageToBlob(params.file);
    const path = `board/${crypto.randomUUID()}.jpg`;
    const { error: uploadError } = await supabase.storage
      .from(BUCKET)
      .upload(path, blob, { contentType: "image/jpeg" });
    if (uploadError) throw uploadError;
    const { data: pub } = supabase.storage.from(BUCKET).getPublicUrl(path);
    image_url = pub.publicUrl;
  }

  const { data, error } = await supabase
    .from(TABLE)
    .insert({
      kind: params.kind,
      image_url,
      title: params.title?.trim() || null,
      subtitle: params.subtitle?.trim() || null,
      message: params.message?.trim() || null,
      url: params.url?.trim() || null,
    })
    .select()
    .single();

  if (error) throw error;
  return data as BoardItem;
}
