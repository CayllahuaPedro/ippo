"use client";

import { createContext, useContext } from "react";
import type { FuriganaMode, ReaderMode } from "../types";

export type ReaderSettings = {
  furigana: FuriganaMode;
  mode: ReaderMode;
  setFurigana: (value: FuriganaMode) => void;
  setMode: (value: ReaderMode) => void;
};

/** Exported for the provider only; consumers go through the hook. */
export const ReaderSettingsContext = createContext<ReaderSettings | null>(null);

export function useReaderSettings(): ReaderSettings {
  const value = useContext(ReaderSettingsContext);
  if (!value) {
    throw new Error("useReaderSettings must be used inside ReaderSettingsProvider");
  }
  return value;
}
