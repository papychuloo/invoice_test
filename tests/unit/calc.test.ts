import { describe, it, expect } from "vitest";
import { calculateLine, calculateDocumentTotals } from "@/lib/documents/calc";

describe("calculateLine", () => {
  it("calculates basic line with default 18% VAT (1800 bps)", () => {
    // 2 x 10 000 FCFA = 20 000 HT -> 18% VAT = 3 600 -> TTC = 23 600
    const line = calculateLine({
      description: "Consultation médicale",
      quantity: 2,
      unitPriceMinor: 10000,
      taxRateBps: 1800,
    });

    expect(line.grossMinor).toBe(20000n);
    expect(line.discountMinor).toBe(0n);
    expect(line.netHtMinor).toBe(20000n);
    expect(line.vatMinor).toBe(3600n);
    expect(line.totalTtcMinor).toBe(23600n);
  });

  it("calculates line with discount (e.g. 10% = 1000 bps)", () => {
    // 1 x 50 000 FCFA - 10% (5 000) = 45 000 HT -> 18% VAT (8 100) = 53 100 TTC
    const line = calculateLine({
      description: "Appareillage orthopédique",
      quantity: 1,
      unitPriceMinor: 50000,
      discountBps: 1000,
      taxRateBps: 1800,
    });

    expect(line.grossMinor).toBe(50000n);
    expect(line.discountMinor).toBe(5000n);
    expect(line.netHtMinor).toBe(45000n);
    expect(line.vatMinor).toBe(8100n);
    expect(line.totalTtcMinor).toBe(53100n);
  });

  it("applies half-up rounding correctly on fractional amounts", () => {
    // 3 items at 333 FCFA = 999 FCFA -> 18% of 999 = 179.82 -> half-up rounds to 180 FCFA
    const line = calculateLine({
      description: "Consommables",
      quantity: 3,
      unitPriceMinor: 333,
      taxRateBps: 1800,
    });

    expect(line.grossMinor).toBe(999n);
    expect(line.vatMinor).toBe(180n);
    expect(line.totalTtcMinor).toBe(1179n);
  });
});

describe("calculateDocumentTotals", () => {
  it("sums multiple lines and computes remaining balance correctly", () => {
    const lines = [
      {
        description: "Prestation A",
        quantity: 1,
        unitPriceMinor: 100000,
        taxRateBps: 1800,
      },
      {
        description: "Prestation B (exonéré 0%)",
        quantity: 1,
        unitPriceMinor: 50000,
        taxRateBps: 0,
      },
    ];

    // Prestation A: 100 000 HT + 18 000 TVA = 118 000 TTC
    // Prestation B: 50 000 HT + 0 TVA = 50 000 TTC
    // Total HT = 150 000, Total TVA = 18 000, Total TTC = 168 000
    // If 68 000 paid -> remaining balance = 100 000
    const totals = calculateDocumentTotals(lines, 68000);

    expect(totals.totalHtMinor).toBe(150000n);
    expect(totals.totalVatMinor).toBe(18000n);
    expect(totals.totalTtcMinor).toBe(168000n);
    expect(totals.amountPaidMinor).toBe(68000n);
    expect(totals.balanceDueMinor).toBe(100000n);

    // VAT Breakdown check
    expect(totals.vatBreakdown).toHaveLength(2);
    const breakdown0 = totals.vatBreakdown[0];
    const breakdown1 = totals.vatBreakdown[1];

    expect(breakdown0?.rateBps).toBe(0);
    expect(breakdown0?.baseHtMinor).toBe(50000n);
    expect(breakdown1?.rateBps).toBe(1800);
    expect(breakdown1?.baseHtMinor).toBe(100000n);
    expect(breakdown1?.vatMinor).toBe(18000n);
  });
});
