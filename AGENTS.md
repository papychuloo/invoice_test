<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Règle Universelle de Cohérence UI & Design System (Toutes les pages)

Toutes les pages du SaaS (Factures, Devis, Clients, Produits & Services, Dépenses, Paiements, Rapports, Paramètres) DOIVENT suivre rigoureusement les mêmes composants et styles que la page Dashboard :

1. **Layout & Shell** :
   - Fond global `#F8F9FB` (`bg-[#F8F9FB]`).
   - Sidebar `AppSidebar` à gauche (fixe sur desktop `w-64`, tiroir sur mobile).
   - Bandeau supérieur bordeaux `HeaderBanner` avec menu mobile, sélecteur pays/devise, salutation serif italique et recherche en direct.
   - Conteneur de page : `max-w-7xl w-full mx-auto p-3.5 sm:p-6 lg:p-8 space-y-6`.
   - Animations au scroll : `animate-fade-in-up` avec échelonnement (`delay-100`, `delay-200`, `delay-300`).

2. **Cartes & Badges** :
   - Cartes : `bg-white rounded-2xl border border-slate-200/70 shadow-xs hover:shadow-md transition-all`.
   - Badges de statuts (Bordures épaisses contrastées `border-2`) :
     - Payée : `border-2 border-emerald-500 bg-emerald-50/90 text-emerald-900 ring-2 ring-emerald-500/20 font-bold`.
     - Envoyée : `border-2 border-amber-500 bg-amber-50/90 text-amber-900 ring-2 ring-amber-500/20 font-bold`.
     - En retard : `border-2 border-rose-500 bg-rose-50/90 text-rose-900 ring-2 ring-rose-500/20 font-bold`.
     - Brouillon : `border-2 border-slate-400 bg-slate-100/90 text-slate-800 ring-2 ring-slate-400/20 font-bold`.

3. **Tableaux & Cartes Mobiles** :
   - Desktop : `table` avec en-tête `bg-slate-50/75 border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider py-3 px-4`.
   - Mobile : cartes empilées `p-4 rounded-xl bg-slate-50/60 border border-slate-200/80 space-y-3 shadow-2xs`.
   - Trio d'actions obligatoires : WhatsApp (vert émeraude), Modifier (Crayon `Pencil`), Détails & Téléchargement PDF (Œil `Eye`).

4. **Monnaie & Dates** :
   - Montants : obligatoirement en FCFA avec espace insécable `\u00A0` via `formatFcfa(amount)`.
   - Dates : obligatoirement au format `jour/mois/année` (`JJ/MM/AAAA`) via `formatDate(date)`.
