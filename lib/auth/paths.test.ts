import { describe, expect, it } from "vitest";

import { isPublicPath, LOGIN_PATH } from "@/lib/auth/paths";

describe("isPublicPath", () => {
  it("treats the login page as public", () => {
    expect(isPublicPath(LOGIN_PATH)).toBe(true);
  });

  it("treats nested login paths as public", () => {
    expect(isPublicPath(`${LOGIN_PATH}/help`)).toBe(true);
  });

  it("requires a session for the home page", () => {
    expect(isPublicPath("/")).toBe(false);
  });

  it("does not match paths that merely start with the same characters", () => {
    expect(isPublicPath("/login-admin")).toBe(false);
  });
});
