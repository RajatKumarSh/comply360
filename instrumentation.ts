/**
 * Runs once when a Next.js server instance starts, before it handles requests.
 * Validating the environment here makes a misconfigured server fail at startup with a
 * clear message instead of on the first request.
 */
export async function register() {
  const { getPublicEnv } = await import("@/lib/env");
  getPublicEnv();
}
