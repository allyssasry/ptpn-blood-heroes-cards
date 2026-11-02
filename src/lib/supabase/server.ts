import { createClient } from "@supabase/supabase-js";

/**
 * Membuat instance Supabase client untuk server-side / Route Handlers.
 * Hanya membaca data publik menggunakan Anon Key.
 * Tidak pernah mengekspos Service Role Key.
 */
export function createServerSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey || supabaseUrl === "https://your-project.supabase.co") {
    return null;
  }

  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

