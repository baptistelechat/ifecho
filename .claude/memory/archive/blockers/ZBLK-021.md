---
id: ZBLK-021
type: blocker
date: 2026-06-21
tags: [framer-motion, animatepresence, carousel, invisible, variants, initial]
---

# ZBLK-021 — AnimatePresence mode="wait" : card initiale invisible

| Friction                                                                                                  | Cause réelle                                                                                                                           | Solution                                                          | Statut |
| --------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------- | ------ |
| La première card du carousel restait à `opacity: 0, translateX(100%)` après mount — invisible sur la page | AnimatePresence mode="wait" avec custom variants applique la transition de sortie sur la card initialement montée, sans phase d'entrée | Abandon d'AnimatePresence, adoption du pattern CSS flex-translate | résolu |

## Références

- [LRN-023](../../learnings/LRN-023.md) — AnimatePresence mode="wait" applique exit sur mount initial → pattern flex-translate
- [BDR-025](../../decisions/BDR-025.md) — Décision carousel CSS flex-translate
