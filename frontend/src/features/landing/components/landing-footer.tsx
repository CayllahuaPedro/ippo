import type { LandingCopy, Locale } from "../types";
import { LanguageSwitcher } from "./language-switcher";

type LandingFooterProps = { locale: Locale; copy: LandingCopy };

export function LandingFooter({ locale, copy }: LandingFooterProps) {
  return (
    <footer className="flex flex-wrap items-center justify-between gap-4 border-t border-hairline pt-7 pb-10 text-[14px] text-faint">
      <p>
        Ippo ·{" "}
        <a href={copy.footer.repoUrl} className="text-faint underline hover:text-ink">
          {copy.footer.openSource}
        </a>
      </p>
      <LanguageSwitcher locale={locale} label={copy.switcher.label} />
    </footer>
  );
}
