import { Metadata } from "next";
import { AuthForm } from "@/components/auth/AuthForm";

export const metadata: Metadata = {
  title: "Connexion & Inscription | IziFacture",
  description: "Accédez à votre espace sécurisé IziFacture pour gérer vos factures et clients en FCFA.",
};

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-[#F8F9FB] flex items-center justify-center p-4 sm:p-6 lg:p-8 animate-fade-in-up">
      <AuthForm />
    </main>
  );
}
