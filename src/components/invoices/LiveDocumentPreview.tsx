"use client";

import React from "react";
import { type Invoice } from "@/lib/mock-data";
import { Money } from "@/components/shared/Money";
import { formatDate } from "@/lib/dates";
import { formatAmountInWordsLegal } from "@/lib/amount-in-words";
import { MOCK_COMPANY } from "@/lib/mock-data";

interface LiveDocumentPreviewProps {
  invoice: Partial<Invoice>;
  documentTypeLabel?: string;
  projectTitle?: string;
}

export function LiveDocumentPreview({
  invoice,
  documentTypeLabel = "Facture",
  projectTitle,
}: LiveDocumentPreviewProps) {
  const items = invoice.items || [];

  const subtotalHt = items.reduce(
    (sum, item) => sum + (Math.max(0, Number(item.quantity) || 0) * Math.max(0, Number(item.unitPrice) || 0)),
    0
  );
  const taxAmount = Math.round(subtotalHt * 0.18);
  const totalTtc = subtotalHt + taxAmount;
  const legalWords = totalTtc > 0 ? formatAmountInWordsLegal(totalTtc, "invoice") : "Zéro Franc CFA TTC";

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-5 sm:p-7 flex flex-col justify-between min-h-[640px] text-slate-800 transition-all">
      <div className="space-y-6">
        {/* Top Header: Big Invoice Title & Circular Signature Logo */}
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              {documentTypeLabel}
            </h2>
            <p className="text-xs font-mono font-bold text-slate-400 mt-0.5">
              #{invoice.number || "FAC-2026-0049"}
            </p>
            {projectTitle && (
              <p className="text-[11px] font-semibold text-[#701127] mt-1 bg-rose-50 px-2.5 py-0.5 rounded-full inline-block border border-rose-100">
                {projectTitle}
              </p>
            )}
          </div>

          {/* Signature Bordeaux Circular Logo from Daftra style */}
          <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#570c1d] to-[#8c1733] text-white flex items-center justify-center shadow-md shadow-[#701127]/20 shrink-0">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.4"
              className="w-6 h-6"
            >
              <circle cx="12" cy="12" r="3" fill="currentColor" />
              <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
            </svg>
          </div>
        </div>

        {/* Billed by / Billed to (2 clean columns matching screenshot) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2 text-xs">
          {/* Left: Billed by */}
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Billed by:
            </span>
            <p className="font-extrabold text-slate-900 text-sm">
              {MOCK_COMPANY.name}
            </p>
            <p className="text-slate-500">{MOCK_COMPANY.email}</p>
            <p className="text-slate-400 text-[11px]">
              {MOCK_COMPANY.address}, {MOCK_COMPANY.city}
            </p>
            <div className="pt-2 text-slate-600">
              <span className="text-slate-400 font-medium">Due date : </span>
              <span className="font-bold text-slate-900">
                {invoice.dueDate ? formatDate(invoice.dueDate) : "Sous 15 jours"}
              </span>
            </div>
          </div>

          {/* Right: Billed to */}
          <div className="space-y-1 sm:text-right">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Billed to:
            </span>
            <p className="font-extrabold text-slate-900 text-sm">
              {invoice.customerName || "Nom du client"}
            </p>
            <p className="text-slate-500">
              {invoice.customerEmail || "email@client.com"}
            </p>
            <p className="text-slate-400 text-[11px]">
              {invoice.customerCity || "Dakar"}, {invoice.customerCountry || "Sénégal"}
            </p>
            {invoice.customerPhone && (
              <p className="text-slate-400 text-[11px] font-medium">
                {invoice.customerPhone}
              </p>
            )}
          </div>
        </div>

        {/* Items / Service Table with spacious column separation */}
        <div className="pt-2">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  <th className="py-2.5 pr-3 font-bold text-left">Items / Service</th>
                  <th className="py-2.5 px-2 text-center w-14 font-bold">QTY.</th>
                  <th className="py-2.5 px-3 text-right w-32 font-bold">Rate</th>
                  <th className="py-2.5 pl-4 text-right w-32 font-bold">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-800">
                {items.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-slate-400 italic">
                      Aucun article renseigné
                    </td>
                  </tr>
                ) : (
                  items.map((it, idx) => (
                    <tr key={it.id || idx} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-3.5 pr-3 align-top">
                        <p className="font-medium text-slate-900 leading-snug">
                          {it.description || "Nouvel article"}
                        </p>
                      </td>
                      <td className="py-3.5 px-2 text-center text-slate-600 font-semibold align-top whitespace-nowrap">
                        {it.quantity}
                      </td>
                      <td className="py-3.5 px-3 text-right text-slate-600 font-medium align-top whitespace-nowrap">
                        <Money
                          amount={it.unitPrice}
                          currencyClassName="text-[10px] text-slate-400 font-normal"
                        />
                      </td>
                      <td className="py-3.5 pl-4 text-right font-extrabold text-slate-900 align-top whitespace-nowrap">
                        <Money
                          amount={(Math.max(0, Number(it.quantity) || 0)) * (Math.max(0, Number(it.unitPrice) || 0))}
                          currencyClassName="text-[10px] text-slate-400 font-normal"
                        />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Subtotal, TVA 18% & Grand Total */}
          <div className="border-t border-slate-200 pt-4 mt-2 space-y-2 text-xs">
            <div className="flex justify-between items-center text-slate-500">
              <span className="font-medium">Sous-total HT :</span>
              <Money amount={subtotalHt} />
            </div>
            <div className="flex justify-between items-center text-slate-500">
              <span className="font-medium">TVA (18%) :</span>
              <Money amount={taxAmount} />
            </div>
            <div className="pt-2.5 border-t border-slate-100 flex justify-between items-baseline">
              <span className="text-sm font-extrabold text-slate-900">
                Grand Total:
              </span>
              <span className="text-lg font-black text-[#701127]">
                <Money amount={totalTtc} />
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Notes section at the bottom of the card */}
      <div className="pt-6 border-t border-slate-100 mt-6 text-xs space-y-1.5 text-slate-500">
        <p className="font-bold text-slate-700">Notes</p>
        <ul className="space-y-1 text-[11px] leading-relaxed">
          <li className="flex items-start gap-1.5">
            <span className="text-[#701127] font-bold">•</span>
            <span>
              Payment is due by{" "}
              <strong>
                {invoice.dueDate ? formatDate(invoice.dueDate) : "échéance convenue"}
              </strong>
              .
            </span>
          </li>
          <li className="flex items-start gap-1.5">
            <span className="text-[#701127] font-bold">•</span>
            <span>
              Include the invoice number <strong>#{invoice.number || "FAC-2026-0049"}</strong> in the payment reference to ensure accurate processing.
            </span>
          </li>
          <li className="flex items-start gap-1.5 text-slate-600 italic">
            <span className="text-[#701127] font-bold">•</span>
            <span>« {legalWords} »</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
