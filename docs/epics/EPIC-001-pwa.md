# EPIC-001 — PWA : Installabilité mobile

> Priorité : 🔴 BLOQUANT V0
> Objectif : L'app peut être ajoutée à l'écran d'accueil iOS et Android avec une vraie icône.

---

## Contexte

Le `manifest.json` est en place et lié dans `index.html`. Il référence deux icônes PNG
(`icon-192.png`, `icon-512.png`) qui **n'existent pas encore** dans `public/`.

Sans ces fichiers :

- Android Chrome : pas de prompt "Ajouter à l'écran d'accueil" (critère obligatoire)
- iOS Safari : l'icône affichée au homescreen est un screenshot générique

Pas de Service Worker → Android ne propose pas l'installation automatique (le banner A2HS
nécessite techniquement un SW enregistré). iOS fonctionne sans SW pour l'ajout manuel.

---

## Stories

### STORY-001-1 — Générer les icônes PNG

**Statut** : ✅ Fait  
**Effort** : ~30 min

**Description**  
Génération via `@vite-pwa/assets-generator` depuis `public/logo.svg`
(ThermometerSun Lucide, fond `#f97316`).

**Critères d'acceptation**

- [x] `public/pwa-192x192.png` existe, dimensions 192×192
- [x] `public/pwa-512x512.png` existe, dimensions 512×512
- [x] `public/maskable-icon-512x512.png` existe avec padding 10% maskable
- [x] `public/apple-touch-icon-180x180.png` existe pour iOS
- [x] `manifest.json` pointe correctement sur ces fichiers
- [x] `purpose: "any"` et `purpose: "maskable"` séparés dans le manifest (pas `"any maskable"`)
- [x] Pas de 404 en `pnpm dev`

**Notes**

- Icônes générées avec `pnpm generate-pwa-assets` via `pwa-assets.config.ts`
- Noms : `pwa-64x64.png`, `pwa-192x192.png`, `pwa-512x512.png`, `maskable-icon-512x512.png`

---

### STORY-001-2 — Ajouter un Service Worker minimal

**Statut** : ✅ Fait  
**Effort** : ~30 min  
**Dépendance** : STORY-001-1

**Description**  
`vite-plugin-pwa` configuré avec workbox minimaliste.

**Critères d'acceptation**

- [x] `vite-plugin-pwa` installé et configuré dans `vite.config.ts`
- [x] SW enregistré sans erreur dans DevTools → Application → Service Workers (`#7430 activated and running` via `pnpm preview`)
- [x] Pas de régression build (`pnpm build` sans erreur) — `dist/sw.js` généré
- [x] Le SW n'intercepte pas les appels Open-Meteo (`runtimeCaching: []`)

**Config en place**

```ts
VitePWA({
  registerType: "autoUpdate",
  manifest: false, // on garde notre manifest.json
  workbox: {
    globPatterns: ["**/*.{js,css,html,svg}"],
    runtimeCaching: [], // aucun cache réseau — simple en V0
  },
});
```

---

### STORY-001-3 — Valider l'installation sur mobile

**Statut** : ✅ Terminé (Android ✅ — iOS ✅ validé le 2026-06-23)  
**Dépendance** : STORY-001-1, STORY-001-2

**Description**  
Tester l'installation sur au moins un device iOS et un Android.

**⚠️ Prérequis Vercel** : les preview deployments sont protégés par Vercel Auth — le `manifest.json` retourne 401, ce qui bloque l'installabilité PWA. Désactiver Vercel Authentication dans Settings → Deployment Protection avant de tester, ou tester sur la branche `main` (prod).

**Checklist iOS (Safari)**

- [x] Ouvrir l'URL déployée dans Safari
- [x] Menu Partager → "Sur l'écran d'accueil"
- [x] L'icône affichée est l'icône ember (pas un screenshot)
- [x] L'app s'ouvre en mode standalone (pas de barre Safari)
- [x] Le `theme_color` orange est visible dans la barre de statut

**Checklist Android (Chrome)**

