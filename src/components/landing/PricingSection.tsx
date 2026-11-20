"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Check, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export function PricingSection() {
  const [selectedPlan, setSelectedPlan] = useState<"free" | "pro" | "business">("pro");
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");

  const isYearly = billingCycle === "yearly";

  return (
    <section id="tarifs" className="py-24 bg-white border-y border-rose-100/60 relative z-10 scroll-mt-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-14 reveal">
          <span className="text-xs font-black uppercase tracking-widest text-[#701127] bg-rose-50 border border-rose-100 px-3.5 py-1.5 rounded-full">
            Des prix pensés pour nos marchés
          </span>
          <h2 className="mt-4 text-3xl sm:text-5xl font-black text-slate-950 tracking-tight">
            Investissez dans la clarté de votre entreprise
          </h2>
          <p className="mt-4 text-slate-600 text-base sm:text-lg">
            Sans frais cachés. Annulez ou changez de formule à tout moment.
          </p>

          {/* Monthly / Yearly Toggle */}
          <div className="mt-8 inline-flex items-center p-1 rounded-full bg-slate-100 border border-slate-200">
            <button
              type="button"
              onClick={() => setBillingCycle("monthly")}
              className={cn(
                "px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer",
                !isYearly
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              )}
            >
              Facturation mensuelle
            </button>
            <button
              type="button"
              onClick={() => setBillingCycle("yearly")}
              className={cn(
                "px-4 py-2 rounded-full text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer",
                isYearly
                  ? "bg-[#701127] text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              )}
            >
              <span>Facturation annuelle</span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500 text-white text-[10px] font-black uppercase">
                -2 mois offerts
              </span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          
          {/* Plan 1: Gratuit */}
          <div
            onClick={() => setSelectedPlan("free")}
            className={cn(
              "reveal rounded-3xl p-8 border transition-all duration-300 flex flex-col justify-between cursor-pointer group",
              selectedPlan === "free"
                ? "bg-white border-[#701127] shadow-xl shadow-[#701127]/10 ring-2 ring-[#701127]/20"
                : "bg-[#FAF8FF] border-slate-200 hover:border-slate-300 hover:shadow-md"
            )}
          >
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-black text-slate-900">Plan Gratuit</h3>
                <span className="text-[11px] font-bold px-3 py-1 bg-slate-200 text-slate-700 rounded-full">
                  Pour démarrer
                </span>
              </div>
              <p className="text-slate-500 text-sm mb-6">
                Idéal pour les indépendants et freelances qui débutent leur activité.
              </p>
              
              <div className="mb-6">
                <span className="text-4xl font-black text-slate-950">0 FCFA</span>
                <span className="text-slate-500 text-sm font-semibold"> / pour toujours</span>
              </div>

              <ul className="space-y-3.5 text-sm text-slate-600 border-t border-slate-200/80 pt-6">
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span><strong className="text-slate-900">5 factures</strong> par mois</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span><strong>1 utilisateur</strong> unique</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Calcul TVA 18% automatique</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Téléchargement PDF standard</span>
                </li>
              </ul>
            </div>

            <div className="mt-8">
              <Link
                href="/login?mode=signup&plan=free"
                className={cn(
                  "btn-magnetic w-full block text-center py-3.5 px-4 rounded-2xl text-sm font-bold transition-all",
                  selectedPlan === "free"
                    ? "bg-[#701127] text-white shadow-md shadow-[#701127]/20"
                    : "bg-white text-slate-800 border border-slate-300 hover:bg-slate-50"
                )}
              >
                Commencer gratuitement
              </Link>
            </div>
          </div>

          {/* Plan 2: Pro (Mis en avant) */}
          <div
            onClick={() => setSelectedPlan("pro")}
            className={cn(
              "reveal relative rounded-3xl p-8 sm:p-10 border-2 transition-all duration-300 flex flex-col justify-between transform lg:-translate-y-3 cursor-pointer group",
              selectedPlan === "pro"
                ? "bg-slate-950 text-white border-[#701127] shadow-2xl shadow-[#701127]/25 ring-2 ring-[#701127]/50"
                : "bg-slate-900 text-white border-slate-800 hover:border-[#701127]/70"
            )}
          >
            {/* Popular badge */}
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#701127] to-[#8c1733] text-white text-[10px] font-black uppercase tracking-wider py-1 px-4 rounded-full shadow-md flex items-center gap-1.5">
              <Sparkles className="w-3 h-3" />
              <span>LE PLUS CHOISI PAR LES PROS</span>
            </div>

            <div>
              <div className="flex justify-between items-center mb-4 pt-1">
                <h3 className="text-2xl font-black text-white">Plan Pro</h3>
                <span className="text-xs font-bold px-3 py-1 bg-rose-500/20 text-rose-300 border border-rose-500/30 rounded-full">
                  Recommandé
                </span>
              </div>
              <p className="text-slate-400 text-sm mb-6">
                Pour les entrepreneurs actifs qui veulent accélérer leurs encaissements.
              </p>
              
              <div className="mb-6">
                <span className="text-4xl sm:text-5xl font-black text-white">
                  {isYearly ? "50 000" : "5 000"} FCFA
                </span>
                <span className="text-slate-400 text-sm font-semibold">
                  {isYearly ? " / an" : " / mois"}
                </span>
              </div>

              <ul className="space-y-3.5 text-sm text-slate-300 border-t border-slate-800 pt-6">
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span><strong className="text-white">Factures &amp; devis illimités</strong></span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Personnalisation complète avec votre logo</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Relances automatiques par WhatsApp &amp; Email</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Tableau de bord financier &amp; suivi des impayés</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Support prioritaire WhatsApp 7j/7</span>
                </li>
              </ul>
            </div>

            <div className="mt-8">
              <Link
                href="/login?mode=signup&plan=pro"
                className="btn-magnetic w-full block text-center py-4 px-4 rounded-2xl text-sm font-black text-white bg-gradient-to-r from-[#701127] to-[#8c1733] hover:from-[#570c1d] hover:to-[#701127] shadow-xl shadow-[#701127]/40 transition-all"
              >
                Passer au Plan Pro
              </Link>
            </div>
          </div>

          {/* Plan 3: Business */}
          <div
            onClick={() => setSelectedPlan("business")}
            className={cn(
              "reveal rounded-3xl p-8 border transition-all duration-300 flex flex-col justify-between cursor-pointer group",
              selectedPlan === "business"
                ? "bg-white border-[#701127] shadow-xl shadow-[#701127]/10 ring-2 ring-[#701127]/20"
                : "bg-[#FAF8FF] border-slate-200 hover:border-slate-300 hover:shadow-md"
            )}
          >
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-black text-slate-900">Plan Business</h3>
                <span className="text-[11px] font-bold px-3 py-1 bg-slate-200 text-slate-700 rounded-full">
                  Équipe &amp; PME
                </span>
              </div>
              <p className="text-slate-500 text-sm mb-6">
                Pour les entreprises établies avec plusieurs collaborateurs et succursales.
              </p>
              
              <div className="mb-6">
                <span className="text-4xl font-black text-slate-950">
                  {isYearly ? "150 000" : "15 000"} FCFA
                </span>
                <span className="text-slate-500 text-sm font-semibold">
                  {isYearly ? " / an" : " / mois"}
                </span>
              </div>

              <ul className="space-y-3.5 text-sm text-slate-600 border-t border-slate-200/80 pt-6">
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span><strong className="text-slate-900">Multi-utilisateurs</strong> (jusqu&apos;à 10 accès)</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Gestion fine des rôles (Admin, Commercial, Comptable)</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Export comptable automatisé (Excel / CSV / Sage)</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Gestionnaire de compte dédié &amp; onboarding</span>
                </li>
              </ul>
            </div>

            <div className="mt-8">
              <Link
                href="/login?mode=signup&plan=business"
                className={cn(
                  "btn-magnetic w-full block text-center py-3.5 px-4 rounded-2xl text-sm font-bold transition-all",
                  selectedPlan === "business"
                    ? "bg-[#701127] text-white shadow-md shadow-[#701127]/20"
                    : "bg-white text-slate-800 border border-slate-300 hover:bg-slate-50"
                )}
              >
                Choisir le Plan Business
              </Link>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
