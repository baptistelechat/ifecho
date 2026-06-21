---
id: ZBLK-014
type: blocker
date: 2026-06-21
tags: [powershell, encoding, accents, python, sandbox, edit-tool, windows]
---

# ZBLK-014 — Écriture fichier accentué multi-tentatives

| Friction                                                                    | Cause réelle                                                                                                              | Solution                                                                          | Statut |
| --------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------- | ------ |
| 3 tentatives pour écrire `ThermalComparison.tsx` avec accents et symboles ° | Python via PowerShell bloqué sandbox (Remove-Item sur `$env:TEMP`). PowerShell `@'...'@` perd silencieusement les accents | Write avec substituts ASCII + Edit `replace_all: true` séquentiels pour restaurer | résolu |

## Références

- [LRN-010](../../learnings/LRN-010.md) — Pattern extrait de ce blocker
