import { describe, expect, it } from "vitest";

import { copy, formatForecast, formatTemplate } from "./copy";

function walk(
  en: unknown,
  es: unknown,
  path: string,
  visit: (path: string, en: unknown, es: unknown) => void,
): void {
  visit(path, en, es);
  if (Array.isArray(en)) {
    en.forEach((item, i) =>
      walk(item, (es as unknown[])?.[i], `${path}[${i}]`, visit),
    );
  } else if (en !== null && typeof en === "object") {
    for (const key of Object.keys(en)) {
      walk(
        (en as Record<string, unknown>)[key],
        (es as Record<string, unknown> | undefined)?.[key],
        `${path}.${key}`,
        visit,
      );
    }
  }
}

describe("landing copy", () => {
  it("es copy has the same shape as en", () => {
    walk(copy.en, copy.es, "copy", (path, en, es) => {
      expect(typeof es, path).toBe(typeof en);
      expect(Array.isArray(es), path).toBe(Array.isArray(en));
      if (typeof en === "string") {
        expect((es as string).trim(), path).not.toBe("");
        expect(en.trim(), path).not.toBe("");
      }
      if (Array.isArray(en)) {
        expect((es as unknown[]).length, path).toBe(en.length);
      }
    });
  });

  it("no copy names other products", () => {
    expect(JSON.stringify(copy)).not.toMatch(/refold|migaku|\bmia\b|fluent in/i);
  });

  it("fills named placeholders and leaves unknown ones alone", () => {
    expect(formatTemplate("Buscar {word} {other}", { word: "駅" })).toBe("Buscar 駅 {other}");
  });

  it("formats the forecast template", () => {
    expect(formatForecast("about {pct}%", 57)).toBe("about 57%");
  });
});
