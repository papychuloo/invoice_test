# IziFacture (AfriFacture) 🚀

> Plateforme SaaS de facturation et de gestion commerciale moderne pour les PME, commerces, cabinets et entrepreneurs d'Afrique Francophone (Zone FCFA • UEMOA • CEMAC).

---

## ✨ Fonctionnalités Clés

- **Monnaie & Normes Régionales** :
  - Gestion exclusive en **Franc CFA (XOF / XAF)** avec formatage garanti sans décimales.
  - Calcul rigoureux de la **TVA à 18%** (norme UEMOA / CEMAC).
  - Mentions légales certifiées : NINEA, RCCM et arrêté financier en toutes lettres.
- **Facturation Moderne & Live Preview** :
  - Éditeur 50/50 avec synchronisation en temps réel du document papier A4.
  - Impression vectorielle certifiée et téléchargement de factures conformes (PDF & HTML).
  - Suivi des statuts comptables : Brouillon, Envoyée, Payée, En retard.
- **Annuaire & Suivi Clients** :
  - Fiche client complète avec géolocalisation et contact.
  - Calcul automatique du statut comptable client et chiffre d'affaires cumulé.
- **Règlements & Mobile Money** :
  - Prise en charge des règlements Wave, Orange Money et virements bancaires (RIB).
  - Partage et relances instantanées en 1 clic par WhatsApp.
- **Authentification Sécurisée & Cloud Realtime** :
  - Authentification Supabase Auth avec mot de passe fort (8 à 16 caractères).
  - Synchronisation temps réel PostgreSQL (Supabase Database & Realtime WebSocket).

---

## 🛠️ Stack Technique

- **Framework** : [Next.js 16 (App Router + Turbopack)](https://nextjs.org/)
- **UI & Rendu** : [React 19](https://react.dev/) + [Tailwind CSS v4](https://tailwindcss.com/)
- **Backend & Base de données** : [Supabase](https://supabase.com/) (Auth, PostgreSQL, Realtime)
- **Typage & Qualité** : TypeScript 5 (Strict), ESLint 9
- **Tests** : [Vitest](https://vitest.dev/)
- **Icônes** : [Lucide React](https://lucide.dev/)

---

## 🚀 Démarrage Rapide

### 1. Cloner le dépôt et installer les dépendances

```bash
git clone https://github.com/papychuloo/invoice_test.git
cd invoice_test
npm install
```

### 2. Configuration des variables d'environnement

Créer un fichier `.env.local` à la racine :

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 3. Lancer le serveur de développement

```bash
npm run dev
```

Ouvrez [http://localhost:3000](http://localhost:3000) dans votre navigateur.

---

## 🧪 Tests & Qualité de Code

```bash
# Vérification des types TypeScript
npm run typecheck

# Analyse statique du code (ESLint 9)
npm run lint

# Lancer la suite de tests unitaires Vitest
npm test

# Compiler pour la production
npm run build
```

---

## 📄 Licence

Propriété de l'auteur. Tous droits réservés.
