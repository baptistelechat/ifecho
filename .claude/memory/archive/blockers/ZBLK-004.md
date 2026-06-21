---
id: ZBLK-004
type: blocker
date: 2026-06-20
tags: [vite, pnpm, scaffolding, interactive-prompt, manual-setup]
---

# ZBLK-004 — `pnpm create vite` bloqué sur prompt interactif

| Friction | Cause réelle | Solution | Statut |
| --- | --- | --- | --- |
| `pnpm create vite` refuse de démarrer — prompt interactif bloqué, aucune sortie | CWD non vide : `.git` et `CLAUDE.md` déjà présents. Le scaffolding Vite exige un dossier vide. | Création manuelle de tous les fichiers : `package.json`, `vite.config.ts`, `tsconfig*.json`, `index.html`, `src/main.tsx`, `src/App.tsx`, `src/index.css` | résolu |

## Références

- voir aussi GLRN-120
