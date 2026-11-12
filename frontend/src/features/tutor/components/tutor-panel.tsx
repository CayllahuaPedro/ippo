"use client";

import { cn } from "@/lib/cn";
import type { TutorChat } from "../hooks/use-tutor-chat";
import { tutorSuggestions } from "../fixtures";
import { tutorSource } from "../model/stream";
import { TutorComposer } from "./tutor-composer";
import { TutorThread } from "./tutor-thread";

type TutorPanelProps = {
  chat: TutorChat;
  /** Word the reader currently has open, shown so the answer's scope is visible. */
  focusWord?: string;
  className?: string;
};

export function TutorPanel({ chat, focusWord, className }: TutorPanelProps) {
  return (
    <div className={cn("flex min-h-0 flex-1 flex-col gap-5", className)}>
      {focusWord ? (
        <p className="flex-none border-b border-hairline pb-3 text-[15px] text-muted">
          Answering about{" "}
          <span lang="ja" className="font-jp text-[17px] text-ink">
            {focusWord}
          </span>
        </p>
      ) : null}

      <TutorThread
        turns={chat.turns}
        thinking={chat.thinking}
        waiting={chat.waiting}
        error={chat.error}
        onRetry={chat.retry}
        emptyHint="Nothing asked yet. A word tapped in the reader comes along as the subject of your question, so “why this form?” is enough."
      />

      <TutorComposer
        onSend={chat.send}
        disabled={chat.thinking}
        suggestions={chat.thinking ? [] : tutorSuggestions}
        placeholder="Ask about this sentence…"
      />

      {tutorSource === "mock" ? (
        <p className="flex-none text-center text-[14px] text-muted">
          Canned answers — set NEXT_PUBLIC_TUTOR_API to reach the real tutor.
        </p>
      ) : null}
    </div>
  );
}
