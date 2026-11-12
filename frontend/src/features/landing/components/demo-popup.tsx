"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import { POPUP_WIDTH } from "@/features/reader";
import { cn } from "@/lib/cn";
import type { DemoEntry } from "../fixtures";
import type { LandingCopy, Locale } from "../types";

type DemoPopupProps = {
  entry: DemoEntry;
  state: "known" | "learning";
  copy: LandingCopy["demo"];
  locale: Locale;
  position: { left: number; top: number };
  onMark: (state: "known" | "learning") => void;
  onClose: () => void;
};

export function DemoPopup({
  entry,
  state,
  copy,
  locale,
  position,
  onMark,
  onClose,
}: DemoPopupProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const opener = document.activeElement;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as Node;
      if (ref.current?.contains(target) || opener?.contains(target)) return;
      onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
      if (opener instanceof HTMLElement) opener.focus();
    };
  }, [onClose]);

  const marks = [
    { state: "known", label: copy.markKnown },
    { state: "learning", label: copy.markLearning },
  ] as const;

  const style = {
    "--popup-left": `${position.left}px`,
    "--popup-top": `${position.top}px`,
    "--popup-width": `${POPUP_WIDTH}px`,
  } as CSSProperties;

  return (
    <div
      ref={ref}
      role="dialog"
      aria-label={entry.lemma}
      style={style}
      className={cn(
        "mt-4 border border-hairline bg-ground p-4",
        "lg:absolute lg:left-(--popup-left) lg:top-(--popup-top) lg:z-10 lg:mt-0 lg:w-(--popup-width)",
      )}
    >
      <p className="m-0 flex items-baseline gap-3">
        <span lang="ja" className="font-jp text-[24px] text-ink">
          {entry.lemma}
        </span>
        <span lang="ja" className="font-jp text-[15px] text-muted">
          {entry.kana}
        </span>
      </p>
      <p className="m-0 mt-1 text-[15px] text-ink">{entry.gloss[locale]}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {marks.map((mark) => (
          <button
            key={mark.state}
            type="button"
            aria-pressed={state === mark.state}
            onClick={() => onMark(mark.state)}
            className={cn(
              "cursor-pointer border border-hairline px-3 py-1.5 text-[14px] text-ink",
              state === mark.state && "border-accent bg-tint",
            )}
          >
            {mark.label}
          </button>
        ))}
      </div>
    </div>
  );
}
