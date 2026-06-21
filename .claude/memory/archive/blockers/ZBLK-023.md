---
id: ZBLK-023
type: blocker
date: 2026-06-21
tags: [eslint, rtk, version-conflict, lint, workaround, typescript]
---

# ZBLK-023 — ESLint version conflict : RTK global 9.39.4 vs projet 9.9.0

| Friction                                                                 | Cause réelle                                                                                                                                     | Solution                                                                                  | Statut |
| ------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------- | ------ |
| `rtk pnpm lint` → TypeError JSON parse dans `no-unused-expressions` rule | RTK utilise le ESLint global installé npm (v9.39.4) au lieu du ESLint local du projet (v9.9.0) — version mismatch avec @typescript-eslint plugin | Utiliser `node_modules/.bin/tsc --noEmit` pour les vérifications TypeScript en workaround | résolu |
