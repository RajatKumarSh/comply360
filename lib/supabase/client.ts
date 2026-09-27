import { createBrowserClient } from "@supabase/ssr";

import { getPublicEnv } from "@/lib/env";

/**
 * Supabase client for Client Components. Uses only the publishable key and the user's
 * session cookies; it never has access to server-only secrets.
 */
export function createClient() {
  const env = getPublicEnv();
  return createBrowserClient(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  );
}
