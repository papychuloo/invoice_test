"use client";

import React, { useState } from "react";
import {
  X,
  FileDown,
  MessageCircle,
  Printer,
  CheckCircle2,
  Building2,
  User,
  FileText,
} from "lucide-react";
import { type Invoice } from "@/lib/mock-data";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Money } from "@/components/shared/Money";
import { formatDate } from "@/lib/dates";
import { formatAmountInWordsLegal } from "@/lib/amount-in-words";

interface InvoiceDetailModalProps {
  invoice: Invoice | null;
  onClose: () => void;
}

export function InvoiceDetailModal({ invoice, onClose }: InvoiceDetailModalProps) {
  const [downloading, setDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  if (!invoice) return null;

  // Simulate lines based on invoice total
  const netHt = Math.round(invoice.amount / 1.18);
  const vatAmount = invoice.amount - netHt;
  const legalWords = formatAmountInWordsLegal(invoice.amount, "invoice");

  const handleDownloadPdf = () => {
    setDownloading(true);
    setTimeout(() => {
      setDownloading(false);
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3000);

      // Create a downloadable mock text/pdf file for testing
      const content = `FACTURE OFFICIELLE - ${invoice.number}\nClient: ${invoice.customerName}\nDate: ${invoice.issueDate}\nMontant: ${invoice.amount} FCFA\nStatut: ${invoice.status.toUpperCase()}\n\n${legalWords}`;
      const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${invoice.number}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }, 800);
  };

  const whatsappMessage = encodeURIComponent(
    `Bonjour ${invoice.customerName}, voici votre facture ${invoice.number} d'un montant de ${invoice.amount.toLocaleString()} FCFA émise par Clinique Al Noor. Statut: ${invoice.status}.`
  );

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200"
    >
      {/* Click outside to close */}
      <div className="fixed inset-0 -z-10" onClick={onClose} />

      {/* Modal Card */}
      <div className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200">
        {/* Modal Top Bar */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#6b0f23] to-[#8c1733] flex items-center justify-center text-white shadow-sm">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base tracking-tight">
                  {invoice.number}
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-rose-200 border border-white/10">
                  Détail de la facture
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Émise le {formatDate(invoice.issueDate)} • Échéance le {formatDate(invoice.dueDate)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <StatusBadge status={invoice.status} />
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors ml-2"
              title="Fermer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body: Invoice Preview Format A4 */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs text-slate-700 bg-[#FCFDFE]">
          {/* Top Invoice Metadata Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs">
            {/* Emetteur */}
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#701127] uppercase tracking-wider">
                <Building2 className="w-3.5 h-3.5" />
                <span>Émetteur</span>
              </div>
              <p className="font-bold text-slate-900 text-sm">Clinique Al Noor</p>
              <p className="text-slate-500">Cabinet Médical Spécialisé</p>
              <p className="text-slate-500">Plateau, Dakar • Sénégal</p>
              <p className="text-slate-400 text-[10px]">NINEA : 004829103 • RCCM : SN-DKR-2024-B-112</p>
            </div>

            {/* Client */}
            <div className="space-y-1 sm:text-right">
              <div className="flex items-center sm:justify-end gap-1.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <User className="w-3.5 h-3.5" />
                <span>Facturé à</span>
              </div>
              <p className="font-bold text-slate-900 text-sm">{invoice.customerName}</p>
              <p className="text-slate-500">{invoice.customerCity} • {invoice.customerCountry}</p>
              <p className="text-slate-500">Moyen de règlement : {invoice.paymentMethod || "Virement"}</p>
              {invoice.paymentProvider && (
                <span className="inline-block mt-1 px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200">
                  {invoice.paymentProvider}
                </span>
              )}
            </div>
          </div>

          {/* Line items table */}
          <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-2xs">
            <div className="p-3.5 bg-slate-50/80 border-b border-slate-200 font-bold text-slate-800 text-xs flex justify-between">
              <span>Désignation des prestations</span>
              <span>Total HT</span>
            </div>
            <div className="divide-y divide-slate-100">
              <div className="p-3.5 flex items-center justify-between">
                <div>
                  <p className="font-semibold text-slate-900">Prestations de services et soins médicaux</p>
                  <p className="text-[11px] text-slate-400">Consultations spécialisées, examens et suivi clinique</p>
                </div>
                <div className="text-right">
                  <span className="font-bold text-slate-900">
                    <Money amount={netHt} />
                  </span>
                  <span className="block text-[10px] text-slate-400">1 prestation</span>
                </div>
              </div>
            </div>
          </div>

          {/* Totals Section */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4 p-4 rounded-2xl bg-white border border-slate-200">
            {/* Amount in words */}
            <div className="sm:max-w-md space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Montant certifié en toutes lettres
              </span>
              <p className="text-xs font-serif italic text-slate-700 bg-rose-50/50 p-2.5 rounded-xl border border-rose-100/80 leading-relaxed">
                « {legalWords} »
              </p>
            </div>

            {/* Calculations breakdown */}
            <div className="w-full sm:w-64 space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Total HT :</span>
                <Money amount={netHt} />
              </div>
              <div className="flex justify-between text-slate-600">
                <span>TVA (18%) :</span>
                <Money amount={vatAmount} />
              </div>
              <div className="pt-2 border-t border-slate-200 flex justify-between font-black text-slate-900 text-sm">
                <span>Total TTC :</span>
                <span className="text-[#701127]">
                  <Money amount={invoice.amount} />
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Actions Footer */}
        <div className="p-4 px-6 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            {/* Print button */}
            <button
              type="button"
              onClick={() => window.print()}
              className="px-3 py-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Printer className="w-4 h-4 text-slate-500" />
              <span>Imprimer</span>
            </button>

            {/* WhatsApp Share button */}
            <a
              href={`https://wa.me/?text=${whatsappMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Partager sur WhatsApp</span>
            </a>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-300 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors"
            >
              Fermer
            </button>

            {/* Primary PDF Download Action */}
            <button
              type="button"
              disabled={downloading}
              onClick={handleDownloadPdf}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#701127] to-[#8c1733] hover:from-[#570c1d] hover:to-[#701127] text-white text-xs font-bold flex items-center gap-2 shadow-md shadow-[#701127]/20 active:scale-[0.98] transition-all disabled:opacity-60"
            >
              {downloadSuccess ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                  <span>Téléchargé avec succès !</span>
                </>
              ) : (
                <>
                  <FileDown className="w-4 h-4" />
                  <span>{downloading ? "Génération du PDF..." : "Télécharger la facture (PDF)"}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
