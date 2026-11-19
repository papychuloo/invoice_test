/**
 * Converts numbers into French written words conforming to official French orthography.
 * Handles numbers up to billions with singular/plural agreements (cents, quatre-vingts, millions, etc.)
 */

const UNITS = [
  "",
  "un",
  "deux",
  "trois",
  "quatre",
  "cinq",
  "six",
  "sept",
  "huit",
  "neuf",
  "dix",
  "onze",
  "douze",
  "treize",
  "quatorze",
  "quinze",
  "seize",
  "dix-sept",
  "dix-huit",
  "dix-neuf",
];

const TENS = [
  "",
  "dix",
  "vingt",
  "trente",
  "quarante",
  "cinquante",
  "soixante",
  "soixante-dix",
  "quatre-vingts",
  "quatre-vingt-dix",
];

function convertBelowThousand(n: number): string {
  if (n === 0) return "";

  const hundreds = Math.floor(n / 100);
  const remainder = n % 100;
  let result = "";

  if (hundreds > 0) {
    if (hundreds === 1) {
      result += "cent";
    } else {
      result += `${UNITS[hundreds]} cent`;
      if (remainder === 0) {
        result += "s";
      }
    }
  }

  if (remainder === 0) {
    return result;
  }

  if (result.length > 0) {
    result += " ";
  }

  if (remainder < 20) {
    result += UNITS[remainder];
  } else if (remainder < 70) {
    const tensDigit = Math.floor(remainder / 10);
    const unitDigit = remainder % 10;
    if (unitDigit === 1) {
      result += `${TENS[tensDigit]} et un`;
    } else if (unitDigit > 0) {
      result += `${TENS[tensDigit]}-${UNITS[unitDigit]}`;
    } else {
      result += TENS[tensDigit];
    }
  } else if (remainder < 80) {
    // 70-79
    const unitDigit = remainder % 10;
    if (unitDigit === 1) {
      result += "soixante et onze";
    } else {
      result += `soixante-${UNITS[10 + unitDigit]}`;
    }
  } else if (remainder < 90) {
    // 80-89
    const unitDigit = remainder % 10;
    if (unitDigit === 0) {
      result += "quatre-vingts";
    } else {
      result += `quatre-vingt-${UNITS[unitDigit]}`;
    }
  } else {
    // 90-99
    const unitDigit = remainder % 10;
    result += `quatre-vingt-${UNITS[10 + unitDigit]}`;
  }

  return result;
}

/**
 * Converts a positive number/bigint to French words.
 */
export function numberToFrenchWords(amount: bigint | number): string {
  const num = typeof amount === "bigint" ? Number(amount) : Math.round(amount);

  if (num === 0) return "zéro";
  if (num < 0) return `moins ${numberToFrenchWords(-num)}`;

  const billions = Math.floor(num / 1_000_000_000);
  const millions = Math.floor((num % 1_000_000_000) / 1_000_000);
  const thousands = Math.floor((num % 1_000_000) / 1_000);
  const remainder = num % 1_000;

  const parts: string[] = [];

  if (billions > 0) {
    parts.push(billions === 1 ? "un milliard" : `${convertBelowThousand(billions)} milliards`);
  }

  if (millions > 0) {
    parts.push(millions === 1 ? "un million" : `${convertBelowThousand(millions)} millions`);
  }

  if (thousands > 0) {
    if (thousands === 1) {
      parts.push("mille");
    } else {
      parts.push(`${convertBelowThousand(thousands)} mille`);
    }
  }

  if (remainder > 0) {
    parts.push(convertBelowThousand(remainder));
  }

  return parts.join(" ");
}

/**
 * Legal document formula:
 * "Arrêtée la présente facture à la somme de vingt-quatre mille huit cent cinquante francs CFA"
 */
export function formatAmountInWordsLegal(
  amount: bigint | number,
  docType: "invoice" | "quote" = "invoice",
  currencyName: string = "francs CFA"
): string {
  const words = numberToFrenchWords(amount);
  const prefix =
    docType === "quote"
      ? "Arrêté le présent devis à la somme de"
      : "Arrêtée la présente facture à la somme de";

  return `${prefix} ${words} ${currencyName}.`;
}
