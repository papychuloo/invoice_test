import React, { Suspense } from "react";
import { Metadata } from "next";
import { AuthForm } from "@/components/auth/AuthForm";
import { Loader2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Connexion & Inscription | IziFacture",
  description: "Accédez à votre espace sécurisé IziFacture pour gérer vos factures et clients en FCFA.",
};

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-[#F8F9FB] flex items-center justify-center p-4 sm:p-6 lg:p-8 animate-fade-in-up">
      <Suspense
        fallback={
          <div className="flex items-center gap-2 text-slate-500 text-xs font-semibold">
            <Loader2 className="w-4 h-4 animate-spin text-[#701127]" />
            <span>Chargement...</span>
          </div>
        }
      >
        <AuthForm />
      </Suspense>
    </main>
  );
}
