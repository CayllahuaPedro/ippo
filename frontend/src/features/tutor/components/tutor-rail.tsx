"use client";

import type { TutorChat } from "../hooks/use-tutor-chat";
import { TutorPanel } from "./tutor-panel";

/** The desktop home for the tutor. On phones the same panel arrives in a
 *  sheet instead — see the reader page. */
export function TutorRail({
  chat,
  focusWord,
}: {
  chat: TutorChat;
  focusWord?: string;
}) {
  return (
    <aside
      aria-label="Tutor"
      className="hidden min-w-0 border-l border-hairline bg-ground px-6 py-8 lg:sticky lg:top-[var(--header-h)] lg:flex lg:h-[calc(100svh-var(--header-h))] lg:min-h-0 lg:flex-col lg:gap-5"
    >
      <h2 className="flex-none text-[17px] font-medium">Tutor</h2>

      <TutorPanel chat={chat} focusWord={focusWord} />
    </aside>
  );
}
