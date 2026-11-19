"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  FileText,
  Search,
  Plus,
  MessageCircle,
  Pencil,
  Eye,
  Trash2,
  AlertTriangle,
} from "lucide-react";
import { type Invoice } from "@/lib/mock-data";
import {
  getStoredInvoices,
  deleteInvoiceById,
  STORE_UPDATED_EVENT,
} from "@/lib/store";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Money } from "@/components/shared/Money";
import { formatDate } from "@/lib/dates";
import { InvoiceDetailModal } from "@/components/dashboard/InvoiceDetailModal";
import { cn } from "@/lib/utils";

export function InvoicesListView() {
  const [invoices, setInvoices] = useState<Invoice[]>(() => getStoredInvoices());
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [selectedInvoiceForModal, setSelectedInvoiceForModal] = useState<Invoice | null>(null);
  const [invoiceToDelete, setInvoiceToDelete] = useState<Invoice | null>(null);

  // Sync invoices list immediately when store updates (edit/create/delete/status change)
  useEffect(() => {
    const handleSync = () => {
      setInvoices(getStoredInvoices());
    };
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

  const handleConfirmDelete = () => {
    if (!invoiceToDelete) return;
    deleteInvoiceById(invoiceToDelete.id);
    setInvoices(getStoredInvoices());
    setInvoiceToDelete(null);
  };

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
      <div className="space-y-6">
        {/* Universal Page Header */}
        <PageHeader
          title="Factures"
          subtitle="Suivez, émettez et encaissez vos factures d'entreprises en FCFA"
          badgeText={`${invoices.length} factures au total`}
          actions={
            <Link
              href="/invoices/new"
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#701127] to-[#8c1733] hover:from-[#570c1d] hover:to-[#701127] text-white text-xs font-bold flex items-center gap-2 shadow-md shadow-[#701127]/25 transition-all active:scale-[0.98]"
            >
              <Plus className="w-4 h-4" />
              <span>Créer une facture</span>
            </Link>
          }
        />

        {/* Table & Filters Card */}
        <div className="bg-white rounded-2xl border border-slate-200/70 shadow-xs overflow-hidden">
          {/* Filter & Search Bar */}
          <div className="p-4 sm:p-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative w-full md:w-72">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Rechercher par client ou référence..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#701127]/20 focus:border-[#701127] transition-all"
              />
            </div>

            {/* Filter Pills by Status */}
            <div className="flex flex-wrap items-center p-1 rounded-xl bg-slate-100/80 text-xs font-medium">
              <button
                type="button"
                onClick={() => setFilterStatus("all")}
                className={cn(
                  "px-3 py-1.5 rounded-lg transition-all",
                  filterStatus === "all"
                    ? "bg-white text-slate-900 font-bold shadow-2xs"
                    : "text-slate-500 hover:text-slate-900"
                )}
              >
                Toutes ({invoices.length})
              </button>
              <button
                type="button"
                onClick={() => setFilterStatus("paid")}
                className={cn(
                  "px-3 py-1.5 rounded-lg transition-all",
                  filterStatus === "paid"
                    ? "bg-white text-emerald-800 font-bold shadow-2xs"
                    : "text-slate-500 hover:text-slate-900"
                )}
              >
                Payées
              </button>
              <button
                type="button"
                onClick={() => setFilterStatus("sent")}
                className={cn(
                  "px-3 py-1.5 rounded-lg transition-all",
                  filterStatus === "sent"
                    ? "bg-white text-amber-800 font-bold shadow-2xs"
                    : "text-slate-500 hover:text-slate-900"
                )}
              >
                Envoyées
              </button>
              <button
                type="button"
                onClick={() => setFilterStatus("overdue")}
                className={cn(
                  "px-3 py-1.5 rounded-lg transition-all",
                  filterStatus === "overdue"
                    ? "bg-white text-rose-800 font-bold shadow-2xs"
                    : "text-slate-500 hover:text-slate-900"
                )}
              >
                En retard
              </button>
              <button
                type="button"
                onClick={() => setFilterStatus("draft")}
                className={cn(
                  "px-3 py-1.5 rounded-lg transition-all",
                  filterStatus === "draft"
                    ? "bg-white text-slate-800 font-bold shadow-2xs"
                    : "text-slate-500 hover:text-slate-900"
                )}
              >
                Brouillons
              </button>
            </div>
          </div>

          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-50/75 border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  <th className="py-3 px-5">Réf Facture</th>
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
                  const whatsappMsg = encodeURIComponent(
                    `Bonjour, voici votre facture ${inv.number} d'un montant de ${inv.amount.toLocaleString()} FCFA pour ${inv.customerName}. Merci de bien vouloir procéder au règlement.`
                  );

                  return (
                    <tr
                      key={inv.id}
                      className="hover:bg-rose-50/20 transition-colors group cursor-pointer"
                    >
                      {/* Ref */}
                      <td className="py-3.5 px-5 font-bold text-slate-900">
                        <Link
                          href={`/invoices/${inv.id}`}
                          className="flex items-center gap-2 hover:text-[#701127]"
                        >
                          <div className="w-7 h-7 rounded-lg bg-rose-50 border border-rose-100 text-[#701127] flex items-center justify-center shrink-0">
                            <FileText className="w-3.5 h-3.5" />
                          </div>
                          <span>{inv.number}</span>
                        </Link>
                      </td>

                      {/* Customer */}
                      <td className="py-3.5 px-4 font-semibold text-slate-900">
                        <Link href={`/invoices/${inv.id}`} className="hover:text-[#701127]">
                          <span className="block">{inv.customerName}</span>
                          <span className="text-[10px] text-slate-400 font-normal">
                            {inv.customerCity} • {inv.customerCountry}
                          </span>
                        </Link>
                      </td>

                      {/* Issue date */}
                      <td className="py-3.5 px-4 font-medium text-slate-600">
                        {formatDate(inv.issueDate)}
                      </td>

                      {/* Due date */}
                      <td className="py-3.5 px-4 font-medium">
                        <span
                          className={cn(
                            inv.status === "overdue" ? "text-rose-600 font-bold" : "text-slate-600"
                          )}
                        >
                          {formatDate(inv.dueDate)}
                        </span>
                      </td>

                      {/* Amount */}
                      <td className="py-3.5 px-4 text-right">
                        <Money
                          amount={inv.amount}
                          className="text-slate-900 font-bold"
                          currencyClassName="text-[10px] text-slate-400"
                        />
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        <StatusBadge status={inv.status} />
                      </td>

                      {/* Payment */}
                      <td className="py-3.5 px-4 text-slate-700 text-[11px]">
                        <span className="font-semibold block">{inv.paymentMethod || "—"}</span>
                        {inv.paymentProvider && (
                          <span className="text-[10px] text-slate-400">{inv.paymentProvider}</span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-5 text-right">
                        <div className="flex items-center justify-end gap-1.5 opacity-90 group-hover:opacity-100 transition-opacity">
                          {/* WhatsApp */}
                          <a
                            href={`https://wa.me/?text=${whatsappMsg}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50 border border-transparent hover:border-emerald-200 transition-colors"
                            title="Partager par WhatsApp"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <MessageCircle className="w-4 h-4" />
                          </a>

                          {/* Edit */}
                          <Link
                            href={`/invoices/${inv.id}/edit`}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-[#701127] hover:bg-rose-50 transition-colors"
                            title="Modifier la facture"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Pencil className="w-4 h-4" />
                          </Link>

                          {/* View detail & Download */}
                          <Link
                            href={`/invoices/${inv.id}`}
                            className="p-1.5 rounded-lg bg-slate-100 hover:bg-[#701127] text-slate-600 hover:text-white transition-all shadow-2xs"
                            title="Consulter et télécharger la facture"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>

                          {/* Delete Invoice Button */}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setInvoiceToDelete(inv);
                            }}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-200 transition-colors"
                            title="Supprimer la facture"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}

                {filteredInvoices.length === 0 && (
                  <tr>
                    <td colSpan={8} className="py-16 text-center">
                      <div className="flex flex-col items-center justify-center max-w-sm mx-auto">
                        <div className="w-12 h-12 rounded-2xl bg-rose-50 text-[#701127] flex items-center justify-center mb-3 border border-rose-100">
                          <FileText className="w-6 h-6" />
                        </div>
                        <h3 className="font-bold text-slate-800 text-sm">
                          {invoices.length === 0
                            ? "Vous n'avez pas encore créé de facture"
                            : "Aucune facture ne correspond à votre recherche"}
                        </h3>
                        <p className="text-slate-400 text-xs mt-1">
                          {invoices.length === 0
                            ? "Commencez dès maintenant en générant votre première facture officielle en FCFA."
                            : "Modifiez vos filtres ou votre mot-clé pour afficher des résultats."}
                        </p>
                        {invoices.length === 0 && (
                          <Link
                            href="/invoices/new"
                            className="mt-4 px-4 py-2 rounded-xl bg-[#701127] hover:bg-[#570c1d] text-white text-xs font-bold shadow-sm transition-all flex items-center gap-1.5"
                          >
                            <Plus className="w-4 h-4" />
                            <span>Créer une facture</span>
                          </Link>
                        )}
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
                <h3 className="font-bold text-slate-800 text-sm">
                  {invoices.length === 0
                    ? "Vous n'avez pas encore créé de facture"
                    : "Aucune facture trouvée"}
                </h3>
                <p className="text-slate-400 text-xs mt-1 max-w-xs">
                  {invoices.length === 0
                    ? "Commencez dès maintenant en générant votre première facture officielle en FCFA."
                    : "Modifiez vos filtres de recherche."}
                </p>
                {invoices.length === 0 && (
                  <Link
                    href="/invoices/new"
                    className="mt-4 px-4 py-2 rounded-xl bg-[#701127] text-white text-xs font-bold shadow-sm flex items-center gap-1.5"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Créer une facture</span>
                  </Link>
                )}
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
                    <Link href={`/invoices/${inv.id}`}>
                      <span className="text-xs font-bold text-slate-900 block hover:text-[#701127]">
                        {inv.number}
                      </span>
                      <span className="text-xs font-semibold text-slate-700">
                        {inv.customerName}
                      </span>
                      <span className="text-[10px] text-slate-400 block">
                        {inv.customerCity} • {inv.customerCountry}
                      </span>
                    </Link>
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

                  {/* Actions mobile */}
                  <div className="flex items-center justify-between pt-2">
                    <span className="text-[10px] font-medium text-slate-500">
                      {inv.paymentProvider || inv.paymentMethod || "Non défini"}
                    </span>

                    <div className="flex items-center gap-1.5">
                      <a
                        href={`https://wa.me/?text=${mobileWhatsapp}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-2xs"
                        title="WhatsApp"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                      </a>

                      <Link
                        href={`/invoices/${inv.id}/edit`}
                        className="p-1.5 rounded-lg bg-slate-100 text-slate-700 border border-slate-200"
                        title="Modifier"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </Link>

                      <Link
                        href={`/invoices/${inv.id}`}
                        className="px-2.5 py-1.5 rounded-lg bg-[#701127] text-white text-xs font-semibold flex items-center gap-1 shadow-xs"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Détails & PDF</span>
                      </Link>

                      {/* Delete on Mobile */}
                      <button
                        type="button"
                        onClick={() => setInvoiceToDelete(inv)}
                        className="p-1.5 rounded-lg bg-slate-100 text-slate-500 hover:text-rose-600 hover:bg-rose-50 border border-slate-200 shadow-2xs"
                        title="Supprimer la facture"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <InvoiceDetailModal
        invoice={selectedInvoiceForModal}
        onClose={() => setSelectedInvoiceForModal(null)}
      />

      {/* Delete Confirmation Pop-up Modal */}
      {invoiceToDelete && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in"
          onClick={() => setInvoiceToDelete(null)}
        >
          <div
            className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-200 space-y-4 animate-in zoom-in-95"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 text-rose-600">
              <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5 text-rose-600" />
              </div>
              <div>
                <h3 className="font-extrabold text-base text-slate-900">Confirmer la suppression</h3>
                <p className="text-xs text-slate-400">Action irréversible</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Êtes-vous sûr de vouloir supprimer définitivement la facture <strong>{invoiceToDelete.number}</strong> d&apos;un montant de <strong>{invoiceToDelete.amount.toLocaleString()} FCFA</strong> pour le client <strong>{invoiceToDelete.customerName}</strong> ?
            </p>

            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setInvoiceToDelete(null)}
                className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-50 transition-colors"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-xs transition-colors"
              >
                Oui, supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
