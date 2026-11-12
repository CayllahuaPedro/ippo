import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { parseTokens } from "../model/tokenize";
import { PassageText } from "./passage-text";

const paragraphs = [{ id: "p", tokens: parseTokens("駅|えき#known@eki の") }];

function renderText(labels?: { lookUp: (word: string) => string }) {
  render(
    <PassageText
      paragraphs={paragraphs}
      mode="learn"
      selectedTokenId={null}
      onSelect={() => {}}
      labels={labels}
    />,
  );
}

describe("PassageText labels", () => {
  it("names word buttons in English by default", () => {
    renderText();
    expect(screen.getByRole("button", { name: "Look up 駅" })).toBeTruthy();
  });

  it("takes the word button name from the labels", () => {
    renderText({ lookUp: (word) => `Buscar ${word}` });
    expect(screen.getByRole("button", { name: "Buscar 駅" })).toBeTruthy();
    expect(screen.queryByRole("button", { name: "Look up 駅" })).toBeNull();
  });
});
