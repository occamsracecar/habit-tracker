import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";

import type { Database } from "../types/database";

export const supabaseConfigurationError =
  "Supabase is not configured. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY to your environment, then restart the app.";

type SupabaseRequestError = {
  code?: string;
  message?: string;
  status?: number;
};

export function formatSupabaseRequestError(error: SupabaseRequestError) {
  const message = error.message ?? "Supabase request failed.";
  const lowerCaseMessage = message.toLowerCase();
  const isUnauthorized =
    error.status === 401 ||
    error.code === "401" ||
    lowerCaseMessage.includes("jwt") ||
    lowerCaseMessage.includes("api key") ||
    lowerCaseMessage.includes("unauthorized");

  if (isUnauthorized) {
    return "Supabase rejected the request. Check that Vercel has the correct NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY for this project, then confirm the habits and completions tables allow prototype anon access.";
  }

  return message;
}

export function createClient(): SupabaseClient<Database> | null {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabasePublishableKey =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!supabaseUrl || !supabasePublishableKey) {
    return null;
  }

  return createBrowserClient<Database>(
    supabaseUrl,
    supabasePublishableKey,
  );
}
