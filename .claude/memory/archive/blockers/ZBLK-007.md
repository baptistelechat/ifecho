---
id: ZBLK-007
type: blocker
date: 2026-06-20
tags: [vite, typescript, path, dirname, types-node, build]
---

# ZBLK-007 — Build error `Cannot find module 'path'` + `__dirname` inconnu

| Friction | Cause réelle | Solution | Statut |
| --- | --- | --- | --- |
| `vite.config.ts` utilise `path` et `__dirname` — TypeScript échoue sur les deux | `@types/node` absent du projet — Vite scaffolding l'ajoute implicitement, création manuelle non | `pnpm add -D @types/node` | résolu |
