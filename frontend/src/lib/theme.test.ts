import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  applyTheme,
  LEGACY_SETTINGS_KEY,
  legacyTheme,
  parseTheme,
  readStoredTheme,
  resolveTheme,
  THEME_KEY,
  themeBootScript,
  toggleTheme,
  writeTheme,
} from "./theme";

const root = () => document.documentElement;
const legacy = (value: unknown) =>
  window.localStorage.setItem(LEGACY_SETTINGS_KEY, JSON.stringify(value));

afterEach(() => {
  window.localStorage.clear();
  root().removeAttribute("data-theme");
});

describe("parseTheme", () => {
  it("accepts the two explicit themes", () => {
    expect(parseTheme("light")).toBe("light");
    expect(parseTheme("dark")).toBe("dark");
  });

  it("treats anything else as no choice", () => {
    expect(parseTheme("system")).toBeNull();
    expect(parseTheme("neon")).toBeNull();
    expect(parseTheme(null)).toBeNull();
    expect(parseTheme(7)).toBeNull();
  });
});

describe("resolveTheme", () => {
  it("follows the system when nothing is stored", () => {
    expect(resolveTheme(null, true)).toBe("dark");
    expect(resolveTheme(null, false)).toBe("light");
  });

  it("lets a stored choice win over the system", () => {
    expect(resolveTheme("light", true)).toBe("light");
    expect(resolveTheme("dark", false)).toBe("dark");
  });
});

describe("toggleTheme", () => {
  it("flips to the opposite theme", () => {
    expect(toggleTheme("light")).toBe("dark");
    expect(toggleTheme("dark")).toBe("light");
  });
});

describe("legacyTheme", () => {
  it("reads the theme the reader settings used to hold", () => {
    expect(legacyTheme(JSON.stringify({ theme: "dark" }))).toBe("dark");
    expect(legacyTheme(JSON.stringify({ theme: "light" }))).toBe("light");
  });

  it("treats a stored system theme as no choice", () => {
    expect(legacyTheme(JSON.stringify({ theme: "system", pairing: "sumi" }))).toBeNull();
  });

  it("maps the retired pairings: sumi dark, washi light, kohi no choice", () => {
    expect(legacyTheme(JSON.stringify({ pairing: "sumi" }))).toBe("dark");
    expect(legacyTheme(JSON.stringify({ pairing: "washi" }))).toBe("light");
    expect(legacyTheme(JSON.stringify({ pairing: "kohi" }))).toBeNull();
  });

  it("prefers the stored theme over a leftover pairing", () => {
    expect(legacyTheme(JSON.stringify({ theme: "light", pairing: "sumi" }))).toBe("light");
  });

  it("ignores unknown pairings, including inherited property names", () => {
    expect(legacyTheme(JSON.stringify({ pairing: "neon" }))).toBeNull();
    expect(legacyTheme(JSON.stringify({ pairing: "constructor" }))).toBeNull();
  });

  it("survives missing, malformed or non-object settings", () => {
    expect(legacyTheme(null)).toBeNull();
    expect(legacyTheme("{not json")).toBeNull();
    expect(legacyTheme("null")).toBeNull();
    expect(legacyTheme('"dark"')).toBeNull();
  });
});

describe("readStoredTheme / writeTheme", () => {
  it("round-trips an explicit choice under its own key", () => {
    writeTheme("dark");

    expect(window.localStorage.getItem(THEME_KEY)).toBe("dark");
    expect(readStoredTheme()).toBe("dark");
  });

  it("returns no choice when nothing is stored", () => {
    expect(readStoredTheme()).toBeNull();
  });

  it("migrates a legacy choice once, into the new key", () => {
    legacy({ pairing: "sumi", furigana: "off" });

    expect(readStoredTheme()).toBe("dark");
    expect(window.localStorage.getItem(THEME_KEY)).toBe("dark");
  });

  it("lets the new key win over legacy settings", () => {
    writeTheme("light");
    legacy({ theme: "dark" });

    expect(readStoredTheme()).toBe("light");
  });

  it("ignores an invalid value under the new key and falls back to legacy", () => {
    window.localStorage.setItem(THEME_KEY, "neon");
    legacy({ theme: "dark" });

    expect(readStoredTheme()).toBe("dark");
  });

  it("returns no choice when storage throws", () => {
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new Error("blocked");
    });

    expect(readStoredTheme()).toBeNull();
  });

  it("does not throw when storage refuses to save", () => {
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("quota");
    });

    expect(() => writeTheme("dark")).not.toThrow();
  });
});

describe("applyTheme", () => {
  it("sets the theme on the root element", () => {
    applyTheme("dark");
    expect(root().getAttribute("data-theme")).toBe("dark");

    applyTheme("light");
    expect(root().getAttribute("data-theme")).toBe("light");
  });
});

describe("themeBootScript", () => {
  const runBoot = () => new Function(themeBootScript)();
  const theme = () => root().getAttribute("data-theme");

  beforeEach(() => root().removeAttribute("data-theme"));

  it("applies a stored theme before the app renders", () => {
    writeTheme("dark");
    runBoot();
    expect(theme()).toBe("dark");
  });

  it("leaves the attribute off when the system decides", () => {
    runBoot();
    expect(theme()).toBeNull();
  });

  it("migrates a legacy choice the same way readStoredTheme does", () => {
    legacy({ pairing: "sumi" });
    runBoot();

    expect(theme()).toBe("dark");
    expect(window.localStorage.getItem(THEME_KEY)).toBe("dark");
  });

  it("migrates the reader's old theme field", () => {
    legacy({ theme: "light", pairing: "sumi" });
    runBoot();
    expect(theme()).toBe("light");
  });

  it("lets the new key win over legacy settings", () => {
    writeTheme("light");
    legacy({ theme: "dark" });
    runBoot();
    expect(theme()).toBe("light");
  });

  it("ignores values outside the allowed set", () => {
    window.localStorage.setItem(THEME_KEY, "neon");
    legacy({ theme: "system", pairing: "constructor" });
    runBoot();

    expect(theme()).toBeNull();
    expect(window.localStorage.getItem(THEME_KEY)).toBe("neon");
  });

  it("survives legacy settings that are not json", () => {
    window.localStorage.setItem(LEGACY_SETTINGS_KEY, "{not json");
    expect(runBoot).not.toThrow();
    expect(theme()).toBeNull();
  });

  it("survives storage that throws", () => {
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new Error("blocked");
    });
    expect(runBoot).not.toThrow();
    expect(theme()).toBeNull();
  });
});
