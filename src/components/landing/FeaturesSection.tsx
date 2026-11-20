"use client";

import React from "react";
import { Zap, Calculator, Clock, Users, ArrowUpRight } from "lucide-react";

export function FeaturesSection() {
  return (
    <section id="fonctionnalites" className="py-24 relative z-10 scroll-mt-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-20 reveal">
          <span className="text-xs font-black uppercase tracking-widest text-[#701127] bg-rose-50 border border-rose-100 px-3.5 py-1.5 rounded-full">
            Puissant &amp; accessible
          </span>
          <h2 className="mt-4 text-3xl sm:text-5xl font-black text-slate-950 tracking-tight">
            Tout ce dont vous avez besoin pour facturer comme un pro
          </h2>
          <p className="mt-4 text-slate-600 text-base sm:text-lg">
            Développé sur-mesure pour les réalités monétaires et fiscales de nos entreprises en Afrique.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Feature 1 */}
          <div className="reveal bg-white p-8 sm:p-10 rounded-3xl border border-slate-200/90 shadow-xs hover:shadow-xl hover:border-[#701127]/40 transition-all duration-300 flex flex-col justify-between group">
            <div>
              <div className="w-13 h-13 rounded-2xl bg-gradient-to-tr from-[#701127] to-[#8c1733] text-white flex items-center justify-center mb-6 shadow-md shadow-[#701127]/25 group-hover:scale-105 transition-transform">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-3 flex items-center justify-between">
                <span>1. Factures professionnelles en 2 clics</span>
                <ArrowUpRight className="w-5 h-5 text-slate-400 group-hover:text-[#701127] transition-colors" />
              </h3>
              <p className="text-slate-600 text-base leading-relaxed">
                Choisissez un modèle élégant, ajoutez votre logo et générez un PDF irréprochable avec mention de votre RCCM, NINEA ou numéro contribuable en un clin d&apos;œil.
              </p>
            </div>
            <div className="mt-8 flex flex-wrap items-center gap-2.5 text-xs font-bold text-[#701127]">
              <span className="px-3 py-1.5 rounded-xl bg-rose-50 border border-rose-100">
                Modèles personnalisables
              </span>
              <span className="px-3 py-1.5 rounded-xl bg-rose-50 border border-rose-100">
                Export PDF HD instantané
              </span>
            </div>
          </div>

          {/* Feature 2 */}
          <div className="reveal bg-white p-8 sm:p-10 rounded-3xl border border-slate-200/90 shadow-xs hover:shadow-xl hover:border-[#701127]/40 transition-all duration-300 flex flex-col justify-between group">
            <div>
              <div className="w-13 h-13 rounded-2xl bg-[#570c1d] text-white flex items-center justify-center mb-6 shadow-md shadow-[#570c1d]/25 group-hover:scale-105 transition-transform">
                <Calculator className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-3 flex items-center justify-between">
                <span>2. TVA 18% calculée automatiquement</span>
                <ArrowUpRight className="w-5 h-5 text-slate-400 group-hover:text-[#701127] transition-colors" />
              </h3>
              <p className="text-slate-600 text-base leading-relaxed">
                Fini les doutes. Vos montants en FCFA s&apos;ajustent en temps réel : calcul HT, TVA à 18% standard, exonérations certifiées et arrondis fiscaux stricts conformes aux règles OHADA.
              </p>
            </div>
            <div className="mt-8 flex flex-wrap items-center gap-2.5 text-xs font-bold text-[#701127]">
              <span className="px-3 py-1.5 rounded-xl bg-rose-50 border border-rose-100">
                Montants en FCFA (XOF/XAF)
              </span>
              <span className="px-3 py-1.5 rounded-xl bg-rose-50 border border-rose-100">
                Conformité fiscale garantie
              </span>
            </div>
          </div>

          {/* Feature 3 */}
          <div className="reveal bg-white p-8 sm:p-10 rounded-3xl border border-slate-200/90 shadow-xs hover:shadow-xl hover:border-[#701127]/40 transition-all duration-300 flex flex-col justify-between group">
            <div>
              <div className="w-13 h-13 rounded-2xl bg-slate-950 text-white flex items-center justify-center mb-6 shadow-md shadow-slate-950/20 group-hover:scale-105 transition-transform">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-3 flex items-center justify-between">
                <span>3. Suivi des paiements en temps réel</span>
                <ArrowUpRight className="w-5 h-5 text-slate-400 group-hover:text-[#701127] transition-colors" />
              </h3>
              <p className="text-slate-600 text-base leading-relaxed">
                Voyez en un coup d&apos;œil les statuts : &laquo;&nbsp;Brouillon&nbsp;&raquo;, &laquo;&nbsp;Envoyée&nbsp;&raquo;, &laquo;&nbsp;Payée&nbsp;&raquo; ou &laquo;&nbsp;En retard&nbsp;&raquo;. Envoyez des rappels d&apos;échéance polis par WhatsApp et email.
              </p>
            </div>
            <div className="mt-8 flex flex-wrap items-center gap-2.5 text-xs font-bold text-[#701127]">
              <span className="px-3 py-1.5 rounded-xl bg-rose-50 border border-rose-100">
                Alertes retards
              </span>
              <span className="px-3 py-1.5 rounded-xl bg-rose-50 border border-rose-100">
                Relance 1-clic WhatsApp
              </span>
            </div>
          </div>

          {/* Feature 4 */}
          <div className="reveal bg-white p-8 sm:p-10 rounded-3xl border border-slate-200/90 shadow-xs hover:shadow-xl hover:border-[#701127]/40 transition-all duration-300 flex flex-col justify-between group">
            <div>
              <div className="w-13 h-13 rounded-2xl bg-[#8c1733] text-white flex items-center justify-center mb-6 shadow-md shadow-[#8c1733]/25 group-hover:scale-105 transition-transform">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-3 flex items-center justify-between">
                <span>4. Gestion de clients intégrée</span>
                <ArrowUpRight className="w-5 h-5 text-slate-400 group-hover:text-[#701127] transition-colors" />
              </h3>
              <p className="text-slate-600 text-base leading-relaxed">
                Votre carnet d&apos;adresses centralisé. Retrouvez en 1 seconde l&apos;historique de facturation, les coordonnées complètes et le solde dû de chaque compte client.
              </p>
            </div>
            <div className="mt-8 flex flex-wrap items-center gap-2.5 text-xs font-bold text-[#701127]">
              <span className="px-3 py-1.5 rounded-xl bg-rose-50 border border-rose-100">
                Historique client complet
              </span>
              <span className="px-3 py-1.5 rounded-xl bg-rose-50 border border-rose-100">
                Gestion multi-devises
              </span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
