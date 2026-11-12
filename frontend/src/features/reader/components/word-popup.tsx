"use client";

import { useEffect, useRef } from "react";
import { IconClose } from "@/components/ui/icons";
import { cn } from "@/lib/cn";
import { POPUP_WIDTH } from "../model/popup-position";
import type { DictionaryEntry, WordState } from "../types";
import { wordMark } from "./word-marks";

export type WordEntryLabels = {
  derivation: string;
  cardFront: string;
  cardBack: string;
  frequencyRank: string;
  addToSrs: string;
  inSrs: string;
  askTutor: string;
  states: Record<WordState, string>;
};

export const wordEntryLabels: WordEntryLabels = {
  derivation: "From the form in the text to the dictionary form",
  cardFront: "Card front",
  cardBack: "back: gloss and this sentence",
  frequencyRank: "frequency rank",
  addToSrs: "Add to SRS",
  inSrs: "In your SRS",
  askTutor: "Ask the tutor",
  states: { known: "known", learning: "learning", selected: "selected" },
};

type WordEntryProps = {
  entry: DictionaryEntry;
  onAddToSrs: (entry: DictionaryEntry) => void;
  onAskTutor: (entry: DictionaryEntry) => void;
  added: boolean;
  labels?: Partial<WordEntryLabels>;
};

/** The dictionary entry itself. It is placed by a popup beside the word on a
 *  desktop and by a sheet on a phone, but reads the same in both. */
export function WordEntry({
  entry,
  onAddToSrs,
  onAskTutor,
  added,
  labels,
}: WordEntryProps) {
  const text = { ...wordEntryLabels, ...labels };

  return (
    <>
      <div className="pr-8">
        <h2 lang="ja" className="font-jp text-[34px] leading-[1.15] font-medium">
          {entry.lemma}
        </h2>
        <p className="mt-1.5 flex flex-wrap items-baseline gap-x-2 text-[15px] text-muted">
          <PitchReading kana={entry.kana} drop={entry.pitchDrop} />
          <span aria-hidden>·</span>
          <span>{entry.pitchLabel}</span>
          <span aria-hidden>·</span>
          <span className={cn("text-ink", wordMark[entry.state])}>{text.states[entry.state]}</span>
        </p>
      </div>

      <p className="text-[17px] leading-[1.5]">{entry.glosses.join("; ")}</p>

      {entry.derivation.length > 1 ? (
        <ol
          lang="ja"
          aria-label={text.derivation}
          className="m-0 flex list-none flex-wrap items-center gap-x-2 gap-y-1 p-0 font-jp text-[16px] text-muted"
        >
          {entry.derivation.map((step, index) => {
            const isLemma = index === entry.derivation.length - 1;
            return (
              <li key={step} className="flex items-center gap-2">
                <span className={cn(isLemma && "font-medium text-ink")}>{step}</span>
                {isLemma ? null : <span aria-hidden>→</span>}
              </li>
            );
          })}
        </ol>
      ) : null}

      {entry.kanji ? (
        <div className="flex items-center gap-4 border-t border-hairline pt-4">
          <span lang="ja" className="flex-none font-jp text-[40px] leading-none">
            {entry.kanji.character}
          </span>
          <div className="flex min-w-0 flex-col gap-1">
            <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[15px]">
              {entry.kanji.components.map((component, index) => (
                <span key={component.glyph} className="flex items-center gap-2">
                  {index > 0 ? (
                    <span aria-hidden className="text-muted">
                      +
                    </span>
                  ) : null}
                  <span>
                    <span lang="ja" className="font-jp">
                      {component.glyph}
                    </span>{" "}
                    <span className="text-muted">{component.meaning}</span>
                  </span>
                </span>
              ))}
            </p>
            <p lang="ja" className="font-jp text-[14px] text-muted">
              {entry.kanji.readings}
            </p>
          </div>
        </div>
      ) : null}

      <div className="flex flex-col gap-3 border-t border-hairline pt-4">
        <p className="text-[14px] text-muted">
          {text.cardFront}{" "}
          <span lang="ja" className="font-jp text-ink">
            {entry.lemma}
          </span>{" "}
          · {text.cardBack} · {text.frequencyRank}{" "}
          <span className="tabular-nums">{entry.frequencyRank.toLocaleString()}</span>
        </p>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={() => onAddToSrs(entry)}
            disabled={added}
            className="flex-1 cursor-pointer rounded-[var(--radius-control)] border border-accent bg-accent px-5 py-2.5 text-center text-[15px] whitespace-nowrap text-on-accent transition-colors hover:bg-accent-hover disabled:cursor-default disabled:border-hairline disabled:bg-wash disabled:text-muted"
          >
            {added ? text.inSrs : text.addToSrs}
          </button>
          <button
            type="button"
            onClick={() => onAskTutor(entry)}
            className="cursor-pointer rounded-[var(--radius-control)] border border-accent bg-ground px-5 py-2.5 text-[15px] whitespace-nowrap text-accent transition-colors hover:bg-tint"
          >
            {text.askTutor}
          </button>
        </div>
      </div>
    </>
  );
}

type WordPopupProps = WordEntryProps & {
  /** Offset within the reading pane, already clamped by the caller. */
  position: { left: number; top: number };
  onClose: () => void;
};

export function WordPopup({ position, onClose, ...entryProps }: WordPopupProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  useEffect(() => {
    ref.current?.focus();
  }, [entryProps.entry.id]);

  return (
    <div
      ref={ref}
      role="dialog"
      aria-label={`${entryProps.entry.lemma} — dictionary entry`}
      tabIndex={-1}
      style={{ left: position.left, top: position.top, width: POPUP_WIDTH }}
      className="absolute z-20 hidden flex-col gap-4 rounded-[var(--radius-panel)] border border-hairline bg-ground p-[22px] text-ink shadow-[var(--shadow-float)] focus:outline-none lg:flex"
    >
      <WordEntry {...entryProps} />

      <button
        type="button"
        onClick={onClose}
        aria-label="Close dictionary entry"
        className="absolute top-3 right-3 flex h-9 w-9 cursor-pointer items-center justify-center rounded-[var(--radius-control)] text-muted transition-colors hover:bg-wash hover:text-ink"
      >
        <IconClose className="h-[18px] w-[18px]" />
      </button>
    </div>
  );
}

/** Draws the pitch contour: mora stay high through the drop, then fall. */
function PitchReading({ kana, drop }: { kana: string; drop: number | null }) {
  const mora = Array.from(kana);

  return (
    <span lang="ja" className="font-jp text-[16px] text-ink">
      {mora.map((character, index) => (
        <span
          key={index}
          className={drop !== null && index === drop ? "border-t-2 border-ink pt-px" : undefined}
        >
          {character}
        </span>
      ))}
    </span>
  );
}
