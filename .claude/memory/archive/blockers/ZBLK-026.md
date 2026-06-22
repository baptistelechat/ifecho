---
id: ZBLK-026
type: blocker
date: 2026-06-22
tags: [pnpm, workspace, install, root, flag, pnpm-workspace]
---

# ZBLK-026 — `pnpm add` sans `-w` → `ERR_PNPM_ADDING_TO_ROOT`

| Friction                                                                                       | Cause réelle                                                                                                                                                                      | Solution                                                                           | Statut |
| ---------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- | ------ |
| `pnpm add -D vite-plugin-pwa @vite-pwa/assets-generator` échoue avec `ERR_PNPM_ADDING_TO_ROOT` | `pnpm-workspace.yaml` présent dans le projet (créé pour hardening supply-chain) — pnpm refuse d'ajouter à la racine sans flag explicite même si c'est un single-package workspace | Ajouter le flag `-w` : `pnpm add -D -w vite-plugin-pwa @vite-pwa/assets-generator` | résolu |

## Références

- [LRN-039](../../learnings/LRN-039.md) — pattern général pnpm workspace root
- [LRN-028](../../learnings/LRN-028.md) — origine du pnpm-workspace.yaml hardening
