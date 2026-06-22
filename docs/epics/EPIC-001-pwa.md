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

**Statut** : ✅ Fait (à valider en DevTools)  
**Effort** : ~30 min  
**Dépendance** : STORY-001-1

**Description**  
`vite-plugin-pwa` configuré avec workbox minimaliste.

**Critères d'acceptation**

- [x] `vite-plugin-pwa` installé et configuré dans `vite.config.ts`
- [ ] SW enregistré sans erreur dans DevTools → Application → Service Workers _(à vérifier sur build)_
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

**Statut** : ⬜ À faire  
**Dépendance** : STORY-001-1, STORY-001-2

**Description**  
Tester l'installation sur au moins un device iOS et un Android.

**Checklist iOS (Safari)**

- [ ] Ouvrir l'URL déployée dans Safari
- [ ] Menu Partager → "Sur l'écran d'accueil"
- [ ] L'icône affichée est l'icône ember (pas un screenshot)
- [ ] L'app s'ouvre en mode standalone (pas de barre Safari)
- [ ] Le `theme_color` orange est visible dans la barre de statut

**Checklist Android (Chrome)**

- [ ] Ouvrir l'URL déployée dans Chrome
- [ ] Le banner "Ajouter à l'écran d'accueil" apparaît (ou menu ⋮ → Installer)
- [ ] L'icône affichée est l'icône ember (pas générique)
- [ ] L'app s'ouvre en mode standalone

**Outil diagnostic**

```
Chrome DevTools → Application → Manifest → vérifier "Installability"
Lighthouse → PWA audit (score attendu ≥ 80 en V0)
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
