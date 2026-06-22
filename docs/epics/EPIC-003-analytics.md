# EPIC-003 — Analytics : PostHog

> Priorité : 🟡 V0 — optionnel mais précieux avant la canicule
> Objectif : Comprendre comment les utilisateurs utilisent l'app dès le premier jour de canicule.

---

## Contexte

PostHog est un outil d'analytics open-source (cloud gratuit jusqu'à 1 M events/mois).
Pour ifecho, l'enjeu n'est pas juste de compter les visites — c'est de comprendre :

- Est-ce que les gens savent quelle température mettre ?
- Est-ce que le CalendarLink est utilisé ?
- Quelle commune est la plus recherchée pendant la canicule ?
- Est-ce que le carousel TipsSection est vu jusqu'au bout ?

Stack d'intégration : `posthog-js` dans une SPA Vite + React, mode **sans cookie**
(`persistence: 'memory'`) pour rester conforme RGPD sans bandeau en V0.

---

## Prérequis — MCP PostHog

Le MCP PostHog officiel permet d'interagir avec PostHog directement depuis Claude Code :
créer des insights, exécuter des requêtes HogQL, valider les events en live, déployer des
feature flags. La story 003-4 (dashboard) sera entièrement exécutée via le MCP.

**Installation (à faire avant de démarrer cette epic)**

```bash
# Option 1 — Plugin Claude Code (recommandée)
claude plugin install posthog
# Puis taper /mcp dans Claude Code et s'authentifier via le navigateur

# Option 2 — Wizard PostHog
npx @posthog/wizard mcp add

# Option 3 — Config HTTP manuelle
claude mcp add --transport http posthog https://mcp.posthog.com/mcp -s user
# Puis /mcp pour le login navigateur
```

**Capabilities disponibles une fois installé**

| Catégorie        | Exemples                                                 |
| ---------------- | -------------------------------------------------------- |
| Insights & HogQL | Requêter les events live, valider les props              |
| Feature flags    | Créer, activer, cibler des flags                         |
| Expériences      | A/B tests                                                |
| Erreurs          | Top erreurs, stack traces, marquage résolu               |
| Dashboard        | Créer insights, configurer le layout                     |
| Slash commands   | `/posthog:flags`, `/posthog:insights`, `/posthog:errors` |

