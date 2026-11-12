import type { LandingCopy, Locale } from "../types";
import { LanguageSwitcher } from "./language-switcher";

type LandingHeaderProps = { locale: Locale; copy: LandingCopy["switcher"] };

export function LandingHeader({ locale, copy }: LandingHeaderProps) {
  return (
    <header className="mx-auto flex h-16 w-full max-w-[1080px] items-center justify-between px-4 sm:px-8 lg:px-12">
      <span className="text-[19px] font-medium text-ink">Ippo</span>
      <LanguageSwitcher locale={locale} label={copy.label} />
    </header>
  );
}
