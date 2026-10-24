import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

// null until the two env vars are set (see .env.example) — every call site
// checks for this and quietly disables the "+" add feature instead of
// crashing, so the rest of the site still works before the backend is wired up
export const supabase = url && anonKey ? createClient(url, anonKey) : null;
