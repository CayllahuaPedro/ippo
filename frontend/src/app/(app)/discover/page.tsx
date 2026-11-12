"use client";

import { useState } from "react";
import { Segmented } from "@/components/ui/segmented";
import {
  type ContentKind,
  type KindFilter,
  LockedShelf,
  comfortable,
  matchesFilter,
  stretch,
  Shelf,
} from "@/features/discover";
import { learner } from "@/lib/fixtures";

const filters: { value: KindFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "video", label: "Video" },
  { value: "article", label: "Article" },
  { value: "book", label: "Book" },
];

export default function DiscoverPage() {
  const [filter, setFilter] = useState<KindFilter>("all");
  const keep = (kind: ContentKind) => matchesFilter(kind, filter);

  return (
    <div className="mx-auto flex w-full max-w-[1240px] flex-col gap-12 px-4 pt-8 pb-28 sm:px-8 lg:px-12 lg:pt-12 lg:pb-16">
      <div className="flex flex-col gap-5 border-b border-hairline pb-8 sm:flex-row sm:flex-wrap sm:items-end sm:gap-8">
        <div className="min-w-0 flex-1">
          <h1 className="text-[32px] leading-tight font-medium tracking-[-0.01em] sm:text-[40px]">
            Ready for you this week
          </h1>
          <p className="mt-3 max-w-[60ch] text-[16px] text-muted">
            From your {learner.knownWords.toLocaleString()} known words and{" "}
            {learner.finishedTexts} finished texts. You keep looking up{" "}
            <span lang="ja" className="font-jp text-ink">
              〜ていく
            </span>{" "}
            forms, so three of these lean on them.
          </p>
          <p className="mt-2 text-[14px] text-faint">
            Sample shelves and forecasts: fixtures until the learner model is connected.
          </p>
        </div>
        <Segmented
          label="Content type"
          size="sm"
          value={filter}
          options={filters}
          onChange={setFilter}
        />
      </div>

      <Shelf
        title="Comfortable"
        band="90%+ expected"
        guidance="read for pleasure, look up almost nothing"
        tone="comfortable"
        items={comfortable.filter((item) => keep(item.kind))}
      />

      <Shelf
        title="A stretch"
        band="75–89% expected"
        guidance="where the SRS gets fed, so expect the popup open often"
        tone="stretch"
        items={stretch.filter((item) => keep(item.kind))}
      />

      <LockedShelf />
    </div>
  );
}
