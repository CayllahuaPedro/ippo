"use client";

import Link from "next/link";
import { TutorPanel, useTutorChat } from "@/features/tutor";
import { passage } from "@/features/reader";
import { learner } from "@/lib/fixtures";

export default function TutorPage() {
  const chat = useTutorChat([], learner);

  return (
    <div className="mx-auto flex h-[calc(100svh-var(--header-h)-var(--tabbar-h))] w-full max-w-[760px] min-h-0 flex-col gap-6 px-4 pt-8 pb-5 sm:px-8 lg:pt-12 lg:pb-8">
      <header className="flex flex-none flex-wrap items-start gap-x-6 gap-y-3">
        <div className="min-w-0 flex-1">
          <h1 className="text-[28px] leading-tight font-medium tracking-[-0.01em] sm:text-[36px]">
            Ask about anything you&apos;re reading
          </h1>
          <p className="mt-2 text-[16px] text-muted">
            The tutor answers at {learner.level}, against the words you already
            know — not with grammar you haven&apos;t met yet.
          </p>
        </div>
        {chat.turns.length > 0 ? (
          <button
            type="button"
            onClick={chat.clear}
            className="flex-none cursor-pointer rounded-[var(--radius-control)] border border-accent bg-ground px-4 py-2 text-[15px] text-accent transition-colors hover:bg-tint"
          >
            Clear
          </button>
        ) : null}
      </header>

      <p className="flex-none border-y border-hairline py-3 text-[15px] text-muted">
        Reading{" "}
        <Link
          href="/reader"
          className="text-accent underline decoration-1 hover:text-accent-hover"
        >
          {passage.title}
        </Link>{" "}
        · page {passage.page} of {passage.pageCount}. Tap a word in the reader to
        bring it here with its dictionary entry attached.
      </p>

      <TutorPanel chat={chat} />
    </div>
  );
}
