"use client";

import React from "react";
import { Calendar, ChevronDown, SlidersHorizontal } from "lucide-react";
import { MOCK_COMPANY } from "@/lib/mock-data";

interface DashboardHeaderProps {
  countryName?: string;
  cityName?: string;
}

export function DashboardHeader({
  countryName = MOCK_COMPANY.country,
  cityName = MOCK_COMPANY.city,
}: DashboardHeaderProps) {
  const currentPeriod = "01 Jan - 30 Juin 2026";
  const comparisonPeriod = "01 Juil - 31 Déc 2025";

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6">
      {/* Title & Organization Info */}
      <div>
        <div className="flex items-center gap-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Tableau de bord
          </h2>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            En direct
          </span>
        </div>
        <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
          {MOCK_COMPANY.name} • {cityName}, {countryName}
        </p>
      </div>

      {/* Date Filters & Comparison Controls (Exact Daftra screenshot reproduction) */}
      <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
        {/* Main Period Pill */}
        <button
          type="button"
          className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white border border-slate-200/80 hover:border-slate-300 text-xs font-semibold text-slate-700 shadow-2xs hover:shadow-xs transition-all"
        >
          <Calendar className="w-3.5 h-3.5 text-slate-400" />
          <span>{currentPeriod}</span>
          <ChevronDown className="w-3 h-3 text-slate-400 ml-0.5" />
        </button>

        {/* Compared to label */}
        <span className="text-xs text-slate-400 font-medium px-1">
          Comparé à
        </span>

        {/* Comparison Period Pill */}
        <button
          type="button"
          className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white border border-slate-200/80 hover:border-slate-300 text-xs font-semibold text-slate-700 shadow-2xs hover:shadow-xs transition-all"
        >
          <Calendar className="w-3.5 h-3.5 text-slate-400" />
          <span>{comparisonPeriod}</span>
          <ChevronDown className="w-3 h-3 text-slate-400 ml-0.5" />
        </button>

        {/* Filter button */}
        <button
          type="button"
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-slate-200/80 hover:border-slate-300 text-xs font-semibold text-slate-700 shadow-2xs hover:shadow-xs transition-all"
        >
          <SlidersHorizontal className="w-3.5 h-3.5 text-slate-500" />
          <span>Filtrer</span>
        </button>
      </div>
    </div>
  );
}
