import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { dictionary } from "../fixtures";
import { WordEntry } from "./word-popup";

function renderEntry(props: Partial<Parameters<typeof WordEntry>[0]> = {}) {
  return render(
    <WordEntry
      entry={dictionary.yuki}
      added={false}
      onAddToSrs={() => {}}
      onAskTutor={() => {}}
      {...props}
    />,
  );
}

describe("WordEntry labels", () => {
  it("reads in English by default", () => {
    const { container } = renderEntry();
    expect(container.textContent).toContain("Card front 雪 · back: gloss and this sentence · frequency rank 892");
    expect(screen.getByRole("button", { name: "Add to SRS" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "Ask the tutor" })).toBeTruthy();
    expect(screen.getByText("learning")).toBeTruthy();
  });

  it("says the word is in the SRS once added", () => {
    renderEntry({ added: true });
    expect(screen.getByRole("button", { name: "In your SRS" })).toBeTruthy();
  });

  it("replaces only the labels it is given", () => {
    const { container } = renderEntry({
      labels: {
        addToSrs: "Añadir al SRS",
        askTutor: "Preguntar al tutor",
        cardFront: "Anverso",
        states: { known: "conocida", learning: "aprendiendo", selected: "seleccionada" },
      },
    });
    expect(screen.getByRole("button", { name: "Añadir al SRS" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "Preguntar al tutor" })).toBeTruthy();
    expect(screen.getByText("aprendiendo")).toBeTruthy();
    expect(container.textContent).toContain("Anverso 雪 · back: gloss and this sentence");
  });
});
