---
id: ZBLK-015
type: blocker
date: 2026-06-21
tags: [react, hooks, rules-of-hooks, eslint, early-return]
---

# ZBLK-015 — `useRef`/`useEffect` déclarés après le return conditionnel

| Friction                                                                                       | Cause réelle                                                                                                                    | Solution                                            | Statut |
| ---------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------- | ------ |
| ESLint `react-hooks/rules-of-hooks` erreur sur `useRef` + `useEffect` dans VentilationTimeline | Les hooks étaient déclarés après `if (scores.length === 0) return null` — React interdit tout hook après un return conditionnel | Remonter tous les hooks avant le guard conditionnel | résolu |

## Références

- [LRN-015](../../learnings/LRN-015.md) — pattern extrait
