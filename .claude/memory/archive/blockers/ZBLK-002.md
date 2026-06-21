---
id: ZBLK-002
type: blocker
date: 2026-06-21
tags: [api-adresse, reverse, geolocation, bug, empty-features]
---

# ZBLK-002 — "Votre position" affiché sans nom de ville après GPS

| Friction                                                             | Cause réelle                                                                                                                           | Solution                                                                | Statut |
| -------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------- | ------ |
| Label affichait "Votre position" sans commune après localisation GPS | `/reverse/?type=municipality` retourne `features: []` car les coordonnées GPS ne tombent jamais exactement sur un centroïde de commune | Retirer `&type=municipality` de l'URL `/reverse/` dans `useLocation.ts` | résolu |

## Références

- [BDR-012](../../decisions/BDR-012.md) — ajout de `source` pour distinguer GPS vs recherche après ce bug
