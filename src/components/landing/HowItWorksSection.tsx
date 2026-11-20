"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, UserPlus, FileEdit, Send } from "lucide-react";

export function HowItWorksSection() {
  return (
    <section id="comment-ca-marche" className="py-24 bg-white border-y border-rose-100/60 relative z-10 scroll-mt-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-20 reveal">
          <span className="text-xs font-black uppercase tracking-widest text-[#701127] bg-rose-50 border border-rose-100 px-3.5 py-1.5 rounded-full">
            Simplicité radicale
          </span>
          <h2 className="mt-4 text-3xl sm:text-5xl font-black text-slate-950 tracking-tight">
            Comment ça marche ?
          </h2>
          <p className="mt-4 text-slate-600 text-base sm:text-lg">
            De votre inscription à l&apos;encaissement de vos premiers fonds en moins de 3 minutes chrono.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          
          {/* Step 1 */}
          <div className="reveal bg-[#FAF8FF] p-8 sm:p-10 rounded-3xl border border-rose-100/80 relative group hover:shadow-xl hover:shadow-[#701127]/5 transition-all duration-300">
            <div className="flex items-center justify-between mb-6">
              <div className="w-13 h-13 rounded-2xl bg-[#701127] text-white font-black text-xl flex items-center justify-center shadow-md shadow-[#701127]/30 group-hover:scale-105 transition-transform">
                1
              </div>
              <UserPlus className="w-6 h-6 text-[#701127]/50" />
            </div>
            <h3 className="text-xl font-black text-slate-950 mb-3">
              Inscris-toi en 30 secondes
            </h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Créez votre compte gratuitement sans carte bancaire. Ajoutez simplement le nom de votre entreprise et votre logo officiel.
            </p>
          </div>

          {/* Step 2 */}
          <div className="reveal bg-[#FAF8FF] p-8 sm:p-10 rounded-3xl border border-rose-100/80 relative group hover:shadow-xl hover:shadow-[#701127]/5 transition-all duration-300">
            <div className="flex items-center justify-between mb-6">
              <div className="w-13 h-13 rounded-2xl bg-[#701127] text-white font-black text-xl flex items-center justify-center shadow-md shadow-[#701127]/30 group-hover:scale-105 transition-transform">
                2
              </div>
              <FileEdit className="w-6 h-6 text-[#701127]/50" />
            </div>
            <h3 className="text-xl font-black text-slate-950 mb-3">
              Crée ta première facture
            </h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Saisissez le client et les prestations en FCFA. La TVA à 18% et les totaux se calculent instantanément sans aucune formule Excel.
            </p>
          </div>

          {/* Step 3 */}
          <div className="reveal bg-[#FAF8FF] p-8 sm:p-10 rounded-3xl border border-rose-100/80 relative group hover:shadow-xl hover:shadow-[#701127]/5 transition-all duration-300">
            <div className="flex items-center justify-between mb-6">
              <div className="w-13 h-13 rounded-2xl bg-[#701127] text-white font-black text-xl flex items-center justify-center shadow-md shadow-[#701127]/30 group-hover:scale-105 transition-transform">
                3
              </div>
              <Send className="w-6 h-6 text-[#701127]/50" />
            </div>
            <h3 className="text-xl font-black text-slate-950 mb-3">
              Envoie et suis les paiements
            </h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Partagez le lien direct ou le PDF par WhatsApp et email. Recevez une notification dès que le règlement Mobile Money est effectué.
            </p>
          </div>

        </div>

        <div className="mt-16 text-center reveal">
          <Link
            href="/login?mode=signup"
            className="btn-magnetic inline-flex items-center justify-center px-8 py-4 rounded-2xl text-sm font-black text-white bg-gradient-to-r from-[#701127] to-[#8c1733] hover:from-[#570c1d] hover:to-[#701127] shadow-xl shadow-[#701127]/25 transition-all"
          >
            <span>Tester gratuitement maintenant</span>
            <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </div>

      </div>
    </section>
  );
}
