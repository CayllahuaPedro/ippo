"use client";

import { cn } from "@/lib/cn";
import type { Paragraph, ReaderMode, Token, WordState } from "../types";
import { wordMark } from "./word-marks";

/* The reading column holds about 36 full-width characters. Dense mode gives up
   its second column below the desktop breakpoint — a phone cannot carry two. */
const modeClass: Record<ReaderMode, string> = {
  learn: "max-w-[36em] text-[20px] leading-[2.3] sm:text-[23px]",
  book: "max-w-[36em] text-[19px] leading-[2.2] sm:text-justify sm:text-[23px]",
  dense:
    "text-[17px] leading-[2] sm:text-[19px] lg:columns-2 lg:gap-12 lg:[column-rule:1px_solid_var(--color-hairline)]",
};

export type TokenPick = {
  key: string;
  token: Token;
  /** Viewport rect of the clicked word, so the popup can anchor to it. */
  rect: DOMRect;
};

type PassageTextProps = {
  paragraphs: Paragraph[];
  mode: ReaderMode;
  selectedTokenId: string | null;
  onSelect: (pick: TokenPick) => void;
};

export function PassageText({
  paragraphs,
  mode,
  selectedTokenId,
  onSelect,
}: PassageTextProps) {
  return (
    <div lang="ja" className={cn("flex flex-col gap-[1.1em] font-jp", modeClass[mode])}>
      {paragraphs.map((paragraph) => (
        <p key={paragraph.id} className="m-0">
          {paragraph.tokens.map((token) => {
            const key = `${paragraph.id}-${token.id}`;
            return (
              <TokenSpan
                key={key}
                tokenKey={key}
                token={token}
                selected={key === selectedTokenId}
                onSelect={onSelect}
              />
            );
          })}
        </p>
      ))}
    </div>
  );
}

function TokenSpan({
  tokenKey,
  token,
  selected,
  onSelect,
}: {
  tokenKey: string;
  token: Token;
  selected: boolean;
  onSelect: (pick: TokenPick) => void;
}) {
  const body = token.segments.map((segment, index) =>
    segment.reading ? (
      <ruby key={index}>
        {segment.base}
        <rt>{segment.reading}</rt>
      </ruby>
    ) : (
      <span key={index}>{segment.base}</span>
    ),
  );

  if (!token.entryId) {
    return <>{body}</>;
  }

  const state: WordState = selected ? "selected" : (token.state ?? "known");
  const plain = token.segments.map((segment) => segment.base).join("");

  return (
    <button
      type="button"
      onClick={(event) =>
        onSelect({
          key: tokenKey,
          token,
          rect: event.currentTarget.getBoundingClientRect(),
        })
      }
      aria-pressed={selected}
      aria-label={`Look up ${plain}`}
      className={cn(
        "cursor-pointer rounded-[3px] transition-colors hover:bg-tint",
        wordMark[state],
      )}
    >
      {body}
    </button>
  );
}
