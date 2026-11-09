// @vitest-environment jsdom
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Button } from "../../src/components/Button";

describe("Button", () => {
  it("T-C-1 renders the approved label and disabled/loading states", () => {
    render(
      <>
        <Button variant="primary">Continue</Button>
        <Button variant="secondary">Alternate</Button>
        <Button disabled>Unavailable</Button>
        <Button loading>Saving</Button>
      </>,
    );

    expect(screen.getByRole("button", { name: "Continue" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "Continue" }).classList.contains("button--primary")).toBe(
      true,
    );
    expect(screen.getByRole("button", { name: "Alternate" }).classList.contains("button--secondary")).toBe(
      true,
    );
    expect(screen.getByRole("button", { name: "Unavailable" }).hasAttribute("disabled")).toBe(true);
    expect(screen.getByRole("button", { name: "Saving" }).hasAttribute("disabled")).toBe(true);
    expect(screen.getByRole("button", { name: "Saving" }).getAttribute("aria-busy")).toBe("true");
  });
});
