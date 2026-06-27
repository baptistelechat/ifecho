---
id: ZBLK-038
type: blocker
date: 2026-06-27
tags:
  [
    data-window,
    display,
    useVentilationScore,
    debug,
    diagnosis,
    getTimelineLength,
  ]
---

# ZBLK-038 — Fix display-only `getTimelineLength` sans effet visible

| Friction                                                                        | Cause réelle                                                                                                        | Solution                                                                                                                              | Statut |
| ------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- | ------ |
| Ajout de `getTimelineLength` n'a rien changé à l'affichage ("aucun changement") | La troncation était dans les données `useVentilationScore` (filtre J+2 `< nowHour`), pas dans `scores.slice(0, 25)` | `IdealSlots` reçoit le tableau complet ET montrait la même fin → cause upstream. Vérifier le hook source avant de toucher l'affichage | résolu |

## Références

- [LRN-062](../../learnings/LRN-062.md) — pattern diagnostic extrait
- [BDR-070](../../decisions/BDR-070.md) — décision de correction
