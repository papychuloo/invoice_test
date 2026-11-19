"use client";

import React, { useState, useEffect, createContext, useContext } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { HeaderBanner } from "@/components/layout/HeaderBanner";
import { SubpageHeader } from "@/components/layout/SubpageHeader";
import { COUNTRIES, type CountryConfig } from "@/lib/countries";

interface CountryContextType {
  activeCountry: CountryConfig;
  setActiveCountry: (country: CountryConfig) => void;
}

const CountryContext = createContext<CountryContextType>({
  activeCountry: COUNTRIES[0] as CountryConfig,
  setActiveCountry: () => {},
});

export function useActiveCountry() {
  return useContext(CountryContext);
}

interface AppShellProps {
  children: React.ReactNode;
  currentDate?: string;
}

export function AppShell({ children, currentDate }: AppShellProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, loading } = useAuth();
  const isDashboard = pathname === "/";
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [activeCountry, setActiveCountry] = useState<CountryConfig>(
    COUNTRIES[0] || {
      code: "SN",
      name: "Sénégal",
      flag: "🇸🇳",
      currency: "XOF",
      symbol: "FCFA",
      defaultCity: "Dakar",
      vatRateBps: 1800,
      vatLabel: "TVA 18%",
    }
  );

  // Route protection: redirect to /login if user is not authenticated
  useEffect(() => {
    if (!loading && !user && pathname !== "/login") {
      router.replace("/login");
    }
  }, [loading, user, pathname, router]);

  // Auto-close sidebar whenever route changes (e.g. clicking Client, Factures, etc.)
  const [prevPathname, setPrevPathname] = useState(pathname);
  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    setMobileSidebarOpen(false);
  }

  // Close sidebar on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMobileSidebarOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Display luxury branded loader while authenticating or redirecting
  if (loading || (!user && pathname !== "/login")) {
    return (
      <div className="min-h-screen bg-[#F8F9FB] flex flex-col items-center justify-center p-4">
        <div className="flex flex-col items-center space-y-4 animate-fade-in-up">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#570c1d] to-[#8c1733] flex items-center justify-center text-white shadow-xl shadow-[#570c1d]/30 animate-pulse">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              className="w-7 h-7"
            >
              <circle cx="12" cy="12" r="3" fill="currentColor" />
              <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
            </svg>
          </div>
          <div className="flex items-center gap-2">
            <Loader2 className="w-4 h-4 text-[#701127] animate-spin" />
            <span className="text-xs font-semibold text-slate-600 tracking-wider uppercase">
              {loading ? "Chargement de la session..." : "Redirection vers la connexion..."}
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <CountryContext.Provider value={{ activeCountry, setActiveCountry }}>
      <div className="min-h-screen bg-[#F8F9FB] flex antialiased">
        {/* Sidebar navigation drawer (Auto-closes on option click, with backdrop and X button) */}
        <AppSidebar
          mobileOpen={mobileSidebarOpen}
          onMobileClose={() => setMobileSidebarOpen(false)}
        />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 transition-all">
          {/* Header: Full Burgundy Banner on Dashboard, Compact SubpageHeader on other pages */}
          {isDashboard ? (
            <HeaderBanner
              currentDate={currentDate}
              selectedCountry={activeCountry}
              onCountryChange={setActiveCountry}
              onOpenMobileMenu={() => setMobileSidebarOpen(true)}
            />
          ) : (
            <SubpageHeader
              selectedCountry={activeCountry}
              onCountryChange={setActiveCountry}
              onOpenMobileMenu={() => setMobileSidebarOpen(true)}
            />
          )}

          {/* Standard Page Workspace Container */}
          <main className="flex-1 p-3.5 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
            {children}
          </main>
        </div>
      </div>
    </CountryContext.Provider>
  );
}
