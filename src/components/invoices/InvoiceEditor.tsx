"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  X,
  Star,
  Settings,
  EyeOff,
  Eye,
  Calendar,
  ChevronDown,
  GripVertical,
  Trash2,
  Plus,
  Send,
  Save,
  MoreHorizontal,
  CheckCircle2,
} from "lucide-react";
import {
  type Invoice,
  type InvoiceItem,
  type InvoiceStatus,
  type Customer,
} from "@/lib/mock-data";
import {
  getStoredCustomers,
  createOrUpdateInvoice,
  STORE_UPDATED_EVENT,
  fetchFromSupabase,
} from "@/lib/store";
import { LiveDocumentPreview } from "./LiveDocumentPreview";
import { CustomerModal } from "@/components/customers/CustomerModal";
import { cn } from "@/lib/utils";

interface InvoiceEditorProps {
  initialInvoice?: Invoice;
  isEditMode?: boolean;
}

export function InvoiceEditor({ initialInvoice, isEditMode = false }: InvoiceEditorProps) {
  const router = useRouter();
  const [customers, setCustomers] = useState<Customer[]>(() => getStoredCustomers());
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
  const [isCustomerDropdownOpen, setIsCustomerDropdownOpen] = useState(false);
  const [showPreview, setShowPreview] = useState(true);
  const [activeTab, setActiveTab] = useState<"details" | "setup">("details");
  const [activeMobileView, setActiveMobileView] = useState<"form" | "preview">("form");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Synchronize customer list from store and Supabase in real-time
  useEffect(() => {
    const handleUpdate = () => {
      setCustomers(getStoredCustomers());
    };

    window.addEventListener(STORE_UPDATED_EVENT, handleUpdate);
    window.addEventListener("storage", handleUpdate);
    window.addEventListener("focus", handleUpdate);

    fetchFromSupabase().then((res) => {
      if (res?.customers) {
        setCustomers(res.customers);
      }
    });

    return () => {
      window.removeEventListener(STORE_UPDATED_EVENT, handleUpdate);
      window.removeEventListener("storage", handleUpdate);
      window.removeEventListener("focus", handleUpdate);
    };
  }, []);

  // Initial title & customer fallback
  const defaultCustomer = initialInvoice ? null : (getStoredCustomers()[0] || null);
  const [documentTitle, setDocumentTitle] = useState(
    initialInvoice?.notes?.includes("Projet:")
      ? initialInvoice.notes.replace("Projet:", "").trim()
      : "Facture de prestations"
  );

  // Form State
  const [invoiceNumber, setInvoiceNumber] = useState<string>(
    () => initialInvoice?.number || `FAC-2026-${String(Math.floor(Math.random() * 9000) + 1000)}`
  );
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>(
    initialInvoice?.customerId || defaultCustomer?.id || ""
  );
  const [customerName, setCustomerName] = useState(
    initialInvoice?.customerName || defaultCustomer?.name || ""
  );
  const [customerEmail, setCustomerEmail] = useState(
    initialInvoice?.customerEmail || defaultCustomer?.email || ""
  );
  const [customerPhone, setCustomerPhone] = useState(
    initialInvoice?.customerPhone || defaultCustomer?.phone || ""
  );
  const [customerCity, setCustomerCity] = useState(
    initialInvoice?.customerCity || defaultCustomer?.city || "Dakar"
  );
  const [customerCountry, setCustomerCountry] = useState(
    initialInvoice?.customerCountry || defaultCustomer?.country || "Sénégal"
  );
  const [customerAddress, setCustomerAddress] = useState(
    initialInvoice?.customerAddress || defaultCustomer?.address || ""
  );

  const [issueDate, setIssueDate] = useState(() =>
    initialInvoice?.issueDate || new Date().toISOString().slice(0, 10)
  );
  const [dueDate, setDueDate] = useState(() => {
    if (initialInvoice?.dueDate) return initialInvoice.dueDate;
    const d = new Date();
    d.setDate(d.getDate() + 15);
    return d.toISOString().slice(0, 10);
  });
  const [status, setStatus] = useState<InvoiceStatus>(
    initialInvoice?.status || "sent"
  );
  const [projectTitle, setProjectTitle] = useState("Prestation commerciale & services");
  const [currency, setCurrency] = useState("XOF");

  // Dynamic Line Items - starts clean and empty for new invoices
  const [items, setItems] = useState<InvoiceItem[]>(
    initialInvoice?.items && initialInvoice.items.length > 0
      ? initialInvoice.items
      : []
  );

  // Customer selection
  const handleSelectCustomer = (cust: Customer) => {
    setSelectedCustomerId(cust.id);
    setCustomerName(cust.name);
    setCustomerEmail(cust.email);
    setCustomerPhone(cust.phone);
    setCustomerCity(cust.city);
    setCustomerCountry(cust.country);
    setCustomerAddress(cust.address);
    setIsCustomerDropdownOpen(false);
  };

  const handleCustomerCreated = (newCust: Customer) => {
    setCustomers(getStoredCustomers());
    handleSelectCustomer(newCust);
    setSuccessMessage(`Client « ${newCust.name} » créé et sélectionné avec succès !`);
    setTimeout(() => setSuccessMessage(null), 3500);
  };

  // Line item manipulation
  const handleAddItem = () => {
    const newItem: InvoiceItem = {
      id: `line-${Date.now()}`,
      description: "",
      quantity: 1,
      unitPrice: 0,
      amount: 0,
    };
    setItems((prev) => [...prev, newItem]);
  };

  const handleRemoveItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleItemChange = (id: string, field: keyof InvoiceItem, value: string | number) => {
    setItems((prevItems) =>
      prevItems.map((item) => {
        if (item.id !== id) return item;
        const updated = { ...item, [field]: value };
        const rawQty = field === "quantity" ? value : item.quantity;
        const rawPrice = field === "unitPrice" ? value : item.unitPrice;
        const qty = Math.max(0, Number(rawQty) || 0);
        const price = Math.max(0, Number(rawPrice) || 0);
        updated.amount = Math.round(qty * price);
        return updated;
      })
    );
  };

  // Calculations
  const subtotalHt = items.reduce(
    (sum, item) => sum + (Math.max(0, Number(item.quantity) || 0) * Math.max(0, Number(item.unitPrice) || 0)),
    0
  );
  const taxAmount = Math.round(subtotalHt * 0.18);
  const totalTtc = subtotalHt + taxAmount;

  // Save handler
  const handleSave = (targetStatus?: InvoiceStatus) => {
    if (!customerName.trim()) {
      alert("Veuillez sélectionner ou renseigner un client.");
      return;
    }

    const finalStatus = targetStatus || status;
    setIsSubmitting(true);
    const newInvoice: Invoice = {
      id: initialInvoice?.id || `inv-${Date.now()}`,
      number: invoiceNumber,
      customerId: selectedCustomerId,
      customerName,
      customerEmail,
      customerPhone,
      customerAddress,
      customerCity,
      customerCountry,
      issueDate,
      dueDate,
      amount: totalTtc,
      subtotalHt,
      taxAmount,
      status: finalStatus,
      paymentMethod: "Mobile Money",
      paymentProvider: "Wave / Orange Money",
      notes: projectTitle,
      items,
    };

    createOrUpdateInvoice(newInvoice);

    setSuccessMessage(
      isEditMode
        ? `Facture ${invoiceNumber} mise à jour avec succès (Statut : ${
            finalStatus === "paid"
              ? "Payée"
              : finalStatus === "sent"
              ? "Envoyée"
              : finalStatus === "overdue"
              ? "En retard"
              : "Brouillon"
          }) !`
        : finalStatus === "draft"
        ? `Facture ${invoiceNumber} sauvegardée comme brouillon !`
        : `Facture ${invoiceNumber} enregistrée et émise avec succès !`
    );

    setTimeout(() => {
      router.push(`/invoices/${newInvoice.id}`);
    }, 800);
  };

  const getInitials = (name: string) => {
    const parts = name.trim().split(" ");
    if (parts.length >= 2 && parts[0] && parts[1]) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.slice(0, 2).toUpperCase() || "CL";
  };

  return (
    <div className="space-y-4 animate-fade-in-up">
      {/* Toast Notification */}
      {successMessage && (
        <div className="p-4 rounded-2xl bg-emerald-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg animate-in fade-in slide-in-from-top-3">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{successMessage} Redirection en cours...</span>
        </div>
      )}

      {/* Master Card Container matching the user's reference screenshot */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
        {/* Top Header Bar: Close 'X' + Title Input + Action Buttons */}
        <div className="px-5 sm:px-8 py-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Left: Close X and Editable Title */}
          <div className="flex items-center gap-3 flex-1">
            <Link
              href="/invoices"
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors shrink-0"
              title="Retour aux factures"
            >
              <X className="w-5 h-5" />
            </Link>
            <input
              type="text"
              value={documentTitle}
              onChange={(e) => setDocumentTitle(e.target.value)}
              placeholder="Écrivez le titre de la facture ici..."
              className="text-base sm:text-lg font-bold text-slate-900 placeholder:text-slate-400 outline-hidden bg-transparent w-full focus:bg-slate-50/50 px-2.5 py-1 rounded-xl transition-all"
            />
          </div>

          {/* Right: Save draft + Send now buttons */}
          <div className="flex items-center gap-2.5 self-end sm:self-auto shrink-0">
            {/* Save draft */}
            <button
              type="button"
              disabled={isSubmitting}
              onClick={() => handleSave("draft")}
              className="px-4 py-2 rounded-xl border border-slate-200 hover:border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-bold transition-colors active:scale-[0.98]"
            >
              <Save className="w-3.5 h-3.5 inline mr-1.5" />
              <span>Sauvegarder brouillon</span>
            </button>

            {/* Send now / Mettre à jour */}
            <button
              type="button"
              disabled={isSubmitting}
              onClick={() => handleSave(status)}
              className="px-4.5 py-2 rounded-xl bg-gradient-to-r from-[#701127] to-[#8c1733] hover:from-[#570c1d] hover:to-[#701127] text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-[#701127]/25 transition-all active:scale-[0.98]"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isEditMode ? "Mettre à jour" : "Enregistrer facture"}</span>
            </button>

            {/* More Options */}
            <button
              type="button"
              className="p-2 rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50 transition-colors"
              title="Plus d'options"
            >
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Sub Header: Tabs Left ('Invoice Details', 'Setup') & Toggle Preview Right */}
        <div className="px-5 sm:px-8 py-2.5 border-b border-slate-100 flex items-center justify-between text-xs font-semibold">
          {/* Tabs */}
          <div className="flex items-center gap-6">
            <button
              type="button"
              onClick={() => setActiveTab("details")}
              className={cn(
                "flex items-center gap-1.5 py-1.5 border-b-2 transition-all",
                activeTab === "details"
                  ? "border-[#701127] text-[#701127] font-bold"
                  : "border-transparent text-slate-400 hover:text-slate-700"
              )}
            >
              <Star className="w-3.5 h-3.5 fill-[#701127]/20 text-[#701127]" />
              <span>Détails de la facture</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("setup")}
              className={cn(
                "flex items-center gap-1.5 py-1.5 border-b-2 transition-all",
                activeTab === "setup"
                  ? "border-[#701127] text-[#701127] font-bold"
                  : "border-transparent text-slate-400 hover:text-slate-700"
              )}
            >
              <Settings className="w-3.5 h-3.5 text-slate-400" />
              <span>Configuration & TVA</span>
            </button>
          </div>

          {/* Toggle Preview button on right */}
          <div className="flex items-center gap-2">
            {/* Mobile View Switcher */}
            <div className="lg:hidden flex items-center p-0.5 rounded-lg bg-slate-100 text-[11px]">
              <button
                type="button"
                onClick={() => setActiveMobileView("form")}
                className={cn(
                  "px-2 py-1 rounded-md transition-all font-semibold",
                  activeMobileView === "form" ? "bg-white text-slate-900 shadow-2xs" : "text-slate-500"
                )}
              >
                Formulaire
              </button>
              <button
                type="button"
                onClick={() => setActiveMobileView("preview")}
                className={cn(
                  "px-2 py-1 rounded-md transition-all font-semibold",
                  activeMobileView === "preview" ? "bg-white text-slate-900 shadow-2xs" : "text-slate-500"
                )}
              >
                Aperçu
              </button>
            </div>

            {/* Desktop Hide/Show Preview button */}
            <button
              type="button"
              onClick={() => setShowPreview(!showPreview)}
              className="hidden lg:flex items-center gap-1.5 text-slate-500 hover:text-slate-900 text-xs font-medium cursor-pointer transition-colors"
            >
              {showPreview ? (
                <>
                  <EyeOff className="w-3.5 h-3.5" />
                  <span>Masquer l&apos;aperçu</span>
                </>
              ) : (
                <>
                  <Eye className="w-3.5 h-3.5 text-[#701127]" />
                  <span className="text-[#701127] font-semibold">Afficher l&apos;aperçu</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Workspace Body: Split Screen (Left: Form, Right: Live Preview) */}
        <div className="p-5 sm:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Side: Invoice Details & Items Form */}
            <div
              className={cn(
                "space-y-6 transition-all",
                showPreview ? "lg:col-span-6" : "lg:col-span-12 max-w-4xl mx-auto",
                activeMobileView === "preview" ? "hidden lg:block" : "block"
              )}
            >
              {activeTab === "setup" ? (
                /* Setup Tab: TVA, Mentions et Paramètres */
                <div className="p-6 rounded-2xl bg-slate-50/70 border border-slate-200/80 space-y-4 text-xs">
                  <h3 className="font-extrabold text-slate-900 text-sm">
                    Configuration fiscale et comptable (Zone FCFA)
                  </h3>
                  <p className="text-slate-500">
                    Paramètres appliqués automatiquement à cette facture conformément aux réglementations UEMOA / CEMAC.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    <div className="p-4 rounded-xl bg-white border border-slate-200">
                      <span className="text-slate-400 font-bold block mb-1">Taux de TVA par défaut</span>
                      <p className="text-base font-extrabold text-[#701127]">18% (Régime normal)</p>
                      <p className="text-[11px] text-slate-400 mt-1">Calculée automatiquement sur le total hors taxes.</p>
                    </div>
                    <div className="p-4 rounded-xl bg-white border border-slate-200">
                      <span className="text-slate-400 font-bold block mb-1">Arrondi comptable</span>
                      <p className="text-base font-extrabold text-slate-900">À l&apos;entier FCFA le plus proche</p>
                      <p className="text-[11px] text-slate-400 mt-1">Aucune décimale pour le Franc CFA.</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveTab("details")}
                    className="px-4 py-2 rounded-xl bg-[#701127] text-white font-bold text-xs mt-2"
                  >
                    Retour aux détails
                  </button>
                </div>
              ) : (
                /* Details Tab: Exact Fields from the user's reference screenshot */
                <>
                  {/* Section 1: Invoice details */}
                  <div className="space-y-4">
                    <h3 className="text-base font-extrabold text-slate-900 tracking-tight">
                      Invoice details
                    </h3>

                    {/* Bill to (Client) Dropdown Card */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                        Bill to (Client)
                      </label>

                      <div className="relative">
                        <button
                          type="button"
                          onClick={() => setIsCustomerDropdownOpen(!isCustomerDropdownOpen)}
                          className="w-full p-3 rounded-2xl border border-slate-200 bg-white hover:border-slate-300 flex items-center justify-between text-left transition-all shadow-2xs group"
                        >
                          <div className="flex items-center gap-3">
                            {/* Avatar */}
                            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#701127] to-[#8c1733] text-white font-extrabold flex items-center justify-center text-xs shadow-xs shrink-0">
                              {getInitials(customerName)}
                            </div>
                            <div>
                              <p className="font-extrabold text-slate-900 text-xs sm:text-sm group-hover:text-[#701127] transition-colors">
                                {customerName || "Sélectionnez un client..."}
                              </p>
                              <p className="text-[11px] text-slate-400">
                                {customerEmail || "Aucune adresse email enregistrée"}
                              </p>
                            </div>
                          </div>
                          <ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-slate-700 transition-colors shrink-0" />
                        </button>

                        {/* Customer Dropdown Popover */}
                        {isCustomerDropdownOpen && (
                          <div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-2xl shadow-xl border border-slate-200 z-50 p-2 space-y-1 animate-in fade-in zoom-in-95 max-h-64 overflow-y-auto">
                            <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                              <span>Clients enregistrés</span>
                              <span className="text-[#701127] font-semibold">{customers.length} disponibles</span>
                            </div>

                            {customers.length === 0 ? (
                              <div className="p-4 text-center space-y-2">
                                <p className="text-xs font-semibold text-slate-700">Aucun client enregistré</p>
                                <p className="text-[11px] text-slate-400">Ajoutez votre premier client pour l&apos;associer à cette facture.</p>
                              </div>
                            ) : (
                              customers.map((c) => (
                                <button
                                  key={c.id}
                                  type="button"
                                  onClick={() => handleSelectCustomer(c)}
                                  className={cn(
                                    "w-full p-2.5 rounded-xl text-left flex items-center gap-3 transition-colors text-xs",
                                    selectedCustomerId === c.id
                                      ? "bg-rose-50 text-[#701127] font-bold"
                                      : "hover:bg-slate-50 text-slate-700"
                                  )}
                                >
                                  <div className="w-7 h-7 rounded-full bg-slate-200 text-slate-700 font-bold flex items-center justify-center text-[10px] shrink-0">
                                    {getInitials(c.name)}
                                  </div>
                                  <div className="flex-1 truncate">
                                    <p className="font-semibold text-slate-900 truncate">{c.name}</p>
                                    <p className="text-[10px] text-slate-400 truncate">{c.email} • {c.city}</p>
                                  </div>
                                </button>
                              ))
                            )}

                            <div className="pt-1.5 border-t border-slate-100">
                              <button
                                type="button"
                                onClick={() => {
                                  setIsCustomerDropdownOpen(false);
                                  setIsCustomerModalOpen(true);
                                }}
                                className="w-full py-2 px-3 rounded-xl bg-slate-100 hover:bg-[#701127] text-slate-700 hover:text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                              >
                                <Plus className="w-3.5 h-3.5" />
                                <span>Ajouter un nouveau client</span>
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* 3 Columns Row: Invoice number, Issued date, Due date */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                      {/* Invoice number */}
                      <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                          Invoice number
                        </label>
                        <input
                          type="text"
                          value={invoiceNumber}
                          onChange={(e) => setInvoiceNumber(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-mono font-bold text-slate-900 focus:border-[#701127] focus:ring-2 focus:ring-[#701127]/20 outline-hidden transition-all shadow-2xs"
                        />
                      </div>

                      {/* Issued date */}
                      <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                          Issued date
                        </label>
                        <div className="relative">
                          <input
                            type="date"
                            value={issueDate}
                            onChange={(e) => setIssueDate(e.target.value)}
                            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-800 focus:border-[#701127] focus:ring-2 focus:ring-[#701127]/20 outline-hidden transition-all shadow-2xs pr-9"
                          />
                          <Calendar className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                        </div>
                      </div>

                      {/* Due date */}
                      <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                          Due date
                        </label>
                        <div className="relative">
                          <input
                            type="date"
                            value={dueDate}
                            onChange={(e) => setDueDate(e.target.value)}
                            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-800 focus:border-[#701127] focus:ring-2 focus:ring-[#701127]/20 outline-hidden transition-all shadow-2xs pr-9"
                          />
                          <Calendar className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                        </div>
                      </div>
                    </div>

                    {/* Statut de la facture */}
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="block text-xs font-semibold text-slate-600">
                          Statut de la facture
                        </label>
                        <span className="text-[11px] font-bold text-slate-400">
                          {status === "paid"
                            ? "✅ Facture réglée"
                            : status === "sent"
                            ? "⏳ En attente de paiement"
                            : status === "overdue"
                            ? "⚠️ Échéance dépassée"
                            : "📝 Brouillon non émis"}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {[
                          { value: "draft", label: "Brouillon" },
                          { value: "sent", label: "Envoyée" },
                          { value: "paid", label: "Payée" },
                          { value: "overdue", label: "En retard" },
                        ].map((st) => (
                          <button
                            key={st.value}
                            type="button"
                            onClick={() => setStatus(st.value as InvoiceStatus)}
                            className={cn(
                              "px-3 py-2.5 rounded-xl text-xs font-bold border-2 transition-all flex items-center justify-center gap-2 shadow-2xs cursor-pointer",
                              status === st.value
                                ? st.value === "paid"
                                  ? "border-emerald-500 bg-emerald-50/90 text-emerald-900 ring-2 ring-emerald-500/20 font-bold"
                                  : st.value === "sent"
                                  ? "border-amber-500 bg-amber-50/90 text-amber-900 ring-2 ring-amber-500/20 font-bold"
                                  : st.value === "overdue"
                                  ? "border-rose-500 bg-rose-50/90 text-rose-900 ring-2 ring-rose-500/20 font-bold"
                                  : "border-slate-400 bg-slate-100/90 text-slate-800 ring-2 ring-slate-400/20 font-bold"
                                : "border-slate-200/80 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50"
                            )}
                          >
                            <span
                              className={cn(
                                "w-2.5 h-2.5 rounded-full shrink-0",
                                st.value === "paid"
                                  ? "bg-emerald-500"
                                  : st.value === "sent"
                                  ? "bg-amber-500"
                                  : st.value === "overdue"
                                  ? "bg-rose-500"
                                  : "bg-slate-400"
                              )}
                            />
                            <span>{st.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Project / Objet */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                        Project / Objet de facturation
                      </label>
                      <input
                        type="text"
                        value={projectTitle}
                        onChange={(e) => setProjectTitle(e.target.value)}
                        placeholder="Ex: 🔥 Mission d'assistance médicale & chirurgie"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-medium text-slate-900 focus:border-[#701127] focus:ring-2 focus:ring-[#701127]/20 outline-hidden transition-all shadow-2xs"
                      />
                    </div>
                  </div>

                  {/* Section 2: Invoice Items */}
                  <div className="space-y-4 pt-4 border-t border-slate-100">
                    <h3 className="text-base font-extrabold text-slate-900 tracking-tight">
                      Invoice Items
                    </h3>

                    {/* Currency selector matching screenshot */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                        Currency
                      </label>
                      <div className="relative">
                        <select
                          value={currency}
                          onChange={(e) => setCurrency(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-800 focus:border-[#701127] focus:ring-2 focus:ring-[#701127]/20 outline-hidden transition-all shadow-2xs appearance-none pr-9"
                        >
                          <option value="XOF">🇸🇳 Franc CFA - Zone UEMOA (XOF) FCFA</option>
                          <option value="XAF">🇨🇲 Franc CFA - Zone CEMAC (XAF) FCFA</option>
                          <option value="GNF">🇬🇳 Franc Guinéen (GNF)</option>
                        </select>
                        <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>
                    </div>

                    {/* Items Table Container matching screenshot */}
                    <div className="rounded-2xl border border-slate-200/90 overflow-hidden bg-white shadow-2xs">
                      {/* Table Header */}
                      <div className="px-4 py-2.5 bg-slate-50/75 border-b border-slate-200/80 flex items-center text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                        <span className="w-6 shrink-0" />
                        <span className="flex-1 px-2">Item Name</span>
                        <span className="w-16 text-center px-1">QTY</span>
                        <span className="w-28 text-right px-2">Rate (FCFA)</span>
                        <span className="w-24 text-right px-2">Total</span>
                        <span className="w-8 shrink-0" />
                      </div>

                      {/* Items Rows */}
                      <div className="divide-y divide-slate-100 p-2 space-y-1.5">
                        {items.length === 0 ? (
                          <div className="py-8 px-4 text-center">
                            <p className="text-xs text-slate-500 font-medium">
                              Aucun article dans cette facture.
                            </p>
                            <p className="text-[11px] text-slate-400 mt-1">
                              Cliquez sur « + Add a New Item » pour commencer à chiffrer votre prestation.
                            </p>
                          </div>
                        ) : (
                          items.map((it) => (
                            <div
                              key={it.id}
                              className="flex items-center gap-1.5 p-1 rounded-xl hover:bg-slate-50/70 transition-colors"
                            >
                              {/* Grip Drag Handle */}
                              <div className="w-6 flex items-center justify-center text-slate-300 hover:text-slate-500 cursor-grab shrink-0">
                                <GripVertical className="w-4 h-4" />
                              </div>

                              {/* Item Name Input */}
                              <input
                                type="text"
                                value={it.description}
                                onChange={(e) => handleItemChange(it.id, "description", e.target.value)}
                                placeholder="Description de la prestation ou de l'article..."
                                className="flex-1 px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium text-slate-900 focus:border-[#701127] focus:ring-1 focus:ring-[#701127] outline-hidden bg-white transition-all"
                              />

                              {/* QTY Input */}
                              <input
                                type="number"
                                min="1"
                                value={it.quantity}
                                onChange={(e) => handleItemChange(it.id, "quantity", e.target.value)}
                                className="w-16 px-2 py-2 rounded-xl border border-slate-200 text-xs font-bold text-center text-slate-800 focus:border-[#701127] focus:ring-1 focus:ring-[#701127] outline-hidden bg-white transition-all shrink-0"
                              />

                              {/* Rate Input */}
                              <div className="relative w-28 shrink-0">
                                <input
                                  type="number"
                                  min="0"
                                  value={it.unitPrice}
                                  onChange={(e) => handleItemChange(it.id, "unitPrice", e.target.value)}
                                  className="w-full px-2.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-right text-slate-800 focus:border-[#701127] focus:ring-1 focus:ring-[#701127] outline-hidden bg-white transition-all"
                                />
                              </div>

                              {/* Total per row */}
                              <div className="w-24 text-right font-extrabold text-xs text-slate-900 px-2 shrink-0">
                                {Math.round(Math.max(0, Number(it.quantity) || 0) * Math.max(0, Number(it.unitPrice) || 0)).toLocaleString()}
                              </div>

                              {/* Delete row */}
                              <button
                                type="button"
                                onClick={() => handleRemoveItem(it.id)}
                                className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors shrink-0 cursor-pointer"
                                title="Supprimer la ligne"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ))
                        )}
                      </div>

                      {/* + Add a New Item Button at bottom of table */}
                      <div className="p-3 border-t border-slate-100 bg-slate-50/40">
                        <button
                          type="button"
                          onClick={handleAddItem}
                          className="w-full py-2.5 rounded-xl border border-dashed border-slate-300 hover:border-[#701127] hover:bg-rose-50/30 text-slate-700 hover:text-[#701127] text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>+ Add a New Item</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Right Side: Clean High-End Invoice Preview matching screenshot */}
            {showPreview && (
              <div
                className={cn(
                  "lg:col-span-6 sticky top-6",
                  activeMobileView === "form" ? "hidden lg:block" : "block"
                )}
              >
                <LiveDocumentPreview
                  invoice={{
                    number: invoiceNumber,
                    customerName,
                    customerEmail,
                    customerPhone,
                    customerCity,
                    customerCountry,
                    issueDate,
                    dueDate,
                    items,
                    status: status,
                  }}
                  projectTitle={projectTitle}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Customer Modal for adding a new client on the fly */}
      <CustomerModal
        isOpen={isCustomerModalOpen}
        onClose={() => setIsCustomerModalOpen(false)}
        onSaved={handleCustomerCreated}
      />
    </div>
  );
}
