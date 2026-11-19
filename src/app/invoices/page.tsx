import React from "react";
import { AppShell } from "@/components/layout/AppShell";
import { InvoicesListView } from "@/components/invoices/InvoicesListView";

export default function InvoicesPage() {
  return (
    <AppShell>
      <InvoicesListView />
    </AppShell>
  );
}
