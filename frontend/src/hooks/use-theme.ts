"use client";

import { useCallback, useEffect, useState } from "react";
import {
  applyTheme,
  readStoredTheme,
  resolveTheme,
  toggleTheme,
  writeTheme,
  type Theme,
} from "@/lib/theme";

const SYSTEM_DARK = "(prefers-color-scheme: dark)";

const currentTheme = () =>
  resolveTheme(readStoredTheme(), window.matchMedia(SYSTEM_DARK).matches);

/** `theme` is null on the server and the first client render, so hydration
 *  matches; the boot script has already painted the right theme by then. */
export function useTheme(): { theme: Theme | null; toggle: () => void } {
  const [theme, setTheme] = useState<Theme | null>(null);

  useEffect(() => {
    const list = window.matchMedia(SYSTEM_DARK);
    const sync = () => setTheme(currentTheme());
    sync();
    list.addEventListener("change", sync);
    return () => list.removeEventListener("change", sync);
  }, []);

  const toggle = useCallback(() => {
    const next = toggleTheme(currentTheme());
    writeTheme(next);
    applyTheme(next);
    setTheme(next);
  }, []);

  return { theme, toggle };
}
