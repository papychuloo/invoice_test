"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, MessageCircle } from "lucide-react";

export function FinalCtaSection() {
  return (
    <section className="py-24 relative overflow-hidden bg-gradient-to-b from-[#FAF8FF] to-rose-50/50 z-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
        
        {/* Ambient light effect */}
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#701127]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 bg-white rounded-3xl p-10 sm:p-16 border border-rose-100 shadow-2xl shadow-[#701127]/5 reveal">
          
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-50 text-[#701127] text-xs font-black uppercase tracking-wider mb-6 border border-rose-100/70">
            Prêt à passer à la vitesse supérieure ?
          </div>

          <h2 className="text-3xl sm:text-5xl font-black text-slate-950 tracking-tight max-w-2xl mx-auto leading-tight">
            Rejoins les entrepreneurs qui facturent comme des pros
          </h2>

          <p className="mt-5 text-slate-600 text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
            Démarrez sans carte bancaire, éditez votre première facture en 2 clics et réduisez vos délais de paiement dès aujourd&apos;hui.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/login?mode=signup"
              className="btn-magnetic w-full sm:w-auto inline-flex items-center justify-center px-9 py-4 rounded-2xl text-base font-black text-white bg-slate-950 hover:bg-[#701127] shadow-xl shadow-slate-950/20 hover:shadow-[#701127]/25 transition-all group"
            >
              <span>Commencer gratuitement</span>
              <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Link>
            <a
              href="https://wa.me/221770000000?text=Bonjour%2C%20je%20souhaite%20en%20savoir%20plus%20sur%20iziFacture."
              target="_blank"
              rel="noopener noreferrer"
              className="btn-magnetic w-full sm:w-auto inline-flex items-center justify-center px-7 py-4 rounded-2xl text-base font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 transition-all gap-2"
            >
              <MessageCircle className="w-5 h-5 text-emerald-600" />
              <span>Poser une question sur WhatsApp</span>
            </a>
          </div>

          <p className="mt-6 text-xs text-slate-400 font-semibold">
            Rejoint par +1 200 entrepreneurs au Sénégal, Côte d&apos;Ivoire, Cameroun, Bénin, Mali et Togo.
          </p>

        </div>

      </div>
    </section>
  );
}
