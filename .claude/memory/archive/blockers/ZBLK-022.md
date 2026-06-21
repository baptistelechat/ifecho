---
id: ZBLK-022
type: blocker
date: 2026-06-21
tags: [mobile, swipe, pointer-events, touch-action, carousel, tips-section]
---

# ZBLK-022 — Swipe horizontal mobile non fonctionnel

| Friction                                                                                                | Cause réelle                                                                                                                      | Solution                                                                                                      | Statut |
| ------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- | ------ |
| Swipe gauche/droite sur mobile ne déclenche pas la navigation du carousel — events pointer jamais reçus | Navigateur mobile intercepte les gestes horizontaux pour le scroll de page avant que `onPointerDown`/`onPointerUp` soient appelés | `[touch-action:pan-y]` appliqué sur le container + `setPointerCapture` — confirmé fonctionnel sur device réel | résolu |

## Références

- [LRN-024](../../learnings/LRN-024.md) — `touch-action: pan-y` pour swipe horizontal sans interférer le scroll vertical
- [LRN-025](../../learnings/LRN-025.md) — `setPointerCapture` pour capturer pointer events sur mobile pendant le drag
