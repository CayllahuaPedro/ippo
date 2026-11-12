import type { Paragraph, WordState } from "@/features/reader";

export function comprehension(paragraphs: Paragraph[]): number {
  const words = paragraphs
    .flatMap((paragraph) => paragraph.tokens)
    .filter((token) => token.entryId);
  if (words.length === 0) return 0;

  const known = words.filter((token) => (token.state ?? "known") === "known");
  return Math.round((100 * known.length) / words.length);
}

export function setWordState(
  paragraphs: Paragraph[],
  entryId: string,
  state: WordState,
): Paragraph[] {
  return paragraphs.map((paragraph) => ({
    ...paragraph,
    tokens: paragraph.tokens.map((token) =>
      token.entryId === entryId ? { ...token, state } : token,
    ),
  }));
}
