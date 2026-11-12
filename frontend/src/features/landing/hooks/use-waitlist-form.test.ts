import { act, renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { WaitlistClosedError } from "../model/waitlist";
import { useWaitlistForm } from "./use-waitlist-form";

function setup(join: (email: string, locale: "en" | "es") => Promise<void>) {
  return renderHook(() => useWaitlistForm("es", join));
}

describe("useWaitlistForm", () => {
  it("flags an invalid email without joining", async () => {
    const join = vi.fn().mockResolvedValue(undefined);
    const { result } = setup(join);
    act(() => result.current.setEmail("nope"));
    await act(() => result.current.submit());
    expect(result.current.status).toBe("invalid");
    expect(join).not.toHaveBeenCalled();
  });

  it("joins with the normalized email and locale", async () => {
    const join = vi.fn().mockResolvedValue(undefined);
    const { result } = setup(join);
    act(() => result.current.setEmail(" Ana@Mail.com "));
    await act(() => result.current.submit());
    expect(join).toHaveBeenCalledTimes(1);
    expect(join).toHaveBeenCalledWith("ana@mail.com", "es");
    expect(result.current.status).toBe("done");
  });

  it("reports closed when the waitlist is closed", async () => {
    const join = vi.fn().mockRejectedValue(new WaitlistClosedError());
    const { result } = setup(join);
    act(() => result.current.setEmail("ana@mail.com"));
    await act(() => result.current.submit());
    expect(result.current.status).toBe("closed");
  });

  it("reports error for any other failure", async () => {
    const join = vi.fn().mockRejectedValue(new Error("boom"));
    const { result } = setup(join);
    act(() => result.current.setEmail("ana@mail.com"));
    await act(() => result.current.submit());
    expect(result.current.status).toBe("error");
  });

  it("ignores a second submit while submitting", async () => {
    const join = vi.fn().mockReturnValue(new Promise<void>(() => {}));
    const { result } = setup(join);
    act(() => result.current.setEmail("ana@mail.com"));
    await act(async () => {
      void result.current.submit();
      void result.current.submit();
    });
    expect(join).toHaveBeenCalledTimes(1);
    expect(result.current.status).toBe("submitting");
  });
});
