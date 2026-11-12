import { useRef, useState } from "react";
import { normalizeEmail } from "../model/email";
import { WaitlistClosedError, joinWaitlist } from "../model/waitlist";
import type { Locale } from "../types";

export type WaitlistStatus = "idle" | "invalid" | "submitting" | "done" | "closed" | "error";

export function useWaitlistForm(locale: Locale, join = joinWaitlist) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<WaitlistStatus>("idle");
  const submitting = useRef(false);

  async function submit() {
    if (submitting.current) return;
    const normalized = normalizeEmail(email);
    if (!normalized) {
      setStatus("invalid");
      return;
    }
    submitting.current = true;
    setStatus("submitting");
    try {
      await join(normalized, locale);
      setStatus("done");
    } catch (error) {
      setStatus(error instanceof WaitlistClosedError ? "closed" : "error");
    } finally {
      submitting.current = false;
    }
  }

  return { email, setEmail, status, submit };
}
