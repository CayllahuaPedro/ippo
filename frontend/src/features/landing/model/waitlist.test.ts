import { afterEach, describe, expect, it, vi } from "vitest";
import { WaitlistClosedError, joinWaitlist } from "./waitlist";

describe("joinWaitlist", () => {
  afterEach(() => vi.restoreAllMocks());

  it("rejects with WaitlistClosedError in production", async () => {
    await expect(joinWaitlist("ana@mail.com", "en", "production")).rejects.toBeInstanceOf(
      WaitlistClosedError,
    );
  });

  it("logs the stub and resolves outside production", async () => {
    const info = vi.spyOn(console, "info").mockImplementation(() => {});
    await expect(joinWaitlist("ana@mail.com", "es", "development")).resolves.toBeUndefined();
    expect(info).toHaveBeenCalledWith("[waitlist:stub]", "ana@mail.com", "es");
  });
});
