import type { Locale } from "../types";

export class WaitlistClosedError extends Error {
  constructor() {
    super("The waitlist is not open yet");
    this.name = "WaitlistClosedError";
  }
}

export async function joinWaitlist(
  email: string,
  locale: Locale,
  env: string | undefined = process.env.NODE_ENV,
): Promise<void> {
  if (env === "production") throw new WaitlistClosedError();
  console.info("[waitlist:stub]", email, locale);
}
