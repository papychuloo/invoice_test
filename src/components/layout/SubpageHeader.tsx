"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  ChevronRight,
  ChevronDown,
  Check,
  MessageCircle,
  Home,
  FileText,
  Users,
  Plus,
  Settings,
} from "lucide-react";
import { COUNTRIES, type CountryConfig } from "@/lib/countries";
import { useAuth } from "@/lib/auth-context";
import { cn } from "@/lib/utils";

interface SubpageHeaderProps {
  selectedCountry?: CountryConfig;
  onCountryChange?: (country: CountryConfig) => void;
  onOpenMobileMenu?: () => void;
}

export function SubpageHeader({
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
}: SubpageHeaderProps) {
  const pathname = usePathname();
  const { userName, userEmail } = useAuth();
  const [isCurrencyDropdownOpen, setIsCurrencyDropdownOpen] = useState(false);
  const currentCountry = selectedCountry;
  const currencyContainerRef = useRef<HTMLDivElement>(null);

  const initials = (userName || userEmail || "U")
    .split(" ")
    .map((n) => n[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase() || "U";

  // Close currency dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        currencyContainerRef.current &&
        !currencyContainerRef.current.contains(event.target as Node)
      ) {
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

  // Determine current page title and breadcrumbs
  const getBreadcrumbs = () => {
    if (pathname.startsWith("/invoices/new")) {
      return {
        section: "Factures",
        sectionHref: "/invoices",
        page: "Nouvelle facture",
        icon: Plus,
      };
    }
    if (pathname.includes("/edit")) {
      return {
        section: "Factures",
        sectionHref: "/invoices",
        page: "Modifier la facture",
        icon: FileText,
      };
    }
    if (pathname.startsWith("/invoices/")) {
      return {
        section: "Factures",
        sectionHref: "/invoices",
        page: "Détail de facture",
        icon: FileText,
      };
    }
    if (pathname.startsWith("/invoices")) {
      return {
        section: "Factures",
        sectionHref: "/invoices",
        page: "Toutes les factures",
        icon: FileText,
      };
    }
    if (pathname.startsWith("/customers")) {
      return {
        section: "Clients & Partenaires",
        sectionHref: "/customers",
        page: "Annuaire",
        icon: Users,
      };
    }
    if (pathname.startsWith("/settings")) {
      return {
        section: "Configuration",
        sectionHref: "/settings",
        page: "Paramètres & Abonnement",
        icon: Settings,
      };
    }
    return {
      section: "Espace de travail",
      sectionHref: "/dashboard",
      page: "Page",
      icon: Home,
    };
  };

  const breadcrumbs = getBreadcrumbs();
  const PageIcon = breadcrumbs.icon;

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-6 lg:px-8 py-3 transition-all shadow-xs">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Left: Mobile hamburger menu + Interactive Breadcrumb navigation */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Menu Toggle Button (Mobile & Desktop) */}
          <button
            type="button"
            onClick={onOpenMobileMenu}
            className="p-2 rounded-xl text-slate-700 hover:text-slate-950 hover:bg-slate-100 transition-colors border border-slate-200/80 shadow-2xs"
            aria-label="Ouvrir le menu des options"
            title="Ouvrir le menu (Options)"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Breadcrumb pills */}
          <nav aria-label="Fil d'Ariane" className="flex items-center gap-1.5 text-xs">
            <Link
              href="/dashboard"
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              title="Tableau de bord"
            >
              <Home className="w-3.5 h-3.5" />
            </Link>

            <ChevronRight className="w-3.5 h-3.5 text-slate-300 shrink-0" />

            <Link
              href={breadcrumbs.sectionHref}
              className="px-2 py-1 rounded-lg text-slate-600 hover:text-[#701127] hover:bg-rose-50/60 font-semibold transition-colors flex items-center gap-1.5"
            >
              <PageIcon className="w-3.5 h-3.5 text-slate-400" />
              <span>{breadcrumbs.section}</span>
            </Link>

            <ChevronRight className="w-3.5 h-3.5 text-slate-300 shrink-0" />

            <span className="px-2 py-1 rounded-lg bg-slate-100 text-slate-900 font-bold">
              {breadcrumbs.page}
            </span>
          </nav>
        </div>

        {/* Right: Currency selector + Quick actions + Profile */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Country & Currency Dropdown */}
          <div ref={currencyContainerRef} className="relative">
            <button
              type="button"
              onClick={() => setIsCurrencyDropdownOpen(!isCurrencyDropdownOpen)}
              className="h-8.5 px-3 rounded-full bg-slate-100 hover:bg-slate-200/80 border border-slate-200/90 flex items-center gap-1.5 text-xs font-bold text-slate-800 shadow-2xs transition-colors"
              title={`Pays sélectionné : ${currentCountry.name}`}
            >
              <span className="text-sm">{currentCountry.flag}</span>
              <span className="hidden sm:inline">{currentCountry.name}</span>
              <span className="font-mono text-slate-600">({currentCountry.symbol})</span>
              <ChevronDown className={cn("w-3 h-3 text-slate-400 transition-transform duration-200", isCurrencyDropdownOpen && "rotate-180")} />
            </button>

            {/* Dropdown Menu */}
            {isCurrencyDropdownOpen && (
              <div className="absolute right-0 top-full mt-2 w-72 sm:w-80 max-w-[calc(100vw-2rem)] bg-white rounded-2xl shadow-xl border border-slate-200 text-slate-800 z-[100] overflow-hidden animate-in fade-in zoom-in-95 p-1.5">
                <div className="px-3 py-2 bg-slate-50 border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Changer de pays & devise
                </div>
                <div className="max-h-72 overflow-y-auto divide-y divide-slate-100 overscroll-contain">
                  {COUNTRIES.map((c) => {
                    const isSelected = c.code === currentCountry.code;
                    return (
                      <button
                        key={c.code}
                        type="button"
                        onClick={() => handleSelectCountry(c)}
                        className={cn(
                          "w-full px-3 py-2 rounded-xl flex items-center justify-between text-left text-xs transition-colors",
                          isSelected
                            ? "bg-rose-50 text-[#701127] font-bold"
                            : "hover:bg-slate-50 text-slate-700"
                        )}
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-base">{c.flag}</span>
                          <div>
                            <span className="block font-semibold">{c.name}</span>
                            <span className="text-[10px] text-slate-400">
                              {c.symbol} • {c.currency}
                            </span>
                          </div>
                        </div>
                        {isSelected && <Check className="w-4 h-4 text-[#701127]" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Support WhatsApp */}
          <a
            href="https://wa.me/221770000000?text=Bonjour%2C%20j%27utilise%20IziFacture."
            target="_blank"
            rel="noopener noreferrer"
            className="w-8.5 h-8.5 rounded-full bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200/80 flex items-center justify-center transition-colors shadow-2xs"
            title="Assistance WhatsApp"
          >
            <MessageCircle className="w-4 h-4" />
          </a>

          {/* User profile avatar pill */}
          <div className="flex items-center gap-2 pl-1 border-l border-slate-200">
            <div className="w-8.5 h-8.5 rounded-full bg-gradient-to-tr from-[#570c1d] to-[#8c1733] text-white flex items-center justify-center font-bold text-xs shadow-xs">
              {initials}
            </div>
            <div className="hidden md:flex flex-col text-left">
              <span className="text-xs font-bold text-slate-900 leading-tight">
                {userName || "Utilisateur"}
              </span>
              <span className="text-[10px] text-slate-400 truncate max-w-[140px]">
                {userEmail || "Session active"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
