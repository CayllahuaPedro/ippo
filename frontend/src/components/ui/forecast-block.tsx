import { cn } from "@/lib/cn";
import { bandGeometry } from "@/lib/forecast";
import type { Forecast } from "@/lib/types";

export type ForecastBlockLabels = {
  noForecast: string;
  abstains: string;
  understand: (low: number, high: number) => string;
};

export const forecastBlockLabels: ForecastBlockLabels = {
  noForecast: "No forecast",
  abstains: "No forecast · the model abstains on this text",
  understand: (low, high) => `you'll understand · likely ${low}–${high}%`,
};

type ForecastBlockProps = {
  /** `null` when the learner model abstains on this text. */
  forecast: Forecast | null;
  size?: "lg" | "md";
  align?: "start" | "end";
  className?: string;
  labels?: Partial<ForecastBlockLabels>;
};

const numberSize = {
  lg: "text-[56px] sm:text-[72px] lg:text-[88px]",
  md: "text-[44px]",
};

/** Personal comprehension: the one place the page spends colour. The band is
 *  a 0–100 track; its filled stretch is the likely range and the ink tick is
 *  the point estimate. */
export function ForecastBlock({
  forecast,
  size = "md",
  align = "start",
  className,
  labels,
}: ForecastBlockProps) {
  const text = { ...forecastBlockLabels, ...labels };
  const alignment = align === "end" && "lg:items-end lg:text-right";

  if (!forecast) {
    return (
      <div className={cn("flex flex-col", alignment, className)}>
        <p className={cn("leading-none font-normal text-faint", numberSize[size])}>
          <span aria-hidden>—</span>
          <span className="sr-only">{text.noForecast}</span>
        </p>
        <div aria-hidden className="mt-4 h-3 w-full max-w-[320px] bg-track" />
        <p className="mt-2.5 text-[15px] text-faint">
          {text.abstains}
        </p>
      </div>
    );
  }

  const { start, width, marker } = bandGeometry(forecast);

  return (
    <div className={cn("flex flex-col", alignment, className)}>
      <p
        className={cn(
          "leading-none font-medium tracking-[-0.03em] tabular-nums",
          numberSize[size],
        )}
      >
        {forecast.expected}%
      </p>
      <div aria-hidden className="relative mt-4 h-3 w-full max-w-[320px] bg-track">
        <span
          className="absolute inset-y-0 bg-[linear-gradient(90deg,var(--color-forecast-low),var(--color-forecast-mid),var(--color-forecast-high))]"
          style={{ left: `${start}%`, width: `${width}%` }}
        />
        <span
          className="absolute -inset-y-1 w-0.5 -translate-x-1/2 bg-ink"
          style={{ left: `${marker}%` }}
        />
      </div>
      <p className="mt-2.5 text-[15px] text-muted tabular-nums">
        {text.understand(forecast.low, forecast.high)}
      </p>
    </div>
  );
}
