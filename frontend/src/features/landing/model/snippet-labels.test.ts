import { describe, expect, it } from "vitest";
import { copy } from "./copy";
import { shelfLabelsFrom, wordEntryLabelsFrom } from "./snippet-labels";

describe("snippet labels", () => {
  it("fills the forecast range from the template", () => {
    const labels = shelfLabelsFrom(copy.es.snippets.shelf);
    expect(labels.forecast.understand(88, 96)).toBe("entenderás · probable 88–96%");
  });

  it("carries the word entry strings over", () => {
    expect(wordEntryLabelsFrom(copy.es.snippets.entry).addToSrs).toBe("Añadir al SRS");
  });
});
