---
id: ZBLK-024
type: blocker
date: 2026-06-21
tags: [pnpm-workspace, react-doctor, yaml, hardening, silent-failure]
---

# ZBLK-024 — `pnpm-workspace.yaml settings:` ignoré par react-doctor

| Friction                                                                                                                                                                        | Cause réelle                                                                              | Solution                                                                                             | Statut |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- | ------ |
| Créé `pnpm-workspace.yaml` avec `settings: { minimumReleaseAge: 10080, trustPolicy: no-downgrade }` — react-doctor continuait à reporter 2 diagnostics `require-pnpm-hardening` | react-doctor lit les champs directement à la racine du YAML, pas sous une clé `settings:` | Réécriture du fichier avec champs racine : `minimumReleaseAge: 10080` et `trustPolicy: no-downgrade` | résolu |

## Références

- [LRN-028](../../learnings/LRN-028.md) — champs racine pnpm-workspace
