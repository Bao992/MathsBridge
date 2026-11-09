import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const tokens = readFileSync(new URL("../../src/styles/tokens.css", import.meta.url), "utf8");

function token(name: string): string {
  const value = tokens.match(new RegExp(`--${name}:\\s*(#[0-9A-Fa-f]{6})`))?.[1];
  if (!value) throw new Error(`Missing design token: ${name}`);
  return value;
}

function luminance(hex: string): number {
  const channels = hex.slice(1).match(/.{2}/g)?.map((channel) => parseInt(channel, 16) / 255);
  if (!channels || channels.length !== 3) throw new Error(`Invalid color: ${hex}`);
  const [red, green, blue] = channels.map((channel) =>
    channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4,
  );
  return 0.2126 * red + 0.7152 * green + 0.0722 * blue;
}

function contrast(foreground: string, background: string): number {
  const first = luminance(foreground);
  const second = luminance(background);
  return (Math.max(first, second) + 0.05) / (Math.min(first, second) + 0.05);
}

describe("Phase 1 design tokens", () => {
  it("T-TOKEN-1 records the approved PRD and harmonised Stitch colors", () => {
    expect(tokens).toContain("--color-primary: #2457A7;");
    expect(token("color-primary")).toBe("#2457A7");
    expect(token("color-accent-primary")).toBe("#0F766E");
    expect(token("color-background")).toBe("#F7F9FC");
    expect(token("color-background-subtle")).toBe("#F9F9FF");
    expect(token("color-surface-panel")).toBe("#F1F3FF");
    expect(token("color-accent-deep")).toBe("#00695E");
    expect(token("color-accent-soft")).toBe("#99EFE5");
    expect(token("color-illustration-shadow")).toBe("#E1E7F8");
    expect(token("color-illustration-book-blue")).toBe("#DCE5FA");
    expect(token("color-illustration-book-teal")).toBe("#D5F2EE");
  });

  it("T-TOKEN-2 keeps the actual S1 text and button combinations above 4.5:1", () => {
    const white = "#FFFFFF";
    expect(contrast(white, token("color-primary"))).toBeGreaterThanOrEqual(4.5);
    expect(contrast(token("color-accent-deep"), token("color-accent-soft"))).toBeGreaterThanOrEqual(4.5);
    expect(contrast(token("color-text"), token("color-background-subtle"))).toBeGreaterThanOrEqual(4.5);
    expect(contrast(token("color-primary"), token("color-surface-panel"))).toBeGreaterThanOrEqual(4.5);
  });
});
