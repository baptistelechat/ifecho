---
id: ZBLK-016
type: blocker
date: 2026-06-21
tags: [scroll, centering, dom, react, offsetLeft, scrollIntoView]
---

# ZBLK-016 — Timeline centrée à gauche : `offsetLeft` vs scroll container

| Friction                                                                                         | Cause réelle                                                                                                                                 | Solution                                                                 | Statut |
| ------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------ | ------ |
| VentilationTimeline centrée à gauche au lieu de l'heure courante malgré le centrage `offsetLeft` | `offsetLeft` retourne la position relative à l'`offsetParent` DOM (pas le scroll container) — un `relative` intermédiaire faussait le calcul | Remplacé par `el.scrollIntoView({ inline: 'center', block: 'nearest' })` | résolu |

## Références

- [LRN-014](../../learnings/LRN-014.md) — pattern extrait
