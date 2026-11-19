import React, { Suspense } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { InvoiceDetailView } from "@/components/invoices/InvoiceDetailView";

export const instant = false;

async function InvoiceDetailContent({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <InvoiceDetailView id={id} />;
}

export default function InvoiceDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <AppShell>
      <div className="max-w-7xl w-full mx-auto p-3.5 sm:p-6 lg:p-8 space-y-6">
        <Suspense fallback={<div className="p-8 text-center text-xs text-slate-400">Chargement...</div>}>
          <InvoiceDetailContent params={params} />
        </Suspense>
      </div>
    </AppShell>
  );
}
