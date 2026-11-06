"use client";

import { useId, useState } from "react";
import { IconArrowUp } from "@/components/ui/icons";

type TutorComposerProps = {
  onSend: (question: string) => void;
  disabled: boolean;
  suggestions: string[];
  placeholder: string;
};

export function TutorComposer({
  onSend,
  disabled,
  suggestions,
  placeholder,
}: TutorComposerProps) {
  const [draft, setDraft] = useState("");
  const inputId = useId();

  const submit = (question: string) => {
    if (disabled || !question.trim()) return;
    onSend(question);
    setDraft("");
  };

  return (
    <div className="flex flex-none flex-col gap-2.5">
      {suggestions.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {suggestions.map((suggestion) => (
            <button
              key={suggestion}
              type="button"
              disabled={disabled}
              onClick={() => submit(suggestion)}
              className="cursor-pointer rounded-[var(--radius-control)] border border-hairline bg-ground px-3.5 py-2 text-[14px] text-ink transition-colors hover:border-accent hover:text-accent disabled:cursor-default disabled:text-faint disabled:hover:border-hairline"
            >
              {suggestion}
            </button>
          ))}
        </div>
      ) : null}

      <form
        onSubmit={(event) => {
          event.preventDefault();
          submit(draft);
        }}
        className="flex items-center gap-2 rounded-[var(--radius-control)] border border-hairline bg-ground py-1.5 pr-1.5 pl-4 transition-colors focus-within:border-accent focus-within:shadow-[0_0_0_1px_var(--color-accent)]"
      >
        <label htmlFor={inputId} className="sr-only">
          Ask the tutor about this sentence
        </label>
        <input
          id={inputId}
          type="text"
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder={placeholder}
          autoComplete="off"
          className="min-w-0 flex-1 bg-transparent text-[16px] text-ink focus:outline-none"
        />
        <button
          type="submit"
          disabled={disabled || !draft.trim()}
          aria-label="Send question"
          className="flex h-10 w-10 flex-none cursor-pointer items-center justify-center rounded-[var(--radius-control)] bg-accent text-on-accent transition-colors hover:bg-accent-hover disabled:cursor-default disabled:bg-track disabled:text-faint"
        >
          <IconArrowUp className="h-[18px] w-[18px]" />
        </button>
      </form>
    </div>
  );
}
