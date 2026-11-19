/**
 * Financial calculation engine for invoices and quotes in FCFA.
 * Amounts are stored as minor units (BigInt).
 * Basis points (bps): 1800 bps = 18.00% VAT.
 * Half-up rounding to the nearest FCFA integer.
 */

export interface DocumentLineInput {
  description: string;
  quantity: number; // e.g. 1.0, 2.5, 10
  unitPriceMinor: bigint | number; // Minor units (FCFA integer)
  discountBps?: number; // e.g. 500 for 5% (0-10000)
  taxRateBps?: number; // e.g. 1800 for 18% (0-10000)
}

export interface CalculatedLine {
  description: string;
  quantity: number;
  unitPriceMinor: bigint;
  discountBps: number;
  taxRateBps: number;
  grossMinor: bigint; // qté * PU
  discountMinor: bigint; // gross * discount / 10000
  netHtMinor: bigint; // gross - discount
  vatMinor: bigint; // netHt * taxRate / 10000
  totalTtcMinor: bigint; // netHt + vat
}

export interface VatBreakdown {
  rateBps: number;
  ratePercentage: number;
  baseHtMinor: bigint;
  vatMinor: bigint;
}

export interface DocumentTotals {
  lines: CalculatedLine[];
  totalGrossMinor: bigint;
  totalDiscountMinor: bigint;
  totalHtMinor: bigint;
  totalVatMinor: bigint;
  totalTtcMinor: bigint;
  vatBreakdown: VatBreakdown[];
  amountPaidMinor: bigint;
  balanceDueMinor: bigint;
}

/**
 * Performs half-up division: Math.floor((numerator + divisor / 2) / divisor)
 */
function divideHalfUp(numerator: bigint, divisor: bigint): bigint {
  if (divisor === 0n) return 0n;
  const halfDivisor = divisor / 2n;
  return (numerator + halfDivisor) / divisor;
}

/**
 * Calculates a single invoice/quote line.
 */
export function calculateLine(line: DocumentLineInput): CalculatedLine {
  const quantity = Math.max(0, line.quantity);
  const unitPriceMinor = BigInt(Math.max(0, Math.round(Number(line.unitPriceMinor))));
  const discountBps = Math.min(10000, Math.max(0, line.discountBps ?? 0));
  const taxRateBps = Math.min(10000, Math.max(0, line.taxRateBps ?? 1800));

  // Compute gross = quantity * unitPriceMinor with 3 decimal precision
  // quantity * 1000 as BigInt
  const qtyThousandths = BigInt(Math.round(quantity * 1000));
  const grossMinor = divideHalfUp(qtyThousandths * unitPriceMinor, 1000n);

  // Discount
  const discountMinor = divideHalfUp(grossMinor * BigInt(discountBps), 10000n);
  const netHtMinor = grossMinor - discountMinor;

  // VAT
  const vatMinor = divideHalfUp(netHtMinor * BigInt(taxRateBps), 10000n);

  // TTC
  const totalTtcMinor = netHtMinor + vatMinor;

  return {
    description: line.description,
    quantity,
    unitPriceMinor,
    discountBps,
    taxRateBps,
    grossMinor,
    discountMinor,
    netHtMinor,
    vatMinor,
    totalTtcMinor,
  };
}

/**
 * Calculates document totals across all lines.
 */
export function calculateDocumentTotals(
  lines: DocumentLineInput[],
  amountPaidMinorInput: bigint | number = 0n
): DocumentTotals {
  const calculatedLines = lines.map(calculateLine);
  const amountPaidMinor = BigInt(Math.max(0, Math.round(Number(amountPaidMinorInput))));

  let totalGrossMinor = 0n;
  let totalDiscountMinor = 0n;
  let totalHtMinor = 0n;
  let totalVatMinor = 0n;
  let totalTtcMinor = 0n;

  const vatMap = new Map<number, { baseHt: bigint; vat: bigint }>();

  for (const line of calculatedLines) {
    totalGrossMinor += line.grossMinor;
    totalDiscountMinor += line.discountMinor;
    totalHtMinor += line.netHtMinor;
    totalVatMinor += line.vatMinor;
    totalTtcMinor += line.totalTtcMinor;

    const existing = vatMap.get(line.taxRateBps) || { baseHt: 0n, vat: 0n };
    existing.baseHt += line.netHtMinor;
    existing.vat += line.vatMinor;
    vatMap.set(line.taxRateBps, existing);
  }

  const vatBreakdown: VatBreakdown[] = Array.from(vatMap.entries())
    .sort(([rateA], [rateB]) => rateA - rateB)
    .map(([rateBps, data]) => ({
      rateBps,
      ratePercentage: rateBps / 100,
      baseHtMinor: data.baseHt,
      vatMinor: data.vat,
    }));

  const balanceDueMinor = totalTtcMinor > amountPaidMinor ? totalTtcMinor - amountPaidMinor : 0n;

  return {
    lines: calculatedLines,
    totalGrossMinor,
    totalDiscountMinor,
    totalHtMinor,
    totalVatMinor,
    totalTtcMinor,
    vatBreakdown,
    amountPaidMinor,
    balanceDueMinor,
  };
}
