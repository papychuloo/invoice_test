"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  FileText,
  Search,
  ArrowUpRight,
  MessageCircle,
  Pencil,
  Eye,
  Plus,
} from "lucide-react";
import { type Invoice } from "@/lib/mock-data";
import { getStoredInvoices, STORE_UPDATED_EVENT } from "@/lib/store";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Money } from "@/components/shared/Money";
import { formatDate } from "@/lib/dates";
import { InvoiceDetailModal } from "@/components/dashboard/InvoiceDetailModal";
import { cn } from "@/lib/utils";

export function RecentInvoicesTable() {
  const [invoices, setInvoices] = useState<Invoice[]>(() => getStoredInvoices());
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  // Synchronize in real-time with local storage and other tabs
  useEffect(() => {
    const handleSync = () => setInvoices(getStoredInvoices());
    handleSync();
    window.addEventListener(STORE_UPDATED_EVENT, handleSync);
    window.addEventListener("storage", handleSync);
    window.addEventListener("focus", handleSync);
    return () => {
      window.removeEventListener(STORE_UPDATED_EVENT, handleSync);
      window.removeEventListener("storage", handleSync);
      window.removeEventListener("focus", handleSync);
    };
  }, []);

  const filteredInvoices = invoices.filter((inv) => {
    const matchesStatus = filterStatus === "all" || inv.status === filterStatus;
    const matchesSearch =
      inv.number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.customerCity.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <>
      <div className="bg-white rounded-2xl border border-slate-200/70 shadow-xs overflow-hidden">
        {/* Top Header & Filters Bar */}
        <div className="p-5 sm:p-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-slate-900 tracking-tight">
                Dernières factures
              </h2>
              <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 text-slate-600">
                {filteredInvoices.length}
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium mt-0.5">
              Suivi des factures émises, paiements encaissés et relances
            </p>
          </div>

          {/* Search & Status Filters */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Quick Search */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Filtrer par n° ou client..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-3 py-1.5 text-xs rounded-xl bg-slate-50 border border-slate-200/80 text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#701127]/20 focus:border-[#701127] transition-all w-48 sm:w-56"
              />
            </div>

            {/* Filter Pills */}
            <div className="flex items-center p-1 rounded-xl bg-slate-100/80 text-xs font-medium">
              <button
                type="button"
                onClick={() => setFilterStatus("all")}
                className={cn(
                  "px-2.5 py-1 rounded-lg transition-all",
                  filterStatus === "all"
                    ? "bg-white text-slate-900 font-semibold shadow-2xs"
                    : "text-slate-500 hover:text-slate-900"
                )}
              >
                Toutes
              </button>
              <button
                type="button"
                onClick={() => setFilterStatus("paid")}
                className={cn(
                  "px-2.5 py-1 rounded-lg transition-all",
                  filterStatus === "paid"
                    ? "bg-white text-emerald-700 font-semibold shadow-2xs"
                    : "text-slate-500 hover:text-slate-900"
                )}
              >
                Payées
              </button>
              <button
                type="button"
                onClick={() => setFilterStatus("sent")}
                className={cn(
                  "px-2.5 py-1 rounded-lg transition-all",
                  filterStatus === "sent"
                    ? "bg-white text-amber-700 font-semibold shadow-2xs"
                    : "text-slate-500 hover:text-slate-900"
                )}
              >
                Envoyées
              </button>
              <button
                type="button"
                onClick={() => setFilterStatus("overdue")}
                className={cn(
                  "px-2.5 py-1 rounded-lg transition-all",
                  filterStatus === "overdue"
                    ? "bg-white text-rose-700 font-semibold shadow-2xs"
                    : "text-slate-500 hover:text-slate-900"
                )}
              >
                En retard
              </button>
            </div>

            <Link
              href="/invoices"
              className="flex items-center gap-1 text-xs font-semibold text-[#701127] hover:text-[#570c1d] transition-colors pl-1"
            >
              <span>Voir tout</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50/75 border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="py-3 px-5">Réf / Facture</th>
                <th className="py-3 px-4">Client</th>
                <th className="py-3 px-4">Date émission</th>
                <th className="py-3 px-4">Échéance</th>
                <th className="py-3 px-4 text-right">Montant TTC</th>
                <th className="py-3 px-4">Statut</th>
                <th className="py-3 px-4">Règlement</th>
                <th className="py-3 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredInvoices.map((inv) => {
                const whatsappMessage = encodeURIComponent(
                  `Bonjour, voici votre facture ${inv.number} d'un montant de ${inv.amount.toLocaleString()} FCFA pour ${inv.customerName}. Merci de bien vouloir procéder au règlement.`
                );

                return (
                  <tr
                    key={inv.id}
                    className="hover:bg-rose-50/20 transition-colors group"
                  >
                    {/* Invoice Reference */}
                    <td className="py-3.5 px-5 font-semibold text-slate-900 flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-rose-50 border border-rose-100 text-[#701127] flex items-center justify-center shrink-0">
                        <FileText className="w-3.5 h-3.5" />
                      </div>
                      <span>{inv.number}</span>
                    </td>

                    {/* Customer */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2.5">
                        {inv.customerAvatar ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={inv.customerAvatar}
                            alt={inv.customerName}
                            className="w-7 h-7 rounded-full object-cover shrink-0 ring-1 ring-slate-200"
                          />
                        ) : (
                          <div className="w-7 h-7 rounded-full bg-slate-200 text-slate-600 font-bold flex items-center justify-center text-[10px] shrink-0">
                            {inv.customerName.slice(0, 2).toUpperCase()}
                          </div>
                        )}
                        <div className="flex flex-col">
                          <span className="font-semibold text-slate-900 group-hover:text-[#701127] transition-colors">
                            {inv.customerName}
                          </span>
                          <span className="text-[10px] text-slate-400">
                            {inv.customerCity} • {inv.customerCountry}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Issue Date formatted DD/MM/YYYY */}
                    <td className="py-3.5 px-4 font-medium text-slate-600">
                      {formatDate(inv.issueDate)}
                    </td>

                    {/* Due Date formatted DD/MM/YYYY */}
                    <td className="py-3.5 px-4 font-medium">
                      <span
                        className={cn(
                          inv.status === "overdue"
                            ? "text-rose-600 font-semibold"
                            : "text-slate-600"
                        )}
                      >
                        {formatDate(inv.dueDate)}
                      </span>
                    </td>

                    {/* Amount in FCFA */}
                    <td className="py-3.5 px-4 text-right">
                      <Money
                        amount={inv.amount}
                        className="text-slate-900 font-bold"
                        currencyClassName="text-[10px] text-slate-400"
                      />
                    </td>

                    {/* Status Badge with ultra visible borders */}
                    <td className="py-3.5 px-4">
                      <StatusBadge status={inv.status} />
                    </td>

                    {/* Payment Method / Provider */}
                    <td className="py-3.5 px-4">
                      <div className="flex flex-col text-[11px]">
                        <span className="font-medium text-slate-800">
                          {inv.paymentMethod || "—"}
                        </span>
                        {inv.paymentProvider && (
                          <span className="text-[10px] text-slate-400">
                            {inv.paymentProvider}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Actions : WhatsApp, Modifier (Crayon), Voir Détail & Télécharger (Œil) */}
                    <td className="py-3.5 px-5 text-right">
                      <div className="flex items-center justify-end gap-1.5 opacity-90 group-hover:opacity-100 transition-opacity">
                        {/* WhatsApp Share Link */}
                        <a
                          href={`https://wa.me/?text=${whatsappMessage}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50 transition-colors"
                          title="Partager par WhatsApp"
                        >
                          <MessageCircle className="w-4 h-4" />
                        </a>

                        {/* Modification button (Pencil) */}
                        <Link
                          href={`/invoices/${inv.id}/edit`}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-[#701127] hover:bg-rose-50 transition-colors"
                          title={`Modifier la facture ${inv.number}`}
                        >
                          <Pencil className="w-4 h-4" />
                        </Link>

                        {/* View Detail & Download PDF button (Eye) */}
                        <Link
                          href={`/invoices/${inv.id}`}
                          className="p-1.5 rounded-lg text-slate-600 hover:text-white hover:bg-[#701127] transition-all bg-slate-100"
                          title="Consulter et télécharger la facture (PDF)"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filteredInvoices.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-14 text-center">
                    <div className="flex flex-col items-center justify-center max-w-sm mx-auto">
                      <div className="w-12 h-12 rounded-2xl bg-rose-50 text-[#701127] flex items-center justify-center mb-3 border border-rose-100">
                        <FileText className="w-6 h-6" />
                      </div>
                      <h3 className="font-bold text-slate-800 text-sm">Aucune facture enregistrée</h3>
                      <p className="text-slate-400 text-xs mt-1">
                        Vous n&apos;avez encore émis aucune facture. Commencez dès maintenant à facturer vos clients en FCFA.
                      </p>
                      <Link
                        href="/invoices/new"
                        className="mt-4 px-4 py-2 rounded-xl bg-[#701127] hover:bg-[#570c1d] text-white text-xs font-bold shadow-sm transition-all flex items-center gap-1.5"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Créer une facture</span>
                      </Link>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden divide-y divide-slate-100 p-3 space-y-3">
          {filteredInvoices.length === 0 && (
            <div className="py-12 px-4 text-center flex flex-col items-center justify-center">
              <div className="w-12 h-12 rounded-2xl bg-rose-50 text-[#701127] flex items-center justify-center mb-3 border border-rose-100">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-800 text-sm">Aucune facture enregistrée</h3>
              <p className="text-slate-400 text-xs mt-1 max-w-xs">
                Vous n&apos;avez encore émis aucune facture.
              </p>
              <Link
                href="/invoices/new"
                className="mt-4 px-4 py-2 rounded-xl bg-[#701127] text-white text-xs font-bold shadow-sm flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Créer une facture</span>
              </Link>
            </div>
          )}
          {filteredInvoices.map((inv) => {
            const mobileWhatsapp = encodeURIComponent(
              `Bonjour, voici votre facture ${inv.number} d'un montant de ${inv.amount.toLocaleString()} FCFA pour ${inv.customerName}. Merci de bien vouloir procéder au règlement.`
            );

            return (
              <div
                key={inv.id}
                className="p-4 rounded-xl bg-slate-50/60 border border-slate-200/80 space-y-3 shadow-2xs"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">
                      {inv.number}
                    </span>
                    <span className="text-xs font-semibold text-slate-700">
                      {inv.customerName}
                    </span>
                    <span className="text-[10px] text-slate-400 block">
                      {inv.customerCity} • {inv.customerCountry}
                    </span>
                  </div>
                  <StatusBadge status={inv.status} />
                </div>

                <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-200/60">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-slate-400">Émise le</span>
                    <span className="font-medium text-slate-700">
                      {formatDate(inv.issueDate)}
                    </span>
                  </div>

                  <div className="flex flex-col">
                    <span className="text-[10px] text-slate-400">Échéance</span>
                    <span
                      className={cn(
                        "font-medium",
                        inv.status === "overdue" ? "text-rose-600 font-bold" : "text-slate-700"
                      )}
                    >
                      {formatDate(inv.dueDate)}
                    </span>
                  </div>

                  <div className="flex flex-col text-right">
                    <span className="text-[10px] text-slate-400">Montant</span>
                    <Money
                      amount={inv.amount}
                      className="font-bold text-slate-900"
                      currencyClassName="text-[10px]"
                    />
                  </div>
                </div>

                {/* Quick Mobile Action Buttons */}
                <div className="flex items-center justify-between pt-2">
                  <span className="text-[10px] font-medium text-slate-500">
                    {inv.paymentProvider || inv.paymentMethod || "Non défini"}
                  </span>

                  <div className="flex items-center gap-1.5">
                    {/* WhatsApp Share Button */}
                    <a
                      href={`https://wa.me/?text=${mobileWhatsapp}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 shadow-2xs transition-colors"
                      title="Partager par WhatsApp"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                    </a>

                    {/* Modifier Button */}
                    <Link
                      href={`/invoices/${inv.id}/edit`}
                      className="p-1.5 rounded-lg bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-[#701127] border border-slate-200/80 shadow-2xs transition-colors"
                      title="Modifier la facture"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </Link>

                    {/* Détails & PDF Button */}
                    <button
                      type="button"
                      className="px-2.5 py-1.5 rounded-lg bg-[#701127] hover:bg-[#570c1d] text-white text-xs font-semibold flex items-center gap-1 shadow-xs transition-colors"
                      title="Consulter et télécharger la facture (PDF)"
                      onClick={() => setSelectedInvoice(inv)}
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Détails & PDF</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Invoice Detail & Download Modal */}
      <InvoiceDetailModal
        invoice={selectedInvoice}
        onClose={() => setSelectedInvoice(null)}
      />
    </>
  );
}
