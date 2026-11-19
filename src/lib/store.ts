"use client";

import {
  MOCK_COMPANY,
  type Invoice,
  type Customer,
  type InvoiceStatus,
  type InvoiceItem,
} from "./mock-data";
import { supabase } from "./supabase/client";

const INVOICES_STORAGE_KEY = "izifacture_invoices_v1";
const CUSTOMERS_STORAGE_KEY = "izifacture_customers_v1";
const SETTINGS_STORAGE_KEY = "izifacture_settings_v1";
export const STORE_UPDATED_EVENT = "izifacture_store_updated";

export interface CompanySettings {
  id?: string;
  name: string;
  tagline: string;
  city: string;
  country: string;
  address: string;
  phone: string;
  email: string;
  ninea: string;
  rccm: string;
  vatRate: number;
  prefix: string;
  defaultDueDays: number;
  wavePhone: string;
  orangeMoneyCode: string;
  bankIban: string;
  isPro: boolean;
}

export const DEFAULT_COMPANY_SETTINGS: CompanySettings = {
  id: "default",
  name: MOCK_COMPANY.name,
  tagline: MOCK_COMPANY.tagline,
  city: MOCK_COMPANY.city,
  country: MOCK_COMPANY.country,
  address: MOCK_COMPANY.address,
  phone: MOCK_COMPANY.phone,
  email: MOCK_COMPANY.email,
  ninea: MOCK_COMPANY.ninea,
  rccm: MOCK_COMPANY.rccm,
  vatRate: 18,
  prefix: "FAC-",
  defaultDueDays: 15,
  wavePhone: "+221 77 123 45 67",
  orangeMoneyCode: "OM-DKR-8921",
  bankIban: "SN08 SN01 2013 0456 7890 1234 56",
  isPro: false,
};

export function notifyStoreUpdated(): void {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(STORE_UPDATED_EVENT));
  }
}

// ---------------------------------------------------------------------------
// Synchronous Local Storage Access (0ms latency for components during mount)
// ---------------------------------------------------------------------------

