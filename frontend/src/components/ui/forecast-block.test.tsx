import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ForecastBlock } from "./forecast-block";

const forecast = { expected: 93, low: 88, high: 96 };

describe("ForecastBlock labels", () => {
  it("reads in English by default", () => {
    const { container } = render(<ForecastBlock forecast={forecast} />);
    expect(container.textContent).toContain("you'll understand · likely 88–96%");
  });

  it("explains an abstention in English by default", () => {
    const { container } = render(<ForecastBlock forecast={null} />);
    expect(container.textContent).toContain("No forecast");
    expect(container.textContent).toContain("No forecast · the model abstains on this text");
  });

  it("replaces the labels it is given", () => {
    const { container } = render(
      <ForecastBlock forecast={forecast} labels={{ understand: (low, high) => `entenderás ${low}–${high}%` }} />,
    );
    expect(container.textContent).toContain("entenderás 88–96%");
    expect(container.textContent).not.toContain("you'll understand");
  });

  it("replaces the abstention labels", () => {
    const { container } = render(
      <ForecastBlock forecast={null} labels={{ noForecast: "Sin pronóstico", abstains: "Sin pronóstico · el modelo se abstiene" }} />,
    );
    expect(container.textContent).toContain("Sin pronóstico · el modelo se abstiene");
    expect(container.textContent).not.toContain("No forecast");
  });
});
