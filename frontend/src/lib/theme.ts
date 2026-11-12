export type Theme = "light" | "dark";

export const THEME_KEY = "nihon-ai.theme";

/** Where the reader kept the theme before it became a global setting. */
export const LEGACY_SETTINGS_KEY = "nihon-ai.reader-settings";

/** The retired colour pairings: Sumi was the dark one, Washi a deliberate
 *  light one. Kōhi was the default, so it carries no choice. */
const LEGACY_PAIRING: Record<string, Theme> = { washi: "light", sumi: "dark" };

export function parseTheme(value: unknown): Theme | null {
  return value === "light" || value === "dark" ? value : null;
}

export function resolveTheme(stored: Theme | null, systemDark: boolean): Theme {
  return stored ?? (systemDark ? "dark" : "light");
}

export function toggleTheme(resolved: Theme): Theme {
  return resolved === "dark" ? "light" : "dark";
}

/** A legacy `theme` the reader recognised, "system" included, wins over a
 *  leftover pairing, as it did when the reader parsed it. */
export function legacyTheme(raw: string | null): Theme | null {
  if (!raw) return null;

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return null;
  }
  if (typeof parsed !== "object" || parsed === null) return null;

  const { theme, pairing } = parsed as { theme?: unknown; pairing?: unknown };
  if (theme === "system") return null;
  if (parseTheme(theme)) return parseTheme(theme);
  return typeof pairing === "string" && Object.hasOwn(LEGACY_PAIRING, pairing)
    ? LEGACY_PAIRING[pairing]
    : null;
}

/** A private window or blocked site data just means the system decides. */
export function readStoredTheme(): Theme | null {
  try {
    const storage = window.localStorage;
    const stored = parseTheme(storage.getItem(THEME_KEY));
    if (stored) return stored;

    const migrated = legacyTheme(storage.getItem(LEGACY_SETTINGS_KEY));
    if (migrated) storage.setItem(THEME_KEY, migrated);
    return migrated;
  } catch {
    return null;
  }
}

export function writeTheme(theme: Theme): void {
  try {
    window.localStorage.setItem(THEME_KEY, theme);
  } catch {
    // A preference that fails to persist still applies for this visit.
  }
}

export function applyTheme(theme: Theme): void {
  document.documentElement.setAttribute("data-theme", theme);
}

/**
 * Runs inline in <head>, before first paint, so a stored dark choice never
 * flashes light. It mirrors `readStoredTheme`, migration included; the tests
 * run both against the same stored values.
 */
export const themeBootScript = `(function () {
  try {
    var storage = window.localStorage;
    var theme = storage.getItem(${JSON.stringify(THEME_KEY)});
    if (theme !== "light" && theme !== "dark") {
      var legacy = JSON.parse(storage.getItem(${JSON.stringify(LEGACY_SETTINGS_KEY)}) || "null");
      var pairings = ${JSON.stringify(LEGACY_PAIRING)};
      theme = null;
      if (legacy && typeof legacy === "object") {
        if (legacy.theme === "light" || legacy.theme === "dark" || legacy.theme === "system") {
          theme = legacy.theme;
        } else if (typeof legacy.pairing === "string" && Object.prototype.hasOwnProperty.call(pairings, legacy.pairing)) {
          theme = pairings[legacy.pairing];
        }
      }
      if (theme !== "light" && theme !== "dark") return;
      storage.setItem(${JSON.stringify(THEME_KEY)}, theme);
    }
    document.documentElement.setAttribute("data-theme", theme);
  } catch (error) {}
})();`;
