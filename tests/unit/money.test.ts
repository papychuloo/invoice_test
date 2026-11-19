import { describe, it, expect } from "vitest";
import { formatFcfa, formatNumber } from "@/lib/money";

describe("formatFcfa", () => {
  it("formats integer FCFA amounts with non-breaking spaces", () => {
    expect(formatFcfa(250000)).toBe("250\u00A0000 FCFA");
    expect(formatFcfa(14180000)).toBe("14\u00A0180\u00A0000 FCFA");
    expect(formatFcfa(0)).toBe("0 FCFA");
  });

  it("handles BigInt amounts properly", () => {
    expect(formatFcfa(24850000n)).toBe("24\u00A0850\u00A0000 FCFA");
  });

  it("formats without currency when showCurrency is false", () => {
    expect(formatNumber(4220000)).toBe("4\u00A0220\u00A0000");
  });

  it("formats compact amounts accurately", () => {
    expect(formatFcfa(15100000, { compact: true })).toBe("15.1 M FCFA");
    expect(formatFcfa(26000000, { compact: true })).toBe("26 M FCFA");
    expect(formatFcfa(750000, { compact: true })).toBe("750 k FCFA");
  });
});
