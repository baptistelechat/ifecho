---
id: ZBLK-028
type: blocker
date: 2026-06-22
tags: [vite, hmr, rename, cache, enoent, node_modules]
---

# ZBLK-028 — ENOENT crash après rename `favicon.svg` → `logo.svg` en session HMR active

| Friction                                                                                                                                  | Cause réelle                                                                                                                                                      | Solution                                                   | Statut |
| ----------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------- | ------ |
| App inaccessible après rename, erreur `ENOENT: no such file or directory 'public/favicon.svg'` dans `vite:css-analysis` / `src/index.css` | Module graph Vite garde l'ancien chemin en cache lors d'un rename pendant une session HMR active — aucune référence au fichier dans le code source n'est en cause | Supprimer `node_modules/.vite/` + redémarrer le dev server | résolu |

## Références

- [LRN-038](../../learnings/LRN-038.md) — pattern général Vite HMR stale cache
