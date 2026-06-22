---
id: ZBLK-001
type: blocker
date: 2026-06-20
tags: [deadline, scope, 36h, canicule, v0, livraison, vercel]
---

# ZBLK-001 — Deadline 36h — livraison avant lundi 22 juin

| Friction                            | Cause réelle                                         | Solution                                                 | Statut |
| ----------------------------------- | ---------------------------------------------------- | -------------------------------------------------------- | ------ |
| Trop de features, trop peu de temps | Canicule historique ~27 juin 2026 → intérêt éphémère | Scope V0 radical : ventilation + vitrage conseils + .ics | résolu |

La valeur de l'app est liée à la canicule imminente. Si l'app n'est pas en ligne avant que la canicule commence (~27 juin), l'opportunité est ratée. Le scope V0 a été coupé drastiquement lors du brainstorm Rodin du 2026-06-20.

App livrée et fonctionnelle le 2026-06-22 (date limite) : ventilation + conseils + .ics + PWA installable + bouton d'installation.

## Features hors scope V0 (reportées)

| Feature             | Version cible |
| ------------------- | ------------- |
| Humidité intérieure | V2 domotique  |
| Capteurs IoT        | V2            |
| Qualité de l'air    | V2            |
| Illustrations       | V2 design     |
| Notifs push VAPID   | V2            |
| Historique          | V2            |

## Plan 36h acté

Setup (30min) → API + algo (2h) → UX core (3h) → Conseils (1h) → .ics (1h) → PWA (30min) → Polish + déploiement (1h) = **~9h de dev effectif**

## Références

- [BDR-001](../../decisions/BDR-001.md) — Stack Vite pour setup rapide
- [BDR-002](../../decisions/BDR-002.md) — `.ics` au lieu de notifs push (économise ~2h)
- [BDR-003](../../decisions/BDR-003.md) — Humidité intérieure hors scope
