import { useCallback, useMemo, useState } from "react";
import type { Paragraph, TokenPick } from "@/features/reader";
import { demoParagraphs } from "../fixtures";
import { comprehension, setWordState } from "../model/comprehension";

export function useReaderDemo() {
  const [paragraphs, setParagraphs] = useState<Paragraph[]>(demoParagraphs);
  const [pick, setPick] = useState<TokenPick | null>(null);

  const percent = useMemo(() => comprehension(paragraphs), [paragraphs]);

  const close = useCallback(() => setPick(null), []);

  const mark = useCallback(
    (state: "known" | "learning") => {
      const entryId = pick?.token.entryId;
      if (!entryId) return;
      setParagraphs((current) => setWordState(current, entryId, state));
    },
    [pick],
  );

  return { paragraphs, pick, select: setPick, close, mark, percent };
}