export function getStoredInvoices(): Invoice[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(INVOICES_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(INVOICES_STORAGE_KEY, JSON.stringify([]));
      return [];
    }
    // Clean up any legacy mock data containing 'inv-001'
    if (raw.includes("inv-001") || raw.includes("FAC-2026-0042")) {
      localStorage.setItem(INVOICES_STORAGE_KEY, JSON.stringify([]));
      return [];
    }
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function getStoredCustomers(): Customer[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(CUSTOMERS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(CUSTOMERS_STORAGE_KEY, JSON.stringify([]));
      return [];
    }
    // Clean up any legacy mock data containing 'cust-001'
    if (raw.includes("cust-001") || raw.includes("Clinique Pasteur Dakar")) {
      localStorage.setItem(CUSTOMERS_STORAGE_KEY, JSON.stringify([]));
      return [];
    }
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function getStoredCompanySettings(): CompanySettings {
  if (typeof window === "undefined") return DEFAULT_COMPANY_SETTINGS;
  try {
    const raw = localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(DEFAULT_COMPANY_SETTINGS));
      return DEFAULT_COMPANY_SETTINGS;
    }
    return { ...DEFAULT_COMPANY_SETTINGS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_COMPANY_SETTINGS;
  }
}

// ---------------------------------------------------------------------------
// Supabase Cloud Synchronizer & Realtime Subscriptions
// ---------------------------------------------------------------------------

let isSupabaseSyncInitialized = false;
let isFetchingFromSupabase = false;

export async function fetchFromSupabase(): Promise<{
  invoices: Invoice[];
  customers: Customer[];
} | null> {
  if (typeof window === "undefined" || isFetchingFromSupabase) return null;
  isFetchingFromSupabase = true;

  try {
    const [customersRes, invoicesRes, itemsRes, settingsRes] = await Promise.all([
      supabase.from("customers").select("*").order("created_at", { ascending: false }),
      supabase.from("invoices").select("*").order("issue_date", { ascending: false }),
      supabase.from("invoice_items").select("*"),
      supabase.from("company_settings").select("*").eq("id", "default").maybeSingle(),
    ]);

    if (customersRes.error || invoicesRes.error) {
      console.warn("Supabase fetch warning:", customersRes.error || invoicesRes.error);
      isFetchingFromSupabase = false;
      return null;
    }

    // Map invoice items by invoice_id
    const itemsByInvoiceId: Record<string, InvoiceItem[]> = {};
    if (itemsRes.data) {
      for (const item of itemsRes.data) {
        const list = itemsByInvoiceId[item.invoice_id] ?? [];
        list.push({
          id: item.id,
          description: item.description,
          quantity: item.quantity,
          unitPrice: Number(item.unit_price),
          amount: Number(item.amount),
        });
        itemsByInvoiceId[item.invoice_id] = list;
      }
    }

    const customers: Customer[] = (customersRes.data || []).map((row) => {
      const dateParts = (row.created_at || "").split("T");
      const createdAt = dateParts[0] || new Date().toISOString().slice(0, 10);
      return {
        id: row.id,
        name: row.name,
        contactName: row.contact_name || "",
        email: row.email || "",
        phone: row.phone || "",
        address: row.address || "",
        city: row.city || "Dakar",
        country: row.country || "Sénégal",
        avatarUrl: row.avatar_url || undefined,
        totalInvoiced: Number(row.total_invoiced || 0),
        invoicesCount: Number(row.invoices_count || 0),
        createdAt,
      };
    });

    const invoices: Invoice[] = (invoicesRes.data || []).map((row) => ({
      id: row.id,
      number: row.number,
      customerId: row.customer_id || undefined,
      customerName: row.customer_name,
      customerEmail: row.customer_email || undefined,
      customerPhone: row.customer_phone || undefined,
      customerAddress: row.customer_address || undefined,
      customerCity: row.customer_city || "Dakar",
      customerCountry: row.customer_country || "Sénégal",
      customerAvatar: row.customer_avatar || undefined,
      issueDate: row.issue_date,
      dueDate: row.due_date,
      amount: Number(row.amount),
      subtotalHt: Number(row.subtotal_ht || 0),
      taxAmount: Number(row.tax_amount || 0),
      status: row.status as InvoiceStatus,
      paymentMethod: row.payment_method || undefined,
      paymentProvider: row.payment_provider || undefined,
      notes: row.notes || undefined,
      terms: row.terms || undefined,
      items: itemsByInvoiceId[row.id] || [],
    }));

    localStorage.setItem(INVOICES_STORAGE_KEY, JSON.stringify(invoices));
    localStorage.setItem(CUSTOMERS_STORAGE_KEY, JSON.stringify(customers));
    notifyStoreUpdated();

    if (settingsRes.data) {
      const s = settingsRes.data;
      const settings: CompanySettings = {
        id: s.id,
        name: s.name,
        tagline: s.tagline || "",
        city: s.city || "Dakar",
        country: s.country || "Sénégal",
        address: s.address || "",
        phone: s.phone || "",
        email: s.email || "",
        ninea: s.ninea || "",
        rccm: s.rccm || "",
        vatRate: Number(s.vat_rate || 18),
        prefix: s.prefix || "FAC-",
        defaultDueDays: Number(s.default_due_days || 15),
        wavePhone: s.wave_phone || "",
        orangeMoneyCode: s.orange_money_code || "",
        bankIban: s.bank_iban || "",
        isPro: Boolean(s.is_pro),
      };
      localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
    }

    isFetchingFromSupabase = false;
    return { invoices, customers };
  } catch (err) {
    console.error("fetchFromSupabase error:", err);
    isFetchingFromSupabase = false;
    return null;
  }
}

export function initSupabaseSync(): void {
  if (typeof window === "undefined" || isSupabaseSyncInitialized) return;
  isSupabaseSyncInitialized = true;

  // Initial cloud fetch
  fetchFromSupabase().catch((e) => console.warn("Supabase initial sync:", e));

  // Listen to PostgreSQL changes in Realtime via WebSocket
  try {
    supabase
      .channel("izifacture-db-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "invoices" },
        () => {
          fetchFromSupabase();
        }
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "customers" },
        () => {
          fetchFromSupabase();
        }
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "invoice_items" },
        () => {
          fetchFromSupabase();
        }
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "company_settings" },
        () => {
          fetchFromSupabase();
        }
      )
      .subscribe();
  } catch (err) {
    console.warn("Failed to subscribe to Supabase Realtime:", err);
  }
}

