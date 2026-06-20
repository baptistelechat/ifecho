---
id: ZBLK-009
type: blocker
date: 2026-06-20
tags: [typescript, react, ts6133, props, cascade, build, refactoring]
---

# ZBLK-009 — Cascade TS6133 après retrait de `bestHour` de IdealSlots

| Friction                                                                                                               | Cause réelle                                                                                                                      | Solution                                                                              | Statut |
| ---------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- | ------ |
| Build fail : TS6133 sur `containsBest` + `bestHour` déclarée dans `RecommendCard` + `bestHour` passée depuis `App.tsx` | Retrait partiel — prop supprimée de l'interface `IdealSlots` mais encore déclarée dans `RecommendCard` et passée depuis `App.tsx` | Retrait simultané dans `IdealSlots` + interface `RecommendCard` + call site `App.tsx` | résolu |

## Références

- voir aussi GLRN-125
