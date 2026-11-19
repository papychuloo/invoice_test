import React, { Suspense } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { EditInvoiceClient } from "@/components/invoices/EditInvoiceClient";

export const instant = false;

async function EditInvoiceContent({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <EditInvoiceClient id={id} />;
}

export default function EditInvoicePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <AppShell>
      <Suspense fallback={<div className="p-8 text-center text-xs text-slate-400">Chargement...</div>}>
        <EditInvoiceContent params={params} />
      </Suspense>
    </AppShell>
  );
}
