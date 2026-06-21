---
id: ZBLK-018
type: blocker
date: 2026-06-21
tags: [color-system, threshold, score, amber, red, ux]
---

# ZBLK-018 — Seuil rouge trop strict : `score ≤ 0` au lieu de `≤ -2`

| Friction                                                                                              | Cause réelle                                                                                                             | Solution                                                                                                  | Statut |
| ----------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------- | ------ |
| Barres rouges dès `score ≤ 0`, rendant la quasi-totalité des heures neutres en rouge dans la timeline | Seuil initial `<= 0` trop bas — `score = 0` représente une situation neutre (ΔT = 0, pas de bonus nuit), pas défavorable | Aligner sur `score <= -2` : rouge pour situations vraiment défavorables, amber pour la zone intermédiaire | résolu |
