export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      customers: {
        Row: {
          id: string;
          name: string;
          contact_name: string | null;
          email: string | null;
          phone: string | null;
          address: string | null;
          city: string | null;
          country: string | null;
          avatar_url: string | null;
          total_invoiced: number;
          invoices_count: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          name: string;
          contact_name?: string | null;
          email?: string | null;
          phone?: string | null;
          address?: string | null;
          city?: string | null;
          country?: string | null;
          avatar_url?: string | null;
          total_invoiced?: number;
          invoices_count?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          contact_name?: string | null;
          email?: string | null;
          phone?: string | null;
          address?: string | null;
          city?: string | null;
          country?: string | null;
          avatar_url?: string | null;
          total_invoiced?: number;
          invoices_count?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      invoices: {
        Row: {
          id: string;
          number: string;
          customer_id: string | null;
          customer_name: string;
          customer_email: string | null;
          customer_phone: string | null;
          customer_address: string | null;
          customer_city: string | null;
          customer_country: string | null;
          customer_avatar: string | null;
          issue_date: string;
          due_date: string;
          amount: number;
          subtotal_ht: number;
          tax_amount: number;
          status: "draft" | "sent" | "paid" | "overdue";
          payment_method: string | null;
          payment_provider: string | null;
          notes: string | null;
          terms: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          number: string;
          customer_id?: string | null;
          customer_name: string;
          customer_email?: string | null;
          customer_phone?: string | null;
          customer_address?: string | null;
          customer_city?: string | null;
          customer_country?: string | null;
          customer_avatar?: string | null;
          issue_date?: string;
          due_date: string;
          amount?: number;
          subtotal_ht?: number;
          tax_amount?: number;
          status?: "draft" | "sent" | "paid" | "overdue";
          payment_method?: string | null;
          payment_provider?: string | null;
          notes?: string | null;
          terms?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          number?: string;
          customer_id?: string | null;
          customer_name?: string;
          customer_email?: string | null;
          customer_phone?: string | null;
          customer_address?: string | null;
          customer_city?: string | null;
          customer_country?: string | null;
          customer_avatar?: string | null;
          issue_date?: string;
          due_date?: string;
          amount?: number;
          subtotal_ht?: number;
          tax_amount?: number;
          status?: "draft" | "sent" | "paid" | "overdue";
          payment_method?: string | null;
          payment_provider?: string | null;
          notes?: string | null;
          terms?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "invoices_customer_id_fkey";
            columns: ["customer_id"];
            isOneToOne: false;
            referencedRelation: "customers";
            referencedColumns: ["id"];
          }
        ];
      };
      invoice_items: {
        Row: {
          id: string;
          invoice_id: string;
          description: string;
          quantity: number;
          unit_price: number;
          amount: number;
          created_at: string;
        };
        Insert: {
          id: string;
          invoice_id: string;
          description: string;
          quantity?: number;
          unit_price?: number;
          amount?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          invoice_id?: string;
          description?: string;
          quantity?: number;
          unit_price?: number;
          amount?: number;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "invoice_items_invoice_id_fkey";
            columns: ["invoice_id"];
            isOneToOne: false;
            referencedRelation: "invoices";
            referencedColumns: ["id"];
          }
        ];
      };
      company_settings: {
        Row: {
          id: string;
          name: string;
          tagline: string | null;
          city: string | null;
          country: string | null;
          address: string | null;
          phone: string | null;
          email: string | null;
          ninea: string | null;
          rccm: string | null;
          vat_rate: number | null;
          prefix: string | null;
          default_due_days: number | null;
          wave_phone: string | null;
          orange_money_code: string | null;
          bank_iban: string | null;
          is_pro: boolean | null;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name?: string;
          tagline?: string | null;
          city?: string | null;
          country?: string | null;
          address?: string | null;
          phone?: string | null;
          email?: string | null;
          ninea?: string | null;
          rccm?: string | null;
          vat_rate?: number | null;
          prefix?: string | null;
          default_due_days?: number | null;
          wave_phone?: string | null;
          orange_money_code?: string | null;
          bank_iban?: string | null;
          is_pro?: boolean | null;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          tagline?: string | null;
          city?: string | null;
          country?: string | null;
          address?: string | null;
          phone?: string | null;
          email?: string | null;
          ninea?: string | null;
          rccm?: string | null;
          vat_rate?: number | null;
          prefix?: string | null;
          default_due_days?: number | null;
          wave_phone?: string | null;
          orange_money_code?: string | null;
          bank_iban?: string | null;
          is_pro?: boolean | null;
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}
