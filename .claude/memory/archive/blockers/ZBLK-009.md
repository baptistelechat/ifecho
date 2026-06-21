---
id: ZBLK-009
type: blocker
date: 2026-06-20
tags: [typescript, react, ts6133, props, cascade, build, refactoring]
---

# ZBLK-009 — Cascade TS6133 après retrait de `bestHour` de IdealSlots

| Friction | Cause réelle | Solution | Statut |
| --- | --- | --- | --- |
| Build fail : TS6133 sur plusieurs props dans RecommendCard et App.tsx | Retrait partiel — prop supprimée de l'interface IdealSlots mais encore déclarée/passée dans les parents | Retrait simultané dans IdealSlots + RecommendCard + App.tsx | résolu |

## Références

- voir aussi GLRN-125
