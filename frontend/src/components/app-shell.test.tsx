import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { AppShell } from "./app-shell";

vi.mock("next/navigation", () => ({ usePathname: () => "/reader" }));
vi.mock("@/components/ui/theme-toggle", () => ({ ThemeToggle: () => null }));

describe("AppShell", () => {
  it("names the home link Ippo and shows the decorative mark in it", () => {
    render(<AppShell>content</AppShell>);
    const home = screen.getByRole("link", { name: "Ippo" });
    expect(home.querySelector('svg[aria-hidden="true"]')).not.toBeNull();
  });
});
