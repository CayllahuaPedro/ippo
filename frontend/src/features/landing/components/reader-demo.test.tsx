import { act, fireEvent, render, screen } from "@testing-library/react";
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

  it("moves focus into the dialog when a word opens", async () => {
    const user = userEvent.setup();
    const word = setup();
    await user.click(word);
    expect(document.activeElement).toBe(screen.getByRole("dialog"));
  });

  it("closes from the close button and returns focus to the word", async () => {
    const user = userEvent.setup();
    const word = setup();
    await user.click(word);
    await user.click(screen.getByRole("button", { name: demo.close }));
    expect(screen.queryByRole("dialog")).toBeNull();
    expect(document.activeElement).toBe(word);
  });

  it("closes on an outside tap when the opener was never focused", () => {
    const word = setup();
    fireEvent.click(word);
    expect(screen.getByRole("dialog")).toBeTruthy();
    fireEvent.pointerDown(document.body);
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("keeps focus elsewhere when Escape is pressed outside the popup", async () => {
    const user = userEvent.setup();
    render(
      <>
        <input aria-label="elsewhere" />
        <ReaderDemo locale="en" copy={demo} />
      </>,
    );
    await user.click(screen.getByRole("button", { name: "Look up 早起き" }));
    const other = screen.getByLabelText("elsewhere");
    act(() => other.focus());
    await user.keyboard("{Escape}");
    expect(screen.queryByRole("dialog")).toBeNull();
    expect(document.activeElement).toBe(other);
  });

  it("returns focus to the latest word after selecting another", async () => {
    const user = userEvent.setup();
    setup();
    const words = screen.getAllByRole("button", { name: /^Look up / });
    await user.click(words[0]);
    await user.click(words[1]);
    await user.keyboard("{Escape}");
    expect(document.activeElement).toBe(words[1]);
  });
});
