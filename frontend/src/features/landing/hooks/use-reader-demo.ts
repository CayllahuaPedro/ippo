import { useCallback, useMemo, useState } from "react";
import type { Paragraph, TokenPick } from "@/features/reader";
import { demoParagraphs } from "../fixtures";
import { comprehension, setWordState } from "../model/comprehension";

export function useReaderDemo() {
  const [paragraphs, setParagraphs] = useState<Paragraph[]>(demoParagraphs);
  const [pick, setPick] = useState<TokenPick | null>(null);

  const percent = useMemo(() => comprehension(paragraphs), [paragraphs]);

  const entryId = pick?.token.entryId;
  const state = useMemo<"known" | "learning" | null>(() => {
    if (!entryId) return null;
    const live = paragraphs
      .flatMap((paragraph) => paragraph.tokens)
      .find((token) => token.entryId === entryId);
    return live?.state === "learning" ? "learning" : "known";
  }, [paragraphs, entryId]);

  const close = useCallback(() => setPick(null), []);

  const mark = useCallback(
    (next: "known" | "learning") => {
      if (!entryId) return;
      setParagraphs((current) => setWordState(current, entryId, next));
    },
    [entryId],
  );

  return { paragraphs, pick, state, select: setPick, close, mark, percent };
}
