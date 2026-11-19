import React from "react";
import { AppShell } from "@/components/layout/AppShell";
import { CustomersListView } from "@/components/customers/CustomersListView";

export const metadata = {
  title: "Clients & Partenaires | IziFacture",
  description: "Gestion des clients, annuaire professionnel et historique de facturation en zone FCFA.",
};

export default function CustomersPage() {
  return (
    <AppShell>
      <div className="max-w-7xl w-full mx-auto p-3.5 sm:p-6 lg:p-8 space-y-6">
        <CustomersListView />
      </div>
    </AppShell>
  );
}
