"use client";

import { useCallback, useLayoutEffect, useRef, useState } from "react";
import { useMediaQuery } from "@/hooks/use-media-query";
import {
  DisplaySettings,
  PassageText,
  popupPosition,
  type TokenPick,
  dictionary,
  passage,
  useReaderSettings,
  WordEntry,
  WordLegend,
  WordPopup,
} from "@/features/reader";
import {
  TutorPanel,
  TutorRail,
  tutorThread,
  useTutorChat,
} from "@/features/tutor";
import { ForecastBlock } from "@/components/ui/forecast-block";
import { IconChat } from "@/components/ui/icons";
import { Segmented } from "@/components/ui/segmented";
import { Sheet } from "@/components/ui/sheet";
import { learner } from "@/lib/fixtures";
import type {
  DictionaryEntry,
  FuriganaMode,
  ReaderMode,
} from "@/features/reader";

/** Matches the `lg:` breakpoint the layout switches on. */
const DESKTOP = "(min-width: 1024px)";

const modeOptions: { value: ReaderMode; label: string }[] = [
  { value: "learn", label: "Learn" },
  { value: "book", label: "Book" },
  { value: "dense", label: "Dense" },
];

const furiganaOptions: { value: FuriganaMode; label: string }[] = [
  { value: "hover", label: "On hover" },
  { value: "always", label: "Always" },
  { value: "off", label: "Off" },
];

