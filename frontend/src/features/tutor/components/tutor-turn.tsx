import type { StreamingBlock, TutorTurn as Turn } from "../types";

/** A tutor answer is prose plus quoted Japanese, never one undifferentiated
 *  paragraph. Quoted lines sit in their own hairline frame and Japanese face so
 *  the eye can find the language without reading the explanation around it. */
export function TutorTurn({ turn }: { turn: Turn }) {
  if (turn.role === "learner") {
    return (
      <p className="max-w-[85%] self-end rounded-[var(--radius-panel)] bg-wash px-4 py-3 text-[16px] leading-[1.5]">
        {turn.text}
      </p>
    );
  }

  return (
    <div className="flex max-w-[96%] flex-col gap-3 self-start text-[16px] leading-[1.6]">
      {turn.blocks.map((block) => (
        <Block key={block.index} block={block} />
      ))}
    </div>
  );
}

function Block({ block }: { block: StreamingBlock }) {
  if (block.kind === "prose") {
    return (
      <p>
        {block.text}
        {block.done ? null : <Caret />}
      </p>
    );
  }

  // Japanese arrives whole, so there is never a half-written sentence to show —
  // only the moment before it lands.
  if (!block.done) {
    return (
      <span
        aria-hidden
        className="h-[58px] animate-pulse rounded-[var(--radius-panel)] bg-wash"
      />
    );
  }

  return (
    <p className="flex flex-col gap-1 rounded-[var(--radius-panel)] border border-hairline px-4 py-3">
      <span lang="ja" className="font-jp text-[19px] leading-[1.7]">
        {block.japanese}
      </span>
      <span className="text-[15px] text-muted">{block.gloss}</span>
    </p>
  );
}

function Caret() {
  return (
    <span
      aria-hidden
      className="ml-0.5 inline-block h-[1em] w-[2px] translate-y-[2px] animate-[caret_1s_step-end_infinite] bg-ink"
    />
  );
}
