import type { WordState } from "../types";

/** Word state reads from the underline's style, never from hue alone:
 *  known carries no mark, learning a dotted rule, selected a solid one. */
export const wordMark: Record<WordState, string> = {
  known: "",
  learning:
    "underline decoration-accent decoration-dotted decoration-2 underline-offset-[0.32em]",
  selected:
    "bg-tint underline decoration-accent decoration-solid decoration-[3px] underline-offset-[0.32em]",
};
