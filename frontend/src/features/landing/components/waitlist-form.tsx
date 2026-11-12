"use client";

import { useWaitlistForm } from "../hooks/use-waitlist-form";
import type { LandingCopy, Locale } from "../types";

type Props = { locale: Locale; copy: LandingCopy["waitlist"] };

export function WaitlistForm({ locale, copy }: Props) {
  const { email, setEmail, status, submit } = useWaitlistForm(locale);
  const message = {
    invalid: copy.invalid,
    done: copy.success,
    closed: copy.closed,
    error: copy.error,
  }[status as "invalid" | "done" | "closed" | "error"];

  return (
    <form
      noValidate
      onSubmit={(event) => {
        event.preventDefault();
        void submit();
      }}
      className="flex flex-col gap-3"
    >
      <div className="flex flex-col gap-2 sm:flex-row">
        <input
          type="email"
          autoComplete="email"
          aria-label={copy.placeholder}
          placeholder={copy.placeholder}
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="min-w-0 flex-1 rounded-[var(--radius-control)] border border-hairline bg-ground px-3.5 py-2.5 text-[16px] text-ink placeholder:text-faint"
        />
        <button
          type="submit"
          disabled={status === "submitting"}
          className="flex-none rounded-[var(--radius-control)] bg-accent px-[18px] py-2.5 text-[15px] text-on-accent transition-colors hover:bg-accent-hover disabled:opacity-60"
        >
          {copy.button}
        </button>
      </div>
      <p aria-live="polite" className="min-h-[1.5em] text-[14px] text-muted">
        {message}
      </p>
      <p className="text-[14px] text-faint">{copy.finePrint}</p>
    </form>
  );
}
