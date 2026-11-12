import { wordMark } from "@/features/reader";
import { cn } from "@/lib/cn";
import type { LandingCopy } from "../types";

type DemoLegendProps = { copy: LandingCopy["demo"] };

export function DemoLegend({ copy }: DemoLegendProps) {
  const entries = [
    { state: "known", label: copy.known },
    { state: "learning", label: copy.learning },
  ] as const;

  return (
    <ul className="m-0 flex list-none flex-wrap gap-x-6 gap-y-2 p-0 text-[14px] text-muted">
      {entries.map((entry) => (
        <li key={entry.state} className="flex items-baseline gap-2">
          <span aria-hidden className={cn("font-jp text-[17px] text-ink", wordMark[entry.state])}>
            字
          </span>
          {entry.label}
        </li>
      ))}
    </ul>
  );
}
