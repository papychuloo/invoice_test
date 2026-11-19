"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Search,
  Sun,
  Bell,
  Share2,
  MessageCircle,
  HelpCircle,
  ChevronDown,
  X,
  FileText,
  User,
  Check,
  Menu,
} from "lucide-react";
import { type Invoice } from "@/lib/mock-data";
import { getStoredInvoices, getStoredCustomers } from "@/lib/store";
import { useAuth } from "@/lib/auth-context";
import { COUNTRIES, type CountryConfig } from "@/lib/countries";
import { formatFullFrenchDate } from "@/lib/dates";
import { cn } from "@/lib/utils";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Money } from "@/components/shared/Money";
import { InvoiceDetailModal } from "@/components/dashboard/InvoiceDetailModal";

interface HeaderBannerProps {
  currentDate?: string;
  selectedCountry?: CountryConfig;
  onCountryChange?: (country: CountryConfig) => void;
  onOpenMobileMenu?: () => void;
}

export function HeaderBanner({
  currentDate,
  selectedCountry = COUNTRIES[0] || {
    code: "SN",
    name: "Sénégal",
    flag: "🇸🇳",
    currency: "XOF",
    symbol: "FCFA",
    defaultCity: "Dakar",
    vatRateBps: 1800,
    vatLabel: "TVA 18%",
  },
  onCountryChange,
  onOpenMobileMenu,
}: HeaderBannerProps) {
  const { userName } = useAuth();
  const displayDate = currentDate || formatFullFrenchDate(new Date());
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCurrencyDropdownOpen, setIsCurrencyDropdownOpen] = useState(false);
  const currentCountry = selectedCountry;
  const [selectedInvoiceForModal, setSelectedInvoiceForModal] = useState<Invoice | null>(null);

  const searchContainerRef = useRef<HTMLDivElement>(null);
  const mobileCurrencyContainerRef = useRef<HTMLDivElement>(null);
  const desktopCurrencyContainerRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setIsSearchOpen(false);
      }
      const inMobile = mobileCurrencyContainerRef.current?.contains(event.target as Node);
      const inDesktop = desktopCurrencyContainerRef.current?.contains(event.target as Node);
      if (!inMobile && !inDesktop) {
        setIsCurrencyDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelectCountry = (country: CountryConfig) => {
    setIsCurrencyDropdownOpen(false);
    if (onCountryChange) {
      onCountryChange(country);
    }
  };

  const storedInvoices = getStoredInvoices();
  const storedCustomers = getStoredCustomers();

  // Filter invoices for search results
  const matchingInvoices = searchQuery.trim()
    ? storedInvoices.filter(
        (inv) =>
          inv.number.toLowerCase().includes(searchQuery.toLowerCase()) ||
          inv.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          inv.customerCity.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  // Filter frequent buyers / customers
  const matchingBuyers = searchQuery.trim()
    ? storedCustomers.filter((b) =>
        b.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const hasResults = matchingInvoices.length > 0 || matchingBuyers.length > 0;

  return (
    <>
      <header className="relative z-40 burgundy-banner-gradient text-white pt-4 lg:pt-6 pb-6 lg:pb-8 px-4 sm:px-6 lg:px-8 shadow-md">
        <div className="max-w-7xl mx-auto relative z-10">
          {/* ========================================================= */}
          {/* MOBILE LAYOUT (< 1024px) : 3 well-separated clean rows   */}
          {/* ========================================================= */}
          <div className="lg:hidden flex flex-col space-y-4">
            {/* Mobile Row 1: Hamburger Menu & Brand on Left, Currency & Actions on Right */}
            <div className="flex items-center justify-between gap-3 pb-1 border-b border-white/10">
              {/* Left: Mobile Menu Button + Brand */}
              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={onOpenMobileMenu}
                  className="p-2 rounded-xl bg-white/14 hover:bg-white/22 text-white border border-white/15 transition-colors focus:outline-none"
                  aria-label="Ouvrir le menu"
                >
                  <Menu className="w-5 h-5" />
                </button>

                <div className="flex items-center gap-1.5">
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-[#570c1d] to-[#8c1733] flex items-center justify-center text-white border border-white/20">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className="w-4 h-4">
                      <circle cx="12" cy="12" r="3" fill="currentColor" />
                      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                    </svg>
                  </div>
                  <span className="font-bold text-base tracking-tight text-white">
                    IziFacture
                  </span>
                </div>
              </div>

              {/* Right: Currency Selector + Notifications + WhatsApp */}
              <div className="flex items-center gap-2">
                {/* Mobile Country / Currency Dropdown */}
                <div ref={mobileCurrencyContainerRef} className="relative">
                  <button
                    type="button"
                    onClick={() => setIsCurrencyDropdownOpen((prev) => !prev)}
                    className="h-8 px-2.5 rounded-full bg-white/14 hover:bg-white/22 border border-white/20 flex items-center gap-1.5 text-xs font-semibold text-white shadow-xs transition-colors"
                    title={`Pays : ${currentCountry.name}`}
                  >
                    <span className="text-sm">{currentCountry.flag}</span>
                    <span>{currentCountry.symbol}</span>
                    <ChevronDown className={cn("w-3 h-3 text-white/70 transition-transform duration-200", isCurrencyDropdownOpen && "rotate-180")} />
                  </button>

                  {/* Dropdown Menu */}
                  {isCurrencyDropdownOpen && (
                    <div className="absolute right-0 top-full mt-2 w-72 max-w-[calc(100vw-2rem)] bg-white rounded-2xl shadow-2xl border border-slate-200 text-slate-800 z-[100] overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
                      <div className="p-3 bg-slate-50 border-b border-slate-100 flex items-center justify-between text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                        <span>Changer de pays & devise</span>
                        <span className="text-[10px] text-slate-400 font-mono font-normal">Zone FCFA</span>
                      </div>
                      <div className="max-h-72 overflow-y-auto divide-y divide-slate-100 p-1.5 overscroll-contain">
                        {COUNTRIES.map((c) => {
                          const isSelected = c.code === currentCountry.code;
                          return (
                            <button
                              key={c.code}
                              type="button"
                              onClick={() => handleSelectCountry(c)}
                              className={cn(
                                "w-full px-3 py-2.5 rounded-xl flex items-center justify-between text-left text-xs transition-colors",
                                isSelected ? "bg-rose-50 text-[#701127] font-bold" : "hover:bg-slate-50 text-slate-700"
                              )}
                            >
                              <div className="flex items-center gap-2.5">
                                <span className="text-base">{c.flag}</span>
                                <div>
                                  <span className="block font-semibold text-slate-900">{c.name}</span>
                                  <span className="text-[10px] text-slate-500 font-mono">
                                    {c.symbol} ({c.currency}) • {c.vatLabel}
                                  </span>
                                </div>
                              </div>
                              {isSelected && <Check className="w-4 h-4 text-[#701127] shrink-0" />}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>

                {/* Notifications */}
                <button
                  type="button"
                  className="relative w-8 h-8 rounded-full bg-white/12 hover:bg-white/20 border border-white/15 flex items-center justify-center text-white"
                  title="Notifications"
                >
                  <Bell className="w-3.5 h-3.5" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-rose-400 rounded-full" />
                </button>

                {/* WhatsApp Support button */}
                <a
                  href="https://wa.me/221770000000?text=Bonjour%2C%20j%27utilise%20IziFacture."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-emerald-600 hover:bg-emerald-700 border border-emerald-400/40 flex items-center justify-center text-white"
                  title="Support WhatsApp"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* Mobile Row 2: Personalized Greeting */}
            <div className="text-center py-1">
              <span className="text-xs font-medium text-white/80 tracking-wide uppercase">
                Bonjour,
              </span>
              <h1 className="font-serif italic font-normal text-3xl sm:text-4xl text-white tracking-tight mt-0.5">
                {userName || "Utilisateur"}
              </h1>
              <span className="text-xs text-white/70 font-sans block mt-0.5" suppressHydrationWarning>
                {displayDate}
              </span>
            </div>

            {/* Mobile Row 3: Dedicated Full-Width Search Input with Generous Spacing */}
            <div ref={searchContainerRef} className="relative w-full pt-1">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-white/70">
                  <Search className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onFocus={() => setIsSearchOpen(true)}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setIsSearchOpen(true);
                  }}
                  placeholder="Rechercher une facture, un client..."
                  className="w-full pl-9 pr-9 py-2.5 text-xs rounded-full bg-white/14 hover:bg-white/18 focus:bg-white/22 text-white placeholder-white/75 border border-white/20 focus:border-white/40 focus:outline-none focus:ring-2 focus:ring-white/25 transition-colors shadow-inner"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery("");
                      setIsSearchOpen(false);
                    }}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-white/60 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Mobile Search Dropdown Results */}
              {isSearchOpen && searchQuery.trim().length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-slate-200 text-slate-800 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="p-3 bg-slate-50 border-b border-slate-100 flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider">
                    <span>Résultats pour « {searchQuery} »</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-slate-200 text-slate-700">
                      {matchingInvoices.length + matchingBuyers.length}
                    </span>
                  </div>

                  <div className="max-h-64 overflow-y-auto divide-y divide-slate-100">
                    {matchingInvoices.map((inv) => (
                      <div
                        key={inv.id}
                        onClick={() => {
                          setSelectedInvoiceForModal(inv);
                          setIsSearchOpen(false);
                        }}
                        className="p-3 hover:bg-rose-50/50 flex items-center justify-between cursor-pointer transition-colors"
                      >
                        <div>
                          <span className="font-bold text-xs text-slate-900 block">{inv.number}</span>
                          <span className="text-[11px] text-slate-500">{inv.customerName}</span>
                        </div>
                        <div className="text-right">
                          <Money amount={inv.amount} className="text-xs font-bold text-slate-900" />
                          <div className="mt-0.5">
                            <StatusBadge status={inv.status} />
                          </div>
                        </div>
                      </div>
                    ))}
                    {!hasResults && (
                      <div className="p-4 text-center text-xs text-slate-400">
                        Aucun document trouvé
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Espace Entreprise Badge */}
            <div className="flex items-center justify-between pt-1">
              <span className="text-[10px] font-bold text-white/80 uppercase tracking-wider">
                Espace Entreprise :
              </span>
              <span className="text-[11px] text-white/90 bg-white/10 px-2 py-0.5 rounded-full font-medium">
                Zone FCFA (UEMOA • CEMAC)
              </span>
            </div>
          </div>

          {/* ========================================================= */}
          {/* DESKTOP LAYOUT (>= 1024px) : Exact 3-column architecture  */}
          {/* ========================================================= */}
          <div className="hidden lg:flex items-center justify-between gap-6">
            {/* Left Section: Menu Toggle Button + Search Bar & Favorite Buyers */}
            <div className="w-1/3 flex flex-col gap-4">
              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={onOpenMobileMenu}
                  className="p-2.5 rounded-full bg-white/14 hover:bg-white/22 text-white border border-white/20 transition-colors focus:outline-none shrink-0"
                  aria-label="Ouvrir le menu des options"
                  title="Ouvrir le menu des options"
                >
                  <Menu className="w-4 h-4" />
                </button>

                {/* Pill Search Input with Live Dropdown */}
                <div ref={searchContainerRef} className="relative max-w-md w-full">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-white/70">
                    <Search className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={searchQuery}
                    onFocus={() => setIsSearchOpen(true)}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setIsSearchOpen(true);
                    }}
                    placeholder="Rechercher une facture, un client..."
                    className="w-full pl-9 pr-9 py-2 text-sm rounded-full bg-white/12 hover:bg-white/18 focus:bg-white/22 text-white placeholder-white/70 border border-white/20 focus:border-white/40 focus:outline-none focus:ring-2 focus:ring-white/25 transition-colors"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => {
                        setSearchQuery("");
                        setIsSearchOpen(false);
                      }}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-white/60 hover:text-white"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Instant Search Results Dropdown Overlay */}
                {isSearchOpen && searchQuery.trim().length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-slate-200/90 text-slate-800 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="p-3 bg-slate-50 border-b border-slate-100 flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider">
                      <span>Résultats pour « {searchQuery} »</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-slate-200 text-slate-700">
                        {matchingInvoices.length + matchingBuyers.length} trouvés
                      </span>
                    </div>

                    <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
                      {matchingInvoices.length > 0 && (
                        <div className="p-2">
                          <span className="px-2 py-1 text-[10px] font-bold text-[#701127] uppercase tracking-wider block">
                            Factures ({matchingInvoices.length})
                          </span>
                          {matchingInvoices.map((inv) => (
                            <div
                              key={inv.id}
                              onClick={() => {
                                setSelectedInvoiceForModal(inv);
                                setIsSearchOpen(false);
                              }}
                              className="p-2.5 rounded-xl hover:bg-rose-50/50 flex items-center justify-between cursor-pointer transition-colors group"
                            >
                              <div className="flex items-center gap-2.5">
                                <div className="w-7 h-7 rounded-lg bg-rose-50 text-[#701127] border border-rose-100 flex items-center justify-center shrink-0">
                                  <FileText className="w-3.5 h-3.5" />
                                </div>
                                <div>
                                  <span className="font-bold text-xs text-slate-900 group-hover:text-[#701127]">
                                    {inv.number}
                                  </span>
                                  <span className="text-[11px] text-slate-500 block">
                                    {inv.customerName} • {inv.customerCity}
                                  </span>
                                </div>
                              </div>

                              <div className="text-right flex items-center gap-2">
                                <Money
                                  amount={inv.amount}
                                  className="text-xs font-bold text-slate-900"
                                />
                                <StatusBadge status={inv.status} />
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {matchingBuyers.length > 0 && (
                        <div className="p-2">
                          <span className="px-2 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                            Clients fréquents ({matchingBuyers.length})
                          </span>
                          {matchingBuyers.map((buyer) => (
                            <div
                              key={buyer.id}
                              className="p-2.5 rounded-xl hover:bg-slate-50 flex items-center justify-between cursor-pointer transition-colors"
                            >
                              <div className="flex items-center gap-2.5">
                                <div className="w-7 h-7 rounded-full bg-slate-200 text-slate-700 font-bold flex items-center justify-center text-xs">
                                  <User className="w-3.5 h-3.5" />
                                </div>
                                <span className="font-semibold text-xs text-slate-800">
                                  {buyer.name}
                                </span>
                              </div>
                              <span className="text-xs font-bold text-slate-600">
                                <Money amount={buyer.totalInvoiced} />
                              </span>
                            </div>
                          ))}
                        </div>
                      )}

                      {!hasResults && (
                        <div className="p-6 text-center text-xs text-slate-400">
                          <p className="font-medium text-slate-600">Aucun résultat trouvé</p>
                          <p className="text-[11px] mt-0.5">
                            Essayez avec un nom de client ou un numéro comme « FAC-2026 »
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

              {/* Clients fréquents or Status */}
              <div className="flex items-center gap-3">
                <div className="flex flex-col">
                  <span className="text-[11px] font-medium text-white/80 uppercase tracking-wider">
                    Espace Entreprise
                  </span>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs font-semibold text-white/90 bg-white/10 px-2.5 py-1 rounded-full border border-white/15">
                      Prêt à facturer • Zone FCFA
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Center Section: Greeting & Editorial Serif Name */}
            <div className="text-center flex flex-col items-center">
              <span className="text-sm font-medium text-white/80 tracking-wide uppercase">
                Bonjour,
              </span>
              <h1 className="font-serif italic font-normal text-4xl xl:text-5xl text-white tracking-tight mt-0.5 drop-shadow-sm">
                {userName || "Utilisateur"}
              </h1>
              <span className="text-sm text-white/75 mt-1 font-sans" suppressHydrationWarning>
                {displayDate}
              </span>
            </div>

            {/* Right Section: Action icons + Currency Selector */}
            <div className="w-1/3 flex items-center justify-end gap-2.5">
              {/* Interactive Country & Currency Selector Dropdown */}
              <div ref={desktopCurrencyContainerRef} className="relative">
                <button
                  type="button"
                  onClick={() => setIsCurrencyDropdownOpen((prev) => !prev)}
                  className="h-9 px-3 rounded-full bg-white/14 hover:bg-white/22 border border-white/20 flex items-center gap-2 text-xs font-semibold text-white shadow-xs transition-colors"
                  title={`Devise active : ${currentCountry.name} (${currentCountry.currency})`}
                >
                  <span className="text-sm">{currentCountry.flag}</span>
                  <span>{currentCountry.symbol}</span>
                  <span className="text-[10px] opacity-75 font-mono">({currentCountry.currency})</span>
                  <ChevronDown className={cn("w-3 h-3 text-white/70 transition-transform duration-200", isCurrencyDropdownOpen && "rotate-180")} />
                </button>

                {isCurrencyDropdownOpen && (
                  <div className="absolute right-0 top-full mt-2 w-72 sm:w-80 bg-white rounded-2xl shadow-2xl border border-slate-200 text-slate-800 z-[100] overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="p-3 bg-slate-50 border-b border-slate-100 flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider">
                      <span>Sélectionnez un pays & devise</span>
                      <span className="text-[10px] text-slate-400 font-mono font-normal">Zone FCFA</span>
                    </div>
                    <div className="max-h-72 overflow-y-auto divide-y divide-slate-100 p-1.5 overscroll-contain">
                      {COUNTRIES.map((c) => {
                        const isSelected = c.code === currentCountry.code;
                        return (
                          <button
                            key={c.code}
                            type="button"
                            onClick={() => handleSelectCountry(c)}
                            className={cn(
                              "w-full px-3 py-2.5 rounded-xl flex items-center justify-between text-left text-xs transition-colors",
                              isSelected
                                ? "bg-rose-50 text-[#701127] font-bold"
                                : "hover:bg-slate-50 text-slate-700"
                            )}
                          >
                            <div className="flex items-center gap-2.5">
                              <span className="text-base">{c.flag}</span>
                              <div>
                                <span className="block font-semibold text-slate-900">{c.name}</span>
                                <span className="text-[10px] text-slate-500 font-mono">
                                  {c.symbol} ({c.currency}) • {c.vatLabel}
                                </span>
                              </div>
                            </div>
                            {isSelected && <Check className="w-4 h-4 text-[#701127] shrink-0" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Light/Dark Toggle */}
              <button
                type="button"
                className="w-9 h-9 rounded-full bg-white/12 hover:bg-white/20 border border-white/15 flex items-center justify-center text-white transition-colors"
                title="Thème d'affichage"
              >
                <Sun className="w-4 h-4" />
              </button>

              {/* Help */}
              <button
                type="button"
                className="w-9 h-9 rounded-full bg-white/12 hover:bg-white/20 border border-white/15 flex items-center justify-center text-white transition-colors"
                title="Centre d'aide"
              >
                <HelpCircle className="w-4 h-4" />
              </button>

              {/* Notifications */}
              <button
                type="button"
                className="relative w-9 h-9 rounded-full bg-white/12 hover:bg-white/20 border border-white/15 flex items-center justify-center text-white transition-colors"
                title="Notifications"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-400 rounded-full ring-2 ring-[#701127]" />
              </button>

              {/* Share */}
              <button
                type="button"
                className="w-9 h-9 rounded-full bg-white/12 hover:bg-white/20 border border-white/15 flex items-center justify-center text-white transition-colors"
                title="Partager"
              >
                <Share2 className="w-4 h-4" />
              </button>

              {/* WhatsApp Support button */}
              <a
                href="https://wa.me/221770000000?text=Bonjour%2C%20j%27utilise%20IziFacture."
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-emerald-600 hover:bg-emerald-700 border border-emerald-400/40 flex items-center justify-center text-white transition-colors shadow-sm"
                title="Support WhatsApp"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Invoice Modal triggerable from Search */}
      <InvoiceDetailModal
        invoice={selectedInvoiceForModal}
        onClose={() => setSelectedInvoiceForModal(null)}
      />
    </>
  );
}
