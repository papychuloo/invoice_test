import React from "react";
import { Tag, Receipt, Clock, Wallet, TrendingUp, TrendingDown } from "lucide-react";
import { type KpiStat } from "@/lib/mock-data";
import { formatNumber } from "@/lib/money";
import { cn } from "@/lib/utils";

interface KpiCardProps {
  stat: KpiStat;
}

export function KpiCard({ stat }: KpiCardProps) {
  // Select icon based on stat iconName
  const renderIcon = () => {
    switch (stat.iconName) {
      case "sales":
        return <Tag className="w-4 h-4 text-[#701127]" />;
      case "expenses":
        return <Receipt className="w-4 h-4 text-rose-600" />;
      case "pending":
        return <Clock className="w-4 h-4 text-amber-600" />;
      case "profit":
        return <Wallet className="w-4 h-4 text-emerald-600" />;
    }
  };

  // Icon container background colors
  const iconBgClasses = {
    sales: "bg-rose-50 border-rose-200/60",
    expenses: "bg-rose-50/80 border-rose-200/60",
    pending: "bg-amber-50 border-amber-200/60",
    profit: "bg-emerald-50 border-emerald-200/60",
  }[stat.iconName];

  // Sparkline color and gradients
  const sparklineColors = {
    emerald: {
      stroke: "#10B981",
      fill: "url(#emerald-gradient)",
      text: "text-emerald-600",
      bg: "bg-emerald-50",
    },
    rose: {
      stroke: "#F43F5E",
      fill: "url(#rose-gradient)",
      text: "text-rose-600",
      bg: "bg-rose-50",
    },
    amber: {
      stroke: "#F59E0B",
      fill: "url(#amber-gradient)",
      text: "text-amber-600",
      bg: "bg-amber-50",
    },
    blue: {
      stroke: "#3B82F6",
      fill: "url(#blue-gradient)",
      text: "text-blue-600",
      bg: "bg-blue-50",
    },
  }[stat.sparklineColor];

  return (
    <div className="relative bg-white rounded-2xl p-5 border border-slate-200/70 shadow-xs hover:shadow-md hover:border-slate-300 transition-all flex flex-col justify-between overflow-hidden group">
      {/* Top row: Icon and Title */}
      <div className="flex items-center gap-2.5">
        <div
          className={cn(
            "w-8 h-8 rounded-lg flex items-center justify-center border shadow-2xs transition-transform group-hover:scale-105",
            iconBgClasses
          )}
        >
          {renderIcon()}
        </div>
        <div className="flex flex-col">
          <span className="text-xs font-semibold text-slate-700 tracking-tight">
            {stat.title}
          </span>
          <span className="text-[10px] text-slate-400 font-medium">
            {stat.subtitle}
          </span>
        </div>
      </div>

      {/* Middle row: Big Amount with Currency label */}
      <div className="mt-4 mb-2">
        <span className="text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
          {stat.currency}
        </span>
        <div className="text-2xl sm:text-[26px] font-extrabold text-slate-900 tracking-tight leading-none mt-0.5">
          {formatNumber(stat.amount)}
        </div>
      </div>

      {/* Bottom row: Trend indicator & Smooth Sparkline Wave */}
      <div className="flex items-end justify-between pt-2">
        {/* Trend badge */}
        <div className="flex items-center gap-1">
          <span
            className={cn(
              "text-xs font-semibold flex items-center gap-0.5",
              sparklineColors.text
            )}
          >
            {stat.trendDirection === "up" ? (
              <TrendingUp className="w-3.5 h-3.5" />
            ) : (
              <TrendingDown className="w-3.5 h-3.5" />
            )}
            +{stat.trendPercentage}%
          </span>
          <span className="text-[11px] text-slate-400 font-medium">
            {stat.comparisonText}
          </span>
        </div>

        {/* Mini Smooth Wave / Sparkline graphic matching screenshot */}
        <div className="w-20 h-9 shrink-0">
          <svg viewBox="0 0 100 40" className="w-full h-full overflow-visible">
            <defs>
              <linearGradient id="emerald-gradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10B981" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#10B981" stopOpacity="0.0" />
              </linearGradient>
              <linearGradient id="rose-gradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#F43F5E" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#F43F5E" stopOpacity="0.0" />
              </linearGradient>
              <linearGradient id="amber-gradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#F59E0B" stopOpacity="0.0" />
              </linearGradient>
              <linearGradient id="blue-gradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Smooth curved filled path */}
            <path
              d="M 0 32 C 25 35, 35 22, 55 25 C 75 28, 85 10, 100 8 L 100 40 L 0 40 Z"
              fill={sparklineColors.fill}
            />
            {/* Smooth stroke line */}
            <path
              d="M 0 32 C 25 35, 35 22, 55 25 C 75 28, 85 10, 100 8"
              fill="none"
              stroke={sparklineColors.stroke}
              strokeWidth="2.2"
              strokeLinecap="round"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}
