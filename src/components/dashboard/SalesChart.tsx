"use client";

import React, { useState, useEffect } from "react";
import { Calendar, TrendingUp } from "lucide-react";
import { formatNumber } from "@/lib/money";
import { getStoredInvoices, STORE_UPDATED_EVENT } from "@/lib/store";
import { type Invoice } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export function SalesChart() {
  const [invoices, setInvoices] = useState<Invoice[]>(() => getStoredInvoices());
  const [activeMonthIndex, setActiveMonthIndex] = useState<number>(0);

  useEffect(() => {
    const handleSync = () => setInvoices(getStoredInvoices());
    window.addEventListener(STORE_UPDATED_EVENT, handleSync);
    window.addEventListener("storage", handleSync);
    return () => {
      window.removeEventListener(STORE_UPDATED_EVENT, handleSync);
      window.removeEventListener("storage", handleSync);
    };
  }, []);

  const monthsConfig = [
    { month: "Janvier", monthShort: "Jan", index: 0 },
    { month: "Février", monthShort: "Fév", index: 1 },
    { month: "Mars", monthShort: "Mar", index: 2 },
    { month: "Avril", monthShort: "Avr", index: 3 },
    { month: "Mai", monthShort: "Mai", index: 4 },
    { month: "Juin", monthShort: "Juin", index: 5 },
  ];

  const salesData = monthsConfig.map((m) => {
    const amount = invoices
      .filter((inv) => {
        const d = new Date(inv.issueDate);
        return !isNaN(d.getTime()) && d.getMonth() === m.index;
      })
      .reduce((sum, inv) => sum + (inv.amount || 0), 0);
    return { ...m, amount };
  });

  const totalSales = salesData.reduce((acc, m) => acc + m.amount, 0);
  const maxSale = Math.max(...salesData.map((m) => m.amount));
  const maxAmount = maxSale > 0 ? maxSale * 1.25 : 1000000;
  const peakMonth = salesData.reduce((prev, curr) => (curr.amount > prev.amount ? curr : prev), salesData[0]!);
  const averageMonthly = Math.round(totalSales / 6);

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200/70 shadow-xs flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between pb-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">
            Ventes mensuelles
          </h2>
          <p className="text-xs text-slate-400 font-medium">
            Évolution du chiffre d&apos;affaires facturé (1er semestre 2026)
          </p>
        </div>
        <button
          type="button"
          className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 border border-slate-200/60 transition-colors"
          title="Changer la période"
          aria-label="Période"
        >
          <Calendar className="w-4 h-4" />
        </button>
      </div>

      {/* Bar Chart Area */}
      <div className="relative pt-8 pb-4">
        {/* Y-axis background guidelines */}
        <div className="absolute inset-x-0 top-8 bottom-10 flex flex-col justify-between pointer-events-none text-[10px] font-medium text-slate-300">
          <div className="border-b border-dashed border-slate-100 flex items-center justify-between pb-1">
            <span>{formatNumber(Math.round(maxAmount))}</span>
          </div>
          <div className="border-b border-dashed border-slate-100 flex items-center justify-between pb-1">
            <span>{formatNumber(Math.round(maxAmount * 0.75))}</span>
          </div>
          <div className="border-b border-dashed border-slate-100 flex items-center justify-between pb-1">
            <span>{formatNumber(Math.round(maxAmount * 0.5))}</span>
          </div>
          <div className="border-b border-dashed border-slate-100 flex items-center justify-between pb-1">
            <span>{formatNumber(Math.round(maxAmount * 0.25))}</span>
          </div>
          <div className="border-b border-slate-200 flex items-center justify-between pb-1">
            <span>0</span>
          </div>
        </div>

        {/* Bars Container */}
        <div className="relative h-60 flex items-end justify-between gap-3 sm:gap-6 px-4 z-10">
          {salesData.map((sale, idx) => {
            const heightPercent = maxAmount > 0 ? Math.round((sale.amount / maxAmount) * 100) : 0;
            const isSelected = idx === activeMonthIndex;

            return (
              <div
                key={sale.month}
                className="flex-1 flex flex-col items-center h-full justify-end group cursor-pointer"
                onClick={() => setActiveMonthIndex(idx)}
              >
                {/* Active Tooltip */}
                {isSelected && (
                  <div className="absolute -top-4 z-30 flex flex-col items-center animate-in fade-in zoom-in-95 duration-200 pointer-events-none">
                    <div className="px-3 py-1.5 rounded-xl bg-slate-900/95 text-white shadow-xl text-center border border-white/10 backdrop-blur-sm">
                      <div className="flex items-center justify-center gap-1.5 text-[10px] font-medium text-rose-300">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                        <span>{sale.month}</span>
                      </div>
                      <div className="text-xs font-bold tracking-tight text-white mt-0.5">
                        {formatNumber(sale.amount)} <span className="text-[9px] text-slate-300">FCFA</span>
                      </div>
                    </div>
                    {/* Tiny arrow */}
                    <div className="w-2 h-2 bg-slate-900 rotate-45 -mt-1" />
                  </div>
                )}

                {/* Vertical Bar */}
                <div className="w-full max-w-[56px] flex flex-col items-center justify-end h-full">
                  <div
                    style={{ height: `${Math.max(heightPercent, 3)}%` }}
                    className={cn(
                      "w-full rounded-t-xl transition-all duration-300 relative overflow-hidden",
                      isSelected
                        ? "bar-striped-burgundy ring-2 ring-[#701127] ring-offset-2 scale-[1.03]"
                        : "bg-gradient-to-t from-[#4a0a19] via-[#6e1328] to-[#8c1733] opacity-85 hover:opacity-100 hover:scale-[1.02]"
                    )}
                  >
                    <div className="absolute top-0 inset-x-0 h-1.5 bg-white/20 rounded-t-xl" />
                  </div>
                </div>

                {/* X-axis Month Label */}
                <span
                  className={cn(
                    "text-xs font-medium mt-3 transition-colors",
                    isSelected
                      ? "text-[#701127] font-bold"
                      : "text-slate-400 group-hover:text-slate-700"
                  )}
                >
                  {sale.monthShort}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Summary Indicators */}
      <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 text-slate-700 font-semibold border border-slate-200/60">
          <TrendingUp className="w-3.5 h-3.5 text-[#701127]" />
          <span>{totalSales > 0 ? "+100% vs Début" : "Démarrage • 0 vente"}</span>
        </div>

        <div className="flex items-center gap-1 text-slate-500 font-medium">
          <span className="text-slate-400">Pic :</span>
          <span className="text-slate-800 font-semibold">
            {peakMonth.amount > 0 ? `${peakMonth.month} (${formatNumber(peakMonth.amount)} FCFA)` : "— (0 FCFA)"}
          </span>
        </div>

        <div className="flex items-center gap-1 text-slate-500 font-medium">
          <span className="text-slate-400">Moyenne :</span>
          <span className="text-slate-800 font-semibold">{formatNumber(averageMonthly)} FCFA / mois</span>
        </div>
      </div>
    </div>
  );
}
