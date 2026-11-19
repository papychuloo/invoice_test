"use client";

import React, { useState } from "react";
import { X, UserPlus, Save, Building2, User, Mail, Phone, MapPin, Globe } from "lucide-react";
import { type Customer } from "@/lib/mock-data";
import { createOrUpdateCustomer } from "@/lib/store";

interface CustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved: (customer: Customer) => void;
  customerToEdit?: Customer | null;
}

const AFRICAN_COUNTRIES = [
  "Sénégal",
  "Côte d'Ivoire",
  "Cameroun",
  "Mali",
  "Gabon",
  "Togo",
  "Bénin",
  "Burkina Faso",
  "Guinée",
  "Congo",
  "France",
  "Autre",
];

function CustomerModalForm({
  onClose,
  onSaved,
  customerToEdit,
}: {
  onClose: () => void;
  onSaved: (customer: Customer) => void;
  customerToEdit?: Customer | null;
}) {
  const isEditing = Boolean(customerToEdit);

  const [formData, setFormData] = useState({
    name: customerToEdit?.name || "",
    contactName: customerToEdit?.contactName || "",
    email: customerToEdit?.email || "",
    phone: customerToEdit?.phone || "",
    address: customerToEdit?.address || "",
    city: customerToEdit?.city || "Dakar",
    country: customerToEdit?.country || "Sénégal",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.name.trim()) {
      errs.name = "Le nom ou l'entreprise est obligatoire";
    }
    if (formData.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errs.email = "Format d'email invalide";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const customer: Customer = {
      id: customerToEdit?.id || `cust-${Date.now()}`,
      name: formData.name.trim(),
      contactName: formData.contactName.trim() || formData.name.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      address: formData.address.trim(),
      city: formData.city.trim() || "Dakar",
      country: formData.country,
      avatarUrl: customerToEdit?.avatarUrl || "",
      totalInvoiced: customerToEdit?.totalInvoiced || 0,
      invoicesCount: customerToEdit?.invoicesCount || 0,
      createdAt: customerToEdit?.createdAt || new Date().toISOString().split("T")[0]!,
    };

    createOrUpdateCustomer(customer);
    onSaved(customer);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl w-full max-w-lg shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4.5 bg-gradient-to-r from-[#701127] to-[#8c1733] text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center">
              {isEditing ? <Building2 className="w-5 h-5 text-white" /> : <UserPlus className="w-5 h-5 text-white" />}
            </div>
            <div>
              <h2 className="text-base font-extrabold tracking-tight">
                {isEditing ? "Modifier le client" : "Nouveau client"}
              </h2>
              <p className="text-[11px] text-white/80">
                {isEditing ? "Mettez à jour les coordonnées" : "Renseignez les informations de contact"}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          {/* Nom / Entreprise */}
          <div>
            <label className="block text-slate-700 font-bold mb-1.5 flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-slate-400" />
              <span>Nom complet / Raison sociale *</span>
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Ex: Clinique Al Noor, SARL Teranga..."
              className={`w-full px-3.5 py-2.5 rounded-xl border ${
                errors.name ? "border-rose-500 bg-rose-50/50" : "border-slate-300"
              } focus:border-[#701127] focus:ring-2 focus:ring-[#701127]/20 outline-hidden font-medium text-slate-900 transition-all`}
            />
            {errors.name && <p className="text-[11px] text-rose-500 mt-1 font-semibold">{errors.name}</p>}
          </div>

          {/* Contact Référent */}
          <div>
            <label className="block text-slate-700 font-bold mb-1.5 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-slate-400" />
              <span>Nom du contact référent</span>
            </label>
            <input
              type="text"
              value={formData.contactName}
              onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
              placeholder="Ex: Dr. Moussa Diallo, Fatou Ndiaye..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-[#701127] focus:ring-2 focus:ring-[#701127]/20 outline-hidden font-medium text-slate-900 transition-all"
            />
          </div>

          {/* Email & Téléphone (Grid 2 cols) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-slate-700 font-bold mb-1.5 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                <span>Adresse email</span>
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="contact@entreprise.sn"
                className={`w-full px-3.5 py-2.5 rounded-xl border ${
                  errors.email ? "border-rose-500 bg-rose-50/50" : "border-slate-300"
                } focus:border-[#701127] focus:ring-2 focus:ring-[#701127]/20 outline-hidden font-medium text-slate-900 transition-all`}
              />
              {errors.email && <p className="text-[11px] text-rose-500 mt-1 font-semibold">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1.5 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                <span>Téléphone / WhatsApp</span>
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+221 77 123 45 67"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-[#701127] focus:ring-2 focus:ring-[#701127]/20 outline-hidden font-medium text-slate-900 transition-all"
              />
            </div>
          </div>

          {/* Adresse géographique */}
          <div>
            <label className="block text-slate-700 font-bold mb-1.5 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              <span>Adresse géographique</span>
            </label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="Ex: Rue 10 x Corniche Ouest, Point E"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-[#701127] focus:ring-2 focus:ring-[#701127]/20 outline-hidden font-medium text-slate-900 transition-all"
            />
          </div>

          {/* Ville & Pays (Grid 2 cols) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-slate-700 font-bold mb-1.5">Ville</label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                placeholder="Dakar, Abidjan, Douala..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-[#701127] focus:ring-2 focus:ring-[#701127]/20 outline-hidden font-medium text-slate-900 transition-all"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1.5 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-slate-400" />
                <span>Pays</span>
              </label>
              <select
                value={formData.country}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-[#701127] focus:ring-2 focus:ring-[#701127]/20 outline-hidden font-medium text-slate-900 bg-white transition-all"
              >
                {AFRICAN_COUNTRIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 font-bold transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#701127] to-[#8c1733] hover:from-[#570c1d] hover:to-[#701127] text-white font-bold flex items-center gap-2 shadow-md shadow-[#701127]/20 transition-all active:scale-[0.98]"
            >
              <Save className="w-4 h-4" />
              <span>{isEditing ? "Enregistrer les modifications" : "Créer le client"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function CustomerModal({
  isOpen,
  onClose,
  onSaved,
  customerToEdit,
}: CustomerModalProps) {
  if (!isOpen) return null;

  return (
    <CustomerModalForm
      key={customerToEdit?.id ?? "new"}
      onClose={onClose}
      onSaved={onSaved}
      customerToEdit={customerToEdit}
    />
  );
}
