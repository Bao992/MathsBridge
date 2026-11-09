// @vitest-environment jsdom
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { BrowserRouter } from "../../src/app/Router";
import { WelcomePage } from "../../src/pages/WelcomePage";

describe("S1 Welcome", () => {
  it("T-S1-1 shows the exact PRD heading, body and both route actions", () => {
    render(<BrowserRouter><WelcomePage /></BrowserRouter>);

    expect(
      screen.getByRole("heading", {
        name: "Understand Mathematics, one topic at a time.",
      }),
    ).toBeTruthy();
    expect(
      screen.getByText(
        "Sepedi explanations, English Mathematics terms, worked examples and practice.",
      ),
    ).toBeTruthy();
    expect(screen.getByRole("link", { name: "Create caregiver account" }).getAttribute("href")).toBe(
      "/sign-up",
    );
    expect(screen.getByRole("link", { name: "Log in" }).getAttribute("href")).toBe("/login");
  });

  it("T-S1-2 shows the approved startup error state", () => {
    render(<BrowserRouter><WelcomePage startupError /></BrowserRouter>);

    expect(screen.getByRole("alert").textContent).toBe(
      "MathsBridge couldn’t start. Refresh the page.",
    );
  });

  it("T-S1-3 shows the approved offline banner", () => {
    const originalOnline = navigator.onLine;
    Object.defineProperty(navigator, "onLine", { configurable: true, value: false });
    const view = render(<BrowserRouter><WelcomePage /></BrowserRouter>);

    expect(screen.getByRole("status").textContent).toBe(
      "You’re offline. Sign in requires an internet connection.",
    );

    Object.defineProperty(navigator, "onLine", { configurable: true, value: true });
    fireEvent(window, new Event("online"));
    expect(screen.queryByRole("status")).toBeNull();

    view.unmount();
    Object.defineProperty(navigator, "onLine", { configurable: true, value: originalOnline });
  });
});
