"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ShieldCheck,
  Check,
} from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import { useAuth } from "@/lib/auth-context";
import { cn } from "@/lib/utils";

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export function AuthForm() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [mode, setMode] = useState<"login" | "signup">("login");

  // If already authenticated, redirect to Dashboard
  useEffect(() => {
    if (!authLoading && user) {
      router.replace("/");
    }
  }, [authLoading, user, router]);

  // Form fields
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  // Status & Validation
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Password rules validation
  const hasLength = password.length >= 8 && password.length <= 16;
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password);

  const criteriaCount = [hasLength, hasUpper && hasLower, hasNumber, hasSpecial].filter(Boolean).length;

  const getStrengthLabel = () => {
    if (!password) return { label: "", color: "bg-slate-200", textColor: "text-slate-400" };
    if (criteriaCount <= 1) return { label: "Trop faible", color: "bg-rose-500", textColor: "text-rose-600" };
    if (criteriaCount === 2) return { label: "Moyen", color: "bg-amber-500", textColor: "text-amber-600" };
    if (criteriaCount === 3) return { label: "Bon", color: "bg-blue-500", textColor: "text-blue-600" };
    return { label: "Très puissant (Sécurisé)", color: "bg-emerald-500", textColor: "text-emerald-600" };
  };

  const strength = getStrengthLabel();

  const validateForm = (): boolean => {
    setErrorMessage(null);

    // Email check
    if (!email.trim()) {
      setErrorMessage("Veuillez saisir votre adresse email.");
      return false;
    }
    if (!EMAIL_REGEX.test(email.trim())) {
      setErrorMessage("Format d'adresse email invalide (ex: contact@entreprise.sn).");
      return false;
    }

    // Password check
    if (!password) {
      setErrorMessage("Veuillez saisir un mot de passe.");
      return false;
    }
    if (password.length < 8 || password.length > 16) {
      setErrorMessage("Le mot de passe doit comporter obligatoirement entre 8 et 16 caractères.");
      return false;
    }
    if (!hasUpper || !hasLower) {
      setErrorMessage("Le mot de passe doit contenir au moins une lettre majuscule et une minuscule.");
      return false;
    }
    if (!hasNumber) {
      setErrorMessage("Le mot de passe doit contenir au moins un chiffre.");
      return false;
    }
    if (!hasSpecial) {
      setErrorMessage("Le mot de passe doit contenir au moins un caractère spécial (!, @, #, $, etc.).");
      return false;
    }

    if (mode === "signup") {
      if (!fullName.trim()) {
        setErrorMessage("Veuillez indiquer votre nom complet ou la raison sociale.");
        return false;
      }
      if (password !== confirmPassword) {
        setErrorMessage("Les deux mots de passe ne correspondent pas.");
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      if (mode === "login") {
        const { error } = await supabase.auth.signInWithPassword({
          email: email.trim().toLowerCase(),
          password,
        });

        if (error) {
          if (error.message.includes("Invalid login credentials")) {
            setErrorMessage("Identifiants incorrects. Veuillez vérifier votre adresse email et votre mot de passe.");
          } else {
            setErrorMessage(error.message);
          }
          setLoading(false);
          return;
        }

        setSuccessMessage("Connexion réussie ! Redirection en cours...");
        setTimeout(() => {
          setLoading(false);
          setPassword("");
          router.push("/");
          router.refresh();
        }, 600);
      } else {
        // Sign Up
        const { error } = await supabase.auth.signUp({
          email: email.trim().toLowerCase(),
          password,
          options: {
            data: {
              full_name: fullName.trim(),
            },
          },
        });

        if (error) {
          setErrorMessage(error.message);
          setLoading(false);
          return;
        }

        // Do NOT auto login: switch to login mode, clear password fields, and inform user
        setPassword("");
        setConfirmPassword("");
        setMode("login");
        setLoading(false);
        setSuccessMessage("Votre compte a été créé avec succès ! Veuillez saisir votre mot de passe pour vous connecter.");
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Une erreur inattendue est survenue.";
      setErrorMessage(msg);
      setLoading(false);
    }
  };

  const handleOAuthLogin = async (provider: "google" | "github") => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: typeof window !== "undefined" ? `${window.location.origin}/` : undefined,
        },
      });
      if (error) {
        setErrorMessage(error.message);
        setLoading(false);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Erreur OAuth";
      setErrorMessage(msg);
      setLoading(false);
    }
  };

  if (authLoading || user) {
    return (
      <div className="w-full max-w-md mx-auto flex flex-col items-center justify-center p-8 space-y-4">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#570c1d] to-[#8c1733] flex items-center justify-center text-white shadow-xl shadow-[#570c1d]/25 animate-pulse">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className="w-7 h-7">
            <circle cx="12" cy="12" r="3" fill="currentColor" />
            <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
          </svg>
        </div>
        <div className="flex items-center gap-2">
          <Loader2 className="w-4 h-4 text-[#701127] animate-spin" />
          <span className="text-xs font-semibold text-slate-600 tracking-wider uppercase">
            {authLoading ? "Vérification de la session..." : "Redirection vers le tableau de bord..."}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Brand logo & Badge */}
      <div className="flex flex-col items-center mb-8 text-center">
        <Link href="/" className="inline-flex items-center gap-2.5 group">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#570c1d] to-[#8c1733] text-white flex items-center justify-center shadow-lg border border-white/20 group-hover:scale-105 transition-transform">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" className="w-6 h-6">
              <circle cx="12" cy="12" r="3.2" fill="currentColor" />
              <path d="M12 2v3M12 19v3M4.93 4.93l2.12 2.12M16.95 16.95l2.12 2.12M2 12h3M19 12h3M4.93 19.07l2.12-2.12M16.95 7.05l2.12-2.12" />
            </svg>
          </div>
          <span className="text-2xl font-extrabold tracking-tight text-slate-900">
            IziFacture
          </span>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-50 text-[#701127] border border-rose-200">
            FCFA
          </span>
        </Link>
        <span className="text-[11px] text-slate-400 font-semibold tracking-wider uppercase mt-1">
          UEMOA • CEMAC
        </span>
      </div>

      {/* Main Auth Card */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xl p-7 sm:p-9 space-y-6">
        {/* Title & Subtitle */}
        <div className="text-center space-y-1">
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            {mode === "login" ? "Connexion à votre espace" : "Créer votre compte"}
          </h1>
          <p className="text-xs text-slate-500">
            {mode === "login"
              ? "Veuillez saisir vos identifiants pour continuer."
              : "Rejoignez la solution de facturation conforme UEMOA & CEMAC."}
          </p>
        </div>

        {/* Notifications (Errors or Success) */}
        {errorMessage && (
          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2.5 animate-in fade-in">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <span className="leading-relaxed font-medium">{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-start gap-2.5 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span className="leading-relaxed font-medium">{successMessage}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name field (Only in Signup mode) */}
          {mode === "signup" && (
            <div className="space-y-1.5 animate-in fade-in duration-200">
              <label className="text-xs font-bold text-slate-700 block">
                Nom complet ou Raison sociale <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="ex: Dr. Awa Ndiaye (Clinique Al Noor)"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200/90 focus:border-[#701127] focus:ring-2 focus:ring-[#701127]/20 outline-none text-xs text-slate-900 placeholder-slate-400 transition-all bg-slate-50/40 focus:bg-white"
                />
              </div>
            </div>
          )}

          {/* Email input */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 block">
              Adresse email professionnelle <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nom@entreprise.sn"
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200/90 focus:border-[#701127] focus:ring-2 focus:ring-[#701127]/20 outline-none text-xs text-slate-900 placeholder-slate-400 transition-all bg-slate-50/40 focus:bg-white"
              />
            </div>
          </div>

          {/* Password input */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700">
                Mot de passe <span className="text-rose-500">*</span>
              </label>
              <span className="text-[10px] text-slate-400 font-medium">
                8 à 16 caractères
              </span>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                required
                maxLength={16}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200/90 focus:border-[#701127] focus:ring-2 focus:ring-[#701127]/20 outline-none text-xs text-slate-900 placeholder-slate-400 transition-all bg-slate-50/40 focus:bg-white font-mono"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-700 transition-colors"
                title={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {/* Dynamic Password Strength Indicator */}
            {password.length > 0 && (
              <div className="pt-1.5 space-y-1.5 animate-in fade-in duration-150">
                <div className="flex items-center justify-between text-[10px]">
                  <span className="text-slate-500 font-medium">Niveau de sécurité :</span>
                  <span className={cn("font-bold", strength.textColor)}>{strength.label}</span>
                </div>
                {/* 4 segments progress bar */}
                <div className="grid grid-cols-4 gap-1.5 h-1.5">
                  <div className={cn("rounded-full transition-all duration-300", criteriaCount >= 1 ? strength.color : "bg-slate-200")} />
                  <div className={cn("rounded-full transition-all duration-300", criteriaCount >= 2 ? strength.color : "bg-slate-200")} />
                  <div className={cn("rounded-full transition-all duration-300", criteriaCount >= 3 ? strength.color : "bg-slate-200")} />
                  <div className={cn("rounded-full transition-all duration-300", criteriaCount >= 4 ? strength.color : "bg-slate-200")} />
                </div>

                {/* Password Criteria Checklist (Only in signup or when typing) */}
                {mode === "signup" && (
                  <div className="grid grid-cols-2 gap-1 text-[10px] pt-1 text-slate-500">
                    <span className={cn("flex items-center gap-1", hasLength ? "text-emerald-600 font-bold" : "")}>
                      <Check className="w-3 h-3" /> 8 à 16 caractères
                    </span>
                    <span className={cn("flex items-center gap-1", hasUpper && hasLower ? "text-emerald-600 font-bold" : "")}>
                      <Check className="w-3 h-3" /> Majuscule & minuscule
                    </span>
                    <span className={cn("flex items-center gap-1", hasNumber ? "text-emerald-600 font-bold" : "")}>
                      <Check className="w-3 h-3" /> Au moins un chiffre
                    </span>
                    <span className={cn("flex items-center gap-1", hasSpecial ? "text-emerald-600 font-bold" : "")}>
                      <Check className="w-3 h-3" /> Caractère spécial (!@#)
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Confirm Password (Only in Signup mode) */}
          {mode === "signup" && (
            <div className="space-y-1.5 animate-in fade-in duration-200">
              <label className="text-xs font-bold text-slate-700 block">
                Confirmer le mot de passe <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  maxLength={16}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200/90 focus:border-[#701127] focus:ring-2 focus:ring-[#701127]/20 outline-none text-xs text-slate-900 placeholder-slate-400 transition-all bg-slate-50/40 focus:bg-white font-mono"
                />
              </div>
            </div>
          )}

          {/* Remember me & Forgot Password */}
          <div className="flex items-center justify-between text-xs pt-1">
            <label className="flex items-center gap-2 cursor-pointer select-none text-slate-600 hover:text-slate-900">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded border-slate-300 text-[#701127] focus:ring-[#701127]"
              />
              <span>Se souvenir de moi</span>
            </label>

            {mode === "login" && (
              <button
                type="button"
                onClick={() => alert("Pour réinitialiser votre mot de passe, contactez l'administrateur ou utilisez le lien envoyé à votre email.")}
                className="text-xs font-semibold text-[#701127] hover:text-[#570c1d] transition-colors"
              >
                Mot de passe oublié ?
              </button>
            )}
          </div>

          {/* Main Action Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 rounded-xl bg-[#701127] hover:bg-[#570c1d] text-white font-bold text-xs tracking-wide shadow-md shadow-[#701127]/25 hover:shadow-lg transition-all active:scale-[0.99] flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed mt-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Traitement en cours...</span>
              </>
            ) : mode === "login" ? (
              <>
                <span>Se connecter</span>
                <ArrowRight className="w-4 h-4" />
              </>
            ) : (
              <>
                <span>Créer mon compte</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Divider "or continue with" */}
        <div className="relative flex items-center justify-center my-4">
          <div className="border-t border-slate-200 w-full" />
          <span className="bg-white px-3 text-[11px] font-medium text-slate-400 absolute">
            ou continuer avec
          </span>
        </div>

        {/* Social Authentication Buttons */}
        <div className="grid grid-cols-2 gap-3">
          {/* Google */}
          <button
            type="button"
            onClick={() => handleOAuthLogin("google")}
            className="py-2.5 px-3 rounded-xl border border-slate-200/90 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center justify-center gap-2 shadow-2xs transition-all hover:border-slate-300"
          >
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Google</span>
          </button>

          {/* GitHub */}
          <button
            type="button"
            onClick={() => handleOAuthLogin("github")}
            className="py-2.5 px-3 rounded-xl border border-slate-200/90 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center justify-center gap-2 shadow-2xs transition-all hover:border-slate-300"
          >
            <svg className="w-4 h-4 fill-slate-900 shrink-0" viewBox="0 0 24 24">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
            </svg>
            <span>GitHub</span>
          </button>
        </div>

        {/* Toggle Mode Switch at Bottom */}
        <div className="pt-2 text-center text-xs text-slate-500 border-t border-slate-100">
          {mode === "login" ? (
            <p>
              Vous n&apos;avez pas encore de compte ?{" "}
              <button
                type="button"
                onClick={() => {
                  setMode("signup");
                  setPassword("");
                  setConfirmPassword("");
                  setLoading(false);
                  setErrorMessage(null);
                  setSuccessMessage(null);
                }}
                className="font-bold text-[#701127] hover:underline transition-colors"
              >
                Créer un compte
              </button>
            </p>
          ) : (
            <p>
              Vous avez déjà un compte ?{" "}
              <button
                type="button"
                onClick={() => {
                  setMode("login");
                  setPassword("");
                  setConfirmPassword("");
                  setLoading(false);
                  setErrorMessage(null);
                  setSuccessMessage(null);
                }}
                className="font-bold text-[#701127] hover:underline transition-colors"
              >
                Se connecter
              </button>
            </p>
          )}
        </div>
      </div>

      {/* Footer Legal Terms Notice */}
      <div className="text-center mt-6 text-[11px] text-slate-400">
        En créant un compte, vous acceptez nos{" "}
        <a href="#" className="underline hover:text-slate-600 transition-colors">
          Conditions d&apos;utilisation
        </a>{" "}
        et notre{" "}
        <a href="#" className="underline hover:text-slate-600 transition-colors">
          Politique de confidentialité
        </a>
        .
      </div>
    </div>
  );
}
