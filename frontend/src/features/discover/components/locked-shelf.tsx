import { learner } from "@/lib/fixtures";
import { locked } from "../fixtures";
import { shelfProgress } from "../model/shelves";

export function LockedShelf() {
  const progress = shelfProgress(learner.knownWords, learner.nextShelfAt);

  return (
    <section className="grid grid-cols-1 gap-6 border-t border-hairline pt-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_260px] lg:items-start lg:gap-12">
      <div className="min-w-0">
        <h2 className="text-[22px] leading-tight font-medium">
          Not yet: around{" "}
          <span className="tabular-nums">{learner.nextShelfAt.toLocaleString()}</span> known
          words
        </h2>
        <p className="mt-1 text-[15px] text-muted">
          Two you saved. We&apos;ll move them up as your known count grows.
        </p>
      </div>

      <ul className="m-0 flex list-none flex-col p-0">
        {locked.map((item) => (
          <li
            key={item.id}
            className="flex items-baseline justify-between gap-4 border-b border-hairline py-2.5 first:pt-0"
          >
            <span lang="ja" className="font-jp text-[17px]">
              {item.japaneseTitle}
            </span>
            <span className="text-[15px] text-muted tabular-nums">
              {item.expectedComprehension}% expected
            </span>
          </li>
        ))}
      </ul>

      <div className="flex flex-col gap-2">
        <p className="flex justify-between text-[14px] text-muted tabular-nums">
          <span>{learner.knownWords.toLocaleString()} known</span>
          <span>{learner.nextShelfAt.toLocaleString()}</span>
        </p>
        <div
          role="progressbar"
          aria-valuenow={learner.knownWords}
          aria-valuemin={0}
          aria-valuemax={learner.nextShelfAt}
          aria-label="Progress toward the next shelf"
          className="h-1.5 overflow-hidden bg-track"
        >
          <div className="h-full bg-muted" style={{ width: `${progress}%` }} />
        </div>
      </div>
    </section>
  );
}
