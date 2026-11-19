"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
  Users,
  UserPlus,
  Search,
  MessageCircle,
  Pencil,
  Trash2,
  Mail,
  Phone,
  MapPin,
  Building2,
  FileText,
  AlertTriangle,
  CreditCard,
  UserCheck,
  CheckCircle2,
} from "lucide-react";
import { type Customer, type Invoice, type InvoiceStatus } from "@/lib/mock-data";
import {
  getStoredCustomers,
  deleteCustomerById,
  getStoredInvoices,
  STORE_UPDATED_EVENT,
} from "@/lib/store";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Money } from "@/components/shared/Money";
import { CustomerModal } from "./CustomerModal";

export function CustomersListView() {
  const [customers, setCustomers] = useState<Customer[]>(() => getStoredCustomers());
  const [invoices, setInvoices] = useState<Invoice[]>(() => getStoredInvoices());
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [customerToEdit, setCustomerToEdit] = useState<Customer | null>(null);
  const [customerToDelete, setCustomerToDelete] = useState<Customer | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Keep state synchronized whenever store changes (invoice edited/added/deleted)
  useEffect(() => {
    const handleStoreUpdate = () => {
      setCustomers(getStoredCustomers());
      setInvoices(getStoredInvoices());
    };

    window.addEventListener(STORE_UPDATED_EVENT, handleStoreUpdate);
    window.addEventListener("storage", handleStoreUpdate);
    window.addEventListener("focus", handleStoreUpdate);

    return () => {
      window.removeEventListener(STORE_UPDATED_EVENT, handleStoreUpdate);
      window.removeEventListener("storage", handleStoreUpdate);
      window.removeEventListener("focus", handleStoreUpdate);
    };
  }, []);

  // Compute live billing and account status per customer
  const customerStatsMap = useMemo(() => {
    const map = new Map<
      string,
      {
        total: number;
        count: number;
        status: "paid" | "sent" | "overdue" | "draft" | "none";
        statusLabel: string;
      }
    >();

    const evaluateStatus = (customerInvs: Invoice[]) => {
      if (customerInvs.length === 0) {
        return { status: "none" as const, statusLabel: "Aucune facture" };
      }
      if (customerInvs.some((inv) => inv.status === "overdue")) {
        return { status: "overdue" as const, statusLabel: "En retard" };
      }
      if (customerInvs.some((inv) => inv.status === "sent")) {
        return { status: "sent" as const, statusLabel: "En attente" };
      }
      if (customerInvs.every((inv) => inv.status === "draft")) {
        return { status: "draft" as const, statusLabel: "Brouillon" };
      }
      return { status: "paid" as const, statusLabel: "À jour (Payé)" };
    };

    customers.forEach((c) => {
      const cInvoices = invoices.filter(
        (inv) =>
          (inv.customerId && inv.customerId === c.id) ||
          inv.customerName.toLowerCase().trim() === c.name.toLowerCase().trim()
      );

      const total = cInvoices.reduce((sum, inv) => sum + (inv.amount || 0), 0);
      const count = cInvoices.length;
      const { status, statusLabel } = evaluateStatus(cInvoices);

      const data = { total, count, status, statusLabel };
      map.set(c.id, data);
      map.set(c.name.toLowerCase().trim(), data);
    });

    return map;
  }, [customers, invoices]);

  // Filter customers by search
  const filteredCustomers = useMemo(() => {
    if (!searchQuery.trim()) return customers;
    const q = searchQuery.toLowerCase();
    return customers.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.contactName.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        c.phone.toLowerCase().includes(q) ||
        c.city.toLowerCase().includes(q) ||
        c.country.toLowerCase().includes(q)
    );
  }, [customers, searchQuery]);

  // Overall KPIs calculated from real-time customer invoice amounts
  const totalInvoicedAll = useMemo(() => {
    return customers.reduce((sum, c) => {
      const stats = customerStatsMap.get(c.id) || customerStatsMap.get(c.name.toLowerCase().trim()) || {
        total: c.totalInvoiced || 0,
        count: c.invoicesCount || 0,
      };
      return sum + stats.total;
    }, 0);
  }, [customers, customerStatsMap]);

  const handleOpenAdd = () => {
    setCustomerToEdit(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (customer: Customer) => {
    setCustomerToEdit(customer);
    setIsModalOpen(true);
  };

  const handleSaved = (savedCustomer: Customer) => {
    setCustomers(getStoredCustomers());
    setToastMessage(`Client « ${savedCustomer.name} » ${customerToEdit ? "mis à jour" : "créé"} avec succès !`);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const confirmDelete = () => {
    if (!customerToDelete) return;
    const name = customerToDelete.name;
    deleteCustomerById(customerToDelete.id);
    setCustomers(getStoredCustomers());
    setCustomerToDelete(null);
    setToastMessage(`Client « ${name} » supprimé.`);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const getInitials = (name: string) => {
    const parts = name.trim().split(" ");
    if (parts.length >= 2 && parts[0] && parts[1]) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Page Header */}
      <PageHeader
        title="Clients & Partenaires"
        subtitle="Gestion du portefeuille client, coordonnées, historiques et relances directes WhatsApp."
        badgeText={`${customers.length} clients`}
        badgeVariant="slate"
        actions={
          <button
            type="button"
            onClick={handleOpenAdd}
            className="w-full sm:w-auto px-4.5 py-2.5 rounded-xl bg-gradient-to-r from-[#701127] to-[#8c1733] hover:from-[#570c1d] hover:to-[#701127] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-md shadow-[#701127]/25 transition-all active:scale-[0.98]"
          >
            <UserPlus className="w-4 h-4" />
            <span>Nouveau client</span>
          </button>
        }
      />

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Total Clients */}
        <div className="bg-white rounded-2xl border border-slate-200/70 p-5 shadow-xs hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Portefeuille Actif
            </span>
            <div className="w-9 h-9 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-center text-[#701127]">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-slate-900 mt-2 font-mono">
            {customers.length}
          </p>
          <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
            <UserCheck className="w-3.5 h-3.5 text-emerald-600 inline" />
            <span>100% enregistrés en zone FCFA</span>
          </p>
        </div>

        {/* Facturation cumulée */}
        <div className="bg-white rounded-2xl border border-slate-200/70 p-5 shadow-xs hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Facturation Cumulée
            </span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-700">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-[#701127] mt-2">
            <Money amount={totalInvoicedAll} />
          </p>
          <p className="text-[11px] text-slate-500 mt-1">
            Chiffre d&apos;affaires total émis
          </p>
        </div>

        {/* Panier Moyen */}
        <div className="bg-white rounded-2xl border border-slate-200/70 p-5 shadow-xs hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Moyenne par client
            </span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-700">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
            <Money amount={customers.length > 0 ? Math.round(totalInvoicedAll / customers.length) : 0} />
          </p>
          <p className="text-[11px] text-slate-500 mt-1">
            Valeur moyenne par compte client
          </p>
        </div>
      </div>

      {/* Search Toolbar */}
      <div className="bg-white rounded-2xl border border-slate-200/70 p-3 sm:p-4 shadow-xs">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher par nom de client, contact, email, téléphone, ville..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200/80 bg-slate-50/60 focus:bg-white focus:border-[#701127] focus:ring-2 focus:ring-[#701127]/20 outline-hidden text-xs text-slate-900 placeholder:text-slate-400 transition-all"
          />
        </div>
      </div>

      {/* Main Customers List */}
      <div className="bg-white rounded-2xl border border-slate-200/70 shadow-xs overflow-hidden">
        {filteredCustomers.length === 0 ? (
          <div className="p-14 text-center space-y-3 flex flex-col items-center justify-center">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-[#701127] flex items-center justify-center mx-auto border border-rose-100">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-slate-800 text-sm">
              {searchQuery ? "Aucun client trouvé" : "Votre annuaire clients est vide"}
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              {searchQuery
                ? `Aucun résultat pour "${searchQuery}". Vérifiez l'orthographe ou réinitialisez la recherche.`
                : "Commencez par ajouter votre premier client pour émettre des factures et devis en FCFA."}
            </p>
            {searchQuery ? (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors"
              >
                Réinitialiser la recherche
              </button>
            ) : (
              <button
                type="button"
                onClick={handleOpenAdd}
                className="mt-2 px-4 py-2.5 rounded-xl bg-[#701127] hover:bg-[#570c1d] text-white text-xs font-bold shadow-sm transition-all flex items-center gap-1.5"
              >
                <UserPlus className="w-4 h-4" />
                <span>Ajouter votre premier client</span>
              </button>
            )}
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50/75 border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider py-3 px-4">
                  <tr>
                    <th className="py-3 px-4">Client / Entreprise</th>
                    <th className="py-3 px-4">Coordonnées</th>
                    <th className="py-3 px-4">Localisation</th>
                    <th className="py-3 px-4 text-center">Statut</th>
                    <th className="py-3 px-4 text-right">Facturé (FCFA)</th>
                    <th className="py-3 px-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {filteredCustomers.map((c) => {
                    const stats = customerStatsMap.get(c.id) || customerStatsMap.get(c.name.toLowerCase().trim()) || {
                      total: c.totalInvoiced || 0,
                      count: c.invoicesCount || 0,
                      status: "none" as const,
                      statusLabel: "Aucune facture",
                    };

                    const whatsappUrl = c.phone
                      ? `https://wa.me/${c.phone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
                        `Bonjour ${c.contactName || c.name}, Clinique Al Noor reste à votre entière disposition.`
                      )}`
                      : `https://wa.me/?text=${encodeURIComponent(
                        `Bonjour ${c.contactName || c.name}, Clinique Al Noor reste à votre disposition.`
                      )}`;

                    return (
                      <tr key={c.id} className="hover:bg-slate-50/70 transition-colors">
                        {/* Client details */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#701127] to-[#8c1733] text-white font-extrabold flex items-center justify-center text-xs shadow-xs shrink-0">
                              {getInitials(c.name)}
                            </div>
                            <div>
                              <p className="font-extrabold text-slate-900 text-xs">
                                {c.name}
                              </p>
                              <p className="text-[11px] text-slate-400 flex items-center gap-1">
                                <Building2 className="w-3 h-3 text-slate-400 inline" />
                                <span>Contact : {c.contactName || "—"}</span>
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Coordonnées */}
                        <td className="py-3.5 px-4 space-y-0.5">
                          {c.email ? (
                            <div className="flex items-center gap-1.5 text-slate-600 font-medium">
                              <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                              <a href={`mailto:${c.email}`} className="hover:text-[#701127] truncate max-w-[180px]">
                                {c.email}
                              </a>
                            </div>
                          ) : (
                            <span className="text-slate-400 italic">Pas d&apos;email</span>
                          )}
                          {c.phone ? (
                            <div className="flex items-center gap-1.5 text-slate-500 text-[11px]">
                              <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                              <a href={`tel:${c.phone}`} className="hover:text-[#701127]">
                                {c.phone}
                              </a>
                            </div>
                          ) : null}
                        </td>

                        {/* Localisation */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-1.5 text-slate-700 font-medium">
                            <MapPin className="w-3.5 h-3.5 text-[#701127] shrink-0" />
                            <span>
                              {c.city || "Dakar"}, {c.country || "Sénégal"}
                            </span>
                          </div>
                          {c.address && (
                            <p className="text-[10px] text-slate-400 truncate max-w-[180px] pl-5">
                              {c.address}
                            </p>
                          )}
                        </td>

                        {/* Statut du compte client */}
                        <td className="py-3.5 px-4 text-center">
                          {stats.status !== "none" ? (
                            <StatusBadge
                              status={stats.status as InvoiceStatus}
                              customLabel={stats.statusLabel}
                            />
                          ) : (
                            <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2.5 py-1 rounded-full border border-slate-200">
                              Aucune facture
                            </span>
                          )}
                        </td>

                        {/* Facturé */}
                        <td className="py-3.5 px-4 text-right">
                          <p className="font-extrabold text-slate-900 text-xs">
                            <Money amount={stats.total} />
                          </p>
                          <p className="text-[11px] text-slate-400">
                            {stats.count} {stats.count > 1 ? "factures" : "facture"}
                          </p>
                        </td>

                        {/* Actions : WhatsApp, Edit, Delete */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center justify-center gap-1.5">
                            {/* WhatsApp Direct */}
                            <a
                              href={whatsappUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white transition-colors shadow-2xs"
                              title="Contacter sur WhatsApp"
                            >
                              <MessageCircle className="w-3.5 h-3.5" />
                            </a>

                            {/* Edit Customer */}
                            <button
                              type="button"
                              onClick={() => handleOpenEdit(c)}
                              className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-600 hover:text-[#701127] hover:border-[#701127]/30 hover:bg-rose-50/50 transition-colors shadow-2xs"
                              title="Modifier les coordonnées"
                            >
                              <Pencil className="w-3.5 h-3.5" />
                            </button>

                            {/* Delete Customer */}
                            <button
                              type="button"
                              onClick={() => setCustomerToDelete(c)}
                              className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-400 hover:text-rose-600 hover:border-rose-300 hover:bg-rose-50 transition-colors shadow-2xs"
                              title="Supprimer le client"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile Stacked Cards View */}
            <div className="md:hidden divide-y divide-slate-100">
              {filteredCustomers.map((c) => {
                const stats = customerStatsMap.get(c.id) || customerStatsMap.get(c.name.toLowerCase().trim()) || {
                  total: c.totalInvoiced || 0,
                  count: c.invoicesCount || 0,
                  status: "none" as const,
                  statusLabel: "Aucune facture",
                };

                const mobileWhatsappUrl = c.phone
                  ? `https://wa.me/${c.phone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
                    `Bonjour ${c.contactName || c.name}, Clinique Al Noor reste à votre entière disposition.`
                  )}`
                  : `https://wa.me/?text=${encodeURIComponent(
                    `Bonjour ${c.contactName || c.name}, Clinique Al Noor reste à votre entière disposition.`
                  )}`;

                return (
                  <div key={c.id} className="p-4 space-y-3 bg-white hover:bg-slate-50/50 transition-colors">
                    {/* Top Row : Avatar + Nom + Ville */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#701127] to-[#8c1733] text-white font-extrabold flex items-center justify-center text-xs shadow-xs shrink-0">
                          {getInitials(c.name)}
                        </div>
                        <div>
                          <p className="font-extrabold text-slate-900 text-sm">
                            {c.name}
                          </p>
                          <p className="text-xs text-slate-500 font-medium">
                            {c.contactName || "Contact principal"}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-1 shrink-0">
                        {stats.status !== "none" ? (
                          <StatusBadge
                            status={stats.status as InvoiceStatus}
                            customLabel={stats.statusLabel}
                          />
                        ) : (
                          <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">
                            Aucune facture
                          </span>
                        )}
                        <span className="text-[10px] font-medium text-slate-400">
                          {c.city}
                        </span>
                      </div>
                    </div>

                    {/* Coordinates */}
                    <div className="grid grid-cols-1 gap-1 text-xs text-slate-600 bg-slate-50/70 p-2.5 rounded-xl border border-slate-100">
                      {c.email && (
                        <div className="flex items-center gap-2">
                          <Mail className="w-3.5 h-3.5 text-slate-400" />
                          <span className="truncate">{c.email}</span>
                        </div>
                      )}
                      {c.phone && (
                        <div className="flex items-center gap-2">
                          <Phone className="w-3.5 h-3.5 text-slate-400" />
                          <span>{c.phone}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2 text-slate-500">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        <span>{c.address ? `${c.address}, ` : ""}{c.city}, {c.country}</span>
                      </div>
                    </div>

                    {/* Financial Summary & Trio of Actions */}
                    <div className="flex items-center justify-between pt-1">
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                          Total facturé
                        </span>
                        <p className="font-extrabold text-slate-900 text-sm">
                          <Money amount={stats.total} />
                        </p>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-1.5">
                        <a
                          href={mobileWhatsappUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-2.5 py-1.5 rounded-lg bg-emerald-500 text-white font-bold text-xs flex items-center gap-1 shadow-2xs"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span>WhatsApp</span>
                        </a>

                        <button
                          type="button"
                          onClick={() => handleOpenEdit(c)}
                          className="p-1.5 rounded-lg bg-slate-100 border border-slate-200 text-slate-700 hover:text-[#701127]"
                          title="Modifier"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>

                        <button
                          type="button"
                          onClick={() => setCustomerToDelete(c)}
                          className="p-1.5 rounded-lg bg-slate-100 border border-slate-200 text-rose-600 hover:bg-rose-50"
                          title="Supprimer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>

      {/* Customer Create/Edit Modal */}
      <CustomerModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSaved={handleSaved}
        customerToEdit={customerToEdit}
      />

      {/* Delete Confirmation Modal */}
      {customerToDelete && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in"
          onClick={() => setCustomerToDelete(null)}
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
                <h3 className="font-extrabold text-base text-slate-900">Supprimer le client</h3>
                <p className="text-xs text-slate-400">Confirmation requise</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Êtes-vous sûr de vouloir supprimer le client <strong>{customerToDelete.name}</strong> ? Cette action est irréversible dans l&apos;interface.
            </p>

            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setCustomerToDelete(null)}
                className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-50 transition-colors"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-xs transition-colors"
              >
                Oui, supprimer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-[120] bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-2xl border border-slate-700/80 flex items-center gap-2.5 animate-in slide-in-from-bottom-3 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="text-xs font-semibold">{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