export default function ReaderPage() {
  const { furigana, setFurigana, mode, setMode } = useReaderSettings();
  // The sheets open a real modal dialog, which must never happen on a desktop
  // where the rail and the popup already carry the same content.
  const isDesktop = useMediaQuery(DESKTOP);
  const paneRef = useRef<HTMLDivElement>(null);
  const [pick, setPick] = useState<TokenPick | null>(null);
  const [position, setPosition] = useState({ left: 0, top: 0 });
  const [srsAdditions, setSrsAdditions] = useState<string[]>([]);
  const [tutorOpen, setTutorOpen] = useState(false);
  // Survives the dictionary closing, so a word handed to the tutor stays the
  // subject of the conversation until another word takes its place.
  const [tutorFocus, setTutorFocus] = useState<string | null>(null);

  const entry = pick?.token.entryId ? dictionary[pick.token.entryId] : null;
  const focusWord = entry?.lemma ?? tutorFocus ?? undefined;
  const chat = useTutorChat(tutorThread, learner, focusWord);

  // Measure before paint so the popup never flashes at the wrong offset.
  useLayoutEffect(() => {
    const pane = paneRef.current;
    if (!pick || !pane) return;

    setPosition(popupPosition(pick.rect, pane.getBoundingClientRect()));
  }, [pick]);

  const paragraphs =
    mode === "learn" ? passage.paragraphs.slice(0, 1) : passage.paragraphs;

  const addToSrs = useCallback((added: DictionaryEntry) => {
    setSrsAdditions((current) =>
      current.includes(added.id) ? current : [...current, added.id],
    );
  }, []);

  // Handing a word to the tutor closes the dictionary: the question is already
  // about that word, so keeping both surfaces open just buries the answer.
  const askTutorAbout = useCallback(
    (asked: DictionaryEntry) => {
      setPick(null);
      setTutorFocus(asked.lemma);
      setTutorOpen(true);
      chat.send(`Explain ${asked.lemma} in this sentence`, asked.lemma);
    },
    [chat],
  );

  const selectToken = useCallback((next: TokenPick) => {
    setTutorFocus(null);
    setPick(next);
  }, []);

  const entryProps = entry
    ? {
        entry,
        onAddToSrs: addToSrs,
        onAskTutor: askTutorAbout,
        added: srsAdditions.includes(entry.id),
      }
    : null;

  return (
    <div className="grid flex-1 grid-cols-1 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start">
      <div
        ref={paneRef}
        data-furi={furigana}
        className="relative flex min-w-0 flex-col px-4 pt-8 pb-28 sm:px-8 lg:px-12 lg:pt-10 lg:pb-14"
      >
        <header className="flex flex-col gap-8 pb-8 lg:flex-row lg:items-end lg:justify-between lg:gap-12 lg:pb-10">
          <h1
            lang="ja"
            className="min-w-0 font-jp text-[40px] leading-[1.1] font-medium tracking-[0.01em] sm:text-[56px]"
          >
            {passage.japaneseTitle}
            <span
              lang="en"
              className="mt-3 block font-sans text-[20px] leading-snug font-normal tracking-normal text-muted sm:text-[24px]"
            >
              {passage.title}
            </span>
          </h1>
          <ForecastBlock
            forecast={passage.forecast}
            size="lg"
            align="end"
            className="flex-none lg:w-[320px]"
          />
        </header>

        <div className="grid grid-cols-1 gap-6 border-t border-hairline pt-6 xl:grid-cols-[140px_minmax(0,1fr)] xl:gap-10 xl:pt-9">
          <aside
            aria-label="About this text"
            className="flex flex-wrap gap-x-4 gap-y-1 text-[14px] leading-[1.9] text-muted xl:flex-col xl:gap-0"
          >
            <span>{passage.kicker}</span>
            <span>Text level {passage.textLevel}</span>
            <span className="tabular-nums">{passage.unknownOnPage} unknown on page</span>
            <span className="tabular-nums">
              Page {passage.page} of {passage.pageCount}
            </span>
            {srsAdditions.length > 0 ? (
              <span className="tabular-nums">
                {srsAdditions.length} added to SRS this session
              </span>
            ) : null}
            <span className="basis-full text-faint xl:mt-4 xl:basis-auto xl:leading-[1.6]">
              Sample passage and forecasts: fixtures until the learner model is
              connected.
            </span>
          </aside>

          <div className="flex min-w-0 flex-col gap-8">
            <div className="flex flex-wrap items-center gap-3">
              <Segmented
                label="Reading mode"
                size="sm"
                value={mode}
                options={modeOptions}
                onChange={setMode}
              />
              <span className="flex-1" />
              <DisplaySettings />
              <div className="hidden items-center gap-3 lg:flex">
                <span aria-hidden className="text-[14px] text-muted">
                  Furigana
                </span>
                <Segmented
                  label="Furigana"
                  size="sm"
                  value={furigana}
                  options={furiganaOptions}
                  onChange={setFurigana}
                />
              </div>
            </div>

            <PassageText
              paragraphs={paragraphs}
              mode={mode}
              selectedTokenId={pick?.key ?? null}
              onSelect={selectToken}
            />

            <div className="border-t border-hairline pt-5">
              <WordLegend />
            </div>
          </div>
        </div>

        {entryProps && isDesktop ? (
          <WordPopup
            {...entryProps}
            position={position}
            onClose={() => setPick(null)}
          />
        ) : null}
      </div>

      <TutorRail chat={chat} focusWord={focusWord} />

      {!isDesktop ? (
        <>
          <button
            type="button"
            onClick={() => setTutorOpen(true)}
            className="fixed right-4 bottom-[calc(var(--tabbar-h)+16px+env(safe-area-inset-bottom))] z-30 flex cursor-pointer items-center gap-2 rounded-[var(--radius-control)] bg-accent px-[18px] py-3 text-[15px] text-on-accent shadow-[var(--shadow-float)] transition-colors hover:bg-accent-hover"
          >
            <IconChat className="h-[18px] w-[18px]" />
            Ask the tutor
          </button>

          <Sheet
            open={tutorOpen}
            onClose={() => setTutorOpen(false)}
            label="Tutor"
            height="82svh"
          >
            <TutorPanel
              chat={chat}
              focusWord={focusWord}
              className="px-4 pt-2 pb-[max(1.25rem,env(safe-area-inset-bottom))]"
            />
          </Sheet>

          <Sheet
            open={Boolean(entryProps)}
            onClose={() => setPick(null)}
            label={entry ? `${entry.lemma} — dictionary entry` : "Dictionary entry"}
            height="auto"
          >
            {entryProps ? (
              <div className="flex flex-col gap-4 overflow-y-auto px-4 pt-3 pb-[max(1.25rem,env(safe-area-inset-bottom))]">
                <WordEntry {...entryProps} />
              </div>
            ) : null}
          </Sheet>
        </>
      ) : null}
    </div>
  );
}
