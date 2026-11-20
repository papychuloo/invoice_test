"use client";

import React from "react";
import Link from "next/link";
import {
  ArrowRight,
  Play,
  CheckCircle2,
  Lock,
  Zap,
  FileText,
  Users,
  BarChart3,
  QrCode,
  Sparkles,
} from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative pt-14 pb-20 lg:pt-20 lg:pb-28 hero-glow z-10 overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">

        {/* Badge Announcement with subtle float animation */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-rose-100 shadow-sm shadow-rose-100/60 mb-8 animate-float-slow">
          <span className="px-2.5 py-0.5 rounded-full text-xs font-black tracking-wide uppercase bg-gradient-to-r from-[#701127] to-[#8c1733] text-white shadow-xs">
            NOUVEAU
          </span>
          <span className="text-xs sm:text-sm font-semibold text-slate-700">
            TVA 18% automatique & factures certifiées en Francs CFA
          </span>
          <span className="text-base">💸</span>
        </div>

        {/* Hero Headline */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-slate-950 max-w-4xl mx-auto leading-[1.12]">
          <span className="block bg-gradient-to-r from-[#570c1d] via-[#701127] to-[#8c1733] bg-clip-text text-transparent">
            Fini le casse-tête
          </span>
          de Word et d&apos;Excel pour vos factures.
        </h1>

        {/* Hero Subtitle */}
        <p className="mt-6 text-base sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed font-normal">
          La plateforme de facturation tout-en-un conçue pour les entrepreneurs, consultants et PME d&apos;Afrique de l&apos;Ouest et Centrale. Émettez des factures conformes en 30 secondes.
        </p>

        {/* Primary & Secondary CTA Buttons */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/login?mode=signup"
            className="btn-magnetic w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 rounded-2xl text-base font-extrabold text-white bg-slate-950 hover:bg-[#701127] shadow-xl shadow-slate-950/20 hover:shadow-[#701127]/25 transition-all group"
          >
            <span>Commencer gratuitement</span>
            <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
          </Link>
          <a
            href="#demo"
            className="btn-magnetic w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 rounded-2xl text-base font-bold text-slate-700 bg-white border border-slate-200/90 hover:bg-slate-50 hover:border-slate-300 shadow-sm transition-all"
          >
            <Play className="mr-2 w-4 h-4 text-[#701127] fill-[#701127]" />
            <span>Voir la démo interactive</span>
          </a>
        </div>

        {/* Trust signals */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-5 sm:gap-8 text-xs font-semibold text-slate-500">
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
            Sans carte bancaire
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
            5 factures offertes / mois
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
            Conforme OHADA & TVA 18%
          </span>
        </div>

        {/* App Mockup Floating Container (id="demo") */}
        <div id="demo" className="mt-14 relative mx-auto max-w-5xl group scroll-mt-24">
          {/* Ambient back-shadow aura */}
          <div className="absolute -inset-1.5 bg-gradient-to-r from-[#701127] via-[#8c1733] to-rose-400 rounded-3xl blur-2xl opacity-20 group-hover:opacity-30 transition duration-1000" />
          
          {/* Browser Window Mockup Frame */}
          <div className="relative bg-white rounded-3xl shadow-2xl shadow-slate-900/10 border border-slate-200/90 overflow-hidden text-left">
            
            {/* Safari-style top bar */}
            <div className="bg-slate-50/95 border-b border-slate-200/80 px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-400 border border-rose-500/30 inline-block" />
                <span className="w-3 h-3 rounded-full bg-amber-400 border border-amber-500/30 inline-block" />
                <span className="w-3 h-3 rounded-full bg-emerald-400 border border-emerald-500/30 inline-block" />
              </div>
              
              <div className="flex items-center gap-2 bg-white px-5 py-1.5 rounded-lg border border-slate-200 text-xs font-mono text-slate-600 shadow-inner">
                <Lock className="w-3 h-3 text-emerald-600" />
                <span>app.izifacture.com/invoices/new</span>
              </div>
              
              <div className="flex items-center gap-3 text-slate-400 text-xs font-medium">
                <span className="inline-flex items-center text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full font-sans text-[11px] font-bold">
                  ● En ligne
                </span>
              </div>
            </div>

            {/* Internal App Layout matching split layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[500px]">
              
              {/* Mini icon sidebar */}
              <div className="hidden lg:flex lg:col-span-1 border-r border-slate-100 flex-col items-center py-6 gap-5 bg-slate-50/50">
                <div className="w-8 h-8 rounded-xl bg-rose-50 text-[#701127] flex items-center justify-center font-bold text-xs">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div className="w-8 h-8 rounded-xl bg-[#701127] text-white flex items-center justify-center shadow-sm">
                  <FileText className="w-4 h-4" />
                </div>
                <div className="w-8 h-8 rounded-xl text-slate-400 hover:text-slate-600 flex items-center justify-center">
                  <Users className="w-4 h-4" />
                </div>
                <div className="w-8 h-8 rounded-xl text-slate-400 hover:text-slate-600 flex items-center justify-center">
                  <BarChart3 className="w-4 h-4" />
                </div>
              </div>

              {/* Invoice Generation Inputs (Left Pane) */}
              <div className="p-6 lg:col-span-5 border-b lg:border-b-0 lg:border-r border-slate-100 flex flex-col justify-between bg-white">
                <div>
                  <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Édition</span>
                      <h3 className="font-extrabold text-slate-900 text-sm">Nouvelle Facture</h3>
                    </div>
                    <span className="text-xs bg-rose-50 text-[#701127] font-mono font-bold px-2 py-0.5 rounded-md border border-rose-100">
                      #FAC-2026-089
                    </span>
                  </div>

                  <div className="mt-4 space-y-3.5 text-xs">
                    <div>
                      <label className="block text-slate-500 font-semibold mb-1">Client sélectionné</label>
                      <div className="flex items-center justify-between p-2.5 rounded-xl border border-slate-200 bg-slate-50/70">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-[#701127] to-[#8c1733] text-white flex items-center justify-center font-bold text-[10px]">
                            KD
                          </div>
                          <div>
                            <p className="font-bold text-slate-800">Koffi Diop SARL</p>
                            <p className="text-[10px] text-slate-500">Abidjan, Côte d&apos;Ivoire</p>
                          </div>
                        </div>
                        <span className="text-[11px] text-[#701127] font-bold">Client vérifié</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-slate-500 font-semibold mb-1">Date d&apos;émission</label>
                        <input
                          type="text"
                          value="15 Octobre 2026"
                          readOnly
                          className="w-full bg-white border border-slate-200 rounded-xl p-2 text-slate-700 font-semibold cursor-not-allowed"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-500 font-semibold mb-1">Échéance</label>
                        <input
                          type="text"
                          value="30 Octobre 2026"
                          readOnly
                          className="w-full bg-white border border-slate-200 rounded-xl p-2 text-slate-700 font-semibold cursor-not-allowed"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-slate-500 font-semibold mb-1">Prestation</label>
                      <div className="p-2.5 rounded-xl border border-slate-200 bg-white flex items-center justify-between">
                        <span className="font-semibold text-slate-800 truncate pr-2">
                          Refonte E-Commerce & Logistique
                        </span>
                        <span className="font-extrabold text-slate-900 shrink-0">750 000 FCFA</span>
                      </div>
                    </div>

                    {/* Automation badge */}
                    <div className="p-2.5 rounded-xl bg-rose-50/80 border border-rose-100 flex items-center justify-between">
                      <div className="flex items-center gap-2 text-[#701127]">
                        <Zap className="w-3.5 h-3.5 fill-[#701127]" />
                        <span className="font-bold text-[11px]">TVA 18% appliquée (Zone FCFA)</span>
                      </div>
                      <span className="font-extrabold text-[#701127] text-[11px]">+135 000 FCFA</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Total Net TTC</span>
                    <span className="text-lg font-black text-slate-950">885 000 FCFA</span>
                  </div>
                  <Link
                    href="/login?mode=signup"
                    className="px-4 py-2.5 bg-gradient-to-r from-[#701127] to-[#8c1733] hover:from-[#570c1d] hover:to-[#701127] text-white rounded-xl font-bold text-xs shadow-md shadow-[#701127]/25 flex items-center gap-1.5 transition-all"
                  >
                    <span>Essayer en direct</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

              {/* Live Printable Invoice View (Right Pane) */}
              <div className="p-6 lg:col-span-6 bg-slate-50/70 flex flex-col justify-center">
                <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-md">
                  
                  {/* Invoice Header inside sheet */}
                  <div className="flex justify-between items-start border-b border-slate-100 pb-3.5">
                    <div>
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-lg bg-[#701127] text-white flex items-center justify-center text-xs font-black">
                          i
                        </div>
                        <span className="font-extrabold text-sm tracking-tight text-slate-900">
                          izi<span className="text-[#701127]">Facture</span>
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-400 font-medium mt-1">Dakar, Sénégal • RCCM : SN.DKR.2023.B.14</p>
                    </div>
                    <div className="text-right">
                      <span className="inline-block px-2.5 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-300 rounded-full font-bold text-[10px] uppercase tracking-wider">
                        Facture Pro
                      </span>
                      <p className="font-mono text-xs font-bold text-slate-700 mt-1">#INV-2026-0089</p>
                    </div>
                  </div>

                  {/* Parties Metadata */}
                  <div className="grid grid-cols-2 gap-4 py-3 text-xs border-b border-slate-100">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">Émetteur</span>
                      <p className="font-bold text-slate-800">Mamadou &amp; Associés</p>
                      <p className="text-slate-500 text-[10px]">Plateau, Dakar • NINEA: 0098432</p>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">Facturé à</span>
                      <p className="font-bold text-slate-800">Koffi Diop SARL</p>
                      <p className="text-slate-500 text-[10px]">Cocody, Abidjan • Compte actif</p>
                    </div>
                  </div>

                  {/* Table Preview */}
                  <div className="py-2.5">
                    <table className="w-full text-xs text-left">
                      <thead>
                        <tr className="text-[10px] font-bold text-slate-400 uppercase border-b border-slate-100">
                          <th className="pb-1.5">Description</th>
                          <th className="pb-1.5 text-right">Qté</th>
                          <th className="pb-1.5 text-right">P.U (FCFA)</th>
                          <th className="pb-1.5 text-right">Total HT</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-slate-700 text-[11px]">
                        <tr>
                          <td className="py-2 font-medium">Refonte Plateforme E-Commerce</td>
                          <td className="py-2 text-right">1</td>
                          <td className="py-2 text-right font-mono">500 000</td>
                          <td className="py-2 text-right font-bold text-slate-900 font-mono">500 000</td>
                        </tr>
                        <tr>
                          <td className="py-2 font-medium">Intégration Paiements Wave &amp; OM</td>
                          <td className="py-2 text-right">1</td>
                          <td className="py-2 text-right font-mono">250 000</td>
                          <td className="py-2 text-right font-bold text-slate-900 font-mono">250 000</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  {/* Summary calculations */}
                  <div className="border-t border-slate-100 pt-3 flex justify-end">
                    <div className="w-48 space-y-1 text-xs">
                      <div className="flex justify-between text-slate-600">
                        <span>Total HT :</span>
                        <span className="font-bold font-mono">750 000 FCFA</span>
                      </div>
                      <div className="flex justify-between text-[#701127] font-semibold">
                        <span>TVA (18%) :</span>
                        <span className="font-mono">135 000 FCFA</span>
                      </div>
                      <div className="flex justify-between text-slate-950 font-black text-sm pt-1 border-t border-slate-200">
                        <span>Total TTC :</span>
                        <span className="text-[#701127] font-mono">885 000 FCFA</span>
                      </div>
                    </div>
                  </div>

                  {/* Payment status footer inside invoice */}
                  <div className="mt-3.5 pt-3 border-t border-dashed border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
                    <span className="flex items-center gap-1.5 font-bold text-emerald-700">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      Lien Wave &amp; Orange Money actif
                    </span>
                    <span className="font-mono text-slate-400 flex items-center gap-1 text-[10px]">
                      <QrCode className="w-3.5 h-3.5 text-[#701127]" />
                      QR Code vérifié ✓
                    </span>
                  </div>

                </div>
              </div>

            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
