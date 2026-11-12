/** Types shared across features. Anything only one feature needs belongs
 *  in that feature's own `types.ts`. */

export type LearnerSummary = {
  knownWords: number;
  level: string;
  knownToday: number;
  srsDue: number;
  finishedTexts: number;
  /** Known-word count the locked shelf unlocks at. */
  nextShelfAt: number;
};

/** Expected personal comprehension of a text, in percent, with the range the
 *  learner model considers likely. `null` where it is used means the model
 *  abstains. */
export type Forecast = {
  expected: number;
  low: number;
  high: number;
};
