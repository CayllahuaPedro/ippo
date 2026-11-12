"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { PassageText, popupPosition } from "@/features/reader";
import { demoGlossary } from "../fixtures";
import { useReaderDemo } from "../hooks/use-reader-demo";
import { formatForecast } from "../model/copy";
import type { LandingCopy, Locale } from "../types";
import { DemoLegend } from "./demo-legend";
import { DemoPopup } from "./demo-popup";

type ReaderDemoProps = { locale: Locale; copy: LandingCopy["demo"] };

export function ReaderDemo({ locale, copy }: ReaderDemoProps) {
  const { paragraphs, pick, state, select, close, mark, percent } = useReaderDemo();
  const paneRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ left: 0, top: 0 });

  useLayoutEffect(() => {
    const pane = paneRef.current;
    if (!pick || !pane) return;
    setPosition(popupPosition(pick.rect, pane.getBoundingClientRect()));
  }, [pick]);

  const entryId = pick?.token.entryId;
  const entry = entryId ? demoGlossary[entryId] : null;

  return (
    <div
      ref={paneRef}
      data-furi="hover"
      className="relative border border-hairline bg-ground p-4 sm:p-8"
    >
      <p aria-live="polite" className="m-0 text-[16px] text-ink">
        {formatForecast(copy.forecast, percent)}
      </p>
      <div className="mt-3 h-1 bg-tint">
        <div className="h-full bg-accent" style={{ width: `${percent}%` }} />
      </div>
      <div className="mt-6">
        <PassageText
          paragraphs={paragraphs}
          mode="learn"
          selectedTokenId={pick?.key ?? null}
          onSelect={select}
        />
      </div>
      {entry && state && (
        <DemoPopup
          entry={entry}
          state={state}
          copy={copy}
          locale={locale}
          position={position}
          onMark={mark}
          onClose={close}
        />
      )}
      <p className="m-0 mt-4 text-[14px] text-muted">{copy.hint}</p>
      <div className="mt-4">
        <DemoLegend copy={copy} />
      </div>
    </div>
  );
}
