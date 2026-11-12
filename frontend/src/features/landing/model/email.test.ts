import { describe, expect, it } from "vitest";
import { normalizeEmail } from "./email";

describe("normalizeEmail", () => {
  it("trims and lowercases a valid address", () => {
    expect(normalizeEmail("  Ana@Mail.com ")).toBe("ana@mail.com");
  });

  it.each(["ana@mail", "", "a b@c.de"])("rejects %j", (raw) => {
    expect(normalizeEmail(raw)).toBeNull();
  });
});
