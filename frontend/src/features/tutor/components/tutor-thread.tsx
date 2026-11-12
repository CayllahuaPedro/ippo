"use client";

import { useCallback, useEffect, useRef } from "react";
import { cn } from "@/lib/cn";
import type { TutorTurn as Turn } from "../types";
import { ThinkingDots } from "./thinking-dots";
import { TutorTurn } from "./tutor-turn";

/** How close to the bottom still counts as following along. */
const FOLLOW_THRESHOLD_PX = 48;

type TutorThreadProps = {
  turns: Turn[];
  thinking: boolean;
  waiting: boolean;
  error: string | null;
  onRetry: () => void;
  emptyHint: string;
};

export function TutorThread({
  turns,
  thinking,
  waiting,
  error,
  onRetry,
  emptyHint,
}: TutorThreadProps) {
  const pane = useRef<HTMLDivElement>(null);
  // Whether the reader is following the newest text. Scrolling up to re-read
  // an earlier answer is a decision, and the thread must not drag them back.
  const following = useRef(true);

  const empty = turns.length === 0 && !thinking;

  const onScroll = useCallback(() => {
    const el = pane.current;
    if (!el) return;
    following.current =
      el.scrollHeight - el.scrollTop - el.clientHeight < FOLLOW_THRESHOLD_PX;
  }, []);

  // Jump rather than animate. An answer arrives in many small steps, and a
  // smooth scroll restarted on each one never finishes — which also makes this
  // the behaviour reduced-motion asks for.
  useEffect(() => {
    const el = pane.current;
    if (!el) return;

    // Asking a question is an act of intent: the reader wants to see it and
    // the answer to it, even if they had scrolled up to re-read something.
    if (turns.at(-1)?.role === "learner") following.current = true;

    if (!following.current) return;
    el.scrollTop = el.scrollHeight;
  }, [turns, waiting, error]);

  return (
    <div
      ref={pane}
      onScroll={onScroll}
      role="log"
      aria-live="polite"
      aria-label="Tutor conversation"
      className={cn(
        "flex min-h-0 flex-col gap-[18px] overflow-y-auto overscroll-contain",
        empty ? "flex-none" : "flex-1",
      )}
    >
      {empty ? (
        <p className="max-w-[52ch] text-[15px] text-muted">
          {emptyHint}
        </p>
      ) : null}

      {turns.map((turn) => (
        <TutorTurn key={turn.id} turn={turn} />
      ))}

      {waiting ? <ThinkingDots /> : null}

      {error ? (
        <p
          role="alert"
          className="flex flex-wrap items-center gap-3 self-start rounded-[var(--radius-panel)] border border-hairline px-4 py-3 text-[15px]"
        >
          {error}
          <button
            type="button"
            onClick={onRetry}
            className="cursor-pointer rounded-[var(--radius-control)] border border-accent bg-ground px-3.5 py-1.5 text-[15px] text-accent transition-colors hover:bg-tint"
          >
            Try again
          </button>
        </p>
      ) : null}
    </div>
  );
}
