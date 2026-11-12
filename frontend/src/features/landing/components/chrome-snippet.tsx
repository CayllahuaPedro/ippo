"use client";

import { WordEntry, dictionary } from "@/features/reader";

const noop = () => {};

export function ChromeSnippet() {
  return (
    <div className="flex flex-col gap-3">
      <div className="rounded-[var(--radius-panel)] border border-hairline bg-ground px-4 py-3">
        <p lang="ja" className="font-jp text-[16px] leading-[1.8]">
          早起きは三文の徳と言いますが、なかなか起きられません。
        </p>
        <p lang="ja" className="font-jp text-[16px] leading-[1.8]">
          ゆきが降る朝は、特に布団から出たくない。
        </p>
      </div>
      <div className="rounded-[var(--radius-panel)] border border-hairline bg-ground px-4 py-3">
        <WordEntry entry={dictionary.yuki} added={false} onAddToSrs={noop} onAskTutor={noop} />
      </div>
    </div>
  );
}
