"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import {
  Building2,
  Sparkles,
  Receipt,
  CreditCard,
  ShieldCheck,
  Save,
  CheckCircle2,
  Check,
  Zap,
  Lock,
  ArrowRight,
} from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { MOCK_COMPANY } from "@/lib/mock-data";
import {
  getStoredCompanySettings,
  saveCompanySettings,
  STORE_UPDATED_EVENT,
} from "@/lib/store";
import { cn } from "@/lib/utils";

export function SettingsView() {
  const searchParams = useSearchParams();
  const initialTab = searchParams.get("tab") === "pro" ? "pro" : "company";
  const [activeTab, setActiveTab] = useState<"company" | "pro" | "invoicing" | "payment" | "security">(initialTab);
  const [isProActive, setIsProActive] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);

  // Form states for Company
  const [companyName, setCompanyName] = useState(MOCK_COMPANY.name);
  const [companyTagline, setCompanyTagline] = useState(MOCK_COMPANY.tagline);
  const [companyNinea, setCompanyNinea] = useState(MOCK_COMPANY.ninea);
  const [companyRccm, setCompanyRccm] = useState(MOCK_COMPANY.rccm);
  const [companyAddress, setCompanyAddress] = useState(MOCK_COMPANY.address);
  const [companyCity, setCompanyCity] = useState(MOCK_COMPANY.city);
  const [companyCountry, setCompanyCountry] = useState(MOCK_COMPANY.country);
  const [companyPhone, setCompanyPhone] = useState(MOCK_COMPANY.phone);
  const [companyEmail, setCompanyEmail] = useState(MOCK_COMPANY.email);

  // Form states for Invoicing
  const [vatRate, setVatRate] = useState("18");
  const [prefix, setPrefix] = useState("FAC-");
  const [defaultDueDays, setDefaultDueDays] = useState("15");

  // Mobile Money states
  const [wavePhone, setWavePhone] = useState("+221 77 123 45 67");
  const [orangeMoneyCode, setOrangeMoneyCode] = useState("OM-DKR-8921");
  const [bankIban, setBankIban] = useState("SN08 SN01 2013 0456 7890 1234 56");

  useEffect(() => {
    const loadSettings = () => {
      const s = getStoredCompanySettings();
      setCompanyName(s.name || MOCK_COMPANY.name);
      setCompanyTagline(s.tagline || MOCK_COMPANY.tagline);
      setCompanyNinea(s.ninea || MOCK_COMPANY.ninea);
      setCompanyRccm(s.rccm || MOCK_COMPANY.rccm);
      setCompanyAddress(s.address || MOCK_COMPANY.address);
      setCompanyCity(s.city || MOCK_COMPANY.city);
      setCompanyCountry(s.country || MOCK_COMPANY.country);
      setCompanyPhone(s.phone || MOCK_COMPANY.phone);
      setCompanyEmail(s.email || MOCK_COMPANY.email);
      setVatRate(String(s.vatRate || 18));
      setPrefix(s.prefix || "FAC-");
      setDefaultDueDays(String(s.defaultDueDays || 15));
      setWavePhone(s.wavePhone || "+221 77 123 45 67");
      setOrangeMoneyCode(s.orangeMoneyCode || "OM-DKR-8921");
      setBankIban(s.bankIban || "SN08 SN01 2013 0456 7890 1234 56");
      setIsProActive(Boolean(s.isPro));
    };

    loadSettings();
    window.addEventListener(STORE_UPDATED_EVENT, loadSettings);
    return () => window.removeEventListener(STORE_UPDATED_EVENT, loadSettings);
  }, []);

  const handleSaveCompany = (e: React.FormEvent) => {
    e.preventDefault();
    saveCompanySettings({
      name: companyName,
      tagline: companyTagline,
      ninea: companyNinea,
      rccm: companyRccm,
      address: companyAddress,
      city: companyCity,
      country: companyCountry,
      phone: companyPhone,
      email: companyEmail,
    });
    setSaveSuccess("Informations de l'entreprise enregistrées avec succès dans Supabase !");
    setTimeout(() => setSaveSuccess(null), 3000);
  };

  const handleSaveInvoicing = (e: React.FormEvent) => {
    e.preventDefault();
    saveCompanySettings({
      vatRate: Number(vatRate) || 18,
      prefix,
      defaultDueDays: Number(defaultDueDays) || 15,
    });
    setSaveSuccess("Paramètres de facturation & TVA enregistrés dans Supabase !");
    setTimeout(() => setSaveSuccess(null), 3000);
  };

  const handleSavePayment = (e: React.FormEvent) => {
    e.preventDefault();
    saveCompanySettings({
      wavePhone,
      orangeMoneyCode,
      bankIban,
    });
    setSaveSuccess("Coordonnées de paiement Mobile Money enregistrées dans Supabase !");
    setTimeout(() => setSaveSuccess(null), 3000);
  };

  const handleUpgradePro = () => {
    setIsProActive(true);
    saveCompanySettings({ isPro: true });
    setSaveSuccess("Félicitations ! Votre formule IziFacture Pro est activée et synchronisée !");
    setTimeout(() => setSaveSuccess(null), 4000);
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Toast notification */}
      {saveSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-600 text-white font-bold text-xs flex items-center gap-2 shadow-lg animate-in fade-in slide-in-from-top-3">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{saveSuccess}</span>
        </div>
      )}

      {/* Page Header */}
      <PageHeader
        title="Paramètres de l'entreprise"
        subtitle="Gérez votre établissement, votre formule d'abonnement, vos coordonnées Mobile Money et vos mentions fiscales."
        badgeText={isProActive ? "Version Pro Active" : "Formule Découverte"}
        badgeVariant={isProActive ? "emerald" : "slate"}
      />

      {/* Navigation Tabs Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none border-b border-slate-200/80 text-xs font-semibold">
        {/* Tab 1: Pro version (highlighted) */}
        <button
          type="button"
          onClick={() => setActiveTab("pro")}
          className={cn(
            "px-4 py-2.5 rounded-xl flex items-center gap-2 transition-all shrink-0",
            activeTab === "pro"
              ? "bg-[#701127] text-white font-bold shadow-sm shadow-[#701127]/25"
              : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200/70"
          )}
        >
          <Sparkles className={cn("w-4 h-4", activeTab === "pro" ? "text-amber-300" : "text-[#701127]")} />
          <span>Abonnement & Version Pro</span>
          <span className={cn(
            "text-[10px] font-bold px-1.5 py-0.2 rounded-full uppercase",
            activeTab === "pro" ? "bg-white/20 text-white" : "bg-rose-100 text-[#701127]"
          )}>
            PRO
          </span>
        </button>

        {/* Tab 2: Company */}
        <button
          type="button"
          onClick={() => setActiveTab("company")}
          className={cn(
            "px-4 py-2.5 rounded-xl flex items-center gap-2 transition-all shrink-0",
            activeTab === "company"
              ? "bg-slate-900 text-white font-bold shadow-sm"
              : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200/70"
          )}
        >
          <Building2 className="w-4 h-4 text-slate-400" />
          <span>Entreprise & Établissement</span>
        </button>

        {/* Tab 3: Invoicing & VAT */}
        <button
          type="button"
          onClick={() => setActiveTab("invoicing")}
          className={cn(
            "px-4 py-2.5 rounded-xl flex items-center gap-2 transition-all shrink-0",
            activeTab === "invoicing"
              ? "bg-slate-900 text-white font-bold shadow-sm"
              : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200/70"
          )}
        >
          <Receipt className="w-4 h-4 text-slate-400" />
          <span>Facturation & TVA (18%)</span>
        </button>

        {/* Tab 4: Payments & Mobile Money */}
        <button
          type="button"
          onClick={() => setActiveTab("payment")}
          className={cn(
            "px-4 py-2.5 rounded-xl flex items-center gap-2 transition-all shrink-0",
            activeTab === "payment"
              ? "bg-slate-900 text-white font-bold shadow-sm"
              : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200/70"
          )}
        >
          <CreditCard className="w-4 h-4 text-slate-400" />
          <span>Moyens de paiement & Mobile Money</span>
        </button>

        {/* Tab 5: Security */}
        <button
          type="button"
          onClick={() => setActiveTab("security")}
          className={cn(
            "px-4 py-2.5 rounded-xl flex items-center gap-2 transition-all shrink-0",
            activeTab === "security"
              ? "bg-slate-900 text-white font-bold shadow-sm"
              : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200/70"
          )}
        >
          <ShieldCheck className="w-4 h-4 text-slate-400" />
          <span>Sécurité & Équipe</span>
        </button>
      </div>

      {/* Tab 1 Content: Passer en Version Pro (Déplacé ici comme demandé par l'utilisateur) */}
      {activeTab === "pro" && (
        <div className="space-y-6 animate-in fade-in">
          {/* Main Pro Hero Card */}
          <div className="rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-[#3b0814] text-white p-6 sm:p-10 border border-slate-800 shadow-xl relative overflow-hidden">
            {/* Background luxury lights */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-[#8c1733]/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-1/3 w-60 h-60 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 max-w-3xl space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-amber-300 text-xs font-bold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Formule Recommandée — Entrepreneurs & PME d&apos;Afrique Francophone</span>
              </div>

              <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
                Débloquez toute la puissance d&apos;IziFacture Pro
              </h2>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl">
                Encaissez plus vite par Mobile Money, éliminez les relances manuelles par WhatsApp et produisez des documents comptables certifiés pour votre administration fiscale.
              </p>

              {/* Price Tag */}
              <div className="pt-2 flex flex-wrap items-baseline gap-3">
                <span className="text-3xl sm:text-5xl font-black font-mono text-white tracking-tight">
                  15 000 FCFA
                </span>
                <span className="text-xs sm:text-sm text-slate-400 font-medium">
                  / mois (ou 150 000 FCFA / an avec 2 mois offerts)
                </span>
              </div>

              {/* Benefits Checklist */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4 text-xs">
                <div className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3 h-3" />
                  </div>
                  <span className="text-slate-200">
                    <strong>Paiements Wave & Orange Money</strong> avec QR code instantané
                  </span>
                </div>

                <div className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3 h-3" />
                  </div>
                  <span className="text-slate-200">
                    <strong>Relances WhatsApp & SMS automatiques</strong> à l&apos;échéance
                  </span>
                </div>

                <div className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3 h-3" />
                  </div>
                  <span className="text-slate-200">
                    <strong>Factures & Devis illimités</strong> sans filigrane
                  </span>
                </div>

                <div className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3 h-3" />
                  </div>
                  <span className="text-slate-200">
                    <strong>Exports fiscaux certifiés</strong> (NINEA, TVA UEMOA & CEMAC)
                  </span>
                </div>

                <div className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3 h-3" />
                  </div>
                  <span className="text-slate-200">
                    <strong>Gestion multi-utilisateurs</strong> avec accès comptable dédié
                  </span>
                </div>

                <div className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3 h-3" />
                  </div>
                  <span className="text-slate-200">
                    <strong>Support VIP WhatsApp 24/7</strong> avec conseiller attitré
                  </span>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-6">
                {isProActive ? (
                  <div className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-emerald-500 text-white font-extrabold text-sm shadow-lg">
                    <CheckCircle2 className="w-5 h-5" />
                    <span>Votre abonnement Pro est actif jusqu&apos;au 17/11/2027</span>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={handleUpgradePro}
                    className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-[#701127] to-[#8c1733] hover:from-[#570c1d] hover:to-[#701127] text-white text-sm font-extrabold flex items-center gap-2.5 shadow-xl shadow-[#701127]/40 transition-all hover:scale-[1.02] active:scale-[0.98]"
                  >
                    <Zap className="w-4 h-4 text-amber-300" />
                    <span>Passer à la version Pro maintenant</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2 Content: Entreprise & Établissement */}
      {activeTab === "company" && (
        <form onSubmit={handleSaveCompany} className="bg-white rounded-2xl border border-slate-200/70 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="text-base font-extrabold text-slate-900 tracking-tight">
              Identité de l&apos;entreprise
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Ces informations apparaissent sur toutes les factures, devis et reçus officiels émis.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            {/* Nom */}
            <div>
              <label className="block font-bold text-slate-700 mb-1.5">Raison sociale / Nom officiel *</label>
              <input
                type="text"
                required
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-[#701127] focus:ring-2 focus:ring-[#701127]/20 outline-hidden font-medium text-slate-900"
              />
            </div>

            {/* Slogan */}
            <div>
              <label className="block font-bold text-slate-700 mb-1.5">Activité ou spécialité</label>
              <input
                type="text"
                value={companyTagline}
                onChange={(e) => setCompanyTagline(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-[#701127] focus:ring-2 focus:ring-[#701127]/20 outline-hidden font-medium text-slate-900"
              />
            </div>

            {/* NINEA */}
            <div>
              <label className="block font-bold text-slate-700 mb-1.5">Numéro NINEA (Fiscal)</label>
              <input
                type="text"
                value={companyNinea}
                onChange={(e) => setCompanyNinea(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-[#701127] focus:ring-2 focus:ring-[#701127]/20 outline-hidden font-mono font-medium text-slate-900"
              />
            </div>

            {/* RCCM */}
            <div>
              <label className="block font-bold text-slate-700 mb-1.5">Registre de Commerce (RCCM)</label>
              <input
                type="text"
                value={companyRccm}
                onChange={(e) => setCompanyRccm(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-[#701127] focus:ring-2 focus:ring-[#701127]/20 outline-hidden font-mono font-medium text-slate-900"
              />
            </div>

            {/* Adresse */}
            <div className="sm:col-span-2">
              <label className="block font-bold text-slate-700 mb-1.5">Adresse du siège social</label>
              <input
                type="text"
                value={companyAddress}
                onChange={(e) => setCompanyAddress(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-[#701127] focus:ring-2 focus:ring-[#701127]/20 outline-hidden font-medium text-slate-900"
              />
            </div>

            {/* Ville & Pays */}
            <div>
              <label className="block font-bold text-slate-700 mb-1.5">Ville</label>
              <input
                type="text"
                value={companyCity}
                onChange={(e) => setCompanyCity(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-[#701127] focus:ring-2 focus:ring-[#701127]/20 outline-hidden font-medium text-slate-900"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1.5">Pays</label>
              <input
                type="text"
                value={companyCountry}
                onChange={(e) => setCompanyCountry(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-[#701127] focus:ring-2 focus:ring-[#701127]/20 outline-hidden font-medium text-slate-900"
              />
            </div>

            {/* Contact Phone & Email */}
            <div>
              <label className="block font-bold text-slate-700 mb-1.5">Téléphone d&apos;entreprise</label>
              <input
                type="text"
                value={companyPhone}
                onChange={(e) => setCompanyPhone(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-[#701127] focus:ring-2 focus:ring-[#701127]/20 outline-hidden font-medium text-slate-900"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1.5">Email officiel de facturation</label>
              <input
                type="email"
                value={companyEmail}
                onChange={(e) => setCompanyEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-[#701127] focus:ring-2 focus:ring-[#701127]/20 outline-hidden font-medium text-slate-900"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#701127] to-[#8c1733] text-white text-xs font-bold flex items-center gap-2 shadow-md shadow-[#701127]/20 hover:from-[#570c1d] hover:to-[#701127] transition-all"
            >
              <Save className="w-4 h-4" />
              <span>Enregistrer les coordonnées</span>
            </button>
          </div>
        </form>
      )}

      {/* Tab 3 Content: Facturation & TVA */}
      {activeTab === "invoicing" && (
        <form onSubmit={handleSaveInvoicing} className="bg-white rounded-2xl border border-slate-200/70 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="text-base font-extrabold text-slate-900 tracking-tight">
              Règles fiscales & comptables (Zone FCFA)
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Ces paramètres pilotent le moteur de calcul automatique de vos devis et factures.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            {/* TVA */}
            <div>
              <label className="block font-bold text-slate-700 mb-1.5">Taux de TVA normal (Zone UEMOA / CEMAC)</label>
              <select
                value={vatRate}
                onChange={(e) => setVatRate(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-[#701127] focus:ring-2 focus:ring-[#701127]/20 outline-hidden font-bold text-slate-900 bg-white"
              >
                <option value="18">18% (Régime normal standard UEMOA)</option>
                <option value="19.25">19.25% (Régime standard Cameroun / CEMAC)</option>
                <option value="0">0% (Exonération fiscale / Exportation)</option>
              </select>
            </div>

            {/* Préfixe de facture */}
            <div>
              <label className="block font-bold text-slate-700 mb-1.5">Préfixe de numérotation</label>
              <input
                type="text"
                value={prefix}
                onChange={(e) => setPrefix(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-[#701127] focus:ring-2 focus:ring-[#701127]/20 outline-hidden font-mono font-bold text-slate-900"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">Exemple généré : {prefix}2026-0046</span>
            </div>

            {/* Délai d'échéance par défaut */}
            <div>
              <label className="block font-bold text-slate-700 mb-1.5">Délai de règlement par défaut</label>
              <select
                value={defaultDueDays}
                onChange={(e) => setDefaultDueDays(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-[#701127] focus:ring-2 focus:ring-[#701127]/20 outline-hidden font-bold text-slate-900 bg-white"
              >
                <option value="0">Paiement immédiat à réception</option>
                <option value="15">Sous 15 jours date de facture</option>
                <option value="30">Sous 30 jours date de facture</option>
                <option value="60">Sous 60 jours fin de mois</option>
              </select>
            </div>

            {/* Arrêté légal en toutes lettres */}
            <div className="p-3.5 rounded-xl bg-rose-50/50 border border-rose-100 flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-[#701127] shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-slate-900 block">Arrêté de facture certifié en toutes lettres</span>
                <span className="text-[11px] text-slate-600">
                  Activé par défaut conformément aux exigences des cours des comptes et services des impôts.
                </span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#701127] to-[#8c1733] text-white text-xs font-bold flex items-center gap-2 shadow-md shadow-[#701127]/20 hover:from-[#570c1d] hover:to-[#701127] transition-all"
            >
              <Save className="w-4 h-4" />
              <span>Enregistrer les paramètres fiscaux</span>
            </button>
          </div>
        </form>
      )}

      {/* Tab 4 Content: Moyens de paiement & Mobile Money */}
      {activeTab === "payment" && (
        <form onSubmit={handleSavePayment} className="bg-white rounded-2xl border border-slate-200/70 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="text-base font-extrabold text-slate-900 tracking-tight">
              Passerelles Mobile Money & Coordonnées Bancaires
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Vos clients pourront régler directement en scannant votre QR code ou par transfert sur ces numéros.
            </p>
          </div>

          <div className="space-y-4 text-xs">
            {/* Wave */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-500 text-white font-extrabold flex items-center justify-center shrink-0">
                  🌊
                </div>
                <div>
                  <h4 className="font-extrabold text-slate-900">Wave Sénégal / Côte d&apos;Ivoire</h4>
                  <p className="text-[11px] text-slate-500">Numéro de compte marchand pour encaissement instantané</p>
                </div>
              </div>
              <input
                type="text"
                value={wavePhone}
                onChange={(e) => setWavePhone(e.target.value)}
                className="px-3 py-2 rounded-xl border border-slate-300 font-mono font-bold text-slate-900 w-full sm:w-60 bg-white"
              />
            </div>

            {/* Orange Money */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500 text-white font-extrabold flex items-center justify-center shrink-0">
                  🍊
                </div>
                <div>
                  <h4 className="font-extrabold text-slate-900">Orange Money Pro</h4>
                  <p className="text-[11px] text-slate-500">Code marchand ou numéro de paiement</p>
                </div>
              </div>
              <input
                type="text"
                value={orangeMoneyCode}
                onChange={(e) => setOrangeMoneyCode(e.target.value)}
                className="px-3 py-2 rounded-xl border border-slate-300 font-mono font-bold text-slate-900 w-full sm:w-60 bg-white"
              />
            </div>

            {/* Virement Bancaire */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white font-extrabold flex items-center justify-center shrink-0">
                  🏦
                </div>
                <div>
                  <h4 className="font-extrabold text-slate-900">Virement Bancaire (RIB / IBAN)</h4>
                  <p className="text-[11px] text-slate-500">Banque CBAO / Société Générale / Ecobank</p>
                </div>
              </div>
              <input
                type="text"
                value={bankIban}
                onChange={(e) => setBankIban(e.target.value)}
                className="px-3 py-2 rounded-xl border border-slate-300 font-mono text-[11px] font-bold text-slate-900 w-full sm:w-80 bg-white"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#701127] to-[#8c1733] text-white text-xs font-bold flex items-center gap-2 shadow-md shadow-[#701127]/20 hover:from-[#570c1d] hover:to-[#701127] transition-all"
            >
              <Save className="w-4 h-4" />
              <span>Enregistrer les coordonnées de paiement</span>
            </button>
          </div>
        </form>
      )}

      {/* Tab 5 Content: Sécurité & Équipe */}
      {activeTab === "security" && (
        <div className="bg-white rounded-2xl border border-slate-200/70 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="text-base font-extrabold text-slate-900 tracking-tight">
              Profil administrateur & Sécurité
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Gestion de votre compte utilisateur et des droits d&apos;accès.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1.5">Nom complet de l&apos;administratrice</label>
              <input
                type="text"
                disabled
                value={MOCK_COMPANY.user.name}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 font-bold text-slate-800"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1.5">Rôle dans l&apos;organisation</label>
              <input
                type="text"
                disabled
                value={MOCK_COMPANY.user.role}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 font-semibold text-slate-800"
              />
            </div>

            <div className="sm:col-span-2 p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Lock className="w-5 h-5 text-emerald-600" />
                <div>
                  <span className="font-bold text-slate-900 block">Double authentification (2FA)</span>
                  <span className="text-[11px] text-slate-500">Protection renforcée par code SMS & WhatsApp</span>
                </div>
              </div>
              <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 font-bold text-[11px] border border-emerald-200">
                Activé
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
