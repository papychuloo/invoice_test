"use client";

import React from "react";
import { Star } from "lucide-react";

export function TestimonialsSection() {
  const testimonials = [
    {
      stars: 5,
      quote:
        "« Avant iziFacture, je passais mes dimanches soirs à me battre avec des modèles Word cassés et à calculer la TVA à 18% pour mes clients à Dakar. Aujourd'hui, j'envoie mes factures directement depuis mon smartphone entre deux rendez-vous. »",
      author: "Mamadou Diop",
      role: "Fondateur Agence Tech • Dakar, Sénégal",
      initials: "MD",
      badgeColor: "bg-gradient-to-tr from-[#701127] to-[#8c1733] text-white",
    },
    {
      stars: 5,
      quote:
        "« Le suivi des paiements en temps réel m'a permis de réduire mes impayés de 40% dès le premier mois à Abidjan. Les clients prennent nos factures beaucoup plus au sérieux parce que la présentation est ultra-pro. »",
      author: "Aïssata Koné",
      role: "Consultante Marketing • Abidjan, Côte d'Ivoire",
      initials: "AK",
      badgeColor: "bg-gradient-to-tr from-purple-700 to-indigo-600 text-white",
    },
    {
      stars: 5,
      quote:
        "« La tarification en Francs CFA et la simplicité d'utilisation font toute la différence. Pas besoin d'être comptable pour sortir un état des ventes propre pour mon bilan. C'est l'outil indispensable pour tout entrepreneur sérieux. »",
      author: "Paul-Eric Foko",
      role: "Gérant PME Logistique • Douala, Cameroun",
      initials: "PF",
      badgeColor: "bg-gradient-to-tr from-emerald-700 to-teal-600 text-white",
    },
  ];

  return (
    <section id="temoignages" className="py-24 relative z-10 scroll-mt-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-16 reveal">
          <span className="text-xs font-black uppercase tracking-widest text-[#701127] bg-rose-50 border border-rose-100 px-3.5 py-1.5 rounded-full">
            Approuvé sur le continent
          </span>
          <h2 className="mt-4 text-3xl sm:text-5xl font-black text-slate-950 tracking-tight">
            Ils ont abandonné Excel et ne reviendront jamais en arrière
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, idx) => (
            <div
              key={t.author}
              className="reveal bg-white p-8 rounded-3xl border border-slate-200/90 shadow-xs hover:shadow-xl hover:border-[#701127]/30 transition-all duration-300 flex flex-col justify-between"
              style={{ transitionDelay: `${idx * 120}ms` }}
            >
              <div>
                <div className="flex items-center gap-1 text-amber-400 mb-4">
                  {[...Array(t.stars)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-slate-700 text-sm leading-relaxed italic mb-6">
                  {t.quote}
                </p>
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                <div className={`w-10 h-10 rounded-full font-black flex items-center justify-center text-xs shadow-xs ${t.badgeColor}`}>
                  {t.initials}
                </div>
                <div>
                  <h4 className="font-extrabold text-slate-900 text-sm">{t.author}</h4>
                  <p className="text-xs text-slate-500 font-medium">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
