import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { IppoMark } from "./ippo-mark";

describe("IppoMark", () => {
  it("is a decorative svg of five strokes ending in the accent step", () => {
    const { container } = render(<IppoMark />);
    const svg = container.querySelector("svg");
    expect(svg?.getAttribute("aria-hidden")).toBe("true");
    const paths = container.querySelectorAll("path");
    expect(paths).toHaveLength(5);
    expect(paths[4].getAttribute("stroke")).toBe("var(--color-accent)");
  });

  it("follows the text colour for the ink strokes", () => {
    const { container } = render(<IppoMark className="size-6" />);
    expect(container.querySelector("svg")?.getAttribute("class")).toBe("size-6");
    expect(container.querySelector("g")?.getAttribute("stroke")).toBe("currentColor");
  });
});
