import { ForecastBlock, forecastBlockLabels, type ForecastBlockLabels } from "@/components/ui/forecast-block";
import { cn } from "@/lib/cn";
import type { ContentKind, Recommendation } from "../types";

export type ShelfLabels = {
  format: string;
  source: string;
  notes: string;
  empty: string;
  kinds: Record<ContentKind, string>;
  forecast: ForecastBlockLabels;
};

export const shelfLabels: ShelfLabels = {
  format: "Format",
  source: "Source",
  notes: "Notes",
  empty: "Nothing of this type on this shelf.",
  kinds: { video: "video", article: "article", book: "book" },
  forecast: forecastBlockLabels,
};

type ShelfProps = {
  title: string;
  band: string;
  guidance: string;
  tone: "comfortable" | "stretch";
  items: Recommendation[];
  stacked?: boolean;
  labels?: Partial<ShelfLabels>;
};

export function Shelf({ title, band, guidance, items, stacked = false, labels }: ShelfProps) {
  const text = { ...shelfLabels, ...labels };

  return (
    <section className="flex flex-col gap-6">
      <header className="flex flex-col gap-1">
        <h2 className="text-[22px] leading-tight font-medium">{title}</h2>
        <p className="text-[15px] text-muted">
          <span className="tabular-nums">{band}</span> · {guidance}
        </p>
      </header>

      {items.length === 0 ? (
        <p className="text-[15px] text-faint">{text.empty}</p>
      ) : (
        <ul
          className={cn(
            "m-0 grid list-none grid-cols-1 gap-6 p-0",
            !stacked && "md:grid-cols-2 lg:grid-cols-3",
          )}
        >
          {items.map((item) => (
            <RecommendationCard key={item.id} item={item} labels={text} />
          ))}
        </ul>
      )}
    </section>
  );
}

function RecommendationCard({ item, labels }: { item: Recommendation; labels: ShelfLabels }) {
  return (
    <li className="flex flex-col rounded-[var(--radius-panel)] border border-hairline bg-ground">
      <div className="flex flex-1 flex-col gap-5 p-5">
        <h3 lang="ja" className="font-jp text-[21px] leading-[1.4] font-medium">
          {item.japaneseTitle}
        </h3>
        <ForecastBlock forecast={item.forecast} labels={labels.forecast} />
        <dl className="mt-auto grid grid-cols-[72px_minmax(0,1fr)] gap-x-4 gap-y-1.5 border-t border-hairline pt-4 text-[15px]">
          <dt className="text-muted">{labels.format}</dt>
          <dd className="m-0">
            <span className="capitalize">{labels.kinds[item.kind]}</span> · {item.extent}
          </dd>
          <dt className="text-muted">{labels.source}</dt>
          <dd className="m-0">{item.source}</dd>
          <dt className="text-muted">{labels.notes}</dt>
          <dd className="m-0 whitespace-pre-line">{item.note}</dd>
        </dl>
      </div>
    </li>
  );
}
