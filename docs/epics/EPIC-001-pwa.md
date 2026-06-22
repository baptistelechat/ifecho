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

**Statut** : ⬜ À faire  
**Effort** : ~30 min

**Description**  
Générer `public/icon-192.png` et `public/icon-512.png` depuis le `favicon.svg` existant
(ThermometerSun Lucide sur fond `#fff7ed` avec cercle ember `#f97316`).

**Critères d'acceptation**

- [ ] `public/icon-192.png` existe, dimensions 192×192, fond `#fff7ed`, icône ember centrée
- [ ] `public/icon-512.png` existe, dimensions 512×512, même charte
- [ ] `manifest.json` pointe correctement sur ces deux fichiers (déjà le cas)
- [ ] Pas de 404 sur `/icon-192.png` et `/icon-512.png` en `pnpm dev`

**Options de génération**

1. **Hugging Face Space** (ImageMagick / Rsvg) — convertir le SVG en PNG aux deux tailles
2. **Script Node** — `sharp` ou `svgexport` en local
3. **Outil en ligne** — Favicon.io / RealFaviconGenerator

**Notes**

- Le champ `"purpose": "any maskable"` dans le manifest est trop permissif — si l'icône n'a pas
  de zone de sécurité maskable, split en deux entrées :
  ```json
  { "src": "/icon-192.png", "sizes": "192x192", "type": "image/png", "purpose": "any" },
  { "src": "/icon-512.png", "sizes": "512x512", "type": "image/png", "purpose": "any" }
  ```
  Ou garder `maskable` et ajouter un padding ≥ 10% dans l'icône.

---

### STORY-001-2 — Ajouter un Service Worker minimal

**Statut** : ⬜ À faire  
**Effort** : ~30 min  
**Dépendance** : STORY-001-1

**Description**  
Ajouter `vite-plugin-pwa` avec une config minimaliste pour enregistrer un SW et
déclencher le prompt d'installation Android. Pas de cache offline ambitieux en V0 —
juste le strict nécessaire pour que Chrome considère l'app comme "installable".

**Critères d'acceptation**

- [ ] `vite-plugin-pwa` installé et configuré dans `vite.config.ts`
- [ ] SW enregistré sans erreur dans la DevTools → Application → Service Workers
- [ ] Pas de régression build (`pnpm build` sans erreur)
- [ ] Le SW n'intercepte pas les appels Open-Meteo (pas de cache réseau agressif)

**Config recommandée**

```ts
// vite.config.ts
import { VitePWA } from "vite-plugin-pwa";

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
- [ ] L'icône affichée est `icon-512.png` (pas un screenshot)
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
