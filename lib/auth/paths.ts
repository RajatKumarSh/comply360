export const LOGIN_PATH = "/login";

/** Routes that can be visited without a session. Everything else requires one. */
const PUBLIC_PATHS: readonly string[] = [LOGIN_PATH];

export function isPublicPath(pathname: string): boolean {
  return PUBLIC_PATHS.some((path) => pathname === path || pathname.startsWith(`${path}/`));
}
