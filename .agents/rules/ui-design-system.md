---
title: UI Design System & Coherence Guidelines (AfriFacture / IziFacture)
description: Règle stricte imposant que tous les écrans, composants, bordures, typographies, formats et comportements responsives soient 100% identiques et fidèles au Dashboard Daftra bordeaux.
always_on: true
---

# Règle Universelle de Cohérence UI & Design System

Toute page, tout composant et tout formulaire développé dans ce SaaS de facturation DOIT suivre scrupuleusement les standards visuels, structurels et fonctionnels établis sur la page Dashboard.

---

## 1. Structure de Page & Layout (`AppShell`)

1. **Fond de l'application** : `bg-[#F8F9FB] text-slate-800 antialiased min-h-screen flex`.
2. **Sidebar (`AppSidebar`)** :
   - Largeur : `w-64 fixed top-0 bottom-0 left-0 bg-white border-r border-slate-200/80`.
   - Desktop : Décalage de la zone principale avec `lg:pl-64`.
   - Mobile : Tiroir fluide escamotable déclenché depuis le bouton hamburger de la barre supérieure.
   - Bouton principal : `bg-gradient-to-r from-[#6b0f23] to-[#8c1733] hover:from-[#570c1d] hover:to-[#701127] text-white rounded-full font-medium py-2.5 px-4 shadow-md shadow-[#6b0f23]/25`.
   - Élément actif : `bg-[#fae8ed] text-[#701127] font-semibold rounded-xl`.
3. **Bandeau Supérieur Bordeaux (`HeaderBanner`)** :
   - Fond : `burgundy-banner-gradient` (`linear-gradient(135deg, #2c040d 0%, #4e0a1a 35%, #701127 75%, #8c1733 100%)`).
   - Ligne mobile : Hamburger + logo à gauche, sélecteur pays/devise + notifications à droite.
   - Salutation : Nom en typographie serif italique élégante (`font-serif italic text-3xl sm:text-4xl text-white`).
   - Barre de recherche : Pleine largeur sur mobile, avec menu déroulant de résultats en temps réel.
4. **Conteneur d'espace de travail (`main`)** :
   - Classes obligatoires : `flex-1 p-3.5 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6`.
   - Animations d'entrée : `animate-fade-in-up` avec échelonnement (`delay-100`, `delay-200`, `delay-300`).

---

## 2. En-têtes de Page (`PageHeader`)

Chaque page (Factures, Devis, Clients, etc.) doit comporter un en-tête reprenant exactement la structure du Dashboard :
- **Titre principal** : `text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight`.
- **Badge d'état / localisation** : `px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200`.
- **Sous-titre** : `text-xs sm:text-sm text-slate-500 font-medium mt-0.5`.
- **Barre d'actions et filtres à droite** :
  - Boutons filtres : `px-3 py-2 rounded-xl bg-white border border-slate-200/80 hover:border-slate-300 text-xs font-semibold text-slate-700 shadow-2xs`.
  - Bouton d'action primaire : `px-4 py-2 rounded-xl bg-gradient-to-r from-[#701127] to-[#8c1733] text-white text-xs font-bold shadow-md shadow-[#701127]/20`.

---

## 3. Cartes de Données & Bordures

1. **Cartes génériques** :
   - `bg-white rounded-2xl border border-slate-200/70 shadow-xs hover:shadow-md transition-all p-5 sm:p-6`.
2. **Cartes KPIs** :
   - Icône en pilule colorée en haut à gauche.
   - Montant en grand format (`text-2xl sm:text-[26px] font-extrabold text-slate-900`) précédé du code devise en petit au-dessus (`text-[11px] font-semibold text-slate-400 uppercase`).
   - Tendance en pourcentage avec flèche et sparkline ondulée SVG en bas à droite.
3. **Badges de statuts (Bordures obligatoires à fort contraste)** :
   - **Payée** : `border-2 border-emerald-500 bg-emerald-50/90 text-emerald-900 ring-2 ring-emerald-500/20 font-bold`.
   - **Envoyée** : `border-2 border-amber-500 bg-amber-50/90 text-amber-900 ring-2 ring-amber-500/20 font-bold`.
   - **En retard** : `border-2 border-rose-500 bg-rose-50/90 text-rose-900 ring-2 ring-rose-500/20 font-bold` (avec puce animée `animate-pulse`).
   - **Brouillon** : `border-2 border-slate-400 bg-slate-100/90 text-slate-800 ring-2 ring-slate-400/20 font-bold`.

---

## 4. Listes, Tableaux & Adaptabilité Mobile

Toute liste de données (factures, devis, clients, paiements) doit être bivalente :
1. **Desktop (`hidden md:block`)** :
   - `table` avec en-têtes `bg-slate-50/75 border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider py-3 px-4`.
   - Lignes avec survol doux `hover:bg-rose-50/20 transition-colors`.
2. **Mobile (`md:hidden`)** :
   - Cartes individuelles empilées : `p-4 rounded-xl bg-slate-50/60 border border-slate-200/80 space-y-3 shadow-2xs`.
3. **Trio d'actions rapides obligatoire** :
   - 🟢 **WhatsApp** : `p-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 shadow-2xs`.
   - ✏️ **Modifier** : `p-1.5 rounded-lg bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-[#701127] border border-slate-200/80 shadow-2xs`.
   - 👁️ **Détails & PDF** : `px-2.5 py-1.5 rounded-lg bg-[#701127] hover:bg-[#570c1d] text-white text-xs font-semibold flex items-center gap-1 shadow-xs`.

---

## 5. Formats Comptables & Dates

1. **Montants** :
   - Toujours formatés via `formatFcfa(montant)` ([money.ts](file:///c:/Users/andre/Documents/invoice_test/src/lib/money.ts)) avec espace insécable `\u00A0` et suffixe `FCFA`.
   - Calculs financiers stricts sans flottants (BigInt ou entiers mineurs) selon [calc.ts](file:///c:/Users/andre/Documents/invoice_test/src/lib/documents/calc.ts).
   - Mentions légales certifiées en lettres via `formatAmountInWordsLegal(montant)`.
2. **Dates** :
   - Toujours au format `JJ/MM/AAAA` (jour/mois/année) via `formatDate(date)` ([dates.ts](file:///c:/Users/andre/Documents/invoice_test/src/lib/dates.ts)).