- [x] Ouvrir l'URL déployée dans Chrome
- [x] Le banner "Ajouter à l'écran d'accueil" apparaît (ou menu ⋮ → Installer)
- [x] L'icône affichée est l'icône ember (pas générique)
- [x] L'app s'ouvre en mode standalone

**Outil diagnostic**

```
Chrome DevTools → Application → Manifest → vérifier "Installability"
Lighthouse → pnpm lighthouse (script custom node scripts/lighthouse-audit.mjs)
```

---

### STORY-001-4 — Bouton d'installation in-app _(ajout)_

**Statut** : ✅ Fait  
**Effort** : ~1h

**Description**  
Bouton discret dans le header permettant à l'utilisateur d'installer l'app même s'il a ignoré
le prompt système initial.

**Ce qui a été fait**

- `src/hooks/useInstallPrompt.ts` — capture `beforeinstallprompt`, détecte iOS et mode standalone
- `src/components/InstallButton/index.tsx` — bouton conditionnel dans le header
  - Android/Chrome : déclenche directement `deferredPrompt.prompt()`
  - iOS Safari : affiche un tooltip avec instructions (icône Share → "Sur l'écran d'accueil")
  - Invisible si déjà installé (`display-mode: standalone`) ou navigateur non-supporté

**Critères d'acceptation**

- [x] Le bouton n'apparaît pas si l'app est déjà installée
- [x] Android : le bouton déclenche le prompt natif Chrome
- [x] iOS : le bouton affiche les instructions avec icône Share bleue
- [x] Le bouton disparaît automatiquement après installation (`appinstalled` event)

---

### STORY-001-5 — Optimisation Lighthouse _(ajout)_

**Statut** : ✅ Fait  
**Effort** : ~2h

**Description**  
Script d'audit Lighthouse automatisé + corrections des échecs d'accessibilité, SEO et qualité.

**Ce qui a été fait**

- `scripts/lighthouse-audit.mjs` — script node (chrome-launcher + lighthouse API, évite les problèmes EPERM Windows)
- `pnpm lighthouse` — build → preview → audit desktop + mobile → rapport JSON dans `docs/lighthouse/`
- `public/manifest.json` — ajout du champ `"id": "/"`
- `public/robots.txt` — créé pour SEO 100/100
- `public/llms.txt` — format llmstxt.org (H1 + blockquote + liens markdown) pour agentic-browsing 100/100
- `src/index.css` — `--color-verdict-bad` : `#ef4444` → `#b91c1c` (contraste WCAG AA 5.8:1)
- `src/components/RecommendCard/components/ThermalComparison.tsx` — aria-label bouton température fixé (WCAG 2.5.3)
- `src/components/InstallButton/index.tsx` — `text-muted-foreground` → `text-stone-600` (contraste 5.5:1)
- `src/components/LocationSearch/index.tsx` — `text-ember` 10px → `text-heat-700` (contraste 5.17:1), `text-muted-foreground` → `text-stone-600`, suppression aria-label mismatch
- `src/App.tsx` — tap target footer `@baptistelechat` : `inline-block py-1` ajouté (WCAG 2.5.5)
- `index.html` — preconnect Open-Meteo avec attribut `crossorigin`

**Scores finaux (audit 2026-06-22)**

| Catégorie        | Desktop | Mobile  |
| ---------------- | ------- | ------- |
| Performance      | 85      | 99      |
| Accessibility    | **100** | **100** |
| Best Practices   | 92      | 92      |
| SEO              | **100** | **100** |
| Agentic-Browsing | **100** | **100** |

**Échecs résiduels acceptés (by-design)**

- `geolocation-on-start` — `detectLocation()` sur mount est le cœur de l'UX
- `errors-in-console` (vibrate) — la lib `web-haptics` teste `navigator.vibrate` avant geste utilisateur
- `render-blocking` (registerSW.js, CSS) — généré par vite-plugin-pwa, impact minimal (0.13 kB)
- `unused-javascript` — bundle 384 kB JS (framer-motion + shadcn) ; code splitting hors scope V0
