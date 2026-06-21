---
id: ZBLK-017
type: blocker
date: 2026-06-21
tags: [tailwind, css-vars, theming, border, warm-theme, artifact]
---

# ZBLK-017 — Ligne jaune entre les barres (`bg-border` warm theme)

| Friction                                                                                                 | Cause réelle                                                                                                               | Solution                                                                                               | Statut |
| -------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ | ------ |
| Ligne jaune visible entre les barres positives et négatives dans la VentilationTimeline bidirectionnelle | CSS var `--border` dans le thème warm-orange tire vers l'amber — `div h-px bg-border` entre barres claires = ligne colorée | Supprimer la div séparatrice — la baseline est rendue par la juxtaposition des zones positive/négative | résolu |

## Références

- [LRN-013](../../learnings/LRN-013.md) — pattern extrait
