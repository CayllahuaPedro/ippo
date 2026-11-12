import type { LandingCopy } from "../types";
import { SectionHeading } from "./section-heading";

type MethodSectionProps = { copy: LandingCopy["method"] };

const examples = [
  { title: "NHK Easy", percent: 97, left: "14%" },
  { title: "よつばと!", percent: 88, left: "46%" },
  { title: "村上春樹", percent: 61, left: "82%" },
];

export function MethodSection({ copy }: MethodSectionProps) {
  return (
    <section id="method" className="border-t border-hairline py-[72px]">
      <SectionHeading label={copy.label} title={copy.title} />
      <p className="mt-4 max-w-[36em] text-[16px] leading-[1.55] text-muted">{copy.body}</p>

      <div className="mt-9">
        <div className="relative mb-2 hidden h-16 sm:block">
          {examples.map((example) => (
            <div
              key={example.title}
              style={{ left: example.left }}
              className="absolute bottom-0 -translate-x-1/2 text-center text-[14px] text-muted"
            >
              <div lang="ja" className="font-jp whitespace-nowrap text-ink">
                {example.title}
              </div>
              {example.percent}%
              <div aria-hidden className="mx-auto mt-1 h-3.5 w-px bg-handle" />
            </div>
          ))}
        </div>
        <div
          aria-hidden
          className="h-2.5 rounded-[5px] bg-[linear-gradient(90deg,var(--color-forecast-low)_0_28%,var(--color-forecast-high)_28%_72%,var(--color-forecast-mid)_72%_100%)]"
        />
        <div className="mt-2.5 flex justify-between text-[14px] text-faint">
          <span>{copy.tooEasy}</span>
          <b className="font-medium text-ink">{copy.nextStep}</b>
          <span>{copy.tooHard}</span>
        </div>
        <ul className="mt-5 m-0 flex list-none flex-col gap-2 p-0 text-[14px] text-muted sm:hidden">
          {examples.map((example) => (
            <li key={example.title} className="flex justify-between">
              <span lang="ja" className="font-jp text-ink">
                {example.title}
              </span>
              {example.percent}%
            </li>
          ))}
        </ul>
        <p className="mt-4 text-[14px] text-faint">{copy.caption}</p>
      </div>
    </section>
  );
}
