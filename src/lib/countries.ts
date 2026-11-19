export interface CountryConfig {
  code: string;
  name: string;
  flag: string;
  currency: string;
  symbol: string;
  defaultCity: string;
  vatRateBps: number;
  vatLabel: string;
}

export const COUNTRIES: CountryConfig[] = [
  {
    code: "SN",
    name: "Sénégal",
    flag: "🇸🇳",
    currency: "XOF",
    symbol: "FCFA",
    defaultCity: "Dakar",
    vatRateBps: 1800,
    vatLabel: "TVA 18%",
  },
  {
    code: "CI",
    name: "Côte d'Ivoire",
    flag: "🇨🇮",
    currency: "XOF",
    symbol: "FCFA",
    defaultCity: "Abidjan",
    vatRateBps: 1800,
    vatLabel: "TVA 18%",
  },
  {
    code: "CM",
    name: "Cameroun",
    flag: "🇨🇲",
    currency: "XAF",
    symbol: "FCFA",
    defaultCity: "Douala",
    vatRateBps: 1925,
    vatLabel: "TVA 19.25%",
  },
  {
    code: "BJ",
    name: "Bénin",
    flag: "🇧🇯",
    currency: "XOF",
    symbol: "FCFA",
    defaultCity: "Cotonou",
    vatRateBps: 1800,
    vatLabel: "TVA 18%",
  },
  {
    code: "ML",
    name: "Mali",
    flag: "🇲🇱",
    currency: "XOF",
    symbol: "FCFA",
    defaultCity: "Bamako",
    vatRateBps: 1800,
    vatLabel: "TVA 18%",
  },
  {
    code: "BF",
    name: "Burkina Faso",
    flag: "🇧🇫",
    currency: "XOF",
    symbol: "FCFA",
    defaultCity: "Ouagadougou",
    vatRateBps: 1800,
    vatLabel: "TVA 18%",
  },
  {
    code: "TG",
    name: "Togo",
    flag: "🇹🇬",
    currency: "XOF",
    symbol: "FCFA",
    defaultCity: "Lomé",
    vatRateBps: 1800,
    vatLabel: "TVA 18%",
  },
  {
    code: "GA",
    name: "Gabon",
    flag: "🇬🇦",
    currency: "XAF",
    symbol: "FCFA",
    defaultCity: "Libreville",
    vatRateBps: 1800,
    vatLabel: "TVA 18%",
  },
  {
    code: "GN",
    name: "Guinée",
    flag: "🇬🇳",
    currency: "GNF",
    symbol: "GNF",
    defaultCity: "Conakry",
    vatRateBps: 1800,
    vatLabel: "TVA 18%",
  },
];
