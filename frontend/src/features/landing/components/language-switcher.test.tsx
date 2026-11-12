import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { LanguageSwitcher } from "./language-switcher";

function setup() {
  window.location.hash = "#method";
  const assign = vi.fn();
  vi.spyOn(window, "location", "get").mockReturnValue({
    ...window.location,
    hash: "#method",
    assign,
  });
  render(<LanguageSwitcher locale="en" label="Language" />);
  return { assign, link: screen.getByRole("link", { name: "ES" }) };
}

describe("LanguageSwitcher", () => {
  afterEach(() => vi.restoreAllMocks());

  it("carries the hash on a plain click", () => {
    const { assign, link } = setup();
    fireEvent.click(link, { button: 0 });
    expect(assign).toHaveBeenCalledWith("/es#method");
  });

  it("leaves modified and non-primary clicks to the browser", () => {
    const { assign, link } = setup();
    fireEvent.click(link, { ctrlKey: true });
    fireEvent.click(link, { metaKey: true });
    fireEvent.click(link, { shiftKey: true });
    fireEvent.click(link, { altKey: true });
    fireEvent.click(link, { button: 1 });
    expect(assign).not.toHaveBeenCalled();
  });
});
