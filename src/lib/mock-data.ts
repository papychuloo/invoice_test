export type InvoiceStatus = "paid" | "sent" | "overdue" | "draft";

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number; // FCFA
  amount: number; // HT = quantity * unitPrice
}

export interface Invoice {
  id: string;
  number: string;
  customerId?: string;
  customerName: string;
  customerEmail?: string;
  customerPhone?: string;
  customerAddress?: string;
  customerCity: string;
  customerCountry: string;
  customerAvatar?: string;
  issueDate: string; // ISO or YYYY-MM-DD
  dueDate: string; // ISO or YYYY-MM-DD
  amount: number; // in FCFA (TTC)
  subtotalHt?: number;
  taxAmount?: number;
  status: InvoiceStatus;
  paymentMethod?: string;
  paymentProvider?: string;
  notes?: string;
  terms?: string;
  items?: InvoiceItem[];
}

export interface Customer {
  id: string;
  name: string;
  contactName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  avatarUrl?: string;
  totalInvoiced: number; // in FCFA
  invoicesCount: number;
  createdAt: string;
}

export interface KpiStat {
  id: string;
  title: string;
  subtitle: string;
  amount: number;
  currency: string;
  trendPercentage: number;
  trendDirection: "up" | "down";
  comparisonText: string;
  sparklineColor: "emerald" | "amber" | "rose" | "blue";
  iconName: "sales" | "expenses" | "pending" | "profit";
}

export interface FavoriteBuyer {
  id: string;
  name: string;
  initials: string;
  avatarUrl?: string;
  totalSpent: number;
}

export interface MonthlySale {
  month: string;
  monthShort: string;
  amount: number; // in FCFA
  isPeak?: boolean;
}

export interface StatusDistribution {
  status: InvoiceStatus;
  label: string;
  count: number;
  percentage: number;
  color: string;
  dotColor: string;
}

export const MOCK_COMPANY = {
  name: "Clinique Al Noor",
  tagline: "Cabinet Médical & Dentaire Spécialisé",
  city: "Dakar",
  country: "Sénégal",
  address: "14 Rue Victor Schoelcher, Plateau",
  phone: "+221 33 821 44 00",
  email: "contact@alnoor-dakar.sn",
  ninea: "004829103",
  rccm: "SN-DKR-2024-B-112",
  user: {
    name: "Awa Ndiaye",
    role: "Administratrice & Directrice",
    greeting: "Bonsoir,",
  },
  frequentBuyers: [] as FavoriteBuyer[],
};

export const MOCK_CUSTOMERS: Customer[] = [];

export const MOCK_KPIS: KpiStat[] = [
  {
    id: "total_sales",
    title: "Total des ventes ce mois",
    subtitle: "Montant facturé",
    amount: 0,
    currency: "FCFA",
    trendPercentage: 0,
    trendDirection: "up",
    comparisonText: "vs mois dernier",
    sparklineColor: "emerald",
    iconName: "sales",
  },
  {
    id: "total_expenses",
    title: "Total des dépenses",
    subtitle: "Avoirs & charges",
    amount: 0,
    currency: "FCFA",
    trendPercentage: 0,
    trendDirection: "up",
    comparisonText: "vs mois dernier",
    sparklineColor: "rose",
    iconName: "expenses",
  },
  {
    id: "pending_payments",
    title: "En attente de paiement",
    subtitle: "Créances clients",
    amount: 0,
    currency: "FCFA",
    trendPercentage: 0,
    trendDirection: "up",
    comparisonText: "vs mois dernier",
    sparklineColor: "amber",
    iconName: "pending",
  },
  {
    id: "estimated_profit",
    title: "Montant encaissé",
    subtitle: "Flux de trésorerie net",
    amount: 0,
    currency: "FCFA",
    trendPercentage: 0,
    trendDirection: "up",
    comparisonText: "vs mois dernier",
    sparklineColor: "emerald",
    iconName: "profit",
  },
];

export const MOCK_MONTHLY_SALES: MonthlySale[] = [
  { month: "Janvier", monthShort: "Jan", amount: 0 },
  { month: "Février", monthShort: "Fév", amount: 0 },
  { month: "Mars", monthShort: "Mar", amount: 0 },
  { month: "Avril", monthShort: "Avr", amount: 0 },
  { month: "Mai", monthShort: "Mai", amount: 0 },
  { month: "Juin", monthShort: "Juin", amount: 0 },
];

export const MOCK_STATUS_DISTRIBUTION: StatusDistribution[] = [
  {
    status: "paid",
    label: "Payée",
    count: 0,
    percentage: 0,
    color: "#34D399",
    dotColor: "bg-emerald-500",
  },
  {
    status: "sent",
    label: "Envoyée",
    count: 0,
    percentage: 0,
    color: "#60A5FA",
    dotColor: "bg-blue-500",
  },
  {
    status: "overdue",
    label: "En retard",
    count: 0,
    percentage: 0,
    color: "#FB7185",
    dotColor: "bg-rose-500",
  },
  {
    status: "draft",
    label: "Brouillon",
    count: 0,
    percentage: 0,
    color: "#CBD5E1",
    dotColor: "bg-slate-400",
  },
];

export const INITIAL_INVOICES: Invoice[] = [];

export const MOCK_INVOICES: Invoice[] = [];
