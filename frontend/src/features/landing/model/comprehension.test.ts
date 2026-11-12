import { describe, expect, it } from "vitest";
import { demoParagraphs } from "../fixtures";
import { comprehension, setWordState } from "./comprehension";

describe("comprehension", () => {
  it("counts known words over words with an entry", () => {
    expect(comprehension(demoParagraphs)).toBe(57);
  });

  it("returns 0 when there are no words", () => {
    expect(comprehension([])).toBe(0);
  });
});

describe("setWordState", () => {
  it("raises the forecast without mutating the input", () => {
    const next = setWordState(demoParagraphs, "hayaoki", "known");
    expect(comprehension(next)).toBe(64);
    expect(comprehension(demoParagraphs)).toBe(57);
  });
});
