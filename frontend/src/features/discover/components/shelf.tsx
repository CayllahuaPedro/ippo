import { ForecastBlock } from "@/components/ui/forecast-block";
import { cn } from "@/lib/cn";
import type { Recommendation } from "../types";

type ShelfProps = {
  title: string;
  band: string;
  guidance: string;
  tone: "comfortable" | "stretch";
  items: Recommendation[];
  stacked?: boolean;
};

export function Shelf({ title, band, guidance, items, stacked = false }: ShelfProps) {
  return (
    <section className="flex flex-col gap-6">
      <header className="flex flex-col gap-1">
        <h2 className="text-[22px] leading-tight font-medium">{title}</h2>
        <p className="text-[15px] text-muted">
          <span className="tabular-nums">{band}</span> · {guidance}
        </p>
      </header>

      {items.length === 0 ? (
        <p className="text-[15px] text-faint">Nothing of this type on this shelf.</p>
      ) : (
        <ul
          className={cn(
            "m-0 grid list-none grid-cols-1 gap-6 p-0",
            !stacked && "md:grid-cols-2 lg:grid-cols-3",
          )}
        >
          {items.map((item) => (
            <RecommendationCard key={item.id} item={item} />
          ))}
        </ul>
      )}
    </section>
  );
}

function RecommendationCard({ item }: { item: Recommendation }) {
  return (
    <li className="flex flex-col rounded-[var(--radius-panel)] border border-hairline bg-ground">
      <div className="flex flex-1 flex-col gap-5 p-5">
        <h3 lang="ja" className="font-jp text-[21px] leading-[1.4] font-medium">
          {item.japaneseTitle}
        </h3>
        <ForecastBlock forecast={item.forecast} />
        <dl className="mt-auto grid grid-cols-[72px_minmax(0,1fr)] gap-x-4 gap-y-1.5 border-t border-hairline pt-4 text-[15px]">
          <dt className="text-muted">Format</dt>
          <dd className="m-0">
            <span className="capitalize">{item.kind}</span> · {item.extent}
          </dd>
          <dt className="text-muted">Source</dt>
          <dd className="m-0">{item.source}</dd>
          <dt className="text-muted">Notes</dt>
          <dd className="m-0 whitespace-pre-line">{item.note}</dd>
        </dl>
      </div>
    </li>
  );
}
