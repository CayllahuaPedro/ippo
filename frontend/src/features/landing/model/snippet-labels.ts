import type { ShelfLabels } from "@/features/discover";
import type { WordEntryLabels } from "@/features/reader";
import type { LandingCopy } from "../types";
import { formatTemplate } from "./copy";

export function shelfLabelsFrom(copy: LandingCopy["snippets"]["shelf"]): ShelfLabels {
  return {
    format: copy.format,
    source: copy.source,
    notes: copy.notes,
    empty: copy.empty,
    kinds: copy.kinds,
    forecast: {
      noForecast: copy.noForecast,
      abstains: copy.abstains,
      understand: (low, high) => formatTemplate(copy.understand, { low, high }),
    },
  };
}

export function wordEntryLabelsFrom(copy: LandingCopy["snippets"]["entry"]): WordEntryLabels {
  return { ...copy };
}
