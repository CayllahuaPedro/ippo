import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { copy } from "../model/copy";
import { ReaderDemo } from "./reader-demo";

const demo = copy.en.demo;

function setup() {
  render(<ReaderDemo locale="en" copy={demo} />);
  return screen.getByRole("button", { name: "Look up 早起き" });
}

describe("ReaderDemo", () => {
  it("raises the forecast when a word is marked known", async () => {
    const user = userEvent.setup();
    const word = setup();
    await user.click(word);
    await user.click(screen.getByRole("button", { name: demo.markKnown }));
    expect(document.querySelector("[aria-live]")?.textContent).toContain("64%");
  });

  it("reflects the new mark in the popup buttons", async () => {
    const user = userEvent.setup();
    const word = setup();
    await user.click(word);
    await user.click(screen.getByRole("button", { name: demo.markKnown }));
    expect(
      screen.getByRole("button", { name: demo.markKnown }).getAttribute("aria-pressed"),
    ).toBe("true");
    expect(
      screen.getByRole("button", { name: demo.markLearning }).getAttribute("aria-pressed"),
    ).toBe("false");
  });

  it("returns focus to the word on Escape", async () => {
    const user = userEvent.setup();
    const word = setup();
    await user.click(word);
    expect(document.body.textContent).toContain("getting up early");
    await user.keyboard("{Escape}");
    expect(document.body.textContent).not.toContain("getting up early");
    expect(document.activeElement).toBe(word);
  });
});
