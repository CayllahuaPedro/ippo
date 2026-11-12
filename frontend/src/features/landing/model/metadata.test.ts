import type { Metadata } from "next";
import { afterEach, describe, expect, it, vi } from "vitest";

import { copy } from "./copy";
import { landingMetadata } from "./metadata";

describe("landingMetadata", () => {
  it("points es alternates at /es with x-default on /", () => {
    expect(landingMetadata("es").alternates).toEqual({
      canonical: "/es",
      languages: { en: "/", es: "/es", "x-default": "/" },
    });
  });

  it("canonicalises en to /", () => {
    expect(landingMetadata("en").alternates?.canonical).toBe("/");
  });

  it("takes title and description from the locale copy", () => {
    for (const locale of ["en", "es"] as const) {
      const meta = landingMetadata(locale);
      expect(meta.title).toBe(copy[locale].meta.title);
      expect(meta.description).toBe(copy[locale].meta.description);
    }
  });

  it("sets the open graph locale", () => {
    expect(landingMetadata("en").openGraph?.locale).toBe("en_US");
    expect(landingMetadata("es").openGraph?.locale).toBe("es_ES");
  });
});

describe("landingMetadata site url", () => {
  afterEach(() => vi.unstubAllEnvs());

  it("falls back to localhost when the env var is empty", () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "");
    expect(landingMetadata("en").metadataBase?.href).toBe("http://localhost:3000/");
  });
});

describe("landingMetadata typing", () => {
  it("is assignable to next's Metadata", () => {
    const metadata: Metadata = landingMetadata("en");
    expect(metadata.title).toBeDefined();
  });
});
