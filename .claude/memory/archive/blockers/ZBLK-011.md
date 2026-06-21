---
id: ZBLK-011
type: blocker
date: 2026-06-21
tags: [react, biome, typescript, keyboard-event, namespace, named-imports, auto-revert]
---

# ZBLK-011 — `React.KeyboardEvent<T>` sans namespace React → Biome revert

| Friction | Cause réelle | Solution | Statut |
| --- | --- | --- | --- |
| Write d'un composant avec `React.KeyboardEvent<HTMLInputElement>` → erreur TS → hook Biome revert du fichier entier | Namespace `React` non importé dans le projet (named imports uniquement). `React.KeyboardEvent` exige le namespace. | Structural typing `(e: { key: string })` — duck-typed par TS, 0 import supplémentaire | résolu |

## Références

- [LRN-008](../../learnings/LRN-008.md) — pattern structural typing event handler
