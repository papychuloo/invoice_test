"use client";

import React, { useState, useEffect } from "react";
import { type InvoiceStatus, type Invoice } from "@/lib/mock-data";
import { getStoredInvoices, STORE_UPDATED_EVENT } from "@/lib/store";
import { cn } from "@/lib/utils";

// Donut geometry constants
const RADIUS = 40;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

const STATUS_CONTAINER_STYLES: Record<InvoiceStatus, { border: string; bg: string; badge: string }> = {
  paid: {
    border: "border-2 border-emerald-500/80 shadow-2xs",
    bg: "bg-emerald-50/40 hover:bg-emerald-50/70",
    badge: "text-emerald-800 font-bold",
  },
  sent: {
    border: "border-2 border-amber-500/80 shadow-2xs",
    bg: "bg-amber-50/40 hover:bg-amber-50/70",
    badge: "text-amber-800 font-bold",
  },
  overdue: {
    border: "border-2 border-rose-500/80 shadow-2xs",
    bg: "bg-rose-50/40 hover:bg-rose-50/70",
    badge: "text-rose-800 font-bold",
  },
  draft: {
    border: "border-2 border-slate-400/80 shadow-2xs",
    bg: "bg-slate-50/60 hover:bg-slate-100/70",
    badge: "text-slate-800 font-bold",
  },
};

export function InvoiceStatusDonut() {
  const [invoices, setInvoices] = useState<Invoice[]>(() => getStoredInvoices());

  useEffect(() => {
    const handleSync = () => setInvoices(getStoredInvoices());
    handleSync();
    window.addEventListener(STORE_UPDATED_EVENT, handleSync);
    window.addEventListener("storage", handleSync);
    window.addEventListener("focus", handleSync);
    return () => {
      window.removeEventListener(STORE_UPDATED_EVENT, handleSync);
      window.removeEventListener("storage", handleSync);
      window.removeEventListener("focus", handleSync);
    };
  }, []);

  const totalInvoices = invoices.length;
  const countPaid = invoices.filter((i) => i.status === "paid").length;
  const countSent = invoices.filter((i) => i.status === "sent").length;
  const countOverdue = invoices.filter((i) => i.status === "overdue").length;
  const countDraft = invoices.filter((i) => i.status === "draft").length;

  const distribution = [
    {
      status: "paid" as InvoiceStatus,
      label: "Payées",
      count: countPaid,
      percentage: totalInvoices > 0 ? Math.round((countPaid / totalInvoices) * 100) : 0,
      color: "#10B981",
      dotColor: "bg-emerald-500",
    },
    {
      status: "sent" as InvoiceStatus,
      label: "Envoyées",
      count: countSent,
      percentage: totalInvoices > 0 ? Math.round((countSent / totalInvoices) * 100) : 0,
      color: "#F59E0B",
      dotColor: "bg-amber-500",
    },
    {
      status: "overdue" as InvoiceStatus,
      label: "En retard",
      count: countOverdue,
      percentage: totalInvoices > 0 ? Math.round((countOverdue / totalInvoices) * 100) : 0,
      color: "#EF4444",
      dotColor: "bg-rose-500",
    },
    {
      status: "draft" as InvoiceStatus,
      label: "Brouillons",
      count: countDraft,
      percentage: totalInvoices > 0 ? Math.round((countDraft / totalInvoices) * 100) : 0,
      color: "#94A3B8",
      dotColor: "bg-slate-400",
    },
  ];

  let running = 0;
  const segments = distribution.map((item) => {
    const dashLength = (item.percentage / 100) * CIRCUMFERENCE;
    const dashOffset = -((running / 100) * CIRCUMFERENCE);
    running += item.percentage;
    return {
      ...item,
      dashLength,
      dashOffset,
    };
  });

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200/70 shadow-xs flex flex-col justify-between">
      {/* Title */}
      <div className="pb-3">
        <h2 className="text-lg font-bold text-slate-900 tracking-tight">
          Statut des factures
        </h2>
        <p className="text-xs text-slate-400 font-medium">
          {totalInvoices === 0 ? "Aucune facture émise pour le moment" : `Répartition des ${totalInvoices} factures émises`}
        </p>
      </div>

      {/* Donut Chart representation */}
      <div className="relative flex items-center justify-center my-3">
        <div className="w-44 h-44 relative flex items-center justify-center">
          <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
            {/* Background circle */}
            <circle
              cx="50"
              cy="50"
              r={RADIUS}
              fill="transparent"
              stroke="#F1F5F9"
              strokeWidth="15"
            />

            {/* Segments */}
            {segments.map((seg) => (
              <circle
                key={seg.status}
                cx="50"
                cy="50"
                r={RADIUS}
                fill="transparent"
                stroke={seg.color}
                strokeWidth="15"
                strokeDasharray={`${seg.dashLength} ${CIRCUMFERENCE - seg.dashLength}`}
                strokeDashoffset={seg.dashOffset}
                strokeLinecap="butt"
                className="transition-all duration-500 hover:opacity-80"
              />
            ))}
          </svg>

          {/* Center Hole Information */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="text-2xl font-black text-slate-800 tracking-tight leading-none">
              {totalInvoices}
            </span>
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mt-1">
              Factures
            </span>
          </div>
        </div>
      </div>

      {/* Clearly delineated status cards with high-contrast borders */}
      <div className="space-y-2.5 pt-2">
        {distribution.map((item) => {
          const style = STATUS_CONTAINER_STYLES[item.status];
          return (
            <div
              key={item.status}
              className={cn(
                "flex items-center justify-between text-xs gap-3 px-3 py-2 rounded-xl transition-all",
                style.border,
                style.bg
              )}
            >
              {/* Label with colored dot */}
              <div className="flex items-center gap-2 w-28 shrink-0">
                <span className={cn("w-2.5 h-2.5 rounded-full shrink-0 shadow-2xs", item.dotColor)} />
                <span className={style.badge}>{item.label}</span>
              </div>

              {/* Striped Dashes Bar Indicator */}
              <div className="flex-1 flex items-center gap-1 overflow-hidden">
                <div
                  className="h-2.5 rounded-xs pattern-dashes"
                  style={{
                    width: `${Math.max(item.percentage, 15)}%`,
                    color: item.color,
                  }}
                />
              </div>

              {/* Percentage & Count */}
              <div className="flex items-center gap-2 shrink-0 text-right">
                <span className="text-slate-500 font-medium text-[11px]">
                  {item.percentage}%
                </span>
                <span className="font-extrabold text-slate-900 text-xs w-6 text-right px-1.5 py-0.5 rounded-md bg-white border border-slate-200 shadow-2xs">
                  {item.count}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
