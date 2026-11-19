import React from "react";
import { AppShell } from "@/components/layout/AppShell";
import { InvoiceEditor } from "@/components/invoices/InvoiceEditor";

export default function NewInvoicePage() {
  return (
    <AppShell>
      <InvoiceEditor />
    </AppShell>
  );
}
