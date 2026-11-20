"use client";

import React from "react";
import Link from "next/link";
import { FileText } from "lucide-react";

export function LandingFooter() {
  return (
    <footer className="bg-white border-t border-slate-200/80 pt-16 pb-12 relative z-10 text-slate-600">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 pb-12 border-b border-slate-100">
          
          {/* Brand column */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#570c1d] to-[#8c1733] text-white flex items-center justify-center font-bold text-base shadow-sm">
                <FileText className="w-5 h-5" />
              </div>
              <span className="text-2xl font-black tracking-tight text-slate-900">
                izi<span className="text-[#701127]">Facture</span>
              </span>
            </div>
            <p className="text-sm text-slate-500 max-w-sm leading-relaxed">
              La solution de facturation moderne pensée pour l&apos;écosystème entrepreneurial africain. Montants en FCFA, calcul automatique de la TVA à 18% et suivi rigoureux des encaissements.
            </p>
            <div className="pt-2 flex items-center gap-2 text-xs font-bold text-slate-700">
              <span className="text-base">🌍</span>
              <span>Fait avec fierté en Afrique</span>
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider mb-4">
              Produit
            </h4>
            <ul className="space-y-2.5 text-sm font-medium">
              <li>
                <a href="#fonctionnalites" className="hover:text-[#701127] transition-colors">
                  Fonctionnalités
                </a>
              </li>
              <li>
                <a href="#tarifs" className="hover:text-[#701127] transition-colors">
                  Tarification
                </a>
              </li>
              <li>
                <a href="#demo" className="hover:text-[#701127] transition-colors">
                  Démonstration
                </a>
              </li>
              <li>
                <Link href="/login?mode=signup" className="hover:text-[#701127] transition-colors">
                  Modèles de factures
                </Link>
              </li>
              <li>
                <Link href="/login?mode=signup" className="hover:text-[#701127] transition-colors">
                  Calculateur TVA 18%
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider mb-4">
              Ressources
            </h4>
            <ul className="space-y-2.5 text-sm font-medium">
              <li>
                <a href="#tarifs" className="hover:text-[#701127] transition-colors">
                  Guide facturation OHADA
                </a>
              </li>
              <li>
                <a href="#temoignages" className="hover:text-[#701127] transition-colors">
                  Blog entrepreneurs
                </a>
              </li>
              <li>
                <a
                  href="https://wa.me/221770000000"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#701127] transition-colors"
                >
                  Centre d&apos;aide
                </a>
              </li>
              <li>
                <Link href="/login" className="hover:text-[#701127] transition-colors">
                  API &amp; Intégrations
                </Link>
              </li>
            </ul>
          </div>

          {/* Community & Cities */}
          <div>
            <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider mb-4">
              Zone FCFA
            </h4>
            <p className="text-xs text-slate-500 leading-relaxed mb-4">
              Présent à Dakar, Abidjan, Douala, Cotonou, Lomé, Bamako, Ouagadougou et Libreville.
            </p>
            <div className="flex flex-col gap-2 text-xs font-semibold text-slate-700">
              <span>🇸🇳 Sénégal (XOF)</span>
              <span>🇨🇮 Côte d&apos;Ivoire (XOF)</span>
              <span>🇨🇲 Cameroun (XAF)</span>
            </div>
          </div>

        </div>

        {/* Bottom footer bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© 2026 iziFacture Technologies. Tous droits réservés.</p>
          <div className="flex flex-wrap items-center gap-6">
            <span className="hover:text-slate-800 transition-colors cursor-pointer">
              Conditions d&apos;utilisation
            </span>
            <span className="hover:text-slate-800 transition-colors cursor-pointer">
              Politique de confidentialité
            </span>
            <span className="hover:text-slate-800 transition-colors cursor-pointer">
              Mentions légales
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
}
