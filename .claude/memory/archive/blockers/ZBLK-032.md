---
id: ZBLK-032
type: blocker
date: 2026-06-24
tags: [posthog, dashboard, layout, headers, text-tile, two-column, w6]
---

# ZBLK-032 — Après `two_column`, headers texte (w=6) partagent une ligne avec insights

| Friction                                                                                                                                                                                                                                                     | Cause réelle                                                                                                                                                         | Solution                                                                                                                                                                                                                                            | Statut |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------ |
| Après `dashboard-reorder-tiles` avec `two_column`, les 6 headers de section (tiles texte) occupaient seulement la moitié de la largeur (w=6) et partageaient leur ligne avec le premier insight de leur section — aucune séparation visuelle entre sections. | `two_column` met TOUTES les tiles à w=6 sans exception — les tiles texte ne sont pas traitées différemment. PostHog les aligne donc 2 par ligne, comme les insights. | `dashboard-update-text-tile` avec `layouts: {sm: {w: 12, h: 2}}` × 6 en parallèle sur chaque header, puis `dashboard-reorder-tiles` avec `layout: preserve`. PostHog recalcule les positions Y en respectant les largeurs actuelles de chaque tile. | résolu |

## Références

- [BDR-054](../../decisions/BDR-054.md) — décision layout headers w=12
- voir aussi GLRN-148 — pattern complet layout mixte