// Automatically start synchronization on client
if (typeof window !== "undefined") {
  initSupabaseSync();
}

// ---------------------------------------------------------------------------
// Store Mutation Operations (Optimistic UI + Supabase Async Persistence)
// ---------------------------------------------------------------------------

export function saveStoredCustomers(customers: Customer[], notify = true): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(CUSTOMERS_STORAGE_KEY, JSON.stringify(customers));
    if (notify) {
      notifyStoreUpdated();
    }
  } catch (e) {
    console.error("Failed to save customers to localStorage", e);
  }
}

export function syncCustomersBilling(invoicesList?: Invoice[]): void {
  if (typeof window === "undefined") return;
  try {
    const invoices = invoicesList || getStoredInvoices();
    const customers = getStoredCustomers();

    let hasChanges = false;
    const updated = customers.map((c) => {
      const matching = invoices.filter(
        (inv) =>
          (inv.customerId && inv.customerId === c.id) ||
          inv.customerName.toLowerCase().trim() === c.name.toLowerCase().trim()
      );

      const newTotal = matching.reduce((sum, inv) => sum + (inv.amount || 0), 0);
      const newCount = matching.length;
      if (c.totalInvoiced !== newTotal || c.invoicesCount !== newCount) {
        hasChanges = true;
        return {
          ...c,
          totalInvoiced: newTotal,
          invoicesCount: newCount,
        };
      }
      return c;
    });

    if (hasChanges) {
      saveStoredCustomers(updated, false);

      // Async update in Supabase
      for (const cust of updated) {
        supabase
          .from("customers")
          .update({
            total_invoiced: cust.totalInvoiced,
            invoices_count: cust.invoicesCount,
            updated_at: new Date().toISOString(),
          })
          .eq("id", cust.id)
          .then();
      }
    }
  } catch (e) {
    console.error("Failed to sync customer billing", e);
  }
}

export function saveStoredInvoices(invoices: Invoice[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(INVOICES_STORAGE_KEY, JSON.stringify(invoices));
    syncCustomersBilling(invoices);
    notifyStoreUpdated();
  } catch (e) {
    console.error("Failed to save invoices to localStorage", e);
  }
}

// --- Invoices ---

export function getInvoiceById(id: string): Invoice | undefined {
  const invoices = getStoredInvoices();
  return invoices.find((inv) => inv.id === id);
}

export function createOrUpdateInvoice(invoice: Invoice): Invoice {
  const invoices = getStoredInvoices();
  const index = invoices.findIndex((inv) => inv.id === invoice.id);
  if (index >= 0) {
    invoices[index] = invoice;
  } else {
    invoices.unshift(invoice);
  }
  saveStoredInvoices(invoices);

  // Async persist to Supabase
  (async () => {
    try {
      const { error } = await supabase.from("invoices").upsert({
        id: invoice.id,
        number: invoice.number,
        customer_id: invoice.customerId || null,
        customer_name: invoice.customerName,
        customer_email: invoice.customerEmail || null,
        customer_phone: invoice.customerPhone || null,
        customer_address: invoice.customerAddress || null,
        customer_city: invoice.customerCity || "Dakar",
        customer_country: invoice.customerCountry || "Sénégal",
        customer_avatar: invoice.customerAvatar || null,
        issue_date: invoice.issueDate,
        due_date: invoice.dueDate,
        amount: invoice.amount,
        subtotal_ht: invoice.subtotalHt || 0,
        tax_amount: invoice.taxAmount || 0,
        status: invoice.status,
        payment_method: invoice.paymentMethod || null,
        payment_provider: invoice.paymentProvider || null,
        notes: invoice.notes || null,
        terms: invoice.terms || null,
        updated_at: new Date().toISOString(),
      });

      if (error) {
        console.error("Supabase upsert invoice error:", error);
        return;
      }

      if (invoice.items) {
        await supabase.from("invoice_items").delete().eq("invoice_id", invoice.id);
        if (invoice.items.length > 0) {
          await supabase.from("invoice_items").insert(
            invoice.items.map((item, idx) => ({
              id: item.id || `item-${invoice.id}-${idx}`,
              invoice_id: invoice.id,
              description: item.description,
              quantity: item.quantity,
              unit_price: item.unitPrice,
              amount: item.amount,
            }))
          );
        }
      }
    } catch (e) {
      console.error("Supabase invoice sync error:", e);
    }
  })();

  return invoice;
}

