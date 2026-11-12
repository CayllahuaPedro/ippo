"use client";

import { useTheme } from "@/hooks/use-theme";
import { IconMoon, IconSun } from "./icons";

/** The icon shows where a click leads and is picked by CSS, so it is right on
 *  first paint; the label waits for the resolved theme after mount. */
export function ThemeToggle() {
  const { theme, toggle } = useTheme();
  const label =
    theme === "dark"
      ? "Switch to light theme"
      : theme === "light"
        ? "Switch to dark theme"
        : "Switch theme";

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={label}
      title={label}
      className="flex size-10 flex-none cursor-pointer items-center justify-center rounded-[var(--radius-control)] text-muted transition-colors hover:bg-wash hover:text-accent focus-visible:text-accent"
    >
      <IconMoon className="size-5 night:hidden" />
      <IconSun className="hidden size-5 night:block" />
    </button>
  );
}
