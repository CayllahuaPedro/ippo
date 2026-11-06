import { describe, expect, it } from "vitest";
import { bandGeometry } from "./forecast";

describe("bandGeometry", () => {
  it("spans the likely range and marks the point estimate", () => {
    expect(bandGeometry({ expected: 78, low: 66, high: 88 })).toEqual({
      start: 66,
      width: 22,
      marker: 78,
    });
  });

  it("clamps a range that spills past the 0–100 scale", () => {
    expect(bandGeometry({ expected: 104, low: 90, high: 112 })).toEqual({
      start: 90,
      width: 10,
      marker: 100,
    });
  });

  it("tolerates bounds that arrive in the wrong order", () => {
    expect(bandGeometry({ expected: 50, low: 60, high: 40 })).toEqual({
      start: 40,
      width: 20,
      marker: 50,
    });
  });
});
