---
id: ZBLK-006
type: blocker
date: 2026-06-20
tags: [vite, typescript, css-import, vite-env, build]
---

# ZBLK-006 — Build error `Cannot find module './index.css'`

| Friction | Cause réelle | Solution | Statut |
| --- | --- | --- | --- |
| `pnpm build` échoue avec TS2307 sur le module CSS | `src/vite-env.d.ts` absent — Vite le génère via scaffolding, projet créé manuellement | Créer `src/vite-env.d.ts` avec `/// <reference types="vite/client" />` | résolu |

## Références

- voir aussi GLRN-122
