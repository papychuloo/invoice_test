"use client";

import React, { useState, useEffect } from "react";
import { AppShell, useActiveCountry } from "@/components/layout/AppShell";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { KpiCard } from "@/components/dashboard/KpiCard";
import { SalesChart } from "@/components/dashboard/SalesChart";
import { InvoiceStatusDonut } from "@/components/dashboard/InvoiceStatusDonut";
import { RecentInvoicesTable } from "@/components/dashboard/RecentInvoicesTable";
import { type KpiStat, type Invoice } from "@/lib/mock-data";
import { getStoredInvoices, STORE_UPDATED_EVENT } from "@/lib/store";

function DashboardContent() {
  const { activeCountry } = useActiveCountry();
  const [invoices, setInvoices] = useState<Invoice[]>(() => getStoredInvoices());

  // Real-time synchronization whenever any invoice or status changes
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

  const totalSales = invoices.reduce((sum, inv) => sum + (inv.amount || 0), 0);
  const totalPaid = invoices
    .filter((inv) => inv.status === "paid")
    .reduce((sum, inv) => sum + (inv.amount || 0), 0);
  const totalPending = invoices
    .filter((inv) => inv.status === "sent")
    .reduce((sum, inv) => sum + (inv.amount || 0), 0);
  const totalExpenses = invoices.length > 0 ? 0 : 0;

  const hasInvoices = invoices.length > 0;

  const dynamicKpis: KpiStat[] = [
    {
      id: "total_sales",
      title: "Total des ventes ce mois",
      subtitle: "Montant facturé",
      amount: totalSales,
      currency: activeCountry.symbol,
      trendPercentage: hasInvoices ? 18 : 0,
      trendDirection: "up",
      comparisonText: hasInvoices ? "vs mois dernier" : "Aucune vente",
      sparklineColor: "emerald",
      iconName: "sales",
    },
    {
      id: "total_expenses",
      title: "Total des dépenses",
      subtitle: "Charges & Achats",
      amount: totalExpenses,
      currency: activeCountry.symbol,
      trendPercentage: 0,
      trendDirection: "down",
      comparisonText: "Aucune dépense",
      sparklineColor: "rose",
      iconName: "expenses",
    },
    {
      id: "paid_invoices",
      title: "Factures encaissées",
      subtitle: "Règlements reçus",
      amount: totalPaid,
      currency: activeCountry.symbol,
      trendPercentage: hasInvoices ? 24 : 0,
      trendDirection: "up",
      comparisonText: hasInvoices ? "vs mois dernier" : "Aucun encaissement",
      sparklineColor: "emerald",
      iconName: "profit",
    },
    {
      id: "pending_invoices",
      title: "Factures en attente",
      subtitle: "En cours d'encaissement",
      amount: totalPending,
      currency: activeCountry.symbol,
      trendPercentage: hasInvoices ? 12 : 0,
      trendDirection: "up",
      comparisonText: hasInvoices ? "vs mois dernier" : "Aucune créance",
      sparklineColor: "amber",
      iconName: "pending",
    },
  ];

  return (
    <>
      {/* Subheader & Date Filters */}
      <div className="animate-fade-in-up">
        <DashboardHeader
          countryName={activeCountry.name}
          cityName={activeCountry.defaultCity}
        />
      </div>

      {/* 4 KPI Cards Grid with Staggered Entrance */}
      <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3.5 sm:gap-5">
        {dynamicKpis.map((stat, idx) => (
          <div
            key={stat.id}
            className="animate-fade-in-up"
            style={{ animationDelay: `${idx * 80}ms` }}
          >
            <KpiCard stat={stat} />
          </div>
        ))}
      </section>

      {/* Middle Row: Monthly Sales Bar Chart + Invoice Status Donut */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in-up delay-200">
        <div className="lg:col-span-2">
          <SalesChart />
        </div>
        <div className="lg:col-span-1">
          <InvoiceStatusDonut />
        </div>
      </section>

      {/* Bottom Section: Recent Invoices Table with Enhanced Actions */}
      <section className="pt-2 animate-fade-in-up delay-300">
        <RecentInvoicesTable />
      </section>
    </>
  );
}

export function DashboardView() {
  return (
    <AppShell>
      <DashboardContent />
    </AppShell>
  );
}
