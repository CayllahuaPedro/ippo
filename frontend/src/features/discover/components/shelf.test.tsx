import { cleanup, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { comfortable } from "../fixtures";
import { Shelf } from "./shelf";

const base = {
  title: "Comfortable",
  band: "90%+ expected",
  guidance: "read for pleasure",
  tone: "comfortable" as const,
};

describe("Shelf labels", () => {
  it("reads in English by default", () => {
    const { container } = render(<Shelf {...base} items={comfortable.slice(0, 1)} stacked />);
    for (const word of ["Format", "Source", "Notes"]) {
      expect(screen.getByText(word)).toBeTruthy();
    }
    expect(container.textContent).toContain("video · 4 min");
    expect(container.textContent).toContain("you'll understand · likely 88–96%");
  });

  it("says when a shelf is empty", () => {
    render(<Shelf {...base} items={[]} />);
    expect(screen.getByText("Nothing of this type on this shelf.")).toBeTruthy();
    cleanup();
    render(<Shelf {...base} items={[]} labels={{ empty: "Nada de este tipo en este estante." }} />);
    expect(screen.getByText("Nada de este tipo en este estante.")).toBeTruthy();
  });

  it("replaces the labels it is given", () => {
    const { container } = render(
      <Shelf
        {...base}
        items={comfortable.slice(0, 1)}
        labels={{
          format: "Formato",
          kinds: { video: "vídeo", article: "artículo", book: "libro" },
          forecast: {
            noForecast: "Sin pronóstico",
            abstains: "Sin pronóstico · el modelo se abstiene",
            understand: (low, high) => `entenderás · probable ${low}–${high}%`,
          },
        }}
      />,
    );
    expect(screen.getByText("Formato")).toBeTruthy();
    expect(screen.getByText("Source")).toBeTruthy();
    expect(container.textContent).toContain("vídeo · 4 min");
    expect(container.textContent).toContain("entenderás · probable 88–96%");
  });
});
