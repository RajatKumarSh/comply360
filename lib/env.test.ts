import { describe, expect, it } from "vitest";

import { parsePublicEnv } from "@/lib/env";

const valid = {
  NEXT_PUBLIC_SUPABASE_URL: "http://127.0.0.1:54321",
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: "test-publishable-key",
};

describe("parsePublicEnv", () => {
  it("returns the parsed values when all variables are valid", () => {
    expect(parsePublicEnv(valid)).toEqual(valid);
  });

  it("names every missing variable", () => {
    expect(() => parsePublicEnv({})).toThrowError(
      /NEXT_PUBLIC_SUPABASE_URL[\s\S]*NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY/,
    );
  });

  it("rejects a malformed Supabase URL", () => {
    expect(() => parsePublicEnv({ ...valid, NEXT_PUBLIC_SUPABASE_URL: "not-a-url" })).toThrowError(
      /NEXT_PUBLIC_SUPABASE_URL/,
    );
  });

  it("rejects an empty publishable key", () => {
    expect(() =>
      parsePublicEnv({ ...valid, NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: "" }),
    ).toThrowError(/NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY/);
  });

  it("points the developer to the setup guide", () => {
    expect(() => parsePublicEnv({})).toThrowError(/docs\/DEVELOPMENT\.md/);
  });
});
