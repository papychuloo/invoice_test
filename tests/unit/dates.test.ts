import { describe, it, expect } from "vitest";
import { formatDate, formatFullFrenchDate } from "@/lib/dates";

describe("Date utilities for IziFacture", () => {
  it("formats dates into JJ/MM/AAAA", () => {
    expect(formatDate("2026-11-19")).toBe("19/11/2026");
    expect(formatDate(new Date(2026, 0, 5))).toBe("05/01/2026");
    expect(formatDate("")).toBe("");
  });

  it("formats dates into full French header format", () => {
    // 19 November 2026 is a Thursday (Jeudi)
    const testDate = new Date(2026, 10, 19);
    const formatted = formatFullFrenchDate(testDate);
    expect(formatted).toBe("Jeudi 19 Novembre 2026");

    // 1 January 2026 is a Thursday (Jeudi)
    const newYear = new Date(2026, 0, 1);
    expect(formatFullFrenchDate(newYear)).toBe("Jeudi 1 Janvier 2026");
  });

  it("defaults to current date if no argument passed", () => {
    const formatted = formatFullFrenchDate();
    expect(typeof formatted).toBe("string");
    expect(formatted.length).toBeGreaterThan(10);
  });
});
