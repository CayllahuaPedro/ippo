/** Public surface of the discover feature. */

export { LockedShelf } from "./components/locked-shelf";
export { Shelf, shelfLabels, type ShelfLabels } from "./components/shelf";
export { type KindFilter, matchesFilter, shelfProgress } from "./model/shelves";
export type {
  ContentKind,
  LockedRecommendation,
  Recommendation,
} from "./types";
export { comfortable, locked, stretch } from "./fixtures";
