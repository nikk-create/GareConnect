# GareConnect Bénin

Migration du projet Base44 vers React/Vite + Supabase + Netlify, prête pour une mise en vente/démo.

## Installation

```bash
npm install
cp .env.example .env   # renseigner VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY
npm run dev
```

## Base de données

1. Crée un projet Supabase.
2. Exécute `supabase/schema.sql` dans le SQL editor (tables + RLS + fonction `increment_places`).
3. (Optionnel, pour plus tard) Déploie la fonction Edge : `supabase functions deploy notifier-incident-resolu`.
4. Active le provider Google dans Authentication > Providers si tu veux le login Google.

## État actuel — prêt pour la vente

✅ Branding réel appliqué (logo, favicon, PWA manifest, couleurs)
✅ QR code réel généré sur chaque ticket (lib `qrcode`)
✅ Export PDF du ticket fonctionnel (jspdf + html2canvas)
✅ Incrément des places atomique côté base (plus de perte de place en cas de double vente simultanée)
✅ RLS ticket : le créateur peut corriger son propre ticket, pas seulement l'admin
✅ Carte et Stats chargées à la demande (lazy loading) pour un premier chargement plus rapide
✅ App installable (PWA) — "Ajouter à l'écran d'accueil"

⏳ Volontairement non branché : envoi SMS réel (Orange/MTN API). Les "Alertes" restent un
   journal interne fonctionnel (visible dans l'app), mais n'envoient pas encore de vrai SMS.
   À brancher plus tard sans rien casser — c'est déjà la seule pièce manquante.

## Ce qui a changé vs Base44

- `base44Client.js` → `src/api/supabaseClient.js`
- `entities.X.list/filter/create/...` → `src/api/entities.js` (même syntaxe, tape sur Supabase)
- Auth Base44 → Supabase Auth (email/password + Google OAuth)
- Entité `User` → table `profiles` liée à `auth.users` (trigger auto à l'inscription)
- Fonction `NotifierIncidentRésolu` → Edge Function Deno équivalente (prête, pas encore branchée sur un vrai SMS)
