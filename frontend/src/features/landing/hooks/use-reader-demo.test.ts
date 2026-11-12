import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { demoParagraphs } from "../fixtures";
import { useReaderDemo } from "./use-reader-demo";

function pickFor(entryId: string) {
  const token = demoParagraphs[0].tokens.find((t) => t.entryId === entryId)!;
  return { key: `demo-${token.id}`, token, rect: new DOMRect() };
}

describe("useReaderDemo", () => {
  it("applies a mark to the picked word and keeps the popup open", () => {
    const { result } = renderHook(() => useReaderDemo());
    act(() => result.current.select(pickFor("hayaoki")));
    act(() => result.current.mark("known"));
    expect(result.current.percent).toBe(64);
    expect(result.current.pick).not.toBeNull();
  });

  it("clears the pick on close", () => {
    const { result } = renderHook(() => useReaderDemo());
    act(() => result.current.select(pickFor("hayaoki")));
    act(() => result.current.close());
    expect(result.current.pick).toBeNull();
  });
});
