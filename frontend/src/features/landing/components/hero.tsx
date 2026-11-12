import type { LandingCopy, Locale } from "../types";
import { ReaderDemo } from "./reader-demo";
import { WaitlistForm } from "./waitlist-form";

type HeroProps = { locale: Locale; copy: LandingCopy };

export function Hero({ locale, copy }: HeroProps) {
  return (
    <section className="grid items-center gap-10 py-12 lg:grid-cols-2 lg:gap-14 lg:py-[72px]">
      <div className="min-w-0">
        <p lang="ja" className="mb-3.5 font-jp text-[14px] text-faint">
          {copy.hero.eyebrow}
        </p>
        <h1 className="text-[32px] leading-[1.1] font-medium tracking-[-0.015em] sm:text-[38px]">
          {copy.hero.title}
        </h1>
        <p className="mt-4 max-w-[34em] text-[16px] leading-[1.55] text-muted">
          {copy.hero.lede}
        </p>
        <div className="mt-6">
          <WaitlistForm locale={locale} copy={copy.waitlist} />
        </div>
      </div>
      <ReaderDemo locale={locale} copy={copy.demo} />
    </section>
  );
}
