import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { copy } from "../model/copy";
import { WaitlistForm } from "./waitlist-form";

describe("WaitlistForm", () => {
  it("names the email field with the label copy", () => {
    render(<WaitlistForm locale="es" copy={copy.es.waitlist} />);
    const field = screen.getByRole("textbox", { name: copy.es.waitlist.label });
    expect(field.getAttribute("placeholder")).toBe(copy.es.waitlist.placeholder);
  });

  it("keeps each field's label unique when the form appears twice", () => {
    render(
      <>
        <WaitlistForm locale="en" copy={copy.en.waitlist} />
        <WaitlistForm locale="en" copy={copy.en.waitlist} />
      </>,
    );
    const ids = screen.getAllByRole("textbox").map((field) => field.id);
    expect(new Set(ids).size).toBe(2);
  });
});
