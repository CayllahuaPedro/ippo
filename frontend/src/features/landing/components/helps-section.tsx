import { Shelf } from "@/features/discover";
import { TutorTurnView } from "@/features/tutor";
import { snippetFixtures } from "../fixtures";
import { shelfLabelsFrom } from "../model/snippet-labels";
import type { LandingCopy, Locale } from "../types";
import { ChromeSnippet } from "./chrome-snippet";
import { SectionHeading } from "./section-heading";

type HelpsSectionProps = {
  locale: Locale;
  copy: LandingCopy["helps"];
  snippets: LandingCopy["snippets"];
};

export function HelpsSection({ locale, copy, snippets }: HelpsSectionProps) {
  const fixtures = snippetFixtures[locale];
  const rendered = [
    <Shelf
      key="shelf"
      title={snippets.shelf.title}
      band={snippets.shelf.band}
      guidance={snippets.shelf.guidance}
      tone="comfortable"
      items={[fixtures.shelfItem]}
      labels={shelfLabelsFrom(snippets.shelf)}
      stacked
    />,
    <ChromeSnippet key="chrome" entry={fixtures.entry} copy={snippets.entry} />,
    <TutorTurnView key="tutor" turn={fixtures.tutorTurn} />,
  ];

  return (
    <section id="helps" className="border-t border-hairline py-[72px]">
      <SectionHeading label={copy.label} title={copy.title} />
      <div className="mt-10 grid gap-10 md:grid-cols-3 md:gap-7">
        {copy.items.map((item, index) => (
          <div key={item.title} className="flex min-w-0 flex-col">
            <div inert className="mb-4 flex-1 overflow-hidden" aria-hidden>
              {rendered[index]}
            </div>
            <h3 className="mb-1.5 text-[18px] font-medium">{item.title}</h3>
            <p className="text-[16px] leading-[1.55] text-muted">{item.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
