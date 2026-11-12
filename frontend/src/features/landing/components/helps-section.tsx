import { Shelf, comfortable } from "@/features/discover";
import { TutorTurnView, tutorThread } from "@/features/tutor";
import type { LandingCopy } from "../types";
import { ChromeSnippet } from "./chrome-snippet";
import { SectionHeading } from "./section-heading";

type HelpsSectionProps = { copy: LandingCopy["helps"] };

export function HelpsSection({ copy }: HelpsSectionProps) {
  const snippets = [
    <Shelf
      key="shelf"
      title="Comfortable"
      band="90%+ expected"
      guidance="read for pleasure, look up almost nothing"
      tone="comfortable"
      items={comfortable.slice(0, 2)}
    />,
    <ChromeSnippet key="chrome" />,
    <TutorTurnView key="tutor" turn={tutorThread[1]} />,
  ];

  return (
    <section id="helps" className="border-t border-hairline py-[72px]">
      <SectionHeading label={copy.label} title={copy.title} />
      <div className="mt-10 grid gap-10 md:grid-cols-3 md:gap-7">
        {copy.items.map((item, index) => (
          <div key={item.title} className="flex min-w-0 flex-col">
            <div inert className="mb-4 flex-1 overflow-hidden" aria-hidden>
              {snippets[index]}
            </div>
            <h3 className="mb-1.5 text-[18px] font-medium">{item.title}</h3>
            <p className="text-[16px] leading-[1.55] text-muted">{item.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
