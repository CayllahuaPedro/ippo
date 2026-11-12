import { cn } from "@/lib/cn";
import { wordMark } from "./word-marks";

const entries = [
  { state: "known", label: "known · no mark" },
  { state: "learning", label: "learning · dotted" },
  { state: "selected", label: "selected · solid" },
] as const;

export function WordLegend() {
  return (
    <ul
      aria-label="How words are marked"
      className="m-0 flex list-none flex-wrap gap-x-6 gap-y-2 p-0 text-[14px] text-muted"
    >
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
