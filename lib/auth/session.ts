import "server-only";

import type { User } from "@supabase/supabase-js";
import { redirect } from "next/navigation";
import { cache } from "react";

import { LOGIN_PATH } from "@/lib/auth/paths";
import { createClient } from "@/lib/supabase/server";

/**
 * Returns the authenticated user, or null.
 *
 * Uses `auth.getUser()`, which validates the session with the Supabase Auth server rather
 * than trusting the cookie contents. Cached per request.
 */
export const getCurrentUser = cache(async (): Promise<User | null> => {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) {
    return null;
  }
  return data.user;
});

/**
 * Authentication check for protected layouts, pages and Server Actions.
 *
 * This establishes *who* the user is. It is not authorization: permission and scope
 * checks (`authorize()`, ADR-005) are introduced in Phase 2.
 */
export async function requireUser(): Promise<User> {
  const user = await getCurrentUser();
  if (!user) {
    redirect(LOGIN_PATH);
  }
  return user;
}
