"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Pencil,
  Trash2,
  FileDown,
  MessageCircle,
  ChevronDown,
  AlertTriangle,
} from "lucide-react";
import { type Invoice, type InvoiceStatus } from "@/lib/mock-data";
import {
  getInvoiceById,
  setInvoiceStatus,
  deleteInvoiceById,
  getStoredCompanySettings,
} from "@/lib/store";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Money } from "@/components/shared/Money";
import { formatDate } from "@/lib/dates";
import { formatAmountInWordsLegal } from "@/lib/amount-in-words";
import { cn } from "@/lib/utils";

interface InvoiceDetailViewProps {
  id: string;
}

export function InvoiceDetailView({ id }: InvoiceDetailViewProps) {
  const router = useRouter();
  const [invoice, setInvoice] = useState<Invoice | null>(() => getInvoiceById(id) || null);
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const company = getStoredCompanySettings();

  if (!invoice) {
    return (
      <div className="p-12 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-800">Facture introuvable</h2>
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

  const items = invoice.items || [];
  const subtotalHt = invoice.subtotalHt ?? items.reduce((s, it) => s + ((Number(it.quantity) || 0) * (Number(it.unitPrice) || 0)), 0);
  const taxAmount = invoice.taxAmount ?? Math.round(subtotalHt * 0.18);
  const totalTtc = invoice.amount ?? (subtotalHt + taxAmount);
  const legalWords = formatAmountInWordsLegal(totalTtc, "invoice");

  const handleStatusChange = (newStatus: InvoiceStatus) => {
    const updated = setInvoiceStatus(invoice.id, newStatus);
    if (updated) {
      setInvoice({ ...updated });
    }
    setIsStatusDropdownOpen(false);
  };

  const handleDelete = () => {
    deleteInvoiceById(invoice.id);
    setShowDeleteModal(false);
    router.push("/invoices");
  };

  const handleDownloadPdf = () => {
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);

    const statusLabels: Record<InvoiceStatus, string> = {
      paid: "PAYÉE",
      sent: "ENVOYÉE",
      overdue: "EN RETARD",
      draft: "BROUILLON",
    };

    const statusBadgeClass: Record<InvoiceStatus, string> = {
      paid: "badge-paid",
      sent: "badge-sent",
      overdue: "badge-overdue",
      draft: "badge-draft",
    };

    const rowsHtml = items.length === 0
      ? `<tr><td colspan="4" style="text-align:center; padding: 20px; color:#94a3b8;">Aucun article renseigné pour cette facture</td></tr>`
      : items.map((it) => `
        <tr>
          <td style="font-weight:600; color:#0f172a;">${it.description || "Article"}</td>
          <td style="text-align:center; font-weight:600;">${it.quantity}</td>
          <td style="text-align:right;">${(Number(it.unitPrice) || 0).toLocaleString("fr-FR")}&nbsp;FCFA</td>
          <td style="text-align:right; font-weight:700; color:#0f172a;">${((Number(it.quantity) || 0) * (Number(it.unitPrice) || 0)).toLocaleString("fr-FR")}&nbsp;FCFA</td>
        </tr>
      `).join("");

    const htmlContent = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Facture ${invoice.number} - ${invoice.customerName}</title>
  <style>
    @page { size: A4; margin: 12mm; }
    * { box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      color: #0f172a;
      background: #ffffff;
      margin: 0;
      padding: 24px;
      font-size: 13px;
      line-height: 1.5;
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      border-bottom: 2px solid #e2e8f0;
      padding-bottom: 20px;
      margin-bottom: 20px;
    }
    .brand-title {
      font-size: 24px;
      font-weight: 900;
      color: #701127;
      margin: 0 0 4px 0;
      letter-spacing: -0.02em;
    }
    .brand-tagline {
      font-size: 11px;
      color: #64748b;
      margin: 0;
    }
    .company-details {
      font-size: 11px;
      color: #64748b;
      margin-top: 6px;
      line-height: 1.4;
    }
    .doc-meta {
      text-align: right;
    }
    .doc-number {
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
      font-size: 18px;
      font-weight: 800;
      color: #701127;
      margin: 4px 0;
    }
    .badge {
      display: inline-block;
      padding: 3px 10px;
      border-radius: 9999px;
      font-size: 10px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    .badge-paid { background: #ecfdf5; color: #065f46; border: 1.5px solid #10b981; }
    .badge-sent { background: #fffbeb; color: #92400e; border: 1.5px solid #f59e0b; }
    .badge-overdue { background: #fff1f2; color: #9f1239; border: 1.5px solid #f43f5e; }
    .badge-draft { background: #f8fafc; color: #334155; border: 1.5px solid #94a3b8; }
    .dates-row {
      display: flex;
      gap: 16px;
      margin-top: 10px;
      font-size: 11px;
    }
    .grid-info {
      display: flex;
      justify-content: space-between;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      padding: 16px;
      margin-bottom: 20px;
    }
    .info-label {
      font-size: 10px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: #94a3b8;
      margin-bottom: 4px;
    }
    .info-name {
      font-size: 14px;
      font-weight: 800;
      color: #0f172a;
      margin-bottom: 2px;
    }
    .info-sub {
      font-size: 11px;
      color: #64748b;
      line-height: 1.4;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 20px;
      border-radius: 10px;
      overflow: hidden;
      border: 1px solid #e2e8f0;
    }
    th {
      background: #f8fafc;
      padding: 10px 12px;
      font-size: 10px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: #64748b;
      border-bottom: 1px solid #e2e8f0;
      text-align: left;
    }
    td {
      padding: 10px 12px;
      border-bottom: 1px solid #f1f5f9;
      font-size: 12px;
    }
    .totals-wrap {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 20px;
      padding-top: 16px;
      border-top: 1px solid #e2e8f0;
      margin-bottom: 20px;
    }
    .legal-box {
      flex: 1;
      background: #fff1f2;
      border: 1px solid #fecdd3;
      border-radius: 12px;
      padding: 12px 14px;
      font-style: italic;
      color: #881337;
      font-size: 11px;
      line-height: 1.5;
    }
    .totals-box {
      width: 260px;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      padding: 14px;
    }
    .totals-row {
      display: flex;
      justify-content: space-between;
      padding: 4px 0;
      font-size: 12px;
      color: #475569;
    }
    .totals-ttc {
      font-size: 15px;
      font-weight: 800;
      color: #701127;
      border-top: 2px solid #e2e8f0;
      padding-top: 8px;
      margin-top: 6px;
    }
    .payment-box {
      background: #f0fdf4;
      border: 1px solid #bbf7d0;
      border-radius: 12px;
      padding: 12px 14px;
      margin-bottom: 20px;
      font-size: 11px;
      color: #166534;
      line-height: 1.4;
    }
    .footer {
      text-align: center;
      font-size: 10px;
      color: #94a3b8;
      border-top: 1px solid #e2e8f0;
      padding-top: 14px;
    }
    @media print {
      body { padding: 0; }
      .no-print { display: none !important; }
    }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <h1 class="brand-title">${company.name}</h1>
      <p class="brand-tagline">${company.tagline || "Facturation certifiée conforme"}</p>
      <div class="company-details">
        ${company.address ? `${company.address} • ` : ""}${company.city}, ${company.country}<br />
        ${company.phone ? `Tél: ${company.phone} • ` : ""}${company.email ? `Email: ${company.email}<br />` : ""}
        ${company.ninea ? `NINEA: ${company.ninea} • ` : ""}${company.rccm ? `RCCM: ${company.rccm}` : ""}
      </div>
    </div>
    <div class="doc-meta">
      <span class="info-label">Facture officielle</span>
      <div class="doc-number">${invoice.number}</div>
      <span class="badge ${statusBadgeClass[invoice.status]}">${statusLabels[invoice.status]}</span>
      <div class="dates-row">
        <div>
          <span class="info-label" style="display:block;">Émission</span>
          <strong>${formatDate(invoice.issueDate)}</strong>
        </div>
        <div>
          <span class="info-label" style="display:block;">Échéance</span>
          <strong style="${invoice.status === "overdue" ? "color:#e11d48;" : ""}">${formatDate(invoice.dueDate)}</strong>
        </div>
      </div>
    </div>
  </div>

  <div class="grid-info">
    <div class="info-col">
      <div class="info-label">Destinataire (Facturé à)</div>
      <div class="info-name">${invoice.customerName}</div>
      <div class="info-sub">
        ${invoice.customerAddress ? `${invoice.customerAddress}<br />` : ""}
        ${invoice.customerCity}, ${invoice.customerCountry}<br />
        ${invoice.customerEmail ? `Email : ${invoice.customerEmail}<br />` : ""}
        ${invoice.customerPhone ? `Tél : ${invoice.customerPhone}` : ""}
      </div>
    </div>
    <div class="info-col" style="text-align:right;">
      <div class="info-label">Règlement officiel</div>
      <div class="info-sub" style="margin-top:4px;">
        <strong>Mode :</strong> ${invoice.paymentMethod || "Mobile Money"}<br />
        <strong>Canal :</strong> ${invoice.paymentProvider || "Wave / Orange Money"}<br />
        <strong>Devise légale :</strong> Franc CFA (Zone UEMOA / CEMAC)
      </div>
    </div>
  </div>

  <table>
    <thead>
      <tr>
        <th>Description de la prestation</th>
        <th style="width: 70px; text-align:center;">Qté</th>
        <th style="width: 140px; text-align:right;">Prix unitaire</th>
        <th style="width: 140px; text-align:right;">Total HT</th>
      </tr>
    </thead>
    <tbody>
      ${rowsHtml}
    </tbody>
  </table>

  <div class="totals-wrap">
    <div class="legal-box">
      <strong style="display:block; margin-bottom:4px; font-size:10px; text-transform:uppercase; letter-spacing:0.05em;">Arrêté de la présente facture :</strong>
      « ${legalWords} »
    </div>
    <div class="totals-box">
      <div class="totals-row">
        <span>Sous-total HT :</span>
        <strong>${subtotalHt.toLocaleString("fr-FR")}&nbsp;FCFA</strong>
      </div>
      <div class="totals-row">
        <span>TVA (18%) :</span>
        <strong>${taxAmount.toLocaleString("fr-FR")}&nbsp;FCFA</strong>
      </div>
      <div class="totals-row totals-ttc">
        <span>Total TTC :</span>
        <span>${totalTtc.toLocaleString("fr-FR")}&nbsp;FCFA</span>
      </div>
    </div>
  </div>

  <div class="payment-box">
    <strong>Modalités de paiement acceptées :</strong><br />
    • Wave Mobile Money : ${company.wavePhone || "+221 77 123 45 67"}<br />
    • Orange Money : ${company.orangeMoneyCode || "+221 78 987 65 43"}<br />
    • Virement bancaire RIB : ${company.bankIban || "SN012 01234 000123456789 45"}
  </div>

  <div class="footer">
    Document certifié conforme aux dispositions fiscales du Code Général des Impôts (Norme UEMOA / CEMAC).<br />
    ${company.name} • ${company.city}, ${company.country}
  </div>
</body>
</html>`;

    // 1. Open print preview dialog
    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.open();
      printWindow.document.write(htmlContent);
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => {
        printWindow.print();
      }, 350);
    }

    // 2. Also trigger direct download of the official HTML invoice file
    const blob = new Blob([htmlContent], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${invoice.number}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const whatsappMessage = encodeURIComponent(
    `Bonjour ${invoice.customerName}, voici votre facture ${invoice.number} d'un montant de ${invoice.amount.toLocaleString()} FCFA émise par ${company.name}. Statut: ${invoice.status}.`
  );

  return (
    <div className="space-y-6">
      {/* Top Breadcrumb & Action Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200/80">
        <div className="flex items-center gap-3">
          <Link
            href="/invoices"
            className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors shadow-2xs"
            title="Retour à la liste"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight font-mono">
                {invoice.number}
              </h1>
              <StatusBadge status={invoice.status} />
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              {invoice.customerName} • {invoice.customerCity}, {invoice.customerCountry}
            </p>
          </div>
        </div>

        {/* Action Buttons Toolbar */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Status Change Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsStatusDropdownOpen(!isStatusDropdownOpen)}
              className="px-3 py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-colors"
            >
              <span>Changer le statut</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {isStatusDropdownOpen && (
              <div className="absolute right-0 top-full mt-1.5 w-48 bg-white rounded-2xl shadow-xl border border-slate-200 text-xs z-50 overflow-hidden animate-in fade-in zoom-in-95 p-1">
                <button
                  type="button"
                  onClick={() => handleStatusChange("paid")}
                  className="w-full px-3 py-2 text-left rounded-xl hover:bg-emerald-50 text-emerald-800 font-bold flex items-center gap-2 transition-colors"
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span>Marquer Payée</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleStatusChange("sent")}
                  className="w-full px-3 py-2 text-left rounded-xl hover:bg-amber-50 text-amber-800 font-bold flex items-center gap-2 transition-colors"
                >
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  <span>Marquer Envoyée</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleStatusChange("overdue")}
                  className="w-full px-3 py-2 text-left rounded-xl hover:bg-rose-50 text-rose-800 font-bold flex items-center gap-2 transition-colors"
                >
                  <span className="w-2 h-2 rounded-full bg-rose-500" />
                  <span>Marquer En retard</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleStatusChange("draft")}
                  className="w-full px-3 py-2 text-left rounded-xl hover:bg-slate-100 text-slate-700 font-bold flex items-center gap-2 transition-colors"
                >
                  <span className="w-2 h-2 rounded-full bg-slate-400" />
                  <span>Marquer Brouillon</span>
                </button>
              </div>
            )}
          </div>

          {/* Edit Button */}
          <Link
            href={`/invoices/${invoice.id}/edit`}
            className="px-3 py-2 rounded-xl bg-white hover:bg-rose-50 border border-slate-300 text-slate-700 hover:text-[#701127] text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-colors"
          >
            <Pencil className="w-3.5 h-3.5" />
            <span>Modifier</span>
          </Link>

          {/* WhatsApp Share */}
          <a
            href={`https://wa.me/?text=${whatsappMessage}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors"
            title="Partager par WhatsApp"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span>WhatsApp</span>
          </a>

          {/* Download PDF */}
          <button
            type="button"
            onClick={handleDownloadPdf}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#701127] to-[#8c1733] hover:from-[#570c1d] hover:to-[#701127] text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-[#701127]/25 transition-all active:scale-[0.98]"
          >
            <FileDown className="w-3.5 h-3.5" />
            <span>{downloadSuccess ? "Téléchargé !" : "Télécharger PDF"}</span>
          </button>

          {/* Delete Button */}
          <button
            type="button"
            onClick={() => setShowDeleteModal(true)}
            className="p-2 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 hover:text-rose-700 transition-colors"
            title="Supprimer la facture"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main A4 Document Paper Rendering */}
      <div className="max-w-4xl mx-auto bg-white p-6 sm:p-10 rounded-3xl border border-slate-200 shadow-lg space-y-8">
        {/* Document Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start gap-6 border-b border-slate-100 pb-6">
          <div>
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#701127] block">
              Document officiel de facturation
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-1">
              FACTURE
            </h2>
            <p className="text-sm font-bold font-mono text-[#701127] mt-0.5">
              {invoice.number}
            </p>

            <div className="flex flex-wrap items-center gap-6 mt-4 text-xs">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Date d&apos;émission</span>
                <span className="font-semibold text-slate-800">{formatDate(invoice.issueDate)}</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Date d&apos;échéance</span>
                <span className={cn("font-semibold", invoice.status === "overdue" ? "text-rose-600 font-bold" : "text-slate-800")}>
                  {formatDate(invoice.dueDate)}
                </span>
              </div>
            </div>
          </div>

          {/* Emetteur Info */}
          <div className="sm:text-right space-y-1">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#570c1d] to-[#8c1733] text-white shadow-sm mb-2">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className="w-6 h-6">
                <circle cx="12" cy="12" r="3" fill="currentColor" />
                <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
              </svg>
            </div>
            <h3 className="font-extrabold text-slate-900 text-sm">{company.name}</h3>
            {company.address && <p className="text-xs text-slate-500">{company.address}</p>}
            <p className="text-xs text-slate-500">{company.city} • {company.country}</p>
            <p className="text-[11px] text-slate-400 font-mono">
              {company.ninea ? `NINEA : ${company.ninea}` : ""} {company.rccm ? `• RCCM : ${company.rccm}` : ""}
            </p>
          </div>
        </div>

        {/* Client & Payment Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-5 rounded-2xl bg-slate-50/70 border border-slate-200/80 text-xs">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Destinataire (Facturé à)
            </span>
            <p className="text-sm font-bold text-slate-900">{invoice.customerName}</p>
            {invoice.customerAddress && <p className="text-slate-500">{invoice.customerAddress}</p>}
            <p className="text-slate-500">{invoice.customerCity} • {invoice.customerCountry}</p>
            {invoice.customerEmail && <p className="text-slate-500">{invoice.customerEmail}</p>}
            {invoice.customerPhone && <p className="text-slate-500 font-medium">{invoice.customerPhone}</p>}
          </div>

          <div className="sm:text-right space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Modalités de règlement
            </span>
            <p className="text-sm font-semibold text-slate-800">{invoice.paymentMethod || "Mobile Money"}</p>
            <p className="text-slate-500">{invoice.paymentProvider || "Wave / Orange Money / CBAO"}</p>
            <p className="text-slate-400 text-[11px]">Devise officielle : Franc CFA (XOF)</p>
          </div>
        </div>

        {/* Line Items Table */}
        <div className="rounded-2xl border border-slate-200 overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Description</th>
                <th className="py-3 px-3 text-center w-20">Qté</th>
                <th className="py-3 px-4 text-right w-36">Prix unitaire</th>
                <th className="py-3 px-4 text-right w-36">Total HT</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {items.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-xs text-slate-400">
                    Aucun article renseigné pour cette facture
                  </td>
                </tr>
              ) : (
                items.map((it, idx) => (
                  <tr key={it.id || idx} className="hover:bg-slate-50/50">
                    <td className="py-3.5 px-4 font-semibold text-slate-900">
                      {it.description}
                    </td>
                    <td className="py-3.5 px-3 text-center font-medium text-slate-600">
                      {it.quantity}
                    </td>
                    <td className="py-3.5 px-4 text-right font-medium text-slate-700">
                      <Money amount={it.unitPrice} />
                    </td>
                    <td className="py-3.5 px-4 text-right font-bold text-slate-900">
                      <Money amount={it.quantity * it.unitPrice} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Totals & Certified Legal Amount */}
        <div className="flex flex-col sm:flex-row justify-between items-start gap-6 pt-4 border-t border-slate-100">
          <div className="sm:max-w-md space-y-1.5">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Arrêté de la présente facture
            </span>
            <p className="text-xs font-serif italic text-slate-700 bg-rose-50/40 p-3 rounded-2xl border border-rose-100/70 leading-relaxed">
              « {legalWords} »
            </p>
          </div>

          <div className="w-full sm:w-64 space-y-2 text-xs text-right">
            <div className="flex justify-between text-slate-600">
              <span>Sous-total HT :</span>
              <Money amount={subtotalHt} />
            </div>
            <div className="flex justify-between text-slate-600">
              <span>TVA (18%) :</span>
              <Money amount={taxAmount} />
            </div>
            <div className="pt-2 border-t border-slate-200 flex justify-between items-baseline font-black text-slate-900 text-base">
              <span className="text-xs uppercase tracking-wide">Total TTC :</span>
              <span className="text-[#701127]">
                <Money amount={totalTtc} />
              </span>
            </div>
          </div>
        </div>

        {/* Notes */}
        {invoice.notes && (
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-500">
            <span className="font-bold text-slate-700 block mb-0.5">Instructions :</span>
            {invoice.notes}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in"
          onClick={() => setShowDeleteModal(false)}
        >
          <div
            className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-200 space-y-4 animate-in zoom-in-95"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 text-rose-600">
              <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-rose-600" />
              </div>
              <div>
                <h3 className="font-extrabold text-base text-slate-900">Confirmer la suppression</h3>
                <p className="text-xs text-slate-400">Action irréversible</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Êtes-vous sûr de vouloir supprimer définitivement la facture <strong>{invoice.number}</strong> d&apos;un montant de <strong>{invoice.amount.toLocaleString()} FCFA</strong> ?
            </p>

            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-50"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-xs"
              >
                Oui, supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
