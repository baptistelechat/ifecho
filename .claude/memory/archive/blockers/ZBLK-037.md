---
id: ZBLK-037
type: blocker
date: 2026-06-25
tags: [url, hallucination, atom-feed, meteofrance, research, verification]
---

# ZBLK-037 — URL flux Atom Météo-France inventée (n'existe pas)

| Friction                                                                                               | Cause réelle                                                                   | Solution                                                                                                     | Statut |
| ------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------ | ------ |
| URL `feeds.vigilance.meteofrance.fr/...` proposée par l'agent comme source de données MF — URL factice | Hallucination agent : URL vraisemblable extrapolée sans vérification préalable | Research fork lancé → URL confirmée inexistante → OpenDataSoft identifié comme source officielle alternative | résolu |

## Références

- [BDR-061](../../decisions/BDR-061.md) — Source vigilance → ODS
- [LRN-055](../../learnings/LRN-055.md) — Pattern URL hallucination → vérifier avant de proposer
- [ZBLK-035](ZBLK-035.md) — Portail MF bloqué (blocker parallèle sur le même problème)
