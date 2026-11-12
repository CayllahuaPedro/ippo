import type { LandingCopy, Locale } from "../types";
import { WaitlistForm } from "./waitlist-form";

type ClosingSectionProps = { locale: Locale; copy: LandingCopy };

export function ClosingSection({ locale, copy }: ClosingSectionProps) {
  return (
    <section id="join" className="border-t border-hairline py-[72px] text-center">
      <h2 className="text-[26px] leading-[1.15] font-medium tracking-[-0.01em] sm:text-[30px]">
        {copy.closing.title}
      </h2>
      <div className="mx-auto mt-6 flex max-w-[420px] justify-center">
        <WaitlistForm locale={locale} copy={copy.waitlist} />
      </div>
    </section>
  );
}
