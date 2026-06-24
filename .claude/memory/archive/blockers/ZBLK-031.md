---
id: ZBLK-031
type: blocker
date: 2026-06-24
tags: [posthog, dashboard, layout, tiles, grid, reorder, two-column]
---

# ZBLK-031 — Dashboard PostHog V2 : toutes tiles avec `layouts` vides = pas de grille

| Friction                                                                                                                                      | Cause réelle                                                                                                                                                                                                          | Solution                                                                                                                                                                                              | Statut |
| --------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------ |
| 30 tiles du dashboard "ifecho V2 — Comportement utilisateur" (ID 769673) empilées sans grille visible — toutes en position invalide ou (0,0). | `layouts: {}` vide par défaut quand les tiles sont créées sans position explicite (via MCP `insight-to-dashboard` ou copie entre dashboards). PostHog ne calcule pas les positions automatiquement sans intervention. | `dashboard-reorder-tiles` avec `layout: two_column` calcule les positions `(x, y, w, h)` explicites pour toutes les tiles en une seule opération. À lancer une seule fois pour initialiser la grille. | résolu |

## Références

- voir aussi GLRN-148 — layout mixte post-reorder (étape suivante après two_column)
