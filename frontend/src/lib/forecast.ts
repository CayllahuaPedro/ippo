import type { Forecast } from "./types";

const clampPercent = (value: number) => Math.min(100, Math.max(0, value));

/** Where the uncertainty band sits on a 0–100 track, in percent. */
export function bandGeometry(forecast: Forecast): {
  start: number;
  width: number;
  marker: number;
} {
  const low = clampPercent(Math.min(forecast.low, forecast.high));
  const high = clampPercent(Math.max(forecast.low, forecast.high));
  return { start: low, width: high - low, marker: clampPercent(forecast.expected) };
}