Sources : [PostHog MCP — Claude Code](https://posthog.com/docs/model-context-protocol/claude-code)
• [GitHub officiel PostHog/mcp](https://github.com/posthog/mcp)

---

## Stories

### STORY-003-1 — Installer et initialiser PostHog

**Statut** : ✅ Terminé
**Effort** : 30 min

**Description**
Installer `posthog-js`, créer un projet PostHog Cloud, et initialiser le SDK dans `main.tsx`.
Utiliser `persistence: 'memory'` pour éviter tout cookie → pas de bannière de consentement
requise (aucune donnée personnelle stockée côté client).

**Critères d'acceptation**

- [x] `pnpm add posthog-js` ajouté aux dépendances
- [x] Variables d'env dans `.env.local` : `VITE_POSTHOG_KEY` et `VITE_POSTHOG_HOST`
- [x] `.env.example` mis à jour avec les placeholders
- [x] PostHog initialisé dans `main.tsx` avant le mount React
- [x] `pnpm build` propre (0 erreur TS)
- [x] En dev : les events apparaissent dans le Live Events PostHog (nécessite un projet PostHog actif)

**Config recommandée**

```ts
// main.tsx
import posthog from "posthog-js";

if (import.meta.env.VITE_POSTHOG_KEY) {
  posthog.init(import.meta.env.VITE_POSTHOG_KEY, {
    api_host: import.meta.env.VITE_POSTHOG_HOST ?? "https://eu.i.posthog.com",
    persistence: "memory", // pas de cookie → pas de bandeau RGPD
    autocapture: false, // on contrôle manuellement
    capture_pageview: true, // juste la pageview auto
    capture_pageleave: true,
  });
}
```

**Variables d'env Vercel**

- `VITE_POSTHOG_KEY` → clé projet PostHog (format `phc_xxxxx`)
- `VITE_POSTHOG_HOST` → `https://eu.i.posthog.com` (EU pour conformité RGPD)

---

### STORY-003-2 — Hook `useAnalytics`

**Statut** : ✅ Terminé
**Dépendance** : STORY-003-1
**Effort** : 30 min

**Description**
Créer `src/hooks/useAnalytics.ts` — wrapper typé autour de `posthog.capture()` qui expose
des méthodes nommées plutôt que des strings libres. Cela évite les typos dans les noms
d'events et centralise le catalogue.

**Critères d'acceptation**

- [x] `src/hooks/useAnalytics.ts` créé
- [x] Toutes les méthodes typées (pas de `string` libre pour les event names)
- [x] Guard `if (!import.meta.env.VITE_POSTHOG_KEY) return` → no-op silencieux en local sans clé
- [x] Aucun `console.log` laissé en production

**Interface attendue**

```ts
// src/hooks/useAnalytics.ts
const useAnalytics = () => ({
  locationDetected: (props: { source: 'gps' | 'search'; department?: string }) => void,
  weatherLoaded:    (props: { city: string; bestHour: number | null; topScore: number }) => void,
  indoorTempChanged:(props: { temp: number }) => void,
  comfortChanged:   (props: { level: 'hot' | 'neutral' | 'cool' }) => void,
  calendarDownloaded:(props: { bestHour: number; city: string }) => void,
  tipNavigated:     (props: { tipId: string; direction: 'swipe-left' | 'swipe-right' | 'dot' | 'auto' }) => void,
  pwaInstallBannerShown: () => void,
})
```

---

### STORY-003-3 — Instrumenter les events

**Statut** : ✅ Terminé
**Dépendance** : STORY-003-2
**Effort** : 45 min

**Description**
Placer les appels `analytics.*` aux bons endroits dans l'app, sans polluer la logique métier.

**Catalogue d'events V0**

| Event                      | Où                                                    | Props utiles                     |
| -------------------------- | ----------------------------------------------------- | -------------------------------- |
| `location_detected`        | `useLocation` — après succès GPS ou sélection commune | `source`, `department`           |
| `weather_loaded`           | `useWeatherForecast` — après réponse Open-Meteo       | `city`, `best_hour`, `top_score` |
| `indoor_temp_changed`      | `App.tsx` — `handleTempChange`                        | `temp` (arrondi à l'entier)      |
| `comfort_changed`          | `App.tsx` — `handleComfortChange`                     | `level`                          |
| `calendar_downloaded`      | `CalendarLink` — `handleDownload`                     | `best_hour`, `city`              |
| `tip_navigated`            | `TipsSection` — `prev()` / `next()` / dot click       | `tip_id`, `direction`            |
| `pwa_install_banner_shown` | `App.tsx` — listener `beforeinstallprompt`            | —                                |

**Règles**

- Ne jamais logguer de données météo brutes (température exacte, coordonnées GPS)
- `department` uniquement (pas la commune complète) pour limiter la granularité géographique
- `temp` arrondi à l'entier — pas besoin du dixième de degré

**Critères d'acceptation**

- [ ] Les 7 events se déclenchent dans PostHog Live Events lors du smoke test (nécessite un projet PostHog actif)
- [x] Aucune donnée personnelle identifiable dans les propriétés d'event
- [x] Pas de double-fire (ex : `weather_loaded` déclenché une seule fois par fetch)

---

### STORY-003-5 — Page Politique de confidentialité

**Statut** : ✅ Terminé
**Dépendance** : STORY-003-1
**Effort** : 30 min

**Description**
PostHog étant activé avec Session Replay, Product Analytics, Web Analytics et Error Tracking,
l'app doit informer les utilisateurs des données collectées (RGPD Art. 13/14).
Créer une route `/confidentialite` minimaliste et un lien dans le footer.

**Stack**

- Route React (`/confidentialite`) dans `App.tsx` via `react-router-dom` ou page séparée
- Composant `PrivacyPage` dans `src/pages/PrivacyPage.tsx`
- Lien "Confidentialité" dans `AppFooter`

**Contenu minimal de la page**

```
Politique de confidentialité — ifecho

Données collectées
ifecho utilise PostHog (hébergé en Europe) pour améliorer l'application.
Nous collectons des événements anonymes : chargement météo, téléchargement du rappel
calendrier, navigation dans les conseils. Aucune donnée personnelle identifiable
n'est collectée.

Sessions anonymes
Nous enregistrons des sessions de navigation anonymes (Session Replay) pour comprendre
comment l'app est utilisée. Les champs de saisie sont automatiquement masqués.

Cookies
Aucun cookie n'est utilisé. Les données sont stockées uniquement en mémoire de session.

Hébergement
PostHog EU — serveurs en Europe (RGPD-compliant).
Plus d'infos : https://posthog.com/privacy
```

**Critères d'acceptation**

- [x] Route `/confidentialite` accessible dans l'app
- [x] Lien "Confidentialité" visible dans `AppFooter`
- [x] Page lisible sur mobile (même charte graphique warm)
- [x] Contenu couvre : données collectées, Session Replay, absence de cookies, hébergement EU

---

### STORY-003-4 — Dashboard PostHog minimal

**Statut** : ✅ Terminé (partage public à activer dans l'UI)
**Dépendance** : STORY-003-3
**Effort** : 20 min

**Description**
Créer des insights dans PostHog pour avoir un tableau de bord lisible le jour de la canicule.

**Dashboard créé via MCP PostHog**

- Nom : **ifecho V0** — ID : `765141`
- URL : https://eu.posthog.com/project/207198/dashboard/765141
- Tags : `ifecho`, `v0`, `analytics` — Épinglé : oui

**Filtre données de test (configuré)**

Filtre projet actif : `$host != localhost:5173` (exclut les 229 events de développement).
Configuré via `test_account_filters` + `test_account_filters_default_checked: true`.
Tous les insights ont `filterTestAccounts: true` — les données dev sont invisibles dans le dashboard.

**Insights créés et attachés au dashboard (17 au total)**

| Insight                         | Type        | short_id   | Question                                        |
| ------------------------------- | ----------- | ---------- | ----------------------------------------------- |
| Utilisateurs actifs (quotidien) | Trend DAU   | `2yzbwLRw` | Combien de personnes utilisent l'app ?          |
| Utilisateurs actifs (WAU)       | Trend WAU   | `jZJSUgUZ` | Volume hebdomadaire utilisateurs                |
| Retention — qui revient ?       | Retention   | `0GoFYtZp` | Rétention J+1 → J+14                            |
| Stickiness — fréquence          | Stickiness  | `GKuXTTAK` | Jours d'utilisation par mois                    |
| Score météo moyen               | Trend avg   | `IHXai54L` | `top_score` moyen journalier                    |
| Température intérieure moyenne  | Trend avg   | `LuocUOez` | Température saisie moyenne                      |
| GPS vs recherche manuelle       | Trend/Pie   | `Wri4aI8l` | Source de localisation (`gps` vs `search`)      |
| Top départements                | Trend/Table | `GcWS1APY` | Régions les plus touchées                       |
| Top villes                      | Trend/Table | `yJNCWGTC` | Villes les plus consultées                      |
| Meilleure heure recommandée     | Trend/Table | `5qc2ZL2j` | Distribution des heures idéales                 |
| Ressenti thermique              | Trend/Bar   | `gwjqMjmt` | `hot` / `neutral` / `cool`                      |
| Répartition confort thermique   | Trend/Pie   | `2xJZJKHX` | Répartition hot / neutral / cool                |
| Tips les plus consultés         | Trend/Table | `QgMVdjVL` | Classement par `tip_id`                         |
| Navigation dans les tips        | Trend/Pie   | `sNkWWf1j` | swipe vs dot vs auto                            |
| Prompt installation PWA         | Trend total | `QCuZ1Vk8` | Affichage du prompt d'installation              |
| Funnel engagement complet       | Funnel      | `tnvjNDUF` | 4 étapes : location → weather → temp → calendar |
| Funnel téléchargement rappel    | Funnel      | `jI7QtDQ3` | `weather_loaded` → `calendar_downloaded`        |

**Critères d'acceptation**

- [x] Dashboard créé dans PostHog (nom : "ifecho V0")
- [x] Les 17 insights sont configurés avec `filterTestAccounts: true`
- [x] Filtre `$host != localhost:5173` configuré au niveau projet
- [x] Partage du dashboard en lecture seule possible (lien public)
  > ⚠️ Action manuelle requise : l'endpoint de partage public n'est pas exposé dans le MCP.
  > Dans l'UI PostHog → ouvrir le dashboard → bouton **Share** → activer **Public sharing** → copier le lien.
