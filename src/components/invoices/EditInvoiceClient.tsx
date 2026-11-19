"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getInvoiceById } from "@/lib/store";
import { type Invoice } from "@/lib/mock-data";
import { InvoiceEditor } from "./InvoiceEditor";

interface EditInvoiceClientProps {
  id: string;
}

export function EditInvoiceClient({ id }: EditInvoiceClientProps) {
  const [invoice] = useState<Invoice | null>(() => getInvoiceById(id) || null);

  if (!invoice) {
    return (
      <div className="p-12 text-center space-y-4">
        <h2 className="text-lg font-bold text-slate-800">Facture introuvable</h2>
        <p className="text-xs text-slate-500">La facture demandée n&apos;existe pas ou a été supprimée.</p>
        <Link
          href="/invoices"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#701127] text-white text-xs font-bold shadow-xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Retour aux factures</span>
        </Link>
      </div>
    );
  }

  return <InvoiceEditor initialInvoice={invoice} isEditMode={true} />;
}
