"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Menu, X, ArrowRight, LayoutDashboard, FileText } from "lucide-react";
import { useAuth } from "@/lib/auth-context";

export function LandingHeader() {
  const { user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-[#FAF8FF]/90 border-b border-rose-100/60 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#570c1d] via-[#701127] to-[#8c1733] p-0.5 shadow-md shadow-[#701127]/25 flex items-center justify-center transition-transform group-hover:scale-105">
            <div className="w-full h-full bg-white rounded-[10px] flex items-center justify-center">
              <FileText className="w-5 h-5 text-[#701127]" />
            </div>
          </div>
          <div className="flex items-baseline">
            <span className="text-2xl font-black tracking-tight text-slate-900">
              izi<span className="text-[#701127]">Facture</span>
            </span>
            <span className="ml-1 w-2 h-2 rounded-full bg-[#701127]" />
          </div>
        </Link>

        {/* Desktop Navigation Menu */}
        <nav className="hidden md:flex items-center gap-8 text-[15px] font-semibold text-slate-600">
          <a href="#problemes" className="hover:text-[#701127] transition-colors">
            Pourquoi nous ?
          </a>
          <a href="#fonctionnalites" className="hover:text-[#701127] transition-colors">
            Fonctionnalités
          </a>
          <a href="#comment-ca-marche" className="hover:text-[#701127] transition-colors">
            Comment ça marche
          </a>
          <a href="#tarifs" className="hover:text-[#701127] transition-colors">
            Tarifs
          </a>
          <a href="#temoignages" className="hover:text-[#701127] transition-colors">
            Témoignages
          </a>
        </nav>

        {/* Auth CTAs */}
        <div className="hidden sm:flex items-center gap-3">
          {user ? (
            <Link
              href="/dashboard"
              className="btn-magnetic inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold text-white bg-gradient-to-r from-[#701127] to-[#8c1733] hover:from-[#570c1d] hover:to-[#701127] shadow-md shadow-[#701127]/20 transition-all cursor-pointer"
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Accéder à mon espace</span>
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className="text-[14px] font-bold text-slate-700 hover:text-[#701127] px-3.5 py-2 transition-colors cursor-pointer"
              >
                Connexion
              </Link>
              <Link
                href="/login?mode=signup"
                className="btn-magnetic inline-flex items-center justify-center px-5 py-2.5 rounded-full text-sm font-bold text-white bg-slate-900 hover:bg-[#701127] shadow-md shadow-slate-900/10 transition-all duration-200 cursor-pointer"
              >
                <span>Créer un compte</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu button */}
        <div className="flex sm:hidden items-center">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl text-slate-700 hover:text-[#701127] hover:bg-rose-50 transition-colors"
            aria-label="Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="sm:hidden border-t border-rose-100 bg-[#FAF8FF] px-4 pt-3 pb-6 space-y-3 animate-in fade-in slide-in-from-top-2">
          <div className="flex flex-col space-y-2.5 text-sm font-bold text-slate-700">
            <a
              href="#problemes"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-rose-50 hover:text-[#701127] transition-colors"
            >
              Pourquoi nous ?
            </a>
            <a
              href="#fonctionnalites"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-rose-50 hover:text-[#701127] transition-colors"
            >
              Fonctionnalités
            </a>
            <a
              href="#comment-ca-marche"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-rose-50 hover:text-[#701127] transition-colors"
            >
              Comment ça marche
            </a>
            <a
              href="#tarifs"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-rose-50 hover:text-[#701127] transition-colors"
            >
              Tarifs
            </a>
            <a
              href="#temoignages"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-rose-50 hover:text-[#701127] transition-colors"
            >
              Témoignages
            </a>
          </div>

          <div className="pt-3 border-t border-rose-100/70 flex flex-col gap-2">
            {user ? (
              <Link
                href="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-3 rounded-xl text-center font-bold text-sm text-white bg-[#701127] shadow-sm flex items-center justify-center gap-2"
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Accéder à mon espace</span>
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-2.5 rounded-xl text-center font-bold text-sm text-slate-800 bg-white border border-slate-200"
                >
                  Connexion
                </Link>
                <Link
                  href="/login?mode=signup"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-2.5 rounded-xl text-center font-bold text-sm text-white bg-[#701127] shadow-sm"
                >
                  Créer un compte gratuit
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
