import type { LandingMetadata, Locale } from "../types";
import { copy } from "./copy";

const openGraphLocale: Record<Locale, string> = {
  en: "en_US",
  es: "es_ES",
};

export function landingMetadata(locale: Locale): LandingMetadata {
  const { title, description } = copy[locale].meta;
  return {
    title,
    description,
    metadataBase: new URL(
      process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
    ),
    alternates: {
      canonical: locale === "en" ? "/" : "/es",
      languages: { en: "/", es: "/es", "x-default": "/" },
    },
    openGraph: { title, description, locale: openGraphLocale[locale] },
  };
}
