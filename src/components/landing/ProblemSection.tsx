"use client";

import React from "react";
import { FileX, Calculator, Clock, AlertTriangle, TrendingDown, ShieldAlert } from "lucide-react";

export function ProblemSection() {
  return (
    <section id="problemes" className="py-24 bg-white border-y border-rose-100/60 relative z-10 scroll-mt-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-16 reveal">
          <span className="text-xs font-black uppercase tracking-widest text-[#701127] bg-rose-50 border border-rose-100/80 px-3.5 py-1.5 rounded-full">
            La réalité du terrain
          </span>
          <h2 className="mt-4 text-3xl sm:text-5xl font-black text-slate-950 tracking-tight">
            Pourquoi 80% des entrepreneurs perdent du temps et de l&apos;argent sur leurs factures
          </h2>
          <p className="mt-4 text-slate-600 text-base sm:text-lg">
            La gestion manuelle sur Word et tableurs n&apos;est plus adaptée au rythme des affaires modernes en Afrique.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Problem Card 1 */}
          <div className="reveal bg-[#FAF8FF] p-8 rounded-3xl border border-rose-100/80 hover:border-[#701127]/40 hover:shadow-xl hover:shadow-[#701127]/5 transition-all duration-300 group">
            <div className="w-14 h-14 rounded-2xl bg-rose-100/80 border border-rose-200 text-[#701127] flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition-transform shadow-xs">
              <FileX className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-black text-slate-900 mb-3">
              Factures non professionnelles
            </h3>
            <p className="text-slate-600 leading-relaxed text-sm">
              Fichiers Word décalés, polices illisibles, formats PDF mal calibrés. Vos clients d&apos;affaires hésitent ou retardent le paiement face à un devis qui manque de crédibilité.
            </p>
            <div className="mt-6 pt-4 border-t border-slate-200/70 text-xs font-bold text-rose-600 flex items-center gap-1.5">
              <TrendingDown className="w-4 h-4" />
              <span>Perte de crédibilité et d&apos;image</span>
            </div>
          </div>

          {/* Problem Card 2 */}
          <div className="reveal bg-[#FAF8FF] p-8 rounded-3xl border border-rose-100/80 hover:border-amber-300 hover:shadow-xl hover:shadow-amber-500/5 transition-all duration-300 group">
            <div className="w-14 h-14 rounded-2xl bg-amber-100/80 border border-amber-200 text-amber-700 flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition-transform shadow-xs">
              <Calculator className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-black text-slate-900 mb-3">
              Calculs manuels de TVA &amp; erreurs
            </h3>
            <p className="text-slate-600 leading-relaxed text-sm">
              Recalculer les 18% de TVA, les retenues à la source ou les remises à la main entraîne des erreurs coûteuses lors des déclarations fiscales et crée des litiges avec vos clients.
            </p>
            <div className="mt-6 pt-4 border-t border-slate-200/70 text-xs font-bold text-amber-700 flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4" />
              <span>Risque de redressement fiscal</span>
            </div>
          </div>

          {/* Problem Card 3 */}
          <div className="reveal bg-[#FAF8FF] p-8 rounded-3xl border border-rose-100/80 hover:border-[#701127]/40 hover:shadow-xl hover:shadow-[#701127]/5 transition-all duration-300 group">
            <div className="w-14 h-14 rounded-2xl bg-slate-100 border border-slate-200 text-slate-800 flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition-transform shadow-xs">
              <Clock className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-black text-slate-900 mb-3">
              Suivi des paiements impossible
            </h3>
            <p className="text-slate-600 leading-relaxed text-sm">
              Vous ne savez plus qui a payé, qui est en retard de 30 jours, ni quelle facture a été envoyée par WhatsApp. Vous perdez des millions en impayés oubliés chaque année.
            </p>
            <div className="mt-6 pt-4 border-t border-slate-200/70 text-xs font-bold text-[#701127] flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4" />
              <span>Trésorerie bloquée et stress inutile</span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
