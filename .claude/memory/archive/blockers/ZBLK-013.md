---
id: ZBLK-013
type: blocker
date: 2026-06-21
tags: [rtk, lint, cache, stale, typescript, ts6133]
---

# ZBLK-013 — RTK stale cache → fausses erreurs lint

| Friction                                                                                               | Cause réelle                                                                                          | Solution                                                                   | Statut |
| ------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------- | ------ |
| `startEditing` et `handleKeyDown` marqués TS6133 unused par `rtk pnpm lint` alors qu'ils sont utilisés | RTK proxy met en cache les sorties lint — après modification de fichiers, le cache n'est pas invalidé | Lancer `pnpm lint` directement (sans proxy RTK). Les erreurs disparaissent | résolu |
