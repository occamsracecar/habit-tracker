import { createBrowserClient } from "@supabase/ssr";

import type { Database } from "../types/database";

/**
 * Reads Supabase credentials from env. Supports both publishable and legacy anon key names.
 */
function getSupabaseCredentials() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  return { url, key };
}

/** Browser Supabase client for habit data. */
export function createClient() {
  const { url, key } = getSupabaseCredentials();

  return createBrowserClient<Database>(url!, key!);
}
