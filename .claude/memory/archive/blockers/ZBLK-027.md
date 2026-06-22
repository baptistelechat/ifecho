---
id: ZBLK-027
type: blocker
date: 2026-06-22
tags: [pwa, assets-generator, maskable, apple, background, icons]
---

# ZBLK-027 — Fond blanc sur icônes maskable/apple générées

| Friction                                                                                                          | Cause réelle                                                                                                                                | Solution                                                                                                             | Statut |
| ----------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- | ------ |
| `maskable-icon-512x512.png` et `apple-touch-icon-180x180.png` avaient un fond blanc visible sur l'écran d'accueil | `minimal2023Preset` n'a pas de couleur de fond configurée — le padding obligatoire (10% maskable, 30% apple) est rempli en blanc par défaut | Ajouter `resizeOptions: { background: "#f97316" }` dans les sections `maskable` et `apple` de `pwa-assets.config.ts` | résolu |

## Références

- [LRN-037](../../learnings/LRN-037.md) — pattern `resizeOptions.background`
- [BDR-034](../../decisions/BDR-034.md) — décision assets-generator
