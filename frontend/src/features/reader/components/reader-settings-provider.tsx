"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ReaderSettingsContext,
  type ReaderSettings,
} from "../hooks/use-reader-settings";
import {
  defaultSettings,
  readSettings,
  writeSettings,
} from "../model/settings-storage";

export function ReaderSettingsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [furigana, setFurigana] = useState(defaultSettings.furigana);
  const [mode, setMode] = useState(defaultSettings.mode);
  // Until storage has been read, the defaults above are placeholders; writing
  // them back would overwrite what the learner chose.
  const [loaded, setLoaded] = useState(false);

  // Read after mount rather than during render: the server has no localStorage,
  // so seeding state from it directly would break hydration.
  useEffect(() => {
    const stored = readSettings();
    setFurigana(stored.furigana);
    setMode(stored.mode);
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    writeSettings({ furigana, mode });
  }, [loaded, furigana, mode]);

  const value = useMemo<ReaderSettings>(
    () => ({ furigana, mode, setFurigana, setMode }),
    [furigana, mode],
  );

  return (
    <ReaderSettingsContext.Provider value={value}>
      {children}
    </ReaderSettingsContext.Provider>
  );
}
