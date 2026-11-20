"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  FileCheck2,
  Users,
  Package,
  Receipt,
  CreditCard,
  BarChart3,
  ShieldCheck,
  Wallet,
  Settings,
  Plus,
  X,
  MessageCircle,
  LogOut,
  LogIn,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { cn } from "@/lib/utils";

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  badge?: string;
  isExternal?: boolean;
}

const navItems: NavItem[] = [
  { label: "Tableau de bord", href: "/dashboard", icon: LayoutDashboard },
  { label: "Factures", href: "/invoices", icon: FileText },
  { label: "Devis", href: "/quotes", icon: FileCheck2 },
  { label: "Clients", href: "/customers", icon: Users },
  { label: "Produits & Services", href: "/products", icon: Package },
  { label: "Dépenses", href: "/expenses", icon: Receipt },
  { label: "Paiements", href: "/payments", icon: CreditCard },
  { label: "Rapports", href: "/reports", icon: BarChart3 },
  { label: "Conformité & TVA", href: "/compliance", icon: ShieldCheck },
  { label: "Abonnement", href: "/settings?tab=pro", icon: Wallet },
  { label: "Support WhatsApp", href: "https://wa.me/221770000000", icon: MessageCircle, isExternal: true },
  { label: "Paramètres", href: "/settings", icon: Settings },
];

interface AppSidebarProps {
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

export function AppSidebar({ mobileOpen: controlledMobileOpen, onMobileClose }: AppSidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, userName, signOut } = useAuth();
  const [internalMobileOpen, setInternalMobileOpen] = useState(false);

  const isMobileOpen = controlledMobileOpen !== undefined ? controlledMobileOpen : internalMobileOpen;
  const handleClose = () => {
    if (onMobileClose) {
      onMobileClose();
    } else {
      setInternalMobileOpen(false);
    }
  };

  const handleSignOut = async () => {
    handleClose();
    await signOut();
    router.push("/login");
    router.refresh();
  };

  const initials = userName
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() || "IN";

  return (
    <>
      {/* Backdrop overlay (Mobile & Desktop Drawer) */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
          onClick={handleClose}
        />
      )}

      {/* Sidebar container */}
      <aside
        className={cn(
          "fixed top-0 bottom-0 left-0 z-50 w-64 sm:w-72 bg-white border-r border-slate-200/80 flex flex-col justify-between transition-transform duration-300 ease-in-out shadow-2xl",
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Top: Brand Logo and Close button */}
        <div className="p-5 pb-3">
          <div className="flex items-center justify-between">
            <Link href="/dashboard" onClick={handleClose} className="flex items-center gap-2.5 group">
              {/* Star / Flower Burgundy Logo Icon */}
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#570c1d] to-[#8c1733] flex items-center justify-center text-white shadow-sm shadow-[#570c1d]/20 group-hover:scale-105 transition-transform">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  className="w-5 h-5"
                >
                  <circle cx="12" cy="12" r="3" fill="currentColor" />
                  <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                </svg>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-lg tracking-tight text-slate-900 group-hover:text-[#701127] transition-colors">
                    IziFacture
                  </span>
                  <span className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded-sm bg-rose-50 text-[#701127] border border-rose-200/60">
                    FCFA
                  </span>
                </div>
                <span className="text-[11px] text-slate-400 font-medium">
                  UEMOA • CEMAC
                </span>
              </div>
            </Link>

            {/* Universal Close button */}
            <button
              type="button"
              onClick={handleClose}
              className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
              aria-label="Fermer le menu"
              title="Fermer le menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Primary CTA: + Create Invoice */}
          <div className="mt-5">
            <Link
              href="/invoices/new"
              onClick={handleClose}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-full bg-gradient-to-r from-[#6b0f23] to-[#8c1733] hover:from-[#570c1d] hover:to-[#701127] text-white text-sm font-medium shadow-md shadow-[#6b0f23]/25 hover:shadow-lg hover:shadow-[#6b0f23]/30 active:scale-[0.98] transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Créer une facture</span>
            </Link>
          </div>
        </div>

        {/* Middle: Navigation Items */}
        <div className="flex-1 overflow-y-auto px-3.5 py-2 space-y-6">
          <div>
            <div className="px-3 mb-2 text-[10px] font-bold tracking-wider text-slate-400 uppercase">
              OPTIONS
            </div>
            <nav className="space-y-1">
              {navItems.map((item) => {
                const isActive =
                  item.href === "/dashboard"
                    ? pathname === "/dashboard"
                    : pathname.startsWith(item.href);
                const Icon = item.icon;

                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={handleClose}
                    target={item.isExternal ? "_blank" : undefined}
                    className={cn(
                      "flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all group",
                      isActive
                        ? "bg-[#fae8ed] text-[#701127] font-semibold shadow-xs"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <Icon
                        className={cn(
                          "w-4 h-4 transition-colors",
                          isActive
                            ? "text-[#701127]"
                            : "text-slate-400 group-hover:text-slate-700"
                        )}
                      />
                      <span>{item.label}</span>
                    </div>

                    {item.badge && (
                      <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-rose-100 text-[#701127]">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Explicit Logout Option in Menu List */}
            {user && (
              <div className="pt-3 mt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50/80 transition-all group"
                  title="Se déconnecter de votre compte"
                >
                  <div className="flex items-center gap-3">
                    <LogOut className="w-4 h-4 text-rose-500 group-hover:text-rose-600 transition-colors" />
                    <span>Se déconnecter</span>
                  </div>
                  <span className="text-[10px] px-1.5 py-0.5 rounded font-mono bg-rose-100/70 text-rose-700">
                    Déconnexion
                  </span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Bottom: Compact User Profile or Login Link */}
        <div className="p-3 border-t border-slate-100">
          {user ? (
            <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50/70 border border-slate-200/60">
              <Link
                href="/settings"
                onClick={handleClose}
                className="flex items-center gap-2.5 min-w-0 flex-1 group"
                title="Accéder aux Paramètres"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#570c1d] to-[#8c1733] text-white flex items-center justify-center font-extrabold text-[11px] shadow-xs shrink-0">
                  {initials}
                </div>
                <div className="flex flex-col text-left truncate">
                  <span className="text-xs font-bold text-slate-900 group-hover:text-[#701127] transition-colors leading-tight truncate">
                    {userName}
                  </span>
                  <span className="text-[10px] text-slate-400 truncate">
                    {user.email}
                  </span>
                </div>
              </Link>

              <button
                type="button"
                onClick={handleSignOut}
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors ml-1 shrink-0"
                title="Se déconnecter"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              onClick={handleClose}
              className="flex items-center justify-between p-2.5 rounded-xl bg-rose-50/70 border border-rose-200/80 text-[#701127] hover:bg-rose-100 transition-colors group"
              title="Se connecter ou créer un compte"
            >
              <div className="flex items-center gap-2">
                <LogIn className="w-4 h-4 text-[#701127]" />
                <span className="text-xs font-bold">Connexion / Inscription</span>
              </div>
            </Link>
          )}
        </div>
      </aside>
    </>
  );
}
