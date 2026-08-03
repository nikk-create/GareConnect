# GareConnect Bénin

Reproduction fidèle du design/code base44 (thème sombre Outfit, glass/glow, teal/orange/sky),
migré vers React/Vite + Supabase + Netlify.

## Installation

```bash
npm install
cp .env.example .env   # renseigner VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY
npm run dev
```

## Base de données

1. Crée un projet Supabase.
2. SQL Editor → exécute `supabase/schema.sql` (tables, RLS, trigger profils, fonction `increment_places`).
3. Authentication → Providers → active Email + Google si besoin.
4. **Important pour l'inscription par code OTP** (utilisée dans `Register.jsx`) :
   Authentication → Emails → configure le template de confirmation en mode "Email OTP"
   (code à 6 chiffres) plutôt que "Magic Link", sinon `verifyOtp` échouera.
5. Déploie la fonction Edge : `supabase functions deploy notifyIncidentResolved`
   (nom exact attendu par `base44.functions.invoke('notifyIncidentResolved', ...)`).

## Architecture — comment le code base44 a été préservé

Le point clé de cette migration : **`src/api/base44Client.js`** reproduit exactement la même
API que le SDK base44 (`entities.X.list/create/update/delete`, `auth.me/login.../logout`,
`functions.invoke`) mais tape sur Supabase en dessous. Résultat : toutes les pages et
composants ci-dessous sont repris **tels quels** de ton code base44 d'origine, sans réécriture :

- `src/pages/*.jsx` — Accueil, Alertes, Carte, Departs, GestionVehicules, Incidents,
  ListePassagers, Login, Profil, Register, ResetPassword, Stats, TicketPage, ForgotPassword
- `src/components/gare/*.jsx` — Header, BottomNav, BottomSheet, VoyageCard, MetricCard, StatusBadge
- `src/components/ui/*.jsx` — sheet, drawer, dialog, dropdown-menu, avatar, skeleton, sonner (verbatim)
- `src/index.css`, `tailwind.config.js`, `components.json` — repris à l'identique

Seuls quelques composants ont dû être reconstruits car leur code n'était pas fourni
(mais leur signature d'usage a été respectée à partir de ce qui les appelle) :
`ContactFamilleList`, `TicketPreview`, `SmsBubble`, `RouteOptimizer`, `ToastContainer`,
`AppLayout`, `NouveauDepartSheet`, `DetailVoyageSheet`, `IncidentSheet`, `SyncQueueSheet`,
`AuthLayout`, `GoogleIcon`, `ProtectedRoute`.

## Différences techniques notables vs Base44

- `created_date` (et non `created_at`) est le nom des colonnes horodatage dans Supabase,
  pour matcher le tri `'-created_date'` utilisé partout dans le code.
- `chauffeur_attitré` (avec l'accent, entre guillemets dans le SQL) est repris tel quel.
- L'inscription par OTP (`Register.jsx`) suppose que Supabase Auth est configuré en mode
  "Email OTP" (voir étape 4 ci-dessus).
- `ResetPassword.jsx` : Supabase gère la session de récupération via le hash de l'URL
  (pas via `?token=`), donc le champ `resetToken` n'est plus réellement utilisé côté API.

## Logo & branding

Le logo fourni est intégré comme favicon, icônes PWA (192/512/180px) et sur l'écran de connexion.
