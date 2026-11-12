import type { LandingCopy } from "../types";
import { SectionHeading } from "./section-heading";

type StatusSectionProps = { copy: LandingCopy["status"] };

const itemClass =
  "flex items-baseline justify-between gap-4 border-t border-hairline py-2.5 text-[15px] text-muted";

export function StatusSection({ copy }: StatusSectionProps) {
  return (
    <section id="status" className="border-t border-hairline py-[72px]">
      <SectionHeading label={copy.label} title={copy.title} />
      <div className="mt-8 grid gap-8 md:grid-cols-2 md:gap-7">
        <div>
          <h3 className="text-[18px] font-medium">{copy.todayTitle}</h3>
          <ul className="m-0 mt-3 list-none p-0">
            {copy.today.map((item) => (
              <li key={item} className={itemClass}>
                {item}
                <span className="text-[14px] text-faint">{copy.preview}</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="text-[18px] font-medium">{copy.nextTitle}</h3>
          <ul className="m-0 mt-3 list-none p-0">
            {copy.next.map((item) => (
              <li key={item} className={itemClass}>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
