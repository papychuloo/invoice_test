import React, { Suspense } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { SettingsView } from "@/components/settings/SettingsView";

export const metadata = {
  title: "Paramètres & Abonnement Pro | IziFacture",
  description: "Configuration de votre entreprise, identifiants NINEA, coordonnées Mobile Money et abonnement Pro.",
};

export default function SettingsPage() {
  return (
    <AppShell>
      <div className="max-w-7xl w-full mx-auto p-3.5 sm:p-6 lg:p-8 space-y-6">
        <Suspense fallback={<div className="p-12 text-center text-xs text-slate-400">Chargement des paramètres...</div>}>
          <SettingsView />
        </Suspense>
      </div>
    </AppShell>
  );
}
