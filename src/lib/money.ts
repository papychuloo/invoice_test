/**
 * Formats a currency amount in FCFA with non-breaking space separators.
 * Example: formatFcfa(250000) -> "250 000 FCFA"
 */
export function formatFcfa(amount: number | bigint, options?: { showCurrency?: boolean; compact?: boolean }): string {
  const { showCurrency = true, compact = false } = options || {};
  const num = typeof amount === "bigint" ? Number(amount) : amount;

  if (compact) {
    if (Math.abs(num) >= 1_000_000_000) {
      return `${(num / 1_000_000_000).toFixed(1).replace(".0", "")} Md${showCurrency ? " FCFA" : ""}`;
    }
    if (Math.abs(num) >= 1_000_000) {
      return `${(num / 1_000_000).toFixed(1).replace(".0", "")} M${showCurrency ? " FCFA" : ""}`;
    }
    if (Math.abs(num) >= 1_000) {
      return `${(num / 1_000).toFixed(0)} k${showCurrency ? " FCFA" : ""}`;
    }
  }

  // Format with French thousand separator (narrow non-breaking space \u202F or non-breaking space \u00A0)
  const formatted = Math.round(num)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, "\u00A0");

  return showCurrency ? `${formatted} FCFA` : formatted;
}

/**
 * Returns raw number formatted without FCFA suffix
 */
export function formatNumber(amount: number | bigint): string {
  return formatFcfa(amount, { showCurrency: false });
}
