import { copy as allCopy } from "../model/copy";
import type { Locale } from "../types";
import { ClosingSection } from "./closing-section";
import { Hero } from "./hero";
import { HelpsSection } from "./helps-section";
import { LandingFooter } from "./landing-footer";
import { LandingHeader } from "./landing-header";
import { MethodSection } from "./method-section";
import { StatusSection } from "./status-section";

export function LandingPage({ locale }: { locale: Locale }) {
  const copy = allCopy[locale];

  return (
    <div className="min-h-svh bg-ground text-ink">
      <LandingHeader locale={locale} copy={copy.switcher} />
      <main className="mx-auto w-full max-w-[1080px] px-4 sm:px-8 lg:px-12">
        <Hero locale={locale} copy={copy} />
        <MethodSection copy={copy.method} />
        <HelpsSection copy={copy.helps} />
        <StatusSection copy={copy.status} />
        <ClosingSection locale={locale} copy={copy} />
      </main>
      <div className="mx-auto w-full max-w-[1080px] px-4 sm:px-8 lg:px-12">
        <LandingFooter locale={locale} copy={copy} />
      </div>
    </div>
  );
}
