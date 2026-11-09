// @vitest-environment jsdom
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { App } from "../../src/app/App";
import { BrowserRouter, Link, useLocation } from "../../src/app/Router";

function PathProbe() {
  const { pathname } = useLocation();
  return <output aria-label="Current path">{pathname}</output>;
}

describe("Phase 1 browser routing", () => {
  it("T-NAV-1 reads the current path when loaded directly or after a refresh", () => {
    window.history.replaceState({}, "", "/login");
    const firstRender = render(
      <BrowserRouter>
        <PathProbe />
      </BrowserRouter>,
    );
    expect(screen.getByLabelText("Current path").textContent).toBe("/login");

    firstRender.unmount();
    render(
      <BrowserRouter>
        <PathProbe />
      </BrowserRouter>,
    );
    expect(screen.getByLabelText("Current path").textContent).toBe("/login");
  });

  it("T-NAV-2 uses pushState and updates the rendered location for an app link", () => {
    window.history.replaceState({}, "", "/");
    render(
      <BrowserRouter>
        <Link to="/login">Log in</Link>
        <PathProbe />
      </BrowserRouter>,
    );

    fireEvent.click(screen.getByRole("link", { name: "Log in" }));

    expect(window.location.pathname).toBe("/login");
    expect(screen.getByLabelText("Current path").textContent).toBe("/login");
  });

  it("T-NAV-3 follows browser back and forward popstate events", () => {
    window.history.replaceState({}, "", "/");
    render(
      <BrowserRouter>
        <PathProbe />
      </BrowserRouter>,
    );

    window.history.pushState({}, "", "/login");
    fireEvent(window, new PopStateEvent("popstate"));
    expect(screen.getByLabelText("Current path").textContent).toBe("/login");

    window.history.replaceState({}, "", "/");
    fireEvent(window, new PopStateEvent("popstate"));
    expect(screen.getByLabelText("Current path").textContent).toBe("/");
  });

  it("T-NAV-4 falls back to the only implemented Phase 1 screen on unknown routes", () => {
    window.history.replaceState({}, "", "/not-a-phase-one-route");
    render(<App />);

    expect(
      screen.getByRole("heading", {
        name: "Understand Mathematics, one topic at a time.",
      }),
    ).toBeTruthy();
    expect(window.location.pathname).toBe("/not-a-phase-one-route");
  });
});
