import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { AuthProvider } from "@/lib/auth-context";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const serifDisplay = Playfair_Display({
  variable: "--font-serif",
  subsets: ["latin"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "IziFacture • SaaS de facturation pour entrepreneurs africains (FCFA)",
  description: "Créez et gérez vos factures et devis en FCFA avec TVA automatique, paiements Mobile Money et partages WhatsApp.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${inter.variable} ${serifDisplay.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans bg-[#F8F9FB] text-slate-800 antialiased selection:bg-[#83142C] selection:text-white">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
