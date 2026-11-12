import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { readStoredTheme, THEME_KEY } from "@/lib/theme";
import { useTheme } from "./use-theme";

function stubSystem(dark: boolean) {
  vi.stubGlobal(
    "matchMedia",
    vi.fn((query: string) => ({
      matches: dark,
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })),
  );
}

describe("useTheme", () => {
  beforeEach(() => stubSystem(false));

  afterEach(() => {
    vi.unstubAllGlobals();
    window.localStorage.clear();
    document.documentElement.removeAttribute("data-theme");
  });

  it("resolves to the system theme when nothing is stored", () => {
    stubSystem(true);
    const { result } = renderHook(() => useTheme());

    expect(result.current.theme).toBe("dark");
  });

  it("resolves to a stored choice over the system", () => {
    stubSystem(true);
    window.localStorage.setItem(THEME_KEY, "light");
    const { result } = renderHook(() => useTheme());

    expect(result.current.theme).toBe("light");
  });

  it("flips from the system theme to its opposite and remembers it", () => {
    const { result } = renderHook(() => useTheme());

    act(() => result.current.toggle());

    expect(result.current.theme).toBe("dark");
    expect(readStoredTheme()).toBe("dark");
    expect(document.documentElement.getAttribute("data-theme")).toBe("dark");
  });

  it("flips back on a second toggle", () => {
    const { result } = renderHook(() => useTheme());

    act(() => result.current.toggle());
    act(() => result.current.toggle());

    expect(result.current.theme).toBe("light");
    expect(document.documentElement.getAttribute("data-theme")).toBe("light");
  });
});
