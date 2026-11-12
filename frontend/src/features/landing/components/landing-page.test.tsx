import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { copy } from "../model/copy";
import { LandingPage } from "./landing-page";

vi.mock("./waitlist-form", () => ({
  WaitlistForm: () => <div data-testid="waitlist-form" />,
}));
vi.mock("./reader-demo", () => ({
  ReaderDemo: () => <div data-testid="reader-demo" />,
}));

const es = copy.es;

describe("LandingPage", () => {
  it("renders the localized headline", () => {
    render(<LandingPage locale="es" />);
    expect(screen.getByRole("heading", { level: 1 }).textContent).toBe(es.hero.title);
  });

  it("offers the waitlist in the hero and again in the closing section", () => {
    render(<LandingPage locale="es" />);
    expect(screen.getAllByTestId("waitlist-form")).toHaveLength(2);
  });

  it("links the footer to the repository", () => {
    render(<LandingPage locale="es" />);
    const link = screen.getByRole("link", { name: es.footer.openSource });
    expect(link.getAttribute("href")).toBe(es.footer.repoUrl);
  });

  it("marks the current language in the switcher", () => {
    render(<LandingPage locale="es" />);
    const current = screen.getAllByRole("link", { name: "ES" })[0];
    expect(current.getAttribute("aria-current")).toBe("true");
    expect(screen.getAllByRole("link", { name: "EN" })[0].getAttribute("aria-current")).toBeNull();
  });

  it("exposes the section anchors", () => {
    const { container } = render(<LandingPage locale="en" />);
    for (const id of ["method", "helps", "status", "join"]) {
      expect(container.querySelector(`#${id}`)).not.toBeNull();
    }
  });
});
