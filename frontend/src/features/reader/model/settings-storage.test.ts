import { beforeEach, describe, expect, it, vi } from "vitest";
import { LEGACY_SETTINGS_KEY } from "@/lib/theme";
import {
  defaultSettings,
  parseSettings,
  readSettings,
  STORAGE_KEY,
  writeSettings,
} from "./settings-storage";

describe("parseSettings", () => {
  it("falls back when nothing is stored", () => {
    expect(parseSettings(null)).toEqual(defaultSettings);
  });

  it("falls back on text that is not json", () => {
    expect(parseSettings("{not json")).toEqual(defaultSettings);
  });

  it("falls back on json that is not an object", () => {
    expect(parseSettings('"dark"')).toEqual(defaultSettings);
  });

  it("reads a complete set of settings", () => {
    const raw = JSON.stringify({ furigana: "off", mode: "dense" });

    expect(parseSettings(raw)).toEqual({ furigana: "off", mode: "dense" });
  });

  it("keeps the values it recognises and defaults the rest", () => {
    const raw = JSON.stringify({ furigana: "always" });

    expect(parseSettings(raw)).toEqual({ ...defaultSettings, furigana: "always" });
  });

  it("drops the theme, which is no longer a reader setting", () => {
    const raw = JSON.stringify({ theme: "dark", pairing: "sumi", mode: "book" });

    expect(parseSettings(raw)).toEqual({ ...defaultSettings, mode: "book" });
  });

  it("rejects a value outside the allowed set", () => {
    const raw = JSON.stringify({ furigana: "neon", mode: "dense" });

    expect(parseSettings(raw).furigana).toBe(defaultSettings.furigana);
  });

  it("rejects a value of the wrong type", () => {
    expect(parseSettings(JSON.stringify({ mode: 7 })).mode).toBe(
      defaultSettings.mode,
    );
  });
});

describe("readSettings / writeSettings", () => {
  beforeEach(() => window.localStorage.clear());

  it("round-trips through storage", () => {
    writeSettings({ furigana: "always", mode: "book" });

    expect(readSettings()).toEqual({ furigana: "always", mode: "book" });
  });

  it("writes under the documented key", () => {
    writeSettings(defaultSettings);

    expect(window.localStorage.getItem(STORAGE_KEY)).not.toBeNull();
  });

  it("is the key the theme migrates its legacy choice from", () => {
    expect(STORAGE_KEY).toBe(LEGACY_SETTINGS_KEY);
  });

  it("returns defaults when storage throws", () => {
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new Error("blocked");
    });

    expect(readSettings()).toEqual(defaultSettings);
  });

  it("does not throw when storage refuses to save", () => {
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("quota");
    });

    expect(() => writeSettings(defaultSettings)).not.toThrow();
  });
});