export function deleteInvoiceById(id: string): boolean {
  const invoices = getStoredInvoices();
  const filtered = invoices.filter((inv) => inv.id !== id);
  saveStoredInvoices(filtered);

  // Async delete from Supabase (cascades to invoice_items)
  supabase
    .from("invoices")
    .delete()
    .eq("id", id)
    .then(({ error }) => {
      if (error) console.error("Supabase delete invoice error:", error);
    });

  return filtered.length !== invoices.length;
}

export function setInvoiceStatus(id: string, status: InvoiceStatus): Invoice | undefined {
  const invoices = getStoredInvoices();
  const invoice = invoices.find((inv) => inv.id === id);
  if (invoice) {
    invoice.status = status;
    saveStoredInvoices(invoices);

    // Async update in Supabase
    supabase
      .from("invoices")
      .update({ status, updated_at: new Date().toISOString() })
      .eq("id", id)
      .then(({ error }) => {
        if (error) console.error("Supabase status update error:", error);
      });
  }
  return invoice;
}

// --- Customers ---

export function getCustomerById(id: string): Customer | undefined {
  const customers = getStoredCustomers();
  return customers.find((c) => c.id === id);
}

export function createOrUpdateCustomer(customer: Customer): Customer {
  const customers = getStoredCustomers();
  const index = customers.findIndex((c) => c.id === customer.id);
  if (index >= 0) {
    customers[index] = customer;
  } else {
    customers.unshift(customer);
  }
  saveStoredCustomers(customers);

  // Async persist to Supabase
  supabase
    .from("customers")
    .upsert({
      id: customer.id,
      name: customer.name,
      contact_name: customer.contactName || null,
      email: customer.email || null,
      phone: customer.phone || null,
      address: customer.address || null,
      city: customer.city || "Dakar",
      country: customer.country || "Sénégal",
      avatar_url: customer.avatarUrl || null,
      total_invoiced: customer.totalInvoiced || 0,
      invoices_count: customer.invoicesCount || 0,
      updated_at: new Date().toISOString(),
    })
    .then(({ error }) => {
      if (error) console.error("Supabase upsert customer error:", error);
    });

  return customer;
}

export function deleteCustomerById(id: string): boolean {
  const customers = getStoredCustomers();
  const filtered = customers.filter((c) => c.id !== id);
  saveStoredCustomers(filtered);

  // Async delete from Supabase
  supabase
    .from("customers")
    .delete()
    .eq("id", id)
    .then(({ error }) => {
      if (error) console.error("Supabase delete customer error:", error);
    });

  return filtered.length !== customers.length;
}

// --- Company Settings ---

export function saveCompanySettings(settings: Partial<CompanySettings>): CompanySettings {
  const current = getStoredCompanySettings();
  const updated = { ...current, ...settings };
  if (typeof window !== "undefined") {
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(updated));
    notifyStoreUpdated();
  }

  // Async update in Supabase
  supabase
    .from("company_settings")
    .upsert({
      id: "default",
      name: updated.name,
      tagline: updated.tagline || null,
      city: updated.city || "Dakar",
      country: updated.country || "Sénégal",
      address: updated.address || null,
      phone: updated.phone || null,
      email: updated.email || null,
      ninea: updated.ninea || null,
      rccm: updated.rccm || null,
      vat_rate: updated.vatRate || 18,
      prefix: updated.prefix || "FAC-",
      default_due_days: updated.defaultDueDays || 15,
      wave_phone: updated.wavePhone || null,
      orange_money_code: updated.orangeMoneyCode || null,
      bank_iban: updated.bankIban || null,
      is_pro: updated.isPro,
      updated_at: new Date().toISOString(),
    })
    .then(({ error }) => {
      if (error) console.error("Supabase company settings error:", error);
    });

  return updated;
}
