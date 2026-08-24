import { createBrowserClient } from "@supabase/ssr";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

const isConfigured =
  supabaseUrl &&
  supabaseAnonKey &&
  !supabaseUrl.includes("placeholder") &&
  !supabaseAnonKey.includes("placeholder");

export function createClient() {
  if (isConfigured) {
    return createBrowserClient(supabaseUrl, supabaseAnonKey);
  }
  // Safe fallback if env vars are placeholders
  return null as any;
}
