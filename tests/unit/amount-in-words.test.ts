import { describe, it, expect } from "vitest";
import { numberToFrenchWords, formatAmountInWordsLegal } from "@/lib/amount-in-words";

describe("numberToFrenchWords", () => {
  it("converts simple numbers", () => {
    expect(numberToFrenchWords(0)).toBe("zéro");
    expect(numberToFrenchWords(1)).toBe("un");
    expect(numberToFrenchWords(16)).toBe("seize");
    expect(numberToFrenchWords(21)).toBe("vingt et un");
    expect(numberToFrenchWords(80)).toBe("quatre-vingts");
    expect(numberToFrenchWords(81)).toBe("quatre-vingt-un");
    expect(numberToFrenchWords(99)).toBe("quatre-vingt-dix-neuf");
    expect(numberToFrenchWords(100)).toBe("cent");
    expect(numberToFrenchWords(200)).toBe("deux cents");
    expect(numberToFrenchWords(250)).toBe("deux cent cinquante");
  });

  it("converts thousands, millions and typical FCFA invoice amounts", () => {
    expect(numberToFrenchWords(1000)).toBe("mille");
    expect(numberToFrenchWords(24850)).toBe("vingt-quatre mille huit cent cinquante");
    expect(numberToFrenchWords(250000)).toBe("deux cent cinquante mille");
    expect(numberToFrenchWords(15100000)).toBe("quinze millions cent mille");
  });

  it("produces compliant legal wording for invoices", () => {
    const legalPhrase = formatAmountInWordsLegal(24850);
    expect(legalPhrase).toBe(
      "Arrêtée la présente facture à la somme de vingt-quatre mille huit cent cinquante francs CFA."
    );
  });
});
